// Generate the static reading page from the public, user-facing Markdown.
// Requires Node.js and marked. No network request is made by this script.
const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');

const folder = __dirname;
const markdown = fs.readFileSync(path.join(folder, 'USER_MANUAL.md'), 'utf8');
if (!markdown.startsWith('# GPX Compass 操作マニュアル')) {
  throw new Error('Expected the GPX Compass user manual');
}
const update = markdown.match(/^更新日：(.+)$/m)?.[1];
if (!update || !/^\d{4}-\d{2}-\d{2}$/.test(update)) throw new Error('Missing update date');
const safe = value => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
let content = marked.parse(markdown, { gfm: true });
content = content.replace(/^<h1>GPX Compass 操作マニュアル<\/h1>\s*/, '');
content = content.replace(/^<p>Android・iOS共通 \/ 日本語版<\/p>\s*<p>更新日：[^<]+<\/p>\s*/, '');
content = content.replace(/(?:<p>)?<a id="([a-z-]+)"><\/a>(?:<\/p>)?\s*<h2>(.*?)<\/h2>/g,
  (_, id, title) => `<h2 id="${id}">${title}</h2>`);
content = content.replace(/<h2>目次<\/h2>\s*(<ul>[\s\S]*?<\/ul>)/,
  '<nav class="toc" aria-label="マニュアルの目次"><h2>目次</h2>$1</nav>');
