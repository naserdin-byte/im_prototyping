import type { NextConfig } from "next";
import fs from "fs";
import { execSync } from "child_process";

// v0 sandbox workaround:
// v0 symlinks node_modules → /vercel/share/v0-next-shadcn/node_modules
// Next.js 16 Turbopack rejects symlinks pointing outside the filesystem root.
// Replace the symlink with real dependencies before the bundler initializes.
// next.config.ts is loaded BEFORE webpack/turbopack init, so this runs in time.
try {
  const stat = fs.lstatSync("node_modules");
  if (stat.isSymbolicLink()) {
    console.log("[v0-workaround] Detected symlinked node_modules, replacing...");
    fs.unlinkSync("node_modules");
    execSync("npm install --prefer-offline 2>/dev/null || npm install", {
      stdio: "inherit",
    });
    console.log("[v0-workaround] Done. Continuing with real node_modules.");
  }
} catch {
  // not a symlink or doesn't exist — no action needed
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
