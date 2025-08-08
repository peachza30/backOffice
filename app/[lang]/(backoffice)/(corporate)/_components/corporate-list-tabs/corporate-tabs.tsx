// File: CorporateView.tsx
"use client";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

// UI
import { Card, CardContent } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/tabs";

// Store & utils
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { CorporateSkeleton } from "../corporate-skeleton/corporate-skeleton";

// Helpers
import { mapAddressCards, groupPersons, mapStaffSummary } from "./helpers";

// Sections
import CompanyInfoCard from "./sections/CompanyInfoCard";
import RegistrationDatesCard from "./sections/RegistrationDatesCard";
import BusinessFinanceCard from "./sections/BusinessFinanceCard";
import RevenueSummaryCard from "./sections/RevenueSummaryCard";
import AddressSection from "./sections/AddressSection";
import PeopleSection from "./sections/PeopleSection";
import GuaranteeSection from "./sections/GuaranteeSection";
import DocumentsSection from "./sections/DocumentsSection";
import TransactionsSection from "./sections/TransactionsSection";

export default function CorporateView({ id }: { id: number }) {
  const router = useRouter();
  const { corporate, fetchCorporateListById } = useCorporateStore();

  useEffect(() => {
    if (id) fetchCorporateListById(Number(id));
  }, [id, fetchCorporateListById]);
  // Derived data
  const addressCards = useMemo(() => mapAddressCards(corporate?.address || []), [corporate?.address || []]);
  const personSections = useMemo(() => groupPersons(corporate?.person || []), [corporate?.person || []]);
  const staffSummary = useMemo(() => mapStaffSummary(corporate?.employee || []), [corporate?.employee || []]);

  if (!corporate) {
    return (
      <div className="container m-auto px-4 py-8">
        <CorporateSkeleton />
      </div>
    );
  }

  const HQ = addressCards.filter(c => c.type === "1");
  const BILLING = addressCards.filter(c => c.type === "2");
  const CONTACT = addressCards.filter(c => c.type === "3");
  const BRANCHES = addressCards.filter(c => c.type === "4");

  return (
    <>
      {/* Top summary */}
      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 gap-6">
            {[
              { label: "ชื่อนิติบุคคล", value: corporate.nameTh || "-" },
              { label: "ชื่อภาษาอังกฤษ", value: corporate.nameEn || "-" },
              { label: "เลขทะเบียนนิติบุคคล", value: corporate.registrationNo || "-" },
              { label: "ประเภทการให้บริการ", value: corporate.corporateServiceName || "-" },
            ].map(({ label, value }) => (
              <div className="flex items-start gap-4" key={label}>
                <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                  {label}
                </label>
                <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="md:w-auto h-full w-full">
        <Tabs defaultValue="page1">
          <div className="sm:overflow-visible overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="page1" className="flex items-center">
                <Icon icon="solar:buildings-2-bold-duotone" width="24" height="24" className="mr-0 lg:mr-2" />
                <b className="hidden lg:inline">ข้อมูลนิติบุคคล</b>
              </TabsTrigger>
              <TabsTrigger value="page2" className="flex items-center">
                <Icon icon="hugeicons:maps-location-02" width="24" height="24" className="mr-0 lg:mr-2" />
                <b className="hidden lg:inline">ที่อยู่</b>
              </TabsTrigger>
              <TabsTrigger value="page3" className="flex items-center">
                <Icon icon="mingcute:group-3-line" width="24" height="24" className="mr-0 lg:mr-2" />
                <b className="hidden lg:inline">รายนาม/พนักงาน</b>
              </TabsTrigger>
              <TabsTrigger value="page4" className="flex items-center">
                <Icon icon="fluent:building-bank-toolbox-20-regular" width="24" height="24" className="mr-0 lg:mr-2" />
                <b className="hidden lg:inline">รายละเอียดหลักประกัน</b>
              </TabsTrigger>
              <TabsTrigger value="page5" className="flex items-center">
                <Icon icon="fluent:document-folder-20-regular" width="24" height="24" className="mr-0 lg:mr-2" />
                <b className="hidden lg:inline">เอกสารในการสมัคร</b>
              </TabsTrigger>
              <TabsTrigger value="page6" className="flex items-center">
                <Icon icon="fluent:document-bullet-list-clock-20-regular" width="24" height="24" className="mr-0 lg:mr-2" />
                <b className="hidden lg:inline">ประวัติคำขอและการชำระเงิน</b>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-5 border-collapse border-b-2 border-r-2 border-l-2 border-blue-100/75">
            {/* Page 1 */}
            <TabsContent value="page1" className="border-collapse">
              <CompanyInfoCard corporate={corporate} />
              <RegistrationDatesCard corporate={corporate} />
              <BusinessFinanceCard corporate={corporate} />
              <RevenueSummaryCard corporate={corporate} />
            </TabsContent>

            {/* Page 2 */}
            <TabsContent value="page2" className="border-collapse">
              <AddressSection HQ={HQ} BILLING={BILLING} CONTACT={CONTACT} BRANCHES={BRANCHES} />
            </TabsContent>

            {/* Page 3 */}
            <TabsContent value="page3" className="border-collapse">
              <PeopleSection personSections={personSections} staffSummary={staffSummary} />
            </TabsContent>

            {/* Page 4 */}
            <TabsContent value="page4" className="border-collapse">
              <GuaranteeSection corporate={corporate} />
            </TabsContent>

            {/* Page 5 */}
            <TabsContent value="page5" className="border-collapse">
              <DocumentsSection id={id} />
            </TabsContent>

            {/* Page 6 */}
            <TabsContent value="page6" className="border-collapse">
              <TransactionsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
