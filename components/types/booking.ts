import { DateRange } from "react-day-picker";

export interface Booking {
  id: string;
  packageRestaurantId: string;
  branchId: string;
  userId: string;
  paymentStatus: string;
  remark: string;
  lastBooking: {
    bookingTime: string;
    bookingDate: string;
  };
  totalAmount: number;
  checkoutStatus: string;
  subTotal: number;
  discount: number;
  tax: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    hasNext: boolean;
    totalBooks?: number;
    newCustomers?: number;
  };
}

export interface RecentBookingsProps {
  dateRange?: DateRange;
  branchId?: string,
  checkoutStatus?: string
}