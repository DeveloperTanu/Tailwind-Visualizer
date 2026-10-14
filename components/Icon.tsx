const P: Record<string, string> = {
  menu: 'M4 6h16M4 12h16M4 18h16', close: 'M6 6l12 12M18 6L6 18', plus: 'M12 5v14M5 12h14', up: 'M6 15l6-6 6 6', down: 'M6 9l6 6 6-6',
  sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon: 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z', copy: 'M9 4h10v12H9zM5 8v12h10', dup: 'M8 8h11v11H8zM5 16V5h11',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', edit: 'M4 20h4L19 9l-4-4L4 16z', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  phone: 'M8 3h8v18H8zM11 18h2', tablet: 'M5 3h14v18H5zM11 18h2', desktop: 'M3 5h18v11H3zM8 20h8M12 16v4', reset: 'M4 12a8 8 0 108-8M4 4v5h5',
};
export function Icon({ n }: { n: string }) {
  return <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>;
}
export function IconBtn({ n, label, onClick, on }: { n: string; label: string; onClick: () => void; on?: boolean }) {
  return <button type="button" className="btn" data-on={on} aria-label={label} title={label} onClick={onClick}><Icon n={n} /></button>;
}
