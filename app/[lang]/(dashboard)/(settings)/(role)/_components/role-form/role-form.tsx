// app/roles/edit/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role/useRoleStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMenuStore } from "@/store/menu/useMenuStore";
import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";

const RoleForm = ({ mode, roleId }: { mode: string; roleId?: number }) => {
  const router = useRouter();

  const { formData, permissionItems, loading, error, role, roleScope, scopes, fetchScope, fetchRolesScope, setRoleName, setRoleDescription, setScopeId, setStatusActive, togglePermission, toggleAllPermissions, toggleExpanded, submitRole, resetForm, loadRoleData, initializeAll, setMode } = useRoleStore();
  const { menus } = useMenuStore();

  const [showServices, setShowServices] = useState(true);
  const [showMenus, setShowMenus] = useState(true);

  useEffect(() => {
    fetchScope();
    if (roleId) {
      loadRoleData(roleId);
    } else {
      initializeAll();
    }
  }, [roleId, loadRoleData, menus]);

  useEffect(() => {
    if (formData.scope_id) {
      fetchRolesScope(formData.scope_id);
    }
    console.log("formData", formData);
  }, []);

  const handleSubmit = async () => {
    try {
      if (!formData.role_name.trim()) {
        toast.error("Please enter a role name");
        return;
      }

      if (!formData.scope_id) {
        toast.error("Please select a scope");
        return;
      }

      // Check if at least one permission is selected
      const hasServicePermissions = permissionItems.services.some(service => hasAnyPermission(service));
      const hasMenuPermissions = permissionItems.menus.some(menu => hasAnyPermission(menu));

      if (!hasServicePermissions && !hasMenuPermissions) {
        toast.error("Please select at least one permission");
        return;
      }

      await submitRole();
      toast.success(roleId ? "Role updated successfully" : "Role created successfully");
      // router.push("/roles");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(roleId ? "Failed to update role" : "Failed to create role");
    }
  };

  const handleBack = () => {
    resetForm();
    router.push("/roles-list");
  };

  // Helper function to check if item has any permission
  const hasAnyPermission = (item: PermissionItem): boolean => {
    const hasDirectPermission = item.permissions.can_create || item.permissions.can_read || item.permissions.can_update || item.permissions.can_delete;
    const hasChildPermission = item.children?.some(child => hasAnyPermission(child)) || false;
    return hasDirectPermission || hasChildPermission;
  };

  const renderPermissionItem = (item: PermissionItem, category: "services" | "menus", level: number = 0) => {
    const allChecked = item.permissions.can_create && item.permissions.can_read && item.permissions.can_update && item.permissions.can_delete;

    const hasAnyChecked = item.permissions.can_create || item.permissions.can_read || item.permissions.can_update || item.permissions.can_delete;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.isExpanded;

    const getPaddingClass = (level: number) => {
      const paddingLevels = ["", "pl-10", "pl-20", "pl-30", "pl-40", "pl-50", "pl-60", "pl-70", "pl-80"];
      return paddingLevels[level] || "";
    };

    const getLineLeft = (level: number) => {
      const basePadding = level * 23;
      return `${basePadding}px`;
    };

    return (
      <div key={item.id} className="w-full">
        <div className={`relative grid grid-cols-[1fr_80px_80px_80px_80px_80px] py-3 px-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${getPaddingClass(level)}`}>
          {level > 0 && <div className="absolute top-0 bottom-0 border-2 border-blue-100/50" style={{ left: getLineLeft(level) }} />}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${level > 0 ? "text-gray-600" : "text-gray-700"}`}>
              <Icon icon={item.icon} />
            </span>
            <span className={`text-sm ${level > 0 ? "text-gray-600" : "text-gray-700"}`}>
              <b>{item.name}</b>
            </span>
            {hasChildren && (
              <button onClick={() => toggleExpanded(category, item.id)} className="p-1 hover:bg-gray-200 rounded transition-colors" type="button">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
              </button>
            )}
            {hasAnyChecked && (
              <Badge variant="soft" color="default" className="text-xs bg-blue-100 text-blue-700">
                Active
              </Badge>
            )}
          </div>

          {/* Columns 2–6: Checkboxes centered */}
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={allChecked} onCheckedChange={() => toggleAllPermissions(category, item.id)} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_read} onCheckedChange={() => togglePermission(category, item.id, "can_read")} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_create} onCheckedChange={() => togglePermission(category, item.id, "can_create")} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_update} onCheckedChange={() => togglePermission(category, item.id, "can_update")} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_delete} onCheckedChange={() => togglePermission(category, item.id, "can_delete")} />
          </div>
        </div>
        {hasChildren && isExpanded && <div className="bg-gray-50/30">{item.children!.map(child => renderPermissionItem(child, category, level + 1))}</div>}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">{roleId ? "Loading role configuration..." : "Preparing role configuration..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if role ID is invalid in edit mode
  // This section is not needed anymore since we determine mode by roleId

  return (
    <>
      <div className="flex flex-col h-full">
        <CardContent className="pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Name */}
            <div className="flex items-center gap-4">
              <label htmlFor="role-name" className="w-32 text-sm font-bold text-gray-700">
                Role Name<span className="text-red-500 ml-1">*</span>
              </label>
              <Input id="role-name" placeholder="Please enter role name" value={formData.role_name || ""} onChange={e => setRoleName(e.target.value)} className="h-10 flex-1 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            {/* Role Description */}
            <div className="flex items-center gap-4">
              <label htmlFor="role-description" className="w-32 text-sm font-bold text-gray-700">
                Description
              </label>
              <Input id="role-description" placeholder="Please enter role description" value={formData.description || ""} onChange={e => setRoleDescription(e.target.value)} className="h-10 flex-1 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            {/* Scope */}
            <div className="flex items-center gap-4">
              <label htmlFor="scope" className="w-32 text-sm font-bold text-gray-700">
                Scope<span className="text-red-500 ml-1">*</span>
              </label>
              <Select value={roleId && formData.scope_id != null ? formData.scope_id.toString() : undefined} onValueChange={value => setScopeId(parseInt(value))}>
                <SelectTrigger className="h-10 flex-1 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Please select scope" />
                </SelectTrigger>
                <SelectContent>
                  {scopes?.map(scope => (
                    <SelectItem key={scope.id} value={scope.id.toString()}>
                      {scope.scope_name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Active */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-bold text-gray-700">Active Status</label>
              {roleId && (
                <div className="p-1 flex items-center gap-5">
                  <Switch id="statusSwitch" checked={formData.status_active} onCheckedChange={() => setStatusActive(!formData.status_active)} color="success" />
                  <Badge color={formData.status_active ? "success" : "warning"} variant="soft">
                    {formData.status_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
              )}
              {!roleId && (
                <Badge variant="soft" color="success" className="text-xs">
                  Active
                </Badge>
              )}

              {/* <button onClick={() => setStatusActive(!formData.status_active)} className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${formData.status_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} type="button">
                {formData.status_active ? "ACTIVE" : "INACTIVE"}
              </button> */}
            </div>
          </div>
        </CardContent>
      </div>
      <div className="">
        {/* <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Set Permission</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Configure permissions for services and menu access</p>
        </CardHeader> */}
        <div className="border-t-2 border-blue-100/75">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider py-5">SET PERMISSION</h3>
        </div>
        <div className="p-0">
          <div className="bg-blue-50 border-b border-gray-200">
            <div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] py-3 px-4 bg-blue-50 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Permission</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">All</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Read</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Add</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Edit</div>
              <div className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">Delete</div>
            </div>
          </div>
          <div>
            {/* Services Section */}
            {permissionItems.services.length > 0 && (
              <>
                <div className="bg-gray-50/60 px-4 py-2 border-b border-gray-100 flex items-center justify-between ">
                  <div className="flex items-center ">
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Services ({permissionItems.services.length})</h3>
                    <button onClick={() => setShowServices(!showServices)} className="ml-2 p-0.5 rounded transition-colors" type="button">
                      {showServices ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
                {showServices && <div className="relative divide-y divide-gray-100 pl-5 before:absolute before:top-0 before:bottom-0 before:left-4 before:border-2 before:border-blue-100/50">{permissionItems.services.map(item => renderPermissionItem(item, "services"))}</div>}
              </>
            )}
            {/* Menus Section */}
            {permissionItems.menus.length > 0 && (
              <>
                <div className="bg-gray-50/60 px-4 py-2 border-y border-gray-100  flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider ">Menu ({permissionItems.menus.length})</h3>
                    <button onClick={() => setShowMenus(!showMenus)} className="ml-2 p-0.5  hover:bg-gray-200 rounded transition-colors" type="button">
                      {showMenus ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
                {showMenus && <div className="relative divide-y divide-gray-100 pl-5 before:absolute before:top-0 before:bottom-0 before:left-4 before:border-2 before:border-blue-100/50">{permissionItems.menus.map(item => renderPermissionItem(item, "menus"))}</div>}
              </>
            )}
            {/* Empty State */}
            {permissionItems.services.length === 0 && permissionItems.menus.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Loading permissions...</p>
                <p className="text-xs text-gray-400 mt-2">{!roleId ? "Preparing permissions for new role assignment" : "Please check your configuration if this persists"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={handleSubmit} color="primary" disabled={loading} className="px-6">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {roleId ? "Saving..." : "Creating..."}
            </>
          ) : roleId ? (
            "Save"
          ) : (
            "Create"
          )}
        </Button>
        <Button variant="outline" color="destructive" onClick={handleBack} disabled={loading} className="">
          Cancel
        </Button>
      </div>
    </>
  );
};

export default RoleForm;
