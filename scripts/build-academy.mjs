// Builds the Health Site Academy as static, crawlable HTML after `vite build`.
// Source: content/academy/categories.json + content/academy/articles/*.md (front matter + Markdown).
// Output: dist/academy/index.html, dist/academy/<category>/index.html,
//         dist/academy/<category>/<slug>/index.html, dist/academy/search.json,
//         dist/sitemap.xml (whole site) and dist/robots.txt.
// To add an article: drop a new .md file in content/academy/articles and push. Nothing else to edit.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'content', 'academy');
const DIST = join(ROOT, 'dist');
const SITE = 'https://internethealthsite.com';
const BRAND = 'The Internet Health Site';
const FRIENDS_CTA = 'Become friends with The Internet Health Site. A little help along the way';
const OG_IMAGE = `${SITE}/community-group.png`;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail = (msg) => { console.error(`academy: ${msg}`); process.exit(1); };

// ---------- load content ----------
const categories = JSON.parse(readFileSync(join(SRC, 'categories.json'), 'utf8'));
const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

function parseArticle(file) {
  const raw = readFileSync(join(SRC, 'articles', file), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) fail(`${file}: missing front matter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (v.startsWith('[')) v = JSON.parse(v);
    else v = v.replace(/^["']|["']$/g, '');
    meta[k] = v;
  }
  for (const k of ['title', 'slug', 'category', 'description']) if (!meta[k]) fail(`${file}: missing ${k}`);
  if (!catBySlug[meta.category]) fail(`${file}: unknown category ${meta.category}`);
  return { ...meta, related: meta.related || [], readMinutes: Number(meta.readMinutes) || 6, updated: meta.updated || '2026-11-13', body: m[2].trim() };
}

const articleDir = join(SRC, 'articles');
const articles = existsSync(articleDir) ? readdirSync(articleDir).filter((f) => f.endsWith('.md')).sort().map(parseArticle) : [];
const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
const urlFor = (a) => `/academy/${a.category}/${a.slug}/`;
const catUrl = (c) => `/academy/${c.slug}/`;
const inCat = (slug) => articles.filter((a) => a.category === slug);

// ---------- markdown -> html (with academy: links, heading ids, FAQ extraction) ----------
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function render(a) {
  const md = a.body.replace(/\]\(academy:([a-z0-9-]+)\)/g, (_, s) => {
    if (!bySlug[s]) fail(`${a.slug}: link to unknown article ${s}`);
    return `](${urlFor(bySlug[s])})`;
  });
  const toc = [];
  const faq = [];
  const tokens = marked.lexer(md);
  // FAQ: ### questions after a "Frequently asked questions" h2, answer = following paragraphs/lists
  let inFaq = false, cur = null;
  for (const t of tokens) {
    if (t.type === 'heading' && t.depth === 2) { inFaq = /frequently asked|faq/i.test(t.text); cur = null; continue; }
    if (!inFaq) continue;
    if (t.type === 'heading' && t.depth === 3) { cur = { q: t.text, a: [] }; faq.push(cur); continue; }
    if (cur && t.raw.trim()) cur.a.push(t.raw.trim());
  }
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens: tk, depth }) {
    const text = this.parser.parseInline(tk);
    const id = slugify(text);
    if (depth === 2) toc.push({ id, text });
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  renderer.link = function ({ href, title, tokens: tk }) {
    const text = this.parser.parseInline(tk);
    const ext = /^https?:/.test(href) && !href.startsWith(SITE);
    return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' rel="noopener" target="_blank"' : ''}>${text}</a>`;
  };
  renderer.table = function (token) {
    // wrap tables so they scroll sideways on phones instead of widening the page
    return `<div class="table-wrap">${marked.Renderer.prototype.table.call(this, token)}</div>`;
  };
  const html = marked.parser(tokens, { renderer });
  const plain = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();
  const words = plain(md).split(' ').length;
  return { html, toc, faq: faq.filter((f) => f.a.length).map((f) => ({ q: plain(f.q), a: plain(f.a.join(' ')) })), words };
}

