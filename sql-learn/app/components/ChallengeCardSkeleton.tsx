export function ChallengeCardSkeleton() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 overflow-hidden relative">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-3">
          {/* Number badge */}
          <div className="h-6 w-6 bg-gray-200 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>

          {/* Title */}
          <div className="h-6 bg-gray-200 rounded w-3/4 relative overflow-hidden">
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
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-4">
        <div className="h-5 bg-gray-200 rounded w-16 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-20 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </div>
  );
}
