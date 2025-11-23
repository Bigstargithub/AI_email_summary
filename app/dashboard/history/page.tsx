// 📚 히스토리 페이지
// 저장된 이메일 답장 히스토리 조회

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getEmailReplies, deleteEmailReply } from '@/lib/database';
import { HistoryList } from '@/components/HistoryList';
import { Button } from '@/components/ui/Button';
import type { EmailReply } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const [replies, setReplies] = useState<EmailReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 히스토리 로드
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const data = await getEmailReplies(user.id);
      setReplies(data);
    } catch (error) {
      console.error('히스토리 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 답장을 삭제하시겠습니까?')) {
      return;
    }

    setDeletingId(id);
    try {
      const success = await deleteEmailReply(id);
      if (success) {
        setReplies(replies.filter((r) => r.id !== id));
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  // 재사용 핸들러 (대시보드로 이동하면서 데이터 전달)
  const handleReuse = (reply: EmailReply) => {
    // 로컬 스토리지에 임시 저장
    localStorage.setItem('reuseReply', JSON.stringify(reply));
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600">히스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">답장 히스토리</h1>
              <p className="text-gray-600 mt-2">
                저장된 이메일 답장을 확인하고 다시 사용할 수 있습니다
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="primary">
                ✨ 새 답장 생성
              </Button>
            </Link>
          </div>
        </div>

        {/* 히스토리 목록 */}
        <HistoryList
          replies={replies}
          onDelete={handleDelete}
          onReuse={handleReuse}
          isDeleting={deletingId}
        />
      </div>
    </div>
  );
}

