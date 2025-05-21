import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTripByIdQuery } from "../services/tripApi";
import { useBookSeatsMutation } from "../services/bookingApi";
import { BookingData } from "../types/bookingTypes";


const SeatLayout = () => {

  const { trip_id } = useParams<{ trip_id: string }>();
  const navigate = useNavigate();


  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    trip_id: '',
    seat_numbers: []
  });
  const SEATS_PER_ROW = 8;

  const [bookSeats, { isLoading: isBookingLoading }] = useBookSeatsMutation();
  const { 
    data: tripResponse, 
    isLoading, 
    error,
    refetch 
  } = useGetTripByIdQuery({ trip_id: trip_id! });

  const tripData = tripResponse?.data;

  useEffect(() => {
    if (tripData && selectedSeats.length > 0) {
      setTotalPrice(selectedSeats.length * tripData.price);
    } else {
      setTotalPrice(0);
    }
  }, [selectedSeats, tripData]);
  useEffect(() => {
  setBookingData({
    trip_id: trip_id || '',
    seat_numbers: selectedSeats
  });
  }, [trip_id, selectedSeats]);



  const handleSeatClick = (seatNumber: number) => {
    if (tripData?.booked_seats.includes(seatNumber)) {
      return; 
    }

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter((seat) => seat !== seatNumber);
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

const renderSeats = () => {
  if (!tripData) return null;

  const totalSeats = tripData.total_seats;
  const seatsArray = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const rows = [];
  for (let i = 0; i < totalSeats; i += SEATS_PER_ROW) {
    rows.push(seatsArray.slice(i, i + SEATS_PER_ROW));
  }

  return rows.map((rowSeats, rowIndex) => (
    <div key={`row-${rowIndex}`} className="flex justify-center">
      {rowSeats.map(seatNumber => {
        const isBooked = tripData.booked_seats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);

        return (
          <div
            key={seatNumber}
            className={`w-12 h-12 m-1 rounded-md flex items-center justify-center cursor-pointer transition-colors
              ${isBooked ? 'bg-blue-800 text-white cursor-not-allowed' :
                isSelected ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => handleSeatClick(seatNumber)}
          >
            {seatNumber}
          </div>
        );
      })}
    </div>
  ));
};

  
  const handleConfirmBooking = async () => {
    setBookingError(null);

    try {
      await bookSeats(bookingData).unwrap();
      
      setSelectedSeats([]);
      setTotalPrice(0);

      setBookingSuccess(true);

      await refetch();
    } 
    catch (err: any) {
      console.error("Booking failed:", err);

      if (err?.data?.message?.toLowerCase()) {
        setBookingError("Some of the selected seats are already booked. Please reselect.");
        await refetch();
        setSelectedSeats([]);
      } else {
        setBookingError("Failed to book seats. Please try again.");
      }
    }
  };

 
  const handleViewBookings = () => {
    navigate("/bookings");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading trip data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4 text-center">Error loading trip data. Please try again later.</div>;
  }
  
  if (!tripData) {
    return <div className="text-yellow-600 p-4 text-center">No trip data available</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Select Your Seats</h1>
        
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700"><span className="font-semibold">From:</span> {tripData.source}</p>
            <p className="text-gray-700"><span className="font-semibold">To:</span> {tripData.destination}</p>
            <p className="text-gray-700 mt-2"><span className="font-semibold">Bus:</span> {tripData.bus_id.busNumber} ({tripData.bus_id.busType})</p>
          </div>
          <div>
            <p className="text-gray-700"><span className="font-semibold">Departure:</span> {new Date(tripData.departure_time).toLocaleString()}</p>
            <p className="text-gray-700"><span className="font-semibold">Arrival:</span> {new Date(tripData.arrival_time).toLocaleString()}</p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Status:</span> 
              <span className={`font-medium ${
                tripData.status === "scheduled" ? "text-green-600" : 
                tripData.status === "cancelled" ? "text-red-600" : "text-blue-600"
              }`}>
                {tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center mb-4 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-gray-200 mr-1 rounded-sm"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-green-500 mr-1 rounded-sm"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-800 mr-1 rounded-sm"></div>
            <span>Booked</span>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="w-full bg-gray-300 p-2 rounded-t-lg text-center font-bold mb-6">FRONT</div>
          {renderSeats()}
        </div>
        
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          {bookingSuccess ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="font-bold">Booking Successful!</p>
                <p>Your seats have been booked successfully.</p>
              </div>
              <button 
                onClick={handleViewBookings}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                View My Bookings
              </button>
            </div>) 
            : (
            <>
              <div className="flex justify-between mb-2">
                <span>Selected Seats:</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total Price:</span>
                <span className="font-bold">${totalPrice || 0}</span>
              </div>
              
              {bookingError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {bookingError}
                </div>
              )}
              
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={isBookingLoading || selectedSeats.length === 0}
                className={`w-full py-3 rounded-lg font-bold ${
                  selectedSeats.length > 0 && !isBookingLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-400 cursor-not-allowed text-gray-200'
                }`}
              >
                {isBookingLoading ? 'Processing...' : 'Book Seats'}
              </button>
            </>
          )}
        </div>
      </div>
      
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-2 border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
            <p className="mb-4">
              Are you sure you want to book seat(s): <span className="font-semibold">{selectedSeats.join(", ")}</span> for a total of <span className="font-semibold">${totalPrice}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowConfirmModal(false);
                  await handleConfirmBooking();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;