// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex items-center justify-center h-dvh w-full">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
