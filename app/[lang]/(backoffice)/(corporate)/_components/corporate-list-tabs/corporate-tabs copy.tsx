import React, { use, useEffect, useMemo, useState } from "react";
import { Button } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Input } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/input";
import { Label } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { Icon } from "@iconify/react";
import SizeButton from "../button/size-button";
import EmployeeList, { PersonRow } from "./pages/employee-person";
import StaffAuditList, { StaffSummaryItem } from "./pages/staff-audit";
import GuaranteesDetails from "./pages/guarantees-details";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import GuaranteeTable from "./pages/deposit-account";
import DocumentTable from "./pages/document";
import TransactionHistory from "./pages/transaction-history";
import { Badge } from "../ui/badge";
import { StringColorFormat } from "@faker-js/faker";
import { CorporateSkeleton } from "../corporate-skeleton/corporate-skeleton";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";
import { format } from "path";

const PERSON_META: Record<string, { title: string; icon?: string }> = {
  "1": { title: "รายนามกรรมการ" },
  "2": { title: "รายนามหัวหน้าสำนักงาน" },
  "3": { title: "รายนามผู้ทำบัญชี" },
  "5": { title: "รายนามผู้สอบบัญชี" },
};

export default function CorporateView({ id }: { id: number }) {
  const [guaranteeType, setGuaranteeType] = useState("");
  const router = useRouter();
  const { corporate, loading, fetchCorporateListById } = useCorporateStore();
  const formatAddress = addr => [addr.addressNumber, addr.soi && `ซ.${addr.soi}`, addr.street && `ถ.${addr.street}`, `แขวง${addr.subDistrict}`, `เขต${addr.district}`, addr.province, addr.postcode].filter(Boolean).join(" ");

  useEffect(() => {
    if (id) {
      fetchCorporateListById(Number(id));
    }
  }, [id, fetchCorporateListById]);

  /* ---------- 1. เตรียมข้อมูล addressCards ---------- */
  const addressCards = useMemo(() => {
    if (!corporate?.address) return [];

    return corporate.address.map(a => ({
      type: a.addressTypeId ?? "-",
      title: a.addressTypeName ?? "-",
      branchCode: a.branchCode ?? "-",
      fullAddress: formatAddress(a),
      phone: a.phone || a.mobilePhone || "-",
      fax: a.fax || "-",
      email: a.email || "-",
    }));
  }, [corporate?.address]);

  /* ---------- 2. จัดกลุ่มข้อมูล EmployeeList ---------- */
  const personSections = useMemo(() => {
    if (!corporate?.person) return [];

    const groups = new Map<string, PersonRow[]>();
    corporate.person.forEach(p => {
      if (!groups.has(p.personTypeId)) groups.set(p.personTypeId, []);
      groups.get(p.personTypeId)!.push({
        ...p,
        personTypeName: p.personTypeName, // เพื่อแสดงในตาราง
      });
    });

    return Array.from(groups.entries())
      .filter(([type]) => PERSON_META[type])
      .map(([type, rows]) => ({
        type,
        title: PERSON_META[type].title,
        rows,
      }));
  }, [corporate?.person]);

  /* ---------- 3. เตรียมข้อมูล StaffAudit ---------- */
  const staffSummary: StaffSummaryItem[] = useMemo(() => {
    if (!corporate?.employee?.length) return [];

    return corporate.employee.map(e => ({
      icon: "mingcute:group-3-line",
      label: e.position || e.personTypeName,
      count: Number(e.total ?? 0),
    }));
  }, [corporate?.employee]);

  const HQ = addressCards.filter(c => c.type === "1");
  const BILLING = addressCards.filter(c => c.type === "2");
  const CONTACT = addressCards.filter(c => c.type === "3");
  const BRANCHES = addressCards.filter(c => c.type === "4");

  const renderFields = (a: (typeof addressCards)[number]) => (
    <div className="grid grid-cols-1 gap-6">
      {[
        { label: "รหัสสาขา", value: a.branchCode },
        { label: "ที่อยู่", value: a.fullAddress },
        { label: "โทรศัพท์", value: a.phone },
        { label: "โทรสาร", value: a.fax },
        { label: "อีเมล", value: a.email },
      ].map(({ label, value }) => (
        <div className="flex items-start gap-4" key={label}>
          <label className="block text-sm font-bold text-gray-700 pt-2 w-36 min-w-[140px]">{label}</label>
          <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (corporate?.guarantee && corporate?.guarantee.length > 0) setGuaranteeType(corporate.guarantee[0].guaranteeTypeId || "");
  }, [corporate?.guarantee]);
  console.log("corporate", corporate);

  const handleEdit = () => {
    if (id) {
      router.push(`/corporate/${id}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!corporate) {
    return (
      <div className="container m-auto  px-4 py-8">
        {/* <div className="flex justify-center items-center h-64"> */}
        <CorporateSkeleton />
        {/* </div> */}
      </div>
    );
  }

  // if (loading) return <CorporateSkeleton />;

  return (
    <>
      <Card className="">
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
            <TabsContent value="page1" className="border-collapse">
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50 ">
                  <CardTitle className="text-lg font-bold">ข้อมูลนิติบุคคล</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 ">
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: "ประเภทนิติบุคคล", value: corporate.businessName || "-" },
                      { label: "เลขประจำตัวผู้เสียภาษี", value: corporate.taxId || "-" },
                      { label: "เบอร์โทรศัพท์", value: corporate.mobilePhone || "-" },
                      { label: "อีเมล", value: corporate.email || "-" },
                      {
                        label: "สถานะนิติบุคคล",
                        value: (
                          <div className="flex items-center gap-2">
                            <Badge variant="soft" color={corporate.status === "1" ? "success" : "destructive"}>
                              {corporate.statusName || "-"}
                            </Badge>
                          </div>
                        ),
                      },
                      { label: "หมายเหตุ", value: corporate.remark || "-" }, //fix pending
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
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="text-lg font-bold">วันสำคัญและการจดทะเบียน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: "วันเริ่มประกอบธุรกิจ", value: corporate.dbdRegistrationDate ? toBuddhistDate(corporate.dbdRegistrationDate) : "-" },
                      { label: "วันที่ยื่นจดทะเบียนต่อสภา", value: corporate.requestDateTypeDate ? toBuddhistDate(corporate.requestDateTypeDate) : "-" },
                      { label: "วันที่เริ่มต้นสถานภาพ", value: corporate.beginDate ? toBuddhistDate(corporate.beginDate) : "-" },
                      { label: "วันที่สิ้นสถานภาพ", value: corporate.expiredDate ? toBuddhistDate(corporate.expiredDate) : "-" },
                    ].map(({ label, value }) => (
                      <div className="flex items-start gap-4" key={label}>
                        <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                          {label}
                        </label>
                        <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
                      </div>
                    ))}
                    <div className="flex items-start gap-4">
                      <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "auto", minWidth: "140px" }}>
                        วันที่จดทะเบียนนิติบุคคลต่อสภาวิชาชีพบัญชีภายใน 30 วันนับจาก <b className="text-blue-600">วันที่จดทะเบียนเปลี่ยนแปลงวัตถุประสงค์เพื่อให้บริการด้านการสอบบัญชีหรือด้านการทำบัญชี</b>
                      </label>
                      <p className="text-sm text-gray-900 p-2 rounded flex-1">{corporate.registrationDate ? toBuddhistDate(corporate.registrationDate) : "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="text-lg font-bold">ข้อมูลทางธุรกิจและการเงิน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 gap-6">
                    {[{ label: "เงินทุนจดทะเบียน", value: (corporate.capital && formatCurrency(corporate.capital)) || "-" }].map(({ label, value }) => (
                      <div className="flex items-start gap-4" key={label}>
                        <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                          {label}
                        </label>
                        <p className="text-sm text-gray-900 p-2 rounded flex-1">
                          {value} <span className="text-sm text-gray-900 p-2 rounded flex-1 font-bold ml-16">บาท</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50 m-5">
                  <CardTitle className="text-md font-bold">
                    <div className="flex flex-wrap gap-x-10 gap-y-8">
                      {/* ทำบัญชี */}
                      <span className="font-bold">รายได้จากการประกอบธุรกิจคิดเป็น :</span>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
                        <span className="font-bold">ทำบัญชี</span>
                        <Label inputMode="numeric" className="w-28 text-center">
                          {corporate.accountingRevenue != null ? formatCurrency(corporate.accountingRevenue) : "0.00"}
                        </Label>
                        <span className="font-bold">บาท</span>
                      </div>

                      {/* สอบบัญชี */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
                        <span className="font-bold">สอบบัญชี</span>
                        <Label inputMode="numeric" className="w-28 text-center">
                          {corporate.auditingRevenue != null ? formatCurrency(corporate.auditingRevenue) : "0.00"}
                        </Label>
                        <span className="font-bold">บาท</span>
                      </div>

                      {/* อื่นๆ */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
                        <span className="font-bold">อื่นๆ</span>
                        <Label inputMode="numeric" className="w-28 text-center">
                          {corporate.otherRevenue != null ? formatCurrency(corporate.otherRevenue) : "0.00"}
                        </Label>
                        <span className="font-bold">บาท</span>
                      </div>

                      {/* สิ้นรอบบัญชี */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[250px]">
                        <span className="font-bold">สิ้นรอบบัญชีวันที่</span>
                        <span className="font-bold">:</span>
                        <span className="font-bold">{(corporate.fiscalYearEndDate && toBuddhistDate(corporate.fiscalYearEndDate)) || "-"}</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="page2" className="border-collapse">
              {/* สำนักงานใหญ่ (การ์ดเดียว) */}
              {HQ.map(card => (
                <Card key="hq" className="mb-4 border-2 border-blue-100/75">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="text-lg font-bold">ที่อยู่สำนักงานใหญ่</CardTitle>
                  </CardHeader>
                  <CardContent>{renderFields(card)}</CardContent>
                </Card>
              ))}

              {/* ที่อยู่ออกใบเสร็จ (การ์ดเดียว) */}
              {BILLING.map(card => (
                <Card key="billing" className="mb-4 border-2 border-blue-100/75">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="text-lg font-bold">ที่อยู่ออกใบเสร็จ</CardTitle>
                  </CardHeader>
                  <CardContent>{renderFields(card)}</CardContent>
                </Card>
              ))}

              {/* ที่อยู่สำหรับติดต่อ (การ์ดเดียว) */}
              {CONTACT.map(card => (
                <Card key="billing" className="mb-4 border-2 border-blue-100/75">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="text-lg font-bold">ที่อยู่สำหรับติดต่อ</CardTitle>
                  </CardHeader>
                  <CardContent>{renderFields(card)}</CardContent>
                </Card>
              ))}

              {/* ที่อยู่สำนักงานสาขา (หลายรายการใน CardContent เดียว) */}
              {BRANCHES.length > 0 && (
                <Card key="branches" className="mb-4 border-2 border-blue-100/75">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="text-lg font-bold">ที่อยู่สาขา</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {BRANCHES.map((card, idx) => (
                      <div key={idx}>
                        {renderFields(card)}
                        {idx < BRANCHES.length - 1 && <hr className="my-4 border-dashed" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="page3" className="border-collapse">
              {/* --- Section: บุคคลตามประเภท --- */}
              {personSections.map(sec => (
                <Card key={sec.type} className="mb-4 border-2 border-blue-100/75">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="font-bold">{sec.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {" "}
                    <EmployeeList rows={sec.rows} />
                  </CardContent>
                </Card>
              ))}

              {/* --- Section: พนักงานสอบบัญชี --- */}
              {staffSummary.length > 0 && (
                <Card className="mb-4 border-2 border-blue-100/75">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="font-bold"> พนักงานที่ให้บริการงานสอบบัญชี ({staffSummary.reduce((s, i) => s + i.count, 0)})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <StaffAuditList items={staffSummary} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="page4" className="border-collapse">
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="font-bold">รายละเอียดการจัดให้มีหลักประกัน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
                    <label className="block text-sm font-bold text-gray-700 pt-2 md:w-36 w-full md:flex-none break-words" style={{ width: "auto", minWidth: "140px" }}>
                      รายได้รวมสำหรับค่าบริการที่ต้องจัดให้มีหลักประกัน สิ้นรอบปีบัญชี ณ วันที่ :
                    </label>
                    <p className="text-sm text-gray-900 p-2 rounded flex-1 break-words">{toBuddhistDate(corporate.fiscalYearEndDate) || "-"}</p>
                  </div>
                  <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
                    {[
                      { label: "เงินทุนจดทะเบียน : ", value: formatCurrency(corporate.capital) || "-" },
                      { label: "รายได้รอบปีบัญชี : ", value: formatCurrency(corporate.totalRevenue) || "-" },
                    ].map(({ label, value }) => (
                      <div className="flex items-start gap-4" key={label}>
                        <label className="block text-sm font-bold text-gray-700" style={{ width: "140px", minWidth: "140px" }}>
                          {label}
                        </label>
                        <span className="text-sm text-gray-900 rounded flex-1">
                          {value} <b className="pl-5">บาท</b>
                        </span>
                      </div>
                    ))}
                  </div>
                  <GuaranteesDetails corporate={corporate} />
                  <div className="p-4">
                    <p>
                      ข้าพเจ้าได้จัดให้มีหลักประกันเพื่อประกันความรับผิดชอบต่อบุคคลที่สามแล้ว ตามกฏกระทรวง เป็นจำนวนไม่น้อยกว่าร้อยละ 3 และในการแจ้งหลักประกันครั้งนี้จำนวนที่มากกว่าในการคิดคำนวณหลักประกันคือ <span className="font-bold">{Number(corporate.capital) < 300000 ? "ของทุน ณ วันที่ยื่นจดทะเบียนต่อสภาวิชาชีพบัญชี / วันสิ้นรอบปีบัญชี" : `ของรายได้รอบปีบัญชี ${new Date().getFullYear() + 543}`}</span>
                    </p>
                  </div>

                  <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
                    {[
                      { label: "สิ้นรอบปีบัญชี ณ วันที่ : ", value: toBuddhistDate(corporate.fiscalYearEndDate) || "-" },
                      { label: "คิดเป็นจำนวนเงิน : ", value: corporate.totalRevenue || "-" },
                    ].map(({ label, value }) => (
                      <div className="flex items-start gap-4" key={label}>
                        <label className="block text-sm font-bold text-gray-700" style={{ width: "140px", minWidth: "140px" }}>
                          {label}
                        </label>
                        <p className="text-sm text-gray-900 rounded flex-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="font-bold">รายละเอียดหลักประกัน : {(corporate.guarantee.length > 0 && corporate.guarantee[0].guaranteeTypeName) || "-"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <GuaranteeTable key={guaranteeType} type={guaranteeType} guarantees={corporate.guarantee} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="page5" className="border-collapse">
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="font-bold">เอกสาร</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DocumentTable id={id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="page6" className="border-collapse">
              <div className="flex items-center justify-between mb-7 gap-x-4 ">
                <p className="font-bold text-lg">คำค้น</p>
                <Input placeholder="เลขที่คำขอ" className="flex-1" />
                <p className="font-bold text-lg">ประเภทคำขอ</p>
                <Input placeholder="ทั้งหมด" className="flex-1" />
                <Button variant="outline" className="w-32">
                  <Icon icon="solar:search-bold-duotone" width="20" height="20" className="mr-2" />
                  Search
                </Button>
                <Button variant="outline" className="w-32">
                  <Icon icon="solar:refresh-bold-duotone" width="20" height="20" className="mr-2" />
                  Clear
                </Button>
              </div>
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardContent className="space-y-2">
                  <TransactionHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
