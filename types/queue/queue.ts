// ── Supporting unions ───────────────────────────────────────────────
type MemberEventType = 'MEMBER_REGISTERED' | 'MEMBER_UPDATED' | string;
type MemberStatus   = 'failed' | 'success' | 'pending'        | string;

// ── Payload ที่ซ้อนอยู่ในแต่ละ log ──────────────────────────────────
interface MemberPayload {
  id_no: string;
  title: string;
  status: string;
  exchange: string;
  college_id: string;
  event_type: MemberEventType;
  routingKey: string;
  member_name: string;
  member_type: string;
  rabbitmq_id: string;
  received_at: string;       // "YYYY-MM-DD HH:mm:ss"
  status_name: string;
  college_name: string;
  education_id: string;
  expired_date: string;      // "YYYY-MM-DD"
  curriculum_id: string;
  curriculum_name: string;
  education_level: string;
  member_type_name: string;
  system_generated: boolean;
  registration_date: string; // "YYYY-MM-DD"
}

// ── Log “ตัวเดียว” ที่จะโชว์ในตาราง/เก็บใน store ───────────────────
interface MemberEventData {
  id: number;
  payload: MemberPayload;
  id_no: string;                  // duplicate for quick access
  event_type: MemberEventType;
  status: MemberStatus;
  error_message: string;
  created_at: string;             // ISO-8601
  received_at: string;            // "YYYY-MM-DD HH:mm:ss"
  rabbitmq_id: string;
  active: 0 | 1;                  // boolean-ish
}

// ── สำหรับข้อมูล meta (paging) ที่ backend ส่งมาด้วย ────────────────
interface ApiMetadata {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
