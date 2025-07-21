"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import DocumentViewerDialog from "../../corporate-request-dialog/document-viewer-dialog";

const DocumentTable: React.FC = () => {
  const { documents, fetchCorporateDocuments } = useCorporateStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Fetch once on mount
  useEffect(() => {
    void fetchCorporateDocuments();
  }, [fetchCorporateDocuments]);

  const openDialog = useCallback((index: number) => {
    setCurrentIndex(index);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setCurrentIndex(null);
  }, []);

  return (
    <>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>ลำดับ</TableHead>
            <TableHead>ประเภทเอกสาร</TableHead>
            <TableHead>จำนวนเอกสาร</TableHead>
            <TableHead>วันที่เอกสาร</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc, idx) => (
            <TableRow key={doc.id} className="even:bg-blue-50/50">
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{doc.count}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>
                <Button size="icon" onClick={() => openDialog(idx)} color="info" variant="soft">
                  <Icon icon="fluent:eye-24-filled" width={15} height={15} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {currentIndex !== null && <DocumentViewerDialog open={dialogOpen} onClose={closeDialog} files={documents} initialIndex={currentIndex} />}
    </>
  );
};

export default DocumentTable;
