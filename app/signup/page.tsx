// 📝 회원가입 페이지
// 이메일/비밀번호로 새 계정 생성

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 회원가입 처리
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      setIsLoading(false);
      return;
    }

    // 비밀번호 복잡도 확인
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLowerCase) {
      setError("비밀번호에 소문자가 최소 1개 이상 포함되어야 합니다.");
      setIsLoading(false);
      return;
    }

    if (!hasNumber) {
      setError("비밀번호에 숫자가 최소 1개 이상 포함되어야 합니다.");
      setIsLoading(false);
      return;
    }

    if (!hasSpecialChar) {
      setError(
        "비밀번호에 특수문자(!@#$%^&* 등)가 최소 1개 이상 포함되어야 합니다."
      );
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUpWithEmail(email, password, fullName);

      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setSuccess(true);
        // 2초 후 대시보드로 이동
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  // 구글 로그인 처리
  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }

      // 성공 시 자동으로 리디렉션됨
    } catch (err) {
      setError("구글 로그인 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI 이메일 답장 생성기
          </h1>
          <p className="text-gray-600 mt-2">무료로 시작하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>
              새 계정을 만들어 AI 이메일 답장 생성을 시작하세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* 성공 메시지 */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  회원가입이 완료되었습니다! 대시보드로 이동합니다...
                </p>
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 회원가입 폼 */}
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="text"
                label="이름"
                placeholder="홍길동"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading || success}
              />

              <Input
                type="email"
                label="이메일"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || success}
              />

              <Input
                type="password"
                label="비밀번호"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || success}
                helperText="최소 8자 이상, 소문자, 숫자, 특수문자 각 1개 이상 포함"
              />

              <Input
                type="password"
                label="비밀번호 확인"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading || success}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={success}
              >
                회원가입
              </Button>
            </form>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 구글 로그인 버튼 */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignup}
              disabled={isLoading || success}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              구글로 시작하기
            </Button>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">이미 계정이 있으신가요? </span>
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
