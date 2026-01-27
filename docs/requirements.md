# Global Macro Signal - 要件定義書 (v2.2.0)

> **Last Updated**: 2026-01-27
> **Version**: 2.2.0 (Premium UI & Theme Stabilization)

5人の専門家チームによる再定義を行い、機関投資家レベルの「プロ仕様」ダッシュボードを目指します。

## 1. 金融クオンツ（指標・ロジック）- Advanced
**目標**: 市場の「歪み」と「危機」を早期検知するマクロリスクモデルの構築。

*   **リスク信号 (Risk ON/OFF Signal)**:
    *   **HY OAS (ハイ・イールド債スプレッド)**: 信用収縮の早期警戒信号 (FRED)
    *   **VIX / MOVE**: 株式・債券市場の恐怖指数
*   **先行指標 (Leading Indicators)**:
    *   **逆イールド (Yield Curve)**: 10Y-2Y, 10Y-3M
    *   **AIセンチメント**: ニュース解析による市場心理の数値化
*   **市場構造**:
    *   **米ネット流動性**: Fed BS - TGA - RRP
    *   **銅/金レシオ**: 景気先行指標

## 2. SRE（信頼性・運用）- Robust
**目標**: 複数のデータソースを統合し、欠損なきデータパイプラインを構築する。

*   **ハイブリッドデータソース (v2.1.0)**:
    *   **FMP (Financial Modeling Prep) v3 API**: 経済指標カレンダー、主要株価
    *   **FRED API**: 連銀公式マクロデータ
    *   **Yahoo Finance**: 補助的な市場データ
*   **アーキテクチャ (Static Bundling)**:
    *   **Edge Compatibility**: Vercel Edge Runtimeでの動作を保証するため、データはビルド時に静的バンドル (`import`) される。
    *   **Fail-Safe**: APIエラー時もシステム全体を停止させない堅牢なエラーハンドリング。

## 3. UI/UXデザイナー - Cockpit
**目標**: 複雑なマクロ指標を「一瞬」で判断させる視覚言語。

*   **News Ticker**: 8ヶ国語対応のリアルタイムニュース速報（静的データ配信により超高速化）。
*   **Signal Panel**: 即座に市場状態（Safe/Caution/Danger）を判別可能。
*   **Premium Modal**: 透過・ブラーを廃止し、100%ソリッドな背景で視認性を極限まで高めたメソドロジー・ポップアップ。
*   **Default Dark Theme**: ブランドイメージを統一するため、新規訪問者に対してダークモードをデフォルト設定。

## 4. グロース・SEO・AI戦略 - Global & Automated
**目標**: 8ヶ国語展開 × AI自動生成記事で、世界の検索流入を独占する。

*   **多言語対応**:
    *   JP, EN, ES, CN, HI, ID, AR, RU, DE, FR, IT, PT
*   **AIコンテンツファクトリー**:
    *   **Gemini 3 Flash / 2.0 Flash**: 超高速・高精度な多言語翻訳と市場分析レポート生成。
    *   **Node.js Bridge**: Python環境からTypeScriptロジックを呼び出し、一貫した翻訳精度を担保。

## 5. リーガル・コンプライアンス
**目標**: グローバル展開に耐えうる法的堅牢性の確保。

*   **免責事項**: AI生成コンテンツの不確実性を明記。
*   **データ権利**: 各データプロバイダー（FMP, FRED）の利用規約に準拠。
