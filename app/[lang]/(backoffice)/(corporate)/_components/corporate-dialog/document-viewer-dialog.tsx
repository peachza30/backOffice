"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  files: any[];
  initialIndex: number | null;
}

const NAV_BTN_WIDTH = "w-12"; // change here to enlarge / shrink click zone

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({ open, onClose, files, initialIndex }) => {
  const [index, setIndex] = useState(initialIndex);

  // Reset page on new open / index change
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const goPrev = () => setIndex(i => (i === null ? 0 : Math.max(0, i - 1)));
  const goNext = () => setIndex(i => (i === null ? 0 : Math.min(files.length - 1, i + 1)));

  const handleReload = async () => {
    if (index !== 0) {
      await setIndex(0);
    } else {
      await setIndex(null);
      await setIndex(0);
    }
  };

  const handlePrint = () => {
    if (index === null) return;
    const printWindow = window.open(files[index], "_blank");
    printWindow?.print();
  };

  const handleDownload = () => {
    // guard-check
    const currentIndex = index !== null ? index : 0;
    if (!files[currentIndex]) return;
    const link = document.createElement("a");
    link.href = files[currentIndex]; // or files[currentIndex].url if your item is an object
    link.download = `document_page_${currentIndex + 1}`; // back-ticks for template literal

    // Firefox needs the element in the DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentIndex = index ?? 0;
  const currentFile = files[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-7xl h-[85vh] flex flex-col gap-3 pl-14 pr-pl-14" size="full">
        <DialogHeader>
          <DialogTitle className="text-lg text-center">ประเภทเอกสาร : {currentFile?.type ?? "เอกสาร"}</DialogTitle>
        </DialogHeader>

        {/* Viewer */}
        <div className="relative flex-1 bg-gray-100 rounded border overflow-hidden group">
          {/* Left click‑strip */}
          <button aria-label="ก่อนหน้า" onClick={goPrev} disabled={index === 0} className={`absolute inset-y-0 left-0 ${NAV_BTN_WIDTH} flex items-center justify-center transition-opacity bg-blue-50 hover:bg-blue-200/50 disabled:opacity-0 cursor-pointer`}>
            <Icon icon="mdi:chevron-left" width={36} height={36} className="drop-shadow" style={{ color: "#2563EB" }} />
          </button>
          {/* iframe */}
          {currentFile ? <iframe src={currentFile.file} style={{ overflow: "hidden" }} className="w-full h-full border-none pl-12 pr-12 overflow-hidden " title={currentFile.type} /> : <p className="flex items-center justify-center h-full">ไม่พบไฟล์</p>}
          {/* Right click‑strip */}
          <button aria-label="ถัดไป" onClick={goNext} disabled={index === files.length - 1} className={`absolute inset-y-0 right-0 ${NAV_BTN_WIDTH} flex items-center justify-center transition-opacity bg-blue-50 hover:bg-blue-200/50  disabled:opacity-0 cursor-pointer`}>
            <Icon icon="mdi:chevron-right" width={36} height={36} className="drop-shadow" style={{ color: "#2563EB" }} />
          </button>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-700">
          {/* left: page info */}
          <div className="font-semibold">
            File: {index !== null ? index + 1 : 0} / {files.length}
          </div>

          {/* right: actions */}
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
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
