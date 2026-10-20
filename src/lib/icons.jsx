// Tracés SVG repris de la maquette (constante ICONS du <script>).
const PATHS = {
  shield: <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" strokeLinejoin="round" />,
  briefcase: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
    </>
  ),
  bank: (
    <>
      <path d="M12 3L3 8h18L12 3z" strokeLinejoin="round" />
      <path d="M5 21h14M6 21V10M10 21V10M14 21V10M18 21V10" strokeLinecap="round" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" />
    </>
  ),
  cap: (
    <>
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" strokeLinejoin="round" />
      <path d="M6 10.5v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5V6a2 2 0 012-2h5v16H6a2 2 0 00-2 2z" strokeLinejoin="round" />
      <path d="M20 19.5V6a2 2 0 00-2-2h-5v16h5a2 2 0 012 2z" strokeLinejoin="round" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z" strokeLinejoin="round" />
      <path d="M15 9a3 3 0 010 6M18 6a7 7 0 010 12" strokeLinecap="round" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
};

export function Icon({ name, strokeWidth = 1.6 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] ?? PATHS.briefcase}
    </svg>
  );
}

// Petites icônes récurrentes de la maquette.
export const ArrowRight = () => (
  <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ChevronDown = () => (
  <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
);
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
);
export const DocIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z" /><path d="M9 12h6M9 16h6" /></svg>
);
export const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
);
