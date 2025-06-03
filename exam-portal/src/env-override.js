if (import.meta.env.PROD) {
  const PRODUCTION_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].startsWith('http://localhost:3000')
    ) {
      args[0] = args[0].replace('http://localhost:5000', PRODUCTION_BACKEND_URL);
    }
    return originalFetch(...args);
  };
}
