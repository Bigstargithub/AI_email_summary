// 🦶 푸터 컴포넌트
// 페이지 하단 푸터

"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // 로그인/회원가입 페이지에서는 푸터 숨김
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            © 2024 AI 이메일 답장 생성기. All rights reserved.
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Made with Next.js, OpenAI GPT-4, and Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
