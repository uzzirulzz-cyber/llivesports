import { cp, mkdir, copyFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, "public");
const output = resolve(projectRoot, "dist");
const platform = resolve(source, "platform.html");
const mpegts = resolve(projectRoot, "node_modules", "mpegts.js", "dist", "mpegts.js");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await copyFile(platform, resolve(output, "index.html"));
await copyFile(mpegts, resolve(output, "mpegts.min.js"));

console.log("Built MagxTV static Pages output in dist/");
