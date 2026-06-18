#!/usr/bin/env node
/**
 * Rasterize apps/mobile/src/static/app-icon.svg into every size the project
 * actually consumes:
 *
 *   - 144   微信小程序后台「头像」上传 (强制 144x144 PNG)
 *   - 192   PWA / H5 manifest icon
 *   - 512   PWA splash / share thumbnail
 *   - 1024  App Store / 上架预留
 *
 * Usage:
 *   pnpm add -D -w sharp
 *   node scripts/generate-icons.mjs
 *
 * Outputs land next to the SVG in apps/mobile/src/static/icon-<size>.png.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const svgPath = resolve(repoRoot, 'apps/mobile/src/static/app-icon.svg');
const outDir = resolve(repoRoot, 'apps/mobile/src/static');

const sizes = [144, 192, 512, 1024];

async function main() {
  const svg = await readFile(svgPath);
  await mkdir(outDir, { recursive: true });

  for (const size of sizes) {
    const out = resolve(outDir, `icon-${size}.png`);
    await sharp(svg, { density: 512 })
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`  wrote ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
