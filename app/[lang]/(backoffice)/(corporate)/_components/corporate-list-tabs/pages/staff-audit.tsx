// components/StaffAuditList.tsx
"use client";
import { Icon } from "@iconify/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./staff-audit-custom-table";

export interface StaffSummaryItem {
  icon: string;
  label: string;
  count: number;
}

const StaffAuditList: React.FC<{ items: StaffSummaryItem[] }> = ({
  items,
}) => (
  <Table className="table-auto">
    <TableBody>
      {items.map(({ icon, label, count }, idx) => (
        <TableRow key={`${label}-${idx}`} className="even:bg-blue-50/50">
          <TableCell>
            <div className="flex items-center whitespace-nowrap font-bold">
              <Icon
                icon={icon}
                width="20"
                height="20"
                className="mr-2 text-blue-600"
              />
              <span>{label}</span>
            </div>
          </TableCell>
          <TableCell className="whitespace-nowrap text-left">
            {count}
          </TableCell>
          <TableCell className="whitespace-nowrap font-bold">ราย</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default StaffAuditList;
