"use client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPaginationRange } from "@/utils/Constant";

interface PaginationProps {
  metadata: ApiMetadata | null;
  onPageChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({ metadata, onPageChange, onPageSizeChange }: PaginationProps) {
  const currentPage = metadata ? Number(metadata.page) - 1 : 0;
  const totalPages = metadata?.last_page || 1;
  const limit = metadata?.limit || "5";
  const canPrevious = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  const pageSizeOptions = ["5", "10", "20", "50"] as const;

  return (
    <div className="flex items-center gap-4 px-4 py-4">
      {/* ----- selector (ชิดซ้าย) ----- */}
      <div className="flex items-center gap-2 flex-row flex-nowrap">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
        <Select value={limit.toString()} onValueChange={val => onPageSizeChange(Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ----- pagination (ชิดขวา) ----- */}
      <div className="ml-auto text-sm text-muted-foreground whitespace-nowrap overflow-x-auto">
        <Pagination>
          <PaginationContent className="flex-nowrap">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (canPrevious) onPageChange(currentPage - 1);
                }}
                className={!canPrevious ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {getPaginationRange(currentPage, totalPages).map((page, i) => (
              <PaginationItem key={i}>
                {page === "..." ? (
                  <span className="px-2">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(Number(page));
                    }}
                  >
                    {Number(page) + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (canNext) onPageChange(currentPage + 1);
                }}
                className={!canNext ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
