import { seedRecords } from '../../scripts/cms/approved-content-seed.mjs';
import type { CmsItem, PublicCmsSource, PublicCollectionId, PublicQuery } from './cms-content';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

const previewValue = (value: unknown): unknown => {
  if (!value || typeof value !== 'object' || !('nodes' in value)) return value;
  const text = (value as any).nodes.flatMap((node: any) => node.nodes ?? [])
    .map((node: any) => node.textData?.text ?? '').join('\n');
  return escapeHtml(text);
};

const records = seedRecords.map(record => Object.freeze({
  _id: record.id,
  ...Object.fromEntries(Object.entries(record.data).map(([key, value]) => [key, previewValue(value)])),
})) as readonly CmsItem[];

const matches = (item: CmsItem, filters: PublicQuery['filters']) => Object.entries(filters ?? {})
  .every(([field, value]) => item[field] === value);

export function withPreviewSeed(base: PublicCmsSource): PublicCmsSource {
  return {
    async query(collectionId: PublicCollectionId, options: PublicQuery) {
      const published = await base.query(collectionId, options);
      const preview = records.filter(item => seedRecords.some(record => record.collectionId === collectionId && record.id === item._id));
      const combined = new Map(published.map(item => [item._id, item]));
      for (const item of preview) combined.set(item._id, item);
      return [...combined.values()].filter(item => matches(item, options.filters)).slice(0, options.limit);
    },
    async get(collectionId: PublicCollectionId, itemId: string) {
      const seeded = seedRecords.find(record => record.collectionId === collectionId && record.id === itemId);
      if (seeded) return records.find(item => item._id === itemId);
      return base.get(collectionId, itemId);
    },
  };
}
