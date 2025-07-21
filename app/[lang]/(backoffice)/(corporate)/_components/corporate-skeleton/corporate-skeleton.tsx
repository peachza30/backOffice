import { Skeleton } from "../ui/skeleton";

export const CorporateSkeleton = () => (
  <div className="container mx-auto  space-y-6">
    {/* card 2 -------------------------------------------------- */}
    <div className="bg-white border border-blue-100/75 rounded-lg p-6">
      <Skeleton className="w-48 h-5 mb-6" /> {/* title bar */}
      {/* 3 rows ใน card นี้ */}
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-5 w-full mb-4 last:mb-0" />
      ))}
    </div>
    {/* card 1 -------------------------------------------------- */}
    <div className="bg-white border border-blue-100/75 rounded-lg p-6">
      {/* row ชื่อบริษัท / ENG / RegNo / ประเภทบริการ */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
          <Skeleton className="w-36 h-5 shrink-0" />
          <Skeleton className="h-5 flex-1" />
        </div>
      ))}
    </div>
  </div>
);
