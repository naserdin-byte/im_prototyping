"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const DESIGN_WIDTH = 390;

export interface ViewportLayout {
  /** CSS-pixel scale factor (viewportWidth / 390) */
  scale: number;
  /** Design-space height (real viewport height / scale) */
  designHeight: number;
  /** Real CSS-pixel viewport height — tracks keyboard open/close */
  viewportHeight: number;
}

/**
 * Shared viewport scaling hook.
 *
 * Uses the **`visualViewport`** API so that `viewportHeight` shrinks
 * when the mobile virtual keyboard opens and grows when it closes.
 *
 * On iOS Safari the keyboard causes the browser to scroll the page.
 * We counter this with `window.scrollTo(0, 0)` on every viewport
 * change — the page itself never scrolls; only the messages list
 * inside the chat page scrolls.
 */
export function useViewportScale(): ViewportLayout {
  const [layout, setLayout] = useState<ViewportLayout>({
    scale: 1,
    designHeight: 844,
    viewportHeight: 844,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
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

    setLayout({
      scale,
      designHeight: h / scale,
      viewportHeight: h,
    });

    // iOS Safari scrolls the page when the keyboard opens (because of
    // transform: scale on the container). Force scroll back to origin
    // so the fixed container stays aligned with the visible area.
    window.scrollTo(0, 0);
  }, []);

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
