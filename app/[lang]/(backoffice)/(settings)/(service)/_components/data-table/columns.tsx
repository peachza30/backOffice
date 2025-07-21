import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../dialog/confirm-dialog";
import SuccessDialog from "../dialog/success-dialog";
import { Card } from "../ui/card";
import { useServiceStore } from "@/store/service/useServiceStore";
import { useUserStore } from "@/store/users/useUserStore";
import { useState } from "react";

/* ── Helper Components ───────────────────────────────────────── */
const LastModifiedCell = ({ service }: { service: Service }) => {
  const { usersById } = useUserStore();
  const updatedAt = service.updated_at ?? service.created_at;
  const updatedBy = service.updated_by ?? service.created_by;
  const user = updatedBy ? usersById[updatedBy] : null;
  const userName = user ? `${user.first_name}.${user.last_name?.slice(0, 2)}` : "None Editor";

  return (
    <div className="text-center font-medium">
      <div className="text-xs text-muted-foreground">{userName}</div>
      <div className="text-sm">
        {new Intl.DateTimeFormat("th-TH", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date(updatedAt))}
      </div>
    </div>
  );
};

const ServiceActionCell = ({ service }: { service: Service }) => {
  const { setMode, deleteService } = useServiceStore();
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
    deleteService(service.id, {
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
      {openModal && (
        <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={confirmDialogConfig} />
      )}
      {openSuccessModal && (
        <SuccessDialog open={openSuccessModal} onOpenChange={setOpenSuccessModal} dialogConfig={successDialogConfig} />
      )}
      <Button size="icon" onClick={() => { setMode("view"); router.push(`/manage-services/${service.id}`); }} color="info" variant="soft">
        <Icon icon="fluent:eye-24-filled" width="24" height="24" />
      </Button>
      <p className="p-1 text-gray-300">|</p>
      <Button size="icon" onClick={() => { setMode("edit"); router.push(`/manage-services/${service.id}`); }} color="warning" variant="soft">
        <Icon icon="hugeicons:pencil-edit-01" width="24" height="24" />
      </Button>
      <p className="p-1 text-gray-300">|</p>
      <Card>
        <Button size="icon" onClick={() => setOpenModal(true)} color="destructive" variant="soft">
          <Icon icon="hugeicons:delete-02" width="24" height="24" />
        </Button>
      </Card>
    </div>
  );
};

export const serviceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium text-card-foreground/80">{row.original.id}</div>,
  },
  {
    accessorKey: "service_name",
    header: () => <span className="text-sm font-medium">SERVICE NAME</span>,
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("service_name")}</div>,
  },
  {
    accessorKey: "service_code",
    header: () => <span className="text-sm font-medium">SERVICE CODE</span>,
    cell: ({ row }) => <div className="whitespace-nowrap font-medium">{row.getValue("service_code")}</div>,
  },
  {
    accessorKey: "service_description",
    header: "SERVICE DESCRIPTION",
    cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("service_description")}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">STATUS</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-center font-medium">
          <Badge variant="soft" color={status === "A" ? "success" : "destructive"} className="capitalize">
            {status === "A" ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: () => <div className="text-center">LAST MODIFIED</div>,
    cell: ({ row }) => <LastModifiedCell service={row.original} />,
  },
  {
    id: "action",
    enableHiding: false,
    header: () => <div className="text-center">ACTION</div>,
    cell: ({ row }) => <ServiceActionCell service={row.original} />,
  },
];
