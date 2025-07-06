interface WebhookLog {
   id: number;
   event_type: string;
   status: string;
   received_at: string;
   errorMessage?: string;
   payload: any;
   rabbitmq_id: string;
   active?: number;
}

// types/memberEvent.ts

// ── Supporting string-literal unions ────────────────────────────────
type MemberEventType = 'MEMBER_REGISTERED' | 'MEMBER_UPDATED' | string;
type MemberStatus = 'failed' | 'success' | 'pending' | string;

/** The inner “payload” object returned by the webhook */
interface MemberPayload {
   id_no: string;
   title: string;          // e.g. "นาย", "นางสาว"
   status: string;          // raw status code (string in the sample)
   exchange: string;
   college_id: string;
   event_type: MemberEventType; // duplicates the top-level type
   routingKey: string;
   member_name: string;
   member_type: string;
   rabbitmq_id: string;
   received_at: string;          // "YYYY-MM-DD HH:mm:ss"
   status_name: string;
   college_name: string;
   education_id: string;
   expired_date: string;          // "YYYY-MM-DD"
   curriculum_id: string;
   curriculum_name: string;
   education_level: string;
   member_type_name: string;
   system_generated: boolean;
   registration_date: string;          // "YYYY-MM-DD"
}

/** Top-level event envelope coming from your Socket/Webhook */
interface MemberEvent {
   id: number;
   payload: MemberPayload;
   id_no: string;            // duplicated for quick access
   event_type: MemberEventType;
   status: MemberStatus;
   error_message: string;
   created_at: string;            // ISO 8601 timestamp
   received_at: string;            // "YYYY-MM-DD HH:mm:ss"
   rabbitmq_id: string;
   active: 0 | 1;             // treat as boolean-ish flag
}


interface QueueStore {
   members: MemberEvent[];
   member: MemberEvent | null;
   metadata: ApiMetadata | null;
   mode: "create" | "edit" | "view" | null;
   loading: boolean;
   error: string | null;
   setMode: (mode: "create" | "edit" | "view") => void;
   fetchMembers: () => Promise<void>;
   fetchMember: (id: number) => Promise<void>;
}