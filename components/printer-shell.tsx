"use client";

import Link from "next/link";
import Image from "next/image";
import avatar from "../public/static/avatar.webp";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import RotaryDial from "./rotary-dial";
import {
  RiComputerLine as ComputerDesktopIcon,
  RiMoonLine as MoonIcon,
  RiSunLine as SunIcon,
} from "@remixicon/react";
import {
  SiCloudflare,
  SiDocker,
  SiGithub,
  SiSwift,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
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
const LANGUAGE_DIAL_ANIMATION_MS = 220;

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
type ResolvedColorMode = "light" | "dark";

function parseColorMode(value: string | null): ColorMode {
  return value === "system" || value === "light" || value === "dark" ? value : "system";
}

function useColorMode(initialMode: ColorMode) {
  const [mode, setMode] = useState<ColorMode>(() => {
    if (typeof window === "undefined") return initialMode;

    const domMode = document.documentElement.dataset.colorMode;
    if (domMode) return parseColorMode(domMode);

    try {
      const rawStored = localStorage.getItem("color-mode");
      if (rawStored !== null) return parseColorMode(rawStored);
    } catch {}

    return initialMode;
  });
  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>(() => {
    if (typeof window === "undefined") return initialMode === "dark" ? "dark" : "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const apply = useCallback((m: ColorMode): ResolvedColorMode => {
    const root = document.documentElement;
    const isDark =
      m === "dark" || (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", isDark);
    return isDark ? "dark" : "light";
  }, []);

  const persistColorMode = useCallback((modeValue: ColorMode, resolved: ResolvedColorMode) => {
    try {
      document.cookie = `color-mode=${modeValue}; path=/; max-age=31536000; samesite=lax`;
      document.cookie = `resolved-color-mode=${resolved}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  }, []);

  useLayoutEffect(() => {
    const resolved = apply(mode);
    setResolvedMode(resolved);
    persistColorMode(mode, resolved);

    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const nextResolved = apply("system");
        setResolvedMode(nextResolved);
        persistColorMode("system", nextResolved);
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [mode, apply, persistColorMode]);

  useLayoutEffect(() => {
    try {
      const rawStored = localStorage.getItem("color-mode");
      const stored = rawStored === null ? initialMode : parseColorMode(rawStored);
      setMode((current) => (current === stored ? current : stored));
      document.documentElement.dataset.colorMode = stored;
      return;
    } catch {}

    document.documentElement.dataset.colorMode = initialMode;
    setMode((current) => (current === initialMode ? current : initialMode));
  }, [initialMode]);

  const setColorMode = useCallback((next: ColorMode) => {
    setMode(next);
    try {
      localStorage.setItem("color-mode", next);
    } catch {}
    document.documentElement.dataset.colorMode = next;
    const resolved = apply(next);
    setResolvedMode(resolved);
    persistColorMode(next, resolved);
  }, [apply, persistColorMode]);

  return { mode, resolvedMode, setColorMode };
}

type StickerId = "github" | "docker" | "typescript" | "swift" | "cloudflare";

interface StickerDefinition {
  id: StickerId;
  label: string;
  width: number;
  height: number;
  rotation: number;
  color: string;
  darkColor?: string;
  shape: "circle" | "square";
  iconSize: number;
  iconOffsetX?: number;
  iconOffsetY?: number;
  Icon: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
}

type StickerLayout = Record<StickerId, { x: number; y: number }>;

const STICKER_STORAGE_KEY = "__printer_sticker_layout_v4__";
let stickerLayoutMemory: StickerLayout | null = null;
const STICKER_NORMALIZE_EPSILON_PX = 4;
const SHELL_BOTTOM_SECTION_HEIGHT_PX = 20;
const SHELL_BOTTOM_SAFE_GAP_PX = 2;

const STICKERS: StickerDefinition[] = [
  { id: "github", label: "GitHub", width: 44, height: 44, rotation: -6, color: "#181717", darkColor: "#f0f6fc", shape: "circle", iconSize: 30, Icon: SiGithub },
  { id: "docker", label: "Docker", width: 40, height: 40, rotation: 2, color: "#2496ED", shape: "square", iconSize: 27, iconOffsetY: 1, Icon: SiDocker },
  { id: "cloudflare", label: "Cloudflare", width: 46, height: 46, rotation: 8, color: "#F38020", shape: "circle", iconSize: 30, iconOffsetY: -1, Icon: SiCloudflare },
  { id: "typescript", label: "TypeScript", width: 40, height: 40, rotation: 4, color: "#3178C6", shape: "square", iconSize: 27, Icon: SiTypescript },
  { id: "swift", label: "Swift", width: 40, height: 40, rotation: -5, color: "#F05138", shape: "square", iconSize: 27, Icon: SiSwift },
];

const STICKER_ANCHORS = [
  { x: 0.08, y: 0.14 },
  { x: 0.5, y: 0.1 },
  { x: 0.92, y: 0.14 },
  { x: 0.1, y: 0.56 },
  { x: 0.9, y: 0.56 },
];

const STICKER_BY_ID = STICKERS.reduce<Record<StickerId, StickerDefinition>>((acc, sticker) => {
  acc[sticker.id] = sticker;
  return acc;
}, {} as Record<StickerId, StickerDefinition>);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createRandomStickerLayout(): StickerLayout {
  const anchors = [...STICKER_ANCHORS];

  for (let i = anchors.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [anchors[i], anchors[swapIndex]] = [anchors[swapIndex], anchors[i]];
  }

  const layout = {} as StickerLayout;

  for (let index = 0; index < STICKERS.length; index += 1) {
    const sticker = STICKERS[index];
    const anchor = anchors[index] ?? { x: 0.5, y: 0.5 };
    layout[sticker.id] = {
      x: clamp(anchor.x + (Math.random() - 0.5) * 0.05, 0.08, 0.92),
      y: clamp(anchor.y + (Math.random() - 0.5) * 0.04, 0.1, 0.94),
    };
  }

  return layout;
}

function parseStickerLayout(raw: string | null): StickerLayout | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Record<StickerId, { x: unknown; y: unknown }>>;
    const layout = {} as StickerLayout;

    for (const sticker of STICKERS) {
      const position = parsed[sticker.id];
      if (!position || typeof position.x !== "number" || typeof position.y !== "number") {
        return null;
      }

      layout[sticker.id] = {
        x: clamp(position.x, 0, 1),
        y: clamp(position.y, 0, 1),
      };
    }

    return layout;
  } catch {
    return null;
  }
}

function renderStickerFace(sticker: StickerDefinition, resolvedMode: ResolvedColorMode) {
  const Icon = sticker.Icon;
  const iconOffsetX = sticker.iconOffsetX ?? 0;
  const iconOffsetY = sticker.iconOffsetY ?? 0;
  const iconColor = resolvedMode === "dark" ? (sticker.darkColor ?? sticker.color) : sticker.color;

  return (
    <div
      className={classNames(
        "relative h-full w-full flex items-center justify-center border",
        "bg-white border-black/[0.08]",
        "dark:bg-[#171a1f] dark:border-white/[0.16]",
        sticker.shape === "circle" ? "rounded-full" : (sticker.id === "swift" ? "rounded-[10px]" : "rounded-md")
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className="block"
            color={iconColor}
            style={{
              width: `${sticker.iconSize}px`,
              height: `${sticker.iconSize}px`,
              transform: `translate(${iconOffsetX}px, ${iconOffsetY}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface StickerButtonProps {
  sticker: StickerDefinition;
  x: number;
  y: number;
  dragging: boolean;
  resolvedMode: ResolvedColorMode;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => void;
  onPointerMove: (event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => void;
  onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onLostPointerCapture: (event: React.PointerEvent<HTMLButtonElement>) => void;
}

const StickerButton = memo(function StickerButton({
  sticker,
  x,
  y,
  dragging,
  resolvedMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onLostPointerCapture,
}: StickerButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${sticker.label} sticker`}
      onPointerDown={(event) => onPointerDown(event, sticker.id)}
      onPointerMove={(event) => onPointerMove(event, sticker.id)}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onLostPointerCapture}
      className={classNames(
        "absolute pointer-events-auto touch-none select-none",
        dragging ? "z-50 cursor-grabbing" : "z-20 cursor-grab",
      )}
      style={{
        width: `${sticker.width}px`,
        height: `${sticker.height}px`,
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: `translate3d(-50%, -50%, 0) rotate(${sticker.rotation}deg)`,
        boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.12)" : "none",
        transition: dragging ? "none" : "box-shadow 140ms ease-out",
        borderRadius: sticker.shape === "circle" ? "9999px" : (sticker.id === "swift" ? "10px" : "6px"),
        willChange: dragging ? "transform, box-shadow" : "auto",
      }}
    >
      {renderStickerFace(sticker, resolvedMode)}
    </button>
  );
});


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
  initialColorMode: ColorMode;
}

export default function PrinterShell({
  dictionary,
  children,
  lang,
  initialColorMode,
}: PrinterShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, resolvedMode, setColorMode } = useColorMode(initialColorMode);
  const paperRef = usePaperFeedAnimation();
  const indicatorDelay = useSyncedAnimationDelay(2000);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const [pendingFromPath, setPendingFromPath] = useState<string | null>(null);
  const [displayLang, setDisplayLang] = useState(lang);
  const shellRef = useRef<HTMLDivElement>(null);
  const [stickerLayout, setStickerLayout] = useState<StickerLayout | null>(() => stickerLayoutMemory);
  const stickerLayoutRef = useRef<StickerLayout | null>(stickerLayoutMemory);
  const [draggingStickerId, setDraggingStickerId] = useState<StickerId | null>(null);
  const dragStateRef = useRef<{
    id: StickerId;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const langSwitchTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!pendingNavHref || !pendingFromPath) return;
    if (pathname !== pendingFromPath) {
      setPendingNavHref(null);
      setPendingFromPath(null);
    }
  }, [pathname, pendingNavHref, pendingFromPath]);

  useEffect(() => {
    setDisplayLang(lang);
  }, [lang]);

  const getStickerBounds = useCallback((sticker: StickerDefinition, shellRect: DOMRect) => {
    const minCenterX = sticker.width / 2;
    const maxCenterX = Math.max(minCenterX, shellRect.width - sticker.width / 2);
    const minCenterY = sticker.height / 2;
    const maxCenterY = Math.max(
      minCenterY,
      shellRect.height - SHELL_BOTTOM_SECTION_HEIGHT_PX - SHELL_BOTTOM_SAFE_GAP_PX - sticker.height / 2,
    );

    return { minCenterX, maxCenterX, minCenterY, maxCenterY };
  }, []);

  const normalizeStickerLayoutToTopSection = useCallback((layout: StickerLayout): StickerLayout => {
    const shell = shellRef.current;
    if (!shell) return layout;

    const shellRect = shell.getBoundingClientRect();
    if (shellRect.width <= 0 || shellRect.height <= 0) return layout;

    const normalized = {} as StickerLayout;
    let changed = false;

    for (const sticker of STICKERS) {
      const position = layout[sticker.id];
      const bounds = getStickerBounds(sticker, shellRect);
      const rawCenterX = position.x * shellRect.width;
      const rawCenterY = position.y * shellRect.height;
      const clampedCenterX = clamp(rawCenterX, bounds.minCenterX, bounds.maxCenterX);
      const clampedCenterY = clamp(rawCenterY, bounds.minCenterY, bounds.maxCenterY);
      const centerX =
        Math.abs(clampedCenterX - rawCenterX) <= STICKER_NORMALIZE_EPSILON_PX ? rawCenterX : clampedCenterX;
      const centerY =
        Math.abs(clampedCenterY - rawCenterY) <= STICKER_NORMALIZE_EPSILON_PX ? rawCenterY : clampedCenterY;

      normalized[sticker.id] = {
        x: centerX / shellRect.width,
        y: centerY / shellRect.height,
      };

      if (!changed) {
        changed =
          Math.abs(normalized[sticker.id].x - position.x) > 0.0005 ||
          Math.abs(normalized[sticker.id].y - position.y) > 0.0005;
      }
    }

    return changed ? normalized : layout;
  }, [getStickerBounds]);

  const persistStickerLayout = useCallback((layout: StickerLayout) => {
    stickerLayoutMemory = layout;
    try {
      localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(layout));
    } catch {}
  }, []);

  useLayoutEffect(() => {
    const current = stickerLayoutRef.current;
    if (current) {
      // Keep current in-memory layout as-is across remounts (e.g. language switch)
      // to avoid tiny re-normalization shifts.
      setStickerLayout((prev) => (prev ?? current));
      return;
    }

    try {
      const stored = parseStickerLayout(localStorage.getItem(STICKER_STORAGE_KEY));
      if (stored) {
        const normalizedStored = normalizeStickerLayoutToTopSection(stored);
        setStickerLayout(normalizedStored);
        stickerLayoutRef.current = normalizedStored;
        persistStickerLayout(normalizedStored);
        return;
      }
    } catch {}

    const randomLayout = normalizeStickerLayoutToTopSection(createRandomStickerLayout());
    setStickerLayout(randomLayout);
    stickerLayoutRef.current = randomLayout;
    persistStickerLayout(randomLayout);
  }, [normalizeStickerLayoutToTopSection, persistStickerLayout]);

  useEffect(() => {
    stickerLayoutRef.current = stickerLayout;
    if (stickerLayout) {
      stickerLayoutMemory = stickerLayout;
    }
  }, [stickerLayout]);

  useEffect(() => {
    const handleResize = () => {
      const current = stickerLayoutRef.current;
      if (!current) return;

      const normalized = normalizeStickerLayoutToTopSection(current);
      if (normalized !== current) {
        stickerLayoutRef.current = normalized;
        setStickerLayout(normalized);
        persistStickerLayout(normalized);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [normalizeStickerLayoutToTopSection, persistStickerLayout]);

  useEffect(() => {
    return () => {
      if (langSwitchTimerRef.current !== null) {
        window.clearTimeout(langSwitchTimerRef.current);
      }
    };
  }, []);

  function onNavPress(href: string) {
    if (isActive(href)) {
      setPendingNavHref(null);
      setPendingFromPath(null);
      return;
    }
    setPendingNavHref(href);
    setPendingFromPath(pathname);
  }

  const switchToLanguage = useCallback((newLang: string) => {
    if (newLang === displayLang) return;
    const rest = pathname.split("/").slice(2);
    const newPath = `/${newLang}${rest.length ? `/${rest.join("/")}` : ""}`;
    try { sessionStorage.setItem(LANG_SWITCH_KEY, '1'); } catch {}
    setDisplayLang(newLang);
    setPendingNavHref(null);
    setPendingFromPath(null);
    if (langSwitchTimerRef.current !== null) {
      window.clearTimeout(langSwitchTimerRef.current);
    }

    langSwitchTimerRef.current = window.setTimeout(() => {
      langSwitchTimerRef.current = null;

      const docWithTransition = document as Document & {
        startViewTransition?: (callback: () => void) => { finished: Promise<void> };
      };

      if (typeof docWithTransition.startViewTransition === "function") {
        try {
          docWithTransition.startViewTransition(() => {
            router.push(newPath);
          });
          return;
        } catch {
          // Fallback when browser implementation rejects the call.
        }
      }

      router.push(newPath);
    }, LANGUAGE_DIAL_ANIMATION_MS);
  }, [displayLang, pathname, router]);

  const updateStickerPositionFromPointer = useCallback((
    id: StickerId,
    clientX: number,
    clientY: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const shell = shellRef.current;
    const currentLayout = stickerLayoutRef.current;
    if (!shell || !currentLayout) return;

    const rect = shell.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const sticker = STICKER_BY_ID[id];
    const bounds = getStickerBounds(sticker, rect);
    const centerX = clamp(clientX - rect.left - offsetX, bounds.minCenterX, bounds.maxCenterX);
    const centerY = clamp(clientY - rect.top - offsetY, bounds.minCenterY, bounds.maxCenterY);

    const nextLayout: StickerLayout = {
      ...currentLayout,
      [id]: {
        x: centerX / rect.width,
        y: centerY / rect.height,
      },
    };

    stickerLayoutMemory = nextLayout;
    stickerLayoutRef.current = nextLayout;
    setStickerLayout(nextLayout);
  }, [getStickerBounds]);

  const finishStickerDrag = useCallback((pointerId: number) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== pointerId) return;
    dragStateRef.current = null;
    setDraggingStickerId(null);

    if (stickerLayoutRef.current) {
      persistStickerLayout(stickerLayoutRef.current);
    }
  }, [persistStickerLayout]);

  const onStickerPointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => {
    const shell = shellRef.current;
    const currentLayout = stickerLayoutRef.current;
    if (!shell || !currentLayout) return;

    const rect = shell.getBoundingClientRect();
    const currentPosition = currentLayout[id];

    const centerX = currentPosition.x * rect.width;
    const centerY = currentPosition.y * rect.height;

    dragStateRef.current = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left - centerX,
      offsetY: event.clientY - rect.top - centerY,
    };

    setDraggingStickerId(id);
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onStickerPointerMove = useCallback((event: React.PointerEvent<HTMLButtonElement>, id: StickerId) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.id !== id || dragState.pointerId !== event.pointerId) return;

    event.preventDefault();
    updateStickerPositionFromPointer(
      id,
      event.clientX,
      event.clientY,
      dragState.offsetX,
      dragState.offsetY,
    );
  }, [updateStickerPositionFromPointer]);

  const onStickerPointerUp = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishStickerDrag(event.pointerId);
  }, [finishStickerDrag]);

  const onStickerLostPointerCapture = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    finishStickerDrag(event.pointerId);
  }, [finishStickerDrag]);

  const langOptions = [
    { value: "en", label: "EN" },
    { value: "zh", label: "中" },
  ];

  const iconCls = "w-2 h-2";
  const colorModeOptions: { value: ColorMode; label: React.ReactNode }[] = [
    { value: "system", label: <ComputerDesktopIcon className={iconCls} /> },
    { value: "light", label: <SunIcon className={iconCls} /> },
    { value: "dark", label: <MoonIcon className={iconCls} /> },
  ];

  return (
    <div className="min-h-screen page-grid flex flex-col items-center px-3 py-6 sm:py-10">
      {/* Printer Body */}
      <div className="w-full max-w-3xl relative">
        {/* Unified Header Housing - Wraps both brand and slit areas to share a single shadow */}
        <div
          ref={shellRef}
          className="printer-header-border dark:border dark:border-white/[0.06] rounded-t-[2.5rem] rounded-b-sm overflow-hidden relative z-10"
        >
          
          {/* Dark mode ambient glow — soft top light spill */}
          <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(100,120,255,0.07)_0%,rgba(80,100,220,0.03)_40%,transparent_70%)]" />
          </div>

          {/* Draggable shell stickers */}
          <div className="absolute inset-0 z-30 pointer-events-none" aria-label="shell stickers">
            {stickerLayout && STICKERS.map((sticker) => {
              const position = stickerLayout[sticker.id];
              const dragging = draggingStickerId === sticker.id;

              return (
                <StickerButton
                  key={sticker.id}
                  sticker={sticker}
                  x={position.x}
                  y={position.y}
                  dragging={dragging}
                  resolvedMode={resolvedMode}
                  onPointerDown={onStickerPointerDown}
                  onPointerMove={onStickerPointerMove}
                  onPointerUp={onStickerPointerUp}
                  onLostPointerCapture={onStickerLostPointerCapture}
                />
              );
            })}
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
            <div className="relative mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
              <nav className="relative flex items-center gap-2 sm:gap-2.5 flex-1 w-full py-1.5">
                {navItems.map((item, index) => {
                  const active = pendingNavHref ? pendingNavHref === item.href : isActive(item.href);
                  return (
                    <Link key={index} href={item.href}>
                      <button
                        onClick={() => onNavPress(item.href)}
                        className={classNames("printer-btn whitespace-nowrap", { "active": active })}
                      >
                        <span className="leading-none">{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>
              <div className="sm:hidden h-[1px] bg-black/10 dark:bg-white/10" />
              <div className="flex items-center justify-end gap-5 shrink-0 py-1">
                <RotaryDial
                  options={langOptions}
                  value={displayLang}
                  onChange={switchToLanguage}
                  title={displayLang === "en" ? "切换到中文" : "Switch to English"}
                />
                <RotaryDial
                  options={colorModeOptions}
                  value={mode}
                  onChange={setColorMode}
                  labelLayout="inline"
                  title={mode === "system" ? "System" : mode === "light" ? "Light" : "Dark"}
                />
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

              <div className="printer-content-area flex-1 px-6 sm:px-10 py-8 relative z-10">{children}</div>

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
        <div className="printer-bottom-occlusion" aria-hidden="true" />
      </div>
    </div>
  );
}
