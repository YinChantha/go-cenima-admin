"use client";

import Link from "next/link";
import Image from "next/image";
import { UtensilsCrossed, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  className?: string;
}

export function MainNav({
  sidebarOpen,
  setSidebarOpen,
  className,
}: MainNavProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="ghost"
        className="mr-2 block md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <Link href="/dashboard" className="flex items-start space-x-0">
        <Image src="/images/go-dinning.svg" height={120} width={120} alt="" />
        <span className="text-base font-semibold bg-gray-100 px-2 py-[0.5px] rounded-lg">Portal</span>
      </Link>
    </div>
  );
}
