"use client";

import Link from "next/link";
import Image from "next/image";
import avatar from "../public/static/avatar.webp";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

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

const colorModeIcons: Record<ColorMode, string> = {
  system: "◐",
  light: "☀",
  dark: "☽",
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

  const navItems = [
    { label: dictionary.labels.home, href: dictionary.urls.home, icon: "⌂" },
    { label: dictionary.labels.life, href: dictionary.urls.life, icon: "✦" },
    { label: dictionary.labels.posts, href: dictionary.urls.posts, icon: "⚙" },
    { label: dictionary.labels.works, href: dictionary.urls.works, icon: "◈" },
    { label: dictionary.labels.about, href: dictionary.urls.about, icon: "○" },
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
    router.push(newPath);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-200 to-stone-300 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center px-3 py-6 sm:py-10">
      {/* Printer Body */}
      <div className="w-full max-w-3xl">
        {/* Top housing - brand area */}
        <div className="bg-printer-body dark:bg-printer-body-dark rounded-t-[2rem] shadow-printer dark:shadow-printer-dark px-6 pt-6 pb-4 sm:px-8 sm:pt-8 relative overflow-hidden">

          {/* Brushed metal texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.07) 1px, transparent 2px)', backgroundSize: '100% 3px' }} />

          {/* Brand plate - recessed area */}
          <div className="relative flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  className="h-9 w-9 rounded-full ring-2 ring-printer-ink/10 dark:ring-printer-ink-dark/10 shadow-sm"
                  src={avatar}
                  alt="Nooc"
                />
                {/* Recessed bezel around avatar */}
                <div className="absolute -inset-[3px] rounded-full border border-black/5 dark:border-white/5 shadow-inner" />
              </div>
              <div>
                <div className="font-mono text-sm font-semibold tracking-[0.2em] text-printer-ink dark:text-printer-ink-dark uppercase">
                  {dictionary.labels.brandName}
                </div>
                <div className="font-mono text-[10px] tracking-wider text-printer-ink-light dark:text-printer-ink-dark/50 uppercase">
                  {dictionary.labels.brandTagline}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status LED with glow */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5),inset_0_-1px_2px_rgba(0,0,0,0.2)] animate-pulse" />
                  {/* LED housing recess */}
                  <div className="absolute -inset-0.5 rounded-full border border-black/10 dark:border-white/5" />
                </div>
                <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/50 uppercase tracking-wider hidden sm:inline">
                  Online
                </span>
              </div>
              {/* Decorative Phillips screw */}
              <div className="hidden sm:flex w-5 h-5 rounded-full bg-gradient-to-br from-printer-button via-printer-shell to-printer-button dark:from-printer-button-dark dark:via-printer-shell-dark dark:to-printer-button-dark border border-black/10 dark:border-white/10 items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.1)] relative">
                <div className="w-2.5 h-[1px] bg-black/25 dark:bg-white/20 absolute" />
                <div className="w-[1px] h-2.5 bg-black/25 dark:bg-white/20 absolute" />
              </div>
            </div>
          </div>

          {/* Navigation row */}
          <div className="relative flex items-center gap-2">
            <nav className="relative flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 -mx-1 px-1 flex-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={classNames(
                        "printer-btn whitespace-nowrap flex items-center justify-center gap-1.5 text-[11px] sm:text-xs",
                        {
                          active: active,
                        },
                      )}
                    >
                      <span className="text-sm leading-none flex items-center">{item.icon}</span>
                      <span className="leading-none">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Language & Color Mode toggles */}
            <div className="flex items-center gap-1.5 pb-1 shrink-0">
              <button
                onClick={switchLanguage}
                className="printer-btn flex items-center justify-center text-[11px] sm:text-xs !px-2.5 !py-2"
                title={lang === "en" ? "切换到中文" : "Switch to English"}
              >
                <span className="leading-none font-semibold">{lang === "en" ? "中" : "EN"}</span>
              </button>
              <button
                onClick={cycle}
                className="printer-btn flex items-center justify-center text-[11px] sm:text-xs !px-2.5 !py-2"
                title={mode === "system" ? "System" : mode === "light" ? "Light" : "Dark"}
              >
                <span className="text-sm leading-none">{colorModeIcons[mode]}</span>
              </button>
            </div>
          </div>

          {/* Bottom groove - parting line between header and feed slot */}
          <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-black/8 dark:via-white/5 to-transparent" />
          <div className="absolute bottom-[1px] left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 dark:via-white/[0.02] to-transparent" />
        </div>

        {/* Paper feed slot - cross section (横切面) */}
        <div className="bg-printer-shell dark:bg-printer-shell-dark h-4 shadow-inner flex items-center justify-center relative">
          {/* Subtle inner shadow edges */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/[0.03] to-transparent dark:from-white/[0.02]" />
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/[0.03] to-transparent dark:from-white/[0.02]" />
          {/* Paper exit slit - dark slot slightly wider than content */}
          <div className="absolute left-2 right-2 sm:left-6 sm:right-6 h-[4px] bg-black/70 dark:bg-black/80 rounded-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]" />
        </div>

        {/* Printed paper output area - starts at the vertical midpoint of the slit */}
        <div className="relative mx-4 sm:mx-8 -mt-[10px] z-10">

          {/* Paper */}
          <div className="bg-printer-paper dark:bg-printer-paper-dark thermal-texture min-h-[60vh] shadow-paper">
            {/* Perforation marks on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30"
                />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col items-center justify-start gap-6 pt-4 opacity-20">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full border border-printer-ink/30 dark:border-printer-ink-dark/30"
                />
              ))}
            </div>

            {/* Content area */}
            <div className="px-6 sm:px-10 py-8">{children}</div>
          </div>

          {/* Footer - part of the paper */}
          <div className="bg-printer-paper dark:bg-printer-paper-dark px-6 sm:px-10 py-4 border-t border-printer-ink/5 dark:border-printer-ink-dark/10">
            <div className="flex items-center justify-between text-printer-ink-light dark:text-printer-ink-dark/40">
              <div className="font-mono text-[10px] tracking-wider uppercase">
                © {new Date().getFullYear()} Nooc
              </div>
              <div className="font-mono text-[10px] tracking-wider uppercase flex items-center gap-3">
                <a
                  href="https://github.com/noobnooc"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-printer-ink dark:hover:text-printer-ink-dark transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://x.com/noobnooc"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-printer-ink dark:hover:text-printer-ink-dark transition-colors"
                >
                  X
                </a>
                <a
                  href="mailto:nooc@nooc.me"
                  className="hover:text-printer-ink dark:hover:text-printer-ink-dark transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Paper torn bottom edge */}
          <div className="paper-edge-bottom h-0" />
        </div>

      </div>
    </div>
  );
}
