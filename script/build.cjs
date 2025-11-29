#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

async function buildAll() {
  try {
    // Dynamically import ESM modules
    const { build: esbuild } = await import("esbuild");
    const { build: viteBuild } = await import("vite");
    const { rm, readFile } = await import("fs/promises");

    const allowlist = [
      "@google/genai",
      "@neondatabase/serverless",
      "axios",
      "bcrypt",
      "connect-pg-simple",
      "date-fns",
      "drizzle-orm",
      "drizzle-zod",
      "express",
      "express-session",
      "jsonwebtoken",
      "memorystore",
      "pg",
      "zod",
      "zod-validation-error",
    ];

    await rm("dist", { recursive: true, force: true });

    console.log("🔨 building client...");
    await viteBuild();

    console.log("🔨 building server...");
    const pkg = JSON.parse(
      await readFile(path.join(process.cwd(), "package.json"), "utf-8")
    );
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    await esbuild({
      entryPoints: ["server/index.ts"],
      platform: "node",
      bundle: true,
      format: "cjs",
      outfile: "dist/index.cjs",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      minify: true,
      external: externals,
      logLevel: "info",
    });

    console.log("✅ Build complete!");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

buildAll();
