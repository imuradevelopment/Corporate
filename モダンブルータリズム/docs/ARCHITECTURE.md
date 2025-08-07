# アーキテクチャドキュメント

## 概要
このプロジェクトは「モダンブルータリズム」デザインシステムを採用し、保守性を最優先に設計されています。

## 設計原則

### 1. ITCSS (Inverted Triangle CSS)
CSSを特異性の低い順に整理し、予測可能で拡張しやすい構造を実現します。

```
00-settings   : 変数定義（色、サイズ、フォントなど）
01-tools      : ミックスイン、関数（使い回す処理）
02-generic    : リセット、正規化（ブラウザ差異を吸収）
03-elements   : HTML要素の基本スタイル
04-objects    : レイアウトパターン（OOCSS）
05-components : UIコンポーネント（BEM記法）
06-utilities  : ユーティリティクラス（!important付き）
```

### 2. 命名規則

#### BEM記法（コンポーネント）
```css
.block {}
.block__element {}
.block--modifier {}
```

#### ユーティリティクラス
```css
.u-text-bold {}     /* テキスト関連 */
.u-mt-4 {}          /* マージン */
.u-flex {}          /* レイアウト */
```

#### オブジェクトクラス
```css
.o-container {}     /* コンテナ */
.o-grid {}          /* グリッド */
.o-media {}         /* メディアオブジェクト */
```

### 3. カラーシステム
```css
/* プライマリパレット */
--color-concrete: #95989A;    /* コンクリート */
--color-charcoal: #1C1C1C;    /* 炭 */
--color-accent: #FF3333;      /* アクセント赤 */

/* セマンティックカラー */
--color-text: var(--color-charcoal);
--color-background: var(--color-concrete);
--color-primary: var(--color-accent);
```

### 4. タイポグラフィ
```css
/* フォントスケール（1.333倍率） */
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.333rem;    /* 21px */
--font-size-xl: 1.777rem;    /* 28px */
--font-size-2xl: 2.369rem;   /* 38px */
--font-size-3xl: 3.157rem;   /* 51px */
--font-size-4xl: 4.209rem;   /* 67px */
```

### 5. スペーシングシステム
```css
/* 8pxベースのスペーシング */
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
```

## ファイル構造

```
styles/
├── 00-settings/
│   ├── _colors.css      # カラー変数
│   ├── _typography.css  # フォント設定
│   ├── _spacing.css     # スペーシング
│   └── _breakpoints.css # ブレークポイント
├── 01-tools/
│   └── _mixins.css      # 再利用可能な処理
├── 02-generic/
│   ├── _reset.css       # リセットCSS
│   └── _box-sizing.css  # ボックスサイジング
├── 03-elements/
│   ├── _typography.css  # h1-h6, p, aなど
│   └── _forms.css       # フォーム要素
├── 04-objects/
│   ├── _container.css   # コンテナ
│   ├── _grid.css        # グリッドシステム
│   └── _layout.css      # レイアウトパターン
├── 05-components/
│   ├── _navigation.css  # ナビゲーション
│   ├── _button.css      # ボタン
│   ├── _card.css        # カード
│   └── _hero.css        # ヒーローセクション
└── 06-utilities/
    ├── _spacing.css     # マージン・パディング
    ├── _typography.css  # テキストユーティリティ
    └── _display.css     # 表示制御
```

## JavaScript構造

```
js/
└── modules/
    ├── core.js          # コアモジュール
    ├── navigation.js    # ナビゲーション
    └── utils.js         # ユーティリティ関数
```

## 保守のベストプラクティス

1. **新しいスタイルを追加する場合**
   - 適切なレイヤーに配置する
   - 既存のユーティリティクラスで対応できないか確認
   - BEM記法を厳守する

2. **変更を加える場合**
   - 影響範囲を最小限に抑える
   - 変数を活用して一元管理
   - コメントで意図を明確にする

3. **デバッグ時**
   - ブラウザの開発者ツールでCSS特異性を確認
   - !importantの使用は06-utilitiesレイヤーのみ

## パフォーマンス考慮事項

1. **CSS最適化**
   - 未使用のスタイルは削除
   - メディアクエリはモバイルファースト
   - CSSファイルは結合して配信

2. **JavaScript最適化**
   - モジュール化で必要な機能のみロード
   - イベントリスナーは適切に管理
   - メモリリークに注意