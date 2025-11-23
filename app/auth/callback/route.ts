// 🔄 OAuth 콜백 라우트
// 구글 소셜 로그인 후 리디렉션 처리

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  // OAuth 에러가 있는 경우
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    );
  }

  // code가 없으면 로그인 페이지로
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=no_code_provided", requestUrl.origin)
    );
  }

  try {
    const cookieStore = await cookies();
    
    // Response 객체를 먼저 생성 (리디렉션 URL 설정)
    let response = NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // 쿠키 스토어와 Response 모두에 설정
            cookieStore.set({ name, value, ...options });
            response.cookies.set({
              name,
              value,
              ...options,
              httpOnly: options.httpOnly ?? true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: (options.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
              path: options.path ?? '/',
            });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
            response.cookies.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );
    
    // OAuth 코드를 세션으로 교환
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }

    if (!data?.session) {
      return NextResponse.redirect(
        new URL("/login?error=no_session_created", requestUrl.origin)
      );
    }
    
    return response;
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "authentication_failed")}`, requestUrl.origin)
    );
  }
}
