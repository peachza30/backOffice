// File: sections/RevenueSummaryCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Label } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/label";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";

export default function RevenueSummaryCard({ corporate }: { corporate: any }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50 m-5">
        <CardTitle className="text-md font-bold">
          <div className="flex flex-wrap gap-x-10 gap-y-8">
            <span className="font-bold">รายได้จากการประกอบธุรกิจคิดเป็น :</span>
            {/* ทำบัญชี */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
              <span className="font-bold">ทำบัญชี</span>
              <Label inputMode="numeric" className="w-28 text-center">
                {corporate.accountingRevenue != null ? formatCurrency(corporate.accountingRevenue) : "0.00"}
              </Label>
              <span className="font-bold">บาท</span>
            </div>
            {/* สอบบัญชี */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
              <span className="font-bold">สอบบัญชี</span>
              <Label inputMode="numeric" className="w-28 text-center">
                {corporate.auditingRevenue != null ? formatCurrency(corporate.auditingRevenue) : "0.00"}
              </Label>
              <span className="font-bold">บาท</span>
            </div>
            {/* อื่นๆ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
              <span className="font-bold">อื่นๆ</span>
              <Label inputMode="numeric" className="w-28 text-center">
                {corporate.otherRevenue != null ? formatCurrency(corporate.otherRevenue) : "0.00"}
              </Label>
              <span className="font-bold">บาท</span>
            </div>
            {/* สิ้นรอบบัญชี */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
              <span className="font-bold">สิ้นรอบบัญชีวันที่</span>
              <span className="font-bold">:</span>
              <span className="font-bold">{(corporate.fiscalYearEndDate && toBuddhistDate(corporate.fiscalYearEndDate)) || "-"}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
