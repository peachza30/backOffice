"use client";
import { use, useEffect, useState } from "react";
import { useServiceStore } from "@/store/service/useServiceStore";
import { Label } from "@/app/[lang]/(backoffice)/(settings)/(service)/_components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/[lang]/(backoffice)/(settings)/(service)/_components/ui/badge";
import { Switch } from "@/app/[lang]/(backoffice)/(settings)/(service)/_components/ui/switch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/[lang]/(backoffice)/(settings)/(service)/_components/dialog/confirm-dialog";
import SuccessDialog from "../dialog/success-dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const formServiceListSchema = z.object({
  service_name: z.string().min(1, {
    message: "Service name is required",
  }),
  service_description: z.string().optional(),
  status: z.string().optional(),
})

const ServiceForm = ({ mode, serviceId }: { mode: string; serviceId?: number }) => {
  const { service, createService, updateService } = useServiceStore();
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("A");
  const [menuTopic, setMenuTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const router = useRouter();

  const initialValues = {
    service_name: service?.service_name || "",
    service_description: service?.service_description || "",
    status: mode === "create" ? "A" : service?.status,
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(formServiceListSchema),
  });

  const watchServiceName = watch("service_name");

  useEffect(() => {
    console.log("service Name Change");
    
  }, []);


  useEffect(() => {
    if (service) {
      setServiceName(service.service_name);
      setDescription(service.service_description);
      setShow(service.status === "A");
      setStatus(service.status);
    }
  }, [service,reset]);
  

  useEffect(() => {
    if (mode === "create") {
      setMenuTopic("");
      // setServiceName("");
      setDescription("");
      setShow(true);
      setStatus("A");
    } else {
      setMenuTopic("Edit service");
    }
  }, [service, mode]); // Added mode to dependency array

  useEffect(() => {
    if (show) {
      setStatus("A");
    } else {
      setStatus("I");
    }
  }, [show]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!serviceName.trim()) {
  //     alert("Service name is required");
  //     return;
  //   }

  //   setOpenModal(true); // Open confirmation modal
  // };

  const onSubmit = async (values: any) => {
    console.log(values);
    setServiceName(values.service_name);
    setDescription(values.service_description);
    setShow(values.status === "A");
    setOpenModal(true);
  }

  const handleSuccessModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/service-list");
    }
    setOpenSuccessModal(isOpen);
  };
  const handleConfirm = async () => {
    const serviceData = {
      service_name: serviceName,
      service_description: description,
      status: status,
    };

    try {

      if (mode === "create") {
        await createService(serviceData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
        console.log("Creating service:", serviceData);
        setServiceName("");
        setDescription("");
        setShow(true);
        setStatus("A");
      } else if (service?.id) {
        await updateService(service.id, serviceData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
        console.log("Updating service:", service.id, serviceData);
      }
      setOpenSuccessModal(true);
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    }
  };

  let dialogConfig = {};
  let successDialogConfig = {};

  if (mode && mode === "create") {
    dialogConfig = {
      title: "Confirm Service Creation?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm the creation of the new service, You can edit or delete this service later.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };
    successDialogConfig = {
      icon: "solar:verified-check-outline",
      body: "Service created successfully.",
      color: "#22C55E",
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
    successDialogConfig = {
      icon: "solar:verified-check-outline",
      body: "Changes saved successfully.",
      color: "#22C55E",
    };
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {openModal && <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={dialogConfig} />}
      {openSuccessModal && <SuccessDialog open={openSuccessModal} onOpenChange={handleSuccessModalChange} dialogConfig={successDialogConfig} />}

      <div className="pl-2 pb-1 grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center text-default-900">
        <p className="text-xl">{menuTopic}</p>
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          SERVICE NAME <span className="text-warning">*</span>
        </Label>
        <Controller
          name="service_name"
          control={control}
          render={({ field }) => 
          <Input
          {...field}
          type="text"
          placeholder="Please enter service name"
          className={cn("", {
                              "border-destructive focus:border-destructive":
                                errors.service_name,
                            })}
          id="service_name"
        />
      }
        
        />
        <span className="text-destructive">{errors.service_name?.message}</span>

      </div>
      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="inputId">
          SERVICE DESCRIPTION
        </Label>
        <Controller
          name="service_description"
          control={control}
          render={({ field }) => 
        <Textarea
          {...field} // Changed from defaultValue to value
          placeholder="Please enter service description"
          rows={3}
        />
      }
        
        />
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
        <Button type="button" color="destructive" variant="outline" onClick={() => router.push("/service-list")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
