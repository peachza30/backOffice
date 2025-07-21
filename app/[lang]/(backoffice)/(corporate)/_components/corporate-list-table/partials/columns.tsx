import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ActionCell, LastModifiedCell } from "./cells";

export const corporateListColumns: ColumnDef<CorporateList>[] = [
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
    header: () => <div className="text-center">LAST MODIFIED</div>,
    cell: ({ row }) => <LastModifiedCell corporate={row.original} />,
  },
  {
    id: "action",
    enableHiding: false,
    header: () => <div className="text-center">ACTION</div>,
    cell: ({ row }) => <ActionCell corporate={row.original} />,
  },
];
