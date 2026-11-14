// Tell Bing (and through it Yandex, Seznam, Naver, ChatGPT search / Copilot) about every URL in the live sitemap.
// Run after a deploy is live: node scripts/indexnow.mjs   (or pass specific URLs as args)
// Key file public/3fa1a5018744450297358fc1c8971a07.txt must stay deployed.
const SITE = 'https://internethealthsite.com';
const KEY = '3fa1a5018744450297358fc1c8971a07';
let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'internethealthsite.com', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`indexnow: submitted ${urls.length} URLs -> HTTP ${res.status} ${await res.text()}`);
