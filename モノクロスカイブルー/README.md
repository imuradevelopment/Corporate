# AI-Dev's Corporate Site

AI技術企業のコーポレートサイトです。

## 🌐 デモサイト

### メインサイト
https://imuradevelopment.github.io/Corporate/

### ブランチ一覧（全ブランチのプレビュー）
https://imuradevelopment.github.io/Corporate/branches.html

## 🚀 特徴

- **サーバー不要**: HTMLファイルを直接ブラウザで開いても動作
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **ダークテーマ**: 目に優しいダークモードデザイン
- **アニメーション**: AOS (Animate On Scroll)による滑らかなアニメーション
- **自動デプロイ**: GitHub Actionsで全ブランチを自動的にGitHub Pagesにデプロイ

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
├── components/         # 再利用可能なコンポーネント（未使用）
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
git checkout -b feature/new-feature

# 開発・コミット
git add .
git commit -m "Add new feature"

# プッシュ（自動的にGitHub Pagesにデプロイされる）
git push origin feature/new-feature

# 数分後にプレビュー可能
# https://imuradevelopment.github.io/Corporate/feature-new-feature/
```

## 📝 GitHub Pages 自動デプロイ

全てのブランチが自動的にGitHub Pagesにデプロイされます：

- `main` → https://imuradevelopment.github.io/Corporate/
- `develop` → https://imuradevelopment.github.io/Corporate/develop/
- `feature/xxx` → https://imuradevelopment.github.io/Corporate/feature-xxx/

ブランチ一覧は自動更新されます。

## 📄 ライセンス

このプロジェクトは商用利用可能です。