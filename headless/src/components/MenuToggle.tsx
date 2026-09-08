import { useEffect, useRef, useState } from 'react';

const DESKTOP = '(min-width: 1100px)';

/**
 * A disclosure, not a modal. Navigation stays in normal document flow and remains
 * fully usable when JavaScript is off, so no focus trap is needed. The button
 * reveals itself only after the enhancement is confirmed.
 */
export default function MenuToggle() {
  const button = useRef<HTMLButtonElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('primary-navigation');
    if (!nav) return;
    document.documentElement.classList.add('menu-enhanced');
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
      <span>{open ? 'Close' : 'Menu'}</span>
      <span className="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
    </button>
  );
}
