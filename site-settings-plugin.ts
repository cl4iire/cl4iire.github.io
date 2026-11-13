import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Applies content/reglages.json (edited with Pages CMS) to index.html:
 * Google title / description, font and colour theme.
 * The lists below must match the choices offered in .pages.yml.
 */

// Font name (as shown in the CMS) -> Google Fonts "family" parameter
export const FONTS: Record<string, string> = {
  'Bricolage Grotesque': 'Bricolage+Grotesque:opsz,wght@12..96,400..800',
  'Space Grotesk': 'Space+Grotesk:wght@400..700',
  'DM Sans': 'DM+Sans:opsz,wght@9..40,400..800',
  Archivo: 'Archivo:wght@400..800',
  'Instrument Sans': 'Instrument+Sans:wght@400..700',
};

// Theme id -> background colour (browser bar colour); the palettes themselves are in src/index.css
export const THEMES: Record<string, string> = {
  rose: '#F0BCC0',
  bleu: '#BFD3EE',
  vert: '#C4E2C7',
  sable: '#EFDDBF',
};

const DEFAULTS = {
  seo: {
    titre: 'Claire Buhaceanu Laborde',
    description: 'Portfolio de Claire Buhaceanu Laborde.',
  },
  police: 'Bricolage Grotesque',
  theme: 'rose',
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function readSettings(root: string) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(root, 'content/reglages.json'), 'utf8'));
    return {
      seo: { ...DEFAULTS.seo, ...(raw.seo ?? {}) },
      police: FONTS[raw.police] ? raw.police : DEFAULTS.police,
      theme: THEMES[raw.theme] ? raw.theme : DEFAULTS.theme,
    };
  } catch {
    return DEFAULTS;
  }
}

export function siteSettingsPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: 'site-settings',
    configResolved(config) {
      root = config.root;
    },
    // Reload the page when the settings change (index.html is not hot-reloaded otherwise)
    configureServer(server) {
      const file = path.join(root, 'content/reglages.json');
      server.watcher.add(file);
      server.watcher.on('change', (changed) => {
        if (path.resolve(changed) === path.resolve(file)) server.ws.send({ type: 'full-reload' });
      });
    },
    transformIndexHtml(html) {
      const s = readSettings(root);
      const fontLink = `<link href="https://fonts.googleapis.com/css2?family=${FONTS[s.police]}&display=swap" rel="stylesheet" />`;
      // Unlayered :root rule: wins over Tailwind's theme layer
      const fontStyle = `<style>:root{--font-sans:"${s.police}",ui-sans-serif,system-ui,sans-serif}</style>`;
      return html
        .replace(/__SEO_TITLE__/g, escapeHtml(s.seo.titre))
        .replace(/__SEO_DESCRIPTION__/g, escapeHtml(s.seo.description))
        .replace(/__THEME__/g, s.theme)
        .replace(/__THEME_COLOR__/g, THEMES[s.theme])
        .replace('<!--__FONT__-->', `${fontLink}\n    ${fontStyle}`);
    },
  };
}
