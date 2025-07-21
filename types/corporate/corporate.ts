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
   corporateMemberRequestId: string;
   corporateId: string;
   receivedDate: string;
   documentTypeId: string;
   fileId: string;
   url: string;
}

/* ── Top‑level structure ─────────────────────────────────────── */

interface CorporateList {
   id: string;
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

interface CorporateMemberAddress {
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

interface CorporateMemberEmployee {
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

interface CorporateMemberGuarantee {
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
   guaranteeTypeId: number;
   corporateMemberRequestId: number;
   corporateId: number;
}

/* ── Person (individual partner / staff) ─────────────────────────────── */

interface CorporateMemberPerson {
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

interface CorporateMemberDocument extends Record<string, unknown> { }

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
   updateDate: string | null;
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
   applicationRequestId: number | null;

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
   updated_by: number | null;
   updated_at: string; // ISO date string
   deleted_by: number | null;
   deleted_at: string | null; // ISO date string

   /* nested collections */
   corporateMemberAddress: CorporateMemberAddress[];
   corporateMemberDocument: CorporateMemberDocument[]; // not defined in sample
   corporateMemberEmployee: CorporateMemberEmployee[];
   corporateMemberGuarantee: CorporateMemberGuarantee[];
   corporateMemberPerson: CorporateMemberPerson[];

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

interface CorporateStore {
   loading: boolean;
   error: string | null;
   corporates: CorporateList[];
   corporate: CorporateList | null;
   requests: CorporateRequest[];
   // request: CorporateRequest | null;
   request: CorporateList | null;
   requestForm: CorporateRequestForm[];
   documents: any[];
   mode: "create" | "edit" | "view" | null;
   metadata: ApiMetadata | null;
   total: number;

   // ##### Methods ####
   setMode: (mode: "create" | "edit" | "view") => void;

   // Corporate-List
   fetchCorporatesList: (params?: FetchParams) => Promise<void>;
   fetchCorporateListById: (id: number) => Promise<void>;
   fetchCorporateDocuments: () => Promise<void>;
   // createCorporate: (data: CorporatePayload, params?: any) => Promise<void>;
   // updateCorporate: (id: number, data: CorporatePayload, params?: any) => Promise<void>;
   deleteCorporateList: (id: string, params?: FetchParams) => Promise<void>;

   // Corporate-Request
   fetchCorporateRequests: (params: FetchParams) => Promise<void>;
   fetchCorporateRequest: (id: number) => Promise<void>;
   fetchCorporateRequestForm: () => Promise<void>;
   // createCorporateRequest: (data: CorporateRequest, params: FetchParams) => Promise<void>;
   // updateCorporateRequest: (id: number, data: CorporateRequest, params: FetchParams) => Promise<void>;
   deleteCorporateRequest: (id: number, params: FetchParams) => Promise<void>;
}