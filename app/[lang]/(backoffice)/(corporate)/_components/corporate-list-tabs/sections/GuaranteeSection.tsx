// File: sections/GuaranteeSection.tsx
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";
import GuaranteesDetails from "../pages/guarantees-details";
import GuaranteeTable from "../pages/deposit-account";

export default function GuaranteeSection({ corporate }: { corporate: any }) {
  const [guaranteeType, setGuaranteeType] = useState("");
  const CorporateGuarantee = corporate;
  console.log("CorporateGuarantee", CorporateGuarantee);

  useEffect(() => {
    if (corporate?.guarantee && corporate?.guarantee.length > 0) setGuaranteeType(corporate.guarantee[0].guaranteeTypeId || "");
  }, [corporate?.guarantee]);

  return (
    <>
      <Card className="mb-4 border-2 border-blue-100/75">
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="font-bold">รายละเอียดการจัดให้มีหลักประกัน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
            <label className="block text-sm font-bold text-gray-700 pt-2 md:w-36 w-full md:flex-none break-words" style={{ width: "auto", minWidth: "140px" }}>
              รายได้รวมสำหรับค่าบริการที่ต้องจัดให้มีหลักประกัน สิ้นรอบปีบัญชี ณ วันที่ :
            </label>
            <p className="text-sm text-gray-900 p-2 rounded flex-1 break-words">{corporate.fiscalYearEndDate ? toBuddhistDate(corporate.fiscalYearEndDate) : "-"}</p>
          </div>

          <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
            {[
              { label: "เงินทุนจดทะเบียน : ", value: formatCurrency(corporate.capital) || "-" },
              { label: "รายได้รอบปีบัญชี : ", value: formatCurrency(corporate.totalRevenue) || "-" },
            ].map(({ label, value }) => (
              <div className="flex items-start gap-4" key={label}>
                <label className="block text-sm font-bold text-gray-700" style={{ width: "140px", minWidth: "140px" }}>
                  {label}
                </label>
                <span className="text-sm text-gray-900 rounded flex-1">
                  {value} <b className="pl-5">บาท</b>
                </span>
              </div>
            ))}
          </div>

          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>ประเภทบริษัท</TableHead>
                <TableHead>จำนวนทำบัญชี (ราย)</TableHead>
                <TableHead>รายได้ทำบัญชี (บาท)</TableHead>
                <TableHead>จำนวนสอบบัญชี (ราย)</TableHead>
                <TableHead>รายได้สอบบัญชี (บาท)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="even:bg-blue-50/50">
                <TableCell>บริษัทจดทะเบียน</TableCell>
                <TableCell>{CorporateGuarantee.accountingCustomerAmount}</TableCell>
                <TableCell>{CorporateGuarantee.accountingCustomerIncome}</TableCell>
                <TableCell>{CorporateGuarantee.accountingCustomerNoneAmount}</TableCell>
                <TableCell>{CorporateGuarantee.accountingCustomerNoneIncome}</TableCell>
              </TableRow>
              <TableRow className="even:bg-blue-50/50">
                <TableCell>บริษัทไม่จดทะเบียน</TableCell>
                <TableCell>{CorporateGuarantee.auditoringCustomerAmount}</TableCell>
                <TableCell>{CorporateGuarantee.auditoringCustomerIncome}</TableCell>
                <TableCell>{CorporateGuarantee.auditoringCustomerNoneAmount}</TableCell>
                <TableCell>{CorporateGuarantee.auditoringCustomerNoneIncome}</TableCell>
              </TableRow>
              <TableRow className="even:bg-blue-50/50 ">
                <TableCell className="font-bold">รวม</TableCell>
                <TableCell className="font-bold">{CorporateGuarantee.totalAccountingAmount}</TableCell>
                <TableCell className="font-bold">{CorporateGuarantee.totalAccountingIncome}</TableCell>
                <TableCell className="font-bold">{CorporateGuarantee.totalAuditingAmount}</TableCell>
                <TableCell className="font-bold">{CorporateGuarantee.totalAuditingIncome}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="p-4">
            <p>
              ข้าพเจ้าได้จัดให้มีหลักประกันเพื่อประกันความรับผิดชอบต่อบุคคลที่สามแล้ว ตามกฏกระทรวง เป็นจำนวนไม่น้อยกว่าร้อยละ 3 และในการแจ้งหลักประกันครั้งนี้จำนวนที่มากกว่าในการคิดคำนวณหลักประกันคือ <span className="font-bold">{Number(corporate.capital) < 300000 ? "ของทุน ณ วันที่ยื่นจดทะเบียนต่อสภาวิชาชีพบัญชี / วันสิ้นรอบปีบัญชี" : `ของรายได้รอบปีบัญชี ${new Date().getFullYear() + 543}`}</span>
            </p>
          </div>

          <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
            {[
              { label: "สิ้นรอบปีบัญชี ณ วันที่ : ", value: corporate.fiscalYearEndDate ? toBuddhistDate(corporate.fiscalYearEndDate) : "-" },
              { label: "คิดเป็นจำนวนเงิน : ", value: corporate.totalRevenue ? formatCurrency(corporate.totalRevenue) : "-" },
            ].map(({ label, value }) => (
              <div className="flex items-start gap-4" key={label}>
                <label className="block text-sm font-bold text-gray-700" style={{ width: "140px", minWidth: "140px" }}>
                  {label}
                </label>
                <p className="text-sm text-gray-900 rounded flex-1">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 border-2 border-blue-100/75">
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="font-bold">รายละเอียดหลักประกัน : {(corporate.guarantee?.length > 0 && corporate.guarantee[0].guaranteeTypeName) || "-"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <GuaranteeTable key={guaranteeType} type={guaranteeType} guarantees={corporate.guarantee} />
        </CardContent>
      </Card>
    </>
  );
}
