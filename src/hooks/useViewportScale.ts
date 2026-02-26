"use client";

import { useState, useEffect, useRef } from "react";

const DESIGN_WIDTH = 390;

export interface ViewportLayout {
  /** CSS‑pixel scale factor (viewportWidth / 390) */
  scale: number;
  /** Design‑space height (real viewport height / scale) */
  designHeight: number;
  /** Real CSS‑pixel viewport height — tracks keyboard open/close */
  viewportHeight: number;
}

/**
 * Shared viewport scaling hook.
 *
 * Uses the **`visualViewport`** API so that `viewportHeight` shrinks
 * when the mobile virtual keyboard opens and grows when it closes.
 * Falls back to `window.innerHeight` on browsers without the API.
 *
 * Both InboxPage and ChatPage share this hook so the outer container
 * always matches the *visible* area — no document‑level scroll, and
 * the nav bar stays pinned at the top while the input bar stays above
 * the keyboard.
 */
export function useViewportScale(): ViewportLayout {
  const [layout, setLayout] = useState<ViewportLayout>({
    scale: 1,
    designHeight: 844,
    viewportHeight: 844,
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
      const scale = w / DESIGN_WIDTH;

      setLayout({
        scale,
        designHeight: h / scale,
        viewportHeight: h,
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
