// components/ui/table-skeleton.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // shadcn/ui skeleton

interface TableSkeletonProps {
  /** number of placeholder rows to render */
  rows?: number;
  /** column widths (Tailwind classes) to hint at real content length */
  colWidths?: string[];
}

export default function TableSkeleton({
  rows = 5,
  colWidths = ["w-12", "w-56", "w-40", "w-40", "w-24"],
}: TableSkeletonProps) {
  return (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          <TableHead>ลำดับ</TableHead>
          <TableHead>ประเภทเอกสาร</TableHead>
          <TableHead>จำนวนเอกสาร</TableHead>
          <TableHead>วันที่เอกสาร</TableHead>
          <TableHead>จัดการ</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {colWidths.map((w, j) => (
              <TableCell key={j}>
                <Skeleton className={`${w} h-4`} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
