# AI-Dev's Corporate Site

AI技術企業の静的コーポレートサイトです。フレームワークやビルドツールに依存せず、HTML/CSS/バニラJSで構成しています。

## 🌐 デモサイト

### ブランチ一覧（mainブランチのindex.html）
https://imuradevelopment.github.io/Corporate/

> 各デザインのプレビューURLは「ブランチ一覧ページ」から確認できます。
> ※ mainブランチ自体は一覧に表示されません。

## 🚀 特徴

- **サーバー不要**: HTMLファイルを直接ブラウザで開いても動作
- **レスポンシブ**: モバイル/タブレット/デスクトップ
- **ダークテーマ**: デザイントークンによる一元管理
- **アニメーション**: AOS（CDN） + 軽量パーティクル
- **共通化**: `components/header.html`/`footer.html` を `assets/js/include.js` で読込
- **共通JS**: `assets/js/common.js` にページ横断の処理を集約

## 🛠 技術スタック

- HTML5, CSS（ITCSS構成）, Vanilla JS
- Font Awesome（CDN）, AOS（CDN）

## 📁 ディレクトリ構造

```
CorporateSite/
├── index.html          # ホーム
├── about.html          # 会社概要
├── services.html       # サービス
├── portfolio.html      # 実績
├── contact.html        # お問い合わせ
├── components/
│   ├── header.html     # 共有ヘッダー（モバイルメニュー含む）
│   └── footer.html     # 共有フッター
└── assets/
    ├── styles/
    │   ├── index.css   # ITCSSエントリ
    │   └── 00-06/*     # トークン/要素/オブジェクト/コンポーネント/ユーティリティ
    └── js/
        ├── include.js  # コンポーネント読込・リンク解決・モバイルメニュー
        └── common.js   # AOS/カウンター/パーティクル/ページ固有初期化
```

## 🔧 ローカル確認

```bash
# クローン
git clone https://github.com/imuradevelopment/Corporate.git
cd Corporate

# そのままブラウザで開く or 簡易サーバ
python -m http.server 8000
# http://localhost:8000 へアクセス
```

## ✨ 実装ノート

- すべての`<script>`は`defer`で読み込み（描画ブロック回避）
- No-JSフォールバックを全ページに追加
- モバイルメニューはARIA/ESC/フォーカストラップ対応
- GitHub Pages配下でもリンクが壊れにくいよう`data-href`を`include.js`で解決

## 📝 GitHub Pages 自動デプロイ

- mainブランチは「ブランチ一覧ページ」専用
- 各デザインブランチは `/ブランチ名/` でプレビュー可能

## 📄 ライセンス

このプロジェクトは商用利用可能です。