/* --------------------------------------------------------------------------
 * Corporate data model (v1)
 * --------------------------------------------------------------------------
 * This file declares strongly‑typed TypeScript interfaces that match the
 * structure of the sample JSON returned by the corporate profile API.
 * If future API versions introduce new fields, extend these interfaces in a
 * backward‑compatible way (use `?` for newly optional keys, do NOT delete keys).
 * -------------------------------------------------------------------------- */


/** -------------------------------------------------------------
 *  Basic Literal Unions & Helpers
 *  ------------------------------------------------------------- */

/* ───────────────────── Common / Helpers ───────────────────── */

type EditTypeId =
  | 1 // Transformation
  | 2 // JurLocation
  | 4 // Manager
  | 5 // Accountant
  | 6 // IssueBook
  | 7 // ServiceType
  | 8 // HeadOffice
  | 9 // Examiner
  | 10; // Beyond

/** ทุกตัวมี editUser / editDate เหมือนกัน */
interface DetailsBase<TKind extends string> {
  type: TKind;
  editUser: string;
  editDate: string; // ISO string
}

/** ฟิลด์เปลี่ยนค่าชนิด key-value */
interface FieldChange {
  old: string;
  new: string;
  label: string;
}

/* ───────────────────── Details by editType ───────────────────── */

/** 1) Transformation */
interface TransformationDetails extends DetailsBase<"Transformation"> {
  changes: {
    nameTh: FieldChange;
    nameEn: FieldChange;
    number: FieldChange;
    type: FieldChange;
  };
}

/** 2) JurLocation */
interface JurLocationDetails extends DetailsBase<"JurLocation"> {
  changes: {
    no: FieldChange;
    road: FieldChange;
    subDistrict: FieldChange;
    district: FieldChange;
    province: FieldChange;
    postCode: FieldChange;
    telePhone: FieldChange;
    mobile: FieldChange;
    email: FieldChange;
  };
}

/** 4) Manager */
interface ManagerChange {
  id: number;
  change: "เพิ่ม" | "คัดลอก" | "แก้ไข" | "ลบ" | string; // กันเผื่ออนาคต
  title: string;
  name: string;
  lastname: string;
  nationality: string;
  citizenId: string;
  license: string;
  passport: string;
}
interface ManagerDetails extends DetailsBase<"Manager"> {
  changes: ManagerChange[];
}

/** 5) Accountant */
interface AccountantChange {
  id: number;
  change: "เพิ่ม" | "คัดลอก" | "แก้ไข" | "ลบ" | string;
  title: string;
  name: string;
  lastname: string;
  citizenId: string;
  working: string;
}
interface AccountantDetails extends DetailsBase<"Accountant"> {
  changes: AccountantChange[];
}

/** 6) IssueBook */
interface IssueBookDetails extends DetailsBase<"IssueBook"> {
  changes: {
    choice: {
      value: string;
      label: string;
    };
  };
}

/** 7) ServiceType */
interface ServiceTypeDetails extends DetailsBase<"ServiceType"> {
  changes: {
    serviceType: FieldChange;
  };
}

/** 8) HeadOffice */
interface HeadOfficeDetails extends DetailsBase<"HeadOffice"> {
  changes: {
    name: string;
    lastname: string;
    numberAccount: string;
    citizenId: string;
    workingTime: string;
    changedBy: string; // "เพิ่ม", "แก้ไข" ฯลฯ
  };
}

/** 9) Examiner */
interface ExaminerChange {
  id: number;
  change: "เพิ่ม" | "คัดลอก" | "แก้ไข" | "ลบ" | string;
  title: string;
  name: string;
  lastname: string;
  allowAccount: string;
  citizenId: string;
  working: string;
}
interface ExaminerDetails extends DetailsBase<"Examiner"> {
  changes: ExaminerChange[];
}

