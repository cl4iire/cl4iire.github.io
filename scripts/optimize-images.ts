/**
 * Tidies and optimizes the photos uploaded through Pages CMS, then updates the content files.
 * Run: npm run optimize-images   (also run automatically by GitHub before each publication)
 *
 * 1. Tidy: a file uploaded at the root of an upload folder (public/media, public/media/projets,
 *    public/media/photos) and used in a single place is moved to its folder:
 *      project image    -> public/media/projets/<project>/        (behind the scenes: .../coulisses/)
 *      album photo      -> public/media/photos/<album>/<place>/   (article pages: .../article/)
 * 2. Optimize: every .jpg / .jpeg / .png / .tif becomes .webp (EXIF rotation, max 2560 px, quality 82),
 *    .webp larger than 2560 px are resized, file names are cleaned (no spaces, accents, upper case).
 * Every reference in content/**.json is updated.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const MEDIA = path.join(PUBLIC, 'media');
const CONTENT = path.join(ROOT, 'content');
const MAX = 2560;
const CONVERT = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff']);
// Folders where Pages CMS drops uploaded files (default browsing folders in .pages.yml)
const UPLOAD_ROOTS = ['', 'projets', 'photos'].map((d) => path.join(MEDIA, d));

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

const toUrl = (file: string) => '/' + path.relative(PUBLIC, file).split(path.sep).join('/');
const toFile = (url: string) => path.join(PUBLIC, decodeURI(url).replace(/^\/+/, ''));
const fileId = (p: string) => path.basename(String(p ?? ''), '.json');

/** Replaces every reference to the renamed files in the content files */
function updateReferences(renames: Map<string, string>) {
  if (!renames.size) return;
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

/** Free file name in dir (adds -2, -3... if taken) */
function freeTarget(dir: string, base: string, ext: string, self?: string) {
  let target = path.join(dir, `${base}${ext}`);
  for (let n = 2; target !== self && fs.existsSync(target); n++) target = path.join(dir, `${base}-${n}${ext}`);
  return target;
}

// ---------- 1. Tidy the files left at the root of an upload folder ----------
const readJson = (file: string): any => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null; // invalid file: reported by `npm run check`
  }
};
const destinations = new Map<string, Set<string>>(); // media URL -> target folders (relative to public/media)
const want = (url: unknown, folder: string) => {
  if (typeof url !== 'string' || !url.startsWith('/media/')) return;
  if (!destinations.has(url)) destinations.set(url, new Set());
  destinations.get(url)!.add(folder);
};
for (const file of walk(path.join(CONTENT, 'projets')).filter((f) => f.endsWith('.json'))) {
  const p = readJson(file);
  const id = fileId(file);
  (p?.images ?? []).forEach((u: unknown) => want(u, `projets/${id}`));
  (p?.coulisses ?? []).forEach((u: unknown) => want(u, `projets/${id}/coulisses`));
}
for (const file of walk(path.join(CONTENT, 'albums')).filter((f) => f.endsWith('.json'))) {
  const a = readJson(file);
  const id = fileId(file);
  (a?.photos ?? []).forEach((ph: any) => want(ph?.image, `photos/${id}/${cleanName(fileId(ph?.lieu)) || 'divers'}`));
  (a?.article ?? []).forEach((u: unknown) => want(u, `photos/${id}/article`));
}

const moved = new Map<string, string>();
for (const [url, folders] of destinations) {
  const file = toFile(url);
  if (!fs.existsSync(file) || !UPLOAD_ROOTS.includes(path.dirname(file))) continue; // already tidied
  if (folders.size !== 1) continue; // used in several places: left where it is
  const dir = path.join(MEDIA, [...folders][0]);
  fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(file).toLowerCase();
  const target = freeTarget(dir, cleanName(path.basename(file, path.extname(file))) || 'image', ext);
  fs.renameSync(file, target);
  moved.set(url, toUrl(target));
  console.log(`📁 ${url} -> ${toUrl(target)}`);
}
updateReferences(moved);

// ---------- 2. Convert / resize ----------
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

  const target = freeTarget(path.dirname(file), cleanName(path.basename(file, path.extname(file))) || 'image', '.webp', file);
  const buffer = await sharp(input).rotate().resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(target, buffer);
  optimized++;
  if (target !== file) {
    fs.unlinkSync(file);
    renames.set(toUrl(file), toUrl(target));
  }
  console.log(`🖼️  ${toUrl(file)} -> ${toUrl(target)} (${Math.round(buffer.length / 1024)} Ko)`);
}
updateReferences(renames);

console.log(
  moved.size || optimized
    ? `✅ ${moved.size} image(s) rangée(s), ${optimized} image(s) optimisée(s), ${renames.size} renommée(s).`
    : '✅ Aucune image à ranger ni à optimiser.'
);
