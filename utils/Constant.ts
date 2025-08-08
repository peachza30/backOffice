export const MODAL_BODY_TYPES = {
  CONFIRMATION: 'CONFIRMATION',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
};
export const CONFIRMATION_MODAL_CLOSE_TYPES = {
  DELETE_USER: 'DELETE_USER',
};


const MAX_VISIBLE_PAGES = 5;

export function formatCurrency(
  value: number | string,
  locale = "th-TH",
  currency: string | undefined = "THB",
  fraction: number = 2
): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num)) return "-";

  return new Intl.NumberFormat(locale, {
    // style: currency ? "currency" : "decimal",
    currency,
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(num);
}

export function toBuddhistDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const yearBE = d.getFullYear() + 543;
  return `${day}/${month}/${yearBE}`;
}

export function getPaginationRange(currentPage: number, totalPages: number) {
  const range: (number | "...")[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 0; i < totalPages; i++) range.push(i);
  } else {
    const left = Math.max(currentPage - 1, 1);
    const right = Math.min(currentPage + 1, totalPages - 2);

    range.push(0); // first page

    if (left > 1) range.push("...");

    for (let i = left; i <= right; i++) range.push(i);

    if (right < totalPages - 2) range.push("...");

    range.push(totalPages - 1); // last page
  }

  return range;
}


export function mapMenuHierarchy(flatMenus: MenuItem[]): MenuItem[] {
  const menuMap: Record<number, MenuItem> = {};
  const roots: MenuItem[] = [];

  // Step 1: Build map of all menu items
  flatMenus.forEach(menu => {
    menuMap[menu.id] = { ...menu, children: [] };
  });

  // Step 2: Attach children to parents
  flatMenus.forEach(menu => {
    if (menu.parent_id !== 0) {
      const parent = menuMap[menu.parent_id];
      if (parent) {
        parent.children!.push(menuMap[menu.id]);
      }
    } else {
      roots.push(menuMap[menu.id]);
    }
  });

  return roots;
}

export const syncParentPermissions = (items: PermissionItem[]): PermissionItem[] => {
  return items.map(item => {
    if (item.children && item.children.length > 0) {
      const syncedChildren = syncParentPermissions(item.children);

      const aggregatedPermissions = {
        can_create: syncedChildren.some(child => child.permissions.can_create),
        can_read: syncedChildren.some(child => child.permissions.can_read),
        can_update: syncedChildren.some(child => child.permissions.can_update),
        can_delete: syncedChildren.some(child => child.permissions.can_delete)
      };

      return {
        ...item,
        permissions: {
          ...item.permissions,
          ...aggregatedPermissions
        },
        children: syncedChildren
      };
    }
    return item;
  });
};


