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
import { useUserStore } from "@/store/users/useUserStore";

const RoleView = ({ mode, roleId }: { mode: string; roleId?: number }) => {
  const { formData, permissionItems, loading, error, role, roleScope, scopes, fetchScope, fetchRolesScope, setRoleName, setRoleDescription, setScopeId, setStatusActive, togglePermission, toggleAllPermissions, toggleExpanded, submitRole, resetForm, loadRoleData, initializeAll, setMode } = useRoleStore();
  const { userById, userByUpdated, fetchUserById, fetchUserByUpdatedId } = useUserStore();
  const router = useRouter();
  const [lastModified, setLastModified] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [showServices, setShowServices] = useState(true);
  const [showMenus, setShowMenus] = useState(true);

  useEffect(() => {
    if (formData) {
      console.log("formData", formData);
      fetchUserById(formData.updated_by ?? 0); // or some other default value
    }
  }, [formData]);

  useEffect(() => {
    if (userById) {
      const updatedBy = userById.updated_by;

      const fetchUserData = async () => {
        if (updatedBy) {
          try {
            await fetchUserByUpdatedId(updatedBy);
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
      };
      console.log("userById", userById);

      fetchUserData();

      if (userById) {
        const updatedAt = userById?.updated_at ?? "";
        const isValidDate = updatedAt && !isNaN(Date.parse(updatedAt));
        const firstName = userById?.first_name ?? "";
        const lastName = userById?.last_name ?? "";
        const userName = firstName && lastName ? `${firstName}.${lastName.slice(0, 2)}` : "Unknown User";

        setModifiedBy(userName || "");
        setLastModified(
          isValidDate
            ? new Intl.DateTimeFormat("th-TH", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).format(new Date(updatedAt))
            : "-"
        );
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchScope();
      if (roleId) {
        await loadRoleData(roleId);
      } else {
        await initializeAll();
      }
    })();
  }, [roleId, loadRoleData]);

  const handleBack = () => {
    resetForm();
    router.push("/roles-list");
  };

  useEffect(() => {
    fetchRolesScope(formData.scope_id);
  }, []);
  console.log("roleScope", roleScope);
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

    return (
      <div key={item.id} className="w-full">
        <div className={`grid grid-cols-6 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${level > 0 ? "pl-10" : ""}`}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button onClick={() => toggleExpanded(category, item.id)} className="p-0.5 hover:bg-gray-200 rounded transition-colors" type="button">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
              </button>
            )}
            <span className={`text-sm ${level > 0 ? "text-gray-600" : "text-gray-700"}`}>{item.name}</span>
            {hasAnyChecked && (
              <Badge variant="soft" color="default" className="text-xs bg-blue-100 text-blue-700">
                Active
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={allChecked}
              onCheckedChange={() => {
                console.log(`Toggling all permissions for ${item.name} (ID: ${item.id})`);
                toggleAllPermissions(category, item.id);
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
              disabled={true}
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_read}
              onCheckedChange={() => {
                console.log(`Toggling READ for ${item.name} (ID: ${item.id}) in category: ${category}`);
                console.log(`Current value: ${item.permissions.can_read}`);
                togglePermission(category, item.id, "can_read");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
              disabled={true}
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_create}
              onCheckedChange={() => {
                console.log(`Toggling CREATE for ${item.name} (ID: ${item.id}) in category: ${category}`);
                togglePermission(category, item.id, "can_create");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
              disabled={true}
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_update}
              onCheckedChange={() => {
                console.log(`Toggling UPDATE for ${item.name} (ID: ${item.id}) in category: ${category}`);
                togglePermission(category, item.id, "can_update");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
              disabled={true}
            />
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.permissions.can_delete}
              onCheckedChange={() => {
                console.log(`Toggling DELETE for ${item.name} (ID: ${item.id}) in category: ${category}`);
                togglePermission(category, item.id, "can_delete");
              }}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
              disabled={true}
            />
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
          {/* Header */}
          {/* Service Details Grid */}
          <div className="space-y-2 pb-10">
            {/* Service ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">ROLE ID</Label>
              <div className="md:col-span-2">
                <span className="text-gray-900">{roleId}</span>
              </div>
            </div>

            {/* ROLE Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">ROLE NAME</Label>
              <div className="md:col-span-2">
                <span className="text-gray-900">{formData.role_name || ""}</span>
              </div>
            </div>

            {/* ROLE Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">ROLE DESCRIPTION</Label>
              <div className="md:col-span-2">
                <span className="text-gray-900">{formData.description || "-"}</span>
              </div>
            </div>
            {/* ROLE Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">SCOPE</Label>
              <div className="md:col-span-2">
                <span className="text-gray-900">{roleId && formData.scope_id === 1 ? "user" : formData.scope_id === 2 ? "partner" : formData.scope_id?.toString()}</span>
              </div>
            </div>

            {/* Status Active */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">STATUS ACTIVE</Label>
              <div className="md:col-span-2">
                <Badge color={formData.status_active ? "success" : "warning"} variant="soft" className="uppercase">
                  {formData.status_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
            </div>

            {/* Last Modified */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">LAST MODIFIED</Label>
              <div className="md:col-span-2">
                <span className="text-gray-900">{lastModified || "-"}</span>
              </div>
            </div>

            {/* Modified By */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
              <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">MODIFIED BY</Label>
              <div className="md:col-span-2">
                <span className="text-gray-900">{modifiedBy || "-"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      <Card className="shadow-sm border border-gray-200 bg-white">
        {/* <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Set Permission</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Configure permissions for services and menu access</p>
        </CardHeader> */}
        <CardContent className="p-0">
          <div className="bg-blue-50 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 py-3 px-4">
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
                <div className="bg-gray-50/60 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Services ({permissionItems.services.length})</h3>
                    <button onClick={() => setShowServices(!showServices)} className="ml-2 p-0.5 rounded transition-colors" type="button">
                      {showServices ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
                {showServices && <div className="divide-y divide-gray-100">{permissionItems.services.map(item => renderPermissionItem(item, "services"))}</div>}
              </>
            )}

            {/* Menus Section */}
            {permissionItems.menus.length > 0 && (
              <>
                <div className="bg-gray-50/60 px-4 py-2 border-y border-gray-100 mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Menu ({permissionItems.menus.length})</h3>
                    <button onClick={() => setShowMenus(!showMenus)} className="ml-2 p-0.5  hover:bg-gray-200 rounded transition-colors" type="button">
                      {showMenus ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
                {showMenus && <div className="divide-y divide-gray-100">{permissionItems.menus.map(item => renderPermissionItem(item, "menus"))}</div>}
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
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={handleBack} disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6">
          Back
        </Button>
      </div>
    </>
  );
};

export default RoleView;
