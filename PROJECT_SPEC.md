# Global Macro Signal (OmniMetric Terminal) - プロジェクト仕様書

## 1. プロジェクト概要 (Executive Summary)
**Global Macro Signal (GMS)** は、機関投資家レベルの市場リスク分析を個人投資家に提供する、AI駆動型金融・経済分析プラットフォームです。「OmniMetric Terminal」というブランド名で展開され、Bloombergターミナルのような高度な視認性と、生成AIによる深い洞察を融合させています。

### 核心思想 (Core Philosophy)
*   **Institutional Grade (機関投資家品質)**: 遊びのない、プロフェッショナルでミニマルなUI/UX。
*   **Silent Execution (静寂なる実行)**: エラーをユーザーに見せない。徹底的なフォールバックと自己修復機能。
*   **Resilient Intelligence (堅牢な知能)**: 単一のAIモデルに依存せず、複数のモデル（Gemini Pro/Flash）をティアリングして稼働率100%を目指す。
*   **Mobile First Strategy**: 複雑な金融データを、モバイル端末でも「親指一本」で把握できる密度とレイアウトに最適化。

---

## 2. システムアーキテクチャ (Architecture)

本システムは、**「静的解析と動的配信のハイブリッド」**構成を採用しています。

### 2.1 Backend (Data Engine)
*   **言語**: Python 3.x
*   **役割**: 市場データの収集、GMSスコアの算出、AI分析の生成、JSONデータの永続化。
*   **データソース**:
    *   **Yahoo Finance**: 株価、コモディティ、VIX指数。
    *   **FRED (St. Louis Fed)**: 米国債利回り、クレジットスプレッド、金融環境指数(NFCI)。
*   **AI Engine**: `gms_engine.py`
    *   **Tier 1 (Deep Insight)**: `Gemini 1.5 Pro` (または最新のPreviewモデル) - 定性的な市場分析を担当。
    *   **Tier 2 (Fallback)**: `Gemini 1.5 Flash` - エラー時のバックアップ。
    *   **Tier 3 (Static)**: アルゴリズムに基づく定型文生成（完全なオフライン時）。

### 2.2 Frontend (User Interface)
*   **フレームワーク**: Next.js 15 (App Router)
*   **スタイリング**: Tailwind CSS 4.0
*   **ホスティング**: Vercel (Serverless / Edge Functions)
*   **主な機能**:
    *   **API Route (`/api/live`)**: バックエンドが生成したJSONを配信。PythonプロセスをVercel上で起動せず、静的ファイルの読み込みに特化することで高速化と安定性を実現。
    *   **News Ticker (`/api/news`)**: 外部RSSフィードを取得し、リアルタイムでAI翻訳（EN -> JP/CN/ES）を行う。
    *   **ISR (Incremental Static Regeneration)**: エンドポイントごとにキャッシュ戦略（1時間〜1分）を適用し、APIレート制限を回避。

### 2.3 Workflow (Automation)
1.  **Trigger**: GitHub Actions（またはCron）が定期的にPythonスクリプトを実行。
2.  **Process**: データ取得 -> スコア計算 -> AI分析 -> `current_signal.json` 生成。
3.  **Deploy**: 生成されたJSONがリポジトリにコミット/プッシュされる。
4.  **Serve**: Vercelが最新のJSONを読み込み、フロントエンドに反映。

---

## 3. 機能仕様 (Functional Features)

### 3.1 GMSスコア (Global Macro Score)
市場のリスク許容度を 0〜100 で数値化。
*   **0-40 (Red)**: Risk Contraction (リスク回避局面)。ディフェンシブ推奨。
*   **40-60 (Yellow)**: Neutral (中立)。
*   **60-100 (Blue)**: Risk Expansionary (リスク選好局面)。積極投資推奨。
*   **計算ロジック**: VIX, MOVE指数, HY Credit Spread (最重要), NFCI, Market Breadth の加重平均。

### 3.2 ニュースティッカー & AI翻訳
*   CNBC等のRSSフィードを取得。
*   **Intelligent Model Selection**: `Gemini Flash` モデルを使用し、高速に多言語（日・中・西）へ翻訳。
*   **Silent Fallback**: AI翻訳が失敗/タイムアウトした場合、即座に原文（英語）を表示し、エラー画面を出さない。

### 3.3 モバイル最適化 (Mobile UX)
*   **Vertical Stacking**: デスクトップでは横並びの指標カードを、モバイルでは縦積みに自動変形。
*   **Decluttered Charts**: モバイルではX軸（日付）を非表示にし、トレンドラインと現在値のみを強調。
*   **Ad Experience**: 収益性を維持しつつ、ユーザー体験を損なわない高さ制限（Max 60px）と「SPONSORED」ラベルの配置。

---

## 4. 技術要件と環境変数 (Technical Requirements)

### 4.1 必須環境変数 (Vercel / .env)
システムを正常に稼働させるため、Vercelの **Settings > Environment Variables** にて以下の5つを必ず設定してください。

*   `GOOGLE_API_KEY`: Gemini APIキー (AI Studioで取得)。
*   `FRED_API_KEY`: FRED APIキー (経済指標取得用)。
*   `AI_MODEL_PRO`: 分析用メインモデル (推奨: `gemini-2.0-flash-exp` または `gemini-1.5-pro`)。
*   `AI_MODEL_FLASH`: 翻訳・バックアップ用モデル (推奨: `gemini-1.5-flash`)。
*   `NEXT_PUBLIC_GA_ID`: Google Analytics 4 測定ID (例: `G-XXXXXXXXXX`)。

### 4.2 依存ライブラリ (Dependencies)
*   `yfinance`: 市場データ取得機能の中核。
*   `google-generativeai`: Google AI Studioへのインターフェース。
*   `next`: フロントエンドフレームワーク。
*   `recharts` / `react-plotly.js`: 高度なチャート描画。

---

## 5. 今後の拡張性 (Roadmap)
*   **OAuth Integration**: ユーザー認証とポートフォリオ連携。
*   **Alerting System**: GMSスコアの急変動時のメール/LINE通知。
*   **Vector Search**: 過去の市場局面（Archive）からの類似検索機能。

---
*Document Version: 1.0.0 (2026-01-11)*
