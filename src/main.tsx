import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';


// Hidden photo order editor: <site>/?editor (loaded only on that page)
const PhotoOrderEditor = lazy(() => import('./components/PhotoOrderEditor'));
const isEditor = new URLSearchParams(window.location.search).has('editor');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isEditor ? <Suspense fallback={null}><PhotoOrderEditor /></Suspense> : <App />}
  </StrictMode>,
);
