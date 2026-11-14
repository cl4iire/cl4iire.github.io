/**
 * Pre-renders the page: inserts the full HTML of the site (in French) into dist/index.html.
 * Search engines, link previews and AI assistants (ChatGPT, Perplexity, Claude...) can then read
 * the content without running JavaScript. In the browser, React takes over this HTML (src/main.tsx).
 * Run by `npm run build`, after the client build and the server build (dist-ssr/).
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ROOT = path.resolve(import.meta.dirname, '..');
const SSR_DIR = path.join(ROOT, 'dist-ssr');
const INDEX = path.join(ROOT, 'dist/index.html');
const PLACEHOLDER = '<div id="root"></div>';

const { render } = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.js')).href);
const html: string = render();

const page = fs.readFileSync(INDEX, 'utf8');
if (!page.includes(PLACEHOLDER)) throw new Error(`dist/index.html : « ${PLACEHOLDER} » introuvable`);
fs.writeFileSync(INDEX, page.replace(PLACEHOLDER, `<div id="root">${html}</div>`));
fs.rmSync(SSR_DIR, { recursive: true, force: true });

const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log(`✅ Page pré-rendue : ${Math.round(html.length / 1024)} Ko de HTML, ${text.split(' ').length} mots lisibles sans JavaScript.`);
