"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  filePages: string[]; // array of image/pdf page URLs
};

const DocumentViewerDialog = ({ open, onClose, title, filePages }: Props) => {
  const [page, setPage] = useState(0);

  const handleNext = () => {
    if (page < filePages.length - 1) setPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  const handleReload = () => {
    // สำหรับการรีเฟรชภาพ: เปลี่ยน URL ให้เปลี่ยน query param
    const current = filePages[page];
    filePages[page] = current + `?r=${Math.random()}`;
    setPage(prev => prev); // force re-render
  };

  const handlePrint = () => {
    const printWindow = window.open(filePages[page], "_blank");
    printWindow?.print();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = filePages[page];
    link.download = `document_page_${page + 1}`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl h-[85vh] flex flex-col gap-3" size="full">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded border overflow-hidden">
          <div className="relative w-full h-full">
            <Image src={filePages[page]} alt={`Page ${page + 1}`} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 1024px" priority />
          </div>
        </div>

        {/* controls */}
        <div className="flex items-center justify-between text-sm text-gray-700">
          {/* left: page info */}
          <div>
            File: {page + 1}/{filePages.length}
          </div>

          {/* center: arrows */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={page === 0}>
              <Icon icon="mdi:chevron-left" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} disabled={page === filePages.length - 1}>
              <Icon icon="mdi:chevron-right" />
            </Button>
          </div>

          {/* right: actions */}
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={handleReload}>
              <Icon icon="mdi:refresh" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDownload}>
              <Icon icon="mdi:download" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handlePrint}>
              <Icon icon="mdi:printer" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
