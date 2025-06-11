import { Textarea } from "../components/ui/textarea";
import AppHeader from "@/components/app-header";

export default function Home() {
  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <AppHeader />
      <div className="p-4">
        <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
            <Textarea />
          </div>
        </div>
      </div>
    </div>
  );
}
