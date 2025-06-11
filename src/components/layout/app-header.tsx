import { SidebarTrigger } from "../ui/sidebar";

export default function AppHeader() {
  return (
    <div>
      <header className="bg-background/50 flex h-14 items-center gap-3 px-4 backdrop-blur-xl lg:h-[60px]">
        <SidebarTrigger />
      </header>
    </div>
  );
}
