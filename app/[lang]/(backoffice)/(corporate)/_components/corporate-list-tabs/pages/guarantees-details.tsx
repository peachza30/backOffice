"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

const GuaranteesDetails = corporate => {
  const CorporateGuarantee = corporate.corporate;
  return (
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
  );
};

export default GuaranteesDetails;
