// File: CorporateRequest.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/tabs";

// Store & utils
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { CorporateSkeleton } from "../corporate-skeleton/corporate-skeleton";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";

// Local helpers & sections
import { TAB_KEYS, TAB_LABELS, type TabKey, PERSON_META, mapAddressCards, groupPersons, mapStaffSummary, type AddressCard } from "./helpers";
import RequestHeader from "./sections/RequestHeader";
import CompanyInfoCard from "./sections/CompanyInfoCard";
import RegistrationDatesCard from "./sections/RegistrationDatesCard";
import BusinessFinanceCard from "./sections/BusinessFinanceCard";
import RevenueSummaryCard from "./sections/RevenueSummaryCard";
import AddressSection from "./sections/AddressSection";
import PeopleSection from "./sections/PeopleSection";
import GuaranteeSection from "./sections/GuaranteeSection";
import DocumentsSection from "./sections/DocumentsSection";

export default function CorporateRequest({ id }: { id: number }) {
  const router = useRouter();
  const { request, loading, editList, documentPayload, fetchRequestEditList } = useCorporateStore();

  const [notify, setNotify] = useState<Record<TabKey, boolean>>({
    information: false,
    address: false,
    employees: false,
    details: false,
    documents: false,
  });

  const [guaranteeType, setGuaranteeType] = useState("");

  useEffect(() => {
    fetchRequestEditList();
  }, [fetchRequestEditList]);

  useEffect(() => {
    if (!loading && editList?.details?.tabs) {
      const notifyMap = Object.fromEntries(TAB_KEYS.map(tabKey => [tabKey, editList.details.tabs.some((item: any) => item.key === tabKey)])) as Record<TabKey, boolean>;
      setNotify(notifyMap);
    }
  }, [editList, loading]);

  useEffect(() => {
    if (request?.guarantee?.length) {
      setGuaranteeType(request.guarantee[0].guaranteeTypeId || "");
    }
  }, [request?.guarantee]);

  // Derived data (hooks must be before any early returns)
  const addressCards: AddressCard[] = useMemo(() => mapAddressCards(request?.address || []), [request?.address]);
  const personSections = useMemo(() => groupPersons(request?.person || []), [request?.person]);
  const staffSummary = useMemo(() => mapStaffSummary(request?.employee || []), [request?.employee]);

  // Group address by type (normalizing id to string)
  const HQ = addressCards.filter(c => c.type === "1");
  const BILLING = addressCards.filter(c => c.type === "2");
  const CONTACT = addressCards.filter(c => c.type === "3");
  const BRANCHES = addressCards.filter(c => c.type === "4");

  const handleTabChange = (tab: TabKey) => {
    // ถ้าต้องการ clear notify เมื่อเปลี่ยนแท็บ ให้ uncomment ด้านล่าง
    // setNotify(prev => ({ ...prev, [tab]: false }));
  };

  if (!request) return <CorporateSkeleton />;

  return (
    <>
      <RequestHeader request={request} />

      <div className="md:w-auto h-full w-full">
        <Tabs defaultValue="information" onValueChange={val => handleTabChange(val as TabKey)}>
          <div className="sm:overflow-visible overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5">
              {TAB_KEYS.map(key => (
                <TabsTrigger key={key} value={key} className="flex items-center">
                  <Icon icon={TAB_LABELS[key].icon} width={24} height={24} className="mr-0 lg:mr-2" />
                  <b className="hidden lg:inline">{TAB_LABELS[key].label}</b>
                  {notify[key] && <span className="ml-2 h-2 w-2 rounded-full bg-orange-500" />}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-5 border-collapse border-b-2 border-r-2 border-l-2 border-blue-100/75">
            {/* Page: Information */}
            <TabsContent value="information" className="border-collapse">
              <CompanyInfoCard request={request} />
              <RegistrationDatesCard request={request} />
              <BusinessFinanceCard request={request} />
              <RevenueSummaryCard request={request} />
            </TabsContent>

            {/* Page: Address */}
            <TabsContent value="address" className="border-collapse">
              {addressCards.length === 0 ? <p className="text-center text-sm text-muted-foreground">— ไม่พบข้อมูล —</p> : <AddressSection HQ={HQ} BILLING={BILLING} CONTACT={CONTACT} BRANCHES={BRANCHES} />}
            </TabsContent>

            {/* Page: Employees */}
            <TabsContent value="employees" className="border-collapse">
              {(!request?.person || request.person.length === 0) && (!request?.employee || request.employee.length === 0) ? <p className="text-center text-sm text-muted-foreground">— ไม่พบข้อมูล —</p> : <PeopleSection personSections={personSections} staffSummary={staffSummary} />}
            </TabsContent>

            {/* Page: Guarantee Details */}
            <TabsContent value="details" className="border-collapse">
              <GuaranteeSection request={request} guaranteeType={guaranteeType} />
            </TabsContent>

            {/* Page: Documents */}
            <TabsContent value="documents" className="border-collapse">
              {!request?.document?.length ? <p className="text-center text-sm text-muted-foreground">— ไม่พบข้อมูล —</p> : <DocumentsSection id={id} />}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
