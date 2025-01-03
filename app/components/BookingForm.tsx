"use client";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm: React.FC = () => {
    const [date, setDate] = useState<Date | null>(null);
    const [guests, setGuests] = useState<number | string>("");
    const [name, setName] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<Record<string, string | number>[]>([]);

    // Reference for scrolling to booking details
    const bookingDetailsRef = useRef<HTMLDivElement>(null);

    // Fetch available slots when the date is selected
    useEffect(() => {
        if (date) {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            axios
                .get("https://restaurant-booking-backend-production-667c.up.railway.app/api/bookings/get-available-slots", {
                    params: { date: localDate.toISOString().split("T")[0] },
                })
                .then((response) => {
                    setAvailableSlots(response.data.availableSlots);
                })
                .catch((error) => {
                    console.error("Error fetching available slots:", error);
                });
        }
    }, [date]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedSlot || !guests || !name || !contact) {
            return;
        }

        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setIsSubmitting(true);
        try {
            const response = await axios.post("https://restaurant-booking-backend-production-667c.up.railway.app/api/bookings/create-booking", {
                date: localDate.toISOString().split("T")[0],
                time: selectedSlot,
                guests,
                name,
                contact,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Update booking details to show in UI
            setBookingDetails(response.data.data);
            // Clear the form
            setDate(null);
            setGuests("");
            setName("");
            setContact("");
            setSelectedSlot("");

            // Scroll to booking details
            // if (bookingDetailsRef.current) {
            //     bookingDetailsRef.current.scroll({ behavior: "smooth" });
            // }

            // Scroll to the bottom of the page
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }, 100); // Delay to ensure rendering of new content
            // console.log("Booking details:", bookingDetails);
        } catch (error) {
            console.log("Create booking error:", error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10 px-4">
            <div className="w-full max-w-lg p-8 bg-white text-black rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">Restaurant Booking</h2>
                <form onSubmit={handleSubmit}>
                    {/* Date Picker */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Reservation Date</label>
                        <DatePicker
                            selected={date}
                            onChange={(date: Date | null) => setDate(date)}
                            className="mt-2 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholderText="Select Date"
                        />
                    </div>

                    {/* Time Picker */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Reservation Time</label>
                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            disabled={!date}
                            className="mt-2 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {!date ? (
                                <option disabled>Select date first</option>
                            ) : (
                                <>
                                    <option value="">Select a time slot</option>
                                    {availableSlots.map((slot, index) => (
                                        <option key={index} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    {/* Number of Guests */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Number of Guests</label>
                        <input
                            type="number"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="mt-2 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Number of Guests"
                        />
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Your Name"
                        />
                    </div>

                    {/* Contact */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700">Contact Details</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="mt-2 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Your Contact"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Booking"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Display Booking Details */}
            {bookingDetails.length > 0 && (
                <div 
                    ref={bookingDetailsRef}
                    className="mt-10 w-full max-w-lg p-8 bg-white text-black rounded-lg shadow-lg"
                >
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Booking Details</h3>
                    <p className="text-l text-green-500 mb-4">Booking created successfully.</p>
                    <ul className="space-y-2">
                        {bookingDetails.map((detail, index) => (
                            <li key={index} className="text-gray-800">
                                {Object.entries(detail).map(([key, value]) => (
                                    <p key={key}>
                                        <span className="font-medium capitalize">{key}:</span> {value}
                                    </p>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BookingForm;
