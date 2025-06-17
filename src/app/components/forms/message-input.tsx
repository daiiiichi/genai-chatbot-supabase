"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import SubmitButton from "./submit-button";
import FileUploadButton from "../ui/file-upload-button";
import { Message } from "../../types/chat";

type MessageInputProps = {
  setChunkedAnswer: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export default function MessageInput({
  setChunkedAnswer,
  setIsLoading,
  isLoading,
}: MessageInputProps) {
  const [userInput, setUserInput] = useState("");

  return (
    <div className="border-input bg-background rounded-3xl border p-2 shadow-xs w-full max-w-(--breakpoint-md)">
      <Textarea
        className="border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Ask me anything..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <div className="flex items-center justify-between gap-2 pt-2">
        <FileUploadButton />
        <SubmitButton
          setChunkedAnswer={setChunkedAnswer}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
    </div>
  );
}
