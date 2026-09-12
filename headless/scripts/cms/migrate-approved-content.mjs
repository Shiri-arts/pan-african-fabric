import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  HEADLESS_SITE_ID,
  assertAllowedSite,
  existingPublishedDependencies,
  seedCollections,
  seedRecords,
  validateSeedManifest,
} from './approved-content-seed.mjs';

const DRAFT_STATUS = 'DRAFT';
const MUTABLE_TECHNICAL_FIELDS = new Set(['sourceVersion']);

export function parseArguments(argv) {
  const options = { apply: false, siteId: undefined, confirmDraftWrite: false, pretty: false };
  let sawApply = false;
  let sawDryRun = false;
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--apply') {
      sawApply = true;
      options.apply = true;
    }
    else if (value === '--dry-run') {
      sawDryRun = true;
      options.apply = false;
    }
    else if (value === '--confirm-draft-write') options.confirmDraftWrite = true;
    else if (value === '--pretty') options.pretty = true;
    else if (value === '--site') {
      options.siteId = argv[++index];
      if (!options.siteId || options.siteId.startsWith('--')) throw new Error('--site requires an explicit site ID.');
    }
    else if (value.startsWith('--site=')) options.siteId = value.slice('--site='.length);
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (sawApply && sawDryRun) throw new Error('--apply and --dry-run are mutually exclusive.');
  if (options.apply && !options.confirmDraftWrite) {
    throw new Error('Applying requires --confirm-draft-write. The command only creates or updates drafts.');
  }
  if (options.apply && !options.siteId) {
    throw new Error('Applying requires an explicit --site value.');
  }
  return options;
}

function isBlank(value) {
  return value === undefined || value === null || value === '';
}

function sameValue(left, right) {
  if (typeof left === 'string' && typeof right === 'string'
    && /^\d{4}-\d{2}-\d{2}T/.test(left) && /^\d{4}-\d{2}-\d{2}T/.test(right)) {
    const leftInstant = Date.parse(left);
    const rightInstant = Date.parse(right);
    if (Number.isFinite(leftInstant) && Number.isFinite(rightInstant)) return leftInstant === rightInstant;
  }
  return JSON.stringify(left) === JSON.stringify(right);
}

/**
 * Merge without overwriting existing editorial values. A differing approved
 * fact is a conflict and aborts the whole preflight before the first write.
 */
export function prepareDraftData(item, currentData = {}, allowedFields = Object.keys(item.data)) {
  const allowed = new Set(allowedFields);
  const data = Object.fromEntries(Object.entries(currentData).filter(([key]) => allowed.has(key)));
  const conflicts = [];
  for (const [key, value] of Object.entries(item.data)) {
    if (!allowed.has(key)) throw new Error(`Schema does not allow ${item.collectionId}.${key}.`);
    const current = currentData[key];
    if (isBlank(current) || sameValue(current, value)) data[key] = value;
    else if (MUTABLE_TECHNICAL_FIELDS.has(key)) data[key] = current;
    else conflicts.push({ field: key, current, proposed: value });
  }
  return { data, conflicts };
}

async function loadConfiguration() {
  return JSON.parse(await readFile(new URL('../../wix.config.json', import.meta.url), 'utf8'));
}

function siteToken(siteId) {
  const supplied = process.env.WIX_CMS_ADMIN_TOKEN?.trim();
  if (supplied) return supplied;
  const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(cli, ['wix', 'token', '--site', siteId], {
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    encoding: 'utf8',
    windowsHide: true,
    shell: process.platform === 'win32',
  });
  assert.equal(result.status, 0, result.error?.message || result.stderr || 'Wix CLI authentication failed.');
  assert.ok(result.stdout.trim(), 'Wix CLI returned no site token.');
  return result.stdout.trim();
}

