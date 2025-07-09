interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  dialogConfig: {
    title?: string;
    icon?: string;
    class?: "primary" | "default" | "destructive" | "success" | "info" | "warning" | "secondary" | "dark";
    color?: string;
    size?: "sm" | "md" | "lg" | "xl";
    body?: string;
    sub?: string;
    confirmButton?: string | "Confirm";
    cancelButton?: string | "Cancel";
  };
}