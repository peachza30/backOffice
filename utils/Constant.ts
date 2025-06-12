export const MODAL_BODY_TYPES = {
  CONFIRMATION: 'CONFIRMATION',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
};
export const CONFIRMATION_MODAL_CLOSE_TYPES = {
  DELETE_USER: 'DELETE_USER',
};

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