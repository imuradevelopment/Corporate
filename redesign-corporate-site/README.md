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
- **アニメーション**: Intersection Observer APIによる滑らかなアニメーション
- **自動デプロイ**: GitHub Actionsで全ブランチを自動的にGitHub Pagesにデプロイ
- **クリーンなコード**: モダンなES6+とCSSカスタムプロパティを使用

## 🛠 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: カスタムプロパティ、Grid、Flexbox
- **JavaScript (ES6+)**: クラスベースのモダンなアーキテクチャ
- **Font Awesome**: アイコンライブラリ（CDN）
- **Intersection Observer API**: スクロールアニメーション

## 📁 ディレクトリ構造

```
CorporateSite/
├── index.html          # ホームページ
├── about.html          # 会社概要
├── services.html       # サービス紹介
├── portfolio.html      # 実績
├── contact.html        # お問い合わせ
├── assets/
│   ├── css/
│   │   └── main.css    # メインスタイルシート（1316行）
│   └── js/
│       └── main.js     # メインJavaScript（400行）
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

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: `#00d4ff` (シアン)
- **セカンダリ**: `#ff00ff` (マゼンタ)
- **アクセント**: `#00ff88` (グリーン)
- **背景**: `#0a0a0a` (ダークグレー)

### 命名規則
- **BEM**: Block Element Modifier
- **CSSカスタムプロパティ**: 一貫したデザイントークン
- **セマンティックHTML**: アクセシビリティ重視

## ⚡ パフォーマンス最適化

- **軽量なJavaScript**: クラスベースのモダンなアーキテクチャ
- **効率的なCSS**: カスタムプロパティによる一貫性
- **最適化されたアニメーション**: requestAnimationFrame使用
- **レスポンシブ画像**: 適切なサイズとフォーマット

## 📱 レスポンシブ対応

- **ブレークポイント**: 768px以下でモバイル対応
- **フレキシブルグリッド**: CSS GridとFlexbox
- **タッチフレンドリー**: モバイルでの操作性向上

## 🔒 セキュリティ

- **XSS対策**: 入力値の適切なサニタイゼーション
- **CSRF対策**: フォームトークンの実装
- **コンテンツセキュリティポリシー**: CSPヘッダーの設定

## 📄 ライセンス

このプロジェクトは商用利用可能です。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

技術的な質問やバグ報告は、GitHubのIssuesでお気軽にお問い合わせください。