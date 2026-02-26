"use client";

import Link from "next/link";
import Image from "next/image";
import avatar from "../public/static/avatar.webp";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { 
  Monitor as ComputerDesktopIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
} from "lucide-react";

/**
 * Generate random keyframes that simulate a subtle printer paper-jam stutter.
 * Only the top portion of the paper slides in (small fixed px offset),
 * with minor speed variations to hint at the mechanical feel.
 */
const FEED_PX = 60; // how many pixels the paper slides down

function generatePaperFeedKeyframes(): { offset: number; transform: string; easing: string }[] {
  const keyframes: { offset: number; transform: string; easing: string }[] = [];

  // Start: paper shifted up by FEED_PX
  keyframes.push({ offset: 0, transform: `translateY(-${FEED_PX}px)`, easing: "ease-out" });

  // 2-3 subtle stutter points
  const stutterCount = 2 + Math.floor(Math.random() * 2);
  const offsets: number[] = [];
  for (let i = 0; i < stutterCount; i++) {
    offsets.push(0.15 + Math.random() * 0.6);
  }
  offsets.sort((a, b) => a - b);

  for (const offset of offsets) {
    const linearPx = FEED_PX * (1 - offset); // remaining distance
    const jitter = (Math.random() - 0.4) * 8; // small random deviation
    const y = -Math.max(0, Math.min(FEED_PX, linearPx + jitter));
    const easings = ["ease-in", "ease-out", "ease-in-out", "linear"];
    const easing = easings[Math.floor(Math.random() * easings.length)];
    keyframes.push({ offset, transform: `translateY(${y}px)`, easing });
  }

  // End: paper at rest
  keyframes.push({ offset: 1, transform: "translateY(0px)", easing: "ease-out" });

  return keyframes;
}

/**
 * Compute a negative animation-delay so a CSS animation stays in sync with
 * wall-clock time across re-mounts (prevents the indicator light from
 * visually resetting every time the component re-renders).
 */
function useSyncedAnimationDelay(durationMs: number) {
  const [delay, setDelay] = useState("0ms");

  useEffect(() => {
    const elapsed = Date.now() % durationMs;
    setDelay(`-${elapsed}ms`);
  }, [durationMs]);

  return delay;
}

/**
 * Hook: animate the paper element on every pathname change.
 * On a language switch the entire component tree remounts (because <html lang>
 * changes), so prevPathRef would be initialised to the CURRENT pathname and the
 * "skip initial mount" guard would swallow the animation.  We use a sessionStorage
 * flag written just before navigation to detect this case.
 */
const LANG_SWITCH_KEY = '__printer_lang_switch__';

