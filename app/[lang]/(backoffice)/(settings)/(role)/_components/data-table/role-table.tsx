"use client";
import * as React from "react";
import { useState, useEffect, useMemo, useCallback, memo } from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/[lang]/(backoffice)/(settings)/(service)/_components/ui/pagination";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Copy, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { usePartnerStore } from "@/store/partner/usePartnerStore";
import { useUserStore } from "@/store/users/useUserStore";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupButton, InputGroupText } from "@/components/ui/input-group";
import ConfirmDialog from "../dialog/confirm-dialog";
import SuccessDialog from "../dialog/success-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoleStore } from "@/store/role/useRoleStore";

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

const columns: ColumnDef<RoleScope>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
  //   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id", // Fixed: use actual property name
    header: "ROLE ID",
    cell: ({ row }) => {
      const roleId = row.original.id;
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <p>{roleId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role_name", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ROLE NAME</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("role_name")}</div>,
  },
  {
    accessorKey: "description", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ROLE DESCRIPTION</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium text-center">{row.getValue("description") || "-"}</div>,
  },
  {
    accessorKey: "scope_id",
    header: () => <div className="text-sm font-medium">SCOPE</div>,
    cell: ({ row }) => {
      const { roleScopes } = useRoleStore();
      const scopeId = row.original.scope_id;
      const scopeName = roleScopes[scopeId] || "Loading...";
      return <div className="text-center font-medium">{scopeName}</div>;
    },
  },
  {
    accessorKey: "status", // Fixed: use actual property name
    header: () => <div className="text-center">STATUS</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-center font-medium">
          <Badge variant="soft" color={status === "A" ? "success" : "destructive"} className="capitalize">
            {status === "A" ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: () => <div className="text-center">LAST MODIFIED</div>,
    cell: ({ row }) => {
      const { usersById } = useUserStore(); // ✅ safe: just reads store
      const updatedAt = row.original.updated_at ?? row.original.created_at;
      const updatedBy = row.original.updated_by ?? row.original.created_by;

      const user = updatedBy ? usersById[updatedBy] : null;
      const userName = user ? `${user.first_name}.${user.last_name?.slice(0, 2)}` : "None Editor";

      return (
        <div className="text-center font-medium">
          <div className="text-xs text-muted-foreground">{userName}</div>
          <div className="text-sm">
            {new Intl.DateTimeFormat("th-TH", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }).format(new Date(updatedAt))}
          </div>
        </div>
      );
    },
  },
  {
    id: "action",
    enableHiding: false,
    header: () => <div className="text-center">ACTION</div>,
    cell: ({ row }) => {
      const role = row.original;
      const { setMode, deleteRole } = useRoleStore();
      const [openModal, setOpenModal] = useState(false);
      const [openSuccessModal, setOpenSuccessModal] = useState(false);
      let confirmDialogConfig = {};
      let successDialogConfig = {};
      confirmDialogConfig = {
        title: "Confirm Delete Role?",
        icon: "stash:question",
        class: "destructive",
        color: "#EF4444",
        body: "Do you want to delete this role?",
        sub: "Deleting this item is irreversible. Are you sure you want to continue?",
        confirmButton: "Yes, Delete",
        cancelButton: "Cancel",
      };

      successDialogConfig = {
        icon: "solar:verified-check-outline",
        body: "Delete service successfully.",
        color: "#22C55E",
      };

      const router = useRouter();
      const handleDelete = () => {
        setOpenModal(true);
      };
      const handleConfirm = () => {
        setOpenSuccessModal(true);
        setOpenModal(false);  
        deleteRole(role.id, {});
      };

      return (
        <div className="flex items-center justify-end gap-1">
          {openModal && <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={confirmDialogConfig} />}
          {openSuccessModal && <SuccessDialog open={openSuccessModal} onOpenChange={setOpenSuccessModal} dialogConfig={successDialogConfig} />}
          {/* Copy Service Code */}
          {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigator.clipboard.writeText(service.service_code)} title="Copy service code">
            <Copy className="h-4 w-4" />
          </Button> */}
          {/* View Details */}
          <Button
            size="icon"
            onClick={() => {
              setMode("view");
              router.push(`/manage-role/${role.id}`);
            }}
            color="info"
            variant="soft"
          >
            <Icon icon="fluent:eye-24-filled" width="24" height="24" />
          </Button>
          {/* Edit Service */}
          <p className="p-1 text-gray-300">|</p>
          <Button
            size="icon"
            onClick={() => {
              setMode("edit");
              router.push(`/manage-role/${role.id}`);
            }}
            color="warning"
            variant="soft"
          >
            <Icon icon="hugeicons:pencil-edit-01" width="24" height="24" />
          </Button>

          {/* Delete Service */}
          <p className="p-1 text-gray-300">|</p>
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
          </Card>
        </div>
      );
    },
  },
];

export function RoleDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { roleScopes, roles, metadata, fetchRoles, fetchRolesScope } = useRoleStore();
  const { fetchUser } = useUserStore(); // ✅ safe: just reads store

  const [search, setSearch] = useState("");
  const [statusVal, setStatusVal] = useState("");
  const [pageSize, setPageSize] = useState(10);
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
    fetchRoles({
      search: globalFilter || "",
      status: statusVal,
      page: 1,
      limit: pageSize,
      sort: "created_at",
      order: "ASC",
    });
  }, []);

  useEffect(() => {
    if (roles) {
      const scopeIds = Array.from(new Set(roles.map(item => item.scope_id)));
      scopeIds.forEach(id => fetchRolesScope(id));
    }
  }, [roles]);

  useEffect(() => {
    const userIds = Array.from(new Set(roles.flatMap(row => [row.updated_by, row.created_by]).filter(Boolean)));

    userIds.forEach(id => fetchUser(id as number));
  }, [roles]);

  const table = useReactTable({
    data: roles || [],
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
      await fetchRoles({
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
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
          <Select
            value={currentPageSizeValue}
            onValueChange={(newValue: any) => {
              fetchRoles({
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
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={`page-${i}`}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i}
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(i);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

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
        <Table>
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

export default RoleDataTable;
