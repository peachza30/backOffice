// File: sections/TransactionsSection.tsx
import React from "react";
import { Card, CardContent } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Button } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/button";
import { Input } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/input";
import { Icon } from "@iconify/react";
import TransactionHistory from "../pages/transaction-history";

export default function TransactionsSection() {
  return (
    <>
      <div className="flex items-center justify-between mb-7 gap-x-4 ">
        <p className="font-bold text-lg">คำค้น</p>
        <Input placeholder="เลขที่คำขอ" className="flex-1" />
        <p className="font-bold text-lg">ประเภทคำขอ</p>
        <Input placeholder="ทั้งหมด" className="flex-1" />
        <Button variant="outline" className="w-32">
          <Icon icon="solar:search-bold-duotone" width="20" height="20" className="mr-2" />
          Search
        </Button>
        <Button variant="outline" className="w-32">
          <Icon icon="solar:refresh-bold-duotone" width="20" height="20" className="mr-2" />
          Clear
        </Button>
      </div>
      <Card className="mb-4 border-2 border-blue-100/75">
        <CardContent className="space-y-2">
          <TransactionHistory />
        </CardContent>
      </Card>
    </>
  );
}
