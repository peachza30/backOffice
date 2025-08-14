"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { data } from "./data";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

interface RequestEditDialogProps {
  open: boolean;
  onClose?: () => void;
}

const RequestEditDialog: React.FC<RequestEditDialogProps> = ({ open, onClose }) => {
  const { request, loading, fetchRequestEditList } = useCorporateStore();
  const editList = request?.edit_list || [];

  useEffect(() => {
    if (request) {
      fetchRequestEditList();
    }
  }, [request, fetchRequestEditList]);

  useEffect(() => {
    if (!loading) console.log("editList", editList);
  }, []);

  useEffect(() => {
    console.log("request", request);
  }, [request]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="full" className="w-full max-w-7xl h-[85vh] flex flex-col gap-3 pl-14 pr-14 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">รายละเอียดคำขอเปลี่ยนแปลงข้อมูลนิติบุคคล</DialogTitle>
        </DialogHeader>
        {/* 
        <div className="flex-1 overflow-y-auto mt-3 space-y-3">
          {!editList ? (
            <p className="text-center text-sm text-muted-foreground">— ไม่พบข้อมูล —</p>
          ) : (
            editList.map((item, idx) => (
              <Card key={idx} className="bg-white hover:shadow-sm transition-shadow duration-300 border-2 border-blue-50">
                <div key={item.type}>
                  <CardHeader className="bg-blue-50/40">
                    <CardTitle className="text-lg font-semibold">
                      <div className="flex items-center">
                        <Icon icon="hugeicons:note-edit" className="w-6 h-6 mr-2" />
                        {item.label}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  {item.details.changes && item.details.changes.length > 0 && (
                    <CardContent className="flex flex-col gap-2">
                      {item.changes.map(change => (
                        <div key={change.id}>
                          {change.id}. {change.name}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </div>
              </Card>
            ))
          )}
        </div> */}

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
