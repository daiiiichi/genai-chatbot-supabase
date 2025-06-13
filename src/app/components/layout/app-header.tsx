import { LLMSelectCombobox } from "../forms/llm-select-combobox";
import { SidebarTrigger } from "../ui/sidebar";
import UserInformation from "../ui/user-information";

export default function AppHeader() {
  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <header className="bg-background/50 flex h-14 items-center gap-3 px-4 backdrop-blur-xl lg:h-[60px]">
        <SidebarTrigger />
        <LLMSelectCombobox />
        <UserInformation />
      </header>
    </div>
  );
}
