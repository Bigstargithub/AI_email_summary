// 🛠️ 유틸리티 함수들
// 프로젝트 전체에서 사용하는 공통 함수들

import { type ClassValue, clsx } from "clsx";

// Tailwind CSS 클래스 병합 (선택사항)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 날짜 포맷팅
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 텍스트 자르기
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// 클립보드에 복사
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("클립보드 복사 실패:", error);
    return false;
  }
}

// 톤 한글 변환
export function getToneLabel(tone: string): string {
  const toneMap: Record<string, string> = {
    formal: "정중한",
    casual: "캐주얼",
    decline: "거절",
    thanks: "감사",
  };
  return toneMap[tone] || tone;
}
