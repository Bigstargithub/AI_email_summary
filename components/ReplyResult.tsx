// 📝 답장 결과 표시 컴포넌트
// 생성된 답장 표시, 수정, 복사, 저장

"use client";

import { useState } from "react";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { copyToClipboard, getToneLabel } from "@/lib/utils";
import type { ToneType } from "@/lib/types";

interface ReplyResultProps {
  originalEmail: string;
  generatedReply: string;
  tone: ToneType;
  onSave: (reply: string) => void;
  onReset: () => void;
  isSaving: boolean;
}

export function ReplyResult({
  originalEmail,
  generatedReply,
  tone,
  onSave,
  onReset,
  isSaving,
}: ReplyResultProps) {
  const [editedReply, setEditedReply] = useState(generatedReply);
  const [copySuccess, setCopySuccess] = useState(false);

  // 복사 버튼 핸들러
  const handleCopy = async () => {
    const success = await copyToClipboard(editedReply);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // 저장 버튼 핸들러
  const handleSave = () => {
    onSave(editedReply);
  };

  return (
    <div className="space-y-4">
      {/* 성공 메시지 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">
              답장이 생성되었습니다!
            </h3>
            <p className="text-sm text-green-700 mt-1">
              톤: <strong>{getToneLabel(tone)}</strong> | 필요시 수정 후
              사용하세요
            </p>
          </div>
        </div>
      </div>

      {/* 원본 이메일 (접기/펼치기) */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
          📩 원본 이메일 보기
        </summary>
        <div className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
          {originalEmail}
        </div>
      </details>

      {/* 생성된 답장 (수정 가능) */}
      <Textarea
        label="생성된 답장"
        value={editedReply}
        onChange={(e) => setEditedReply(e.target.value)}
        rows={12}
        helperText="필요시 내용을 수정할 수 있습니다"
      />

      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleCopy}
          className="flex-1"
        >
          {copySuccess ? "✓ 복사됨!" : "📋 복사하기"}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleSave}
          isLoading={isSaving}
          className="flex-1"
        >
          💾 히스토리에 저장
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={isSaving}
        >
          🔄 새로 생성
        </Button>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 text-sm text-blue-700">
            <p className="font-medium">다음 단계:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>생성된 답장을 검토하고 필요시 수정하세요</li>
              <li>"복사하기" 버튼을 눌러 클립보드에 복사하세요</li>
              <li>이메일 클라이언트에 붙여넣어 사용하세요</li>
              <li>나중에 참고하려면 "히스토리에 저장"을 클릭하세요</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
