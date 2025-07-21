"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

const GuaranteesDetails = (rows: CorporateList) => {
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
          <TableCell>10</TableCell>
          <TableCell>10,000.00</TableCell>
          <TableCell>10</TableCell>
          <TableCell>10,000.00</TableCell>
        </TableRow>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>บริษัทไม่จดทะเบียน</TableCell>
          <TableCell>20</TableCell>
          <TableCell>30,000.00</TableCell>
          <TableCell>20</TableCell>
          <TableCell>20,000.00</TableCell>
        </TableRow>
        <TableRow className="even:bg-blue-50/50 ">
          <TableCell className="font-bold">รวม</TableCell>
          <TableCell className="font-bold">30</TableCell>
          <TableCell className="font-bold">40,000.00</TableCell>
          <TableCell className="font-bold">30</TableCell>
          <TableCell className="font-bold">40,000.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default GuaranteesDetails;
