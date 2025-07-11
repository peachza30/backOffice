"use client";
import React, { useState, DragEvent, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useMenuStore } from "@/store/menu/useMenuStore";
import { mapMenuHierarchy } from "@/utils/Constant";

const MenuManagement: React.FC = () => {
  const [originalMenus, setOriginalMenus] = useState<MenuItem[]>([]);
  const [menusList, setMenusList] = useState<MenuItem[]>([]);
  const { menus, getMenus } = useMenuStore();
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const [currentDropZone, setCurrentDropZone] = useState<DropZone | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set()); // Default all collapsed
  // const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([2, 3, 6, 9, 12, 18])); // Custom collapsed
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false); // Toggle for reorder mode

  useEffect(() => {
    getMenus({});
  }, []);

  useEffect(() => {
    if (menus.length > 0) {
      setMenusList(mapMenuHierarchy(menus));
      setOriginalMenus(mapMenuHierarchy(menus));
      console.log("menus", menus);
    }
  }, [menus]);

  const toggleExpand = (id: number): void => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // const toggleActive = (id: number): void => {
  //   const updateMenuActive = (items: MenuItem[]): MenuItem[] => {
  //     return items.map(item => {
  //       if (item.id === id) {
  //         return { ...item, status: !item.status };
  //       }
  //       if (item.children && item.children.length > 0) {
  //         return { ...item, children: updateMenuActive(item.children) };
  //       }
  //       return item;
  //     });
  //   };
  //   setMenusList(updateMenuActive(menusList));
  // };
  // Handle Edit action
  const handleEdit = (item: MenuItem): void => {
    console.log("Edit menu:", item);
    alert(`Edit menu: ${item.menu_name}`);
  };

  // Handle View action
  const handleView = (item: MenuItem): void => {
    console.log("View menu:", item);
    alert(`View menu: ${item.menu_name}\nPath: ${item.path}\nID: ${item.id}`);
  };

  // Handle Delete action
  const handleDelete = (item: MenuItem): void => {
    // Check if item has children
    if (item.children && item.children.length > 0) {
      alert(`Cannot delete "${item.menu_name}" because it has ${item.children.length} child menu(s). Please delete all children first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${item.menu_name}"?`)) {
      const deleteMenuItem = (items: MenuItem[]): MenuItem[] => {
        return items.filter(menuItem => {
          if (menuItem.id === item.id) {
            return false;
          }
          if (menuItem.children && menuItem.children.length > 0) {
            menuItem.children = deleteMenuItem(menuItem.children);
          }
          return true;
        });
      };
      
      setMenusList(deleteMenuItem(menusList));
      console.log('Deleted menu:', item);
    }
  };

  // Extract menu item with its children from the tree
  const extractMenuItem = (items: MenuItem[], id: number): { item: MenuItem | null; remaining: MenuItem[] } => {
    let extractedItem: MenuItem | null = null;

    const remaining = items
      .filter(item => {
        if (item.id === id) {
          extractedItem = { ...item };
          return false;
        }
        return true;
      })
      .map(item => {
        if (item.children && item.children.length > 0) {
          const result = extractMenuItem(item.children, id);
          if (result.item) {
            extractedItem = result.item;
          }
          return { ...item, children: result.remaining };
        }
        return item;
      });

    return { item: extractedItem, remaining };
  };

  // Insert menu item at specific position
  const insertMenuItem = (items: MenuItem[], draggedItem: MenuItem, targetId: number | null, position: DropPosition, parentId: number): MenuItem[] => {
    const itemToInsert = { ...draggedItem, parent_id: parentId };

    if (targetId === null && position === "inside") {
      // Insert at root level
      return [...items, itemToInsert];
    }

    if (position === "before" || position === "after") {
      const result: MenuItem[] = [];

      items.forEach(item => {
        if (position === "before" && item.id === targetId) {
          result.push(itemToInsert);
        }

        if (item.children && item.children.length > 0) {
          const updatedChildren = insertMenuItem(item.children, draggedItem, targetId, position, item.id);
          result.push({ ...item, children: updatedChildren });
        } else {
          result.push(item);
        }

        if (position === "after" && item.id === targetId) {
          result.push(itemToInsert);
        }
      });

      return result;
    }

    if (position === "inside") {
      return items.map(item => {
        if (item.id === targetId) {
          const newChildren = [...item.children, { ...itemToInsert, parent_id: item.id }];
          return { ...item, children: newChildren };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: insertMenuItem(item.children, draggedItem, targetId, position, item.id) };
        }
        return item;
      });
    }

    return items;
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: MenuItem): void => {
    if (!isReorderMode) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (): void => {
    setDraggedItem(null);
    setCurrentDropZone(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropZone: DropZone): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem.id === dropZone.targetId) {
      setDraggedItem(null);
      setCurrentDropZone(null);
      return;
    }

    // Extract the dragged item from the tree
    const { item: extractedItem, remaining } = extractMenuItem(menusList, draggedItem.id);

    if (!extractedItem) {
      console.error("Failed to extract item");
      return;
    }

    // Insert the item at the new position
    const updated = insertMenuItem(remaining, extractedItem, dropZone.targetId, dropZone.position, dropZone.parentId);

    setMenusList(updated);

    // Auto-expand parent if dropping inside
    if (dropZone.position === "inside" && dropZone.targetId) {
      setExpandedItems(new Set([...expandedItems, dropZone.targetId]));
    }

    setDraggedItem(null);
    setCurrentDropZone(null);
  };

   const hasItemChanged = (item: MenuItem): boolean => {
    const originalFlat = flattenMenus(menusList);
    const originalItem = originalFlat.find(orig => orig.id === item.id);

    if (!originalItem) return true; // New item

    return (
      originalItem.parent_id !== item.parent_id || 
      originalItem.menu_name !== item.menu_name || 
      originalItem.path !== item.path || 
      originalItem.icon !== item.icon || 
      originalItem.status !== item.status || 
      originalItem.can_create !== item.can_create || 
      originalItem.can_read !== item.can_read || 
      originalItem.can_update !== item.can_update || 
      originalItem.can_delete !== item.can_delete
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0, isLast: boolean = false, parentLines: boolean[] = []): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isDragging = draggedItem?.id === item.id;
    const hasChanged = hasItemChanged(item);

    return (
      <div key={item.id} className={`${isDragging ? "opacity-50" : ""} relative`}>
        {/* render full-height vertical guides */}
        {level > 0 && parentLines.map((drawLine, idx) =>
          drawLine ? (
            <div
              key={idx}
              className="absolute border-l border-gray-300"
              style={{
                left: `${idx * 24 + 32 + 12}px`,
                top: 0,
                bottom: 0,
              }}
            />
          ) : null
        )}

        {/* Drop zone before */}
        {isReorderMode && (
          <div
            className={`transition-all ${
              currentDropZone?.targetId === item.id && currentDropZone?.position === "before" 
                ? "h-1 bg-blue-400" 
                : "h-0 hover:h-2 hover:bg-blue-100"
            }`}
            style={{ marginLeft: `${level * 24 + 32}px` }}
            onDragOver={e => {
              e.preventDefault();
              setCurrentDropZone({ targetId: item.id, position: "before", parentId: item.parent_id });
            }}
            onDragLeave={() => setCurrentDropZone(null)}
            onDrop={e => handleDrop(e, { targetId: item.id, position: "before", parentId: item.parent_id })}
          />
        )}

        {/* Menu item */}
        <div
          // hover:bg-gray-50
          className={`
            flex items-center justify-between py-3 px-4 hover:bg-gray-50 relative z-10
            ${isReorderMode ? 'cursor-move' : 'cursor-pointer'}
            ${currentDropZone?.targetId === item.id && currentDropZone?.position === "inside" 
              ? "bg-blue-50 border-2 border-blue-400 border-dashed" 
              : ""
            }
            ${hasChanged && isReorderMode ? 'bg-amber-50 border-l-4 border-amber-400' : ''}
          `}
          style={{ paddingLeft: `${level * 24 + 32}px` }}
          draggable={isReorderMode}
          onDragStart={e => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={e => {
            if (isReorderMode) {
              e.preventDefault();
              setCurrentDropZone({ targetId: item.id, position: "inside", parentId: item.id });
            }
          }}
          onDragLeave={e => {
            e.stopPropagation();
            setCurrentDropZone(null);
          }}
          onDrop={e => isReorderMode && handleDrop(e, { targetId: item.id, position: "inside", parentId: item.id })}
          onClick={() => !isReorderMode && hasChildren && toggleExpand(item.id)}
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Only show drag handle in reorder mode */}
            {isReorderMode && (
              <GripVertical className="w-5 h-5 text-gray-400" />
            )}
            
            {hasChildren ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }} 
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <Icon icon="solar:alt-arrow-down-line-duotone" className="w-4 h-4 text-gray-600" width="24" height="24" />
                ) : (
                  <Icon icon="solar:alt-arrow-right-line-duotone" className="w-4 h-4 text-gray-600" width="24" height="24" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            {item.icon && <Icon icon={item.icon} className="w-5 h-5 text-gray-600" />}

            <span className="text-gray-700 font-medium">{item.menu_name}</span>
            {/* Show status badge next to name in normal mode */}
            {!isReorderMode && (
              <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded ${
                item.status === "A" 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-orange-600 bg-orange-50'
              }`}>
                {item.status === "A" ? 'ACTIVE' : 'INACTIVE'}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(item);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item);
              }}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
              className={`p-1.5 rounded transition-colors ${
                item.children && item.children.length > 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-red-600 hover:bg-red-50'
              }`}
              title={item.children && item.children.length > 0 
                ? 'Cannot delete parent with children' 
                : 'Delete'
              }
              disabled={item.children && item.children.length > 0}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drop zone after (if no expanded children) */}
        {isReorderMode && (!hasChildren || !isExpanded) && (
          <div
            className={`relative transition-all ${
              currentDropZone?.targetId === item.id && currentDropZone?.position === "after" 
                ? "h-1 bg-blue-400" 
                : "h-0 hover:h-2 hover:bg-blue-100"
            }`}
            style={{ marginLeft: `${level * 24 + 32}px` }}
            onDragOver={e => {
              e.preventDefault();
              setCurrentDropZone({ targetId: item.id, position: "after", parentId: item.parent_id });
            }}
            onDragLeave={() => setCurrentDropZone(null)}
            onDrop={e => handleDrop(e, { targetId: item.id, position: "after", parentId: item.parent_id })}
          />
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {/* draw one continuous line per level in parentLines */}
            {level > 0 && parentLines.map((draw, idx) =>
              draw ? (
                <div
                  key={idx}
                  className="absolute border-l border-gray-300"
                  style={{
                    left: `${idx * 24 + 56 + 12}px`,
                    top: 0,
                    bottom: 0,
                  }}
                />
              ) : null
            )}
            {item.children.map((child: MenuItem, index: number) => {
              const newParentLines = [...parentLines];
              if (level >= 0) {
                newParentLines[level] = index < item.children.length - 1;
              }
              return renderMenuItem(child, level + 1, index === item.children.length - 1, newParentLines);
            })}
            {/* Drop zone at end of children */}
            {isReorderMode && (
              <div
                className={`relative transition-all ${
                  currentDropZone?.targetId === item.id && 
                  currentDropZone?.position === 'after' && 
                  currentDropZone?.parentId === item.id
                    ? 'h-1 bg-blue-400' 
                    : 'h-0 hover:h-2 hover:bg-blue-100'
                }`}
                style={{ marginLeft: `${(level + 1) * 24 + 32}px` }}
                onDragOver={e => {
                  e.preventDefault();
                  setCurrentDropZone({ targetId: item.id, position: "after", parentId: item.parent_id });
                }}
                onDragLeave={() => setCurrentDropZone(null)}
                onDrop={e => handleDrop(e, { targetId: item.id, position: "after", parentId: item.parent_id })}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const flattenMenus = (items: MenuItem[], result: MenuItem[] = []): MenuItem[] => {
    items.forEach(item => {
      result.push({
        id: item.id,
        menu_name: item.menu_name,
        parent_id: item.parent_id,
        icon: item.icon,
        path: item.path,
        can_create: item.can_create,
        can_read: item.can_read,
        can_update: item.can_update,
        can_delete: item.can_delete,
        status: item.status,
        active: item.active || false,
        children: [], // We don't need children in flattened structure
      });
      if (item.children && item.children.length > 0) {
        flattenMenus(item.children, result);
      }
    });
    return result;
  };

  const compareMenus = (original: MenuItem[], current: MenuItem[]): any[] => {
    const originalFlat = flattenMenus(original);
    const currentFlat = flattenMenus(current);
    const changes: any[] = [];

    currentFlat.forEach(currentItem => {
      const originalItem = originalFlat.find(item => item.id === currentItem.id);

      if (originalItem) {
        const changedFields: any = {};
        let hasChanges = false;

        // Check each field for changes
        if (originalItem.menu_name !== currentItem.menu_name) {
          changedFields.menu_name = currentItem.menu_name;
          hasChanges = true;
        }
        if (originalItem.parent_id !== currentItem.parent_id) {
          changedFields.parent_id = currentItem.parent_id;
          hasChanges = true;
        }
        if (originalItem.path !== currentItem.path) {
          changedFields.path = currentItem.path;
          hasChanges = true;
        }
        if (originalItem.icon !== currentItem.icon) {
          changedFields.icon = currentItem.icon;
          hasChanges = true;
        }
        if (originalItem.status !== currentItem.status) {
          changedFields.status = currentItem.status;
          hasChanges = true;
        }
        if (originalItem.can_create !== currentItem.can_create) {
          changedFields.can_create = currentItem.can_create;
          hasChanges = true;
        }
        if (originalItem.can_read !== currentItem.can_read) {
          changedFields.can_read = currentItem.can_read;
          hasChanges = true;
        }
        if (originalItem.can_update !== currentItem.can_update) {
          changedFields.can_update = currentItem.can_update;
          hasChanges = true;
        }
        if (originalItem.can_delete !== currentItem.can_delete) {
          changedFields.can_delete = currentItem.can_delete;
          hasChanges = true;
        }

        if (hasChanges) {
          changes.push({
            id: currentItem.id,
            ...changedFields,
          });
        }
      } else {
        // New item
        changes.push({
          id: currentItem.id,
          menu_name: currentItem.menu_name,
          parent_id: currentItem.parent_id,
          path: currentItem.path,
          icon: currentItem.icon,
          status: currentItem.status,
          can_create: currentItem.can_create,
          can_read: currentItem.can_read,
          can_update: currentItem.can_update,
          can_delete: currentItem.can_delete,
          is_new: true,
        });
      }
    });

    // Check for deleted items
    originalFlat.forEach(originalItem => {
      const exists = currentFlat.find(item => item.id === originalItem.id);
      if (!exists) {
        changes.push({
          id: originalItem.id,
          is_deleted: true,
        });
      }
    });

    return changes;
  };

  const exportJSON = (): void => {
    const changes = compareMenus(originalMenus, menusList);

    console.log("Original menus:", originalMenus);
    console.log("Current menus:", menusList);
    console.log("Changes detected:", changes);
    console.log("Example change format:", {
      id: 21,
      menu_name: "Member Management2",
      path: "/member-management2",
      icon: "solar:buildings-bold-duotone",
      parent_id: 2, // Changed from 0 to 2 (became child of Settings)
    });

    if (changes.length === 0) {
      alert("No changes detected");
      return;
    }

    // Categorize changes
    const updates = changes.filter(c => !c.is_new && !c.is_deleted);
    const creates = changes.filter(c => c.is_new);
    const deletes = changes.filter(c => c.is_deleted);

    const updatePayload = {
      timestamp: new Date().toISOString(),
      summary: {
        total_changes: changes.length,
        updates: updates.length,
        creates: creates.length,
        deletes: deletes.length
      },
      changes: {
        updates: updates.map(({ is_new, is_deleted, ...rest }) => rest),
        creates: creates.map(({ is_new, is_deleted, ...rest }) => rest),
        deletes: deletes.map(({ is_deleted, ...rest }) => rest)
      }
    };

    const json = JSON.stringify(updatePayload, null, 2);
    console.log("updatePayload", updatePayload);
    
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu-updates.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetMenu = () => setMenusList(mapMenuHierarchy(menus));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Menus List</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isReorderMode 
                    ? 'Drag and drop to reorder menus. Drop on item to make it a child, drop between items to reorder.'
                    : 'Click on parent items to expand/collapse. Use action buttons to view, edit or delete.'
                  }
                  {isReorderMode && (
                    <span className="inline-block ml-2 text-amber-600">● Modified items are highlighted</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {compareMenus(originalMenus, menusList).length > 0 && (
                  <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    {compareMenus(originalMenus, menusList).length} changes
                  </div>
                )}
                <button
                  onClick={() => setIsReorderMode(!isReorderMode)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                    isReorderMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <GripVertical className="w-4 h-4" />
                  {isReorderMode ? 'Done Reordering' : 'Reorder'}
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New
                </button>
              </div>
            </div>
          </div>

          <div>
            {/* Drop zone at the very top for root level */}
            {isReorderMode && (
              <div
                className={`transition-all ${
                  currentDropZone?.targetId === null && currentDropZone?.position === "inside" 
                    ? "h-16 bg-blue-400 border-2 border-blue-500 border-dashed flex items-center justify-center" 
                    : "h-4 hover:h-8 hover:bg-blue-100"
                }`}
                onDragOver={e => {
                  e.preventDefault();
                  setCurrentDropZone({ targetId: null, position: "inside", parentId: 0 });
                }}
                onDragLeave={() => setCurrentDropZone(null)}
                onDrop={e => handleDrop(e, { targetId: null, position: "inside", parentId: 0 })}
              >
                {currentDropZone?.targetId === null && currentDropZone?.position === "inside" && (
                  <span className="text-white text-lg font-medium">Drop here to move to root level</span>
                )}
              </div>
            )}

            {menusList.map((menu: MenuItem, index: number) => renderMenuItem(menu, 0, index === menusList.length - 1, []))}

            {/* Drop zone at the very bottom for root level */}
            {isReorderMode && (
              <div
                className={`transition-all ${
                  currentDropZone?.targetId === -1 && currentDropZone?.position === 'inside'
                    ? 'h-16 bg-blue-400' 
                    : 'h-4 hover:h-8 hover:bg-blue-100'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setCurrentDropZone({ targetId: null, position: "inside", parentId: 0 });
                }}
                onDragLeave={() => setCurrentDropZone(null)}
                onDrop={e => handleDrop(e, { targetId: null, position: "inside", parentId: 0 })}
              />
            )}
          </div>

          <div className="p-6 border-t flex justify-between">
            <div className="flex gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                Back
              </button>
              {isReorderMode && (
                <button
                  onClick={() => {
                    if (confirm("Reset all changes and restore original menu structure?")) {
                      resetMenu();
                    }
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Reset Changes
                </button>
              )}
            </div>
            {isReorderMode && (
              <div className="flex gap-3">
                <button onClick={exportJSON} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-medium">
                  Export Changes
                </button>
                <button
                  onClick={() => {
                    const json = JSON.stringify({ menus: menusList }, null, 2);
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "menu-full-structure.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  Export Full Structure
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;