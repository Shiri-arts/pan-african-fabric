/**
 * Events.
 *
 * The inaugural showcase is client-provided frontend content: title, date, time,
 * venue and location exactly as supplied. Nothing else about it is known here.
 * No Community Day framing, partner or sponsorship status, programme, participants,
 * ticketing, price, registration, timezone, official URL, institutional logo or
 * endorsement may be added without separate approval.
 *
 * No timezone has been confirmed, so no live countdown is implemented and the
 * structured-data start/end times are written as local wall-clock values without
 * an offset rather than guessing one.
 */
import type { Media } from '../lib/media';
import { mediaSlot } from '../lib/media';

export type EventKind = 'showcase' | 'exhibition' | 'workshop' | 'competition' | 'reception' | 'talk' | 'travelling';
export type EventPhase = 'upcoming' | 'today' | 'archive';

export interface EventRecord {
  readonly slug: string;
  readonly kind: EventKind;
  readonly title: string;
  /** Exactly as supplied, e.g. "Saturday, September 26, 2026". */
  readonly dateLabel: string;
  /** ISO calendar date used only for ordering and phase, never displayed raw. */
  readonly isoDate: string;
  /** Exactly as supplied, e.g. "1:00 PM-5:00 PM". Null when no time is confirmed. */
  readonly timeLabel: string | null;
  /** Local wall-clock ISO times with no offset. Null when not supplied. */
  readonly startsAtLocal: string | null;
  readonly endsAtLocal: string | null;
  readonly venue: string;
  readonly location: string;
  readonly hero: Media;
  /** Approved public URL. Null until the destination is verified. */
  readonly officialUrl: null;
  readonly isConfirmed: boolean;
}

export const inauguralShowcase: EventRecord = {
  slug: 'inaugural-pan-african-fabric-fashion-showcase',
  kind: 'showcase',
  title: 'The Inaugural Pan-African Fabric & Fashion Showcase',
  dateLabel: 'Saturday, September 26, 2026',
  isoDate: '2026-09-26',
  timeLabel: '1:00 PM–5:00 PM',
  startsAtLocal: '2026-09-26T13:00',
  endsAtLocal: '2026-09-26T17:00',
  venue: 'Smithsonian National Museum of African Art',
  location: 'Washington, D.C.',
  hero: mediaSlot(
    'event-inaugural-hero',
    '3/2',
    'Approved showcase photography or an approved poster artwork, with alt text, focal point, credit and reuse permission.',
  ),
  officialUrl: null,
  isConfirmed: true,
};

/**
 * Only confirmed events appear. Upcoming and archive groups are intentionally
 * otherwise empty: fabricating additional events to fill a layout is prohibited.
 */
export const events: readonly EventRecord[] = [inauguralShowcase];

export const eventPath = (slug: string): string => `/events/${slug}`;

export function findEvent(slug: string | undefined): EventRecord | undefined {
  return events.find((event) => event.slug === slug);
}

/**
 * Phase from the calendar date alone. With no confirmed timezone, an event is
 * treated as current for the whole of its local calendar day and archived from
 * the following day. This drives the archive layout without asserting any
 * attendance, outcome, press response or programme detail.
 */
export function eventPhase(event: EventRecord, now: Date = new Date()): EventPhase {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (event.isoDate > today) return 'upcoming';
  if (event.isoDate === today) return 'today';
  return 'archive';
}

export interface EventGroups {
  readonly featured: EventRecord | undefined;
  readonly upcoming: readonly EventRecord[];
  readonly archive: readonly EventRecord[];
}

export function groupEvents(now: Date = new Date()): EventGroups {
  const live = events.filter((event) => eventPhase(event, now) !== 'archive');
  const archive = events.filter((event) => eventPhase(event, now) === 'archive');
  const ordered = [...live].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  return {
    featured: ordered[0] ?? [...archive].sort((a, b) => b.isoDate.localeCompare(a.isoDate))[0],
    upcoming: ordered.slice(1),
    archive: [...archive].sort((a, b) => b.isoDate.localeCompare(a.isoDate)),
  };
}

/** Split a supplied date label into poster parts without reformatting the words. */
export function posterDate(event: EventRecord): { readonly weekday: string; readonly day: string; readonly month: string; readonly year: string } {
  const [weekday = '', rest = ''] = event.dateLabel.split(',').map((part) => part.trim());
  const [month = '', day = ''] = rest.split(' ');
  const year = event.dateLabel.split(',').at(-1)?.trim() ?? '';
  return { weekday, day: day.replace(/\D/g, ''), month, year };
}

/**
 * schema.org Event built strictly from supplied fields. Timezone, offers,
 * organizer, image, url and attendance mode are omitted rather than guessed.
 */
export function eventStructuredData(event: EventRecord): Record<string, unknown> | undefined {
  if (!event.isConfirmed || !event.startsAtLocal) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAtLocal,
    ...(event.endsAtLocal ? { endDate: event.endsAtLocal } : {}),
    location: { '@type': 'Place', name: event.venue, address: event.location },
  };
}
