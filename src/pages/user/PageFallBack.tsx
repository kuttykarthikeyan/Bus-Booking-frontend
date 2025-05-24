export default function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
      <div className="text-center">
        <div className="text-lg font-medium">Loading Page...</div>
        <div className="mt-2 text-sm text-gray-500">Please wait while we fetch the content.</div>
      </div>
    </div>
  );
}
