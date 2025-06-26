import { userInputAtom, messagesAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import { useSetAtom, useAtomValue } from "jotai";
import {
  CodeXml,
  Calendar,
  CookingPot,
  Bot,
  Dices,
  PlaneTakeoff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const sampleList = [
  {
    id: 3,
    text: "GPT と Gemini の違いを教えて",
    icon: Bot,
  },
  {
    id: 0,
    text: "React のコンポーネントとは何ですか",
    icon: CodeXml,
  },
  {
    id: 1,
    text: "2025年6月のカレンダーを作って",
    icon: Calendar,
  },
  {
    id: 2,
    text: "おいしいカレーのレシピを教えて",
    icon: CookingPot,
  },

  {
    id: 4,
    text: "4人で遊べるボードゲームを3つ教えて",
    icon: Dices,
  },
  {
    id: 5,
    text: "イタリアで行くべき観光地はどこですか",
    icon: PlaneTakeoff,
  },
];

export default function SamplePrompt() {
  const setUserInput = useSetAtom(userInputAtom);
  const messages = useAtomValue(messagesAtom);

  return (
    <div
      className={cn(
        "space-x-2 space-y-2 m-2",
        messages.length > 0 ? "hidden" : ""
      )}
    >
      {sampleList.map((sample) => (
        <Button
          variant="outline"
          key={sample.id}
          onClick={() => setUserInput(sample.text)}
        >
          <sample.icon /> {sample.text}
        </Button>
      ))}
    </div>
  );
}
