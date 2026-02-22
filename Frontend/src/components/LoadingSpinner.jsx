export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 min-h-[60vh]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-lg text-gray-400 font-medium tracking-wide animate-pulse">
        Loading fresh stories...
      </p>
    </div>
  );
}