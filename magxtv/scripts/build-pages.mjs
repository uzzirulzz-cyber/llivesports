import { cp, mkdir, copyFile, rm, readFile, writeFile } from "node:fs/promises";
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
const entryFile = resolve(output, "index.html");
const entry = await readFile(entryFile, "utf8");
const sportsLink = '<a href="/sports-center.html" aria-label="Open MAGXTV Sports Center" style="position:fixed;right:16px;bottom:18px;z-index:1050;background:#1768d5;color:#fff;padding:12px 20px;border:1px solid #9ccaff;border-radius:999px;box-shadow:0 7px 25px #0008;font:bold 14px system-ui;text-decoration:none">⚽ Sports Center</a>';
if (!entry.includes('href="/sports-center.html"')) {
  await writeFile(entryFile, entry.replace("</body>", sportsLink + "\\n</body>"));
  await writeFile(resolve(output,"platform.html"),entry.replace("</body>", sportsLink + "\\n</body>"));
}
await copyFile(mpegts, resolve(output, "mpegts.min.js"));

console.log("Built MagxTV static Pages output in dist/");
