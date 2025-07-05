// Company.ts
interface CorporateList {
   id: number;
   registrationNo: string;
   taxId: string;
   nameTh: string;
   nameEn: string;
   mobilePhone: string;
   email: string;
   dbdRegistrationDate: string | null;
   registrationDate: string | null;
   businessTypeId: number;
   corporateServiceTypeId: number;
   capital: string;
   revenueYear: string;
   fiscalYearEndDate: string;
   accountingRevenue: string;
   auditingRevenue: string;
   otherRevenue: string;
   rateType: number;
   beginDate: string;
   expiredDate: string;
   remark: string;
   status: number;
   updateByRequestNo: string;
   updateByRequestFormId: number;
   createDate: string | null;
   updateDate: string;
   updateUser: string;
   requestDateType: number;
   requestDateTypeDate: string;
   accountingCustomerAmount: number;
   accountingCustomerIncome: string;
   accountingCustomerNoneAmount: number;
   accountingCustomerNoneIncome: string;
   auditoringCustomerAmount: number;
   auditoringCustomerIncome: string;
   auditoringCustomerNoneAmount: number;
   auditoringCustomerNoneIncome: string;
   isShowCustomer: number;
}

// types.ts

interface CorporatePayload {
   registrationNo: string;
   taxId: string;
   nameTh: string;
   nameEn: string;
   mobilePhone: string;
   email: string;
   businessTypeId: number;
   corporateServiceTypeId: number;
   capital: number;
   revenueYear: string;
   fiscalYearEndDate: string; // ISO format e.g., "2024-12-31T00:00:00.000Z"
   accountingRevenue: number;
   auditingRevenue: number;
   otherRevenue: number;
   rateType: number;
   beginDate: string;
   expiredDate: string;
   remark: string;
   status: number;
   updateByRequestNo: string;
   updateByRequestFormId: number;
   updateUser: string;
   requestDateType: number;
   requestDateTypeDate: string;
   accountingCustomerAmount: number;
   accountingCustomerIncome: number;
   accountingCustomerNoneAmount: number;
   accountingCustomerNoneIncome: number;
   auditoringCustomerAmount: number;
   auditoringCustomerIncome: number;
   auditoringCustomerNoneAmount: number;
   auditoringCustomerNoneIncome: number;
   isShowCustomer: number;
}


interface CorporateRequest {
   id: number;
   requestNo: string;
   requestType: number;
   registrationNo: string;
   taxId: string;
   nameTh: string;
   nameEn: string;
   mobilePhone: string;
   email: string;
   dbdRegistrationDate: string | null;
   registrationDate: string | null;
   businessTypeId: number;
   corporateServiceTypeId: number;
   capital: string;
   revenueYear: string;
   fiscalYearEndDate: string;
   accountingRevenue: string;
   auditingRevenue: string;
   otherRevenue: string;
   rateType: number;
   beginDate: string;
   expiredDate: string;
   remark: string;
   status: number;
   updateByRequestNo: string;
   updateByRequestFormId: number;
   createDate: string | null;
   updateDate: string;
   updateUser: string;
   requestDateType: number;
   requestDateTypeDate: string;
   accountingCustomerAmount: number;
   accountingCustomerIncome: string;
   accountingCustomerNoneAmount: number;
   accountingCustomerNoneIncome: string;
   auditoringCustomerAmount: number;
   auditoringCustomerIncome: string;
   auditoringCustomerNoneAmount: number;
   auditoringCustomerNoneIncome: string;
   isShowCustomer: number;
}

interface Address {
   Address_Number: string;
   Moo: string;
   Soi: string;
   Building_Name: string;
   Building_Room_No: string;
   Floor: string;
   Street: string;
   Sub_District: string;
   SubDisText: string;
   District: string;
   DisText: string;
   Province: string;
   ProvText: string;
   Postcode: number;
   Latitude: string;
   Longitude: string;
   GeoCode: number;
   Phone: string;
   Fax: string;
   Mobile_Phone: string;
   E_Mail: string;
   Address_Type_ID: number;
   Branch_Number: string;
   Is_Mail_Address: number;
   Is_Receipt_Address: number;
}

interface Person {
   Order: number;
   Person_Type_ID: number;
   ID_No: string;
   CPA_No: string;
   Accounting_No: string;
   Title_TH: string;
   First_Name_TH: string;
   Last_Name_TH: string;
   CanSigned: string;
   CanFulltime: string;
   Is_FullTime: number;
   Is_Authorize: number;
   Nationality: string;
   OtherNationality: string;
   Type: string;
   Member_Expire_Date: string;
}

interface Worker {
   Sum_Worker: string;
   Worker_Position: WorkerPosition[];
}

interface WorkerPosition {
   Position_Type_ID: number;
   Position: string;
   Count: string;
}

interface Guarantee {
   Guarantee_Type_ID: number;
   Guarantee_Type: string;
   Description: string;
   Bank_Name: string;
   Bank_Branch: string;
   Bank_Account_ID: string;
   Bank_Account_Name: string;
   Due_Date: string;
   Bond_Of: string;
   Bond_No: string;
   Bond_Date: string;
   Bond_Due_Date: string;
   Amount: string;
   Month_Number: string;
   Order: number;
}

interface CorporateStore {
   loading: boolean;
   error: string | null;
   corporates: CorporateList[];
   corporate: CorporateList | null;
   requests: CorporateRequest[];
   request: CorporateRequest | null;
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
   createCorporate: (data: CorporatePayload, params?: any) => Promise<void>;
   updateCorporate: (id: number, data: CorporatePayload, params?: any) => Promise<void>;
   deleteCorporate: (id: number, params?: FetchParams) => Promise<void>;
   
   // Corporate-Request
   fetchCorporateRequests: (params: FetchParams) => Promise<void>;
   fetchCorporateRequest: (id: number) => Promise<void>;
   createCorporateRequest: (data: CorporateRequest, params: FetchParams) => Promise<void>;
   updateCorporateRequest: (id: number, data: CorporateRequest, params: FetchParams) => Promise<void>;
   deleteCorporateRequest: (id: number, params: FetchParams) => Promise<void>;
}