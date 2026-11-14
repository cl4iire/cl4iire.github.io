import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App, {initialLang} from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The page is pre-rendered in French at build time (scripts/prerender.ts), so search engines and AI
// read the content without running JavaScript. French visitors: React takes over this HTML (hydration).
// Other languages: the page is rendered again in the visitor's language.
if (container.hasChildNodes() && initialLang() === 'FR') {
  hydrateRoot(container, app);
} else {
  container.textContent = '';
  createRoot(container).render(app);
}
