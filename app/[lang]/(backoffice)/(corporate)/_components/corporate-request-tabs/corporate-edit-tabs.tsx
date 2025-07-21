import React, { use, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Input } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { Icon } from "@iconify/react";
import EmployeeList, { PersonRow } from "./pages/striped-rows";
import StaffAuditList, { StaffSummaryItem } from "./pages/staff-audit";
import GuaranteesDetails from "./pages/guarantees-details";
import GuaranteeTable from "./pages/deposit-account";
import DocumentTable from "./pages/document";
import { Badge } from "../ui/badge";
import { CorporateSkeleton } from "../corporate-skeleton/corporate-skeleton";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";
import { TabLabel } from "./tab-label";

const TAB_KEYS = ["page1", "page2", "page3", "page4", "page5"] as const;
const TAB_LABELS = {
  page1: { label: "ข้อมูลนิติบุคคล", icon: "solar:buildings-2-bold-duotone" },
  page2: { label: "ที่อยู่", icon: "hugeicons:maps-location-02" },
  page3: { label: "รายนาม/พนักงาน", icon: "mingcute:group-3-line" },
  page4: { label: "รายละเอียดหลักประกัน", icon: "fluent:building-bank-toolbox-20-regular" },
  page5: { label: "เอกสารในการสมัคร", icon: "fluent:document-folder-20-regular" },
};
const PERSON_META: Record<string, { title: string; icon?: string }> = {
  "1": { title: "รายนามกรรมการ" },
  "2": { title: "รายนามหัวหน้าสำนักงาน" },
  "3": { title: "รายนามผู้ทำบัญชี" },
  "5": { title: "รายนามผู้สอบบัญชี" },
};

