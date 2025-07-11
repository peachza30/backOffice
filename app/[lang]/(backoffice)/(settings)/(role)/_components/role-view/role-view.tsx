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
import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

const RoleView = ({ mode, roleId }: { mode: string; roleId?: number }) => {
  const { formData, permissionItems, loading, error, role, roleScope, scopes, fetchScope, fetchRolesScope, setRoleName, setRoleDescription, setScopeId, setStatusActive, togglePermission, toggleAllPermissions, toggleExpanded, submitRole, resetForm, loadRoleData, initializeAll, setMode } = useRoleStore();
  const { userById, userByUpdated, fetchUserById, fetchUserByUpdatedId } = useUserStore();
  const router = useRouter();
  const [lastModified, setLastModified] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [showServices, setShowServices] = useState(true);
  const [showMenus, setShowMenus] = useState(true);
  // console.log("formData", formData);
  console.log("formData", formData);
  console.log("userById", userById);

  useEffect(() => {
    if (formData.updated_by) {
      fetchUserById(formData.updated_by);
    }
  }, [formData.updated_by, fetchUserById]);

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

      fetchUserData();

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
  }, [userById, fetchUserByUpdatedId]);

  useEffect(() => {
    (async () => {
      await fetchScope();
      if (roleId) {
        await loadRoleData(roleId);
      } else {
        await initializeAll();
      }
    })();
  }, [roleId]);

  const handleBack = () => {
    resetForm();
    router.push("/roles-list");
  };

  useEffect(() => {
    fetchRolesScope(formData.scope_id);
  }, [formData.scope_id, fetchRolesScope]);
  const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] py-3 px-4 bg-white">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-6 mx-auto" />
            <Skeleton className="h-4 w-6 mx-auto" />
            <Skeleton className="h-4 w-6 mx-auto" />
            <Skeleton className="h-4 w-6 mx-auto" />
            <Skeleton className="h-4 w-6 mx-auto" />
          </div>
        ))}
      </div>
    );
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
              <button onClick={() => toggleExpanded(category, item.id)} className="p-1 hover:bg-blue-200 rounded transition-colors" type="button">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
              </button>
            )}
            {hasAnyChecked && (
              <Badge variant="soft" color="default" className="text-xs bg-blue-100 text-blue-700">
                Active
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={allChecked} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 pointer-events-none" disabled={true} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_read} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 pointer-events-none" disabled={true} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_create} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 pointer-events-none" disabled={true} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_update} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 pointer-events-none" disabled={true} />
          </div>
          <div className="flex items-center justify-center">
            <Checkbox size="sm" checked={item.permissions.can_delete} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 pointer-events-none" disabled={true} />
          </div>
        </div>
        {hasChildren && isExpanded && <div className="bg-gray-50/30">{item.children!.map(child => renderPermissionItem(child, category, level + 1))}</div>}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" /> {/* Title */}
          <Skeleton className="h-6 w-64" /> {/* Subheading */}
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-full md:col-span-2" />
              </div>
            ))}
          </div>
          <div className="pt-8">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="mt-10">
          <TableSkeleton rows={6} />
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
                <Badge color={formData.status === "A" ? "success" : "warning"} variant="soft" className="uppercase">
                  {formData.status === "A" ? "ACTIVE" : "INACTIVE"}
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
                    <button onClick={() => setShowMenus(!showMenus)} className="ml-2 p-0.5  hover:bg-blue-200 rounded transition-colors" type="button">
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

      <div className="mt-10 flex gap-3">
        <Button variant="outline" onClick={handleBack} color="secondary" disabled={loading}>
          Back
        </Button>
      </div>
    </>
  );
};

export default RoleView;
