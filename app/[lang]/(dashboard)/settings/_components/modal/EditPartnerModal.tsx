import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"; // adjust import if needed
import { Input } from "@/components/ui/input"; // adjust import if needed
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSettingStore } from "@/store/setting/settingStore";
import router from "next/router";
import Select, { GroupBase, OptionProps, components } from "react-select";
import makeAnimated from "react-select/animated";
import { Icon } from "@iconify/react";
import ReactSelectOption from "@/app/[lang]/(dashboard)/settings/_components/react-select/react-select-options"; // adjust import if needed

export default function EditPartnerModal({
  open,
  onOpenChange,
  partner,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: any; // Ideally type this
}) {
  const { roles, roleSelected, loading, getRolesSetting, editPartnersSetting } = useSettingStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: roles,
  });

  useEffect(() => {
    getRolesSetting(2);
    if (partner) {
      setForm({
        name: partner.partner_name || "",
        email: partner.partner_email || "",
        password: partner.password || "",
        role_id: partner.role || "",
      });
    }
  }, [partner]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name:", name, "value:", value);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    const roleUpdate: any = {
      role_id: roleSelected,
    }
    try {
      await editPartnersSetting(roleUpdate, partner.partner_id);
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating partner:", err);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col gap-4">
          <DialogTitle>Edit Partner</DialogTitle>
          {/* <Input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" /> */}
          {/* <Input name="password" value={form.password} onChange={handleInputChange} placeholder="password" /> */}
          {/* <Input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" /> */}
          <Input name="email" value={form.name} onChange={handleInputChange} placeholder="Email" readOnly />
          <ReactSelectOption selected={{ value: form.role_id }} />
          <Button onClick={handleSubmit}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
