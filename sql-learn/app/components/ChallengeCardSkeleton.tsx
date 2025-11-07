export function ChallengeCardSkeleton() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-3">
          {/* Number badge */}
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>

          {/* Title */}
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-4">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}
