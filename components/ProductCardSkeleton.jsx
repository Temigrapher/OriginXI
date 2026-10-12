export default function ProductCardSkeleton() {
  return (
    <div className="oxi-card rounded-xl overflow-hidden flex flex-col">
      <div className="skeleton-block aspect-[4/5]" />
      <div className="p-2.5 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
        <div className="flex flex-col gap-1.5">
          <div className="skeleton-block rounded h-4 sm:h-6 w-3/4" />
          <div className="skeleton-block rounded h-3 sm:h-4 w-1/3" />
        </div>
        <div className="flex gap-1">
          <div className="skeleton-block rounded-md h-5 w-8" />
          <div className="skeleton-block rounded-md h-5 w-8" />
          <div className="skeleton-block rounded-md h-5 w-8" />
        </div>
        <div className="skeleton-block rounded-lg h-8 sm:h-10 mt-auto" />
      </div>
    </div>
  );
}