// 🤖 AI 답장 생성 API
// OpenAI GPT-4를 사용하여 이메일 답장 자동 생성

import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ToneType } from "@/lib/types";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 톤별 프롬프트 정의
const TONE_PROMPTS: Record<ToneType, string> = {
  formal: `한국 비즈니스 이메일 문화에 맞춰 매우 정중하고 격식있는 답장을 작성해주세요.
- 존댓말을 사용하세요 (예: ~습니다, ~하겠습니다)
- 격식있는 인사말로 시작하고 끝내세요
- 전문적이고 공손한 어조를 유지하세요`,

  casual: `친근하고 편안한 톤으로, 하지만 여전히 예의바른 답장을 작성해주세요.
- 존댓말을 사용하되 부드러운 어조로 작성하세요 (예: ~해요, ~할게요)
- 친근하면서도 예의를 지키는 표현을 사용하세요
- 자연스럽고 편안한 느낌을 주세요`,

  decline: `정중하지만 명확하게 거절하는 답장을 작성해주세요.
- 감사의 표현으로 시작하세요
- 거절 이유를 간단하고 명확하게 설명하세요
- 가능하다면 대안을 제시하거나 향후 기회를 열어두세요
- 정중하고 공손한 어조를 유지하세요`,

  thanks: `진심어린 감사의 마음을 전달하는 답장을 작성해주세요.
- 구체적으로 무엇에 감사한지 명시하세요
- 따뜻하고 진정성있는 어조를 사용하세요
- 감사의 마음이 잘 전달되도록 작성하세요
- 향후 관계 유지에 대한 긍정적인 메시지를 포함하세요`,
};

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { originalEmail, tone } = body;

    // 입력 검증
    if (!originalEmail || typeof originalEmail !== "string") {
      return NextResponse.json(
        { error: "원본 이메일 내용이 필요합니다." },
        { status: 400 }
      );
    }

    if (!tone || !TONE_PROMPTS[tone as ToneType]) {
      return NextResponse.json(
        { error: "유효한 톤을 선택해주세요." },
        { status: 400 }
      );
    }

    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `당신은 한국어 비즈니스 이메일 작성 전문가입니다. 
받은 이메일에 대한 적절한 답장을 작성해주세요.
${TONE_PROMPTS[tone as ToneType]}

답장 작성 시 주의사항:
- 원본 이메일의 내용을 정확히 이해하고 답변하세요
- 한국어 이메일 문화와 예절을 준수하세요
- 간결하면서도 필요한 내용은 모두 포함하세요
- 이메일 서명이나 발신자 정보는 포함하지 마세요 (본문만 작성)
- 답장 내용만 작성하고, 추가 설명이나 메타 정보는 포함하지 마세요`,
        },
        {
          role: "user",
          content: `다음 이메일에 대한 답장을 작성해주세요:\n\n${originalEmail}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // 생성된 답장 추출
    const generatedReply = completion.choices[0]?.message?.content;

    if (!generatedReply) {
      return NextResponse.json(
        { error: "답장 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      reply: generatedReply.trim(),
    });
  } catch (error: any) {
    console.error("AI 답장 생성 오류:", error);

    // OpenAI API 에러 처리
    if (error?.error?.type === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI API 할당량이 초과되었습니다. API 키를 확인해주세요." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "답장 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
