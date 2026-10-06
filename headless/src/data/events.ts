/**
 * Events.
 *
 * The inaugural showcase is client-provided frontend content: title, date, time,
 * venue and location exactly as supplied. Nothing else about it is known here.
 * No Community Day framing, partner or sponsorship status, programme, participants,
 * ticketing, price, registration, timezone, official URL, institutional logo or
 * endorsement may be added without separate approval.
 *
 * The client confirmed on 8 September 2026 that the showcase runs on US Eastern
 * time. 26 September 2026 falls inside US daylight time, so the offset is EDT,
 * UTC-04:00. `startsAt` and `endsAt` therefore carry a real instant and every
 * viewer counts down to the same moment.
 *
 * An event whose timezone is not confirmed leaves those fields null and falls back
 * to calendar-date comparison. It gets no countdown.
 */
import type { Media } from '../lib/media';
import { mediaSlot } from '../lib/media';

export type EventKind = 'showcase' | 'exhibition' | 'workshop' | 'competition' | 'reception' | 'talk' | 'travelling';
export type EventPhase = 'upcoming' | 'live' | 'archive';

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
  /** Short zone label shown beside the time. Null until the zone is confirmed. */
  readonly timezoneLabel: string | null;
  /**
   * Exact instants, offset included. Null until the timezone is confirmed, which
   * is what gates the countdown.
   */
  readonly startsAt: string | null;
  readonly endsAt: string | null;
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
  timezoneLabel: 'ET',
  startsAt: '2026-09-26T13:00:00-04:00',
  endsAt: '2026-09-26T17:00:00-04:00',
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
 * Phase from the exact instants when the timezone is confirmed, and from the
 * calendar date alone when it is not. An event is archived the moment it ends.
 */
export function eventPhase(event: EventRecord, now: Date = new Date()): EventPhase {
  if (event.startsAt && event.endsAt) {
    const time = now.getTime();
    if (time >= Date.parse(event.endsAt)) return 'archive';
    if (time >= Date.parse(event.startsAt)) return 'live';
    return 'upcoming';
  }
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (event.isoDate > today) return 'upcoming';
  if (event.isoDate === today) return 'live';
  return 'archive';
}

/**
 * The nearest event that has not finished. This is what the homepage countdown
 * follows, so adding a sooner event moves the bar to it automatically and the bar
 * disappears on its own once nothing is upcoming.
 */
export function nextEvent(now: Date = new Date()): EventRecord | undefined {
  return events
    .filter((event) => eventPhase(event, now) !== 'archive')
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))[0];
}

/** Only an event with a confirmed timezone may drive a countdown. */
export function canCountDown(event: EventRecord): boolean {
  return Boolean(event.startsAt && event.endsAt);
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
  if (!event.isConfirmed || !event.startsAt) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    location: { '@type': 'Place', name: event.venue, address: event.location },
  };
}
