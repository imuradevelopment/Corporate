# AI-Dev's マルチブランチデザインシステム

このリポジトリは、AI-Dev'sコーポレートサイトの複数デザインを**ブランチ単位で管理**し、自動デプロイする仕組みです。

## 🌐 デモサイト
- ブランチ一覧（mainブランチ）  
  https://imuradevelopment.github.io/Corporate/  
  ※各デザインのプレビューURLは一覧ページから確認できます。

## 🚀 運用手順

### 新しいデザインブランチを作成
1. ブランチ作成  
   ```bash
   git checkout -b デザイン名
   ```
2. デザイン開発  
   - HTML/CSS/JSを編集（規約準拠）
   - ブランチ名はデザイン特徴を反映
3. プッシュ → 自動デプロイ  
   ```bash
   git add .
   git commit -m "デザイン名: 説明"
   git push origin デザイン名
   ```
   → 数分後にGitHub Pagesへ反映

### ブランチ管理ルール
- **mainブランチ** … ブランチ一覧ページのみ
- **デザインブランチ** … 各デザインのコーポレートサイト
- ブランチ削除時 … 対応するプレビューも自動削除

### デザインブランチの命名例
- `ネオンサイバーパンクダーク` … ネオンカラー＋ダークテーマ
- `ダークグラスモーフィズム` … ガラス効果＋ダークテーマ
- `モノクロスカイブルー` … モノクロ＋ブルーアクセント

## 🔧 開発環境
```bash
git clone https://github.com/imuradevelopment/Corporate.git
cd Corporate
# main = 一覧ページ
# デザインは各ブランチで開発
```

## 🔄 自動化システム
- **deploy-all-branches.yml** … 全ブランチ自動デプロイ
- **cleanup-deleted-branches.yml** … 削除ブランチのプレビュー自動削除
- **initial-setup.yml** … GitHub Pages初期設定

---

## 📝 コーディング規約 — Classic Corporate Site

_No build. No CDN. **file://**で開いても全部動く構成。_

### 🎯 目的
- 速い・壊れない・読みやすい（CWV勝ち）
- 外部依存ゼロ（オフラインでも崩れない）
- 構造・命名の統一でメンテ性確保

### 🛠 技術スタック
- **HTML5/CSS3/Vanilla JS**
- **GitHub Pages**（静的ホスティング）
- **GitHub Actions**（ブランチ単位自動デプロイ）
- **軽量JSライブラリのみ必要時使用**  
  - 例：Alpine.js（UIスプリンクル）、htmx（部分的動的化）

### 📁 推奨ディレクトリ構成（古き良き × 現代融合型）
```
src/
  index.html               # トップページ（まずはこれ開けばOK）
  pages/                   # 下層ページ群
    about.html
    services.html
    portfolio.html
    contact.html
  components/              # 共通パーツ
    header.html
    footer.html
  assets/
    styles/                 # CSS
    js/                     # JavaScript
    img/                    # 画像
    fonts/                  # フォント（woff2推奨）
    vendor/                 # 外部ライブラリ（CDN禁止）
```

### 🔌 file://対応ヘッダー/フッター分割 — `include.js` 仕様と使い方

ビルド無し・CDN無し・HTTPサーバ無しでも、`components/header.html` と `components/footer.html` を各ページへインクルードできます。GitHub Pages配下や `pages/` サブディレクトリでも相対パスが自動で補正されます。

- 使い方（最小手順）
  1. 置き場: `src/components/header.html` / `src/components/footer.html`
  2. コンポーネント内リンクは `data-href` で記述（`@/`始まり）
     - 例: `<a class="nav__link" data-href="@/about.html">私たちについて</a>`
  3. 各ページにプレースホルダを置く
     ```html
     <div data-include="header"></div>
     <!-- ... main contents ... -->
     <div data-include="footer"></div>
     ```
  4. スクリプトを末尾で読み込む
     - ルート `index.html`: `
       <script defer src="assets/js/include.js"></script>`
     - `pages/*`: `
       <script defer src="../assets/js/include.js"></script>`

