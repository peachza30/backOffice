"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ServiceForm from "../_components/service-form/service-form";
import { useServiceStore } from "@/store/service/useServiceStore";

const ManageService = () => {
  const { mode } = useServiceStore();
  const topic = mode === "edit" ? "Add/Edit Service" : "Add Service";
 
  return (
    <div className="h-max p-4 bg-gray-50">
      {" "}
      <Card className="flex flex-col h-full">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">{topic}</div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <ServiceForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageService;
