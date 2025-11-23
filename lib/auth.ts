// 🔐 인증 관련 함수들
// Supabase Auth를 사용한 로그인, 회원가입, 로그아웃 등

import { supabase } from "./supabase";

// ============================================
// 이메일/비밀번호 인증
// ============================================

/**
 * 이메일과 비밀번호로 회원가입
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("회원가입 실패:", error);
    return { data: null, error: error.message };
  }
}

/**
 * 이메일과 비밀번호로 로그인
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("로그인 실패:", error);
    return { data: null, error: error.message };
  }
}

// ============================================
// 소셜 로그인 (구글)
// ============================================

/**
 * 구글 소셜 로그인
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo를 설정하지 않으면 Supabase가 Site URL을 사용
        skipBrowserRedirect: false,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ============================================
// 로그아웃 및 세션 관리
// ============================================

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("로그아웃 실패:", error);
    return { error: error.message };
  }
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * 현재 세션 가져오기
 */
export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error: any) {
    return { session: null, error: error.message };
  }
}

/**
 * 인증 상태 변경 리스너
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================
// 비밀번호 재설정
// ============================================

/**
 * 비밀번호 재설정 이메일 발송
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("비밀번호 재설정 이메일 발송 실패:", error);
    return { error: error.message };
  }
}

/**
 * 새 비밀번호로 업데이트
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("비밀번호 업데이트 실패:", error);
    return { error: error.message };
  }
}
