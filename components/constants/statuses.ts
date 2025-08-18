// constants/statuses.ts

export type BookingStatus =
  | "all"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed";

export const BOOKING_STATUSES: BookingStatus[] = [
  "all",
  "confirmed",
  "pending",
  "cancelled",
  "completed",
];

export const STATUS_COLOR_MAP: Record<Exclude<BookingStatus, "all">, string> = {
  confirmed: "default",
  pending: "secondary",
  cancelled: "destructive",
  completed: "outline",
};
