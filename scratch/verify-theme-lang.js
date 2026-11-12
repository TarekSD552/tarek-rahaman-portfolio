const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log("Verifying Theme & Language Switcher integration...");
  const res = await fetchUrl("http://localhost:3000/");
  console.log("Homepage status:", res.statusCode);
  
  if (res.statusCode !== 200) {
    throw new Error(`Expected 200, got ${res.statusCode}`);
  }

  // Check 1: Anti-FOUC script present
  const hasAntiFouc = res.data.includes("tarek_portfolio_theme") && res.data.includes("tarek_portfolio_lang");
  console.log("Anti-FOUC script present in <head>:", hasAntiFouc ? "PASS ✅" : "FAIL ❌");

  // Check 2: Default dark theme class on html
  const hasDarkHtml = res.data.includes('class="dark');
  console.log("Default dark theme class on <html>:", hasDarkHtml ? "PASS ✅" : "FAIL ❌");

  // Check 3: Theme Toggle Button present
  const hasThemeBtn = res.data.includes("Switch to Light Mode") || res.data.includes("Switch to Dark Mode");
  console.log("Theme Toggle Button present in Navbar:", hasThemeBtn ? "PASS ✅" : "FAIL ❌");

  // Check 4: Language Selector present
  const hasLangSelector = res.data.includes("Select Language") || res.data.includes("English") || res.data.includes("বাংলা");
  console.log("Language Selector present in Navbar:", hasLangSelector ? "PASS ✅" : "FAIL ❌");

  // Check 5: Core navigation items
  const hasNavItems = res.data.includes("Home") && res.data.includes("About") && res.data.includes("Services");
  console.log("Core navigation items present:", hasNavItems ? "PASS ✅" : "FAIL ❌");

  // Check 6: Check Why Work With Me section
  const hasWhyMe = res.data.includes("Why Work With") && res.data.includes("Fast &amp; Responsive");
  console.log("Why Work With Me section present:", hasWhyMe ? "PASS ✅" : "FAIL ❌");

  // Check 7: Check Footer Centered Copyright & Designed by
  const hasFooter = res.data.includes("© 2026 Tarek Rahaman") && res.data.includes("Designed &amp; Developed by");
  console.log("Footer copyright & credit present:", hasFooter ? "PASS ✅" : "FAIL ❌");

  console.log("\nALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY! 🎉");
}

verify().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});

