"use client";

import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

type SubmitButtonProps = {
  userInput: string;
  onSend: () => void;
};

export default function SubmitButton({ userInput, onSend }: SubmitButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="submit"
          onClick={onSend}
          title="Send Message"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all
            disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:shrink-0 [&_svg]:size-4 
            outline-none focus-visible:border-ring focus-visible:ring-50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
            aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9 h-8 w-8 rounded-full"
          data-state="closed"
          disabled={!userInput.trim()}
        >
          <ArrowUp className="lucide lucide-arrow-up" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Send Message</p>
      </TooltipContent>
    </Tooltip>
  );
}
