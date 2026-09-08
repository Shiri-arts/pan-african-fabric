/**
 * Editorial content status.
 *
 * Every string that reaches a page carries a provenance. `approved` copy is
 * client-supplied or structural and may render in any build. `draft` copy comes
 * from the Phase 1 copy deck and has not been approved for publication: it is
 * shown only in the local review build, always labelled, and is replaced by a
 * designed awaiting state in production builds. `awaiting` marks a slot whose
 * source material has not been supplied at all.
 *
 * Nothing here may be invented. A missing fact is an `awaiting` slot, never a
 * plausible sentence.
 */
export type ContentStatus = 'approved' | 'draft' | 'awaiting';

export interface ApprovedCopy {
  readonly status: 'approved';
  readonly text: string;
}

export interface DraftCopy {
  readonly status: 'draft';
  readonly text: string;
  /** Who must sign this off, shown only in the review build. */
  readonly owner?: string;
}

export interface AwaitingCopy {
  readonly status: 'awaiting';
  /** Short public label, e.g. "Founder biography". Never invented prose. */
  readonly label: string;
  /** What the client must supply. Review build only. */
  readonly needs?: string;
  readonly owner?: string;
}

export type Copy = ApprovedCopy | DraftCopy | AwaitingCopy;

export const approved = (text: string): ApprovedCopy => ({ status: 'approved', text });
export const draft = (text: string, owner?: string): DraftCopy => ({ status: 'draft', text, owner });
export const awaiting = (label: string, needs?: string, owner?: string): AwaitingCopy =>
  ({ status: 'awaiting', label, needs, owner });

/** True only in the local review build. Statically folded away in production. */
export const REVIEW_BUILD: boolean = import.meta.env.DEV;

/**
 * What a given build is allowed to render for one slot.
 * Production never receives draft text — the branch is removed at build time.
 */
export function resolveCopy(copy: Copy): { render: 'text'; text: string; marked: boolean } | { render: 'awaiting'; label: string; needs?: string } {
  if (copy.status === 'approved') return { render: 'text', text: copy.text, marked: false };
  if (copy.status === 'draft') {
    if (import.meta.env.DEV) return { render: 'text', text: copy.text, marked: true };
    return { render: 'awaiting', label: 'Copy awaiting approval' };
  }
  return { render: 'awaiting', label: copy.label, needs: import.meta.env.DEV ? copy.needs : undefined };
}

/** Availability of a whole record, used for cards and index states. */
export type RecordAvailability = 'published' | 'in-review' | 'awaiting-content';

export const availabilityLabel: Record<RecordAvailability, string> = {
  published: 'Available',
  'in-review': 'In review',
  'awaiting-content': 'Awaiting content',
};
