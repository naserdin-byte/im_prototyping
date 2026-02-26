import type { NextConfig } from "next";
import fs from "fs";
import { execSync } from "child_process";

// v0 sandbox workaround:
// v0 pre-installs shared dependencies that contaminate node_modules,
// causing Next.js to fail route discovery (404 on all pages).
// Detect v0 sandbox and force a clean install from our package.json.
try {
  const isV0 = fs.existsSync("/vercel/share");
  if (isV0) {
    const stat = fs.lstatSync("node_modules");
    const isLink = stat.isSymbolicLink();
    if (isLink) {
      console.log("[v0-fix] Symlink detected, removing...");
      fs.unlinkSync("node_modules");
    } else {
      console.log("[v0-fix] Contaminated node_modules detected, cleaning...");
      fs.rmSync("node_modules", { recursive: true, force: true });
    }
    execSync("npm install --prefer-offline 2>/dev/null || npm install", {
      stdio: "inherit",
    });
    console.log("[v0-fix] Clean node_modules ready.");
  }
} catch (e) {
  console.log("[v0-fix] error:", e instanceof Error ? e.message : e);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
