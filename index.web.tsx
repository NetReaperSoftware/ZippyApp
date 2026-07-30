import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './web/fonts.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root not found');
}

/**
 * A throw during module evaluation or first render leaves the page blank white
 * with no clue as to why, which is painful to debug on a deployed demo. Paint
 * the error into the DOM instead.
 */
function showFatal(message: string, stack?: string): void {
  container!.innerHTML = `
    <div style="font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;padding:24px;color:#b00020;max-width:720px">
      <div style="font-weight:700;margin-bottom:8px">The demo failed to start</div>
      <div style="margin-bottom:12px">${message.replace(/[<>&]/g, '')}</div>
      ${stack ? `<pre style="white-space:pre-wrap;color:#666;font-size:12px">${stack.replace(/[<>&]/g, '')}</pre>` : ''}
    </div>`;
}

window.addEventListener('error', event => {
  showFatal(event.message, event.error?.stack);
});
window.addEventListener('unhandledrejection', event => {
  showFatal(String(event.reason?.message ?? event.reason), event.reason?.stack);
});

try {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  const err = error as Error;
  showFatal(err.message, err.stack);
}