// ---------- shared layout ----------
const CSS = `
:root{color-scheme:only light;--ink:#16123A;--ink-2:#2A2050;--paper:#FFF8F0;--card:#FFFFFF;--line:#EADFD2;--muted:#5B5470;--accent:#B91C1C;--accent-2:#9A1515;--focus:#2563EB}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 Figtree,system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:var(--accent);text-underline-offset:3px}a:hover{color:var(--accent-2)}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px;border-radius:6px}
h1,h2,h3{font-family:"Bricolage Grotesque",Figtree,system-ui,sans-serif;line-height:1.2;color:var(--ink);letter-spacing:-.01em}
.wrap{max-width:1120px;margin:0 auto;padding:0 16px}
.top{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:60px}
.brand{display:flex;align-items:center;gap:8px;font-weight:800;color:var(--ink);text-decoration:none;font-size:16px;line-height:1.1}
.brand svg{flex:none}
.nav{display:flex;align-items:center;gap:6px}
.nav a{font-weight:700;font-size:15px;text-decoration:none;color:var(--ink);padding:8px 10px;border-radius:999px}
.nav a:hover{background:#F3ECE3;color:var(--ink)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;text-decoration:none;border-radius:999px;padding:12px 20px;line-height:1.2;border:2px solid transparent;text-align:center}
.btn-dark{background:var(--ink);color:#fff!important}.btn-dark:hover{background:var(--ink-2);color:#fff}
.btn-red{background:var(--accent);color:#fff!important}.btn-red:hover{background:var(--accent-2);color:#fff}
.btn-light{background:#fff;color:var(--ink)!important;border-color:#fff}.btn-light:hover{background:#F3ECE3}
.btn-ghost{background:transparent;color:#fff!important;border-color:rgba(255,255,255,.85)}.btn-ghost:hover{background:rgba(255,255,255,.12)}
.nav .btn{padding:9px 16px;font-size:14px}
@media (max-width:640px){.nav .hide-sm{display:none}.brand span{max-width:120px}}
@media (max-width:440px){.nav .hide-xs{display:none}.brand{font-size:15px}}
.nav .btn{white-space:nowrap}
.crumbs{font-size:14px;color:var(--muted);margin:20px 0 6px}.crumbs ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:4px}
.crumbs li+li:before{content:"/";margin-right:4px;color:#A69C8F}.crumbs a{color:var(--muted)}
.hero{padding:28px 0 8px}.hero h1{font-size:clamp(32px,6vw,56px);margin:6px 0 12px}
.eyebrow{display:inline-block;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
.lede{font-size:clamp(18px,2.2vw,21px);color:#3A3452;max-width:720px;margin:0 0 18px}
.search{display:flex;gap:8px;max-width:640px;margin:18px 0 8px}
.search input{flex:1;min-width:0;font:inherit;padding:14px 16px;border:2px solid #CFC3B4;border-radius:14px;background:#fff;color:var(--ink)}
.search input:focus{border-color:var(--ink);outline:none;box-shadow:0 0 0 3px rgba(37,99,235,.25)}
.shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin:22px 0 10px}
.shelf a{display:flex;flex-direction:column;gap:4px;background:var(--card);border:1px solid var(--line);border-left:10px solid var(--c);border-radius:14px;padding:16px 16px 14px;text-decoration:none;color:var(--ink);transition:transform .15s,box-shadow .15s}
.shelf a:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(22,18,58,.08);color:var(--ink)}
.shelf strong{font-family:"Bricolage Grotesque",sans-serif;font-size:19px}.shelf span{color:var(--muted);font-size:15px}
.shelf em{font-style:normal;font-size:13px;font-weight:800;color:var(--c);margin-top:4px}
h2.sec{font-size:clamp(24px,3.4vw,32px);margin:40px 0 6px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.chips button{font:inherit;font-size:14px;font-weight:700;border:2px solid #CFC3B4;background:#fff;color:var(--ink);border-radius:999px;padding:7px 14px;cursor:pointer}
.chips button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:#fff}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px;margin:16px 0 8px}
.card{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;text-decoration:none;color:var(--ink);transition:transform .15s,box-shadow .15s}
.card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(22,18,58,.09);color:var(--ink)}
.card .tag{align-self:flex-start;background:var(--c);color:#fff;font-size:12px;font-weight:800;border-radius:999px;padding:3px 10px;margin-bottom:10px}
.card h3{font-size:19px;margin:0 0 6px}.card p{margin:0 0 12px;color:#4A4462;font-size:15px;line-height:1.55}
.card .meta{margin-top:auto;font-size:13px;color:var(--muted);font-weight:700}
.empty{display:none;color:var(--muted)}
.band{background:var(--ink);color:#fff;border-radius:22px;padding:28px 22px;margin:44px 0}
.band h2{color:#fff;margin:0 0 8px;font-size:clamp(22px,3vw,30px)}.band p{color:#E4E0F2;margin:0 0 18px;max-width:640px}
.band .row{display:flex;flex-wrap:wrap;gap:10px}
.start{counter-reset:s;display:grid;gap:10px;margin:14px 0;padding:0;list-style:none}
.start li{counter-increment:s;background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px 14px 58px;position:relative}
.start li:before{content:counter(s);position:absolute;left:14px;top:12px;width:32px;height:32px;border-radius:50%;background:var(--accent);color:#fff;font-weight:800;display:grid;place-items:center}
.start a{font-weight:800}
/* article */
.art{display:grid;grid-template-columns:minmax(0,1fr);gap:32px}
@media (min-width:1000px){.art{grid-template-columns:minmax(0,720px) 280px;justify-content:space-between}}
.art h1{font-size:clamp(30px,5vw,46px);margin:8px 0 10px}
.byline{color:var(--muted);font-size:15px;margin:0 0 20px}
.prose h2{font-size:clamp(23px,3vw,29px);margin:38px 0 10px;scroll-margin-top:80px}
.prose h3{font-size:20px;margin:26px 0 6px;scroll-margin-top:80px}
.prose p,.prose li{color:#27213F}.prose ul,.prose ol{padding-left:22px}.prose li{margin:4px 0}
.prose strong{color:var(--ink)}
.prose blockquote{margin:18px 0;padding:12px 16px;border-left:5px solid var(--accent);background:#fff;border-radius:0 12px 12px 0}
.table-wrap{overflow-x:auto;margin:16px 0;border:1px solid var(--line);border-radius:12px;background:#fff}
.prose table{border-collapse:collapse;width:100%;font-size:15px}.prose th,.prose td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.prose th{background:#F6EFE6}
.side{position:relative}
.toc{position:sticky;top:84px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px 18px}
.toc strong{display:block;font-size:14px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.toc ol{margin:0;padding-left:18px;font-size:15px}.toc li{margin:5px 0}.toc a{color:var(--ink)}
.toc .btn{width:100%;margin-top:14px;font-size:15px}
@media (max-width:999px){.toc{position:static}}
.cta{background:#fff;border:2px solid var(--ink);border-radius:18px;padding:22px;margin:36px 0}
.cta h2{margin:0 0 6px;font-size:24px}.cta p{margin:0 0 14px}.cta .row{display:flex;flex-wrap:wrap;gap:10px}
.note{font-size:14px;color:var(--muted);border-top:1px solid var(--line);padding-top:14px;margin-top:28px}
footer{background:var(--ink);color:#E4E0F2;margin-top:56px;padding:34px 0;font-size:15px}
footer a{color:#fff}footer .cols{display:flex;flex-wrap:wrap;gap:10px 18px;margin:10px 0 16px}
footer small{color:#C9C3DD}
@media (max-width:560px){.shelf{grid-template-columns:1fr 1fr;gap:10px}.shelf a{padding:12px 12px 10px;border-left-width:7px}.shelf strong{font-size:16px}.shelf span{font-size:13px;line-height:1.35}}
`;

