"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const DepositAccount = () => {
  return (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          <TableHead>ลำดับ</TableHead>
          <TableHead>ธนาคาร</TableHead>
          <TableHead>สาขา</TableHead>
          <TableHead>เลขที่บัญชี</TableHead>
          <TableHead>ชื่อบัญชี</TableHead>
          <TableHead>ฝากประจำ (ปี)</TableHead>
          <TableHead>จำนวนเงิน (บาท)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>1</TableCell>
          <TableCell>ธนาคารออมสิน</TableCell>
          <TableCell>สำนักงานใหญ่</TableCell>
          <TableCell>111-111-111</TableCell>
          <TableCell>ห้างหุ้นส่วนจำกัด เอ็ม แอนด์ เอ็ม การบัญชี</TableCell>
          <TableCell>1</TableCell>
          <TableCell>10,000.00</TableCell>
        </TableRow>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>2</TableCell>
          <TableCell>ธนาคารทหารไทย</TableCell>
          <TableCell>ระยอง</TableCell>
          <TableCell>222-222-222</TableCell>
          <TableCell>M&M ACCOUNTING LIMITED PARTNERSHIP</TableCell>
          <TableCell>1</TableCell>
          <TableCell>200,000.00</TableCell>
        </TableRow>
        <TableRow className="even:bg-blue-50/50">
          <TableCell>3</TableCell>
          <TableCell>ธนาคารไทยพาณิชย์</TableCell>
          <TableCell>อโศก</TableCell>
          <TableCell>333-333-333</TableCell>
          <TableCell>M&M ACCOUNTING LIMITED PARTNERSHIP</TableCell>
          <TableCell>1</TableCell>
          <TableCell>500.00</TableCell>
        </TableRow>
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

export default DepositAccount;
