import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Dev-only endpoint used by the photo order editor (`?editor`).
 * POST /__photo-order { albumId, order } reorders the "photos" list of
 * content/albums/<albumId>.json (order = image paths) - Vite then hot-reloads the site.
 * Not part of the production build (GitHub Pages is static, nothing can be written there).
 */
export function photoOrderPlugin(): Plugin {
  return {
    name: 'photo-order-editor',
    apply: 'serve',
    configureServer(server) {
      const albumsDir = path.resolve(server.config.root, 'content/albums');

      server.middlewares.use('/__photo-order', (req, res) => {
        const reply = (status: number, data: object) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };
        if (req.method !== 'POST') return reply(405, { ok: false, error: 'POST only' });

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
          if (body.length > 1_000_000) req.destroy();
        });
        req.on('end', () => {
          try {
            const { albumId, order } = JSON.parse(body);
            // Album ids made of safe characters only: no path traversal
            if (typeof albumId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(albumId)) throw new Error('albumId invalide');
            if (!Array.isArray(order) || !order.every((k) => typeof k === 'string')) throw new Error('order invalide');
            const file = path.join(albumsDir, `${albumId}.json`);
            if (!fs.existsSync(file)) throw new Error(`Fichier introuvable : ${albumId}.json`);

            const raw = fs.readFileSync(file, 'utf8');
            const album = JSON.parse(raw);
            const photos: { image: string }[] = album.photos ?? [];
            const byImage = new Map(photos.map((p) => [p.image, p]));
            // The new order must contain exactly the same photos (nothing added, nothing lost)
            if (order.length !== photos.length || new Set(order).size !== order.length || !order.every((k: string) => byImage.has(k))) {
              throw new Error("La liste reçue ne correspond pas aux photos de l'album (rechargez la page)");
            }
            album.photos = order.map((k: string) => byImage.get(k));

            const eol = raw.includes('\r\n') ? '\r\n' : '\n';
            fs.writeFileSync(file, JSON.stringify(album, null, 2).split('\n').join(eol) + eol);
            reply(200, { ok: true, file: `content/albums/${albumId}.json` });
          } catch (e) {
            reply(400, { ok: false, error: (e as Error).message });
          }
        });
      });
    },
  };
}
