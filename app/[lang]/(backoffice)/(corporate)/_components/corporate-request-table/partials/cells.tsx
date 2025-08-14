import { useRouter } from "next/navigation";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface Props {
  updateDate: string;
  updateUser: number | null | string | undefined; // Update the type here
}

const formatThaiDateTime = (value?: string | Date) => {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok", // ให้ชัดเจนเวลาไทย
  }).format(d);
};
export function UpdatedCell({ updateDate, updateUser }: Props) {
  return (
    <div className="text-center font-medium">
      <div className="text-xs text-muted-foreground">{updateUser || "—"}</div>
      <div className="text-sm">{formatThaiDateTime(updateDate)}</div>
    </div>
  );
}
/* ── Action Cell ───────────────────────────── */
export const ActionCell = ({ corporate }: { corporate: CorporateRequest }) => {
  const { setMode, deleteCorporateRequest } = useCorporateStore();
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon"
        onClick={() => {
          setMode(corporate.requestStatus === 1 ? "edit" : "view");
          router.push(`/corporate-request/${corporate.id}`);
        }}
        color={corporate.requestStatus === 1 ? "warning" : "info"}
        variant="soft"
      >
        <Icon icon={corporate.requestStatus === 1 ? "hugeicons:pencil-edit-01" : "fluent:eye-24-filled"} width="24" height="24" />
      </Button>
    </div>
  );
};
