"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Button } from "../../_components/ui/button";
import { useRouter } from "next/navigation";
import CorporateRequestEdit from "../../_components/corporate-request-tabs/corporate-edit-tabs";
import RequestEditDialog from "../../_components/corporate-request-dialog/request-edit-dialog";
import { useState } from "react";
import { ro } from "@faker-js/faker";

const CorporatePage = ({ params }: { params: { id: number } }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <RequestEditDialog open={open} onClose={handleClose} details={[]} initialIndex={null} />
      <Card title="Services List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">คำขอนิติบุคคล</div>
          </div>
        </CardHeader>
        <CardContent>
          <CorporateRequestEdit id={params.id} />
        </CardContent>
        <CardFooter className="pt-10">
          <div className="flex w-full justify-start">
            <Button variant="outline" color="secondary" onClick={handleBack}>
              ย้อนกลับ
            </Button>
          </div>
          <div className="flex w-full justify-end">
            <Button className="mr-7" variant="soft" color="destructive">
              ยกเลิกคำขอ
            </Button>
            <Button className="mr-3" color="destructive">
              แจ้งแก้ไข
            </Button>
            <Button color="primary">ผ่านการตรวจสอบ</Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default CorporatePage;
