# GPX Compass 操作マニュアルの公開ファイル

- `USER_MANUAL.md`: 利用者向けMarkdown原本。
- `index.html`: 原本から生成した閲覧ページ。GitHub PagesではこのHTMLをそのまま配信する。
- `render-manual.cjs`: HTML生成スクリプト。本文・表・目次をMarkdownから変換する。

本文を更新した後、Node.js 20以降とmarked 17.0.5で生成する。

```sh
cd gpx-compass/manual
npm install --no-save --package-lock=false marked@17.0.5
node render-manual.cjs
```

`USER_MANUAL.md`と`index.html`を同時に更新する。生成処理は通信を行わない。
Markdownの各章の英数字アンカーは、目次や外部リンクから使うため維持する。
公開前に本文の日本語、リンク、狭い画面での表の閲覧、UTF-8を確認する。
GitHub Pagesのビルド成功と公開URLへの反映も確認する。
