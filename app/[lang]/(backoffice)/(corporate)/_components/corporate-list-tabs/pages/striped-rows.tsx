// components/EmployeeList.tsx
"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

export interface PersonRow {
  idNo: string;
  titleTh: string;
  firstNameTh: string;
  lastNameTh: string;
  cpaNo: string;
  accountingNo: string;
  expireDate?: string; // ถ้ามีวันหมดอายุ
  isFullTime?: string; // "1" | "0"
  personTypeName?: string; // กรรมการ / ผู้ทำบัญชี ฯลฯ
}

const EmployeeList: React.FC<{ rows: PersonRow[] }> = ({ rows }) => (
  <Table className="w-full table-auto">
    <TableHeader>
      <TableRow>
        <TableHead className="w-14 text-center">ลำดับ</TableHead>
        <TableHead>เลขบัตรประชาชน</TableHead>
        <TableHead>ชื่อ-สกุล</TableHead>
        <TableHead>เลขทะเบียนผู้สอบบัญชี</TableHead>
        <TableHead>วันหมดอายุ</TableHead>
        <TableHead>ปฏิบัติงาน</TableHead>
        <TableHead>ประเภทสมาชิก</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {rows.map((p, idx) => (
        <TableRow key={p.idNo} className="even:bg-blue-50/50">
          <TableCell className="text-center">{idx + 1}</TableCell>
          <TableCell className="whitespace-nowrap">{p.idNo}</TableCell>
          <TableCell className="whitespace-nowrap">
            {p.titleTh}
            {p.firstNameTh} {p.lastNameTh}
          </TableCell>
          <TableCell className="whitespace-nowrap">{p.cpaNo || p.accountingNo || "-"}</TableCell>
          <TableCell className="whitespace-nowrap">{p.expireDate ?? "-"}</TableCell>
          <TableCell className="whitespace-nowrap">{p.isFullTime === "1" ? "เต็มเวลา" : "นอกเวลา"}</TableCell>
          <TableCell className="whitespace-nowrap">{p.personTypeName ?? "-"}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default EmployeeList;
