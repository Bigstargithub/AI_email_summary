// 📧 이메일 답장 생성 폼 컴포넌트
// 원본 이메일 입력 및 톤 선택

"use client";

import { useState } from "react";
import { Textarea } from "./ui/Textarea";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import type { ToneType } from "@/lib/types";

interface EmailReplyFormProps {
  onGenerate: (originalEmail: string, tone: ToneType) => void;
  isLoading: boolean;
}

const TONE_OPTIONS = [
  { value: "formal", label: "정중한 (비즈니스)" },
  { value: "casual", label: "캐주얼 (친근한)" },
  { value: "decline", label: "거절 (정중한 거절)" },
  { value: "thanks", label: "감사 (감사 인사)" },
];

export function EmailReplyForm({ onGenerate, isLoading }: EmailReplyFormProps) {
  const [originalEmail, setOriginalEmail] = useState("");
  const [tone, setTone] = useState<ToneType>("formal");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 입력 검증
    if (!originalEmail.trim()) {
      setError("받은 이메일 내용을 입력해주세요.");
      return;
    }

    if (originalEmail.trim().length < 10) {
      setError("이메일 내용이 너무 짧습니다. 최소 10자 이상 입력해주세요.");
      return;
    }

    // 답장 생성 요청
    onGenerate(originalEmail.trim(), tone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 원본 이메일 입력 */}
      <Textarea
        label="받은 이메일 내용"
        placeholder="답장을 작성할 이메일 내용을 붙여넣으세요...&#10;&#10;예시:&#10;안녕하세요, 홍길동님.&#10;다음 주 화요일 오후 2시에 미팅이 가능하신지 확인 부탁드립니다.&#10;감사합니다."
        value={originalEmail}
        onChange={(e) => setOriginalEmail(e.target.value)}
        rows={8}
        disabled={isLoading}
        error={error}
        helperText="답장을 작성하고 싶은 이메일 내용을 입력하세요"
      />

      {/* 톤 선택 */}
      <Select
        label="답장 톤"
        options={TONE_OPTIONS}
        value={tone}
        onChange={(e) => setTone(e.target.value as ToneType)}
        disabled={isLoading}
        helperText="어떤 톤으로 답장을 작성할지 선택하세요"
      />

      {/* 생성 버튼 */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        {isLoading ? "AI가 답장을 작성하고 있습니다..." : "✨ AI 답장 생성"}
      </Button>

      {/* 안내 메시지 */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>
          💡 <strong>팁:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>원본 이메일을 그대로 붙여넣으세요</li>
          <li>상황에 맞는 톤을 선택하면 더 적절한 답장이 생성됩니다</li>
          <li>생성된 답장은 수정 후 사용할 수 있습니다</li>
        </ul>
      </div>
    </form>
  );
}
