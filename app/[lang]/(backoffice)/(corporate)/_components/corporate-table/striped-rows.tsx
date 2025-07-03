"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

 const EmployeeList = () => {
  return (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          <TableHead>ลำดับ</TableHead>
          <TableHead>เลขบัตรประชาชน</TableHead>
          <TableHead>ชื่อ-สกุล</TableHead>
          <TableHead>เลขทะเบียนผู้สอบบัญชี</TableHead>
          <TableHead>วันหมดอายุ</TableHead>
          <TableHead>ปฎิบัติงาน</TableHead>
          <TableHead>ประเภทสมาชิก</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>28</TableCell>
          <TableCell>85</TableCell>
          <TableCell>85</TableCell>
          <TableCell>85</TableCell>
        </TableRow>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>2</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>32</TableCell>
          <TableCell>92</TableCell>
          <TableCell>92</TableCell>
          <TableCell>92</TableCell>
        </TableRow>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>3</TableCell>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>45</TableCell>
          <TableCell>77</TableCell>
          <TableCell>77</TableCell>
          <TableCell>77</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default EmployeeList;
