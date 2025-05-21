import React, { useState } from "react";
import { AlertMessage, BookedTrip } from "../types/bookingTypes";
import { useHistoryQuery, useCancelSeatsMutation } from "../services/bookingApi";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const BookingCard = () => {
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<{ [key: string]: number[] }>({});
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const { data:apiResponse, isLoading, isError,refetch } = useHistoryQuery();
  const [cancelSeats, { isLoading: isCancelling }] = useCancelSeatsMutation();
  const [showCanceledTrips, setShowCanceledTrips] = useState(false);

  const handleToggleExpand = (bookingId: string) => {
    setExpandedBookingId(prev => (prev === bookingId ? null : bookingId));
  };

  const handleSeatSelect = (bookingId: string, seat: number) => {
    setSelectedSeats(prev => {
      const current = prev[bookingId] || [];
      return {
        ...prev,
        [bookingId]: current.includes(seat)
          ? current.filter(s => s !== seat)
          : [...current, seat],
      };
    });
  };

  const handleCancelSeats = async (bookingId: string) => {
    const seatsToCancel = selectedSeats[bookingId] || [];

    try {
      const response = await cancelSeats({
        booking_id: bookingId,
        seat_numbers: seatsToCancel,
      }).unwrap();

      setExpandedBookingId(null);
      setSelectedSeats(prev => ({ ...prev, [bookingId]: [] }));

      setAlertMessage({
        type: "success",
        text: "Seats cancelled successfully",
      });

      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to cancel seats:", err);
      setAlertMessage({
        type: "error",
        text: "Failed to cancel seats. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-state">
        <div className="text-xl font-medium text-gray-700">Loading bookings...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="error-state">
        <div className="text-xl font-medium text-red-600">
          Error loading trip data.
        </div>
      </div>
    );
  }

  if (!apiResponse || (!apiResponse.data.bookedTrips?.length && !apiResponse.data.canceledTrips?.length)) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="empty-state">
        <div className="text-xl font-medium text-gray-500">No trips found</div>
      </div>
    );
  }

  const bookedTrips = apiResponse.data.bookedTrips || [];
  const canceledTrips = apiResponse.data.canceledTrips || [];

  return (

    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {alertMessage && (
        <div
          className={`mb-4 p-3 rounded-md ${
            alertMessage.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
          data-testid="alert-message"
        >
          {alertMessage.text}
        </div>
      )}

      {bookedTrips.map((booking: BookedTrip) => (
        <div
          key={booking._id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          data-testid="booked-trip"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {booking.trip_id.source} to {booking.trip_id.destination}
              </h2>
              <p className="text-gray-500">Booking ID: {booking._id.slice(-8)}</p>
              <p className="text-gray-500">Trip ID: {booking.trip_id._id.slice(-8)}</p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-sm font-medium capitalize"
              style={{
                backgroundColor:
                  booking.booking_status === "confirmed" ? "#dcfce7" : "#fee2e2",
                color:
                  booking.booking_status === "confirmed" ? "#166534" : "#991b1b",
              }}
            >
              {booking.booking_status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-medium">
                {formatDate(booking.trip_id.departure_time)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Arrival</p>
              <p className="font-medium">
                {formatDate(booking.trip_id.arrival_time)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Seat Numbers</p>
            <div className="flex flex-wrap gap-2">
              {booking.seat_numbers.map(seat => (
                <span
                  key={seat}
                  className="bg-gray-100 px-2 py-1 rounded text-sm font-medium"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p
                className={`font-medium capitalize ${
                  booking.payment_status === "completed"
                    ? "text-green-600"
                    : booking.payment_status === "refunded"
                    ? "text-blue-600"
                    : "text-amber-600"
                }`}
              >
                {booking.payment_status}
              </p>
            </div>
            <div className="text-xl font-bold">
              ₹{booking.trip_id.price * booking.seat_numbers.length}
            </div>
          </div>

          {booking.booking_status === "confirmed" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleToggleExpand(booking._id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium transition-colors"
                data-testid="toggle-cancel-options"
              >
                {expandedBookingId === booking._id ? "Hide Cancel Options" : "Cancel Seats"}
              </button>

              {expandedBookingId === booking._id && (
                <div className="mt-4 space-y-4" data-testid="cancel-options">
                  <p className="text-sm text-gray-600">Select seats to cancel:</p>

                  <div className="flex flex-wrap gap-2">
                    {booking.seat_numbers.map(seatNumber => {
                      const isSelected =
                        selectedSeats[booking._id]?.includes(seatNumber) || false;
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => handleSeatSelect(booking._id, seatNumber)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            isSelected
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          data-testid={`seat-button-${seatNumber}`}
                        >
                          {seatNumber}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {(selectedSeats[booking._id]?.length || 0)} seat(s) selected
                    </p>
                    <button
                      onClick={() => handleCancelSeats(booking._id)}
                      disabled={
                        (selectedSeats[booking._id]?.length || 0) === 0 || isCancelling
                      }
                      className={`px-4 py-2 rounded font-medium ${
                        isCancelling || (selectedSeats[booking._id]?.length || 0) === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      data-testid={
                        isCancelling ? "cancellation-in-progress" : "confirm-cancellation"
                      }
                    >
                      {isCancelling ? "Processing..." : "Confirm Cancellation"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
{canceledTrips.length > 0 && (
  <div className="mt-10">
    <button
      onClick={() => setShowCanceledTrips(prev => !prev)}
      className="px-4 py-2 mb-4 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium transition"
    >
      {showCanceledTrips ? "Hide Canceled Trips" : "View Canceled Trips"}
    </button>

    {showCanceledTrips && (
      <>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Canceled Trips</h2>
        <div className="space-y-4" data-testid="cancelled-trips">
          {canceledTrips.map((booking: BookedTrip) => (
            <div
              key={booking._id}
              className="bg-gray-50 border border-gray-200 rounded-md p-4"
              data-testid="cancelled-trip"
            >
              <h3 className="font-semibold text-gray-800">
                {booking.trip_id.source} to {booking.trip_id.destination}
              </h3>
              <p className="text-sm text-gray-600">
                Departure: {formatDate(booking.trip_id.departure_time)}
              </p>
              <p className="text-sm text-gray-600">
                Seats Canceled: {booking.seat_numbers.join(", ")}
              </p>
              <p className="text-sm text-red-600 font-medium">Booking Canceled</p>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}

</div>
  );
};

export default BookingCard;
