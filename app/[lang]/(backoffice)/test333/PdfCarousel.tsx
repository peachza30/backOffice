"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  fileIds: string[];
}

export default function PdfCarousel({ fileIds }: Props) {
  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState("");

  useEffect(() => {
    const fileId = fileIds[index];
    setSrc(`/api/biz/download?fileId=${fileId}` + `&contentType=application/pdf&t=${Date.now()}`);
  }, [index, fileIds]);

  return (
    <div className="flex flex-col items-center gap-4">
      {src && (
        <iframe
          key={src} // force full reload
          src={src}
          className="w-full h-[80vh] border"
        />
      )}

      <div className="flex gap-2">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>
          Prev
        </Button>
        <Button variant="outline" disabled={index === fileIds.length - 1} onClick={() => setIndex(i => i + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