function createApi(token, siteId) {
  return async function api(path, { method = 'GET', body } = {}) {
    const response = await fetch(`https://www.wixapis.com${path}`, {
      method,
      redirect: 'error',
      signal: AbortSignal.timeout(45_000),
      headers: {
        Authorization: `Bearer ${token}`,
        'wix-site-id': siteId,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const upstreamMessage = typeof data.message === 'string' ? data.message.slice(0, 300) : undefined;
      const upstreamCode = typeof data.details?.applicationError?.code === 'string' ? data.details.applicationError.code.slice(0, 100) : undefined;
      const context = [upstreamCode, upstreamMessage].filter(Boolean).join(': ');
      const error = new Error(`Wix API ${method} ${path} failed (${response.status})${context ? `: ${context}` : '.'}`);
      error.status = response.status;
      error.details = data;
      throw error;
    }
    return data;
  };
}

async function getItem(api, collectionId, id) {
  try {
    const result = await api(`/wix-data/v2/items/${encodeURIComponent(id)}?dataCollectionId=${encodeURIComponent(collectionId)}&consistentRead=true`);
    return result.dataItem;
  } catch (error) {
    if (error.status === 404) return undefined;
    throw error;
  }
}

async function getDraftInclusiveItem(api, collectionId, id) {
  const result = await api('/wix-data/v2/items/query', {
    method: 'POST',
    body: {
      dataCollectionId: collectionId,
      query: { filter: { _id: id }, paging: { limit: 1 } },
      consistentRead: true,
      publishPluginOptions: { includeDraftItems: true },
    },
  });
  return result.dataItems?.[0];
}

function collectionFromResponse(response) {
  return response.collection ?? response.dataCollection;
}

function assertDraftCollection(collection, collectionId) {
  assert.equal(collection?.id, collectionId, `Wix returned the wrong schema for ${collectionId}.`);
  const draftPlugin = collection.plugins?.find(plugin => plugin.type === 'PUBLISH');
  assert.ok(draftPlugin, `${collectionId} has no draft/publish plugin.`);
  assert.equal(draftPlugin.publishOptions?.defaultStatus, DRAFT_STATUS, `${collectionId} does not default new records to drafts.`);
  assert.equal(collection.permissions?.insert, 'ADMIN', `${collectionId} insert permission is not ADMIN.`);
  assert.equal(collection.permissions?.update, 'ADMIN', `${collectionId} update permission is not ADMIN.`);
  assert.equal(collection.permissions?.remove, 'ADMIN', `${collectionId} remove permission is not ADMIN.`);
}

export function dryRunReport(siteId = HEADLESS_SITE_ID) {
  assertAllowedSite(siteId);
  validateSeedManifest();
  return {
    mode: 'dry-run',
    siteId,
    writesPerformed: 0,
    publicationOperations: 0,
    recordCount: seedRecords.length,
    collections: seedCollections,
    publishedDependencies: existingPublishedDependencies,
    records: seedRecords.map(({ collectionId, id, classification, approvalSource, data }) => ({
      collectionId,
      id,
      classification,
      approvalSource,
      draftCollectionId: `${collectionId}__drafts`,
      draftData: data,
    })),
  };
}

async function applyDraftSeed(siteId) {
  const token = siteToken(siteId);
  const api = createApi(token, siteId);
  const schemas = new Map();

  for (const collectionId of seedCollections) {
    const response = await api(`/wix-data/v2/collections/${encodeURIComponent(collectionId)}?consistentRead=true`);
    const collection = collectionFromResponse(response);
    assertDraftCollection(collection, collectionId);
    schemas.set(collectionId, new Set(collection.fields?.map(field => field.key)));
  }

  for (const dependency of existingPublishedDependencies) {
    const found = await getItem(api, dependency.collectionId, dependency.id);
    assert.ok(found, `Required published dependency is missing: ${dependency.collectionId}/${dependency.id}.`);
  }

  // Complete the entire conflict and schema preflight before the first mutation.
  const operations = [];
  const skippedPublished = [];
  for (const item of seedRecords) {
    const published = await getItem(api, item.collectionId, item.id);
    const inclusive = await getDraftInclusiveItem(api, item.collectionId, item.id);
    const draft = inclusive?.data?._publishStatus === DRAFT_STATUS ? inclusive : undefined;
    const current = draft ?? published;
    const allowedFields = schemas.get(item.collectionId);
    const prepared = prepareDraftData(item, current?.data, allowedFields);
    if (prepared.conflicts.length) {
      throw new Error(`Seed conflict for ${item.collectionId}/${item.id}: ${JSON.stringify(prepared.conflicts)}. Resolve it in Wix instead of overwriting editorial content.`);
    }
    if (published && !draft) {
      skippedPublished.push({
        collectionId: item.collectionId,
        id: item.id,
        reason: 'This Wix project cannot create an unpublished revision through its enabled publish-plugin API. Edit this published record in the Wix dashboard.',
      });
      continue;
    }
    operations.push({ item, draftBefore: draft, publishedBefore: published, data: prepared.data });
  }

  const results = [];
  for (const operation of operations) {
    const { item, draftBefore, publishedBefore, data } = operation;
    const updatingDraft = Boolean(draftBefore || publishedBefore);
    const saved = await api(updatingDraft ? `/wix-data/v2/items/${encodeURIComponent(item.id)}` : '/wix-data/v2/items', {
      method: updatingDraft ? 'PUT' : 'POST',
      body: {
        dataCollectionId: item.collectionId,
        dataItem: { id: item.id, data },
        ...(updatingDraft ? { publishPluginOptions: { includeDraftItems: true } } : {}),
      },
    });
    assert.equal(saved.dataItem?.id, item.id, `Unexpected saved draft identity: ${item.collectionId}/${item.id}.`);
    const draft = await getDraftInclusiveItem(api, item.collectionId, item.id);
    assert.ok(draft, `Draft verification failed for ${item.collectionId}/${item.id}.`);
    assert.equal(draft.data?._publishStatus, DRAFT_STATUS, `Wrong publication state for ${item.collectionId}/${item.id}.`);
    for (const [key, value] of Object.entries(item.data)) {
      if (MUTABLE_TECHNICAL_FIELDS.has(key) && !isBlank(draft.data?.[key])) continue;
      assert.ok(sameValue(draft.data?.[key], value), `Draft verification mismatch for ${item.collectionId}/${item.id}.${key}.`);
    }

    const publishedAfter = await getItem(api, item.collectionId, item.id);
    assert.deepEqual(publishedAfter?.data, publishedBefore?.data, `Published content changed while saving ${item.collectionId}/${item.id}.`);
    results.push({ collectionId: item.collectionId, id: item.id, state: DRAFT_STATUS });
  }

  return {
    mode: 'apply-drafts',
    siteId,
    writesPerformed: results.length,
    publicationOperations: 0,
    records: results,
    skippedPublished,
  };
}

export async function run(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  const configuration = await loadConfiguration();
  const siteId = options.siteId ?? configuration.siteId;
  assertAllowedSite(siteId);
  assert.equal(configuration.siteId, HEADLESS_SITE_ID, 'headless/wix.config.json is not bound to the approved Headless site.');
  if (!options.apply) return dryRunReport(siteId);
  return applyDraftSeed(siteId);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    const options = parseArguments(process.argv.slice(2));
    const report = await run(process.argv.slice(2));
    console.log(JSON.stringify(report, null, options.pretty ? 2 : 0));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
