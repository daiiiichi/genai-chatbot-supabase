import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { LogOut } from "lucide-react";
import useAuth from "@/hooks/use-auth";

export default function UserInformation() {
  const { session, signOut } = useAuth();

  const avatarUrl = session?.user?.user_metadata?.avatar_url;
  const userName = session?.user?.user_metadata?.user_name;
  const userEmail = session?.user?.email;

  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 w-72">
          <DropdownMenuItem className="py-3">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-1 flex flex-col">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-1" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
