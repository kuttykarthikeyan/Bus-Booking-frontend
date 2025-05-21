import RegistrationForm from "../components/forms/RegisterForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Navbar />

      <main className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign up to get started
              </p>
            </div>
            <RegistrationForm />
          </div>
        </div>
      </main>

      <div className="bg-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Benefits of Registration</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Enjoy these exclusive features when you register</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200">
              <div className="p-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Quick Booking</h3>
              <p className="mt-2 text-gray-500 text-center">Save time with quick and easy booking process</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200">
              <div className="p-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Booking History</h3>
              <p className="mt-2 text-gray-500 text-center">Access your complete booking history anytime</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200">
              <div className="p-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Special Offers</h3>
              <p className="mt-2 text-gray-500 text-center">Get exclusive deals and discounts</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}