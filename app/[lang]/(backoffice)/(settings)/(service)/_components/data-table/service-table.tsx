"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useServiceStore } from "@/store/service/useServiceStore";
import { serviceColumns } from "./columns";
import { ServicePagination } from "./pagination";

export function ServiceDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState("");
  const [statusVal, setStatusVal] = useState("");

  const { services, metadata, fetchService } = useServiceStore();

  const statusOpts = [
    { value: "", label: "--- All ---" },
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ] as const;

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

  const fetchData = (pageIndex = 0, pageSize = Number(metadata?.limit) || 5) => {
    fetchService(buildParams(pageIndex + 1, pageSize));
  };

  /* ── Effects ──────────────────────────────────────────────── */
  useEffect(() => {
    fetchData(0); // initial load
  }, []);

  useEffect(() => {
    if (search === "" && statusVal === "") fetchData(0);
  }, [search, statusVal]);

  /* ── React Table instance ─────────────────────────────────── */
  const table = useReactTable({
    data: services,
    columns: serviceColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: metadata?.last_page,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Number(metadata?.page) - 1 || 0,
        pageSize: Number(metadata?.limit) || 5,
      },
    },
  });

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <>
      {/* Filters */}
      <div className="p-1 md:p-5 grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center text-default-900">
        <p>Status</p>
        <Select value={statusVal} onValueChange={v => setStatusVal(v)}>
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
        <InputGroup merged>
          <InputGroupText>
            <Icon icon="heroicons:magnifying-glass" />
          </InputGroupText>
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </InputGroup>
        <div className="space-x-4">
          <Button variant="outline" className="w-32" onClick={() => fetchData(0)}>
            <Icon icon="mingcute:search-line" /> Search
          </Button>
          <Button
            variant="outline"
            className="w-32"
            onClick={() => {
              setSearch("");
              setStatusVal("");
            }}
          >
            <Icon icon="solar:refresh-line-duotone" /> Clear
          </Button>
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
                <TableCell colSpan={serviceColumns.length} className="text-center">
                  --NO DATA--
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <ServicePagination metadata={metadata} onPageChange={index => fetchData(index)} onPageSizeChange={size => fetchData(0, size)} />
    </>
  );
}

export default ServiceDataTable;
