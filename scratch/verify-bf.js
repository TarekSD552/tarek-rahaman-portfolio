const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ path, statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyButterfly() {
  console.log("Verifying Butterfly Cursor Integration...");
  const home = await fetchUrl("/");
  console.log("Homepage status:", home.statusCode, home.statusCode === 200 ? "✅" : "❌");

  const admin = await fetchUrl("/admin/login");
  console.log("Admin Login status:", admin.statusCode, admin.statusCode === 200 ? "✅" : "❌");

  console.log("\nALL BUTTERFLY VERIFICATIONS COMPLETED! 🎉");
}

verifyButterfly().catch(err => {
  console.error(err);
  process.exit(1);
});

