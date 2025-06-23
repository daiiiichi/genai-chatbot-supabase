"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAtom } from "jotai";
import { llmModelAtom, llmComboboxOpenAtom } from "@/atoms/chat";
import { modelList } from "@/constants/llm-model-list";

export function LLMSelectCombobox() {
  const [open, setOpen] = useAtom(llmComboboxOpenAtom);
  const [llmModel, SetLlmModel] = useAtom(llmModelAtom);

  const selectedModel = modelList.find((model) => model.value === llmModel);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[216px] justify-between"
        >
          {selectedModel ? (
            <div className="flex items-center">
              <img src={selectedModel.logo} alt="" className="mr-3 h-4 w-4" />
              {selectedModel.label}
            </div>
          ) : (
            "Select LLM model..."
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[216px] p-0">
        <Command>
          <CommandInput placeholder="Search LLM model..." />
          <CommandList>
            <CommandEmpty>No LLM model found.</CommandEmpty>
            <CommandGroup>
              {modelList.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={() => {
                    SetLlmModel(model.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      llmModel === model.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <img src={model.logo} alt="" className="mr-1 h-4 w-4" />
                  {model.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
