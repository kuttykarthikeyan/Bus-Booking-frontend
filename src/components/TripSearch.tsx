import React, { useState } from 'react';
import { useGetTripsByFilterMutation } from '../services/tripApi';
import { TripQuery } from '../types/tripTypes';
import TripCard from './TripCard';
import { MapPin, CreditCard, Users, Search } from 'lucide-react';



const TripSearch: React.FC = () => {
  const [query, setQuery] = useState<TripQuery>({
    source: '',
    destination: '',
    minPrice: undefined,
    maxPrice: undefined,
    seats: undefined
  });
  
  const [getTripsByFilter, { data, isLoading, error }] = useGetTripsByFilterMutation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuery({ 
      ...query, 
      [name]: name.includes('Price') || name === 'seats' ? 
        value ? Number(value) : undefined : 
        value 
    });
  };
  
  const handleSearch = async () => {
   
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined && value !== '')
    );
  try {
    await getTripsByFilter(filteredQuery).unwrap();
  } catch (err) {
    console.error('Search failed:', err);
  }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your Trip</h2>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="relative">
            <MapPin size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="source"
              placeholder="Departure city"
              value={query.source}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="relative">
            <MapPin size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="destination"
              placeholder="Arrival city"
              value={query.destination}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
     
        
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
          <div className="relative">
            <CreditCard size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="number"
              name="minPrice"
              placeholder="0"
              value={query.minPrice || ''}
              onChange={handleChange}
              min="0"
              className="pl-10 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
          <div className="relative">
            <CreditCard size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="number"
              name="maxPrice"
              placeholder="5000"
              value={query.maxPrice || ''}
              onChange={handleChange}
              min="0"
              className="pl-10 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Seats</label>
          <div className="relative">
            <Users size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="number"
              name="seats"
              placeholder="1"
              value={query.seats || ''}
              onChange={handleChange}
              min="1"
              className="pl-10 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={handleSearch} 
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Search size={18} className="mr-2" />
          Search Trips
        </button>
      </div>
      
      <div className="mt-8">
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
            Error fetching trips. Please try again.
          </div>
        )}
        
        {data?.data && data.data.length === 0 && (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md text-center">
            No trips found matching your criteria. Please try different search options.
          </div>
        )}
        
        {data?.data && data.data.length > 0 && (
          <div className="space-y-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Available Trips ({data.data.length})</h3>
            {data.data.map((trip) => (
              <TripCard 
                key={trip._id} 
                trip={trip} 
            
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripSearch;