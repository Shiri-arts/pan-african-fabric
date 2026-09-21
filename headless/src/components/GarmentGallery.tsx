import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';

export interface GarmentGalleryImage {
  readonly src: string;
  readonly srcset?: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly title?: string;
  readonly caption?: string;
  readonly creditLine?: string;
}

interface Props {
  readonly images: readonly GarmentGalleryImage[];
}

const SWIPE_THRESHOLD_PX = 40;

/**
 * One prominent image at a time, not a grid of cards. Sized and boxed
 * identically regardless of which photo is active (object-fit: contain, fixed
 * aspect-ratio) so the surrounding page never reflows as visitors browse.
 * With a single image, this renders as a plain figure — no arrows, no dots,
 * nothing to operate.
 */
export default function GarmentGallery({ images }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  if (total === 0) return null;

  const active = images[index];

  if (total === 1) {
    return (
      <figure className="garment-gallery garment-gallery--single">
        <div className="garment-gallery__frame">
          <img
            src={active.src}
            srcSet={active.srcset}
            width={active.width}
            height={active.height}
            alt={active.alt}
            loading="lazy"
          />
        </div>
        {(active.caption || active.creditLine) && (
          <figcaption className="garment-gallery__caption">
            {active.title && <span className="garment-gallery__title">{active.title}</span>}
            {active.caption && <span>{active.caption}</span>}
            {active.creditLine && <span className="garment-gallery__credit">{active.creditLine}</span>}
          </figcaption>
        )}
      </figure>
    );
  }

  const go = (next: number) => setIndex(((next % total) + total) % total);
  const previous = () => go(index - 1);
  const next = () => go(index + 1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
  };
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => { touchStartX.current = event.touches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX == null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? startX) - startX;
    if (deltaX > SWIPE_THRESHOLD_PX) previous();
    else if (deltaX < -SWIPE_THRESHOLD_PX) next();
  };

  return (
    <div
      className="garment-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label={active.title ? `Garment gallery: ${active.title}` : 'Garment gallery'}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="garment-gallery__frame">
        <img
          key={active.src}
          src={active.src}
          srcSet={active.srcset}
          width={active.width}
          height={active.height}
          alt={active.alt}
          loading="lazy"
        />
        <button type="button" className="garment-gallery__control garment-gallery__control--prev" onClick={previous} aria-label="Previous garment image">
          <span aria-hidden="true">&#8592;</span>
        </button>
        <button type="button" className="garment-gallery__control garment-gallery__control--next" onClick={next} aria-label="Next garment image">
          <span aria-hidden="true">&#8594;</span>
        </button>
        <p className="garment-gallery__position" aria-live="polite">{index + 1} of {total}</p>
      </div>

      {(active.title || active.caption || active.creditLine) && (
        <figcaption className="garment-gallery__caption">
          {active.title && <span className="garment-gallery__title">{active.title}</span>}
          {active.caption && <span>{active.caption}</span>}
          {active.creditLine && <span className="garment-gallery__credit">{active.creditLine}</span>}
        </figcaption>
      )}

      <ul className="garment-gallery__thumbs">
        {images.map((image, thumbIndex) => (
          <li key={image.src}>
            <button
              type="button"
              className={thumbIndex === index ? 'is-active' : undefined}
              onClick={() => go(thumbIndex)}
              aria-label={`Show image ${thumbIndex + 1} of ${total}${image.title ? `: ${image.title}` : ''}`}
              aria-current={thumbIndex === index}
            >
              <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}