"use client";
import { Button } from "@/components/ui/button";
import PdfCarousel from "./PdfCarousel";

const fileIds = [
    "66b31f10fc70cdde2d64fc90",
    "66b31f05fc70cdde2d64fc8c",
    "66b31f10fc70cdde2d64fc90",
  ];

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <PdfCarousel fileIds={fileIds} />
    </div>
  );
}