/** 10) Beyond */
interface BeyondDetails extends DetailsBase<"Beyond"> {
  changes: {
    lastData: BeyondDataBlock;
    editData: BeyondDataBlock;
  };
}
interface BeyondDataBlock {
  amountEmployee: string;
  amountPartner: string;
  amountSeniorManager: string;
  amountManager: string;
  amountSenior: string;
  amountJunior: string;
  amountOther: string;
  totalAmount: string;
}

/* ───────────────────── Union Type ───────────────────── */

type EditDetails =
  | TransformationDetails
  | JurLocationDetails
  | ManagerDetails
  | AccountantDetails
  | IssueBookDetails
  | ServiceTypeDetails
  | HeadOfficeDetails
  | ExaminerDetails
  | BeyondDetails;

/** โครงหลักของแต่ละ item */
interface CorporateEditListItem {
  id: number;
  corporateMemberRequestId: number;
  editTypeId: EditTypeId;
  details: EditDetails;
  active: 0 | 1;
}

/** Thai/English title abbreviations commonly used in person records */
type PersonTitleTH =
  | "นาย"
  | "นาง"
  | "นางสาว"
  | string;

type PersonTitleEN = string;

/** ISO‑8601 date string – e.g. "2025-02-21T17:00:00.000Z" */
type IsoDateString = string;

/** 0 = inactive / 1 = active (as string in API) */
type ActiveFlag = "0" | "1" | string;

/** -------------------------------------------------------------
 *  Nested Object Structures
 *  ------------------------------------------------------------- */
interface CorporateAddress {
  officeName: string;
  addressTypeId: string;
  addressTypeName: string;
  buildingName: string;
  floor: string;
  addressNumber: string;
  moo: string;
  village: string;
  soi: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postcode: string;
  branchCode: string;
  phone: string;
  fax: string;
  mobilePhone: string;
  email: string;
  remark: string;
  isMailAddress: ActiveFlag;
  active: ActiveFlag;
}

interface CorporatePerson {
  personTypeId: string;      // 1 = กรรมการ, 2 = หัวหน้าสำนักงาน, ...
  personTypeName: string;
  idNo: string;              // Thai national ID
  cpaNo: string;
  accountingNo: string;
  titleTh: PersonTitleTH;
  firstNameTh: string;
  lastNameTh: string;
  titleEn: PersonTitleEN;
  firstNameEn: string;
  lastNameEn: string;
  isFullTime: ActiveFlag;    // 1 = full‑time
  isAuthorize: ActiveFlag;   // 1 = authorised signatory
}

interface CorporateEmployee {
  personTypeId: string;      // 6 = หุ้นส่วน, 10 = ผู้ช่วยผู้สอบ
  personTypeName: string;
  position: string;
  expert: string;
  total: string;             // numeric but returned as string
}

interface CorporateGuarantee {
  corporateId: string;
  guaranteeTypeId: string;
  guaranteeTypeName: string;
  description: string;
  bankYear: string;
  bankId: string;
  bankName: string;
  bankBranch: string;
  bankAccountId: string;
  bankAccountName: string;
  bondOf: string;
  bondNo: string;            // เลขที่พันธบัตร / เลขกรมธรรม์
  bondDate: string;          // วันที่ออก
  bondDueDate: string;       // วันที่ครบกำหนด
  amount: string;            // จำนวนเงิน (บาท) — เก็บเป็น string จาก API
  yearNumber: string;        // ฝากประจำ (ปี)
}

interface CorporateDocument {
  id: number,
  corporateMemberRequestId: number,
  corporateId: number,
  receivedDate: string,
  documentTypeId: number,
  fileId: string,
  documentName: string,
  urlFile: string
}

/* ── Top‑level structure ─────────────────────────────────────── */

