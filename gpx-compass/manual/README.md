# GPX Compass 操作マニュアルの更新

本文の正本は公開リポジトリの [`_includes/gpx-compass-manual.md`](../../_includes/gpx-compass-manual.md) です。
このMarkdownを編集して `main` にpushすると、GitHub PagesのJekyllビルドが公開ページを更新します。
生成HTMLの保存やNode.jsによる再生成は不要です。

## 編集するとき

1. `_includes/gpx-compass-manual.md` の本文を変更します。先頭のタイトル、対象OS・言語、更新日の3段落は維持し、更新日を修正します。ページの見出し・更新日はこの原稿から自動で表示します。
2. 本文の日本語、章のアンカー、リンク、表の列を確認してコミット・pushします。
3. Pagesのビルド成功と公開URLの本文への反映を確認します。スマートフォン幅では表の横スクロールも確認します。

既存の章アンカーは外部リンクにも使うため維持します。UTF-8（BOMなし）で保存してください。
アプリ側の `docs/USER_MANUAL.md` は実装照合用の控えです。公開原稿を変更したら必要に応じて控えにも反映します。

## 構成

- `_includes/gpx-compass-manual.md`: HTMLとダウンロード用Markdownで共用する唯一の本文。
- `gpx-compass/manual/index.html`: Jekyllのレイアウトを指定する短い入口。生成HTMLではありません。
- `_layouts/manual.html`: 原稿をMarkdownから変換し、ヘッダー・目次・表・フッターを配置するテンプレート。
- `assets/css/manual.css`: PC・スマートフォン・印刷向けの表示。
- `gpx-compass/manual/download.txt`: 同じ原稿を変換せずにMarkdownのURLへ出力するJekyllテンプレート。
- `_config.yml`: JekyllのMarkdownと公開対象の設定。

閲覧URL: https://xtz690.github.io/gpx-compass/manual/

Markdown URL: https://xtz690.github.io/gpx-compass/manual/USER_MANUAL.md

GitHub Pagesは従来どおり `main` / リポジトリルートから公開します。
クイックスタート、サイトトップ、プライバシーポリシーの既存HTMLはそのまま配信します。
Jekyllをローカルで使える場合は、リポジトリルートで `jekyll serve` により表示を確認できます。
