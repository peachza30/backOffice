"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem, DetailsGroup, data } from "./data";
interface RequestEditDialogProps {
  open: boolean;
  onClose?: () => void;
  details: any[]; // 🟢 typed!
  initialIndex: number | null;
}

const RequestEditDialog: React.FC<RequestEditDialogProps> = ({ open, onClose, details = data }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="full" className="w-full max-w-7xl h-[85vh] flex flex-col gap-3 pl-14 pr-14 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">รายละเอียดคำขอเปลี่ยนแปลงข้อมูลนิติบุคคล</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto mt-3 space-y-3">
          {data.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">— ไม่พบข้อมูล —</p>
          ) : (
            data.flatMap((group, groupIdx) =>
              Object.entries(group as DetailsGroup).map(([section, raw]) => {
                const items = raw as DetailItem[];
                return (
                  <Card key={`${section}-${groupIdx}`}>
                    <CardHeader className="bg-blue-50/40">
                      <CardTitle className="text-lg font-semibold">
                        <div className="flex items-center">
                          <Icon icon="hugeicons:note-edit" className="w-6 h-6 mr-2" />
                          {section === "corporate" ? "ข้อมูลนิติบุคคล" : section === "employee" ? "ข้อมูลบุคลากร" : "ที่อยู่"}
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-2">
                      {items.map(it => (
                        <div key={it.id}>
                          {it.id}. {it.name}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })
            )
          )}
        </div>
        <DialogFooter className="pt-7 flex justify-center">
          <Button variant="soft" onClick={onClose}>
            รับทราบ, ปิด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestEditDialog;
