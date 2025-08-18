"use client";

import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRole } from "../types/role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, BarChart2, Mail } from "lucide-react";

interface UserNavProps {
  user: {
    user?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email: string;
    role: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuth();
  const staffProfile =`${user?.firstName?.[0]}${user?.lastName?.[0]}`.toUpperCase();
  const adminProfile = user?.displayName?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
  const profile = user.role === UserRole.SUPER_ADMIN ? adminProfile : staffProfile;
  const name = user.role === UserRole.SUPER_ADMIN ? user?.displayName : `${user?.firstName} ${user?.lastName}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={profile} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {profile}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        <div className="flex items-center my-2 ml-1">
          <BarChart2 className="mr-2 h-4 w-4" />
          <span> {user.role}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="ml-3 my-3">
          <div className="flex items-center">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium leading-none text-muted-foreground ml-2">{name}</p>
          </div>
          <div className="flex items-center mt-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs leading-none text-muted-foreground ml-2">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