const HEART = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E53E3E" stroke="#B91C1C" stroke-width=".5"/></svg>';

function page({ path, title, description, schema, body, ogType = 'website' }) {
  const url = SITE + path;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="only light">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="icon" type="image/png" href="/app/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>${CSS.replace(/\n/g, '')}</style>
${schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2394045540964924');fbq('track','PageView');</script>
</head>
<body>
<header class="top"><div class="wrap">
<a class="brand" href="/">${HEART}<span>The Internet Health Site</span></a>
<nav class="nav" aria-label="Main">
<a class="hide-xs" href="/academy/">Academy</a>
<a class="hide-sm" href="/app/">Free app</a>
<a class="btn btn-red" href="/?start=1">Meet your coach</a>
</nav>
</div></header>
<main class="wrap">
${body}
</main>
<footer><div class="wrap">
<strong style="color:#fff">The Internet Health Site Academy</strong>
<div class="cols">${categories.map((c) => `<a href="${catUrl(c)}">${esc(c.name)}</a>`).join('')}</div>
<div class="cols"><a href="/">Home</a><a href="/app/">Free workout tracker app</a><a href="/?start=1">${esc(FRIENDS_CTA)}</a></div>
<small>Articles are general fitness education, not medical advice. Check with your doctor before starting a new exercise or eating plan, especially if you have a health condition, an injury, or are pregnant.<br>&copy; ${new Date().getFullYear()} The Internet Health Site. All rights reserved.</small>
</div></footer>
</body>
</html>
`;
}

const crumbs = (items) => {
  const html = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => i === items.length - 1
    ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`).join('')}</ol></nav>`;
  const schema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.path })) };
  return { html, schema };
};

const card = (a) => {
  const c = catBySlug[a.category];
  return `<a class="card" href="${urlFor(a)}" style="--c:${c.color}" data-cat="${c.slug}" data-q="${esc((a.title + ' ' + a.description + ' ' + (a.keyword || '') + ' ' + c.name).toLowerCase())}">
