import CopyButton from "./copy-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
// @ts-expect-error: react-syntax-highlighter does not have types
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error: react-syntax-highlighter does not have types
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
            const codeContent = String(children).trim();

            return match ? (
              <div className="relative bg-white rounded-md overflow-hidden group">
                <div className="flex justify-between items-center px-[10.8px] pt-2 pb-0 text-xs text-white bg-white">
                  <span className="text-gray-500 font-mono text-[10px]">
                    {match[1]}
                  </span>
                  <CopyButton content={codeContent} />
                </div>
                <SyntaxHighlighter
                  language={match[1]}
                  style={vs}
                  wrapLongLines={true}
                  customStyle={{ border: "none" }}
                  codeTagProps={{
                    style: {
                      fontSize: "0.75rem",
                    },
                  }}
                >
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="!bg-gray-200 rounded !px-1 !font-[Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace] !font-normal">
                {codeContent}
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
