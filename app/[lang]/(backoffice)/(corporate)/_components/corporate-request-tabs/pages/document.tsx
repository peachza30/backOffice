"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import DocumentViewerDialog from "../../corporate-request-dialog/document-viewer-dialog";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { toBuddhistDate } from "@/utils/Constant";

const DocumentTable = ({ requestId }: { requestId: number }) => {
  const { request } = useCorporateStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openDialog = (index: number) => {
    setCurrentIndex(index);
    setDialogOpen(true);
  };

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setCurrentIndex(null);
  }, []);

  if (!request) return <TableSkeleton rows={5} />;
  useEffect(() => {
    console.log("request", request);
  }, [request]);
  return (
    <>
      {request?.document.length !== 0 && (
        <>
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>ลำดับ</TableHead>
                <TableHead>ประเภทเอกสาร</TableHead>
                <TableHead>จำนวนเอกสาร</TableHead>
                <TableHead>ผลการตรวจสอบ</TableHead>
                <TableHead>หมายเหตุ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {request?.document.length === 0 ? (
                <TableRow className="h-12">
                  <TableCell colSpan={5} className="text-center">
                    --- ไม่พบข้อมูล ---
                  </TableCell>
                </TableRow>
              ) : (
                request?.document.map((doc, idx) => (
                  <TableRow key={doc.id} className="even:bg-blue-50/50">
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{doc.documentName}</TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{toBuddhistDate(doc.receivedDate)}</TableCell>
                    <TableCell>{toBuddhistDate(doc.receivedDate)}</TableCell>
                    <TableCell>
                      <Button size="icon" onClick={() => openDialog(idx)} color="warning" variant="soft">
                        <Icon icon="fluent:text-bullet-list-square-search-20-regular" width={15} height={15} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {dialogOpen && <DocumentViewerDialog open={dialogOpen} onClose={closeDialog} initialIndex={currentIndex} />}
        </>
      )}
    </>
  );
};

export default DocumentTable;