<span class="tag">${esc(c.name)}</span><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><span class="meta">${a.readMinutes} min read</span></a>`;
};

const band = `<section class="band" aria-label="Get support">
<h2>Want someone in your corner?</h2>
<p>The articles are free and always will be. If you want a real coach who checks in, simple home workouts picked for you, and a friendly group cheering you on, we would love to have you.</p>
<div class="row"><a class="btn btn-light" href="/?start=1">${esc(FRIENDS_CTA)}</a><a class="btn btn-ghost" href="/app/">Try the free workout tracker</a></div>
</section>`;

const ORG = { '@type': 'Organization', name: BRAND, url: SITE + '/', logo: { '@type': 'ImageObject', url: `${SITE}/brand/emblem.png` } };

// Search/filter: plain JS over the cards already in the page (works with JS off: everything is listed).
const FILTER_JS = `<script>(function(){var q=document.getElementById('q'),chips=[].slice.call(document.querySelectorAll('.chips button')),cards=[].slice.call(document.querySelectorAll('#all .card')),empty=document.getElementById('empty'),cat='all';function run(){var t=(q&&q.value||'').toLowerCase().trim().split(/\\s+/).filter(Boolean),n=0;cards.forEach(function(c){var ok=(cat==='all'||c.dataset.cat===cat)&&t.every(function(w){return c.dataset.q.indexOf(w)>-1});c.style.display=ok?'':'none';if(ok)n++});if(empty)empty.style.display=n?'none':'block'}if(q){q.addEventListener('input',run);var p=new URLSearchParams(location.search).get('q');if(p){q.value=p;}}chips.forEach(function(b){b.addEventListener('click',function(){cat=b.dataset.cat;chips.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});run()})});document.getElementById('searchform')&&document.getElementById('searchform').addEventListener('submit',function(e){e.preventDefault();run();document.getElementById('all').scrollIntoView({behavior:'smooth'})});run()})();</script>`;

const out = (path, html) => { const f = join(DIST, path, 'index.html'); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };

// ---------- academy home ----------
{
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'Academy', path: '/academy/' }]);
  const starters = ['beginner-workout-at-home-no-equipment', 'low-impact-cardio-at-home', 'how-to-stay-motivated-to-workout'].map((s) => bySlug[s]).filter(Boolean);
  const body = `${bc.html}
