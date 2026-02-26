import type { NextConfig } from "next";
import fs from "fs";
import { execSync } from "child_process";

// v0 sandbox fallback: if predev didn't run (e.g. v0 bypasses npm scripts),
// handle symlinked node_modules before the bundler initializes.
try {
  const stat = fs.lstatSync("node_modules");
  if (stat.isSymbolicLink()) {
    console.log("[v0-fix] Symlink node_modules detected, replacing...");
    fs.unlinkSync("node_modules");
    execSync("npm install --prefer-offline 2>/dev/null || npm install", {
      stdio: "inherit",
    });
    console.log("[v0-fix] Done.");
  }
} catch {
  // node_modules doesn't exist or other error — let Next.js handle it
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
