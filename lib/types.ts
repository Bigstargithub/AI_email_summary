// 📝 타입 정의 파일
// 프로젝트 전체에서 사용하는 타입들을 정의합니다

export type ToneType = "formal" | "casual" | "decline" | "thanks";

export interface EmailReply {
  id: string;
  user_id: string;
  original_email: string;
  generated_reply: string;
  tone: ToneType;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface GenerateReplyRequest {
  originalEmail: string;
  tone: ToneType;
}

export interface GenerateReplyResponse {
  reply: string;
  error?: string;
}
