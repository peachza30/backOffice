// File: sections/GuaranteeSection.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/table";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";
import GuaranteeTable from "../pages/deposit-account";

export default function GuaranteeSection({ request, guaranteeType }: { request: any; guaranteeType: string }) {
  const CG = request || {};
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
            <p className="text-sm text-gray-900 p-2 rounded flex-1 break-words">{request?.fiscalYearEndDate ? toBuddhistDate(request.fiscalYearEndDate) : "-"}</p>
          </div>

          <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
            {[
              { label: "เงินทุนจดทะเบียน : ", value: request?.capital != null ? formatCurrency(request.capital) : "-" },
              { label: "รายได้รอบปีบัญชี : ", value: request?.totalRevenue != null ? formatCurrency(request.totalRevenue) : "-" },
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

          {/* GuaranteesDetails (inlined) */}
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
                <TableCell>{CG.accountingCustomerAmount ?? '-'}</TableCell>
                <TableCell>{CG.accountingCustomerIncome ?? '-'}</TableCell>
                <TableCell>{CG.accountingCustomerNoneAmount ?? '-'}</TableCell>
                <TableCell>{CG.accountingCustomerNoneIncome ?? '-'}</TableCell>
              </TableRow>
              <TableRow className="even:bg-blue-50/50">
                <TableCell>บริษัทไม่จดทะเบียน</TableCell>
                <TableCell>{CG.auditoringCustomerAmount ?? '-'}</TableCell>
                <TableCell>{CG.auditoringCustomerIncome ?? '-'}</TableCell>
                <TableCell>{CG.auditoringCustomerNoneAmount ?? '-'}</TableCell>
                <TableCell>{CG.auditoringCustomerNoneIncome ?? '-'}</TableCell>
              </TableRow>
              <TableRow className="even:bg-blue-50/50 ">
                <TableCell className="font-bold">รวม</TableCell>
                <TableCell className="font-bold">{CG.totalAccountingAmount ?? '-'}</TableCell>
                <TableCell className="font-bold">{CG.totalAccountingIncome ?? '-'}</TableCell>
                <TableCell className="font-bold">{CG.totalAuditingAmount ?? '-'}</TableCell>
                <TableCell className="font-bold">{CG.totalAuditingIncome ?? '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
            {[
              { label: "สิ้นรอบปีบัญชี ณ วันที่ : ", value: request?.fiscalYearEndDate ? toBuddhistDate(request.fiscalYearEndDate) : "-" },
              { label: "คิดเป็นจำนวนเงิน : ", value: request?.nameEn || "-" },
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

      {request?.guarantee?.length > 0 && (
        <Card className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="font-bold">รายละเอียดหลักประกัน : {request?.guarantee?.[0]?.guaranteeTypeName || "-"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <GuaranteeTable key={guaranteeType} type={guaranteeType} guarantees={request.guarantee} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
