"use client";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  dialogConfig: {
    title?: string;
    icon?: string;
    class?: "primary" | "default" | "destructive" | "success" | "info" | "warning" | "secondary" | "dark";
    color?: string;
    size?: "sm" | "md" | "lg" | "xl";
    body?: ReactNode;
    sub?: ReactNode;
    confirmButton?: string | "Confirm";
    cancelButton?: string | "Cancel";
  };
}

const RequestDialog = ({ open, onOpenChange, onConfirm, dialogConfig }: DialogProps) => {
  const { setRemark } = useCorporateStore();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            <div className="justify-center first-letter:text-center flex flex-col items-center border-b">
              <p className={`p-5 font-bold text-${dialogConfig.class ?? "default"}`} style={{ fontSize: "24px" }}>
                {dialogConfig.title}
              </p>
            </div>
            <div className="justify-center first-letter:text-center flex flex-col items-center">{dialogConfig.icon && <Icon icon={dialogConfig.icon} width="100" height="100" style={{ color: dialogConfig.color }} />}</div>
          </DialogTitle>
        </DialogHeader>
        <div className="justify-center first-letter:text-center flex flex-col items-center">
          <p className={`pb-4 text-xl font-bold text-${dialogConfig.class ?? "default"}`}>{dialogConfig.body}</p>
        </div>
        <Label className="mb-2">
          หมายเหตุ <b style={{ color: "red" }}>*</b>
        </Label>
        <Textarea placeholder="กรุณากรอกหมายเหตุ" id="message" onChange={e => setRemark(e.target.value)} rows={3} />

        <div className="justify-center first-letter:text-center flex flex-col items-center">
          <DialogFooter className="mt-2 gap-2">
            <Button type="button" color={dialogConfig.class} onClick={onConfirm}>
              {dialogConfig.confirmButton}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" color="secondary">
                {dialogConfig.cancelButton}
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
