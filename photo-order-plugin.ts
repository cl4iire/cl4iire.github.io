import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Dev-only endpoint used by the photo order editor (`?editor`).
 * POST /__photo-order { albumId, order } rewrites the `order: [...]` array of
 * src/data/projects/photographies/<albumId>.ts - Vite then hot-reloads the site.
 * Not part of the production build (GitHub Pages is static, nothing can be written there).
 */
export function photoOrderPlugin(): Plugin {
  return {
    name: 'photo-order-editor',
    apply: 'serve',
    configureServer(server) {
      const metaDir = path.resolve(server.config.root, 'src/data/projects/photographies');

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
            // Only album ids and photo keys made of safe characters: no path traversal, no quote injection
            if (typeof albumId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(albumId)) throw new Error('albumId invalide');
            if (!Array.isArray(order) || !order.every((k) => typeof k === 'string' && /^[\w\-. ()/]+$/.test(k) && !k.includes('..'))) {
              throw new Error('order invalide');
            }
            const file = path.join(metaDir, `${albumId}.ts`);
            if (!fs.existsSync(file)) throw new Error(`Fichier introuvable : ${albumId}.ts`);

            const src = fs.readFileSync(file, 'utf8');
            const eol = src.includes('\r\n') ? '\r\n' : '\n';
            const block = `order: [${eol}${order.map((k: string) => `    '${k}',`).join(eol)}${eol}  ]`;
            const next = /order:\s*\[[\s\S]*?\]/.test(src)
              ? src.replace(/order:\s*\[[\s\S]*?\]/, block)
              : src.replace(/(\r?\n)\};(\s*\r?\n\s*export default)/, `$1  ${block},$1};$2`);
            if (next === src && !src.includes(block)) throw new Error('Impossible de placer le tableau order dans le fichier');

            fs.writeFileSync(file, next);
            reply(200, { ok: true, file: `src/data/projects/photographies/${albumId}.ts` });
          } catch (e) {
            reply(400, { ok: false, error: (e as Error).message });
          }
        });
      });
    },
  };
}
