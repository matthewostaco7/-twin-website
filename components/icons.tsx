import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** TWIN mark */
export const Mark = (p: P) => (
  <svg viewBox="137 475 1340 759" aria-hidden="true" {...p}>
    <polygon fill="#FF9D2E" points="137,475 1111,475 1477,1234 891,1234 605,642 293,794" />
  </svg>
);

/** 24x24 line icon, drawn with the `.ic` stroke style */
const Ic = ({ children, ...p }: P) => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true" {...p}>{children}</svg>
);

// Hero inline icons
export const IconFounder = () => (
  <svg className="ic inl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></svg>
);
export const IconFingerprint = () => (
  <svg className="ic inl" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 17.5V12a6.5 6.5 0 0 1 13 0v2" /><path d="M8.7 19v-7a3.3 3.3 0 0 1 6.6 0v4.5" /><path d="M12 12v8" /></svg>
);

// Navigation
export const IconHome = () => <Ic><path d="M5 10.5 12 5l7 5.5V18a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18z" /></Ic>;
export const IconWork = () => <Ic><rect x="3.5" y="7.5" width="17" height="12" rx="3.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17" /></Ic>;
export const IconStory = () => <Ic><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19c.8-3.4 3.6-5.2 7-5.2s6.2 1.8 7 5.2" /></Ic>;
export const IconContact = () => <Ic><rect x="3.5" y="6" width="17" height="12" rx="4" /><path d="m6 9.5 6 4 6-4" /></Ic>;

// Controls
export const IconBack = () => <Ic><path d="M19 12H5M11 6l-6 6 6 6" /></Ic>;
export const IconPrev = () => <Ic><path d="M15 6l-6 6 6 6" /></Ic>;
export const IconNext = () => <Ic><path d="M9 6l6 6-6 6" /></Ic>;
export const IconArrow = () => <Ic><path d="M4 12h15M13 6l6 6-6 6" /></Ic>;
