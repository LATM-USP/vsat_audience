import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "src/puredata/WebPatch");
const targetDir = path.join(root, "public/puredata/WebPatch");
const files = [
  "pd4web.js",
  "pd4web.threads.js",
  "pd4web.wasm",
  "pd4web.data",
];

fs.mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  if (!fs.existsSync(sourcePath)) {
    console.error(`[copy:pd4web] missing source file: ${sourcePath}`);
    process.exit(1);
  }
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`[copy:pd4web] ${file}`);
}
