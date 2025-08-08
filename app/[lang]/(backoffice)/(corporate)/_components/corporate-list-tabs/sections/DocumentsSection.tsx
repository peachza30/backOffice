// File: sections/DocumentsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import React, { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import DocumentViewerDialog from "../../corporate-list-dialog/document-viewer-dialog";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { toBuddhistDate } from "@/utils/Constant";
export default function DocumentsSection({ id }: { id: number }) {
  const { corporate, loading, fetchCorporateDocuments } = useCorporateStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openDialog = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setDialogOpen(true);
    },
    [id]
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setCurrentIndex(null);
  }, []);

  if (!corporate) return <TableSkeleton rows={5} />;
  
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50">
        <CardTitle className="font-bold">เอกสาร</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
              {corporate?.document.length === 0 ? (
                <TableRow className="h-12">
                  <TableCell colSpan={5} className="text-center">
                    --- ไม่พบข้อมูล ---
                  </TableCell>
                </TableRow>
              ) : (
                corporate?.document.map((doc, idx) => (
                  <TableRow key={doc.id} className="even:bg-blue-50/50">
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{doc.documentName}</TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{(doc.receivedDate !== "" && toBuddhistDate(doc.receivedDate)) || "-"}</TableCell>
                    <TableCell>
                      <Button size="icon" onClick={() => openDialog(idx)} color="info" variant="soft">
                        <Icon icon="fluent:eye-24-filled" width={15} height={15} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {currentIndex !== null && <DocumentViewerDialog open={dialogOpen} onClose={closeDialog} initialIndex={currentIndex} />}
        </>
      </CardContent>
    </Card>
  );
}
