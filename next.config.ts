import type { NextConfig } from "next";
import fs from "fs";
import { execSync } from "child_process";

// v0 sandbox workaround:
// v0 symlinks node_modules → /vercel/share/v0-next-shadcn/node_modules
// but Turbopack rejects symlinks pointing outside the filesystem root.
// Replace the symlink with real dependencies before Turbopack initializes.
try {
  const stat = fs.lstatSync("node_modules");
  if (stat.isSymbolicLink()) {
    console.log("[v0-workaround] Detected symlinked node_modules, replacing...");
    fs.unlinkSync("node_modules");
    execSync("npm install --prefer-offline 2>/dev/null || npm install", {
      stdio: "inherit",
    });
    // Turbopack already initialized with the broken symlink in this process,
    // so we must restart. v0's process manager will relaunch automatically,
    // and the second start will find real node_modules — no restart loop.
    if (fs.existsSync("node_modules/next")) {
      console.log("[v0-workaround] Replaced. Restarting process...");
      process.exit(0);
    }
  }
} catch {
  // not a symlink or doesn't exist — no action needed
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
