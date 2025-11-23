// 🏠 랜딩 페이지
// 서비스 소개 및 주요 기능 안내

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { user } = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 히어로 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI가 당신의 이메일 답장을
            <br />
            <span className="text-blue-600">자동으로 작성합니다</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            받은 이메일 내용을 붙여넣고 원하는 톤을 선택하면,
            AI가 한국어 비즈니스 문화에 맞는 완벽한 답장을 몇 초 만에 생성해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoading ? (
              <div className="flex gap-4 justify-center">
                <div className="w-40 h-12 bg-gray-200 animate-pulse rounded-lg" />
                <div className="w-32 h-12 bg-gray-200 animate-pulse rounded-lg" />
              </div>
            ) : user ? (
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="text-lg px-8">
                  ✨ 대시보드로 이동
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="text-lg px-8">
                    ✨ 무료로 시작하기
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8">
                    로그인
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            왜 AI 이메일 답장 생성기인가요?
          </h2>
          <p className="text-lg text-gray-600">
            매일 수십 통의 이메일 답장에 시간을 낭비하지 마세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 기능 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              빠른 생성
            </h3>
            <p className="text-gray-600">
              몇 초 만에 전문적인 이메일 답장이 완성됩니다.
              더 이상 답장 작성에 시간을 낭비하지 마세요.
            </p>
          </div>

          {/* 기능 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              4가지 톤 선택
            </h3>
            <p className="text-gray-600">
              정중한, 캐주얼, 거절, 감사 등 상황에 맞는 톤으로
              적절한 답장을 생성할 수 있습니다.
            </p>
          </div>

          {/* 기능 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🇰🇷</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              한국어 최적화
            </h3>
            <p className="text-gray-600">
              한국 비즈니스 이메일 문화와 예절을 완벽하게 반영한
              자연스러운 답장을 생성합니다.
            </p>
          </div>

          {/* 기능 4 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              수정 가능
            </h3>
            <p className="text-gray-600">
              생성된 답장을 바로 수정할 수 있어,
              개인의 스타일에 맞게 조정할 수 있습니다.
            </p>
          </div>

          {/* 기능 5 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              히스토리 저장
            </h3>
            <p className="text-gray-600">
              생성된 답장을 자동으로 저장하여
              나중에 다시 참고하거나 재사용할 수 있습니다.
            </p>
          </div>

          {/* 기능 6 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              안전한 보안
            </h3>
            <p className="text-gray-600">
              모든 데이터는 암호화되어 안전하게 저장되며,
              개인정보 보호를 최우선으로 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              간단한 3단계로 시작하세요
            </h2>
            <p className="text-lg text-gray-600">
              복잡한 설정 없이 바로 사용할 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 단계 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                이메일 내용 입력
              </h3>
              <p className="text-gray-600">
                답장을 작성하고 싶은 이메일 내용을 복사해서 붙여넣으세요
              </p>
            </div>

            {/* 단계 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                톤 선택
              </h3>
              <p className="text-gray-600">
                정중한, 캐주얼, 거절, 감사 중 상황에 맞는 톤을 선택하세요
              </p>
            </div>

            {/* 단계 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                복사 & 사용
              </h3>
              <p className="text-gray-600">
                생성된 답장을 확인하고, 필요시 수정 후 복사하여 사용하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {user ? "대시보드에서 AI 이메일 답장을 생성해보세요" : "무료로 가입하고 AI가 작성하는 전문적인 이메일 답장을 경험하세요"}
          </p>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-40 h-12 bg-white/20 animate-pulse rounded-lg" />
            </div>
          ) : user ? (
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100 border-white"
              >
                ✨ 대시보드로 이동
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100 border-white"
              >
                ✨ 무료로 시작하기
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
