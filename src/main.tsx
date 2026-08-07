import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

// GitHub Pages 404 redirect handler for history-mode SPA
// When a user visits /tool/foo directly, GitHub Pages serves 404.html,
// which redirects to /?_path=/tool/foo. We restore the original URL
// BEFORE React mounts so react-router can route correctly.
(function () {
  const params = new URLSearchParams(window.location.search);
  const restoredPath = params.get('_path');
  if (restoredPath && window.location.pathname === '/') {
    params.delete('_path');
    const remaining = params.toString();
    const newUrl = restoredPath + (remaining ? '?' + remaining : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
