// 🏠 대시보드 페이지
// AI 이메일 답장 생성 메인 페이지

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { saveEmailReply } from '@/lib/database';
import { EmailReplyForm } from '@/components/EmailReplyForm';
import { ReplyResult } from '@/components/ReplyResult';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ToneType } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // 생성 상태
  const [originalEmail, setOriginalEmail] = useState('');
  const [tone, setTone] = useState<ToneType>('formal');
  const [generatedReply, setGeneratedReply] = useState('');

  // 사용자 확인
  useEffect(() => {
    checkUser();
    // 재사용 데이터 확인
    checkReuseData();
  }, []);

  const checkUser = async () => {
    const { user } = await getCurrentUser();
    
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);
  };

  const checkReuseData = () => {
    const reuseData = localStorage.getItem('reuseReply');
    if (reuseData) {
      try {
        const reply = JSON.parse(reuseData);
        setOriginalEmail(reply.original_email);
        setTone(reply.tone);
        setGeneratedReply(reply.generated_reply);
        localStorage.removeItem('reuseReply');
      } catch (error) {
        console.error('재사용 데이터 로드 실패:', error);
      }
    }
  };

  // AI 답장 생성
  const handleGenerate = async (email: string, selectedTone: ToneType) => {
    setError('');
    setGeneratedReply(''); // 이전 답장 초기화
    setIsGenerating(true);
    setOriginalEmail(email);
    setTone(selectedTone);

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalEmail: email,
          tone: selectedTone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '답장 생성에 실패했습니다.');
      }

      setGeneratedReply(data.reply);
    } catch (err: any) {
      setError(err.message || '답장 생성 중 오류가 발생했습니다.');
      console.error('답장 생성 오류:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 히스토리에 저장
  const handleSave = async (reply: string) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveEmailReply(userId, originalEmail, reply, tone);
      if (saved) {
        alert('히스토리에 저장되었습니다!');
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setOriginalEmail('');
    setTone('formal');
    setGeneratedReply('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI 이메일 답장 생성기
              </h1>
              <p className="text-gray-600 mt-2">
                받은 이메일 내용을 입력하면 AI가 자동으로 답장을 작성해드립니다
              </p>
            </div>
            <Link href="/dashboard/history">
              <Button variant="outline">
                📚 히스토리 보기
              </Button>
            </Link>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 입력 폼 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>답장 생성</CardTitle>
                <CardDescription>
                  받은 이메일 내용과 원하는 톤을 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailReplyForm
                  onGenerate={handleGenerate}
                  isLoading={isGenerating}
                />
              </CardContent>
            </Card>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* 오른쪽: 결과 */}
          <div>
            {generatedReply ? (
              <Card>
                <CardHeader>
                  <CardTitle>생성된 답장</CardTitle>
                  <CardDescription>
                    필요시 수정 후 사용하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReplyResult
                    originalEmail={originalEmail}
                    generatedReply={generatedReply}
                    tone={tone}
                    onSave={handleSave}
                    onReset={handleReset}
                    isSaving={isSaving}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    답장을 생성해보세요
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    왼쪽 폼에 이메일 내용을 입력하고 톤을 선택한 후
                    "AI 답장 생성" 버튼을 클릭하세요
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 사용 통계 (선택사항) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">✨</div>
              <div className="text-sm text-gray-600">빠른 생성</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">🎯</div>
              <div className="text-sm text-gray-600">정확한 톤</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">💾</div>
              <div className="text-sm text-gray-600">히스토리 저장</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

