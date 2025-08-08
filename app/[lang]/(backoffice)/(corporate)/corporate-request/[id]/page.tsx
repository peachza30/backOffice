"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Button } from "../../_components/ui/button";
import { useRouter } from "next/navigation";
import CorporateRequest from "../../_components/corporate-request-tabs/corporate-tabs";
import RequestEditDialog from "../../_components/corporate-request-dialog/request-edit-dialog";
import { useEffect, useState } from "react";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import RequestDialog from "../../_components/dialog/request-dialog";
import SuccessDialog from "../../_components/dialog/success-dialog";

const CorporatePage = ({ params }: { params: { id: number } }) => {
  const { request, mode, remark, updated, loading, fetchCorporateRequest, updateCorporateRequest } = useCorporateStore();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [submitType, setSubmitType] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchCorporateRequest(params.id);
    }
  }, [params.id, fetchCorporateRequest]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = () => {
    router.back();
  };
  const onSubmit = async (type: string) => {
    setSubmitType(type); // ยังใช้เพื่อประมวลผลภายหลังได้
    setOpenModal(true);
  };

  const handleSuccessModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/corporate-request");
    }
    setOpenSuccessModal(isOpen);
  };
  const handleConfirm = async () => {
    const statusMap: Record<string, string> = {
      approve: "1",
      cancel: "2",
      modify: "3",
    };
    try {
      if (params?.id) {
        await updateCorporateRequest({
          ApplicationRequest_ID: request?.applicationRequestId || "",
          Registration_No: request?.registrationNo || "",
          Status: statusMap[submitType] ?? 0,
          Fee: request?.fee || "0",
          Remark: remark,
          DueDateForPayFee: "2025-03-12",
          E_Mail: request?.email || "",
        });
      }
      setOpenSuccessModal(true);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  /*------- Dialog Config -------*/
  let dialogConfig = {};
  let successDialogConfig = {};

  switch (submitType) {
    case "cancel":
      dialogConfig = {
        title: "ยืนยันการยกเลิกคำขอ",
        icon: "stash:question",
        class: "destructive",
        color: "#DC2626",
        body: `ท่านต้องการยกเลิกคำขอเลขที่ ${request?.no} ใช่หรือไม่`,
        confirmButton: "Confirm",
        cancelButton: "Cancel",
      };
      successDialogConfig = {
        icon: "solar:verified-check-outline",
        body: `ยกเลิกคำขอเลขที่ ${request?.no} สำเร็จ`,
        class: "destructive",
        color: "#DC2626",
      };
      break;
    case "approve":
      dialogConfig = {
        title: "ยืนยันการอนุมัติคำขอ",
        icon: "stash:question",
        class: "primary",
        color: "#2563EB",
        body: `ท่านต้องการอนุมัติคำขอเลขที่ ${request?.no} ใช่หรือไม่`,
        confirmButton: "Confirm",
        cancelButton: "Cancel",
      };
      successDialogConfig = {
        icon: "solar:verified-check-outline",
        body: `อนุมัติคำขอเลขที่ ${request?.no} สำเร็จ`,
        class: "primary",
        color: "#2563EB",
      };
      break;
    case "modify":
      dialogConfig = {
        title: "ยืนยันการแจ้งแก้ไขคำขอ",
        icon: "stash:question",
        class: "warning",
        color: "#F97316",
        body: `ท่านต้องการแจ้งแก้ไขคำขอเลขที่ ${request?.no} ใช่หรือไม่`,
        confirmButton: "Confirm",
        cancelButton: "Cancel",
      };
      successDialogConfig = {
        icon: "solar:verified-check-outline",
        body: `แจ้งแก้ไขคำขอเลขที่ ${request?.no} สำเร็จ`,
        class: "warning",
        color: "#F97316",
      };
      break;
  }

  return (
    <>
      {openModal && <RequestDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={dialogConfig} />}
      {updated?.success && openSuccessModal && <SuccessDialog open={openSuccessModal} onOpenChange={handleSuccessModalChange} dialogConfig={successDialogConfig} />}

      {request && mode === "edit" && <RequestEditDialog open={open} onClose={handleClose} />}
      <Card title="Services List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">คำขอนิติบุคคล</div>
          </div>
        </CardHeader>
        <CardContent>
          <CorporateRequest id={params.id} />
        </CardContent>
        {mode === "edit" && (
          <CardFooter className="pt-10">
            <div className="flex w-full justify-start">
              <Button variant="outline" color="secondary" onClick={handleBack}>
                ย้อนกลับ
              </Button>
            </div>
            <div className="flex w-full justify-end">
              <Button className="mr-7" variant="soft" color="destructive" onClick={() => onSubmit("cancel")}>
                ยกเลิกคำขอ
              </Button>
              <Button className="mr-3" color="destructive" onClick={() => onSubmit("modify")}>
                แจ้งแก้ไข
              </Button>
              <Button color="primary" onClick={() => onSubmit("approve")}>
                ผ่านการตรวจสอบ
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default CorporatePage;