content = content.replace(/<table>/g, '<div class="table-wrap" tabindex="0" role="region" aria-label="説明表"><table>');
content = content.replace(/<\/table>/g, '</table></div>');
content = content.replace(/<th>/g, '<th scope="col">');
content = content.replace(/<div class="table-wrap"[^>]*><table>[\s\S]*?<\/table><\/div>/g, table => {
  const columns = (table.match(/<th scope="col">/g) || []).length;
  return (columns > 2 ? '<p class="table-hint">この表は左右にスクロールできます。</p>\n' : '') + table;
});

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="GPX CompassのAndroid・iOS共通操作マニュアル。HUD、地図の線とマーカー、全メニューの操作方法とOS差分を説明します。">
  <meta name="theme-color" content="#163b4b">
  <link rel="canonical" href="https://xtz690.github.io/gpx-compass/manual/">
  <title>操作マニュアル（Android・iOS共通） | GPX Compass</title>
  <style>
    :root { color-scheme: light; --ink: #183443; --muted: #506674; --line: #d9e3e8; --blue: #185aaa; --bg: #f4f7f9; }
    * { box-sizing: border-box; }
    html { scroll-padding-top: 24px; }
    body { margin: 0; background: var(--bg); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Yu Gothic", sans-serif; line-height: 1.85; overflow-wrap: anywhere; }
    a { color: var(--blue); text-underline-offset: .2em; }
    a:hover { text-decoration-thickness: 2px; }
    a:focus-visible, .table-wrap:focus-visible { outline: 3px solid #b85600; outline-offset: 4px; }
    .skip { position: absolute; top: -100px; left: 16px; padding: 12px; background: white; z-index: 2; }
    .skip:focus { top: 8px; }
    .wrap { width: min(100% - 40px, 1040px); margin-inline: auto; }
    .brand { padding-block: 20px; display: flex; flex-wrap: wrap; gap: 8px 24px; font-size: .95rem; }
    .brand > a:first-child { color: var(--ink); font-weight: 700; text-decoration: none; }
    header { padding: 32px 0; background: #163b4b; color: white; }
    .eyebrow { margin: 0 0 10px; font-size: .8rem; font-weight: 700; letter-spacing: .12em; color: #b6dce7; }
    h1 { margin: 0 0 14px; font-size: clamp(1.8rem, 5vw, 2.6rem); line-height: 1.4; }
    header p { margin: 8px 0; }
    .meta { color: #c6dce4; font-size: .85rem; }
    main { padding-block: 28px 48px; }
    article { background: white; border: 1px solid var(--line); border-radius: 10px; padding: 36px; }
    h2 { margin: 44px 0 18px; padding-top: 18px; border-top: 2px solid var(--line); font-size: 1.5rem; line-height: 1.5; scroll-margin-top: 24px; }
    h3 { margin: 28px 0 12px; font-size: 1.15rem; line-height: 1.6; }
    p { margin: 0 0 18px; }
    ul, ol { padding-left: 1.5em; }
    li { margin: 9px 0; }
    code { background: #eef3f6; border-radius: 3px; padding: .12em .3em; font-size: .92em; }
    .toc { margin: 28px 0 34px; padding: 22px 26px; border: 1px solid var(--line); border-radius: 10px; background: var(--bg); }
    .toc h2 { margin: 0 0 14px; padding: 0; border: 0; font-size: 1.2rem; }
    .toc ul { columns: 2; column-gap: 32px; margin-bottom: 0; }
    .toc li { break-inside: avoid; }
    .tools { display: flex; flex-wrap: wrap; gap: 12px 22px; padding: 16px 0 24px; font-size: .95rem; }
    .table-hint { display: none; color: var(--muted); font-size: .85rem; }
    .table-wrap { overflow-x: auto; margin: 18px 0 26px; border: 1px solid var(--line); border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; line-height: 1.7; font-size: .95rem; }
    th, td { text-align: left; vertical-align: top; padding: 12px 14px; border-bottom: 1px solid var(--line); border-right: 1px solid var(--line); }
    th { background: #eaf2fb; font-weight: 700; }
    th:last-child, td:last-child { border-right: 0; }
    tr:last-child td { border-bottom: 0; }
    tbody tr:nth-child(even) { background: #f8fafb; }
    table:has(th:nth-child(2):last-child) th:first-child { width: 30%; }
    table:has(th:nth-child(3):last-child) th:first-child { width: 24%; }
    table:has(th:nth-child(3):last-child) th:nth-child(2) { width: 28%; }
    footer { padding: 24px 0 36px; border-top: 1px solid var(--line); color: var(--muted); font-size: .9rem; }
    footer p:last-child { margin-bottom: 0; }
    @media (max-width: 640px) {
      .wrap { width: calc(100% - 24px); }
      .brand { font-size: .85rem; gap: 8px 16px; }
      header { padding-block: 26px; }
      article { padding: 22px 16px; }
      h2 { font-size: 1.3rem; margin-top: 36px; }
      .toc { padding: 18px; }
      .toc ul { columns: 1; }
      .table-hint { display: block; }
      th, td { padding: 9px 8px; font-size: .88rem; }
      table:has(th:nth-child(3)) { min-width: 520px; }
    }
    @media print {
      body { background: white; font-size: 10pt; }
      .wrap { width: 100%; }
      header { background: white; color: black; padding-block: 12px; }
      .eyebrow, .meta { color: #333; }
      .brand, .skip, .tools, .toc { display: none; }
      article { border: 0; padding: 0; }
      h2, h3 { break-after: avoid; }
      .table-wrap { overflow: visible; border-radius: 0; }
      table { min-width: 0 !important; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <a class="skip" href="#main">本文へ移動</a>
  <nav class="wrap brand" aria-label="サイト内の案内"><a href="/">GPX Compass</a><a href="/gpx-compass/">クイックスタート</a><a href="/privacy-policy/">プライバシーポリシー</a></nav>
  <header><div class="wrap">
    <p class="eyebrow">ANDROID · iOS · USER MANUAL</p>
    <h1>GPX Compass 操作マニュアル</h1>
    <p>画面の読み方から、ルート・記録・共有・設定まで。</p>
    <p class="meta">Android・iOS共通 / 日本語版 · 更新日：${safe(update)}</p>
  </div></header>
  <main id="main" class="wrap">
    <div class="tools"><a href="USER_MANUAL.md" download>Markdown原本をダウンロード</a><a href="/gpx-compass/">クイックスタートガイド</a></div>
    <p class="table-hint">幅の広い表は、左右にスクロールして読めます。</p>
    <article aria-label="操作マニュアル本文">
${content}
    </article>
  </main>
  <footer><div class="wrap"><p><a href="/gpx-compass/">クイックスタート</a> · <a href="USER_MANUAL.md" download>Markdown原本</a> · <a href="#main">先頭へ戻る</a></p><p>アプリの「このアプリについて」から開けます。専用リンクがない版では「使い方」から、このサイトのマニュアルリンクへ進んでください。</p></div></footer>
</body>
</html>
`;
fs.writeFileSync(path.join(folder, 'index.html'), html, 'utf8');
console.log(`Generated index.html: ${Buffer.byteLength(html)} bytes`);
