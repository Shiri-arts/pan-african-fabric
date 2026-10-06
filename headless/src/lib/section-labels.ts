/**
 * Numbered section labels.
 *
 * Page sections are labelled "01 — origin" in the CMS. When a section stops being
 * published, or when approved presentation wording differs from the stored record,
 * the number and the wording have to be resolved for display without editing the
 * CMS. These helpers do exactly that and nothing else: they never invent a label,
 * and a section with no stored eyebrow falls back to the value the page supplies.
 */

export interface SectionLabelParts {
  /** Two-digit position, when the label carries one. */
  readonly number?: string;
  /** The label without its leading number. */
  readonly label: string;
}

const NUMBER_PREFIX = /^\s*(\d{1,2})\s*(?:[—–-]|\.|:)\s*/;

/** Splits "06 — process" into its number and its label. */
export function splitSectionLabel(value: string): SectionLabelParts {
  const match = NUMBER_PREFIX.exec(value);
  if (!match) return { label: value.trim() };
  return { number: match[1].padStart(2, '0'), label: value.slice(match[0].length).trim() };
}

/**
 * Capitalises a label that is stored in lower case, so it can be set as a heading
 * rather than as an uppercased micro-label. Labels that already carry their own
 * capitalisation, such as "The twelve colours" or an acronym, are left alone.
 */
export function sectionLabelCase(label: string): string {
  if (!label || label !== label.toLowerCase()) return label;
  return label[0].toUpperCase() + label.slice(1);
}

export interface SectionLabelOptions {
  /** Display position, when the visible order no longer matches the stored number. */
  readonly position?: number;
  /** Approved presentation wording, when it differs from the stored label. */
  readonly label?: string;
}

/** Resolves the number and label a section should display. */
export function resolveSectionLabel(
  value: string | undefined,
  fallback: string,
  options: SectionLabelOptions = {},
): SectionLabelParts {
  const parts = splitSectionLabel(value?.trim() || fallback);
  const label = sectionLabelCase(options.label ?? parts.label);
  const number = options.position === undefined
    ? parts.number
    : String(options.position).padStart(2, '0');
  return number ? { number, label } : { label };
}

/** Renders resolved parts back into a single label, e.g. "01 Origin". */
export function formatSectionLabel(parts: SectionLabelParts): string {
  return parts.number ? `${parts.number} ${parts.label}` : parts.label;
}

/** Convenience wrapper for sections that only need the finished string. */
export function sectionLabel(
  value: string | undefined,
  fallback: string,
  options: SectionLabelOptions = {},
): string {
  return formatSectionLabel(resolveSectionLabel(value, fallback, options));
}
