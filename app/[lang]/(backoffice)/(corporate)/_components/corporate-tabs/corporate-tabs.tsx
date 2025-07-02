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

export default function CorporateView({ id }: { id: number }) {
  const router = useRouter();
  const { corporate, fetchCorporateById } = useCorporateStore();

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
              { label: "ชื่อนิติบุคคล", value: corporate.nameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด" },
              { label: "ชื่อภาษาอังกฤษ", value: corporate.nameEn || "M&M ACCOUNTING LIMITED PARTNERSHIP" },
              { label: "เลขทะเบียนนิติบุคคล", value: corporate.registrationNo || "0655567000425" },
              { label: "ประเภทการให้บริการ", value: corporate.businessTypeId || "ห้างหุ้นส่วนจำกัด" },
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
          <TabsContent value="page1" className="border-2 border-collapse border-blue-100/75">
            <Card className="mb-4 ">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="text-lg font-bold">ข้อมูลนิติบุคคล</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { label: "ชื่อนิติบุคคล", value: corporate.nameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด" },
                    { label: "ชื่อภาษาอังกฤษ", value: corporate.nameEn || "M&M ACCOUNTING LIMITED PARTNERSHIP" },
                    { label: "เลขทะเบียนนิติบุคคล", value: corporate.registrationNo || "0655567000425" },
                    { label: "ประเภทการให้บริการ", value: corporate.businessTypeId || "ห้างหุ้นส่วนจำกัด" },
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
            <Card className="mb-4">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="text-lg font-bold">วันสำคัญและการจดทะเบียน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { label: "วันเริ่มประกอบธุรกิจ", value: corporate.nameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด" },
                    { label: "วันที่ยื่นจดทะเบียนต่อสภา", value: corporate.nameEn || "M&M ACCOUNTING LIMITED PARTNERSHIP" },
                    { label: "วันที่เริ่มต้นสถานภาพ", value: corporate.registrationNo || "0655567000425" },
                    { label: "วันที่สิ้นสถานภาพ", value: corporate.businessTypeId || "ห้างหุ้นส่วนจำกัด" },
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
                    <p className="text-sm text-gray-900 p-2 rounded flex-1">{corporate.nameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-4">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="text-lg font-bold">ข้อมูลทางธุรกิจและการเงิน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 gap-6">
                  {[{ label: "เงินทุนจดทะเบียน", value: corporate.nameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด" }].map(({ label, value }) => (
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
            <Card className="mb-4">
              <CardHeader className="bg-blue-50/50 m-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  รายได้จากการประกอบธุรกิจคิดเป็น :<span className="font-bold ml-1">ทำบัญชี</span>
                  <div className="flex items-center ml-2 gap-1">
                    <Input type="text" inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                    <span className="font-bold">บาท</span>
                  </div>
                  <span className="font-bold ml-10">สอบบัญชี</span>
                  <div className="flex items-center ml-2 gap-1">
                    <Input type="text" inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                    <span className="font-bold">บาท</span>
                  </div>
                  <span className="font-bold ml-10">อื่นๆ</span>
                  <div className="flex items-center ml-2 gap-1">
                    <Input type="text" inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
                    <span className="font-bold">บาท</span>
                  </div>
                  <span className="font-bold ml-10">สิ้นรอบบัญชีวันที่</span>
                  <div className="flex items-center ml-2 gap-1">
                    <span className="font-bold">31/12/2567</span>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="page2" className=" border-2 border-collapse border-blue-100/75">
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle>ที่อยู่</CardTitle>
                <CardDescription>Change your password here. After saving, be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="page3" className="border-2 border-collapse border-blue-100/75">
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle>รายนาม/พนักงาน</CardTitle>
                <CardDescription>Change your password here. After saving, be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="page4" className="border-2 border-collapse border-blue-100/75">
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle>รายละเอียดหลักประกัน</CardTitle>
                <CardDescription>Change your password here. After saving, be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="page5" className="border-2 border-collapse border-blue-100/75">
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle>เอกสารในการสมัคร</CardTitle>
                <CardDescription>Change your password here. After saving, be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="page6" className="border-2 border-collapse border-blue-100/75">
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle>ประวัติคำขอและการชำระเงิน</CardTitle>
                <CardDescription>Change your password here. After saving, be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
