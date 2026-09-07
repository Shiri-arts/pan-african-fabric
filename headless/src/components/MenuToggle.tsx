import { useEffect, useRef, useState } from 'react';

/** A disclosure, not a modal: navigation stays available when JavaScript is off. */
export default function MenuToggle() {
  const button = useRef<HTMLButtonElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const navigation = document.getElementById('primary-navigation');
    if (!navigation) return;
    document.documentElement.classList.add('menu-enhanced');
    setEnhanced(true);
    const wide = matchMedia('(min-width: 1100px)');
    const resize = () => {
      if (!wide.matches && navigation.contains(document.activeElement)) button.current?.focus();
      setOpen(false);
    };
    wide.addEventListener('change', resize);
    return () => {
      wide.removeEventListener('change', resize);
      document.documentElement.classList.remove('menu-enhanced');
    };
  }, []);
  useEffect(() => {
    const navigation = document.getElementById('primary-navigation');
    navigation?.classList.toggle('is-open', open);
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  return <button ref={button} id="menu-toggle" className="menu-toggle button button--secondary"
    type="button" aria-controls="primary-navigation" aria-expanded={open} hidden={!enhanced}
    onClick={() => setOpen(value => !value)}>
    <span>Menu</span><span className="menu-icon" aria-hidden="true"><i /><i /></span>
  </button>;
}
