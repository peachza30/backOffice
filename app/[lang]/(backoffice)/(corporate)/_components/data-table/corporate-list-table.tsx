"use client";
import * as React from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/pagination";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Copy, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, data } from "./data";
import BasicSelect from "../react-select/basic-select";
import MergedInputGroup from "../input2/merged-input-group";
import OutlineButton from "../button/outline-button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { useUserStore } from "@/store/users/useUserStore";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import IconButton from "../button/icon-button";
import { useRouter } from "next/navigation";
// import Select from "react-select";
import { InputGroup, InputGroupButton, InputGroupText } from "@/components/ui/input-group";
import ConfirmDialog from "../dialog/confirm-dialog";
import SuccessDialog from "../dialog/success-dialog";
import { bo } from "@fullcalendar/core/internal-common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import getPageItems from "@/lib/getPageItems";

const responsiveStyles = {
  container: provided => ({
    ...provided,
    width: "100%",
    maxWidth: "500px",
    minWidth: "200px",
  }),
  control: provided => ({
    ...provided,
    width: "100%",
  }),
};

const columns: ColumnDef<CorporateList>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
  //   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id", // Fixed: use actual property name
    header: "ID",
    cell: ({ row }) => {
      const corporateId = row.original.id;
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <p>{corporateId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "registrationNo", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">เลขทะเบียนนิติบุคคล</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("registrationNo")}</div>,
  },
  {
    accessorKey: "nameTh", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ชื่อนิติบุคคล</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("nameTh")}</div>,
  },
  {
    accessorKey: "nameEn", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ชื่อภาษาอังกฤษ</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("nameEn")}</div>,
  },
  // {
  //   accessorKey: "corporate_code", // Added corporate code column
  //   header: "corporate CODE",
  //   cell: ({ row }) => <div className="font-mono text-sm text-muted-foreground">{row.getValue("corporate_code")}</div>,
  // },
  {
    accessorKey: "status", // Fixed: use actual property name
    header: () => <div className="text-center">สถานะ</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as number;
      return (
        <div className="text-center font-medium">
          <Badge variant="soft" color={status === 1 ? "success" : status === 2 ? "destructive" : "secondary"} className="capitalize">
            {status === 1 ? "คงอยู่" : status === 2 ? "ขาดต่อ" : "ยกเลิก"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: () => <div className="text-center">แก้ไขล่าสุด</div>,
    cell: ({ row }) => {
      // const { usersById } = useUserStore(); // ✅ safe: just reads store
      // const updatedAt = row.original.updated_at ?? row.original.created_at;
      // const updatedBy = row.original.updated_by ?? row.original.created_by;

      // const user = updatedBy ? usersById[updatedBy] : null;
      // const userName = user ? `${user.first_name}.${user.last_name?.slice(0, 2)}` : "None Editor";

      return (
        <div className="text-center font-medium">
          <div className="text-xs text-muted-foreground">{row.original.updateUser}</div>
          <div className="text-sm">
            {new Intl.DateTimeFormat("th-TH", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }).format(new Date(row.original.updateDate))}
          </div>
        </div>
      );
    },
  },
  {
    id: "action",
    enableHiding: false,
    header: () => <div className="text-center">จัดการ</div>,
    cell: ({ row }) => {
      const corporate = row.original;
      const { setMode, deleteCorporate } = useCorporateStore();
      // const [openModal, setOpenModal] = useState(false);
      // const [openSuccessModal, setOpenSuccessModal] = useState(false);
      // let confirmDialogConfig = {};
      // let successDialogConfig = {};
      // confirmDialogConfig = {
      //   title: "Confirm Delete Corporate?",
      //   icon: "stash:question",
      //   class: "destructive",
      //   color: "#EF4444",
      //   body: "Do you want to delete this corporate?",
      //   sub: "Deleting this item is irreversible. Are you sure you want to continue?",
      //   confirmButton: "Yes, Delete",
      //   cancelButton: "Cancel",
      // };
      // successDialogConfig = {
      //   icon: "solar:verified-check-outline",
      //   body: "Delete Corporate successfully.",
      //   color: "#22C55E",
      // };

      const router = useRouter();
      // const handleDelete = () => {
      //   setOpenModal(true);
      // };
      // const handleConfirm = () => {
      //   setOpenSuccessModal(true);
      //   setOpenModal(false);
      //   deleteCorporate(corporate.id, {
      //     search: "",
      //     status: "",
      //     page: 1,
      //     limit: 10,
      //     sort: "created_at",
      //     order: "DESC",
      //   });
      // };

      return (
        <div className="flex items-center justify-end gap-1">
          {/* {openModal && <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={confirmDialogConfig} />} */}
          {/* {openSuccessModal && <SuccessDialog open={openSuccessModal} onOpenChange={setOpenSuccessModal} dialogConfig={successDialogConfig} />} */}
          {/* Copy corporate Code */}
          {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigator.clipboard.writeText(corporate.corporate_code)} title="Copy corporate code">
            <Copy className="h-4 w-4" />
          </Button> */}
          {/* View Details */}
          <Button
            size="icon"
            onClick={() => {
              setMode("view");
              router.push(`/corporate-list/${corporate.id}`);
            }}
            color="info"
            variant="soft"
          >
            <Icon icon="fluent:eye-24-filled" width="24" height="24" />
          </Button>
          {/* Edit corporate */}
          {/* <p className="p-1 text-gray-300">|</p>
          <Button
            size="icon"
            onClick={() => {
              setMode("edit");
              router.push(`/manage-corporate/${corporate.id}`);
            }}
            color="warning"
            variant="soft"
          >
            <Icon icon="hugeicons:pencil-edit-01" width="24" height="24" />
          </Button> */}

          {/* Delete corporate */}
          {/* <p className="p-1 text-gray-300">|</p>
          <Card title="Icon Buttons">
            <div className="flex flex-wrap gap-3 lg:gap-5">
              <Button
                size="icon"
                onClick={() => {
                  handleDelete();
                  setOpenModal(true);
                }}
                color="destructive"
                variant="soft"
              >
                <Icon icon="hugeicons:delete-02" width="24" height="24" />
              </Button>
            </div>
          </Card> */}
        </div>
      );
    },
  },
];

