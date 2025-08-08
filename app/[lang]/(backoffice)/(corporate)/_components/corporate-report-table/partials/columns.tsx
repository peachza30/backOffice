import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const corporateReportColumns: ColumnDef<CorporateReport>[] = [
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
    accessorKey: "businessTypeId", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ประเภทนิติบุคคล</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("businessTypeId")}</div>,
  },
  {
    accessorKey: "businessTypeId", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ประเภทการให้บริการ</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("businessTypeId")}</div>,
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
];
