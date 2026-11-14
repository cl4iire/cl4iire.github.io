/**
 * Generates the site icons and the link preview image from the images chosen in Pages CMS (content/reglages.json).
 * Run: npm run icons   (also run automatically by GitHub before each publication)
 *
 * "favicon"        -> public/favicon.ico (16/32/48), favicon-48/96/192.png, apple-touch-icon.png (180), favicon.svg
 *                     square, multiples of 48 px as recommended by Google; a non-square image is cropped in the centre
 * "image_partage"  -> public/og-image.jpg, 1200 x 630 (preview when the link is shared on WhatsApp, LinkedIn...)
 * A file is only rewritten when its content changes (no useless commit).
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const settings = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/reglages.json'), 'utf8'));
const media = (url: string) => path.join(PUBLIC, decodeURI(String(url)).replace(/^\/+/, ''));

let written = 0;
function write(name: string, data: Buffer | string) {
  const file = path.join(PUBLIC, name);
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buffer)) return;
  fs.writeFileSync(file, buffer);
  written++;
  console.log(`🖼️  public/${name} mis à jour`);
}

/** Missing or invalid source: keep the current files and let `npm run check` report it */
function source(field: string): Buffer | null {
  const url = settings[field];
  if (!url || !fs.existsSync(media(url))) {
    console.log(`⚠️  Réglages, ${field} : image introuvable (« ${url ?? ''} »), fichiers actuels conservés`);
    return null;
  }
  return fs.readFileSync(media(url));
}

// ---------- Favicon ----------
const icon = source('favicon');
if (icon) {
  const square = (size: number) => sharp(icon).rotate().resize(size, size, { fit: 'cover', position: 'centre' }).png({ compressionLevel: 9, palette: size <= 96 }).toBuffer();
  write('favicon-48.png', await square(48));
  write('favicon-96.png', await square(96));
  write('favicon-192.png', await square(192));
  write('apple-touch-icon.png', await square(180));

  // .ico container holding PNG images (16, 32, 48)
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map(square));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = pngs.map((png, i) => {
    const e = Buffer.alloc(16);
    e[0] = sizes[i];
    e[1] = sizes[i];
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  write('favicon.ico', Buffer.concat([header, ...entries, ...pngs]));

  // SVG wrapper (preferred by some browsers)
  const svgPng = (await square(64)).toString('base64');
  write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image href="data:image/png;base64,${svgPng}" width="64" height="64"/></svg>\n`);
}

// ---------- Link preview image ----------
const share = source('image_partage');
if (share) {
  // "attention" keeps the most detailed part of the image (faces, subject) when cropping to 1200 x 630
  write('og-image.jpg', await sharp(share).rotate().resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 85, mozjpeg: true }).toBuffer());
}

console.log(written ? `✅ ${written} fichier(s) d'icône ou de partage mis à jour.` : '✅ Icônes et image de partage déjà à jour.');
