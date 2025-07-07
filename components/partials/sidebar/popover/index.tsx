"use client";
import React, { useEffect, useState, useMemo } from "react";
import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import SidebarLogo from "../common/logo";
import MenuLabel from "../common/menu-label";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSidebar, useThemeStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useProfileStore } from "@/store/profile/useProfileStore";
import { getMenu } from "@/config/menus";
import { useMenuStore } from "@/store/menu/useMenuStore";
const PopoverSidebar = ({ trans, menusConfig }: { trans: string; menusConfig: any }) => {
  const { collapsed, sidebarBg } = useSidebar();
  const { layout, isRtl } = useThemeStore();
  // const { profile, fetchProfile } = useProfileStore();
  // const { menus, getMenus } = useMenuStore();
  // const menusList = menusConfig?.sidebarNav?.classic || [];
  const menusList = useMemo(() => menusConfig?.sidebarNav?.classic || [], [menusConfig]);

  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);

  const toggleSubmenu = (i: number) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex: number) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  // PopoverSidebar.tsx
  useEffect(() => {
    let subMenuIndex: number | null = null;
    let multiMenuIndex: number | null = null;

    outer: for (let i = 0; i < menusList.length; i++) {
      const item = menusList[i];
      if (!item.child) continue;

      for (let j = 0; j < item.child.length; j++) {
        const child = item.child[j];

        // ⬇️ ตรงเมนูชั้น 2
        if (isLocationMatch(child.href, locationName)) {
          subMenuIndex = i;
          break outer;
        }

        // ⬇️ ตรงเมนูชั้น 3
        if (child.multi_menu) {
          for (const multi of child.multi_menu) {
            if (isLocationMatch(multi.href, locationName)) {
              subMenuIndex = i;
              multiMenuIndex = j;
              break outer;
            }
          }
        }
      }
    }

    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
  }, [locationName, menusList]);

  return (
    <div
      className={cn("fixed  top-0  border-r  ", {
        "w-[248px]": !collapsed,
        "w-[72px]": collapsed,
        "m-6 bottom-0   bg-card rounded-md": layout === "semibox",
        "h-full   bg-card ": layout !== "semibox",
      })}
    >
      {sidebarBg !== "none" && <div className=" absolute left-0 top-0   z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]" style={{ backgroundImage: `url(${sidebarBg})` }}></div>}
      <SidebarLogo />
      <Separator />
      <ScrollArea
        className={cn("sidebar-menu  h-[calc(100%-80px)] ", {
          "px-4": !collapsed,
        })}
      >
        <ul
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(" space-y-1", {
            " space-y-2 text-center": collapsed,
          })}
        >
          {menusList.map((item, i) => (
            <li key={`menu_key_${i}`}>
              {/* single menu  */}

              {!item.child && !item.isHeader && <SingleMenuItem item={item} collapsed={collapsed} trans={trans} />}

              {/* menu label */}
              {item.isHeader && !item.child && !collapsed && <MenuLabel item={item} trans={trans} />}

              {/* sub menu */}
              {item.child && (
                <>
                  <SubMenuHandler item={item} toggleSubmenu={toggleSubmenu} index={i} activeSubmenu={activeSubmenu} collapsed={collapsed} menuTitle={item.title} trans={trans} />
                  {!collapsed && <NestedSubMenu toggleMultiMenu={toggleMultiMenu} activeMultiMenu={activeMultiMenu} activeSubmenu={activeSubmenu} item={item} index={i} trans={trans} />}
                </>
              )}
            </li>
          ))}
        </ul>
        {!collapsed && <div className="-mx-2 ">{/* <AddBlock /> */}</div>}
      </ScrollArea>
    </div>
  );
};

export default PopoverSidebar;
