"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { on } from "events";

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  files: CorporateDocumentItem[]; // ← ส่งรายการไฟล์ของ "กลุ่ม" ที่เลือก
  initialIndex?: number; // ← เริ่มจากไฟล์ไหน (ค่าเริ่มต้น 0)
  title?: string; // ← เช่น ชื่อประเภทเอกสาร (documentName)
}

const NAV_BTN_WIDTH = "w-12";

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({ open, onClose, onConfirm, files, initialIndex = 0, title }) => {
  const { loading, fetchCorporateDocuments, documents, setDocumentPayload } = useCorporateStore(); // documents ควรมี .url (signed url) หลัง fetch
  const [index, setIndex] = useState<number>(initialIndex);
  const [src, setSrc] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [status, setStatus] = useState<number>(0);

  const total = files.length;
  const current = useMemo(() => files[index] ?? null, [files, index]);
  const fileId = current?.id ?? "";

  // sync index เมื่อเปิด/เปลี่ยนค่าเริ่มต้น
  useEffect(() => {
    if (open) setIndex(Math.min(initialIndex, Math.max(0, total - 1)));
  }, [open, initialIndex, total]);

  // เลือกแหล่งดูไฟล์: ใช้ urlFile ได้เลยถ้าเป็น http(s) มิฉะนั้นเรียก fetch ด้วย fileId
  useEffect(() => {
    if (!open || !current) return;
    if (current.fileId) {
      // ขอ signed URL จาก backend ตาม fileId
      fetchCorporateDocuments(current.fileId);
    } else {
      setSrc("");
    }
  }, [open, index, current, fetchCorporateDocuments]);

  // อัปเดต src เมื่อได้ผล fetch (ปกติ documents ควรมี field .url)
  useEffect(() => {
    const fetchedUrl = documents && typeof documents === "object" && "url" in documents ? (documents as any).url : "";
    if (!loading && fetchedUrl) {
      setSrc(`/api/file/proxy?url=${encodeURIComponent(fetchedUrl as string)}`);
    }
  }, [documents, loading]);

  const goPrev = () => setIndex(i => Math.max(0, i - 1));
  const goNext = () => setIndex(i => Math.min(total - 1, i + 1));

  const handleReload = () => {
    // รีเฟรช iframe โดยเปลี่ยน key (ตั้ง src เดิมอีกครั้ง)
    setSrc(src => (src ? `${src.split("&_r=")[0]}&_r=${Date.now()}` : src));
  };

  const handlePrint = () => {
    if (!current) return;
    const url = `/api/biz/download?fileId=${current.fileId}&contentType=application/pdf&t=${Date.now()}`;
    const w = window.open(url, "_blank");
    w?.print();
  };

  const handleDownload = () => {
    if (!current) return;
    const url = `/api/biz/download?fileId=${current.fileId}&contentType=application/pdf&t=${Date.now()}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `document_${index + 1}_${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleSubmit = () => {
    onConfirm?.();
    setDocumentPayload({
      fileId: fileId,
      remark: remark,
      status: status,
      active: 1,
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="w-full max-w-7xl h-[85vh] flex flex-col gap-3 pl-14 pr-14" size="full">
        <DialogHeader>
          <DialogTitle className="text-lg text-center">ประเภทเอกสาร : {title ?? "เอกสาร"}</DialogTitle>
        </DialogHeader>

        {/* Viewer */}
        <div className="relative flex-1 bg-gray-100 rounded border overflow-hidden">
          {/* Left */}
          <button aria-label="ก่อนหน้า" onClick={goPrev} disabled={index <= 0} className={`absolute inset-y-0 left-0 ${NAV_BTN_WIDTH} flex items-center justify-center transition-opacity bg-blue-50 hover:bg-blue-200/50 disabled:opacity-0`}>
            <Icon icon="mdi:chevron-left" width={36} height={36} className="drop-shadow" style={{ color: "#2563EB" }} />
          </button>

          {/* Iframe / Loader */}
          {!loading && src ? (
            <iframe key={src} src={src} className="w-full h-full border-none" title={title ?? `เอกสาร ${index + 1}`} />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <Icon icon="eos-icons:loading" width={80} height={80} style={{ color: "#2563EB" }} />
            </div>
          )}

          {/* Right */}
          <button aria-label="ถัดไป" onClick={goNext} disabled={index >= total - 1} className={`absolute inset-y-0 right-0 ${NAV_BTN_WIDTH} flex items-center justify-center transition-opacity bg-blue-50 hover:bg-blue-200/50 disabled:opacity-0`}>
            <Icon icon="mdi:chevron-right" width={36} height={36} className="drop-shadow" style={{ color: "#2563EB" }} />
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="font-semibold">
            File: {Math.min(index + 1, total)} / {total}
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="soft" className="rounded-full" onClick={handleReload}>
              <Icon icon="icon-park-outline:redo" />
            </Button>
            <Button size="icon" variant="soft" className="rounded-full" onClick={handleDownload}>
              <Icon icon="fluent:save-28-filled" />
            </Button>
            <Button size="icon" variant="soft" className="rounded-full" onClick={handlePrint}>
              <Icon icon="fluent:print-24-filled" />
            </Button>
          </div>
        </div>

        {/* ตรวจหลักฐาน */}
        <div>
          <label>ผลการตรวจหลักฐาน</label>
          <RadioGroup defaultValue="" className="my-7" onValueChange={v => setStatus(Number(v))}>
            <RadioGroupItem value="1" size="xs" id="r_1" color="default">
              ผ่าน
            </RadioGroupItem>
            <RadioGroupItem value="2" size="xs" id="r_2" color="default">
              ไม่ผ่าน
            </RadioGroupItem>
            <RadioGroupItem value="0" size="xs" id="r_3" color="default">
              ยังไม่ตรวจ
            </RadioGroupItem>
            <RadioGroupItem value="3" size="xs" id="r_4" color="default">
              ไม่ใช้งาน
            </RadioGroupItem>
          </RadioGroup>
          <label>หมายเหตุ</label>
          <Textarea className="my-3" placeholder="กรุณากรอกหมายเหตุ" rows={3} onChange={e => setRemark(e.target.value)} />
        </div>

        <DialogFooter className="flex justify-center gap-3">
          <Button onClick={handleSubmit}>บันทึก</Button>
          <Button onClick={onClose} variant="outline">
            ปิด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
