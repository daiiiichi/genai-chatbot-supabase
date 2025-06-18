import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { Search } from "lucide-react";

export default function SearchChatButton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a>
          <Search />
          <span>Search Chat</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
