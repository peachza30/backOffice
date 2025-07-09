"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

import SidebarLogo from "../common/logo";
import MenuLabel from "../common/menu-label";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar, useThemeStore } from "@/store";

import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import { normalizeMenus, MenuItem } from "@/lib/menu-normalizer"; // 🔄  NEW

/* -------------------------------------------------------------------- */
interface Props {
  trans: Record<string, string>;
  menusConfig: any;
}

const PopoverSidebar: React.FC<Props> = ({ trans, menusConfig }) => {
  /* ── UI stores ─────────────────────────────────────────── */
  const { collapsed, sidebarBg } = useSidebar();
  const { layout, isRtl } = useThemeStore();

  /* ── Build menu list (normalize nested / multi_menu) ───── */
  const rawMenus = menusConfig?.sidebarNav?.classic || [];
  const menusList = useMemo<MenuItem[]>(() => normalizeMenus(rawMenus), [rawMenus]);

  /* ── Active states ─────────────────────────────────────── */
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setActiveMulti] = useState<number | null>(null);

  const toggleSubmenu = useCallback((i: number) => setActiveSubmenu(prev => (prev === i ? null : i)), []);
  const toggleMultiMenu = useCallback((j: number) => setActiveMulti(prev => (prev === j ? null : j)), []);

  /* ── Detect current path to highlight menu ─────────────── */
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  useEffect(() => {
    let subIdx: number | null = null;
    let multiIdx: number | null = null;

    outer: for (let i = 0; i < menusList.length; i++) {
      const it = menusList[i];
      if (!it.child) continue;

      for (let j = 0; j < it.child.length; j++) {
        const child = it.child[j];

        if (isLocationMatch(child.href, locationName)) {
          subIdx = i;
          break outer;
        }
        if (child.multi_menu) {
          for (const leaf of child.multi_menu) {
            if (isLocationMatch(leaf.href, locationName)) {
              subIdx = i;
              multiIdx = j;
              break outer;
            }
          }
        }
      }
    }
    setActiveSubmenu(subIdx);
    setActiveMulti(multiIdx);
  }, [locationName, menusList]);

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div
      className={cn("fixed top-0 border-r", {
        "w-[248px]": !collapsed,
        "w-[72px]": collapsed,
        "m-6 bottom-0 bg-card rounded-md": layout === "semibox",
        "h-full bg-card": layout !== "semibox",
      })}
    >
      {sidebarBg !== "none" && <div className="absolute left-0 top-0 z-[-1] h-full w-full bg-cover bg-center opacity-[0.07]" style={{ backgroundImage: `url(${sidebarBg})` }} />}

      <SidebarLogo />
      <Separator />

      <ScrollArea
        className={cn("sidebar-menu h-[calc(100%-80px)]", {
          "px-4": !collapsed,
        })}
      >
        <ul
          dir={isRtl ? "rtl" : "ltr"}
          className={cn("space-y-1", {
            "text-center space-y-2": collapsed,
          })}
        >
          {menusList.map((item, i) => (
            <li key={item.title ?? i}>
              {/* ── Single (leaf) ───────────────────────── */}
              {!item.child && !item.isHeader && <SingleMenuItem item={item} collapsed={collapsed} trans={trans} />}

              {/* ── Section label ──────────────────────── */}
              {item.isHeader && !item.child && !collapsed && <MenuLabel item={item} trans={trans} />}

              {/* ── Menu with submenu ──────────────────── */}
              {item.child && (
                <>
                  <SubMenuHandler item={item} index={i} collapsed={collapsed} activeSubmenu={activeSubmenu} toggleSubmenu={toggleSubmenu} menuTitle={item.title} trans={trans} />
                  {!collapsed && <NestedSubMenu item={item} index={i} activeSubmenu={activeSubmenu} activeMultiMenu={activeMultiMenu} toggleMultiMenu={toggleMultiMenu} trans={trans} />}
                </>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default PopoverSidebar;
