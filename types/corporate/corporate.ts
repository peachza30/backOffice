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
   Office_Name: string;
   Address_Type_ID: string;
   Address_Type_Name: string;
   Building_Name: string;
   Floor: string;
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
   Remark: string;
   Is_Mail_Address: ActiveFlag;
   Active: ActiveFlag;
}

interface CorporatePerson {
   Person_Type_ID: string;      // 1 = กรรมการ, 2 = หัวหน้าสำนักงาน, ...
   Person_Type_Name: string;
   ID_No: string;              // Thai national ID
   CPA_No: string;
   Accounting_No: string;
   Title_TH: PersonTitleTH;
   First_Name_TH: string;
   Last_Name_TH: string;
   Title_EN: PersonTitleEN;
   First_Name_EN: string;
   Last_Name_EN: string;
   Is_FullTime: ActiveFlag;    // 1 = full‑time
   Is_Authorize: ActiveFlag;   // 1 = authorised signatory
}

interface CorporateEmployee {
   Person_Type_ID: string;      // 6 = หุ้นส่วน, 10 = ผู้ช่วยผู้สอบ
   Person_Type_Name: string;
   Position: string;
   Expert: string;
   Total: string;              // numeric but returned as string
}

interface CorporateGuarantee {
   Corporate_ID: string;
   Guarantee_Type_ID: string;
   Description: string;
   Bank_Year: string;
   Bank_ID: string;
   Bank_Name: string;
   Bank_Branch: string;
   Bank_Account_ID: string;
   Bank_Account_Name: string;
   Bond_Of: string;
   Bond_No: string;
   Bond_Date: string;
   Bond_Due_Date: string;
   Amount: string;
   Year_Number: string;
}

interface CorporateDocument {
   Corporate_Member_Request_ID: string;
   Corporate_ID: string;
   Received_Date: string;
   Document_Type_ID: string;
   File_ID: string;
   URL: string;
}

/** -------------------------------------------------------------
 *  Top‑level Corporate Structure
 *  ------------------------------------------------------------- */

interface Corporate {
   Registration_No: string;
   Name_TH: string;
   Name_EN: string;
   Mobile_Phone: string | null;
   E_Mail: string | null;
   Business_Type_ID: string;
   Business_Name: string;
   Corporate_Service_Type_ID: string;
   Corporate_Service_Name: string;
   Capital: string;                // numeric string (THB)
   Fiscal_Year_End_Date: IsoDateString;
   Accounting_Revenue: string;
   Auditing_Revenue: string;
   Other_Revenue: string;
   Begin_Date: IsoDateString;
   Expired_Date: IsoDateString;
   Status: string;
   Status_Name: string;
   Accounting_Customer_Amount: string;
   Accounting_Customer_Income: string;
   Accounting_Customer_None_Amount: string;
   Accounting_Customer_None_Income: string;
   Auditoring_Customer_Amount: string;
   Auditoring_Customer_Income: string;
   Auditoring_Customer_None_Amount: string;
   Auditoring_Customer_None_Income: string;

   /** Nested collections */
   address: CorporateAddress[];
   person: CorporatePerson[];
   employee: CorporateEmployee[];
   guarantee: CorporateGuarantee[];
   document: CorporateDocument[];
}

/** A convenience wrapper matching the exact API response shape */
interface CorporateResponse {
   data: Corporate;
}

interface CorporateStore {
   loading: boolean;
   error: string | null;
   corporates: Corporate[];
   corporate: Corporate | null;
   // requests: CorporateRequest[];
   // request: CorporateRequest | null;
   documents: any[];
   mode: "create" | "edit" | "view" | null;
   metadata: ApiMetadata | null;
   total: number;

   // ##### Methods ####
   setMode: (mode: "create" | "edit" | "view") => void;

   // Corporate-List
   fetchCorporates: (params?: FetchParams) => Promise<void>;
   fetchCorporateById: (id: number) => Promise<void>;
   fetchCorporateDocuments: () => Promise<void>;
   // createCorporate: (data: CorporatePayload, params?: any) => Promise<void>;
   // updateCorporate: (id: number, data: CorporatePayload, params?: any) => Promise<void>;
   deleteCorporate: (id: number, params?: FetchParams) => Promise<void>;

   // Corporate-Request
   fetchCorporateRequests: (params: FetchParams) => Promise<void>;
   fetchCorporateRequest: (id: number) => Promise<void>;
   // createCorporateRequest: (data: CorporateRequest, params: FetchParams) => Promise<void>;
   // updateCorporateRequest: (id: number, data: CorporateRequest, params: FetchParams) => Promise<void>;
   deleteCorporateRequest: (id: number, params: FetchParams) => Promise<void>;
}