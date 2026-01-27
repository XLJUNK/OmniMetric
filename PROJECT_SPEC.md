# Global Macro Signal (OmniMetric Terminal) - プロジェクト仕様書
**Version 4.7.0 (Premium UI & Theme Stabilization)**
**Last Updated:** 2026-01-27

## 1. プロジェクト概要 (Executive Summary)
**Global Macro Signal (GMS)** は、機関投資家レベルの市場リスク分析を個人投資家に提供する、AI駆動型金融・経済分析プラットフォームです。「OmniMetric Terminal」というブランド名で展開され、Bloombergターミナルのような高度な視認性と、生成AIによる深い洞察を融合させています。

### 核心思想 (Core Philosophy)
*   **Institutional Grade (機関投資家品質)**: 遊びのない、プロフェッショナルでミニマルなUI/UX。
*   **Silent Execution (静寂なる実行)**: エラーをユーザーに見せない。徹底的なフォールバックと自己修復機能。
*   **Resilient Intelligence (堅牢な知能)**: 単一のAIモデルに依存せず、稼働率100%を目指す冗長構成。
*   **Fact-Based Authority (客観的権威)**: 予測や助言を排除し、純粋なデータと事実のみを法的準拠の下で提供する。

---

## 2. システムアーキテクチャ (Architecture)

本システムは、**「静的解析とビルド時データ注入（Static Bundling）」**構成を採用し、エッジ環境での安定性を最大化しています。

### 2.1 Backend (Data & SEO Engine)
*   **言語**: Python 3.10
*   **基盤**: GitHub Actions (Scheduled Workflows)
*   **Core Scripts**:
    *   `gms_engine.py`: 市場データ収集(Yahoo/FRED)、GMSスコア算出、AIレポート生成。**FMP v3 API (Robust Endpoints)** を使用し、エラー耐性を強化。
    *   `sns_publisher.py`: Twitter/Blueskyへの自動投稿、緊急アラート(>5%変動)、固定ツイート管理。
    *   `seo_monitor.py`: Google Search Console APIと連携し、トレンドキーワードを分析・抽出。
    *   `utils/log_utils.py`: **Centralized Logger**。APIキーの自動秘匿、ログローテーション、IN/OUT計測を一元管理。
    *   **AI Engine**:
        *   **Primary (High-Value Analysis)**: `Gemini 1.5 Flash` - GMSスコアの洞察生成に使用。
        *   **Secondary (Stable Baseline)**: `Gemini 1.5 Pro` - 複雑な推論分析用。
        *   **Experimental**: `Gemini 2.0 Flash` - 次世代機能のテスト用。
        *   **Observability**: `AIMetrics` クラスにより、各モデルの成功率とレイテンシを追跡・記録。
        *   **Resilience Protocol**: Universal Gateway (V3) を経由し、障害時は自動で Direct Google API への二段階フォールバックを実行。

### 2.2 Frontend (User Interface)
*   **フレームワーク**: Next.js 15 (App Router)
*   **スタイリング**: Tailwind CSS 4.0
*   **ホスティング**: Vercel (Serverless / Edge Functions)
*   **主な機能**:
    *   **News Ticker (`/api/news`)**: 
        *   **Dynamic Model Selection**: タスク内容（翻訳か分析か）に基づき、最適モデルを自動選択。
        *   **Universal Gateway**: 個別スラグに依存しない `ai-gateway.vercel.sh` を使用し、404エラーを物理的に排除。
    *   **Premium Theme Strategy**:
        *   **Dark Mode by Default**: ユーザ利便性とブランドイメージ維持のため、初期状態をダークモードに固定。
        *   **Dynamic Theme Sync**: `ThemeProvider` により、マニュアルでのテーマ切り替えと永続化をサポート。
    *   **Abolished Modal Transparency**: 視認性向上のため、モーダルの透過・ブラーを完全に廃止。100%ソリッドな背景を採用。
    *   **Static OGP**: ブランド一貫性と表示安定性のため、WebサイトのOGPには静的画像 (`/brand-og.png`) を採用。
    *   **Link Preview Strategy**: SNSボットは画像を添付せず、リンク機能（Link Card）を活用して静的OGPを表示させる仕様へ変更（画像生成ロジックは廃止）。
    *   **Economic Calendar**: FREDおよびバックエンド算出データに基づく重要イベント表示。

### 2.3 Workflow (Automation)
1.  **Monitor**: `update.yml`と`sns_bot.yml`が毎時起動。
2.  **Optimize**: `seo_monitor.py`が検索トレンドを取得し、SNSハッシュタグを最適化。
3.  **Publish**:
    *   **Backend**: `fetch_news.py` 実行時、ノードブリッジ用のパスを絶対パスで厳格解決。
    *   **Bundle**: 最新の `current_signal.json` を `frontend/data/` へ転送・バンドルし、Vercelへデプロイ。
    *   **SNS**: Twitter/Bluesky へ多言語で連動ポスト（緊急時は即時アラート）。

