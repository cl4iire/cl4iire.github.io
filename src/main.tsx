import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Self-hosted fonts (eliminates Google Fonts render-blocking request)
import '@fontsource/bebas-neue';
import '@fontsource/space-grotesk/300.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/courier-prime/400-italic.css';
import '@fontsource/courier-prime/700-italic.css';

// Hidden photo order editor: <site>/?editor (loaded only on that page)
const PhotoOrderEditor = lazy(() => import('./components/PhotoOrderEditor'));
const isEditor = new URLSearchParams(window.location.search).has('editor');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isEditor ? <Suspense fallback={null}><PhotoOrderEditor /></Suspense> : <App />}
  </StrictMode>,
);
