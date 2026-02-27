"use client";

import dynamic from "next/dynamic";

/**
 * Pure CSR: the server sends an empty shell and all UI rendering
 * happens exclusively in the browser.  `ssr: false` prevents
 * Next.js from pre-rendering the component on the server.
 */
const AppShell = dynamic(() => import("@/components/AppShell"), { ssr: false });

export default function Page() {
  return <AppShell />;
}
