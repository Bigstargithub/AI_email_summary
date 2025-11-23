// 🛡️ 미들웨어
// 보호된 라우트 설정 - 로그인하지 않은 사용자는 접근 불가

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // OAuth 콜백은 미들웨어를 건너뜀
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    return response;
  }

  // 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 보호된 라우트 목록
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 로그인하지 않은 사용자가 보호된 라우트에 접근하려고 하면 로그인 페이지로 리디렉션
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 로그인한 사용자가 로그인/회원가입 페이지에 접근하려고 하면 대시보드로 리디렉션
  if (
    session &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
