// File: sections/RegistrationDatesCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { toBuddhistDate } from "@/utils/Constant";

export default function RegistrationDatesCard({ request }: { request: any }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50">
        <CardTitle className="text-lg font-bold">วันสำคัญและการจดทะเบียน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "วันเริ่มประกอบธุรกิจ", value: request?.dbdRegistrationDate ? toBuddhistDate(request.dbdRegistrationDate) : "-" },
            { label: "วันที่ยื่นจดทะเบียนต่อสภา", value: request?.requestDateTypeDate ? toBuddhistDate(request.requestDateTypeDate) : "-" },
            { label: "วันที่เริ่มต้นสถานภาพ", value: request?.beginDate ? toBuddhistDate(request.beginDate) : "-" },
            { label: "วันที่สิ้นสถานภาพ", value: request?.expiredDate ? toBuddhistDate(request.expiredDate) : "-" },
          ].map(({ label, value }) => (
            <div className="flex items-start gap-4" key={label}>
              <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                {label}
              </label>
              <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
            </div>
          ))}
          <div className="flex items-start gap-4">
            <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "auto", minWidth: "140px" }}>
              วันที่จดทะเบียนนิติบุคคลต่อสภาวิชาชีพบัญชีภายใน 30 วันนับจาก <b className="text-blue-600">วันที่จดทะเบียนเปลี่ยนแปลงวัตถุประสงค์เพื่อให้บริการด้านการสอบบัญชีหรือด้านการทำบัญชี</b>
            </label>
            <p className="text-sm text-gray-900 p-2 rounded flex-1">{request?.registrationDate ? toBuddhistDate(request.registrationDate) : "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