interface CorporateList {
  id: string;
  taxId: string;
  registrationNo: string;
  nameTh: string;
  nameEn: string;
  mobilePhone: string | null;
  email: string | null;
  businessTypeId: string;
  businessName: string;
  corporateServiceTypeId: string;
  corporateServiceName: string;
  capital: string;                       // numeric string (THB)
  fiscalYearEndDate: IsoDateString;
  accountingRevenue: string;
  auditingRevenue: string;
  otherRevenue: string;
  beginDate: IsoDateString;
  expiredDate: IsoDateString;
  status: string;
  statusName: string;
  accountingCustomerAmount: string;
  accountingCustomerIncome: string;
  accountingCustomerNoneAmount: string;
  accountingCustomerNoneIncome: string;
  auditoringCustomerAmount: string;
  auditoringCustomerIncome: string;
  auditoringCustomerNoneAmount: string;
  auditoringCustomerNoneIncome: string;
  registrationDate: string;
  dbdRegistrationDate: string;
  requestDateTypeDate: string;
  remark: string;
  totalRevenue: number;
  createdBy: number | null;
  createdAt: string;          // ISO date string
  updatedBy: number | null;
  updatedAt: string;          // ISO date string
  deletedBy: number | null;
  deletedAt: string | null;   // ISO date string or null

  /** Nested collections */
  address: CorporateAddress[];
  person: CorporatePerson[];
  employee: CorporateEmployee[];
  guarantee: CorporateGuarantee[];
  document: CorporateDocument[];
}
/** Corporate-level request returned from the back-office API */
/* ── Root ────────────────────────────────────────────────────────────── */



/* ── Address ─────────────────────────────────────────────────────────── */

interface CorporateRequestAddress {
  id: number;
  branchCode: string;
  corporateMemberRequestId: number;
  corporateId: number;
  registrationNo: string;
  officeName: string;
  addressTypeId: number;
  addressTypeName: number;
  businessTypeId: number;
  position: string;
  buildingName: string;
  floor: string;
  addressNumber: string;
  moo: string;
  village: string | null;
  soi: string;
  street: string;
  addressOversea: string | null;
  subDistrict: string;
  district: string;
  province: string;
  postcode: string;
  phone: string;
  fax: string;
  mobilePhone: string;
  email: string;
  isMailAddress: 0 | 1;
  active: 0 | 1;
}

/* ── Employee (head-count summary by role) ───────────────────────────── */

interface CorporateRequestEmployee {
  id: number;
  corporateMemberRequestId: number;
  corporateId: number;
  registrationNo: string;
  personTypeId: number;
  position: string;
  expert: string | null;
  total: number;
}

/* ── Guarantee (bank bond / BG) ──────────────────────────────────────── */

interface CorporateRequestGuarantee {
  id: number;
  description: string;
  bankYear: number;
  bankId: number;
  bankName: string;
  bankBranch: string;
  bankAccountId: string;
  bankAccountName: string;
  bondOf: string;
  bondNo: string;
  bondDate: string | null;
  bondDueDate: string | null;
  amount: string;
  yearNumber: string;
  guaranteeTypeId: string;
  corporateMemberRequestId: number;
  corporateId: number;
}

/* ── Person (individual partner / staff) ─────────────────────────────── */

interface CorporateRequestPerson {
  id: number;
  corporateMemberRequestId: number;
  corporateId: number;
  registrationNo: string;
  personTypeId: number;
  idNo: string;
  cpaNo: string;
  accountingNo: string;
  titleTh: string;
  firstNameTh: string;
  lastNameTh: string;
  titleEn: string;
  firstNameEn: string;
  lastNameEn: string;
  isFullTime: 0 | 1;
  isAuthorize: 0 | 1;
}

/* ── Unknown / placeholder for future definition ─────────────────────── */

interface CorporateRequestDocument {
  documentTypeId: number,
  documentName: string,
  documents: {
    id: number,
    corporateId: number,
    corporateMemberRequestId: number,
    fileId: string,
    receivedDate: string,
    urlFile: string
  }[]
}

