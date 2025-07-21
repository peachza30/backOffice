// components/sidebar/SubMenuHandler.tsx
"use client";

import React, { useCallback } from "react";
import { Icon } from "@iconify/react";
import * as HoverCard from "@radix-ui/react-hover-card";

import { cn, translate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import CollapsedHoverMenu from "./collapsed-hover-menu";

/* ── Types ──────────────────────────────────────────────── */
export interface MenuItem {
  title: string;
  icon?: string | null;
  child?: MenuItem[];
  multi_menu?: MenuItem[];
}

interface Props {
  item: MenuItem;
  index: number;
  activeSubmenu: number | null;
  collapsed: boolean;
  menuTitle?: string;
  trans: any;
  toggleSubmenu: (i: number) => void;
}

/* ── Component ──────────────────────────────────────────── */
const SubMenuHandler: React.FC<Props> = ({ item, index, activeSubmenu, collapsed, menuTitle, trans, toggleSubmenu }) => {
  const { title, icon, child = [] } = item;
  const isActive = activeSubmenu === index;

  /* click handler (expanded sidebar) */
  const handleClick = useCallback(() => {
    toggleSubmenu(index);
  }, [toggleSubmenu, index]);

  /* =======================================================
     COLLAPSED — HoverCard with icon only
  ======================================================= */
  if (collapsed) {
    const hasLongList = child.length > 5 || child.some(c => c.multi_menu && c.multi_menu.length > 5);

    return (
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <div
            className={cn("inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-md transition-colors", "data-[state=open]:bg-primary-100 data-[state=open]:text-primary", {
              /* highlight menu that matches current route */
              "bg-primary text-primary-foreground": isActive,
              "text-default-600 hover:bg-primary-100 hover:text-primary": !isActive,
            })}
          >
            {icon && <Icon icon={icon} className="h-6 w-6" />}
          </div>
        </HoverCard.Trigger>

        <HoverCard.Portal>
          <HoverCard.Content
            side="right"
            sideOffset={5}
            collisionPadding={70}
            className="z-50 w-[300px] rounded-md bg-popover shadow-sm
                       data-[side=right]:animate-slideLeftAndFade
                       data-[state=open]:transition-all"
          >
            <ScrollArea className={cn("p-5", { "h-[250px]": hasLongList })}>
              <CollapsedHoverMenu item={item} menuTitle={menuTitle} trans={trans} />
            </ScrollArea>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    );
  }

  /* =======================================================
     EXPANDED — full row with caret
  ======================================================= */
  return (
    <div
      onClick={handleClick}
      className={cn("group flex cursor-pointer items-start gap-3 rounded px-[10px] py-3 text-sm font-medium capitalize transition-all duration-100", {
        "bg-primary text-primary-foreground": isActive,
        "text-default-700 hover:bg-primary hover:text-primary-foreground": !isActive,
      })}
    >
      {/* icon + title */}
      <span className="text-lg">{icon && <Icon icon={icon} className="h-5 w-5" />}</span>
      <span className="flex-1">{translate(title, trans)}</span>

      {/* caret */}
      <span
        className={cn("flex items-center justify-center text-base transition-transform duration-300 group-hover:text-primary-foreground", {
          "rotate-90": isActive,
          "text-default-500": !isActive,
        })}
      >
        <Icon icon="heroicons:chevron-right-20-solid" className="h-5 w-5" />
      </span>
    </div>
  );
};

export default SubMenuHandler;
