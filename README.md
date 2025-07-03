# Multi-Model GenAI Chatbot

このプロジェクトは、Next.js と Supabase を活用して構築した生成 AI チャットボットアプリです。
大規模言語モデル（LLM）として、Azure OpenAI や Gemini の API を使用しています。
UI には shadcn/ui を採用しています。
本プロジェクトは、個人的な開発スキルの向上を目的として作成しました。

![Top Page](https://github.com/user-attachments/assets/20c830b3-e160-4d43-8c6d-596c1322b7fa)

## 主な機能

- OpenAI や Gemini など、複数の LLM（大規模言語モデル）に対応
- チャット履歴の保存・削除・検索機能
- Supabase Authentication を使用した GitHub 認証機能
- デモモードによるサンプルチャット体験
- shadcn/ui を用いたシンプルかつモダンなデザイン

## アーキテクチャ図

![Architecture](https://github.com/user-attachments/assets/075b9c39-01e5-4a3e-aca5-d3b8fc8874ec)

## ファイル構成

- `src/app/` ... Next.js アプリのエントリーポイントや API ルート
- `src/atoms/` ... Jotai を用いた状態管理の定義
- `src/components/` ... UI コンポーネント群
- `src/constants/` ... デモモード用リストや LLM モデル定義
- `src/hooks/` ... カスタムフック群
- `src/lib/` ... 各種ライブラリや Supabase クライアントの設定
- `src/types/` ... 型定義ファイル

## 今後の修正について

- 添付ファイルを LLM に渡せるファイルアップロード機能の追加
- スマートフォン対応のためのレスポンシブデザイン対応
- BaaS（Supabase）を使用せず、独自の認証およびデータベース環境の構築
- RAG（Retrieval-Augmented Generation）の実装
  などなどを予定しています

## 主要技術

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn ui](https://ui.shadcn.com/)
- [Azure OpenAI API](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/)
- [Gemini API](https://ai.google.dev/)

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
