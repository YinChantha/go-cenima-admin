import BookingDetailsPage from "@/components/dashboard/bookings/booking-details";

export async function generateStaticParams() {
  // Mock data
  const packages = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
  ];

  return packages.map((pkg) => ({ id: pkg.id }));
}
export default async function ViewBookingDetailsPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <BookingDetailsPage id={params.id} />;
}
