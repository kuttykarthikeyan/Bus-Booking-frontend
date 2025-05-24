import Navbar from '../../components/Navbar';
import BookingCard from '../../components/BookingCard';

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BookingCard />
      </div>
    </div>
  );
};

export default HistoryPage;