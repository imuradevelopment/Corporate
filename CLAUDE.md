# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要
AI-Dev's Corporate Site - AI技術企業の静的なコーポレートサイト

## 技術スタック
- **フロントエンド**: バニラJavaScript（フレームワーク未使用）
- **スタイリング**: Tailwind CSS (CDN) + カスタムCSS
- **アイコン**: Font Awesome (CDN)
- **アニメーション**: AOS (Animate On Scroll)
- **ビルドツール**: なし（静的サイト）

## アーキテクチャ

### コンポーネントシステム
独自のコンポーネントローダーを実装（`components.js`）:
- JavaScriptオブジェクトにHTMLテンプレートを直接埋め込み
- `data-component`属性でコンポーネントを指定
- サーバー不要で動作（ファイルシステムから直接開いても動作）

### ファイル構造の特徴
```
CorporateSite/
├── index.html          # ホームページ
├── about.html          # 会社概要
├── services.html       # サービス紹介
├── portfolio.html      # 実績
├── contact.html        # お問い合わせ
├── components/         # 再利用可能なコンポーネント
│   ├── header.html     # ヘッダー/ナビゲーション
│   └── footer.html     # フッター
└── assets/
    ├── css/
    │   └── style.css   # カスタムCSS（ダークテーマ、アニメーション）
    └── js/
        ├── main.js     # メインJavaScript（ページ別初期化、UI制御）
        └── components.js # コンポーネントローダー
```

## 重要な実装詳細

### JavaScriptアーキテクチャ
1. **main.js**:
   - ページ別の初期化処理（`currentPath`で判定）
   - スクロール連動ヘッダー表示/非表示
   - カウンターアニメーション（Intersection Observer使用）
   - モバイルメニュー制御
   - フォームバリデーション（contact.htmlのみ）

2. **components.js**:
   - `ComponentLoader`クラスで管理
   - コンストラクタでHTMLテンプレートを定義
   - DOMContentLoaded時に自動的にコンポーネントを挿入

### CSS特徴
- CSS変数でダークテーマカラー管理
- サイバーパンク風のエフェクト（グロー、グラデーション、パーティクル）
- カスタムスクロールバー
- レスポンシブ対応

### ページ固有機能
- **services.html**: サービスタブ切り替え（`initServiceTabs()`）
- **portfolio.html**: ポートフォリオフィルター（`initPortfolioFilter()`）
- **contact.html**: お問い合わせフォーム、地図プレースホルダー（`initContactMap()`）

## 開発時の注意点

### コンポーネント読み込み
- サーバー不要でファイルシステムから直接開いて動作
- コンポーネントのHTMLはJavaScriptファイル内に埋め込み済み

### スタイル編集
- Tailwind CSSクラスとカスタムCSSを併用
- アニメーションはAOSとカスタムCSSアニメーションを組み合わせ

### JavaScript編集
- ページ別の初期化処理は`main.js`の該当セクションに追加
- 新しいコンポーネントは`components.js`のcomponentsオブジェクトに追加

## 一般的な開発コマンド

```bash
# サーバー不要 - HTMLファイルを直接ブラウザで開く
# 例: index.htmlをダブルクリック、またはブラウザにドラッグ&ドロップ

# 開発時にライブリロードが必要な場合のみ（オプション）
python -m http.server 8000
# または
npx http-server -p 8000
```

## トラブルシューティング

### コンポーネントが読み込まれない
- JavaScriptが有効になっているか確認
- ブラウザのコンソールでエラーを確認
- components.jsが正しく読み込まれているか確認

### アニメーションが動作しない
- AOSの初期化が実行されているか確認（`AOS.init()`）
- `data-aos`属性が正しく設定されているか確認

### モバイルメニューが動作しない
- `mobile-menu-btn`と`mobile-menu`のIDが存在するか確認
- main.jsが正しく読み込まれているか確認