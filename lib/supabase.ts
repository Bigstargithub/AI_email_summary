// 🔐 Supabase 클라이언트 설정
// 이 파일은 Supabase와 연결하는 설정입니다
// NEXT_PUBLIC_SUPABASE_URL과 KEY는 .env.local 파일에서 가져옵니다
// Supabase 대시보드 > Settings > API에서 이 값들을 복사하세요

import { createBrowserClient } from "@supabase/ssr";

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
  );
}

// Supabase 클라이언트 생성 (클라이언트 사이드 - 쿠키 기반)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type EmailReply = {
  id: string;
  user_id: string;
  original_email: string;
  generated_reply: string;
  tone: "formal" | "casual" | "decline" | "thanks";
  created_at: string;
  updated_at: string;
};

// 톤 타입 정의
export const TONE_OPTIONS = {
  formal: "정중한",
  casual: "캐주얼",
  decline: "거절",
  thanks: "감사",
} as const;

export type ToneType = keyof typeof TONE_OPTIONS;
