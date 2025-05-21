import React from 'react';
import { Trip } from '../types/user/tripTypes';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate=useNavigate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const calculateDuration = () => {
    const departure = new Date(trip.departure_time);
    const arrival = new Date(trip.arrival_time);
    const durationMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSelectSeats = () => {
    navigate(`/trip/booking/${trip._id}`);
  };
      
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="font-bold text-xl text-gray-800">{trip.bus_id.busType}</h3>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700 font-medium">{trip.bus_id.busNumber}</span>
          </div>
          
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-bold text-xl text-gray-900">{formatDate(trip.departure_time)}</p>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={16} className="mr-1 text-gray-500" />
                <p>{trip.source}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center px-6">
              <div className="text-xs text-gray-500 font-medium flex items-center">
                <Clock size={14} className="mr-1" />
                {calculateDuration()}
              </div>
              <div className="w-32 h-0.5 bg-gray-300 relative my-2">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1 -left-1"></div>
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1"></div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-xl text-gray-900">{formatDate(trip.arrival_time)}</p>
              <div className="flex items-center justify-end text-gray-600 mt-1">
                <MapPin size={16} className="mr-1 text-gray-500" />
                <p>{trip.destination}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between items-end ml-6 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">₹{trip.price}</p>
            <p className="text-sm text-gray-600">{trip.available_seats.length} seats left</p>
          </div>
          
          <button
            onClick={handleSelectSeats}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Select Seats
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {trip.bus_id.amenities.map((amenity, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center">
              <span className="ml-1">{amenity}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripCard;