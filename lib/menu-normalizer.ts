// lib/menu-normalizer.ts
export interface MenuItem {
  title: string;
  icon?: string | null;
  href?: string;
  isHeader?: boolean;
  child?: MenuItem[];          // 1st-level children  (sub-menu)
  multi_menu?: MenuItem[];     // 2nd-level children  (third-menu)
}

/** แปลง property `nested` → `multi_menu` แบบ recursive */
export const normalizeMenus = (list: any[] = []): MenuItem[] =>
  list.map((raw) => {
    const {
      nested,            // ← อาจมีหรือไม่มีก็ได้
      multi_menu,
      child,
      ...rest
    } = raw;

    return {
      ...rest,
      child: child ? normalizeMenus(child) : undefined,
      multi_menu: multi_menu
        ? normalizeMenus(multi_menu)
        : nested
        ? normalizeMenus(nested)
        : undefined,
    };
  });
