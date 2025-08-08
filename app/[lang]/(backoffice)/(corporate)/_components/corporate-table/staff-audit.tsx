"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./staff-audit-custom-table";
import { Icon } from "@iconify/react";
const StaffAuditList = () => {
  return (
    <Table className="table-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="w-auto"></TableHead>
          <TableHead className="w-auto"></TableHead>
          <TableHead className="w-screen"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { icon: "mingcute:group-3-line", label: "หุ้นส่วน", count: 12 },
          { icon: "mingcute:group-3-line", label: "ผู้จัดการ", count: 1 },
          { icon: "mingcute:group-3-line", label: "ผู้จัดการอาวุโส", count: 1 },
          { icon: "mingcute:group-3-line", label: "ผู้เชี่ยวชาญด้านบัญชี", count: 10 },
        ].map((item, idx) => (
          <TableRow key={idx} className="even:bg-blue-50/50">
            <TableCell>
              <div className="flex items-center whitespace-nowrap">
                <Icon icon={item.icon} width="20" height="20" className="mr-2 text-blue-600" />
                <span>{item.label}</span>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap">{item.count}</TableCell>
            <TableCell className="whitespace-nowrap">ราย</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    // <Table>
    //   <TableHeader>
    //     <TableRow>
    //       {
    //         columns.map((column:ColumnProps) => (
    //           <TableHead key={column.key}>
    //             {column.label}
    //           </TableHead>
    //         ))
    //       }
    //     </TableRow>
    //   </TableHeader>
    //   <TableBody>
    //     {users.slice(0, 5).map((item:UserProps) => (
    //       <TableRow key={item.id} className="even:bg-default-100">
    //         <TableCell>{item.id}</TableCell>
    //         <TableCell>{item.name}</TableCell>
    //         <TableCell>{item.email}</TableCell>
    //         <TableCell>{item.age}</TableCell>
    //         <TableCell>{item.point}</TableCell>
    //       </TableRow>
    //     ))}
    //   </TableBody>
    // </Table>
  );
};

export default StaffAuditList;
