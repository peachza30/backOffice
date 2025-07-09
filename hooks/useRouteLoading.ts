// hooks/useRouteLoading.ts
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const useRouteLoading = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const safePush = (href: string) => {
    startTransition(() => router.push(href));
  };

  return { safePush, isPending };
};