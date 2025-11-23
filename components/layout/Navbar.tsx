// 🧭 네비게이션 바 컴포넌트
// 로그인 상태에 따른 네비게이션

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, signOut } from "@/lib/auth";
import { Button } from "../ui/Button";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const checkUser = async () => {
    const { user } = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  // 로그인/회원가입 페이지에서는 네비게이션 숨김
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">✉️</span>
            <span className="text-xl font-bold text-gray-900">
              AI 이메일 답장
            </span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant={pathname === "/dashboard" ? "primary" : "ghost"}
                    size="sm"
                  >
                    ✨ 답장 생성
                  </Button>
                </Link>
                <Link href="/dashboard/history">
                  <Button
                    variant={
                      pathname === "/dashboard/history" ? "primary" : "ghost"
                    }
                    size="sm"
                  >
                    📚 히스토리
                  </Button>
                </Link>
                <div className="border-l border-gray-300 h-6 mx-2" />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    로그아웃
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    무료로 시작하기
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