- 主要仕様（抜粋）
  - data-href解決: `@/path` や `./path` を相対 `href` へ変換
  - ディレクトリ深度補正: `pages/` 配下では `assets/`/`components/` を自動で `../` 付与。ページ内リンクは
    - ルート: `about.html` → `pages/about.html`
    - `pages/` 配下: `index.html` → `../index.html`
  - file://フォールバック: `fetch(prefix + components/*.html)` が失敗した場合でも、最小のヘッダー/フッターHTMLを直接挿入して継続表示
  - アクセシビリティ: モバイルメニュー開閉（トグル/外側クリック/ESC/リサイズ）、現在ページへ `aria-current="page"` 付与、`#js-year` に年号自動挿入
  - SEO補完（任意）: `rel=canonical` と `og:url` が空なら `location` から補完。OG/Twitter画像URLを絶対化

- 注意点
  - 先頭スラッシュ（`/`）の絶対パスは使用しない（Pages配下で崩れるため）
  - 画像/CSS/JS は `assets/` 配下に置く（CDN禁止）
  - JS無効時も最低限の遷移を担保したい場合は、各ページに `<noscript>` でナビゲーションの簡易リンクを用意

- 最小例
  - `components/header.html`
    ```html
    <nav class="nav" aria-label="メイン">
      <a class="nav__link" data-href="@/index.html">ホーム</a>
      <a class="nav__link" data-href="@/about.html">私たちについて</a>
      <a class="nav__link" data-href="@/services.html">サービス</a>
      <a class="nav__link" data-href="@/portfolio.html">事例</a>
      <a class="nav__link" data-href="@/contact.html">お問い合わせ</a>
    </nav>
    ```
  - `src/index.html`
    ```html
    <div data-include="header"></div>
    <!-- contents -->
    <div data-include="footer"></div>
    <script defer src="assets/js/include.js"></script>
    ```
  - `src/pages/about.html`
    ```html
    <div data-include="header"></div>
    <!-- contents -->
    <div data-include="footer"></div>
    <script defer src="../assets/js/include.js"></script>
    ```

#### ディレクトリ運用ルール
- **index.html** … 必ずトップページ、`src/`直下に1つだけ
- **pages/** … サブページを配置（トップから相対リンクでアクセス）
- **components/** … インクルードまたはコピー用の共通パーツ
- **assets/** … 静的ファイル（CSS/JS/画像/フォント/外部JS）を種類ごとに分離
- ファイル命名は**kebab-case**、拡張子は小文字統一
- 画像は必ず`width`/`height`属性を指定し、`loading="lazy"`を付与

### 📌 命名規則
- ファイル・ディレクトリ … **kebab-case**
- CSSクラス … **BEM-lite**
- JSフック … `data-js`属性
- HTML構造 … 見出しレベル順守、`lang`設定、`title`固有化、画像`alt`必須
- メタ情報 … `description`必須、OGP/Twitterカード最低限

### 🎨 CSS規約
- **ITCSS構成**
- カスタムプロパティで色・間隔を管理
- @import禁止（すべて<link>で直読み）
- メディアクエリはモバイルファースト

### ⚙ JS規約
- 非モジュール＋`defer`読み込み
- fetchは相対パス＋`file://`フォールバック
- イベント委譲推奨、無駄なリスナ禁止

### 🖼 アセット規約
- 画像は必ず`width`/`height`属性＋`loading="lazy"`
- JPEG/PNG/SVG適材適所（OGPは1200×630）
- faviconとapple-touch-iconを用意

### 🚀 パフォーマンス目標
- LCP ≤ 2.0s  
- INP ≤ 200ms  
- CLS ≤ 0.1  
- HTML ≤ 50KB / CSS ≤ 60KB / JS ≤ 30KB

### ♿ アクセシビリティ
- フォーカスリング維持
- コントラスト比 AA以上
- Skip link設置、キーボード操作完全対応
