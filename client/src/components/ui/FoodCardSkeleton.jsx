export default function FoodCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image placeholder */}
      <div className="h-40 bg-gray-300" />

      <div className="p-4 space-y-3">
        {/* Title line */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />

        {/* Category tag */}
        <div className="h-4 bg-gray-200 rounded w-1/3" />

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Button placeholder */}
        <div className="h-9 bg-gray-200 rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}
