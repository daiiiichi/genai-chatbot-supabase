import { Paperclip } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function FileUploadButton() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <label
            htmlFor="file-upload"
            className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
            data-state="closed"
            data-slot="tooltip-trigger"
          >
            <input
              multiple
              type="file"
              id="file-upload"
              className="hidden"
              aria-label="Upload file"
              disabled
            />
            <Paperclip className="text-primary size-5" />
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>Coming Soon...</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
