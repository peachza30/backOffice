"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useQueueStore } from "@/store/queue/useQueueStore";
import { Checkbox } from "@radix-ui/react-checkbox";
import ReportsChart from "../queue-report/reports-chart";
import { useTheme } from "next-themes";
import { useThemeStore } from "@/store";

import { themes } from "@/config/thems";
import { cn } from "@/lib/utils";

/* ── helper สำหรับ badge สี ───────────────────────────────────────── */
const statusToColor = (s: MemberStatus) => (s === "success" ? "success" : s === "failed" ? "destructive" : s === "pending" ? "warning" : "secondary");

/* ------------------------------------------------------------------ */
export default function MemberEventDataTable() {
  /* 1. Local UI state ------------------------------------------------ */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [search, setSearch] = useState(""); // คำค้น
  const [statusVal, setStatusVal] = useState(""); // สถานะคำขอ
  const [requestTypeVal, setRequestTypeVal] = useState(""); // ประเภทคำขอ
  const [startDate, setStartDate] = useState(""); // วันที่เริ่มต้น (yyyy-mm-dd)
  const [endDate, setEndDate] = useState(""); // วันที่สิ้นสุด
  const [fetchClear, setFetchClear] = useState(false);

  const status: { value: string; label: string }[] = [
    { value: "", label: "--- All ---" },
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];

  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find(theme => theme.name === config);

  const primary = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`;
  const warning = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`;
  const success = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`;
  const info = `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`;

  const allUsersSeries = [
    {
      data: [90, 70, 85, 60, 80, 70, 90, 75, 60, 80],
    },
  ];
  const conversationSeries = [
    {
      data: [80, 70, 65, 40, 40, 100, 100, 75, 60, 80],
    },
  ];
  const eventCountSeries = [
    {
      data: [20, 70, 65, 60, 40, 60, 90, 75, 60, 40],
    },
  ];
  const newUserSeries = [
    {
      data: [20, 70, 65, 40, 100, 60, 100, 75, 60, 80],
    },
  ];
  const tabsTrigger = [
    {
      value: "all",
      text: "all user",
      total: "10,234",
      color: "primary",
    },
    {
      value: "event",
      text: "Event Count",
      total: "536",
      color: "warning",
    },
    {
      value: "conversation",
      text: "conversations",
      total: "21",
      color: "success",
    },
    {
      value: "newuser",
      text: "New User",
      total: "3321",
      color: "info",
    },
  ];
  const tabsContentData = [
    {
      value: "all",
      series: allUsersSeries,
      color: primary,
    },
    {
      value: "event",
      series: eventCountSeries,
      color: warning,
    },
    {
      value: "conversation",
      series: conversationSeries,
      color: success,
    },
    {
      value: "newuser",
      series: newUserSeries,
      color: info,
    },
  ];

  /* 2. Zustand store -------------------------------------------------- */
  const { members, connect, resend } = useQueueStore();
  // console.log("members", members);
  /* 3. Connect socket once on mount ---------------------------------- */
  useEffect(() => {
    connect({ page: 1, perPage: 20 });
  }, [connect]);

  const fetchData = async () => {
    // setLoading(true);
    // const sortObj = sorting[0] || {}; // assumes single-column sort
    // const currentPage = pageIndex !== undefined ? pageIndex : metadata ? Number(metadata.page) - 1 : 0;
    // const currentPageSize = metadata ? Number(metadata.limit) : 5;

    try {
      // await fetchCorporateRequests({
      //   search: search || "",
      //   status: statusVal || "",
      //   page: currentPage + 1, // Convert 0-based to 1-based for API
      //   limit: currentPageSize,
      //   sort: sortObj?.id || "created_at",
      //   order: sortObj?.desc ? "DESC" : "ASC",
      // });
      // Update metadata from API response
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      // setLoading(false);
    }
  };
  const handleClear = () => {
    setSearch("");
    setStatusVal("");
    setFetchClear(true);
  };
  /* 4. สร้าง columns (useMemo เพื่อไม่สร้างใหม่ทุก render) ---------- */
  const columns = useMemo<ColumnDef<MemberEventData>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "row-index",
        header: "NO.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "id",
        header: "EVENT ID",
        cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
      },
      { accessorKey: "event_type", header: "EVENT TYPE" },
      {
        accessorKey: "error_message",
        header: "ERROR MESSAGE",
        cell: ({ row }) => <span className="max-w-[300px] truncate block">{row.getValue("error_message")}</span>,
      },
      {
        accessorKey: "created_at",
        header: "CREATED AT",
        cell: ({ row }) => new Date(row.getValue<string>("created_at")).toLocaleString("th-TH"),
      },
      {
        accessorKey: "received_at",
        header: "RECEIVED AT",
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const status = row.getValue<MemberStatus>("status");
          return (
            <Badge variant="soft" color={statusToColor(status)} className="capitalize">
              {status}
            </Badge>
          );
        },
      },
      {
        id: "action",
        header: "ACTION",
        enableSorting: false,
        cell: ({ row }) => {
          const log = row.original;
          return (
            <div className="flex items-center gap-2">
              {/* View detail */}
              <Button size="icon" variant="soft" color="info">
                <Icon icon="fluent:eye-24-filled" width={20} height={20} />
              </Button>

              {/* Resend – show only when failed */}
              {log.status === "failed" && (
                <Button size="icon" variant="soft" color="warning" onClick={() => resend(log.payload)}>
                  <Icon icon="solar:refresh-line-duotone" width={20} height={20} />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [resend] // dependency
  );

  /* 5. React-Table instance ------------------------------------------ */
  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Tell React Table we're handling pagination
    // pageCount: metadata?.last_page,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      // pagination: {
      //   pageIndex: Number(metadata?.page) - 1,
      //   pageSize: Number(metadata?.limit),
      // },
    },
  });

  /* 6. UI ------------------------------------------------------------- */
  return (
    <>
      {/* ── Filter row -------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 text-sm text-default-900">
        {/* ประเภทคำขอ */}
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold whitespace-nowrap">EVENT TYPE</label>
          <div className="w-full">
            <Select value={requestTypeVal} onValueChange={setRequestTypeVal}>
              <SelectTrigger>
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                {status.map(opt => (
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
          <label className="w-20 font-semibold whitespace-nowrap text-right">STATUS</label>
          <div className="w-full">
            <Select value={statusVal} onValueChange={setStatusVal}>
              <SelectTrigger>
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                {status.map(opt => (
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
          <label className="w-32 font-semibold whitespace-nowrap">DATE</label>
          <div className="flex gap-2 w-full">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full" />
            <span className="text-sm flex items-center justify-center font-semibold">ถึง</span>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full" />
          </div>
        </div>

        {/* คำค้น */}
        <div className="flex items-center gap-4">
          <label className="w-20 font-semibold whitespace-nowrap text-right">KEYWORD</label>
          <div className="w-full">
            <Input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="เลขที่คำขอ/เลขทะเบียนนิติบุคคล/ชื่อนิติบุคคล" className="w-full" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pr-5 pt-1 text-default-900">
        <Button variant="outline" className="w-28" onClick={fetchData}>
          <Icon icon="mingcute:search-line" width="24" height="24" />
          ค้นหา
        </Button>
        <Button variant="outline" className="w-28" onClick={handleClear}>
          <Icon icon="solar:refresh-line-duotone" width="24" height="24" />
          ล้างค่า
        </Button>
      </div>
      {/* ── Chart Report -------------------------------------------------- */}
      <div className="mx-32 my-10">
        <div className="border-none pb-0">
          <div className="flex items-center gap-2 flex-wrap ">
            <div className="flex-1">
              {/* <div className="text-xl font-semibold text-default-900 whitespace-nowrap">Reports Snapshot</div>
              <span className="text-xs text-default-600">Demographic properties of your customer</span> */}
            </div>
          </div>
        </div>
        <div className="p-1 md:p-5">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 justify-start w-full bg-transparent h-full">
              {tabsTrigger.map((item, index) => (
                <TabsTrigger
                  key={`report-trigger-${index}`}
                  value={item.value}
                  className={cn("flex flex-col gap-1.5 p-4 overflow-hidden   items-start  relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-primary/50 dark:before:bg-primary-foreground before:hidden data-[state=active]:shadow-none data-[state=active]:before:block", {
                    "bg-primary/30 data-[state=active]:bg-primary/30 dark:bg-primary/70": item.color === "primary",
                    "bg-orange-50 data-[state=active]:bg-orange-50 dark:bg-orange-500": item.color === "warning",
                    "bg-green-50 data-[state=active]:bg-green-50 dark:bg-green-500": item.color === "success",
                    "bg-cyan-50 data-[state=active]:bg-cyan-50 dark:bg-cyan-500 ": item.color === "info",
                  })}
                >
                  <span
                    className={cn("h-10 w-10 rounded-full bg-primary/40 absolute -top-3 -right-3 ring-8 ring-primary/30", {
                      "bg-primary/50  ring-primary/20 dark:bg-primary dark:ring-primary/40": item.color === "primary",
                      "bg-orange-200 ring-orange-100 dark:bg-orange-300 dark:ring-orange-400": item.color === "warning",
                      "bg-green-200 ring-green-100 dark:bg-green-300 dark:ring-green-400": item.color === "success",
                      "bg-cyan-200 ring-cyan-100 dark:bg-cyan-300 dark:ring-cyan-400": item.color === "info",
                    })}
                  ></span>
                  <span className="text-sm text-default-800 dark:text-primary-foreground font-semibold capitalize relative z-10"> {item.text}</span>
                  <span className={`text-lg font-semibold text-${item.color}/80 dark:text-primary-foreground`}>{item.total}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {/* charts data */}
            {tabsContentData.map((item, index) => (
              <TabsContent key={`report-tab-${index}`} value={item.value}>
                <ReportsChart series={item.series} chartColor={item.color} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      {/* ── Data table -------------------------------------------------- */}
      <div className="p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  -- NO DATA --
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
