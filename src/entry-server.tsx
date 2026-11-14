import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.tsx';

/** HTML of the whole page in French, inserted into dist/index.html by scripts/prerender.ts */
export function render() {
  return renderToString(
    <StrictMode>
      <App ssrLang="FR" />
    </StrictMode>,
  );
}
