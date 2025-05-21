"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PartnersDataTable from "../tables/PartnersDataTable";
import CreatePartnerModal from "../modal/CreatePartnerModal";
import { useState } from "react";

export default function SettingPartnersTable() {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleCreatePartner = (user: any) => {
    console.log("Created User:", user);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partners</CardTitle>
        <div className="flex justify-end">
          <CreatePartnerModal open={openCreateModal} onOpenChange={setOpenCreateModal} onCreate={handleCreatePartner} />
        </div>
        <CardDescription>Make changes to your user here. Click save when you're done.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <PartnersDataTable />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
