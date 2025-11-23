// 📄 히스토리 아이템 컴포넌트
// 개별 이메일 답장 히스토리 카드

"use client";

import { useState } from "react";
import { EmailReply } from "@/lib/types";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import {
  formatDate,
  getToneLabel,
  truncateText,
  copyToClipboard,
} from "@/lib/utils";

interface HistoryItemProps {
  reply: EmailReply;
  onDelete: (id: string) => void;
  onReuse: (reply: EmailReply) => void;
  isDeleting: boolean;
}

export function HistoryItem({
  reply,
  onDelete,
  onReuse,
  isDeleting,
}: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(reply.generated_reply);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <Card padding="none" className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getToneLabel(reply.tone)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(reply.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {truncateText(reply.original_email, 100)}
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={isExpanded ? "접기" : "펼치기"}
            >
              <svg
                className={`w-5 h-5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 펼쳐진 내용 */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            {/* 원본 이메일 */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">
                원본 이메일:
              </h4>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-3 whitespace-pre-wrap">
                {reply.original_email}
              </div>
            </div>

            {/* 생성된 답장 */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">
                생성된 답장:
              </h4>
              <div className="text-sm text-gray-600 bg-blue-50 rounded p-3 whitespace-pre-wrap">
                {reply.generated_reply}
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="primary" size="sm" onClick={handleCopy}>
                {copySuccess ? "✓ 복사됨" : "📋 복사"}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReuse(reply)}
              >
                🔄 다시 사용
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(reply.id)}
                isLoading={isDeleting}
              >
                🗑️ 삭제
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
