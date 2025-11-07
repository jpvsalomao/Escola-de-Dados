export function PackCardSkeleton() {
  return (
    <div className="h-full bg-white border-2 border-gray-200 rounded-2xl p-6 overflow-hidden relative">
      <div className="space-y-4">
        {/* Title */}
        <div className="h-8 bg-gray-200 rounded w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-24 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 rounded-lg w-20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-6 bg-gray-200 rounded-lg w-16 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-6 bg-gray-200 rounded-lg w-24 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>

        {/* Button */}
        <div className="pt-2">
          <div className="h-4 bg-gray-200 rounded w-28 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
