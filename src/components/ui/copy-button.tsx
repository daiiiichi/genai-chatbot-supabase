import { useState } from "react";
import { Copy, ClipboardCheck } from "lucide-react";

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-1 right-1 text-[8px] text-gray-500 px-2 py-1 rounded transition-opacity cursor-pointer"
    >
      {copied ? (
        <div className="flex items-center gap-0.5">
          <ClipboardCheck size={12} />
          <p className="!m-0">コピーしました！</p>
        </div>
      ) : (
        <div className="flex items-center gap-0.5">
          <Copy size={12} />
          <p className="!m-0">コピーする</p>
        </div>
      )}
    </button>
  );
}
