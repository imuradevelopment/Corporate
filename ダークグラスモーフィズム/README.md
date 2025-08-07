# AI-Dev's Corporate Site

AI技術企業のコーポレートサイトです。

## 🌐 デモサイト

### ブランチ一覧（mainブランチのindex.html）
https://imuradevelopment.github.io/Corporate/

> 各デザインのプレビューURLは「ブランチ一覧ページ」から確認できます。
> ※ mainブランチ自体は一覧に表示されません。

## 🚀 特徴

- **サーバー不要**: HTMLファイルを直接ブラウザで開いても動作
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **ダークテーマ**: 目に優しいダークモードデザイン
- **アニメーション**: AOS (Animate On Scroll)による滑らかなアニメーション
- **自動デプロイ**: GitHub Actionsで全ブランチを自動的にGitHub Pagesにデプロイ
- **ブランチカードは別タブで開く**
- **URLの重複スラッシュ問題は解消済み**

## 🛠 技術スタック

- **HTML/CSS/JavaScript**: フレームワークを使用しないバニラ実装
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク（CDN）
- **Font Awesome**: アイコンライブラリ（CDN）
- **AOS**: スクロールアニメーションライブラリ

## 📁 ディレクトリ構造

```
Corporate/
├── index.html          # ホームページ
├── about.html          # 会社概要
├── services.html       # サービス紹介
├── portfolio.html      # 実績
├── contact.html        # お問い合わせ
├── assets/
│   ├── css/
│   │   └── style.css   # カスタムCSS
│   └── js/
│       ├── main.js     # メインJavaScript
│       └── components.js # コンポーネントローダー
└── .github/
    └── workflows/      # GitHub Actions設定
```

## 🔧 開発方法

### ローカルで確認
```bash
# リポジトリをクローン
git clone https://github.com/imuradevelopment/Corporate.git
cd Corporate

# ブラウザで直接開く（サーバー不要）
open index.html  # macOS
start index.html # Windows
```

### 新しいブランチで開発
```bash
# 新しいブランチを作成
git checkout -b デザイン名

# 開発・コミット
git add .
git commit -m "Add new design"

git push origin デザイン名
# 数分後にプレビュー可能
# https://imuradevelopment.github.io/Corporate/デザイン名/
```

## 📝 GitHub Pages 自動デプロイ

- mainブランチは「ブランチ一覧ページ」専用（index.htmlのみ自動生成、main自体は一覧に表示されません）
- 各デザインブランチは `/ブランチ名/` でプレビュー可能
- branches.htmlは廃止され、index.htmlのみが自動生成されます
- ブランチカードはデフォルトで別タブで開きます

## 📄 ライセンス

このプロジェクトは商用利用可能です。