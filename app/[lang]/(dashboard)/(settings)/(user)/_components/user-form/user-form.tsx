"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/users/useUserStore";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/badge";
import { Switch } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/switch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/dialog/confirm-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoleStore } from "@/store/role/useRoleStore";


const UserForm = ({ mode }: { mode: "create" | "edit" }) => {
  const { user, updateUser } = useUserStore();
  const { roles, role, roleScope, fetchRolesScope, fetchRoles } = useRoleStore();
  const [userId, setUserId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("A");
  const [menuTopic, setMenuTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [roleVal, setRoleVal] = useState(user?.role?.role_id);

  const router = useRouter();

  useEffect(() => {
    fetchRoles({
      search: "",
      status: "",
      page: 1,
      limit: 10,
      sort: "created_at",
      order: "DESC",
    });
    setMenuTopic("");
    if (user) {
      setUserId(user.id);
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setRoleName(user.email || "");
      setShow(user.status === "A");
      setStatus(user.status);
      fetchRolesScope(user.role.scope_id);
      setRoleVal(user.role.role_id);
    }
  }, [user, mode]);
  // console.log("roleScope", roleScope);

  useEffect(() => {
    if (show) {
      setStatus("A");
    } else {
      setStatus("I");
    }
  }, [show]);

  const roleSelect: { value: number; label: string }[] =
    roleScope?.roles.map(role => ({
      value: role.id,
      label: role.role_name,
    })) ?? [];

  const currentStatusValue = roleSelect.find(r => r.value === Number(roleVal))?.value || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!serviceName.trim()) {
    //   alert("Service name is required");
    //   return;
    // }

    setOpenModal(true); // Open confirmation modal
  };

  // Called after user confirms in the modal
  const handleConfirm = async () => {
    const userData = {
      role_id: Number(roleVal),
      status: status,
    };

    try {
      if (user?.id) {
        await updateUser(user.id, userData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
        console.log("Updating service:", user.id, userData);
      }
      setOpenModal(false);
      router.push("/user-management");
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    }
  };
  let dialogConfig = {};
  if (mode && mode === "create") {
    dialogConfig = {
      title: "Confirm User Creation?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm the creation of the new user, You can edit or delete this user later.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };
  } else if (mode && mode === "edit") {
    dialogConfig = {
      title: "Confirm Save Change?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm if you would like to proceed with these changes.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      {openModal && (
        <>
          <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={dialogConfig} />
        </>
      )}
      <div className="pl-2 pb-1 grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center text-default-900">
        <p>{menuTopic}</p>
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          USER ID
        </Label>
        <Input
          type="text"
          value={userId} // Changed from defaultValue to value
          onChange={e => setFirstName(e.target.value)}
          placeholder="Please enter service name"
          id="serviceName"
          required
          disabled
        />
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          FIRST NAME
        </Label>
        <Input
          type="text"
          value={firstName} // Changed from defaultValue to value
          onChange={e => setFirstName(e.target.value)}
          placeholder="Please enter service name"
          id="serviceName"
          required
          disabled
        />
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          LAST NAME
        </Label>
        <Input
          type="text"
          value={lastName} // Changed from defaultValue to value
          onChange={e => setLastName(e.target.value)}
          placeholder="Please enter service name"
          id="serviceName"
          required
          disabled
        />
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          EMAIL
        </Label>
        <Input
          type="text"
          value={email} // Changed from defaultValue to value
          onChange={e => setLastName(e.target.value)}
          placeholder="Please enter service name"
          id="serviceName"
          required
          disabled
        />
      </div>
      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="inputId">
          ROLE <span className="text-warning">*</span>
        </Label>
        <Select
          value={currentStatusValue}
          onValueChange={(newValue: number) => {
            setRoleVal(newValue);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roleSelect.map(r => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {mode === "edit" && (
        <>
          <div className="pt-1 pl-20 pr-20">
            <Label className="mb-3" htmlFor="inputId">
              STATUS ACTIVE
            </Label>
          </div>
          <div className="p-1 pl-20 pr-20 flex items-center gap-5">
            <Switch id="airplane-mode" checked={show} onCheckedChange={() => setShow(!show)} color="success" />
            <Badge color={show ? "success" : "warning"} variant="soft">
              {show ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </>
      )}

      <div className="p-5 pl-20 pr-20 gap-4 flex items-center justify-start">
        <Button type="submit">Submit</Button>
        <Button type="button" color="destructive" variant="outline" onClick={() => router.push("/user-management")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
