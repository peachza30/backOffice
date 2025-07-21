// components/sidebar/SingleMenuItem.tsx
"use client";
import React, { useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

import { Badge } from "@/components/ui/badge";
import { cn, isLocationMatch, translate, getDynamicPath } from "@/lib/utils";

/* ------------------------------------------------------------------ */
type MenuItem = {
  title: string;
  href: string;
  icon?: string | null;
  badge?: string | number;
};

interface Props {
  item: any;
  collapsed: boolean;
  trans: any;
}

/* ------------------------------------------------------------------ */
const SingleMenuItem: React.FC<Props> = ({ item, collapsed, trans }) => {
  const { badge, href, title, icon } = item;

  /* —— route helpers ——————————————————————————————— */
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const isActive = isLocationMatch(href, locationName);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // ปิดการทำงาน native ของ <a> เพื่อใช้ startTransition
      e.preventDefault();
      if (isPending || !href) return;
      startTransition(() => router.push(href));
    },
    [href, router, isPending]
  );

  /* —— style preset ——————————————————————————————— */
  const activeCls = "bg-primary text-primary-foreground";
  const idleCls = "text-default-600 hover:bg-primary-100 hover:text-primary";

  /* ==================================================================
     COLLAPSED  (แสดงแค่ไอคอน + Tooltip)
  ===================================================================*/
  if (collapsed) {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Link href={href} legacyBehavior passHref>
              <a onClick={handleClick} className={cn("relative inline-flex h-12 w-12 items-center justify-center rounded-md transition-colors", isActive ? activeCls : idleCls, { "cursor-wait": isPending })}>
                {icon && <Icon icon={icon} className="h-6 w-6" />}
                {isPending && (
                  <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin" />
                )}
              </a>
            </Link>
          </Tooltip.Trigger>

          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={5}
              collisionPadding={10}
              className="z-50 rounded-md bg-primary px-[15px] py-[10px] text-[15px] text-primary-foreground shadow-sm
                         data-[side=right]:animate-slideLeftAndFade"
            >
              {translate(title, trans)}
              <Tooltip.Arrow className="fill-primary" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  /* ==================================================================
     EXPANDED  (แสดงไอคอน + ชื่อเมนู)
  ===================================================================*/
  return (
    <Link href={href} legacyBehavior passHref>
      <a onClick={handleClick} className={cn("flex items-center gap-3 rounded px-[10px] py-3 text-sm font-medium capitalize transition-colors", isActive ? activeCls : idleCls, { "cursor-wait": isPending })}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon && <Icon icon={icon} className="h-5 w-5" />}

        <span className="flex-1 truncate capitalize">{translate(title, trans)}</span>
        {badge && <Badge>{badge}</Badge>}
      </a>
    </Link>
  );
};

export default SingleMenuItem;
