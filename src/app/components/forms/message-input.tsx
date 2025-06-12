import { Textarea } from "../ui/textarea";
import SubmitButton from "../ui/submit-button";
import FileUploadButton from "../ui/file-upload-button";

export default function MessageInput() {
  return (
    <div className="border-input bg-background rounded-3xl border p-2 shadow-xs w-full max-w-(--breakpoint-md)">
      <Textarea
        placeholder="Ask me anything..."
        className="border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex items-center justify-between gap-2 pt-2">
        <FileUploadButton />
        <SubmitButton />
      </div>
    </div>
  );
}