export function CorporateListDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { corporates, metadata, fetchCorporates } = useCorporateStore();
  const { fetchUser } = useUserStore();
  const [search, setSearch] = useState("");
  const [statusVal, setStatusVal] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchClear, setFetchClear] = useState(false);

  const status: { value: string; label: string }[] = [
    { value: "", label: "--- All ---" },
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];

  const currentStatusValue = status.find(opt => opt.value === statusVal)?.value || "";

  useEffect(() => {
    if (fetchClear && search === "" && statusVal === "") {
      fetchData();
      setFetchClear(false); // reset
    }
  }, [search, statusVal, fetchClear]);

  useEffect(() => {
    fetchCorporates({
      search: globalFilter || "",
      status: statusVal,
      page: 1,
      limit: pageSize,
      sort: "created_at",
      order: "ASC",
    });
  }, []);

  // useEffect(() => {
  // const userIds = Array.from(new Set(corporates.flatMap(row => [row.updated_by, row.created_by]).filter(Boolean)));
  // userIds.forEach(id => fetchUser(id as number));
  // }, [corporates]);

  const table = useReactTable({
    data: corporates || [],
    columns,
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
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const fetchData = async (pageIndex?: number) => {
    setLoading(true);
    const sortObj = sorting[0] || {}; // assumes single-column sort
    const currentPage = pageIndex !== undefined ? pageIndex : metadata ? Number(metadata.page) - 1 : 0;
    const currentPageSize = metadata ? Number(metadata.limit) : 5;

    try {
      await fetchCorporates({
        search: search || "",
        status: statusVal || "",
        page: currentPage + 1, // Convert 0-based to 1-based for API
        limit: currentPageSize,
        sort: sortObj?.id || "created_at",
        order: sortObj?.desc ? "DESC" : "ASC",
      });
      // Update metadata from API response
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (newPageIndex: number) => {
    fetchData(newPageIndex);
  };
  const handlePageSizeChange = (newPageSize: number) => {
    fetchData(0);
  };

  const PaginationComponent = () => {
    const currentPage = metadata ? Number(metadata.page) - 1 : 0; // Convert to 0-based
    const totalPages = metadata?.last_page || 1;
    const total = metadata?.total || 0;
    const limit = metadata?.limit || "5";
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < totalPages - 1;

    const pageSizeOptions = [
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "20", label: "20" },
      { value: "50", label: "50" },
    ];
    const currentPageSizeValue = pageSizeOptions.find(opt => opt.value === limit)?.value || pageSizeOptions[0].value;
    return (
      <div className="flex items-center justify-between flex-wrap gap-4 px-4 py-4">
        {/* Row selection info */}
        {/* <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of {total} row(s) selected.
        </div> */}

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Rows per page</p>
          <Select
            value={currentPageSizeValue}
            onValueChange={(newValue: any) => {
              fetchCorporates({
                search: search || "",
                status: statusVal || "",
                page: 1,
                limit: newValue,
                sort: "created_at",
                order: "ASC",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Info */}
        {/* <div className="text-sm text-muted-foreground">
          Page {metadata?.page || 1} of {totalPages} ({total} total items)
        </div> */}

        {/* Pagination */}
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap ">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (canPreviousPage) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={!canPreviousPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {getPageItems(currentPage, totalPages).map(item =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${Math.random()}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${item}`}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === item}
                      onClick={e => {
                        e.preventDefault();
                        handlePageChange(item);
                      }}
                    >
                      {item + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (canNextPage) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={!canNextPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  // 8. Update your useEffect to handle initial load
  useEffect(() => {
    fetchData(0); // Load first page on component mount
  }, []);

  const handleClear = () => {
    setSearch("");
    setStatusVal("");
    setFetchClear(true);
  };

  return (
    <>
      {/* <div className="flex items-center flex-wrap gap-2  px-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) || ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm min-w-[200px] h-10"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      <div className="p-1 md:p-5 grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center text-default-900">
        <p className="">Status</p>
        <div className="">
          <Select
            value={currentStatusValue}
            onValueChange={(newValue: string) => {
              setStatusVal(newValue);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="--All--" />
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
            Search
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
            Clear
          </Button>{" "}
        </div>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  --NO DATA--
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationComponent />
    </>
  );
}

export default CorporateListDataTable;