<section class="hero">
<span class="eyebrow">Free fitness library</span>
<h1>The Health Site Academy</h1>
<p class="lede">Simple, honest answers to the questions people ask most when they start moving again. Home workouts, low-impact routines, food basics, and fitness after 40, written for real life.</p>
<form class="search" id="searchform" role="search" action="/academy/"><label for="q" style="position:absolute;left:-9999px">Search the Academy</label><input id="q" name="q" type="search" placeholder="Search: knees, protein, 10 minute, over 50..." autocomplete="off"><button class="btn btn-dark" type="submit">Search</button></form>
</section>
<h2 class="sec">Browse the library</h2>
<div class="shelf">${categories.map((c) => `<a href="${catUrl(c)}" style="--c:${c.color}"><strong>${esc(c.name)}</strong><span>${esc(c.short)}</span><em>${inCat(c.slug).length} guide${inCat(c.slug).length === 1 ? '' : 's'}</em></a>`).join('')}</div>
${starters.length ? `<h2 class="sec">New here? Start with these</h2><ol class="start">${starters.map((a) => `<li><a href="${urlFor(a)}">${esc(a.title)}</a><br><span style="color:var(--muted);font-size:15px">${esc(a.description)}</span></li>`).join('')}</ol>` : ''}
<h2 class="sec" id="all-guides">All guides</h2>
<div class="chips" role="group" aria-label="Filter by topic"><button type="button" data-cat="all" aria-pressed="true">All</button>${categories.map((c) => `<button type="button" data-cat="${c.slug}" aria-pressed="false">${esc(c.name)}</button>`).join('')}</div>
<div class="cards" id="all">${articles.map(card).join('')}</div>
<p class="empty" id="empty">No guides match that yet. Try a simpler word, like "knees" or "walking".</p>
${band}
${FILTER_JS}`;
  const schema = [bc.schema,
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'The Health Site Academy', url: `${SITE}/academy/`, description: 'Free fitness library from The Internet Health Site.', publisher: ORG,
      mainEntity: { '@type': 'ItemList', itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + urlFor(a), name: a.title })) } },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE + '/', potentialAction: { '@type': 'SearchAction', target: `${SITE}/academy/?q={search_term_string}`, 'query-input': 'required name=search_term_string' } }];
  out('academy', page({ path: '/academy/', title: 'Free Fitness Academy: Home Workouts, Low Impact and Over 40 | The Internet Health Site', description: 'A free library of beginner-friendly guides: home workouts, low-impact cardio, exercises for bad knees, protein, walking for weight loss and fitness after 40.', schema, body }));
}

// ---------- category hubs ----------
for (const c of categories) {
  const list = inCat(c.slug);
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'Academy', path: '/academy/' }, { name: c.name, path: catUrl(c) }]);
  const others = categories.filter((x) => x.slug !== c.slug);
  const body = `${bc.html}
