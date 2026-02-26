"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const DESIGN_WIDTH = 390;

export interface ViewportLayout {
  /** CSS-pixel scale factor (viewportWidth / 390) */
  scale: number;
  /** Design-space height for the content area (excluding safe areas) */
  designHeight: number;
  /** Real CSS-pixel viewport height — tracks keyboard open/close */
  viewportHeight: number;
  /** Top safe area inset in real CSS pixels (status bar / Dynamic Island) */
  safeAreaTop: number;
  /** Bottom safe area inset in real CSS pixels (home indicator); 0 when keyboard is open */
  safeAreaBottom: number;
}

/**
 * Read iOS safe-area-inset-top and -bottom using a probe element.
 * Returns 0 on devices without notch/home-indicator.
 */
function readSafeAreaInsets(): { top: number; bottom: number } {
  if (typeof document === "undefined") return { top: 0, bottom: 0 };

  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:0;top:0;width:0;height:0;" +
    "padding-top:env(safe-area-inset-top,0px);" +
    "padding-bottom:env(safe-area-inset-bottom,0px);" +
    "visibility:hidden;pointer-events:none;";
  document.body.appendChild(probe);

  const computed = getComputedStyle(probe);
  const top = parseFloat(computed.paddingTop) || 0;
  const bottom = parseFloat(computed.paddingBottom) || 0;

  document.body.removeChild(probe);
  return { top, bottom };
}

/**
 * Shared viewport scaling hook.
 *
 * Uses the **`visualViewport`** API so that `viewportHeight` shrinks
 * when the mobile virtual keyboard opens and grows when it closes.
 *
 * Safe area insets are read once on mount via a CSS `env()` probe.
 * When the keyboard is open (viewport significantly shorter than max),
 * the bottom inset is set to 0 since the keyboard covers the home indicator.
 */
export function useViewportScale(): ViewportLayout {
  const [layout, setLayout] = useState<ViewportLayout>({
    scale: 1,
    designHeight: 844,
    viewportHeight: 844,
    safeAreaTop: 0,
    safeAreaBottom: 0,
  });

  const mountedRef = useRef(true);
  const safeInsetsRef = useRef({ top: 0, bottom: 0 });
  const maxHeightRef = useRef(0);

  // Effect 1: Read safe area insets (runs first)
  useEffect(() => {
    mountedRef.current = true;
    safeInsetsRef.current = readSafeAreaInsets();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const update = useCallback(() => {
    if (!mountedRef.current) return;

    const vv = window.visualViewport;
    const w = vv ? vv.width : window.innerWidth;
    const h = vv ? vv.height : window.innerHeight;
    const scale = w / DESIGN_WIDTH;

    const { top: safeTop, bottom: safeBottom } = safeInsetsRef.current;

    // Track max viewport height to detect keyboard
    maxHeightRef.current = Math.max(maxHeightRef.current, h);
    const keyboardOpen = h < maxHeightRef.current - 50;

    // When keyboard is open, the home indicator is behind the keyboard
    // so we don't subtract bottom safe area
    const effectiveBottom = keyboardOpen ? 0 : safeBottom;

    // Content height = viewport minus safe areas
    const contentHeight = h - safeTop - effectiveBottom;

    setLayout({
      scale,
      designHeight: contentHeight / scale,
      viewportHeight: h,
      safeAreaTop: safeTop,
      safeAreaBottom: effectiveBottom,
    });

    // iOS Safari scrolls the page when the keyboard opens (because of
    // transform: scale on the container). Force scroll back to origin.
    window.scrollTo(0, 0);
  }, []);

  // Effect 2: Setup viewport tracking (runs after Effect 1)
  useEffect(() => {
    update();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
    }
    window.addEventListener("resize", update);

    return () => {
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return layout;
}