interface CorporateRequest {
  /* identifying info */
  id: number;
  no: string;

  /* registration */
  registrationNo: string;
  taxId: string;

  /* names */
  nameTh: string;
  nameEn: string;
  nameThPrevious: string;
  nameEnPrevious: string;

  /* contact */
  mobilePhone: string;
  email: string;

  /* dates */
  dbdRegistrationDate: string | null;
  registrationDate: string | null;
  fiscalYearEndDate: string | null;
  requestDate: string | null;
  documentReceiveDate: string | null;
  effectiveDate: string | null;
  beginDate: string | null;
  expiredDate: string | null;
  approveDate: string | null;
  beginDatePrevious: string | null;
  expiredDatePrevious: string | null;
  createDate: string;
  updateDate: string;
  requestDateTypeDate: string | null;
  objectiveRegistraionDate: string | null;

  /* numbers & money (kept as strings to avoid FP issues) */
  capital: string;
  revenueYear: string;
  accountingRevenue: string;
  auditingRevenue: string;
  otherRevenue: string;
  totalRevenue: string;
  fee: string;
  totalGuarantee: string;

  /* enums / ids */
  rateType: number;
  requestFormId: number;
  channel: string;
  membershipPeriod: number;
  requestStatus: number;
  paymentStatus: number;
  requestDateType: number;
  accountingCustomerAmount: number;
  accountingCustomerIncome: number;
  accountingCustomerNoneAmount: number;
  accountingCustomerNoneIncome: number;
  auditoringCustomerAmount: number;
  auditoringCustomerIncome: number;
  auditoringCustomerNoneAmount: number;
  auditoringCustomerNoneIncome: number;
  auditoringTotalIncome: number;
  accountingTotalIncome: number;
  corporateId: number;
  businessTypeId: number;
  serviceTypeId: number;
  applicationRequestId: string | null;

  /* misc flags */
  isFirstTimeGuarantee: "0" | "1";
  isAuditedFinancialReport: "0" | "1";

  /* refs / remarks */
  description: string;
  approveUser: string | null;
  remark: string;
  remark2: string;
  refCode1: string | null;
  refCode2: string | null;
  cancleCorporate: string;
  cancleCorporateRemark: string;
  etaxUrl: string;

  /* lookup‐friendly display names */
  businessTypeName: string;
  serviceTypeName: string;
  requestFormName: string;
  requestStatusName: string;
  paymentStatusName: string;

  created_by: number | null;
  created_at: string; // ISO date string
  updateUser: number | null;
  deleted_by: number | null;
  deleted_at: string | null; // ISO date string

  /* nested collections */
  address: CorporateRequestAddress[];
  document: CorporateRequestDocument[]; // not defined in sample
  employee: CorporateRequestEmployee[];
  guarantee: CorporateRequestGuarantee[];
  person: CorporateRequestPerson[];
  edit_list: CorporateEditListItem[];
}

interface CorporateDocumentView {
  success: boolean;
  url: string;
  type: string;
  isEmpty: boolean;
  hasValue: boolean;
  length: number;
}
interface CorporateDocumentPayload {
  fileId: number;
  remark: string;
  status: number;
  active: number;
}

interface CorporateRequestForm {
  id: number;
  name: string;
  description: string;
  menuNo: string;
  noSerieCode: string;
  invoiceNoSerieCode: string;
  active: number;
  keyDirectActive: number;
}
interface CorporateRequestStatus {
  id: number;
  name: string;
  description: string;
  active: number;
}
type CorporateDocumentItem = {
  id: number;
  corporateMemberRequestId: number;
  corporateId: number;
  receivedDate?: string;
  fileId: string;
  urlFile?: string; // อาจว่างได้
};

