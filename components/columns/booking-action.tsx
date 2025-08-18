"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Props {
  bookingId: string;
}

export function ViewBooking({ bookingId }: Props) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push(`/dashboard/bookings/${bookingId}`)}
    >
      <Eye className="h-4 w-4" />
      <span className="sr-only">View booking</span>
    </Button>
  );
}
