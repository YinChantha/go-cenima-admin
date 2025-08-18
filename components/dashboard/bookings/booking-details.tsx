"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Users } from "lucide-react";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

const bookingFormSchema = z.object({
  status: z.enum(["confirmed", "pending", "cancelled", "completed"]),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: Date;
  time: string;
  packageName: string;
  guests: {
    adults: number;
    children: number;
  };
  status: "confirmed" | "pending" | "cancelled" | "completed";
  total: number;
  notes?: string;
}

export default function BookingDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      status: "pending",
      notes: "",
    },
  });

  useEffect(() => {
    // Simulate API call to fetch booking data
    const fetchBooking = async () => {
      try {
        // Mock data - in a real app, this would be an API call
        const mockBooking: Booking = {
          id: id,
          customer: {
            name: "John Smith",
            email: "john.smith@example.com",
            phone: "+855 12 345 678",
          },
          date: new Date(2025, 3, 15),
          time: "19:00",
          packageName: "Premium Dinner Experience",
          guests: { adults: 4, children: 2 },
          status: "confirmed",
          total: 225.0,
          notes: "Allergic to nuts",
        };

        setBooking(mockBooking);
        form.setValue("status", mockBooking.status);
        form.setValue("notes", mockBooking.notes || "");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load booking details.",
        });
        router.push("/dashboard/bookings");
      }
    };

    fetchBooking();
  }, [id, form, router, toast]);

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(data);

      toast({
        title: "Booking updated",
        description: "The booking has been updated successfully.",
      });

      router.push("/dashboard/bookings");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onCancel() {
    setIsCancelling(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Booking cancelled",
        description: "The booking has been cancelled successfully.",
      });

      router.push("/dashboard/bookings");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  if (!booking) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const breadcrumbItems = [
    { 
      label: "Bookings", 
      href: "/dashboard/bookings", 
      icon: <Calendar className="h-4 w-4" /> 
    },
    { 
      label: "Booking Details" 
    }
  ];


  return (
    <div className="space-y-6">
            <PageBreadcrumb items={breadcrumbItems} />

      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/dashboard/bookings"
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Booking Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
          <p className="text-muted-foreground">
            View and manage booking information.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isCancelling}>
              {isCancelling ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will cancel the booking and
                notify the customer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction
                onClick={onCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Contact details for the booking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">Name</div>
              <div>{booking.customer.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Email</div>
              <div>{booking.customer.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Phone</div>
              <div>{booking.customer.phone}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Information about the reservation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Date</div>
                <div>{format(booking.date, "MMMM d, yyyy")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Time</div>
                <div>{booking.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Guests</div>
                <div>
                  {booking.guests.adults} adults
                  {booking.guests.children > 0 &&
                    `, ${booking.guests.children} children`}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Package</div>
              <div>{booking.packageName}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Total Amount</div>
              <div>${booking.total.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Update Booking</CardTitle>
              <CardDescription>
                Modify the booking status or add notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any special notes or requirements..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Internal notes about the booking (not visible to
                      customers).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/bookings")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
