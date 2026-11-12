const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ path, statusCode: res.statusCode }));
    }).on('error', reject);
  });
}

async function verifyAllRoutes() {
  const routes = ['/', '/about', '/services', '/skills', '/portfolio', '/contact', '/admin/login'];
  for (const route of routes) {
    const res = await fetchUrl(route);
    console.log(`Route ${route.padEnd(16)} : HTTP ${res.statusCode} ${res.statusCode === 200 ? '✅' : '❌'}`);
    if (res.statusCode !== 200) {
      throw new Error(`Route ${route} failed with status ${res.statusCode}`);
    }
  }
  console.log("\nAll major routes returned HTTP 200 OK! 🎉");
}

verifyAllRoutes().catch((err) => {
  console.error(err);
  process.exit(1);
});

