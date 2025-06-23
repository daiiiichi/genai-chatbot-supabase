"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("チャット画面でエラーが発生:", error);
  }, [error]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-2">エラーが発生しました</h2>
      <p className="text-sm text-gray-500 mb-4">{error.message}</p>
      ページの再読み込みをお願いします。
    </div>
  );
}
