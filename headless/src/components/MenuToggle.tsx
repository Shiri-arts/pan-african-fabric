import { useEffect, useRef, useState } from 'react';

const DESKTOP = '(min-width: 1100px)';

/**
 * A disclosure, not a modal. Navigation stays in normal document flow and remains
 * fully usable when JavaScript is off, so no focus trap is needed. The button
 * reveals itself only after the enhancement is confirmed.
 */
export default function MenuToggle() {
  const button = useRef<HTMLButtonElement>(null);
  // The header marks the enhancement before paint, so the button starts visible
  // here too and hydration does not hide it again for a frame.
  const [enhanced, setEnhanced] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('menu-enhanced'));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('primary-navigation');
    if (!nav) return;
    document.documentElement.classList.add('menu-enhanced');
    // Stands the header's pre-hydration fallback down; this component owns the
    // button from here.
    document.documentElement.classList.add('menu-hydrated');
    setEnhanced(true);
    const wide = matchMedia(DESKTOP);
    const onChange = () => {
      if (!wide.matches && nav.contains(document.activeElement)) button.current?.focus();
      setOpen(false);
    };
    wide.addEventListener('change', onChange);
    return () => {
      wide.removeEventListener('change', onChange);
      document.documentElement.classList.remove('menu-enhanced');
      document.documentElement.classList.remove('menu-hydrated');
    };
  }, []);

  useEffect(() => {
    const nav = document.getElementById('primary-navigation');
    nav?.classList.toggle('is-open', open);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <button
      ref={button}
      id="menu-toggle"
      className="menu-toggle"
      type="button"
      aria-controls="primary-navigation"
      aria-expanded={open}
      hidden={!enhanced}
      onClick={() => setOpen((value) => !value)}
    >
      <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
      <span className="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
    </button>
  );
}
