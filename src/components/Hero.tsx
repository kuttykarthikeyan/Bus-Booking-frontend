export default function Hero() {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold">Welcome to ExpressBus</h1>
              <p className="mt-2 text-blue-100">Your journey begins with a simple login</p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-blue-100">Daily Routes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-blue-100">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-blue-100">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }