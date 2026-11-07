const fs = require('fs');

const baseHtml = fs.readFileSync('dist/index.html', 'utf8');

// Function to generate automated preview HTML files
function createVariant(filename, injectionScript) {
  const content = baseHtml.replace(
    '</body>',
    `<script>
      window.addEventListener('load', () => {
        setTimeout(async () => {
          ${injectionScript}
        }, 1200);
      });
    </script></body>`
  );
  fs.writeFileSync(`dist/${filename}`, content, 'utf8');
  console.log(`Created dist/${filename}`);
}

// 1. Book Details Modal
createVariant('view_book_modal.html', `
  const card = document.querySelector('.book-card');
  if (card) card.click();
`);

// 2. Login Portal Modal
createVariant('view_login_modal.html', `
  const loginBtn = document.querySelector('button[title*="Sign in"]') || document.querySelector('.action-btn.outline-btn');
  if (loginBtn) loginBtn.click();
`);

// 3. Admin Profile Modal (Login first then open profile)
createVariant('view_admin_profile.html', `
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername: 'admin@library.edu', password: 'admin123' })
    });
    const data = await res.json();
    if (data.token) {
      sessionStorage.setItem('davp_auth_session_token_v2', data.token);
      location.hash = '#profile';
      location.reload();
    }
  } catch(e) { console.error(e); }
`);

// 4. Student Management & Excel Audit Log Modal
createVariant('view_student_mgmt.html', `
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername: 'admin@library.edu', password: 'admin123' })
    });
    const data = await res.json();
    if (data.token) {
      sessionStorage.setItem('davp_auth_session_token_v2', data.token);
      location.hash = '#students';
      location.reload();
    }
  } catch(e) { console.error(e); }
`);

// 5. Analytics Tab: Stock & Availability (Donut & Shelf Sections)
createVariant('view_analytics_copies.html', `
  const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.includes('Stock & Availability'));
  if (tabBtn) tabBtn.click();
  const el = document.getElementById('analytics');
  if (el) el.scrollIntoView();
`);

// 6. Analytics Tab: Publication Timeline
createVariant('view_analytics_timeline.html', `
  const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.includes('Publication Timeline'));
  if (tabBtn) tabBtn.click();
  const el = document.getElementById('analytics');
  if (el) el.scrollIntoView();
`);

// 7. Analytics Tab: Financial Valuation Portfolio
createVariant('view_analytics_valuation.html', `
  const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.includes('Financial Allocation'));
  if (tabBtn) tabBtn.click();
  const el = document.getElementById('analytics');
  if (el) el.scrollIntoView();
`);

// 8. Analytics Tab: 1.5x IQR Statistical Outliers
createVariant('view_analytics_iqr.html', `
  const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.includes('1.5×IQR'));
  if (tabBtn) tabBtn.click();
  const el = document.getElementById('analytics');
  if (el) el.scrollIntoView();
`);