function usePaperFeedAnimation() {
  const pathname = usePathname();
  const paperRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);
  const isLangSwitch = useRef(false);

  // On mount, check if we arrived via a language switch
  useEffect(() => {
    try {
      if (sessionStorage.getItem(LANG_SWITCH_KEY)) {
        isLangSwitch.current = true;
        sessionStorage.removeItem(LANG_SWITCH_KEY);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;

    // Skip animation on true initial page load (not a language switch remount)
    if (prevPathRef.current === pathname && !isLangSwitch.current) return;
    prevPathRef.current = pathname;
    isLangSwitch.current = false;

    const kf = generatePaperFeedKeyframes();
    const duration = 350 + Math.random() * 200; // 350-550ms, snappy

    const animation = el.animate(
      kf.map(({ offset, transform }) => ({ offset, transform })),
      {
        duration,
        easing: "linear",
        fill: "backwards",
      },
    );

    return () => animation.cancel();
  }, [pathname]);

  return paperRef;
}
type ColorMode = "system" | "light" | "dark";

function useColorMode() {
  const [mode, setMode] = useState<ColorMode>("system");

  useEffect(() => {
    const stored = localStorage.getItem("color-mode") as ColorMode | null;
    if (stored) {
      setMode(stored);
    }
  }, []);

  const apply = useCallback((m: ColorMode) => {
    const root = document.documentElement;
    if (m === "dark") {
      root.classList.add("dark");
    } else if (m === "light") {
      root.classList.remove("dark");
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    apply(mode);

    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [mode, apply]);

  const cycle = useCallback(() => {
    setMode((prev) => {
      const next: ColorMode =
        prev === "system" ? "light" : prev === "light" ? "dark" : "system";
      localStorage.setItem("color-mode", next);
      const root = document.documentElement;
      if (next === "dark") {
        root.classList.add("dark");
      } else if (next === "light") {
        root.classList.remove("dark");
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
      return next;
    });
  }, []);

  return { mode, cycle };
}

const ColorModeIcon = ({ mode }: { mode: ColorMode }) => {
  switch (mode) {
    case "light": return <SunIcon className="w-3.5 h-3.5" />;
    case "dark": return <MoonIcon className="w-3.5 h-3.5" />;
    default: return <ComputerDesktopIcon className="w-3.5 h-3.5" />;
  }
};

interface PrinterShellProps {
  dictionary: {
    labels: {
      home: string;
      posts: string;
      life: string;
      works: string;
      about: string;
      brandName: string;
      brandTagline: string;
    };
    urls: {
      home: string;
      posts: string;
      life: string;
      works: string;
      about: string;
    };
  };
  children: React.ReactNode;
  lang: string;
}

export default function PrinterShell({
  dictionary,
  children,
  lang,
}: PrinterShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, cycle } = useColorMode();
  const paperRef = usePaperFeedAnimation();
  const indicatorDelay = useSyncedAnimationDelay(2000);

  const navItems = [
    { label: dictionary.labels.home, href: dictionary.urls.home },
    { label: dictionary.labels.life, href: dictionary.urls.life },
    { label: dictionary.labels.posts, href: dictionary.urls.posts },
    { label: dictionary.labels.works, href: dictionary.urls.works },
    { label: dictionary.labels.about, href: dictionary.urls.about },
  ];

  function isActive(href: string) {
    if (href === dictionary.urls.home) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  function switchLanguage() {
    const otherLang = lang === "en" ? "zh" : "en";
    const newPath = pathname.replace(`/${lang}`, `/${otherLang}`);
    try { sessionStorage.setItem(LANG_SWITCH_KEY, '1'); } catch {}
    router.push(newPath);
  }

  return (
    <div className="min-h-screen page-grid flex flex-col items-center px-3 py-6 sm:py-10">
      {/* Printer Body */}
      <div className="w-full max-w-3xl">
        {/* Unified Header Housing - Wraps both brand and slit areas to share a single shadow */}
        <div className="printer-header-border dark:border dark:border-white/[0.06] rounded-t-[2.5rem] rounded-b-sm overflow-hidden relative z-10">
          
          {/* Dark mode ambient glow — soft top light spill */}
          <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(100,120,255,0.07)_0%,rgba(80,100,220,0.03)_40%,transparent_70%)]" />
          </div>

          {/* Top part - Brand & Nav */}
          <div className="bg-printer-body dark:bg-printer-body-dark px-6 pt-6 pb-5 sm:px-10 sm:pt-10 relative">
            {/* Brand plate */}
            <div className="relative flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-black/5 dark:bg-white/[0.08] shadow-inner" />
                  <Image
                    className="h-8 w-8 rounded-full ring-1 ring-black/10 dark:ring-white/[0.15] shadow-sm dark:shadow-[0_0_12px_rgba(100,120,255,0.1)] relative z-10"
                    src={avatar}
                    alt="Nooc"
                    priority
                  />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold tracking-[0.25em] text-printer-ink dark:text-printer-ink-dark uppercase">
                    {dictionary.labels.brandName}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.1em] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase mt-0.5">
                    {dictionary.labels.brandTagline}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative w-3.5 h-3.5 rounded-full bg-black/10 dark:bg-black/40 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.6),inset_0_-1px_2px_rgba(0,0,0,0.3)] animate-[pulse_2s_infinite]" style={{ animationDelay: indicatorDelay }} />
                    <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/5 shadow-inner pointer-events-none" />
                  </div>
                  <span className="font-mono text-[8px] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase tracking-widest leading-none">
                    ON
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation row */}
            <div className="relative mt-2 p-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] dark:border dark:border-white/[0.04] flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
              <nav className="relative flex items-center gap-2 sm:gap-2.5 overflow-x-auto px-1 flex-1 w-full no-scrollbar py-0.5">
                {navItems.map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={index} href={item.href}>
                      <button
                        className={classNames("printer-btn whitespace-nowrap btn-enter", { "active": active })}
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <span className="leading-none">{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>
              <div className="sm:hidden mx-1 h-[1px] bg-black/10 dark:bg-white/10" />
              <div className="flex items-center justify-end gap-1 shrink-0 px-1 pb-0.5 sm:px-0 sm:pr-1 sm:py-0.5">
                <div className="hidden sm:block w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-0.5" />
                <button onClick={switchLanguage} className="printer-btn printer-btn-circle btn-enter" style={{ animationDelay: `${(navItems.length + 1) * 40}ms` }} title={lang === "en" ? "切换到中文" : "Switch to English"}>
                  <span className="leading-none font-semibold text-[9px] tracking-normal">{lang === "en" ? "中" : "EN"}</span>
                </button>
                <button onClick={cycle} className="printer-btn printer-btn-circle btn-enter" style={{ animationDelay: `${(navItems.length + 2) * 40}ms` }} title={mode === "system" ? "System" : mode === "light" ? "Light" : "Dark"}>
                  <ColorModeIcon mode={mode} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom part - Paper feed slot cross section */}
          <div className="bg-printer-shell dark:bg-printer-shell-dark h-5 flex items-center justify-center relative">
            {/* Inset shadows to give depth to the slit area */}
            <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)] pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/[0.05] to-transparent dark:from-black/[0.2]" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/[0.05] to-transparent dark:from-black/[0.2]" />
            {/* Paper exit slit */}
            <div className="absolute left-2 right-2 sm:left-8 sm:right-8 h-[6px] bg-black/60 dark:bg-black/90 rounded-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)]" />
          </div>
        </div>
        {/* Printed paper output area — clipped so paper slides in from the slit */}
        <div className="printer-paper-wrap relative mx-3 sm:mx-10 -mt-[12px] z-20" style={{ clipPath: 'inset(0 -20px -10px -20px)' }}>
          <div className="paper-top-occlusion" aria-hidden="true" />
          <div ref={paperRef}>
            <div className="printer-paper-area bg-printer-paper dark:bg-printer-paper-dark dark:border dark:border-white/[0.04] thermal-texture min-h-[60vh] shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.3)] relative z-0 flex flex-col overflow-hidden">
              <div className="absolute -top-1 left-0 right-0 h-1 bg-printer-paper dark:bg-printer-paper-dark" />

              {/* Perforation marks */}
              <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30 shrink-0" />
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30 shrink-0" />
                ))}
              </div>

              <div className="flex-1 px-6 sm:px-10 py-8 relative z-10">{children}</div>

              <div className="px-6 sm:px-10 py-6 mt-4 border-t border-dashed border-printer-ink/10 dark:border-printer-ink-dark/10 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-printer-ink-light dark:text-printer-ink-dark/40">
                  <div className="font-mono text-[10px] tracking-widest uppercase order-2 sm:order-1">© {new Date().getFullYear()} Nooc</div>
                  <div className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-4 order-1 sm:order-2">
                    <a href="https://github.com/noobnooc" target="_blank" rel="noopener" className="hover:text-printer-accent transition-colors">GitHub</a>
                    <a href="https://x.com/noobnooc" target="_blank" rel="noopener" className="hover:text-printer-accent transition-colors">X</a>
                    <a href="mailto:nooc@nooc.me" className="hover:text-printer-accent transition-colors">Email</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="paper-edge-bottom h-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
