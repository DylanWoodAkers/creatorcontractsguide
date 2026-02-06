const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_DIR = './content';
const PUBLIC_DIR = './public';

// Site config
const SITE = {
  title: 'Creator Contracts Guide',
  tagline: 'Everything creators need to know about contracts, rates, and getting paid.',
  url: 'https://creatorcontractsguide.com'
};

// Article metadata
const ARTICLES = [
  { slug: 'how-to-write-ugc-contract', file: '01-how-to-write-ugc-contract.md', title: 'How to Write a UGC Contract', category: 'Basics' },
  { slug: 'ugc-contract-template', file: '02-ugc-contract-template.md', title: 'UGC Contract Template: What to Include', category: 'Basics' },
  { slug: 'contract-clauses', file: '03-contract-clauses.md', title: '10 Clauses Every Creator Contract Needs', category: 'Basics' },
  { slug: 'brand-deal-red-flags', file: '04-brand-deal-red-flags.md', title: 'Brand Deal Red Flags', category: 'Protection' },
  { slug: 'ugc-rates', file: '05-ugc-rates-2026.md', title: 'How to Set Your UGC Rates (2026)', category: 'Money' },
  { slug: 'kill-fee', file: '06-kill-fee-clause.md', title: 'Kill Fee Clause: Why You Need One', category: 'Protection' },
  { slug: 'usage-rights', file: '07-usage-rights.md', title: 'Usage Rights Explained', category: 'Money' },
  { slug: 'best-ugc-contract-templates', file: '08-best-ugc-contract-templates.md', title: 'Best UGC Contract Templates (2026)', category: 'Tools' },
  { slug: 'influencer-vs-ugc-contract', file: '09-influencer-vs-ugc-contract.md', title: 'Influencer vs UGC Contract', category: 'Basics' },
  { slug: 'scope-creep', file: '10-scope-creep.md', title: 'How to Handle Scope Creep', category: 'Protection' },
  { slug: 'payment-terms', file: '11-payment-terms.md', title: 'Payment Terms: Net 30 vs Upfront', category: 'Money' },
  { slug: 'brand-ghosted', file: '12-brand-ghosted-creator.md', title: 'What to Do When a Brand Ghosts You', category: 'Protection' },
  { slug: 'revision-limits', file: '13-revision-limits.md', title: 'Revision Limits: How Many is Too Many?', category: 'Protection' },
  { slug: 'exclusivity-clauses', file: '14-exclusivity-clauses.md', title: 'Exclusivity Clauses: Are They Worth It?', category: 'Money' },
  { slug: 'late-payment-email', file: '15-late-payment-email.md', title: 'How to Chase Late Payments', category: 'Money' }
];

