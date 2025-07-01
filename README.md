# genai-chatbot-supabase

このプロジェクトは、Next.js と Supabase を活用して構築した生成 AI チャットボットアプリです。
大規模言語モデル（LLM）として、Azure OpenAI や Gemini を使用しています。
UI には shadcn/ui を採用しています。
本プロジェクトは、個人的な開発スキルの向上を目的として作成しました。

## 主な機能

- OpenAI や Gemini など複数の LLM（大規模言語モデル）に対応
- Supabase Authentication を使用した GitHub ログイン機能
- チャット履歴の保存・削除
- デモモードによるサンプルチャット体験

## アーキテクチャ図

![genai-chatbot-supabase-arc](https://github.com/user-attachments/assets/075b9c39-01e5-4a3e-aca5-d3b8fc8874ec)

## 開発環境のセットアップ

1. 依存パッケージのインストール

```bash
npm install
```

2. 開発サーバーの起動

```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリが表示されます。

## ファイル構成

- `src/app/` ... Next.js アプリのエントリーポイントや API ルート
- `src/atoms/` ... Jotai を用いた状態管理用の定義
- `src/components/` ... UI コンポーネント群
- `src/constants` ... デモモード用のリストやモデルリスト
- `src/hooks` ... カスタムフックの定義
- `src/lib/` ... 各種ライブラリや Supabase クライアント
- `src/types/` ... 型定義ファイル

## 主要技術

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn ui](https://ui.shadcn.com/)
- [Azure OpenAI API](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/)
- [Gemini API](https://ai.google.dev/)

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
