"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

const CellSkeleton = ({ w = "w-full" }: { w?: string }) => <div className={`h-4 rounded bg-gray-200 animate-pulse ${w}`} />;
/** ----------------------------------------------------------------
 * 2) กำหนดคอลัมน์แต่ละประเภทแบบ declarative */
type ColumnGetter = (row: CorporateGuarantee, i: number) => React.ReactNode;

interface ColumnConfig {
  header: string;
  value: ColumnGetter;
}

const columnMap: Record<CorporateGuarantee["guaranteeTypeId"], ColumnConfig[]> = {
  /* 1) บัญชีเงินฝากประจำ */
  "1": [
    { header: "ลำดับ", value: (_, i) => i + 1 },
    { header: "ธนาคาร", value: r => r.bankName ?? "-" },
    { header: "สาขา", value: r => r.bankBranch ?? "-" },
    { header: "เลขที่บัญชี", value: r => r.bankAccountId ?? "-" },
    { header: "ชื่อบัญชี", value: r => r.bankAccountName ?? "-" },
    { header: "ฝากประจำ (ปี)", value: r => r.yearNumber ?? "-" },
    { header: "จำนวนเงิน (บาท)", value: r => formatBaht(r.amount) },
  ],

  /* 2) บัตรเงินฝาก */
  "2": [
    { header: "ลำดับ", value: (_, i) => i + 1 },
    { header: "ธนาคาร", value: r => r.bankName ?? "-" },
    { header: "สาขา", value: r => r.bankBranch ?? "-" },
    { header: "เลขที่บัญชี", value: r => r.bankAccountId ?? "-" },
    { header: "ชื่อบัญชี", value: r => r.bankAccountName ?? "-" },
    { header: "จำนวนเงิน (บาท)", value: r => formatBaht(r.amount) },
  ],

  /* 3) พันธบัตรรัฐบาลไทย */
  "3": [
    { header: "ลำดับ", value: (_, i) => i + 1 },
    { header: "เลขที่", value: r => r.bondNo ?? "-" },
    { header: "วันที่", value: r => formatDate(r.bondDate) },
    { header: "วันที่ครบกำหนด", value: r => formatDate(r.bondDueDate) },
    { header: "จำนวนเงิน (บาท)", value: r => formatBaht(r.amount) },
  ],

  /* 4) พันธบัตรองค์กรหรือรัฐวิสาหกิจ */
  "4": [
    { header: "ลำดับ", value: (_, i) => i + 1 },
    { header: "ออกโดย", value: r => r.description ?? "-" },
    { header: "เลขที่", value: r => r.bondNo ?? "-" },
    { header: "วันที่", value: r => formatDate(r.bondDate) },
    { header: "วันที่ครบกำหนด", value: r => formatDate(r.bondDueDate) },
    { header: "จำนวนเงิน (บาท)", value: r => formatBaht(r.amount) },
  ],

  /* 5) กรมธรรม์ประกันภัย */
  "5": [
    { header: "ลำดับ", value: (_, i) => i + 1 },
    { header: "บริษัท", value: r => r.description ?? "-" },
    { header: "เลขที่", value: r => r.bondNo ?? "-" },
    { header: "จำนวนเงิน (บาท)", value: r => formatBaht(r.amount) },
  ],
};

/** ----------------------------------------------------------------
 * 3) ตัวช่วย format */
function formatBaht(v: string | undefined) {
  const n = Number(v ?? 0);
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2 });
}
function formatDate(v: string | undefined) {
  if (!v) return "-";
  return new Date(v).toLocaleDateString("th-TH");
}

/** ----------------------------------------------------------------
 * 4) คอมโพเนนต์หลัก */
const GuaranteeTable = ({ type, guarantees = [] }: { type?: CorporateGuarantee["guaranteeTypeId"]; guarantees: CorporateGuarantee[] }) => {
  const columns = columnMap[type as keyof typeof columnMap];

  /* --------- 1) If columns aren’t ready → show skeleton ---------- */
  if (!columns) {
    const skeletonCols = Array.from({ length: 5 }); // 5 fake columns
    const skeletonRows = Array.from({ length: 4 }); // 4 fake rows

    return (
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            {skeletonCols.map((_, i) => (
              <TableHead key={i}>
                <CellSkeleton w="w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, r) => (
            <TableRow key={r}>
              {skeletonCols.map((_, c) => (
                <TableCell key={c}>
                  <CellSkeleton />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  /* --------- 2) If we have columns but no data yet --------------- */
  if (!guarantees?.length) {
    return (
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="py-8 text-center">
              <CellSkeleton w="w-40" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table className="w-full table-auto">
      {/* หัวตาราง ----------------------------------------------------- */}
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={col.header}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {/* รายการ ------------------------------------------------------- */}
      <TableBody>
        {guarantees.map((row, i) => (
          <TableRow key={i} className={i % 2 === 1 ? "even:bg-blue-50/50" : undefined}>
            {columns.map(col => (
              <TableCell key={col.header}>{col.value(row, i)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GuaranteeTable;
