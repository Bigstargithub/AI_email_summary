// 📊 데이터베이스 CRUD 함수들
// Supabase와 상호작용하는 모든 데이터베이스 함수들

import { supabase } from "./supabase";
import type { EmailReply, Profile, ToneType } from "./types";

// ============================================
// 프로필 관련 함수
// ============================================

/**
 * 사용자 프로필 조회
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("프로필 조회 실패:", error);
    return null;
  }
}

/**
 * 사용자 프로필 생성
 */
export async function createProfile(
  userId: string,
  email: string,
  fullName?: string
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        full_name: fullName || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("프로필 생성 실패:", error);
    return null;
  }
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name">>
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    return null;
  }
}

// ============================================
// 이메일 답장 관련 함수
// ============================================

/**
 * 이메일 답장 저장
 */
export async function saveEmailReply(
  userId: string,
  originalEmail: string,
  generatedReply: string,
  tone: ToneType
): Promise<EmailReply | null> {
  try {
    const { data, error } = await supabase
      .from("email_replies")
      .insert({
        user_id: userId,
        original_email: originalEmail,
        generated_reply: generatedReply,
        tone,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("이메일 답장 저장 실패:", error);
    return null;
  }
}

/**
 * 사용자의 모든 이메일 답장 조회 (최신순)
 */
export async function getEmailReplies(
  userId: string,
  limit: number = 50
): Promise<EmailReply[]> {
  try {
    const { data, error } = await supabase
      .from("email_replies")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("이메일 답장 목록 조회 실패:", error);
    return [];
  }
}

/**
 * 특정 이메일 답장 조회
 */
export async function getEmailReplyById(
  replyId: string
): Promise<EmailReply | null> {
  try {
    const { data, error } = await supabase
      .from("email_replies")
      .select("*")
      .eq("id", replyId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("이메일 답장 조회 실패:", error);
    return null;
  }
}

/**
 * 이메일 답장 수정
 */
export async function updateEmailReply(
  replyId: string,
  updates: Partial<Pick<EmailReply, "generated_reply" | "tone">>
): Promise<EmailReply | null> {
  try {
    const { data, error } = await supabase
      .from("email_replies")
      .update(updates)
      .eq("id", replyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("이메일 답장 수정 실패:", error);
    return null;
  }
}

/**
 * 이메일 답장 삭제
 */
export async function deleteEmailReply(replyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("email_replies")
      .delete()
      .eq("id", replyId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("이메일 답장 삭제 실패:", error);
    return false;
  }
}

/**
 * 톤별 이메일 답장 개수 조회 (통계용)
 */
export async function getEmailReplyStats(userId: string): Promise<{
  total: number;
  byTone: Record<ToneType, number>;
}> {
  try {
    const replies = await getEmailReplies(userId, 1000);

    const stats = {
      total: replies.length,
      byTone: {
        formal: 0,
        casual: 0,
        decline: 0,
        thanks: 0,
      } as Record<ToneType, number>,
    };

    replies.forEach((reply) => {
      if (reply.tone in stats.byTone) {
        stats.byTone[reply.tone]++;
      }
    });

    return stats;
  } catch (error) {
    console.error("통계 조회 실패:", error);
    return {
      total: 0,
      byTone: { formal: 0, casual: 0, decline: 0, thanks: 0 },
    };
  }
}
