import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary, dictionaryKeys, defaultLanguage } from "../../dictionaries";
import type { Language } from "../../dictionaries";

export default async function NotFound() {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "";
  const lang =
    locale && dictionaryKeys.includes(locale as Language)
      ? (locale as Language)
      : defaultLanguage;
  const dictionary = await getDictionary(lang);

  return (
    <div data-not-found className="relative flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 select-none">
      {/* Tray interior decorations — guide rails along left & right edges */}
      <div className="absolute inset-y-0 left-0 w-6 sm:w-8 pointer-events-none opacity-40">
        {/* Vertical rail groove */}
        <div className="absolute inset-y-4 left-2 sm:left-3 w-[2px] bg-gradient-to-b from-transparent via-printer-ink/10 to-transparent dark:via-printer-ink-dark/10 rounded-full" />
        {/* Rail notches */}
        <div className="absolute inset-y-4 left-[7px] sm:left-[11px] w-[1px] bg-gradient-to-b from-transparent via-printer-ink/5 to-transparent dark:via-printer-ink-dark/5" />
      </div>
      <div className="absolute inset-y-0 right-0 w-6 sm:w-8 pointer-events-none opacity-40">
        <div className="absolute inset-y-4 right-2 sm:right-3 w-[2px] bg-gradient-to-b from-transparent via-printer-ink/10 to-transparent dark:via-printer-ink-dark/10 rounded-full" />
        <div className="absolute inset-y-4 right-[7px] sm:right-[11px] w-[1px] bg-gradient-to-b from-transparent via-printer-ink/5 to-transparent dark:via-printer-ink-dark/5" />
      </div>

      {/* Tray bottom ridge — horizontal groove near bottom */}
      <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-printer-ink/8 to-transparent dark:via-printer-ink-dark/8 pointer-events-none" />
      <div className="absolute bottom-[3px] left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/[0.02] pointer-events-none" />

      {/* Top inset shadow line for recessed depth */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-black/[0.06] to-transparent dark:via-black/20 pointer-events-none" />

      {/* Error status strip */}
      <div className="flex items-center gap-2 mb-8 relative z-10">
        <div className="w-2 h-2 rounded-full bg-printer-accent dark:bg-printer-accent-dark animate-pulse" />
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-printer-accent dark:text-printer-accent-dark">
          {dictionary.labels.notFoundStatus}
        </span>
        <div className="w-2 h-2 rounded-full bg-printer-accent dark:bg-printer-accent-dark animate-pulse" />
      </div>

      {/* Empty paper tray illustration */}
      <div className="relative w-48 h-36 mb-10">
        <svg
          viewBox="0 0 200 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-printer-ink/20 dark:text-printer-ink-dark/20"
        >
          {/* Tray base - 3D perspective */}
          <path
            d="M20 100 L40 130 L160 130 L180 100"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Tray bottom */}
          <path
            d="M40 130 L160 130"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Left wall */}
          <path
            d="M20 55 L20 100 L40 130"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Right wall */}
          <path
            d="M180 55 L180 100 L160 130"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Tray top opening */}
          <path
            d="M20 55 L40 75 L160 75 L180 55"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeDasharray="4 3"
          />
          {/* Paper guide rails */}
          <path
            d="M55 75 L55 125"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="text-printer-ink/10 dark:text-printer-ink-dark/10"
          />
          <path
            d="M145 75 L145 125"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="text-printer-ink/10 dark:text-printer-ink-dark/10"
          />
          {/* Paper position indicator lines (where paper should be) */}
          <path
            d="M60 90 L140 90"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            className="text-printer-ink/8 dark:text-printer-ink-dark/8"
          />
          <path
            d="M55 100 L145 100"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            className="text-printer-ink/8 dark:text-printer-ink-dark/8"
          />
          <path
            d="M50 110 L150 110"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            className="text-printer-ink/8 dark:text-printer-ink-dark/8"
          />
          {/* Tray lip / front edge */}
          <path
            d="M35 130 L35 135 L165 135 L165 130"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Arrow pointing down into tray (insert paper here) */}
          <path
            d="M100 25 L100 48"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-printer-ink/30 dark:text-printer-ink-dark/30 animate-bounce"
            style={{ animationDuration: "2s" }}
          />
          <path
            d="M93 41 L100 50 L107 41"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="text-printer-ink/30 dark:text-printer-ink-dark/30 animate-bounce"
            style={{ animationDuration: "2s" }}
          />
          {/* Small page icon (ghost of missing paper) */}
          <rect
            x="85"
            y="82"
            width="30"
            height="38"
            rx="1"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            className="text-printer-ink/10 dark:text-printer-ink-dark/10"
          />
          <path
            d="M105 82 L115 82 L115 92"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            className="text-printer-ink/10 dark:text-printer-ink-dark/10"
          />
        </svg>
      </div>

      {/* Main heading */}
      <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-printer-ink dark:text-printer-ink-dark mb-3 text-center">
        {dictionary.labels.notFoundTitle}
      </h1>

      {/* Sub text */}
      <p className="font-mono text-[11px] sm:text-xs tracking-wide text-printer-ink-light dark:text-printer-ink-dark/40 text-center max-w-xs mb-8 leading-relaxed">
        {dictionary.labels.notFoundSubtitle}
      </p>

      {/* Separator */}
      <div className="w-32 border-t border-dashed border-printer-ink/10 dark:border-printer-ink-dark/10 mb-8" />

      {/* Print home button */}
      <Link href={`/${lang}`}>
        <button className="printer-btn px-6 h-9 text-[11px] tracking-[0.2em]">
          {dictionary.labels.notFoundButton}
        </button>
      </Link>

      {/* Error code */}
      <div className="mt-10 font-mono text-[8px] tracking-[0.4em] uppercase text-printer-ink/20 dark:text-printer-ink-dark/15">
        {dictionary.labels.notFoundError}
      </div>

      {/* Pull-handle bar at the bottom of the tray */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-16 h-[5px] rounded-full bg-gradient-to-b from-printer-ink/[0.07] to-printer-ink/[0.03] dark:from-printer-ink-dark/[0.10] dark:to-printer-ink-dark/[0.04] border border-printer-ink/[0.06] dark:border-printer-ink-dark/[0.06]" />
        {/* Handle highlight */}
        <div className="absolute inset-x-1 top-[1px] h-[1px] rounded-full bg-white/30 dark:bg-white/[0.03]" />
      </div>
    </div>
  );
}
