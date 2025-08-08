import React, { useEffect } from "react";
import { Button } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Input } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/input";
import { Label } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { Icon } from "@iconify/react";
import SizeButton from "../../_components/button/size-button";
import StripedRows from "../corporate-table/striped-rows";
import StaffAuditList from "../corporate-table/staff-audit";
import GuaranteesDetails from "../corporate-table/guarantees-details";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import DepositAccount from "../corporate-table/deposit-account";
import DocumentTable from "../corporate-table/document";
import TransactionHistory from "../corporate-table/transaction-history";
import { Badge } from "../ui/badge";

export interface RawCorporateAddress {
  Office_Name: string;
  Address_Number: string;
  Moo: string;
  Village: string;
  Soi: string;
  Street: string;
  Sub_District: string;
  District: string;
  Province: string;
  Postcode: string;
  Branch_Code: string;
  Phone: string;
  Fax: string;
  Mobile_Phone: string;
  E_Mail: string;
}

/** ข้อมูลที่จะใช้แสดงบนการ์ด */
export interface AddressCardData {
  title: string; // ชื่อการ์ด เช่น “ที่อยู่สำนักงานใหญ่”
  branchCode: string;
  fullAddress: string;
  phone?: string;
  fax?: string;
  email?: string;
}
export default function CorporateView({ id }: { id: number }) {
  const router = useRouter();
  const { corporate, fetchCorporateById } = useCorporateStore();
  const formatAddress = (addr: RawCorporateAddress) => [addr.Address_Number, addr.Soi && `ซ.${addr.Soi}`, addr.Street && `ถ.${addr.Street}`, `แขวง${addr.Sub_District}`, `เขต${addr.District}`, addr.Province, addr.Postcode].filter(Boolean).join(" ");
  const rawAddresses: RawCorporateAddress[] = [
    {
      Office_Name: "สำนักงานใหญ่",
      Address_Number: "420/5",
      Moo: "",
      Village: "",
      Soi: "ลาดพร้าว 63 (สุขสันต์ 3)",
      Street: "",
      Sub_District: "สะพานสอง",
      District: "วังทองหลาง",
      Province: "กรุงเทพมหานคร",
      Postcode: "10310",
      Branch_Code: "00000",
      Phone: "021089448",
      Fax: "",
      Mobile_Phone: "",
      E_Mail: "",
    },
    {
      Office_Name: "ที่อยู่ออกใบเสร็จ",
      Address_Number: "183/493",
      Moo: "",
      Village: "",
      Soi: "",
      Street: "แจ้งวัฒนะ",
      Sub_District: "ทุ่งสองห้อง",
      District: "หลักสี่",
      Province: "กรุงเทพมหานคร",
      Postcode: "10210",
      Branch_Code: "00000",
      Phone: "",
      Fax: "",
      Mobile_Phone: "",
      E_Mail: "",
    },
    {
      Office_Name: "ที่อยู่สาขา",
      Address_Number: "183/493",
      Moo: "",
      Village: "",
      Soi: "",
      Street: "แจ้งวัฒนะ",
      Sub_District: "ทุ่งสองห้อง",
      District: "หลักสี่",
      Province: "กรุงเทพมหานคร",
      Postcode: "10210",
      Branch_Code: "00000",
      Phone: "",
      Fax: "",
      Mobile_Phone: "",
      E_Mail: "",
    },
    {
      Office_Name: "ที่อยู่สาขา",
      Address_Number: "183/493",
      Moo: "",
      Village: "",
      Soi: "",
      Street: "แจ้งวัฒนะ",
      Sub_District: "ทุ่งสองห้อง",
      District: "หลักสี่",
      Province: "กรุงเทพมหานคร",
      Postcode: "10210",
      Branch_Code: "00000",
      Phone: "",
      Fax: "",
      Mobile_Phone: "",
      E_Mail: "",
    },
  ];

  /** แมป raw → โครงสร้างที่ใช้เรนเดอร์ */
  const addressCards: AddressCardData[] = rawAddresses.map(a => ({
    title: a.Office_Name,
    branchCode: a.Branch_Code,
    fullAddress: formatAddress(a),
    phone: a.Phone || a.Mobile_Phone,
    fax: a.Fax,
    email: a.E_Mail,
  }));

  useEffect(() => {
    if (id) {
      fetchCorporateById(Number(id));
    }
  }, [id, fetchCorporateById]);

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading corporate data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50/40">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 gap-6">
            {[
              { label: "ชื่อนิติบุคคล", value: corporate.Name_TH || "-" },
              { label: "ชื่อภาษาอังกฤษ", value: corporate.Name_EN || "-" },
              { label: "เลขทะเบียนนิติบุคคล", value: corporate.Registration_No || "-" },
              { label: "ประเภทการให้บริการ", value: corporate.Corporate_Service_Name || "-" },
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
      </div>
      <Tabs defaultValue="page1" className="md:w-auto h-full w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="page1">
            <Icon icon="solar:buildings-2-bold-duotone" width="24" height="24" className="mr-2" />
            <b>ข้อมูลนิติบุคคล</b>
          </TabsTrigger>
          <TabsTrigger value="page2">
            <Icon icon="hugeicons:maps-location-02" width="24" height="24" className="mr-2" />
            <b>ที่อยู่</b>
          </TabsTrigger>
          <TabsTrigger value="page3">
            <Icon icon="mingcute:group-3-line" width="24" height="24" className="mr-2" />
            <b>รายนาม/พนักงาน</b>
          </TabsTrigger>
          <TabsTrigger value="page4">
            <Icon icon="fluent:building-bank-toolbox-20-regular" width="24" height="24" className="mr-2" />
            <b>รายละเอียดหลักประกัน</b>
          </TabsTrigger>
          <TabsTrigger value="page5">
            <Icon icon="fluent:document-folder-20-regular" width="24" height="24" className="mr-2" />
            <b>เอกสารในการสมัคร</b>
          </TabsTrigger>
          <TabsTrigger value="page6">
            <Icon icon="fluent:document-bullet-list-clock-20-regular" width="24" height="24" className="mr-2" />
            <b>ประวัติคำขอและการชำระเงิน</b>
          </TabsTrigger>
        </TabsList>
        <div className="p-5 border-collapse border-b-2 border-r-2 border-l-2 border-blue-100/75">
          <TabsContent value="page1" className="border-collapse">
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50 ">
                <CardTitle className="text-lg font-bold">ข้อมูลนิติบุคคล</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 ">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { label: "ประเภทนิติบุคคล", value: corporate.Corporate_Service_Name || "-" },
                    { label: "เลขประจำตัวผู้เสียภาษี", value: corporate.Registration_No || "-" },
                    { label: "เบอร์โทรศัพท์", value: corporate.Mobile_Phone || "-" },
                    { label: "อีเมล", value: corporate.E_Mail || "-" },
                    {
                      label: "สถานะนิติบุคคล",
                      value: (
                        <div className="flex items-center gap-2">
                          <Badge variant="soft" color={corporate.Status === "1" ? "success" : "destructive"}>
                            {corporate.Status_Name || "-"}
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
                    { label: "วันเริ่มประกอบธุรกิจ", value: corporate.Name_TH || "-" },
                    { label: "วันที่ยื่นจดทะเบียนต่อสภา", value: corporate.Name_EN || "-" },
                    { label: "วันที่เริ่มต้นสถานภาพ", value: corporate.Registration_No || "-" },
                    { label: "วันที่สิ้นสถานภาพ", value: corporate.Business_Name || "-" },
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
                    <p className="text-sm text-gray-900 p-2 rounded flex-1">{corporate.Name_TH || "-"}</p>
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
                  {[{ label: "เงินทุนจดทะเบียน", value: corporate.Name_TH || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด" }].map(({ label, value }) => (
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
              <CardHeader className="bg-blue-50/50 m-5">
                <CardTitle className="text-md font-bold">
                  <div className="flex flex-wrap justify-evenly gap-y-4">
                    {/* ทำบัญชี */}
                    <div className="flex items-center gap-1">
                      รายได้จากการประกอบธุรกิจคิดเป็น :<span className="font-bold ml-8">ทำบัญชี</span>
                      <Input type="text" inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                      <span className="font-bold">บาท</span>
                    </div>

                    {/* สอบบัญชี */}
                    <div className="flex items-center gap-1">
                      <span className="font-bold ml-5">สอบบัญชี</span>
                      <Input type="text" inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                      <span className="font-bold">บาท</span>
                    </div>

                    {/* อื่นๆ */}
                    <div className="flex items-center gap-1">
                      <span className="font-bold ml-5">อื่นๆ</span>
                      <Input type="text" inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                      <span className="font-bold">บาท</span>
                    </div>

                    {/* สิ้นรอบบัญชี */}
                    <div className="flex items-center gap-1">
                      <span className="font-bold ml-5">สิ้นรอบบัญชีวันที่</span>
                      <span className="font-bold">31/12/2567</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="page2" className="border-collapse">
            {addressCards.map(card => (
              <Card key={card.title} className="mb-4 border-2 border-blue-100/75">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="text-lg font-bold">{card.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { label: "รหัสสาขา", value: card.branchCode },
                      { label: "ที่อยู่", value: card.fullAddress },
                      { label: "โทรศัพท์", value: card.phone || "-" },
                      { label: "โทรสาร", value: card.fax || "-" },
                      { label: "อีเมล", value: card.email || "-" },
                    ].map(({ label, value }) => (
                      <div className="flex items-start gap-4" key={label}>
                        <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: 140, minWidth: 140 }}>
                          {label}
                        </label>
                        <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="page3" className="border-collapse">
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="font-bold">รายนามกรรมการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StripedRows />
              </CardContent>
            </Card>
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="font-bold">รายนามหัวหน้าสำนักงาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StripedRows />
              </CardContent>
            </Card>
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="font-bold">รายนามผู้ทำบัญชี</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StripedRows />
              </CardContent>
            </Card>
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="font-bold">รายนามผู้สอบบัญชี</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StripedRows />
              </CardContent>
            </Card>
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="font-bold">พนักงานที่ให้บริการงานสอบบัญชี (24)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StaffAuditList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="page4" className="border-collapse">
            <Card className="mb-4 border-2 border-blue-100/75">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="font-bold">รายละเอียดการจัดให้มีหลักประกัน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-4">
                  <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "auto", minWidth: "140px" }}>
                    รายได้รวมสำหรับค่าบริการที่ต้องจัดให้มีหลักประกัน สิ้นรอบปีบัญชี ณ วันที่ :
                  </label>
                  <p className="text-sm text-gray-900 p-2 rounded flex-1">{corporate.nameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด"}</p>
                </div>
                <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
                  {[
                    { label: "เงินทุนจดทะเบียน : ", value: corporate.capital || "0.00" },
                    { label: "รายได้รอบปีบัญชี : ", value: corporate.nameEn || "300" },
                  ].map(({ label, value }) => (
                    <div className="flex items-start gap-4" key={label}>
                      <label className="block text-sm font-bold text-gray-700" style={{ width: "140px", minWidth: "140px" }}>
                        {label}
                      </label>
                      <p className="text-sm text-gray-900 rounded flex-1">{value}</p>
                    </div>
                  ))}
                </div>
                <GuaranteesDetails />
                <div className="p-4">
                  <p>ข้าพเจ้าได้จัดให้มีหลักประกันเพื่อประกันความรับผิดชอบต่อบุคคลที่สามแล้ว ตามกฏกระทรวง เป็นจำนวนไม่น้อยกว่าร้อยละ 3 และในการแจ้งหลักประกันครั้งนี้จำนวนที่มากกว่าในการคิดคำนวณหลักประกันคือ</p>
                </div>
                <div className="p-4 bg-blue-50/50 flex flex-col justify-center items-center">
                  <RadioGroup defaultValue="wrong" className="">
                    <RadioGroupItem size="sm" color="secondary" value="right" id="r_1">
                      <p className="font-bold">ของทุน ณ วันที่ยื่นจดทะเบียนต่อสภาวิชาชีพบัญชี / วันสิ้นรอบปีบัญชี</p>
                    </RadioGroupItem>
                    <RadioGroupItem size="sm" color="secondary" value="wrong" id="r_2">
                      <p className="font-bold">ของรายได้รอบปีบัญชี 2568</p>
                    </RadioGroupItem>
                  </RadioGroup>
                </div>
                <div className="pl-5 pt-3 pb-5 grid grid-cols-1 gap-6">
                  {[
                    { label: "สิ้นรอบปีบัญชี ณ วันที่ : ", value: corporate.nameEn || "M&M ACCOUNTING LIMITED PARTNERSHIP" },
                    { label: "คิดเป็นจำนวนเงิน : ", value: corporate.nameEn || "300" },
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
                <CardTitle className="font-bold">รายละเอียดหลักประกัน : บัญชีเงินฝากประจำ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <DepositAccount />
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
    </>
  );
}
