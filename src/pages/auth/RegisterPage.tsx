import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageHeading from "../../components/forms/PageHeading";
import RegistrationForm from "../../components/forms/RegisterForm";
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Navbar />
      <main className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <PageHeading />
            <RegistrationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
