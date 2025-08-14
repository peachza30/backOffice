
// File: sections/AddressSection.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import type { AddressCard } from "../helpers";

const renderFields = (a: AddressCard) => (
  <div className="grid grid-cols-1 gap-6">
    {[
      { label: "รหัสสาขา", value: a.branchCode },
      { label: "ที่อยู่", value: a.fullAddress },
      { label: "โทรศัพท์", value: a.phone },
      { label: "โทรสาร", value: a.fax },
      { label: "อีเมล", value: a.email },
    ].map(({ label, value }) => (
      <div className="flex items-start gap-4" key={label}>
        <label className="block text-sm font-bold text-gray-700 pt-2 w-36 min-w-[140px]">{label}</label>
        <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
      </div>
    ))}
  </div>
);

export default function AddressSection({
  HQ = [],
  BILLING = [],
  CONTACT = [],
  BRANCHES = [],
}: {
  HQ?: AddressCard[];
  BILLING?: AddressCard[];
  CONTACT?: AddressCard[];
  BRANCHES?: AddressCard[];
}) {
  return (
    <>
      {HQ.map((card, idx) => (
        <Card key={`hq-${idx}`} className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-lg font-bold">ที่อยู่สำนักงานใหญ่</CardTitle>
          </CardHeader>
          <CardContent>{renderFields(card)}</CardContent>
        </Card>
      ))}

      {BILLING.map((card, idx) => (
        <Card key={`billing-${idx}`} className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-lg font-bold">ที่อยู่ออกใบเสร็จ</CardTitle>
          </CardHeader>
          <CardContent>{renderFields(card)}</CardContent>
        </Card>
      ))}

      {CONTACT.map((card, idx) => (
        <Card key={`contact-${idx}`} className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-lg font-bold">ที่อยู่สำหรับติดต่อ</CardTitle>
          </CardHeader>
          <CardContent>{renderFields(card)}</CardContent>
        </Card>
      ))}

      {BRANCHES.length > 0 && (
        <Card key="branches" className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-lg font-bold">ที่อยู่สาขา</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {BRANCHES.map((card, idx) => (
              <div key={idx}>
                {renderFields(card)}
                {idx < BRANCHES.length - 1 && <hr className="my-4 border-dashed" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}

