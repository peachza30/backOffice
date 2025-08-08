import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ActionCell, LastModifiedCell } from "./cells";

export const corporateRequestColumns: ColumnDef<CorporateRequest>[] = [
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
    accessorKey: "no", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">เลขที่คำขอ</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("no")}</div>,
  },
  {
    accessorKey: "requestFormDescription", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">ประเภทคำขอ</span>
        </div>
      );
    },
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("requestFormDescription")}</div>,
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
    accessorKey: "createDate", // Fixed: use actual property name
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">วันที่ยื่นคำขอ</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createDate"));
      const year = date.getFullYear() + 543;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return <div className="whitespace-nowrap font-medium">{`${day}/${month}/${year}`}</div>;
    },
  },
  {
    accessorKey: "requestStatus", // Fixed: use actual property name
    header: () => <div className="text-center">สถานะ</div>,
    cell: ({ row }) => {
      const status = row.getValue("requestStatus") as number;
      const statusMap: Record<number, { label: string; color: "default" | "warning" | "destructive" | "secondary" | "info" | "success" }> = {
        1: { label: "รอการตรวจสอบ", color: "warning" },
        2: { label: "รอการชำระเงิน", color: "default" },
        3: { label: "ตรวจสอบไม่ผ่าน", color: "destructive" },
        4: { label: "ยกเลิก", color: "secondary" },
        5: { label: "ชำระเงินแล้ว", color: "info" },
        6: { label: "อนุมัติ", color: "success" },
      };
      const { label, color } = statusMap[status] || { label: "ไม่ทราบสถานะ", color: "default" };

      return (
        <div className="text-center font-medium">
          <Badge variant="soft" color={color} className="capitalize">
            {label}
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