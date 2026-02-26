"use client";

import { useState, useEffect, useRef } from "react";

const DESIGN_WIDTH = 390;

export interface ViewportLayout {
  /** CSS-pixel scale factor (viewportWidth / 390) */
  scale: number;
  /** Design-space height (real viewport height / scale) */
  designHeight: number;
  /** Real CSS-pixel viewport height — tracks keyboard open/close */
  viewportHeight: number;
  /**
   * iOS Safari scrolls the visual viewport when the keyboard opens.
   * The app container uses this as `top` to follow the visible area.
   */
  offsetTop: number;
}

/**
 * Shared viewport scaling hook.
 *
 * Uses the **`visualViewport`** API so that `viewportHeight` shrinks
 * when the mobile virtual keyboard opens and grows when it closes.
 * Also tracks `offsetTop` — on iOS Safari the visual viewport scrolls
 * when the keyboard appears; the outer container positions itself at
 * this offset so it always fills exactly the visible area.
 *
 * Falls back to `window.innerHeight` / offset 0 on browsers without
 * the `visualViewport` API.
 */
export function useViewportScale(): ViewportLayout {
  const [layout, setLayout] = useState<ViewportLayout>({
    scale: 1,
    designHeight: 844,
    viewportHeight: 844,
    offsetTop: 0,
  });

  // Avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (!mountedRef.current) return;

      const vv = window.visualViewport;
      const w = vv ? vv.width : window.innerWidth;
      const h = vv ? vv.height : window.innerHeight;
      const top = vv ? vv.offsetTop : 0;
      const scale = w / DESIGN_WIDTH;

      setLayout({
        scale,
        designHeight: h / scale,
        viewportHeight: h,
        offsetTop: top,
      });
    };

    update();

    // visualViewport fires on keyboard open/close (resize) and on
    // iOS Safari visual-viewport scroll (scroll).
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
  }, []);

  return layout;
}
