"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

import { Icon } from "@iconify/react";
import { Button } from "../../ui/button";
const TransactionHistory = () => {
  const columns = [
    { key: 1, label: "ลำดับ" },
    { key: 2, label: "ประเภทคำขอ" },
    { key: 3, label: "เลขที่คำขอ" },
    { key: 4, label: "เลขทะเบียนนิติบุคคล" },
    { key: 5, label: "บริษัท" },
    { key: 6, label: "วันที่ยื่นคำขอ" },
    { key: 7, label: "วันที่ออกใบเสร็จ" },
  ];
  const data = [
    {
      id: 1,
      type: "ยกเลิกการนิติบุคคล",
      count: "R-MC-68-000251",
      date: "0105532042691",
      regis: "บริษัท เอสบีจี จำกัด",
      companyName: "10/01/2568",
      status: "-",
    },
    {
      id: 2,
      type: "แก้ไขข้อมูลนิติบุคคล",
      count: "N-MC-67-01281",
      date: "0123456789123",
      regis: "ห้างหุ้นส่วนจำกัด สภาวิชาชีพบัญชี",
      companyName: "9/12/2568",
      status: "10/12/2567",
    },
    {
      id: 3,
      type: "แจ้งแก้ไขหลักประกัน",
      count: "GD-MC-67-000198",
      date: "0105532042691",
      regis: "บริษัท เอสบีจี จำกัด",
      companyName: "11/11/2568",
      status: "12/11/2567",
    },
  ];
  return (
    <Table className="w-full table-auto">
      <TableHeader className="bg-blue-50/50">
        <TableRow className="even:bg-blue-50/50">
          {columns.map((column: any) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.slice(0, 5).map((item: any) => (
          <TableRow key={item.id} className="even:bg-default-100">
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.regis}</TableCell>
            <TableCell>{item.companyName}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionHistory;
