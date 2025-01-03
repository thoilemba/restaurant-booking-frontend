import { Metadata } from "next";
import BookingForm from "./components/BookingForm";

export const metadata: Metadata = {
  title: 'Restaurant Booking',
  description: 'A simple restaurant booking website.',
}

export default function Home() {
  return (
    <div className="h-screen">
      <BookingForm />
    </div>
  );
}
