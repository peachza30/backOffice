"use client";
import React, { useEffect, useState } from "react";
import { cn, isLocationMatch } from "@/lib/utils";
import { useSidebar } from "@/store";
import SidebarLogo from "../common/logo";
import MenuLabel from "../common/menu-label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";

const MobileSidebar = ({ className, trans, menusConfig }: { className?: string; trans: any; menusConfig: any }) => {
  const { sidebarBg, mobileMenu, setMobileMenu, collapsed } = useSidebar();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);
  const [menusList, setMenusList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locationName = usePathname();

  // BEFORE using menusConfig

  useEffect(() => {
    if (!menusConfig) return; // stop, but **return nothing**
    setMenusList(menusConfig.sidebarNav?.classic ?? []);
    setLoading(false); // hide skeleton
  }, [menusConfig]);

  const toggleSubmenu = (i: number) => {
    setActiveSubmenu(prev => (prev === i ? null : i));
  };

  const toggleMultiMenu = (subIndex: number) => {
    setMultiMenu(prev => (prev === subIndex ? null : subIndex));
  };

  // Automatically expand menus that match the current path
  useEffect(() => {
    if (!menusList.length) return;
    let subMenuIndex: number | null = null;
    let multiMenuIndex: number | null = null;

    menusList.forEach((item: any, i: number) => {
      if (item?.child) {
        item.child.forEach((childItem: any, j: number) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
          }
          if (childItem?.multi_menu) {
            childItem.multi_menu.forEach((multiItem: any, k: number) => {
              if (isLocationMatch(multiItem.href, locationName)) {
                subMenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      } else if (isLocationMatch(item.href, locationName)) {
        subMenuIndex = null;
        multiMenuIndex = null;
      }
    });

    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [locationName]);
  if (loading) return;
  return (
    <>
      <div
        className={cn("fixed top-0 bg-card h-full w-[248px] z-[9999]", className, {
          "-left-[300px] invisible opacity-0": !mobileMenu,
          "left-0 visible opacity-100": mobileMenu,
        })}
      >
        {sidebarBg !== "none" && <div className="absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]" style={{ backgroundImage: `url(${sidebarBg})` }} />}
        <SidebarLogo hovered={collapsed} />
        <ScrollArea className={cn("sidebar-menu h-[calc(100%-80px)]", { "px-4": !collapsed })}>
          <ul className={cn("", { "space-y-2 text-center": collapsed })}>
            {menusList.map((item: any, i: number) => (
              <li key={`menu_item_${i}`}>
                {/* Menu Header */}
                {item.isHeader && !item.child && !collapsed && <MenuLabel item={item} trans={trans} />}

                {/* Single Menu Item */}
                {!item.child && !item.isHeader && <SingleMenuItem item={item} collapsed={collapsed} />}
                {/* Submenu with or without MultiMenu */}
                {item.child && (
                  <>
                    <SubMenuHandler item={item} toggleSubmenu={toggleSubmenu} index={i} activeSubmenu={activeSubmenu} collapsed={collapsed} />
                    {!collapsed && <NestedSubMenu item={item} index={i} toggleMultiMenu={toggleMultiMenu} activeSubmenu={activeSubmenu} activeMultiMenu={activeMultiMenu} title={""} trans={trans} />}
                  </>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      {mobileMenu && <div onClick={() => setMobileMenu(false)} className="overlay bg-black/60 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]" />}
    </>
  );
};

export default MobileSidebar;
