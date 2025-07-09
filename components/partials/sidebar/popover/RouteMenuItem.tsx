// components/sidebar/RouteMenuItem.tsx
"use client";
import React, { useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { cn, isLocationMatch, translate, getDynamicPath } from "@/lib/utils";

export interface RouteMenuItemProps {
  title: string;
  href: string;
  icon?: string | null;
  badge?: string | number;
  collapsed?: boolean;           // icon-only mode?
  trans: Record<string, string>;
  className?: string;            // margin/indent ตามระดับ
}

export default function RouteMenuItem({
  title,
  href,
  icon,
  badge,
  collapsed = false,
  trans,
  className = "",
}: RouteMenuItemProps) {
  /* route helpers */
  const pathname = usePathname();
  const location = getDynamicPath(pathname);
  const isActive = isLocationMatch(href, location);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isPending) return;
      startTransition(() => router.push(href));
    },
    [href, router, isPending]
  );

  const active = "bg-primary text-primary-foreground";
  const idle   = "text-default-600 hover:bg-primary-100 hover:text-primary";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        collapsed
          ? "relative inline-flex h-10 w-10 items-center justify-center rounded-md"
          : "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium capitalize",
        isActive ? active : idle,
        { "cursor-wait": isPending },
        className
      )}
    >
      {icon && <Icon icon={icon} className={collapsed ? "h-5 w-5" : "h-4 w-4"} />}
      {!collapsed && (
        <span className="flex-1 truncate capitalize">{translate(title, trans)}</span>
      )}
      {!collapsed && badge && (
        <span className="rounded bg-muted px-2 text-xs">{badge}</span>
      )}
      {isPending && (
        <Loader2 className={cn("animate-spin", collapsed ? "absolute h-4 w-4" : "h-4 w-4")} />
      )}
    </Link>
  );
}
