"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  initialIndex: number | null;
}

const NAV_BTN_WIDTH = "w-12"; // change here to enlarge / shrink click zone

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({ open, onClose, initialIndex }) => {
  const { corporate, documents, loading, fetchCorporateDocuments } = useCorporateStore();
  const [index, setIndex] = useState(initialIndex);
  const [src, setSrc] = useState("");
  const [files, setFiles] = useState(corporate?.document || []);
  const [url, setUrl] = useState("");

  // Reset page on new open / index change
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (index !== null && corporate && corporate.document && corporate.document.length > 0) {
      fetchCorporateDocuments(corporate.document[index].fileId);
      setFiles(corporate.document);
    }
  }, [index, corporate, fetchCorporateDocuments]);

  useEffect(() => {
    if (!loading && documents && documents.length > 0) {
      setSrc(`/api/file/proxy?url=${documents.url}`);
    }
  }, [documents]);

  const goPrev = () => setIndex(i => (i === null ? 0 : Math.max(0, i - 1)));
  const goNext = () => setIndex(i => (i === null ? 0 : Math.min((corporate?.document?.length ?? 0) - 1, i + 1))); //Math.min(files.length - 1, i + 1))); //Math.min(corporate?.document.length - 1, i + 1)));

  const handleReload = async () => {
    if (index !== 0) {
      await setIndex(0);
    } else {
      await setIndex(null);
      await setIndex(index);
    }
  };

  const handlePrint = async () => {
    if (index === null) return;
    const currentIndex = index !== null ? index : 0;
    const currentFile = `/api/biz/download?fileId=${corporate?.document[currentIndex].fileId}&contentType=application/pdf&t=${Date.now()}`;
    const printWindow = window.open(currentFile, "_blank");
    printWindow?.print();
  };

  const handleDownload = () => {
    // guard-check
    const currentIndex = index !== null ? index : 0;
    if (!documents.url) return;
    const currentFile = `/api/biz/download?fileId=${corporate?.document[currentIndex].fileId}&contentType=application/pdf&t=${Date.now()}`;
    const link = document.createElement("a");
    link.href = currentFile; // or files[currentIndex].url if your item is an object
    link.download = `document_${currentIndex + 1}_${Date.now()}`; // back-ticks for template literal

    // Firefox needs the element in the DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentIndex = index ?? 0;
  const currentFile = corporate?.document[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-7xl h-[85vh] flex flex-col gap-3 pl-14 pr-pl-14" size="full">
        <DialogHeader>
          <DialogTitle className="text-lg text-center">ประเภทเอกสาร : {currentFile?.documentName ?? "เอกสาร"}</DialogTitle>
        </DialogHeader>

        {/* Viewer */}
        <div className="relative flex-1 bg-gray-100 rounded border overflow-hidden group">
          {/* Left click‑strip */}
          <button aria-label="ก่อนหน้า" onClick={goPrev} disabled={index === 0} className={`absolute inset-y-0 left-0 ${NAV_BTN_WIDTH} flex items-center justify-center transition-opacity bg-blue-50 hover:bg-blue-200/50 disabled:opacity-0 cursor-pointer`}>
            <Icon icon="mdi:chevron-left" width={36} height={36} className="drop-shadow" style={{ color: "#2563EB" }} />
          </button>
          {/* iframe */}
          {!loading ? (
            <iframe key={src} src={src} style={{ overflow: "hidden" }} className="w-full h-full border-none pl-12 pr-12 overflow-hidden " title={currentFile && currentFile.documentName} />
          ) : (
            <div className="flex items-center justify-center h-full w-full align-baseline">
              <Icon icon="eos-icons:loading" className="" width={80} height={80} style={{ color: "#2563EB" }}></Icon>
            </div>
          )}
          {/* Right click‑strip */}
          <button aria-label="ถัดไป" onClick={goNext} disabled={corporate?.document && index === corporate.document.length - 1} className={`absolute inset-y-0 right-0 ${NAV_BTN_WIDTH} flex items-center justify-center transition-opacity bg-blue-50 hover:bg-blue-200/50  disabled:opacity-0 cursor-pointer`}>
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
