"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import DocumentViewerDialog from "../dialog/document-viewer-dialog";

const DocumentTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string } | null>(null);

  const handleOpenDialog = (title: string, url: string) => {
    setSelectedDoc({ title, url });
    setOpenDialog(true);
  };

  const data = [
    {
      id: 1,
      type: "หนังสือรับรองการจดทะเบียนนิติบุคคล ไม่เกิน 3 เดือน",
      count: 10,
      date: "2023-10-01",
      file: "/files/document1.pdf",
    },
    {
      id: 2,
      type: "สำเนาบัตรประจำตัวประชาชนของกรรมการ/หุ้นส่วนผู้จัดการผู้มีอำนาจลงนาม",
      count: 5,
      date: "2023-10-02",
      file: "/files/document2.pdf",
    },
    {
      id: 3,
      type: "งบการเงินย้อนหลัง3ปี",
      count: 3,
      date: "2023-10-03",
      file: "/files/document3.pdf",
    },
  ];

  return (
    <>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow className="even:bg-blue-50/50">
            <TableHead>ลำดับ</TableHead>
            <TableHead>ประเภทเอกสาร</TableHead>
            <TableHead>จำนวนเอกสาร</TableHead>
            <TableHead>วันที่เอกสาร</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <Button size="icon" onClick={() => handleOpenDialog(item.type, item.file)} color="info" variant="soft">
                  <Icon icon="fluent:eye-24-filled" width="15" height="15" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDoc && (
        <DocumentViewerDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title={selectedDoc.title}
          filePages={[selectedDoc.url]} // ✅ ส่งเป็น array of URLs
        />
      )}
    </>
  );
};

export default DocumentTable;
