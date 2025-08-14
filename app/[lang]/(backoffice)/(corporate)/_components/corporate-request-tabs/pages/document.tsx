"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import DocumentViewerDialog from "../../corporate-request-dialog/document-viewer-dialog";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { toBuddhistDate } from "@/utils/Constant";
import ValidationDialog from "../../dialog/validation-dialog";

type DocItem = {
  id: number;
  corporateMemberRequestId: number;
  corporateId: number;
  receivedDate?: string;
  fileId: string;
  urlFile?: string;
};

type DocGroup = {
  documentTypeId: number;
  documentName: string;
  documents: DocItem[];
};

const DocumentTable = ({ requestId }: { requestId: number }) => {
  const { request, documentPayload } = useCorporateStore();
  const [openVaildationModal, setOpenVaildationModal] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // index ของไฟล์ภายในกลุ่ม
  const [selectedFiles, setSelectedFiles] = useState<DocItem[]>([]); // เอกสารของกลุ่มที่เลือก
  const [openModal, setOpenModal] = useState(false);

  const groups: DocGroup[] = useMemo(() => (request?.document ?? []) as DocGroup[], [request?.document]);

  const openDialog = (groupIndex: number) => {
    if (!documentPayload) {
      setOpenVaildationModal(true);
      return;
    }
    const files = groups[groupIndex]?.documents ?? [];
    setSelectedFiles(files);
    setCurrentIndex(0);
    setDialogOpen(true);
  };

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedFiles([]);
    setCurrentIndex(0);
  }, []);

  const handleSubmit = useCallback(() => {
    setDialogOpen(false);
    setSelectedFiles([]);
    setCurrentIndex(0);
  }, []);

  // วันที่ล่าสุดในกลุ่ม
  const latestReceivedDate = (g: DocGroup) => {
    const millis = g.documents.map(d => (d.receivedDate ? new Date(d.receivedDate).getTime() : 0)).filter(n => n > 0);
    if (millis.length === 0) return "-";
    const max = Math.max(...millis);
    return toBuddhistDate(new Date(max).toISOString());
  };

  // ตรวจสอบความครบถ้วนของ URL
  const validation = (g: DocGroup) => {
    const total = g.documents.length;
    const valid = g.documents.filter(d => d.urlFile && /^https?:\/\//i.test(d.urlFile)).length;
    const invalidOrMissing = total - valid;
    return {
      summary: invalidOrMissing === 0 ? "ครบถ้วน" : `มีปัญหา (${valid}/${total} ใช้งานได้)`,
      note: invalidOrMissing === 0 ? "—" : `${invalidOrMissing} ไฟล์ไม่มี URL หรือ URL ไม่ถูกต้อง`,
    };
  };

  if (!request) return <TableSkeleton rows={5} />;
  const validationConfig = {
    icon: "icomoon-free:cancel-circle",
    body: `กรุณาตรวจสอบเอกสารให้ครบถ้วนก่อนดำเนินการ`,
    class: "destructive",
    color: "#DC2626",
  };
  return (
    <>
      {openVaildationModal && <ValidationDialog open={openModal} onOpenChange={setOpenModal} dialogConfig={validationConfig} />}

      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>ลำดับ</TableHead>
            <TableHead>ประเภทเอกสาร</TableHead>
            <TableHead>จำนวนเอกสาร</TableHead>
            <TableHead>วันที่ล่าสุด</TableHead>
            <TableHead>ผลการตรวจสอบ</TableHead>
            <TableHead>หมายเหตุ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groups.length === 0 ? (
            <TableRow className="h-12">
              <TableCell colSpan={7} className="text-center">
                --- ไม่พบข้อมูล ---
              </TableCell>
            </TableRow>
          ) : (
            groups.map((doc, idx) => {
              const v = validation(doc);
              return (
                <TableRow key={doc.documentTypeId} className="even:bg-blue-50/50">
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{doc.documentName}</TableCell>
                  <TableCell>{doc.documents.length}</TableCell>
                  <TableCell>{latestReceivedDate(doc)}</TableCell>
                  <TableCell>{v.summary}</TableCell>
                  <TableCell>{v.note}</TableCell>
                  <TableCell>
                    <Button size="icon" onClick={() => openDialog(idx)} color="warning" variant="soft" aria-label="ดูเอกสาร">
                      <Icon icon="fluent:text-bullet-list-square-search-20-regular" width={15} height={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {dialogOpen && (
        <DocumentViewerDialog
          open={dialogOpen}
          onClose={closeDialog}
          onConfirm={handleSubmit}
          files={selectedFiles} // ← ส่งรายการไฟล์ของกลุ่มที่เลือก
          initialIndex={currentIndex} // ← เริ่มที่ไฟล์แรก (หรือกำหนดตามต้องการ)
        />
      )}
    </>
  );
};

export default DocumentTable;
