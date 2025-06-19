import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

type MarkdownDisplayProps = {
  content: string;
};

export default function MarkdownDisplay({ content }: MarkdownDisplayProps) {
  return (
    <div className="prose break-words prose-pre:p-0 prose-pre:bg-transparent prose-code:p-0 prose-code:bg-transparent prose-p:leading-relaxed max-w-full whitespace-normal prose-hr:my-4 prose-sm prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkEmoji]}
        components={{
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={vs}
                wrapLongLines={true}
                codeTagProps={{
                  style: {
                    fontSize: "0.75rem",
                  },
                }}
              >
                {children}
              </SyntaxHighlighter>
            ) : (
              <code className="!bg-gray-200 rounded !px-1 !font-[Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace] !font-normal">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