interface CorporateReport {
  id: string;
  taxId: string;
  registrationNo: string;
  nameTh: string;
  nameEn: string;
  mobilePhone: string | null;
  email: string | null;
  businessTypeId: string;
  businessName: string;
  corporateServiceTypeId: string;
  corporateServiceName: string;
  capital: string;                       // numeric string (THB)
  fiscalYearEndDate: IsoDateString;
  accountingRevenue: string;
  auditingRevenue: string;
  otherRevenue: string;
  beginDate: IsoDateString;
  expiredDate: IsoDateString;
  status: string;
  statusName: string;
  accountingCustomerAmount: string;
  accountingCustomerIncome: string;
  accountingCustomerNoneAmount: string;
  accountingCustomerNoneIncome: string;
  auditoringCustomerAmount: string;
  auditoringCustomerIncome: string;
  auditoringCustomerNoneAmount: string;
  auditoringCustomerNoneIncome: string;
  registrationDate: string;
  dbdRegistrationDate: string;
  requestDateTypeDate: string;
  remark: string;
  totalRevenue: number;
  createdBy: number | null;
  createdAt: string;          // ISO date string
  updatedBy: number | null;
  updatedAt: string;          // ISO date string
  deletedBy: number | null;
  deletedAt: string | null;   // ISO date string or null

  /** Nested collections */
  address: CorporateAddress[];
  person: CorporatePerson[];
  employee: CorporateEmployee[];
  guarantee: CorporateGuarantee[];
  document: CorporateDocument[];
}

interface CorporateUpdatePayload {
  ApplicationRequest_ID: string;
  Registration_No: string;
  Status: string;
  Fee: string; // ถ้าอยากให้เป็นตัวเลขเปลี่ยนเป็น number
  Remark: string | null;
  DueDateForPayFee: string; // หรือ Date ถ้าจะ parse ก่อนส่ง
  E_Mail: string;
}
interface CorporateUpdateResponse {
  success: boolean;
  message: string;
  data: {
    status: number;
    message: string;
    errorCode: number;
    errorMessage: string | null;
  }
}

interface CorporateStore {
  loading: boolean;
  error: string | null;
  corporates: CorporateList[];
  corporate: CorporateList | null;
  requests: CorporateRequest[];
  request: CorporateRequest | null;
  requestForm: CorporateRequestForm[];
  requestStatus: CorporateRequestStatus[];
  editList: any;
  documents: CorporateDocumentView | null;
  updated: CorporateUpdateResponse | null;
  mode: "create" | "edit" | "view" | null;
  remark: string | null;
  metadata: ApiMetadata | null;
  total: number;
  documentPayload: CorporateDocumentPayload | null;

  // ##### Methods ####
  setMode: (mode: "create" | "edit" | "view") => void;
  setRemark: (remark: string) => void;
  setDocumentPayload: (payload: CorporateDocumentPayload) => void;

  // Corporate-List
  fetchCorporatesList: (params?: FetchParams) => Promise<void>;
  fetchCorporateListById: (id: number) => Promise<void>;
  fetchCorporateDocuments: (id) => Promise<void>;
  // createCorporate: (data: CorporatePayload, params?: any) => Promise<void>;
  // updateCorporate: (id: number, data: CorporatePayload, params?: any) => Promise<void>;
  deleteCorporateList: (id: string, params?: FetchParams) => Promise<void>;

  // Corporate-Request
  fetchCorporateRequests: (params: FetchParams) => Promise<void>;
  fetchCorporateRequest: (id: number) => Promise<void>;
  fetchCorporateRequestForm: () => Promise<void>;
  fetchCorporateRequestStatus: () => Promise<void>;
  fetchRequestEditList: () => Promise<void>;
  fetchCorporateRequestByCorporate: (corporateId: number) => Promise<void>;
  // createCorporateRequest: (data: CorporateRequest, params: FetchParams) => Promise<void>;
  updateCorporateRequest: (payload: CorporateUpdatePayload) => Promise<void>;
  deleteCorporateRequest: (id: number, params: FetchParams) => Promise<void>;
}