/**
 * Media files (public/media) that are used nowhere in the content: photos removed from an album or a project
 * stay in the media library (and online at their direct address) until they are deleted.
 *
 * - `npm run check` reports them (one warning + the full list in the publication summary), never deletes them.
 * - `npm run media-inutilises` lists them; `npm run media-inutilises -- --supprimer` deletes them (then commit + push).
 *   They can also be deleted one by one in Pages CMS (Médias > Images > ⋮ > Delete).
 * A file used by a hidden project or album ("masquer") counts as used.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ROOT = path.resolve(import.meta.dirname, '..');

const walk = (dir: string): string[] =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
    : [];

/** Every "/media/..." path written anywhere in content/*.json */
function referencedMedia(root: string): Set<string> {
  const used = new Set<string>();
  const collect = (v: unknown) => {
    if (typeof v === 'string') {
      if (v.startsWith('/media/')) {
        used.add(v);
        try {
          used.add(decodeURI(v));
        } catch {}
      }
    } else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object') Object.values(v).forEach(collect);
  };
  for (const file of walk(path.join(root, 'content')).filter((f) => f.endsWith('.json'))) {
    try {
      collect(JSON.parse(fs.readFileSync(file, 'utf8')));
    } catch {
      // invalid file: reported by `npm run check`
    }
  }
  return used;
}

export type UnusedMedia = { url: string; file: string; kb: number };

export function findUnusedMedia(root = ROOT): UnusedMedia[] {
  const used = referencedMedia(root);
  const publicDir = path.join(root, 'public');
  return walk(path.join(publicDir, 'media'))
    .filter((f) => !path.basename(f).startsWith('.'))
    .map((f) => ({ url: '/' + path.relative(publicDir, f).split(path.sep).join('/'), file: f, kb: Math.round(fs.statSync(f).size / 1024) }))
    .filter((m) => !used.has(m.url))
    .sort((a, b) => a.url.localeCompare(b.url));
}

// ---------- Command line ----------
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const unused = findUnusedMedia();
  const total = unused.reduce((s, m) => s + m.kb, 0);
  if (!unused.length) {
    console.log('✅ Aucun média inutilisé.');
  } else {
    console.log(`${unused.length} média(s) utilisé(s) nulle part (${(total / 1024).toFixed(1)} Mo) :`);
    unused.forEach((m) => console.log(`  ${String(m.kb).padStart(5)} Ko  ${m.url}`));
    if (process.argv.includes('--supprimer')) {
      for (const m of unused) fs.unlinkSync(m.file);
      // Remove the folders left empty
      const dirs = [...new Set(unused.map((m) => path.dirname(m.file)))].sort((a, b) => b.length - a.length);
      for (const d of dirs) if (fs.existsSync(d) && fs.readdirSync(d).length === 0) fs.rmdirSync(d);
      console.log(`\n🗑️  ${unused.length} fichier(s) supprimé(s). Vérifier avec « git status », puis commit + push.`);
    } else {
      console.log('\nPour les supprimer : npm run media-inutilises -- --supprimer');
    }
  }
}
