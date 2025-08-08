// File: helpers.ts
export const PERSON_META: Record<string, { title: string }> = {
  "1": { title: "รายนามกรรมการ" },
  "2": { title: "รายนามหัวหน้าสำนักงาน" },
  "3": { title: "รายนามผู้ทำบัญชี" },
  "5": { title: "รายนามผู้สอบบัญชี" },
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

export const mapAddressCards = (addresses: any[] = []) =>
  addresses.map(a => ({
    type: a.addressTypeId ?? "-",
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
    label: e.position || e.personTypeName,
    count: Number(e.total ?? 0),
  }));