type TabKey = (typeof TAB_KEYS)[number];
type NotifyMap = Record<TabKey, boolean>;
export default function CorporateRequestEdit({ id }: { id: number }) {
  const [guaranteeType, setGuaranteeType] = useState("");
  const router = useRouter();
  const { request, fetchCorporateRequest } = useCorporateStore();
  const formatAddress = addr => [addr.addressNumber, addr.soi && `ซ.${addr.soi}`, addr.street && `ถ.${addr.street}`, `แขวง${addr.subDistrict}`, `เขต${addr.district}`, addr.province, addr.postcode].filter(Boolean).join(" ");

  const blankNotify: NotifyMap = Object.fromEntries(TAB_KEYS.map(k => [k, false])) as NotifyMap;
  const [notify, setNotify] = useState<NotifyMap>(blankNotify);

  useEffect(() => {
    if (id) {
      fetchCorporateRequest(Number(id));
    }
  }, [id, fetchCorporateRequest]);

  /* ---------- 1. เตรียมข้อมูล addressCards ---------- */
  const addressCards = useMemo(() => {
    if (!request?.address) return [];

    return request.address.map(a => ({
      type: a.addressTypeId ?? "-",
      title: a.addressTypeName ?? "-",
      branchCode: a.branchCode ?? "-",
      fullAddress: formatAddress(a),
      phone: a.phone || a.mobilePhone || "-",
      fax: a.fax || "-",
      email: a.email || "-",
    }));
  }, [request?.address]);

  /* ---------- 2. จัดกลุ่มข้อมูล EmployeeList ---------- */
  const personSections = useMemo(() => {
    if (!request?.person) return [];

    const groups = new Map<string, PersonRow[]>();
    request.person.forEach(p => {
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
  }, [request?.person]);

  /* ---------- 3. เตรียมข้อมูล StaffAudit ---------- */
  const staffSummary: StaffSummaryItem[] = useMemo(() => {
    if (!request?.employee?.length) return [];

    return request.employee.map(e => ({
      icon: "mingcute:group-3-line",
      label: e.position || e.personTypeName,
      count: Number(e.total ?? 0),
    }));
  }, [request?.employee]);

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
    if (request?.requestStatus === 1) {
      setNotify(Object.fromEntries(TAB_KEYS.map(k => [k, true])) as NotifyMap);
    } else {
      setNotify(blankNotify);
    }
  }, [request?.requestStatus]);
  const handleTabChange = (tab: TabKey) => {
    setNotify(prev => ({ ...prev, [tab]: false }));
  };
  const handleEdit = () => {
    if (id) {
      router.push(`/request/${id}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!request) {
    return (
      <div className="container m-auto  px-4 py-8">
        {/* <div className="flex justify-center items-center h-64"> */}
        <CorporateSkeleton />
        {/* </div> */}
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50/40">
        <div className="flex justify-center items-center text-md">
          <span className="font-bold">เลขที่คำขอ</span>
          <span className="font-bold pl-3">:</span>
          <span className="pl-3">{request.no}</span>
        </div>
        <CardContent className="p-8">
          <div className="">
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: "ประเภทคำขอ", value: request.nameTh || "-" },
                { label: "วันที่รับเอกสาร", value: request.registrationNo || "-" },
                { label: "วันที่ยื่นคำขอ", value: request.nameEn || "-" },
                { label: "สถานะคำขอ", value: request.corporateServiceName || "-" },
              ].map(({ label, value }) => (
                <div className="flex items-start gap-4" key={label}>
                  <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                    {label}
                  </label>
                  <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50/40">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "ชื่อนิติบุคคล", value: request.nameTh || "-" },
                { label: "ชื่อภาษาอังกฤษ", value: request.nameEn || "-" },
                { label: "เลขทะเบียนนิติบุคคล", value: request.registrationNo || "-" },
                { label: "ประเภทการให้บริการ", value: request.corporateServiceName || "-" },
              ].map(({ label, value }) => (
                <div className="flex items-start gap-4" key={label}>
                  <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                    {label}
                  </label>
                  <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
      <div className="md:w-auto h-full w-full">
        <Tabs defaultValue="page1" onValueChange={val => handleTabChange(val as TabKey)}>
          <div className="sm:overflow-visible overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5">
              {TAB_KEYS.map(key => (
                <TabsTrigger key={key} value={key} className="flex items-center">
                  <TabLabel icon={TAB_LABELS[key].icon} text={TAB_LABELS[key].label} showDot={notify[key]} />
                </TabsTrigger>
              ))}
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
                      { label: "ประเภทนิติบุคคล", value: request.corporateServiceName || "-" },
                      { label: "เลขประจำตัวผู้เสียภาษี", value: request.registrationNo || "-" },
                      { label: "เบอร์โทรศัพท์", value: request.mobilePhone || "-" },
                      { label: "อีเมล", value: request.email || "-" },
                      {
                        label: "สถานะนิติบุคคล",
                        value: (
                          <div className="flex items-center gap-2">
                            <Badge variant="soft" color={request.status === "1" ? "success" : "destructive"}>
                              {request.statusName || "-"}
                            </Badge>
                          </div>
                        ),
                      },
                      { label: "หมายเหตุ", value: request.remark || "-" }, //fix pending
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
                      { label: "วันเริ่มประกอบธุรกิจ", value: request.expiredDate ? toBuddhistDate(request.nameTh) : "-" },
                      { label: "วันที่ยื่นจดทะเบียนต่อสภา", value: request.expiredDate ? toBuddhistDate(request.nameEn) : "-" },
                      { label: "วันที่เริ่มต้นสถานภาพ", value: request.expiredDate ? toBuddhistDate(request.beginDate) : "-" },
                      { label: "วันที่สิ้นสถานภาพ", value: request.expiredDate ? toBuddhistDate(request.expiredDate) : "-" },
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
                      <p className="text-sm text-gray-900 p-2 rounded flex-1">{request.nameTh || "-"}</p>
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
                    {[{ label: "เงินทุนจดทะเบียน", value: (request.capital && formatCurrency(request.capital)) || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด" }].map(({ label, value }) => (
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
                    <div className="flex flex-wrap justify-evenly gap-y-4">
                      {/* ทำบัญชี */}
                      <div className="flex items-center gap-1">
                        รายได้จากการประกอบธุรกิจคิดเป็น :<span className="font-bold ml-8">ทำบัญชี</span>
                        <Input type="text" value={(request.accountingRevenue && formatCurrency(request.accountingRevenue)) || "0.00"} inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                        <span className="font-bold">บาท</span>
                      </div>

                      {/* สอบบัญชี */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold ml-5">สอบบัญชี</span>
                        <Input type="text" value={(request.auditingRevenue && formatCurrency(request.auditingRevenue)) || "0.00"} inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                        <span className="font-bold">บาท</span>
                      </div>

                      {/* อื่นๆ */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold ml-5">อื่นๆ</span>
                        <Input type="text" value={(request.otherRevenue && formatCurrency(request.otherRevenue)) || "0.00"} inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                        <span className="font-bold">บาท</span>
                      </div>

                      {/* สิ้นรอบบัญชี */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold mx-3">สิ้นรอบบัญชีวันที่</span>
                        <span className="font-bold mx-3">:</span>
                        <span className="font-bold">{(request.fiscalYearEndDate && toBuddhistDate(request.fiscalYearEndDate)) || "-"}</span>
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
                    <p className="text-sm text-gray-900 p-2 rounded flex-1 break-words">{toBuddhistDate(request.fiscalYearEndDate) || "-"}</p>
                  </div>
                  <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
                    {[
                      { label: "เงินทุนจดทะเบียน : ", value: formatCurrency(request.capital) || "-" },
                      { label: "รายได้รอบปีบัญชี : ", value: formatCurrency(request.totalRevenue) || "-" },
                    ].map(({ label, value }) => (
                      <div className="flex items-start gap-4" key={label}>
                        <label className="block text-sm font-bold text-gray-700" style={{ width: "140px", minWidth: "140px" }}>
                          {label}
                        </label>
                        <p className="text-sm text-gray-900 rounded flex-1">{value}</p>
                      </div>
                    ))}
                  </div>
                  <GuaranteesDetails rows={request} />
                  <div className="p-4">
                    <p>
                      ข้าพเจ้าได้จัดให้มีหลักประกันเพื่อประกันความรับผิดชอบต่อบุคคลที่สามแล้ว ตามกฏกระทรวง เป็นจำนวนไม่น้อยกว่าร้อยละ 3 และในการแจ้งหลักประกันครั้งนี้จำนวนที่มากกว่าในการคิดคำนวณหลักประกันคือ <span className="font-bold">{Number(request.capital) < 300000 ? "ของทุน ณ วันที่ยื่นจดทะเบียนต่อสภาวิชาชีพบัญชี / วันสิ้นรอบปีบัญชี" : `ของรายได้รอบปีบัญชี ${new Date().getFullYear() + 543}`}</span>
                    </p>
                  </div>

                  <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
                    {[
                      { label: "สิ้นรอบปีบัญชี ณ วันที่ : ", value: toBuddhistDate(request.fiscalYearEndDate) || "-" },
                      { label: "คิดเป็นจำนวนเงิน : ", value: request.nameEn || "-" },
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
                <CardHeader className="bg-blue-50/50">{/* <CardTitle className="font-bold">รายละเอียดหลักประกัน : {request?.guarantee[0].guaranteeTypeName || "-"}</CardTitle> */}</CardHeader>
                <CardContent className="space-y-2">
                  <GuaranteeTable key={guaranteeType} type={guaranteeType} guarantees={request.guarantee} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="page5" className="border-collapse">
              <Card className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="font-bold">เอกสาร</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DocumentTable />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
