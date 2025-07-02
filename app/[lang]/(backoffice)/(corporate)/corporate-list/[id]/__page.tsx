"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

const ViewDataPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const { id } = params;
  const { corporate, fetchCorporateById } = useCorporateStore();
  

  useEffect(() => {
    if (id) {
      fetchCorporateById(id);
    }
  }, [id, fetchCorporateById]);

  const handleEdit = () => {
    router.push(`/corporate/${id}`);
  };

  const handleBack = () => {
    router.back();
  };
  console.log("corporate", corporate);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Corporate Information</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name (Thai)
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.companyNameTh || "บริษัท เอ็ม แอนด์ เอ็ม แอ็คเค้าท์ติ้ง จำกัด"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name (English)
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.companyNameEn || "M&M ACCOUNTING LIMITED PARTNERSHIP"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.registrationNumber || "0655567000425"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.businessType || "ห้างหุ้นส่วนจำกัด"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Address
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded leading-relaxed">
                {corporate.registeredAddress || 
                  "ชั้น 1 อาคารเรสซิเดนซ์ ซอย ท่าอิฐ 4 ตำบล ท่าอิฐ อำเภอ ท่าอิฐ จังหวัด นนทบุรี 11190"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded leading-relaxed">
                {corporate.businessAddress || 
                  "ชั้น 1 อาคารเรสซิเดนซ์ ซอย ท่าอิฐ 4 ตำบล ท่าอิฐ อำเภอ ท่าอิฐ จังหวัด นนทบุรี 11190"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.phoneNumber || "02-685-2500"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fax Number
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.faxNumber || "02-685-2500"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {corporate.email || "mand@mmfirm.co.th"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Partners Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Partner 1 */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Partner #1</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Sequence Number
                  </label>
                  <p className="text-sm text-gray-900">1</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    ชั้น 1 อาคารเรสซิเดนซ์ ซอย ท่าอิฐ 4 ตำบล ท่าอิฐ อำเภอ ท่าอิฐ จังหวัด นนทบุรี 11190
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">02-139-9637</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">mm.acc25@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Partner 2 */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Partner #2</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Sequence Number
                  </label>
                  <p className="text-sm text-gray-900">2</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <p className="text-sm text-gray-900">
                    นาย 123 ถนนใหญ่ 21 เขตหนองแขม เมือง กรุงเทพมหานคร 10160
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">02-139-9637</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">mm.acc25@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
          Edit Information
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Print Document
        </Button>
      </div>
    </div>
  );
};

export default ViewDataPage;