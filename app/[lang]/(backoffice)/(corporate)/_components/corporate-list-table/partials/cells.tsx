import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../../dialog/confirm-dialog";
import SuccessDialog from "../../dialog/success-dialog";
import { useUserStore } from "@/store/users/useUserStore";

export const LastModifiedCell = ({ corporate }: { corporate: CorporateList }) => {
  const { usersById } = useUserStore();
  const updatedAt = corporate.updated_at ?? corporate.created_at;
  const updatedBy = corporate.updated_by ?? corporate.created_by;
  const user = updatedBy ? usersById[updatedBy] : null;
  const userName = user ? `${user.first_name}.${user.last_name?.slice(0, 2)}` : "None Editor";

  return (
    <div className="text-center font-medium">
      <div className="text-xs text-muted-foreground">{userName}</div>
      <div className="text-sm">
        {/* {new Intl.DateTimeFormat("th-TH", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date(updatedAt))} */}
      </div>
    </div>
  );
};

/* ── Action Cell ───────────────────────────── */
export const ActionCell = ({ corporate }: { corporate: CorporateList }) => {
  const { setMode, deleteCorporateList } = useCorporateStore();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const confirmDialogConfig = {
    title: "Confirm Delete Service?",
    icon: "stash:question",
    class: "destructive",
    color: "#EF4444",
    body: "Do you want to delete this service?",
    sub: "Deleting this item is irreversible. Are you sure you want to continue?",
    confirmButton: "Yes, Delete",
    cancelButton: "Cancel",
  } as const;

  const successDialogConfig = {
    icon: "solar:verified-check-outline",
    body: "Delete service successfully.",
    color: "#22C55E",
  } as const;

  const handleConfirm = () => {
    setOpenSuccessModal(true);
    setOpenModal(false);
    deleteCorporateList(corporate.id, {
      search: "",
      status: "",
      page: 1,
      limit: 10,
      sort: "created_at",
      order: "DESC",
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {openModal && <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={confirmDialogConfig} />}
      {openSuccessModal && <SuccessDialog open={openSuccessModal} onOpenChange={setOpenSuccessModal} dialogConfig={successDialogConfig} />}
      <Button
        size="icon"
        onClick={() => {
          setMode("view");
          router.push(`/corporate-list/${corporate.id}`);
        }}
        color="info"
        variant="soft"
      >
        <Icon icon="fluent:eye-24-filled" width="24" height="24" />
      </Button>
      {/* <p className="p-1 text-gray-300">|</p>
      <Button
        size="icon"
        onClick={() => {
          setMode("edit");
          router.push(`/corporate/corporate-id/${corporate.id}`);
        }}
        color="warning"
        variant="soft"
      >
        <Icon icon="hugeicons:pencil-edit-01" width="24" height="24" />
      </Button>
      <p className="p-1 text-gray-300">|</p>
      <Card>
        <Button size="icon" onClick={() => setOpenModal(true)} color="destructive" variant="soft">
          <Icon icon="hugeicons:delete-02" width="24" height="24" />
        </Button>
      </Card> */}
    </div>
  );
};