// HTML template
function template(content, { title, isHome = false }) {
  const nav = ARTICLES.map(a => 
    `<li><a href="/${a.slug}">${a.title}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${SITE.title}</title>
  <meta name="description" content="${SITE.tagline}">
  <link rel="stylesheet" href="/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="container">
      <a href="/" class="logo">${SITE.title}</a>
      <nav>
        <a href="/">Home</a>
        <a href="/best-ugc-contract-templates">Templates</a>
        <a href="/ugc-rates">Rates</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    ${content}
  </main>
  
  <footer>
    <div class="container">
      <p>© 2026 Creator Contracts Guide. Built for creators, by creators.</p>
      <p class="footer-links">
        <a href="/how-to-write-ugc-contract">Contracts</a> · 
        <a href="/ugc-rates">Rates</a> · 
        <a href="/brand-deal-red-flags">Red Flags</a>
      </p>
    </div>
  </footer>
</body>
</html>`;
}

// Generate home page
function generateHome() {
  const categories = {
    'Basics': [],
    'Money': [],
    'Protection': [],
    'Tools': []
  };
  
  ARTICLES.forEach(a => {
    if (categories[a.category]) {
      categories[a.category].push(a);
    }
  });

  const categoryHtml = Object.entries(categories).map(([cat, articles]) => `
    <div class="category">
      <h2>${cat}</h2>
      <ul>
        ${articles.map(a => `<li><a href="/${a.slug}">${a.title}</a></li>`).join('\n')}
      </ul>
    </div>
  `).join('\n');

  const content = `
    <div class="hero">
      <h1>Creator Contracts Guide</h1>
      <p class="tagline">${SITE.tagline}</p>
    </div>
    
    <div class="featured">
      <h2>Start Here</h2>
      <div class="featured-grid">
        <a href="/how-to-write-ugc-contract" class="featured-card">
          <h3>📝 How to Write a UGC Contract</h3>
          <p>Complete guide to protecting yourself in brand deals.</p>
        </a>
        <a href="/ugc-rates" class="featured-card">
          <h3>💰 UGC Rates 2026</h3>
          <p>What to charge based on content type and usage rights.</p>
        </a>
        <a href="/brand-deal-red-flags" class="featured-card">
          <h3>🚩 Brand Deal Red Flags</h3>
          <p>Warning signs that a deal will go badly.</p>
        </a>
      </div>
    </div>
    
    <div class="all-guides">
      <h2>All Guides</h2>
      <div class="categories-grid">
        ${categoryHtml}
      </div>
    </div>
  `;

  return template(content, { title: 'Home', isHome: true });
}

// Generate article page
function generateArticle(article) {
  const mdPath = path.join(CONTENT_DIR, article.file);
  const md = fs.readFileSync(mdPath, 'utf-8');
  const html = marked(md);
  
  const content = `
    <article>
      <div class="breadcrumb">
        <a href="/">Home</a> → <span>${article.category}</span>
      </div>
      ${html}
      <div class="article-footer">
        <p>Found this helpful? Check out our other guides:</p>
        <ul>
          ${ARTICLES.filter(a => a.slug !== article.slug).slice(0, 3).map(a => 
            `<li><a href="/${a.slug}">${a.title}</a></li>`
          ).join('\n')}
        </ul>
      </div>
    </article>
  `;

  return template(content, { title: article.title });
}

// CSS styles
const CSS = `
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --text: #1f2937;
  --text-light: #6b7280;
  --bg: #ffffff;
  --bg-alt: #f9fafb;
  --border: #e5e7eb;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  line-height: 1.6;
  background: var(--bg);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
header {
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 700;
  font-size: 18px;
  color: var(--text);
  text-decoration: none;
}

header nav a {
  margin-left: 24px;
  color: var(--text-light);
  text-decoration: none;
  font-size: 14px;
}

header nav a:hover {
  color: var(--primary);
}

/* Hero */
.hero {
  text-align: center;
  padding: 60px 0 40px;
}

.hero h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
}

.tagline {
  font-size: 20px;
  color: var(--text-light);
}

/* Featured */
.featured {
  margin-bottom: 48px;
}

.featured h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.featured-card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.featured-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.featured-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.featured-card p {
  font-size: 14px;
  color: var(--text-light);
}

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 32px;
}

.category h2 {
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-light);
  margin-bottom: 12px;
}

.category ul {
  list-style: none;
}

.category li {
  margin-bottom: 8px;
}

.category a {
  color: var(--text);
  text-decoration: none;
  font-size: 15px;
}

.category a:hover {
  color: var(--primary);
}

/* Article */
article {
  padding: 40px 0 60px;
}

.breadcrumb {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 24px;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

article h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}

article h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

article h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
}

article p {
  margin-bottom: 16px;
}

article ul, article ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

article li {
  margin-bottom: 8px;
}

article blockquote {
  background: var(--bg-alt);
  border-left: 4px solid var(--primary);
  padding: 16px 20px;
  margin: 24px 0;
  border-radius: 0 8px 8px 0;
}

article code {
  background: var(--bg-alt);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

article pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
}

article pre code {
  background: none;
  padding: 0;
}

article table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
}

article th, article td {
  border: 1px solid var(--border);
  padding: 12px;
  text-align: left;
}

article th {
  background: var(--bg-alt);
  font-weight: 600;
}

article strong {
  font-weight: 600;
}

article a {
  color: var(--primary);
}

article hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 48px 0;
}

.article-footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.article-footer ul {
  list-style: none;
  padding-left: 0;
}

/* Footer */
footer {
  border-top: 1px solid var(--border);
  padding: 40px 0;
  margin-top: 60px;
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
}

.footer-links {
  margin-top: 12px;
}

.footer-links a {
  color: var(--text-light);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--primary);
}

/* Responsive */
@media (max-width: 640px) {
  .hero h1 {
    font-size: 32px;
  }
  
  article h1 {
    font-size: 28px;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
}
`;

// Build
function build() {
  // Ensure public dir exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Write CSS
  fs.writeFileSync(path.join(PUBLIC_DIR, 'styles.css'), CSS);
  console.log('✓ styles.css');

  // Write home page
  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), generateHome());
  console.log('✓ index.html');

  // Write article pages
  ARTICLES.forEach(article => {
    const html = generateArticle(article);
    const articleDir = path.join(PUBLIC_DIR, article.slug);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }
    fs.writeFileSync(path.join(articleDir, 'index.html'), html);
    console.log('✓ ' + article.slug + '/index.html');
  });

  console.log('\n✅ Built ' + (ARTICLES.length + 1) + ' pages');
}

build();
