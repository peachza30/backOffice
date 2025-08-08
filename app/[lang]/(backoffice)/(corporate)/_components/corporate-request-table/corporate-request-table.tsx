"use client";
import * as React from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/pagination";
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { corporateRequestColumns } from "./partials/columns";
import { TablePagination } from "@/components/pagination/pagination";
import { CorporateSkeleton } from "../corporate-skeleton/corporate-skeleton";

export function CorporateRequestDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { requests, requestForm, requestStatus, loading, metadata, fetchCorporateRequests, fetchCorporateRequestForm, fetchCorporateRequestStatus } = useCorporateStore();
  const [search, setSearch] = useState(""); // คำค้น
  const [statusVal, setStatusVal] = useState(""); // สถานะคำขอ
  const [requestTypeVal, setRequestTypeVal] = useState(""); // ประเภทคำขอ
  const [startDate, setStartDate] = useState(""); // วันที่เริ่มต้น (yyyy-mm-dd)
  const [endDate, setEndDate] = useState(""); // วันที่สิ้นสุด
  const [fetchClear, setFetchClear] = useState(false);

  const statusOpts: { value: string; label: string }[] = [
    { value: "", label: "--- ทั้งหมด ---" },
    ...requestStatus
      .filter(item => item.active === 1)
      .map(item => ({
        value: String(item.id),
        label: item.description,
      })),
  ];
  
  const requestTypeOptions: { value: string; label: string }[] = [
    { value: "", label: "--- ทั้งหมด ---" },
    ...requestForm
      .filter(item => item.active === 1)
      .map(item => ({
        value: String(item.id),
        label: item.description,
      })),
  ];

  /* ── Data filters functions ────────────────────────────────────── */
  const handleClear = () => {
    setSearch("");
    setStatusVal("");
    setRequestTypeVal("");
    setStartDate("");
    setEndDate("");
    setFetchClear(true);
  };

  /* ── Data fetch helpers ────────────────────────────────────── */
  const buildParams = (page = 1, limit = 5) => {
    const sortObj = sorting[0] || { id: "created_at", desc: false };
    return {
      search: search || "",
      requestStatus: statusVal || "",
      page,
      limit,
      sort: sortObj.id,
      order: sortObj.desc ? "DESC" : "ASC",
      requestFormId: requestTypeVal,
      startDate: startDate || "",
      endDate: endDate || "",
    } as const;
  };

  const fetchData = (pageIndex = 0, pageSize = Number(metadata?.limit) || 10) => {
    fetchCorporateRequests(buildParams(pageIndex + 1, pageSize));
  };

  /* ── Effects ──────────────────────────────────────────────── */
  useEffect(() => {
    fetchData(0); // initial load
    fetchCorporateRequestForm();
    fetchCorporateRequestStatus();
  }, []);

  useEffect(() => {
    fetchData(0);
    setFetchClear(false); // reset
  }, [fetchClear]);

  /* ── React Table instance ─────────────────────────────────── */
  const table = useReactTable({
    data: requests || [],
    columns: corporateRequestColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Tell React Table we're handling pagination
    pageCount: metadata?.last_page,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Number(metadata?.page) - 1,
        pageSize: Number(metadata?.limit),
      },
    },
  });

  console.log("requests", requests);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 text-sm text-default-900">
        {/* ประเภทคำขอ */}
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold whitespace-nowrap">ประเภทคำขอ</label>
          <div className="w-full">
            <Select value={requestTypeVal} onValueChange={setRequestTypeVal}>
              <SelectTrigger>
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                {requestTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* สถานะคำขอ */}
        <div className="flex items-center gap-4">
          <label className="w-20 font-semibold whitespace-nowrap text-right">สถานะคำขอ</label>
          <div className="w-full">
            <Select value={statusVal} onValueChange={setStatusVal}>
              <SelectTrigger>
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                {statusOpts.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* วันที่ยื่นคำขอ */}
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold whitespace-nowrap">วันที่ยื่นคำขอ</label>
          <div className="flex gap-2 w-full">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full" />
            <span className="text-sm flex items-center justify-center font-semibold">ถึง</span>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full" />
          </div>
        </div>

        {/* คำค้น */}
        <div className="flex items-center gap-4">
          <label className="w-20 font-semibold whitespace-nowrap text-right">คำค้น</label>
          <div className="w-full">
            <Input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="เลขที่คำขอ/เลขทะเบียนนิติบุคคล/ชื่อนิติบุคคล" className="w-full" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pr-5 pt-1 text-default-900">
        <Button
          variant="outline"
          className="w-32"
          onClick={() => {
            fetchData();
          }}
        >
          <Icon icon="mingcute:search-line" width="24" height="24" />
          ค้นหา
        </Button>
        <Button
          variant="outline"
          className="w-32"
          onClick={() => {
            handleClear();
          }}
        >
          <Icon icon="solar:refresh-line-duotone" width="24" height="24" />
          ล้างค่า
        </Button>
      </div>
      <div className="p-1 md:p-5">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={corporateRequestColumns.length} className="h-24 text-center">
                  --NO DATA--
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination metadata={metadata} onPageChange={index => fetchData(index)} onPageSizeChange={size => fetchData(0, size)} />
    </>
  );
}

export default CorporateRequestDataTable;
