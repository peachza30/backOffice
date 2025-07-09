import React, { useCallback, useState, useTransition } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn, isLocationMatch, translate, getDynamicPath } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  subItem: any;
  subIndex: number;
  activeMultiMenu: number | null;
  trans: any;
}

const MultiNestedMenu: React.FC<Props> = ({ subItem, subIndex, activeMultiMenu, trans }) => {
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /** เก็บ href ปัจจุบันที่คลิก เพื่อแสดง Loader เฉพาะรายการนั้น */
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  /** curry ด้วย href ของลิงก์นั้น ๆ */
  const handleClick = useCallback(
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isPending || !href) return;
      setClickedHref(href); // จำลิงก์ที่ถูกคลิก
      startTransition(() => router.push(href));
    },
    [router, isPending]
  );

  return (
    <Collapsible open={activeMultiMenu === subIndex}>
      <CollapsibleContent className="CollapsibleContent">
        <ul className="space-y-3 pl-1">
          {subItem?.multi_menu?.map((item: any, i: number) => {
            const href = item.href;
            const active = isLocationMatch(href, locationName);

            return (
              // ➊ กำหนด relative เพื่อวาง Loader แบบ absolute
              <li className="relative first:pt-3" key={i}>
                <Link href={href} onClick={handleClick(href)}>
                  <span
                    className={cn("text-sm flex gap-3 items-center transition-all duration-150 capitalize hover:text-primary", {
                      "text-primary": active,
                      "text-default-600": !active,
                    })}
                  >
                    {isPending && clickedHref === href ? (
                      <Loader2 className="inline-flex rounded-full inset-0 m-auto h-3 w-3 animate-spin" />
                    ) : (
                      <span
                        className={cn("inline-flex h-3 w-3 border border-default-500 rounded-full", {
                          "bg-primary ring-primary/30 ring-[4px] border-primary": active,
                        })}
                      />
                    )}

                    <span className="flex-1">{translate(item.title, trans)}</span>
                  </span>
                </Link>

                {/* ➋ แสดง Loader เฉพาะรายการที่กำลัง transition */}
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MultiNestedMenu;
