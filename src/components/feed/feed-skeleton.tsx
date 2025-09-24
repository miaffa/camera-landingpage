export function FeedSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Feed Content Skeleton */}
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-b border-gray-200">
            {/* User Info Skeleton */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Image Skeleton */}
            <div className="w-full aspect-square bg-gray-200 animate-pulse" />

            {/* Interaction Buttons Skeleton */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Likes Count Skeleton */}
            <div className="px-4 pb-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Caption Skeleton */}
            <div className="px-4 pb-4">
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 border-t border-blue-700">
        <div className="flex items-center justify-around py-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1">
              <div className="w-6 h-6 bg-blue-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-12 bg-blue-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