---

## 3. 機能仕様 (Functional Features)

### 3.1 GMSスコア (Global Macro Score)
市場のリスク許容度を 0〜100 で数値化。
*   **0-40 (Red)**: Risk Contraction (リスク回避局面)。
*   **40-60 (Yellow)**: Neutral (中立)。
*   **60-100 (Blue)**: Risk Expansionary (リスク選好局面)。
*   **計算ロジック**: VIX, MOVE指数, HY Credit Spread (最重要), NFCI, Market Breadth の加重平均。

### 3.2 SEO & SNS連携システム
*   **GSC Integration**: Google Search Consoleから流入キーワードを学習し、`trending_keywords.json`を生成。
*   **Dynamic Hashtags**: SNS投稿時に、その時々で最も検索されている関連ワード（例: `#VIX`, `#Inflation`）を自動付与。
*   **Emergency Alert**: GMSスコアまたはVIXが5%以上変動した場合、`🚨 EMERGENCY ALERT` を付与して投稿し、自動で固定ポスト化。
*   **UTM Tracking**: 全投稿にGA4計測用パラメータを付与。

### 3.3 ニュースティッカー & AI翻訳
*   **Source**: CNBC等のRSSフィード。
*   **Translation Logic**:
    *   **Batching**: 全見出しを1リクエストのJSONとしてGeminiに送信。
    *   **Professional Core**: 「Bloomberg端末の翻訳者」として、金融特有の言い回し（"Plunge", "Soar"等）を的確に訳出。
    *   **Minimal Disclaimer**: AIインサイトの免責事項を短縮し、ヘッダーのタイムスタンプを削除することで、リアルタイム性を損なわない洗練された表示を実現。
    *   **Resilience**: 翻訳失敗時は即座に英語原文へフォールバック。JSON一括読み込みによる高速化。

### 3.4 データ整合性と検証 (Data Integrity & Validation)
時系列データの信頼性を担保するため、4層の検証フレームワークを実装。
1.  **Availability**: データ取得成功の確認。
2.  **Quality**: `validate_numeric_data()` による NaN/Inf チェック。
3.  **Range**: `validate_range()` による異常値（例: 金利 > 20%）の排除。
4.  **Anomaly**: `detect_anomaly()` による急激な変動（>30-50%）の検出とログ記録。
**対象メトリクス**: US 10Y Yield, Net Liquidity, GMS Score, etc.

---

## 4. 技術要件と環境変数 (Environment Variables)

システム稼働には以下の環境変数が必須です。

**重要なお知らせ (2026.01 Update)**:
セキュリティ強化のため、`NEXT_PUBLIC_` プレフィックスを持つAPIキーの使用は非推奨となりました。すべての AI API コールはサーバーサイド（Backend または Server Actions）で行い、`GEMINI_API_KEY` に統一してください。

### 4.1 Vercel (Frontend Production)
| 変数名 | 説明 |
| :--- | :--- |
| `GEMINI_API_KEY` | サーバーサイド生成/翻訳用 (推奨: `NEXT_PUBLIC_` 版は削除) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 測定ID |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway 認証用 |

### 4.2 GitHub Secrets (Backend Automation)
| 変数名 | 説明 |
| :--- | :--- |
| `GEMINI_API_KEY` | 分析レポート生成用 |
| `FRED_API_KEY` | 経済指標データ取得用 |
| `TWITTER_API_KEY` | X API Key |
| `TWITTER_API_SECRET` | X API Secret |
| `TWITTER_ACCESS_TOKEN` | X Access Token |
| `TWITTER_ACCESS_SECRET` | X Access Secret |
| `BLUESKY_HANDLE` | Bluesky Handle (e.g. `example.bsky.social`) |
| `BLUESKY_PASSWORD` | Bluesky App Password |
| `GSC_CREDENTIALS_JSON` | Google Search Console Service Account Key (JSON content) |
| `FMP_API_KEY` | 経済カレンダー用 (Financial Modeling Prep v3 API) |

### 4.3 依存ライブラリ (Dependencies)
*   **Frontend**: `next`, `react`, `tailwindcss`, `framer-motion`, `recharts`, `lucide-react`, `ai`, `@ai-sdk/google`
*   **Backend**: `yfinance`, `fredapi`, `google-generativeai`, `tweepy`, `atproto`, `google-api-python-client`

---

## 5. 運用とメンテナンス (Operations)
*   **SEO Monitoring**: `backend/seo_monitor.py` を定期実行し、検索トレンドの変化をSNS戦略に反映させる。
*   **Legal Compliance**: 全SNS投稿とWeb表示において、投資助言に該当しないよう免責事項（Disclaimer）を常に明記する。
*   **Cache Strategy**: ニュースAPIは1時間、GMSデータは静的JSONとして毎時更新することで、APIコストとサーバー負荷を最小化する。

---
*OmniMetric Terminal - Built for the Informed Investor.*
