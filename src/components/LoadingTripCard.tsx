const LoadingTripCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse border border-gray-100">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
          </div>
          
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center px-6">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="w-32 h-0.5 bg-gray-300 relative my-2">
                <div className="absolute w-3 h-3 bg-gray-300 rounded-full -top-1 -left-1"></div>
                <div className="absolute w-3 h-3 bg-gray-300 rounded-full -top-1 -right-1"></div>
              </div>
            </div>

            <div className="text-right">
              <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="flex items-center justify-end space-x-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end ml-6 pl-6 border-l border-gray-200">
          <div className="h-6 w-20 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-28 bg-green-200 rounded"></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="h-6 w-20 bg-blue-100 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingTripCard;
