// File: helpers.ts
export const TAB_KEYS = ["information", "address", "employees", "details", "documents"] as const;
export type TabKey = typeof TAB_KEYS[number];

export const TAB_LABELS: Record<TabKey, { label: string; icon: string }> = {
   information: { label: "ข้อมูลนิติบุคคล", icon: "solar:buildings-2-bold-duotone" },
   address: { label: "ที่อยู่", icon: "hugeicons:maps-location-02" },
   employees: { label: "รายนาม/พนักงาน", icon: "mingcute:group-3-line" },
   details: { label: "รายละเอียดหลักประกัน", icon: "fluent:building-bank-toolbox-20-regular" },
   documents: { label: "เอกสารในการสมัคร", icon: "fluent:document-folder-20-regular" },
};

export const PERSON_META: Record<string, { title: string }> = {
   "1": { title: "รายนามกรรมการ" },
   "2": { title: "รายนามหัวหน้าสำนักงาน" },
   "3": { title: "รายนามผู้ทำบัญชี" },
   "5": { title: "รายนามผู้สอบบัญชี" },
};

export type AddressCard = {
   type: string; // normalized to string
   title: string;
   branchCode: string;
   fullAddress: string;
   phone: string;
   fax: string;
   email: string;
};

export const formatAddress = (addr: any) =>
   [
      addr.addressNumber,
      addr.soi && `ซ.${addr.soi}`,
      addr.street && `ถ.${addr.street}`,
      `แขวง${addr.subDistrict}`,
      `เขต${addr.district}`,
      addr.province,
      addr.postcode,
   ]
      .filter(Boolean)
      .join(" ");

export const mapAddressCards = (addresses: any[] = []): AddressCard[] =>
   addresses.map(a => ({
      type: String(a.addressTypeId ?? "-"),
      title: a.addressTypeName ?? "-",
      branchCode: a.branchCode ?? "-",
      fullAddress: formatAddress(a),
      phone: a.phone || a.mobilePhone || "-",
      fax: a.fax || "-",
      email: a.email || "-",
   }));

export const groupPersons = (persons: any[] = []) => {
   const groups = new Map<string, any[]>();
   persons.forEach(p => {
      const t = String(p.personTypeId);
      if (!groups.has(t)) groups.set(t, []);
      groups.get(t)!.push({ ...p, personTypeName: p.personTypeName });
   });
   return Array.from(groups.entries())
      .filter(([type]) => PERSON_META[type])
      .map(([type, rows]) => ({ type, title: PERSON_META[type].title, rows }));
};

export const mapStaffSummary = (employees: any[] = []) =>
   employees.map(e => ({
      icon: "mingcute:group-3-line",
      label: e.position || "-",
      count: Number(e.total ?? 0),
   }));