<section class="hero"><span class="eyebrow" style="color:${c.color}">Academy topic</span><h1>${esc(c.name)}</h1><p class="lede">${esc(c.intro)}</p></section>
<div class="cards" id="all">${list.length ? list.map(card).join('') : '<p>New guides for this topic are on the way.</p>'}</div>
${band}
<h2 class="sec">More topics</h2>
<div class="shelf">${others.map((o) => `<a href="${catUrl(o)}" style="--c:${o.color}"><strong>${esc(o.name)}</strong><span>${esc(o.short)}</span><em>${inCat(o.slug).length} guide${inCat(o.slug).length === 1 ? '' : 's'}</em></a>`).join('')}</div>`;
  const schema = [bc.schema, { '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, url: SITE + catUrl(c), description: c.intro, publisher: ORG,
    mainEntity: { '@type': 'ItemList', itemListElement: list.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + urlFor(a), name: a.title })) } }];
  out(`academy/${c.slug}`, page({ path: catUrl(c), title: `${c.name}: Free Guides | The Health Site Academy`, description: c.intro.slice(0, 158), schema, body }));
}

// ---------- articles ----------
const report = [];
for (const a of articles) {
  const c = catBySlug[a.category];
  const r = render(a);
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'Academy', path: '/academy/' }, { name: c.name, path: catUrl(c) }, { name: a.title, path: urlFor(a) }]);
  const related = a.related.map((s) => bySlug[s]).filter(Boolean);
  for (const s of a.related) if (!bySlug[s]) console.warn(`academy: ${a.slug} lists unknown related ${s}`);
  const more = related.length >= 3 ? related : [...related, ...inCat(a.category).filter((x) => x.slug !== a.slug && !related.includes(x))].slice(0, 3);
  const updatedNice = new Date(a.updated + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const body = `${bc.html}
<div class="art">
<article>
<span class="eyebrow" style="color:${c.color}"><a href="${catUrl(c)}" style="color:inherit;text-decoration:none">${esc(c.name)}</a></span>
<h1>${esc(a.title)}</h1>
<p class="byline">By The Internet Health Site coaching team &middot; Updated ${updatedNice} &middot; ${a.readMinutes} min read</p>
<div class="prose">${r.html}</div>
<section class="cta" aria-label="Get support">
<h2>Do this with a little help</h2>
<p>Track every workout for free in the Health Site app, or get a real coach and a friendly group who check in on you.</p>
<div class="row"><a class="btn btn-dark" href="/app/">Open the free workout tracker</a><a class="btn btn-red" href="/?start=1">${esc(FRIENDS_CTA)}</a></div>
</section>
<p class="note">This guide is general fitness education, not medical advice. Check with your doctor before starting a new exercise or eating plan, and stop any move that causes sharp pain.</p>
</article>
<aside class="side">${r.toc.length ? `<nav class="toc" aria-label="On this page"><strong>On this page</strong><ol>${r.toc.map((t) => `<li><a href="#${t.id}">${t.text}</a></li>`).join('')}</ol><a class="btn btn-dark" href="/app/">Track it in the free app</a></nav>` : ''}</aside>
</div>
${more.length ? `<h2 class="sec">Keep reading</h2><div class="cards">${more.map(card).join('')}</div>` : ''}`;
  const schema = [bc.schema, {
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, image: [OG_IMAGE],
    datePublished: a.published || a.updated, dateModified: a.updated, wordCount: r.words, articleSection: c.name, keywords: a.keyword || '',
    author: { '@type': 'Organization', name: 'The Internet Health Site coaching team', url: SITE + '/' }, publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + urlFor(a) }, inLanguage: 'en-US' }];
  if (r.faq.length) schema.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  out(`academy/${a.category}/${a.slug}`, page({ path: urlFor(a), title: `${a.title} | The Internet Health Site`, description: a.description, schema, body, ogType: 'article' }));
  report.push(`${urlFor(a)} (${r.words} words, ${r.faq.length} FAQ)`);
}

// ---------- search index, sitemap, robots ----------
writeFileSync(join(DIST, 'academy', 'search.json'), JSON.stringify(articles.map((a) => ({ t: a.title, d: a.description, u: urlFor(a), c: a.category }))));
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: '/', lastmod: today, pri: '1.0' },
  { loc: '/app/', lastmod: today, pri: '0.7' },
  { loc: '/academy/', lastmod: today, pri: '0.9' },
  ...categories.map((c) => ({ loc: catUrl(c), lastmod: today, pri: '0.8' })),
  ...articles.map((a) => ({ loc: urlFor(a), lastmod: a.updated, pri: '0.8' })),
];
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /.netlify/

Sitemap: ${SITE}/sitemap.xml
`);
console.log(`academy: ${categories.length} topics, ${articles.length} articles, sitemap ${urls.length} URLs`);
for (const l of report) console.log('  ' + l);
