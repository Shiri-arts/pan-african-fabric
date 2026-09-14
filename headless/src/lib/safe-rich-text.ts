import { parseFragment, serialize } from 'parse5';
import type { DefaultTreeAdapterMap } from 'parse5';
import type { CmsRichText } from './cms-content.ts';
import { safePublicUrl } from './cms-content.ts';

type ParentNode = DefaultTreeAdapterMap['parentNode'];
type ChildNode = DefaultTreeAdapterMap['childNode'];
type Element = DefaultTreeAdapterMap['element'];

const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'blockquote', 'h2', 'h3', 'h4', 'a']);
const DROP_WITH_CONTENT = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template', 'form', 'input', 'button']);
const HEADING_MAP = new Map([['h1', 'h2'], ['h5', 'h4'], ['h6', 'h4']]);

function sanitizeChildren(parent: ParentNode): void {
  const output: ChildNode[] = [];
  for (const child of parent.childNodes ?? []) {
    if (child.nodeName === '#text') {
      output.push(child);
      continue;
    }
    if (!('tagName' in child)) continue;
    const element = child as Element;
    const originalTag = element.tagName.toLowerCase();
    if (DROP_WITH_CONTENT.has(originalTag)) continue;

    const mappedTag = HEADING_MAP.get(originalTag) ?? originalTag;
    sanitizeChildren(element);
    if (!ALLOWED_TAGS.has(mappedTag)) {
      output.push(...element.childNodes);
      continue;
    }

    element.tagName = mappedTag;
    element.nodeName = mappedTag;
    if (mappedTag === 'a') {
      const hrefValue = element.attrs.find(attribute => attribute.name.toLowerCase() === 'href')?.value;
      const href = safePublicUrl(hrefValue, { allowRelative: true, allowMailto: true });
      if (!href) {
        output.push(...element.childNodes);
        continue;
      }
      const title = element.attrs.find(attribute => attribute.name.toLowerCase() === 'title')?.value.trim().slice(0, 300);
      const isExternal = href.startsWith('https://');
      element.attrs = [
        { name: 'href', value: href },
        ...(title ? [{ name: 'title', value: title }] : []),
        ...(isExternal ? [{ name: 'target', value: '_blank' }, { name: 'rel', value: 'noopener noreferrer' }] : []),
      ];
    } else {
      element.attrs = [];
    }
    output.push(element);
  }
  parent.childNodes = output;
}

/**
 * Converts Wix CMS RICH_TEXT HTML into a small editorial allowlist. Parse5
 * performs the HTML parsing/escaping; no CMS-provided style, event handler,
 * embedded content or unsupported URL reaches set:html.
 */
export function sanitizeCmsRichText(value: CmsRichText | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const input = value.trim();
  if (!input || input.length > 100_000) return undefined;
  const fragment = parseFragment(input);
  sanitizeChildren(fragment);
  const html = serialize(fragment).trim();
  return html || undefined;
}

export function cmsRichTextPlainText(value: CmsRichText | undefined): string | undefined {
  const html = sanitizeCmsRichText(value);
  if (!html) return undefined;
  const fragment = parseFragment(html);
  const parts: string[] = [];
  const visit = (node: ChildNode | ParentNode): void => {
    if (node.nodeName === '#text' && 'value' in node) {
      parts.push(node.value);
      return;
    }
    if (!('childNodes' in node)) return;
    for (const child of node.childNodes) visit(child);
    if ('tagName' in node && ['p', 'li', 'blockquote', 'h2', 'h3', 'h4'].includes(node.tagName)) parts.push('\n\n');
  };
  visit(fragment);
  const result = parts.join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return result || undefined;
}
