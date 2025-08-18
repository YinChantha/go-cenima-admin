"use client";

import Link from "next/link";
import { Store, Calendar, Tag, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth-provider";
import { UserRole } from "../types/role";

interface SidebarProps {
  className?: string;
  pathname: string;
}

export function Sidebar({ className, pathname }: SidebarProps) {
  const { user } = useAuth();

  const routes = [
    {
      href: "/dashboard",
      icon: BarChart3,
      title: "Overview",
    },
    {
      href:
        user?.role === UserRole.SUPER_ADMIN
          ? "/dashboard/branches"
          : "/dashboard/restaurant",
      icon: Store,
      title: user?.role === UserRole.SUPER_ADMIN ? "Branches" : "My Restaurant",
    },
    {
      href: "/dashboard/bookings",
      icon: Calendar,
      title: "Bookings",
    },
    {
      href: "/dashboard/promotions",
      icon: Tag,
      title: "Promotions",
    },
  ];

  const isRouteActive = (routeHref: string, currentPathname: string) => {
    if (routeHref === "/dashboard") {
      return currentPathname === "/dashboard";
    }
    return currentPathname.startsWith(routeHref);
  };

  return (
    <aside className={cn("group py-4", className)}>
      <ScrollArea className="h-full py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => {
            const isActive = isRouteActive(route.href, pathname);
            return (
              <Button
                key={route.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "group flex h-10 w-full items-center justify-start gap-2 rounded-lg px-4 text-base font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
