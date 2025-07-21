"use client";
import * as React from "react";

import { useEffect, useState } from "react";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { corporateListColumns } from "./partials/columns";
import { TablePagination } from "@/components/pagination/pagination";

export function CorporateListDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { corporates, metadata, fetchCorporatesList } = useCorporateStore();
  const [search, setSearch] = useState("");
  const [statusVal, setStatusVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchClear, setFetchClear] = useState(false);

  const statusOpts: { value: string; label: string }[] = [
    { value: "", label: "--- ทั้งหมด ---" },
    { value: "1", label: "คงอยู่" },
    { value: "2", label: "ขาดต่อ" },
    { value: "3", label: "ยกเลิก" },
  ] as const;

  /* ── Data filters functions ────────────────────────────────────── */
  const handleClear = () => {
    setSearch("");
    setStatusVal("");
    setFetchClear(true);
  };

  /* ── Data fetch helpers ────────────────────────────────────── */
  const buildParams = (page = 1, limit = 5) => {
    const sortObj = sorting[0] || { id: "created_at", desc: false };
    return {
      search: search || "",
      status: statusVal || "",
      page,
      limit,
      sort: sortObj.id,
      order: sortObj.desc ? "DESC" : "ASC",
    } as const;
  };

  const fetchData = (pageIndex = 0, pageSize = Number(metadata?.limit) || 10) => {
    fetchCorporatesList(buildParams(pageIndex + 1, pageSize));
  };

  /* ── Effects ──────────────────────────────────────────────── */
  useEffect(() => {
    fetchData(0); // initial load
  }, []);

  useEffect(() => {
    fetchData(0);
    setFetchClear(false); // reset
  }, [fetchClear]);

  /* ── React Table instance ─────────────────────────────────── */
  const table = useReactTable({
    data: corporates || [],
    columns: corporateListColumns,
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

  return (
    <>
      <div className="p-1 md:p-5 grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center text-default-900">
        <p className="">Status</p>
        <div className="">
          <Select
            value={statusVal}
            onValueChange={(newValue: string) => {
              setStatusVal(newValue);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="--All--" />
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
        <>
          <InputGroup merged>
            <InputGroupText>{/* <Icon icon="heroicons:magnifying-glass" /> */}</InputGroupText>
            <Input
              type="text"
              placeholder="Search.."
              value={search}
              onChange={search => {
                setSearch(search.target.value);
              }}
            />
          </InputGroup>
        </>
        <div className="space-x-4">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => {
              fetchData();
            }}
          >
            <Icon icon="mingcute:search-line" width="24" height="24" />
            ค้นหา
          </Button>{" "}
          {/* 128px */}
          <Button
            variant="outline"
            className="w-32"
            onClick={() => {
              handleClear();
            }}
          >
            <Icon icon="solar:refresh-line-duotone" width="24" height="24" />
            ล้างค่า
          </Button>{" "}
        </div>
      </div>

      {/* Table */}
      <div className="p-1 md:p-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={corporateListColumns.length} className="text-center">
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

export default CorporateListDataTable;
