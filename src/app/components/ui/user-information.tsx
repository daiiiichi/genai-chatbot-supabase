import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export default function UserInformation() {
  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-[2px] focus:ring-offset-2 focus:ring-primary rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
