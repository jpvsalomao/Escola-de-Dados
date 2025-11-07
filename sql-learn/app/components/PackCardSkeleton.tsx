export function PackCardSkeleton() {
  return (
    <div className="h-full bg-white border-2 border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="space-y-4">
        {/* Title */}
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
        </div>

        {/* Button */}
        <div className="pt-2">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
}
