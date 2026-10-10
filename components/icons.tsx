import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** TWIN mark */
export const Mark = (p: P) => (
  <svg viewBox="137 475 1340 759" aria-hidden="true" {...p}>
    <polygon fill="#FF9D2E" points="137,475 1111,475 1477,1234 891,1234 605,642 293,794" />
  </svg>
);

/** 24x24 stroke icon using the site's `.ic` style */
const Ic = ({ children, className = "ic", ...p }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...p}>
    {children}
  </svg>
);

export const IconHome = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10.5 12 5l7 5.5V18a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18z" /></svg>
);
export const IconWork = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7.5" width="17" height="12" rx="3.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17" /></svg>
);
export const IconStory = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19c.8-3.4 3.6-5.2 7-5.2s6.2 1.8 7 5.2" /></svg>
);
export const IconContact = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="4" /><path d="m6 9.5 6 4 6-4" /></svg>
);

export const IconSun = () => <Ic><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></Ic>;
export const IconMoon = () => <Ic><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></Ic>;
export const IconChevronLeft = () => <Ic><path d="M14.5 6l-6 6 6 6" /></Ic>;
export const IconBack = () => <Ic><path d="M19 12H5M11 6l-6 6 6 6" /></Ic>;
export const IconClose = () => <Ic><path d="M6 6l12 12M18 6L6 18" /></Ic>;
export const IconClear = () => <Ic><path d="M7 7l10 10M17 7 7 17" /></Ic>;
export const IconArrowUpRight = () => <Ic><path d="M7 17L17 7M9 7h8v8" /></Ic>;
export const IconPrev = () => <Ic><path d="M15 6l-6 6 6 6" /></Ic>;
export const IconNext = () => <Ic><path d="M9 6l6 6-6 6" /></Ic>;

export const IconFounder = () => (
  <svg className="ic inl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></svg>
);
export const IconFingerprint = () => (
  <svg className="ic inl r" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 17.5V12a6.5 6.5 0 0 1 13 0v2" /><path d="M8.7 19v-7a3.3 3.3 0 0 1 6.6 0v4.5" /><path d="M12 12v8" /></svg>
);

/** Service icons on the home page, by slug */
export const SERVICE_ICONS: Record<string, ReactNode> = {
  branding: <Ic><path d="M12 3l2.4 5.2 5.6.7-4.1 3.9 1 5.6L12 15.6 7.1 18.4l1-5.6L4 8.9l5.6-.7z" /></Ic>,
  debranding: <Ic><circle cx="12" cy="12" r="7" /></Ic>,
  rebranding: <Ic><path d="M20 11a8 8 0 0 0-14-4M4 5v3h3M4 13a8 8 0 0 0 14 4M20 19v-3h-3" /></Ic>,
  logo: <Ic><path d="M5 19L12 5l7 14z" /></Ic>,
};

export const MetaIcons: Record<string, ReactNode> = {
  Timeline: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  Revisions: <path d="M20 11a8 8 0 0 0-14-4M4 5v3h3M4 13a8 8 0 0 0 14 4M20 19v-3h-3" />,
};

export const IconMail = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true" style={{ strokeWidth: 2.26 }}><rect x="3.5" y="5.5" width="17" height="13" rx="4" /><path d="M4.5 7.5l7.5 5.5 7.5-5.5" /></svg>
);
export const IconPin = () => (
  <svg className="ic" viewBox="0.75 0.75 22.5 22.5" aria-hidden="true" style={{ strokeWidth: 2.12 }}><path d="M12 20s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" /><circle cx="12" cy="10" r="2.2" /></svg>
);
export const IconFacebook = () => (
  <svg className="ic" viewBox="-0.5 -0.5 25 25" aria-hidden="true" style={{ strokeWidth: 2.37 }}><path d="M13.6 21v-8.2h2.9l.5-3.4h-3.4V7.3c0-1 .4-1.7 1.8-1.7H17V2.7c-.4 0-1.4-.2-2.6-.2-2.6 0-4.2 1.6-4.2 4.4v2.5H7.3v3.4h2.9V21" /></svg>
);
export const IconInstagram = () => (
  <svg className="ic" viewBox="0.75 0.75 22.5 22.5" aria-hidden="true" style={{ strokeWidth: 2.12 }}><rect x="4" y="4" width="16" height="16" rx="6" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r=".6" /></svg>
);
export const IconX = () => (
  <svg className="ic" viewBox="1.5 1.5 21 21" aria-hidden="true" style={{ strokeWidth: 1.99 }}><path d="M4.5 4.5h3.7l11.3 15h-3.7z" /><path d="M19 4.5l-6.1 6.8M5 19.5l6.2-6.9" /></svg>
);
