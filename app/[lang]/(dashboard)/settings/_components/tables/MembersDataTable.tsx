"use client";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useSettingStore } from "@/store/setting/settingStore";
import { useEffect, useState } from "react";
import EditMemberModal from "../modal/EditMemberModal";

const membersColumns: ColumnDef<Settings>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <Avatar className="rounded-full">{user?.avatar ? <AvatarImage src={user.avatar} /> : <AvatarFallback>AB</AvatarFallback>}</Avatar>
            <span className="text-sm text-card-foreground whitespace-nowrap">{user?.name ?? "Unknown User"}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase whitespace-nowrap">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="soft" color={(row.getValue("status") === "failed" && "destructive") || (row.getValue("status") === "success" && "success") || (row.getValue("status") === "processing" && "info") || "default"} className=" capitalize">
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-right">role</div>,
    cell: ({ row }) => {
      const role = row.original.role?.name || "Unknown Role";
      return <div className="text-right font-medium">{role}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      const [editModalOpen, setEditModalOpen] = useState(false);
      const [selectedMember, setSelectedMember] = useState(null);
      const { roles, loading, error, deleteMembersSetting, getRolesSetting } = useSettingStore();

      const handleEditMember = async (member: any) => {
        setSelectedMember(member);
        setEditModalOpen(true);

        try {
          const scopeId = member?.role?.scope;
          if (scopeId) {
            console.log("scopeId: ", scopeId);
            await getRolesSetting(scopeId);
          }
        } catch (err) {
          console.error("Error updating member:", err);
        }
      };

      const handleDeleteMember = async (member: any) => {
        const response = await deleteMembersSetting(member.id);
        console.log("Delete User:", member.id);
        console.log("response:", response);
      };

      return (
        <div className=" text-end">
          <EditMemberModal open={editModalOpen} onOpenChange={setEditModalOpen} member={selectedMember} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild> 
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data.id)}>Copy payment ID</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem onClick={() => handleEditUser(data)}>View</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => handleEditMember(data)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteMember(data)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function MembersDataTable() {
  const { settings, loading, error, getMembersSetting } = useSettingStore();

  useEffect(() => {
    getMembersSetting();
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: settings,
    columns: membersColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex items-center flex-wrap gap-2  px-4">
        <Input placeholder="Filter emails..." value={(table.getColumn("email")?.getFilterValue() as string) || ""} onChange={event => table.getColumn("email")?.setFilterValue(event.target.value)} className="max-w-sm min-w-[200px] h-10" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
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
                <TableCell colSpan={membersColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center flex-wrap gap-4 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2  items-center">
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 w-8">
            <Icon icon="heroicons:chevron-left" className="w-5 h-5 rtl:rotate-180" />
          </Button>

          {table.getPageOptions().map((page, pageIdx) => (
            <Button key={`basic-data-table-${pageIdx}`} onClick={() => table.setPageIndex(pageIdx)} className={cn("w-8 h-8")}>
              {page + 1}
            </Button>
          ))}
          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="icon" className="h-8 w-8">
            <Icon icon="heroicons:chevron-right" className="w-5 h-5 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </>
  );
}
