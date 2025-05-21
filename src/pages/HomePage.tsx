import React from 'react';
import TripSearch from '../components/TripSearch';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore. Book. Travel.</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Find affordable and convenient trips between cities. Start your journey now!
        </p>
      </div>

      <div className="mt-8 px-4"> 
        <TripSearch />
      </div>

      <div className="mt-12 text-center px-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Verified Trips</h3>
            <p className="text-gray-600">We ensure all trip listings are verified and trustworthy.</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Affordable Prices</h3>
            <p className="text-gray-600">Competitive prices to make travel accessible to everyone.</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Simple Booking</h3>
            <p className="text-gray-600">Book your ride in just a few clicks. Hassle-free experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
