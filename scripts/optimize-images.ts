/**
 * Converts the photos uploaded through Pages CMS (JPG, PNG...) into WebP and updates the content files.
 * Run: npm run optimize-images   (also run automatically by GitHub before each publication)
 *
 * - every .jpg / .jpeg / .png / .tif in public/media -> .webp (EXIF rotation applied, max 2560 px, quality 82)
 * - .webp wider or taller than 2560 px are resized
 * - file names are cleaned (no spaces, accents, upper case)
 * - every reference in content/**.json is updated, then the original file is deleted
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const MEDIA = path.join(ROOT, 'public/media');
const CONTENT = path.join(ROOT, 'content');
const MAX = 2560;
const CONVERT = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff']);

const walk = (dir: string): string[] =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
    : [];

const cleanName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’\s]+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const toUrl = (file: string) => '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');

const renames = new Map<string, string>(); // old URL -> new URL
let optimized = 0;

for (const file of walk(MEDIA)) {
  const ext = path.extname(file).toLowerCase();
  const isWebp = ext === '.webp';
  if (!CONVERT.has(ext) && !isWebp) continue;

  // Read into memory first: on Windows sharp keeps the file open, so it could not be rewritten in place
  const input = fs.readFileSync(file);
  const meta = await sharp(input).metadata();
  const tooBig = (meta.width ?? 0) > MAX || (meta.height ?? 0) > MAX;
  if (isWebp && !tooBig) continue;

  const dir = path.dirname(file);
  let base = cleanName(path.basename(file, path.extname(file))) || 'image';
  let target = path.join(dir, `${base}.webp`);
  for (let n = 2; target !== file && fs.existsSync(target); n++) target = path.join(dir, `${base}-${n}.webp`);

  const buffer = await sharp(input).rotate().resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(target, buffer);
  optimized++;
  if (target !== file) fs.unlinkSync(file);
  if (target !== file) renames.set(toUrl(file), toUrl(target));
  console.log(`🖼️  ${toUrl(file)} -> ${toUrl(target)} (${Math.round(buffer.length / 1024)} Ko)`);
}

// Update every reference in the content files (also URL-encoded ones, e.g. spaces -> %20)
if (renames.size) {
  for (const file of walk(CONTENT).filter((f) => f.endsWith('.json'))) {
    const before = fs.readFileSync(file, 'utf8');
    let after = before;
    for (const [from, to] of renames) {
      for (const variant of new Set([from, encodeURI(from)])) after = after.split(JSON.stringify(variant)).join(JSON.stringify(to));
    }
    if (after !== before) {
      fs.writeFileSync(file, after);
      console.log(`📝 ${path.relative(ROOT, file)} mis à jour`);
    }
  }
}
console.log(optimized ? `✅ ${optimized} image(s) optimisée(s), ${renames.size} renommée(s).` : '✅ Aucune image à optimiser.');
