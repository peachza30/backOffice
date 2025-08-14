// File: sections/DocumentsSection.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import DocumentTable from "../pages/document";

export default function DocumentsSection({ id }: { id: number }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50">
        <CardTitle className="font-bold">เอกสาร</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DocumentTable requestId={id} />
      </CardContent>
    </Card>
  );
}
