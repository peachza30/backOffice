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
  isFullTime?: string; // ปฏิบัติงาน
  personTypeName?: string; // กรรมการ / ผู้ทำบัญชี ฯลฯ
  personTypeId?: string; // กรรมการ / ผู้ทำบัญชี ฯลฯ
  isAuthorize?: string; // อำนาจลงนาม
}

const EmployeeList: React.FC<{ rows: PersonRow[] }> = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <Table className="w-full table-auto">
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              --- ไม่มีข้อมูล ---
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  // ตรวจสอบว่าแต่ละ column ควรแสดงหรือไม่
  const showFullTime = rows.some(p => p.personTypeId !== "1");
  const showAccounting = rows.some(p => p.personTypeId !== "5");
  const showAuthorize = rows.some(p => p.personTypeId === "1");

  // กำหนด columns แบบ dynamic
  const columns: {
    key: string;
    label: string;
    render: (p: PersonRow, index: number) => React.ReactNode;
  }[] = [
    {
      key: "index",
      label: "ลำดับ",
      render: (_, i) => <span className="text-center">{i + 1}</span>,
    },
    {
      key: "idNo",
      label: "เลขบัตรประชาชน",
      render: p => p.idNo,
    },
    {
      key: "fullname",
      label: "ชื่อ-สกุล",
      render: p => `${p.titleTh}${p.firstNameTh} ${p.lastNameTh}`,
    },
    {
      key: "cpaNo",
      label: "เลขทะเบียนผู้สอบบัญชี",
      render: p => p.cpaNo || "-",
    },
    {
      key: "expireDate",
      label: "วันหมดอายุ",
      render: p => p.expireDate ?? "-",
    },
    ...(showFullTime
      ? [
          {
            key: "isFullTime",
            label: "ปฏิบัติงาน",
            render: p => (p.personTypeId !== "1" ? p.isFullTime ?? "-" : "-"),
          },
        ]
      : []),
    ...(showAccounting
      ? [
          {
            key: "accountingNo",
            label: "ผู้ทำบัญชี",
            render: p => (p.personTypeId !== "5" ? p.accountingNo ?? "-" : "-"),
          },
        ]
      : []),
    ...(showAuthorize
      ? [
          {
            key: "isAuthorize",
            label: "อำนาจลงนาม",
            render: p => (p.personTypeId === "1" ? (p.isAuthorize === "1" ? "มีอำนาจลงนาม" : "-") : "-"),
          },
        ]
      : []),
    {
      key: "personTypeName",
      label: "ประเภทสมาชิก",
      render: p => p.personTypeName ?? "-",
    },
  ];

  return (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={row.idNo} className="even:bg-blue-50/50">
            {columns.map(col => (
              <TableCell key={col.key} className="whitespace-nowrap">
                {col.render(row, idx)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeList;
