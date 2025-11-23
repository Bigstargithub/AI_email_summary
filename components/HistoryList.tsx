// 📚 히스토리 목록 컴포넌트
// 저장된 이메일 답장 히스토리 목록 표시

"use client";

import { EmailReply } from "@/lib/types";
import { HistoryItem } from "./HistoryItem";

interface HistoryListProps {
  replies: EmailReply[];
  onDelete: (id: string) => void;
  onReuse: (reply: EmailReply) => void;
  isDeleting: string | null;
}

export function HistoryList({
  replies,
  onDelete,
  onReuse,
  isDeleting,
}: HistoryListProps) {
  if (replies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
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
          아직 저장된 히스토리가 없습니다
        </h3>
        <p className="text-gray-600">
          AI로 답장을 생성하고 저장하면 여기에 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          총 {replies.length}개의 답장
        </h2>
      </div>

      <div className="space-y-3">
        {replies.map((reply) => (
          <HistoryItem
            key={reply.id}
            reply={reply}
            onDelete={onDelete}
            onReuse={onReuse}
            isDeleting={isDeleting === reply.id}
          />
        ))}
      </div>
    </div>
  );
}
