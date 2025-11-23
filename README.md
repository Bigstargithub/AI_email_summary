# AI 이메일 답장 생성기

받은 이메일 내용을 붙여넣고 원하는 답장 톤을 선택하면 AI가 완성된 답장 이메일을 자동으로 작성해주는 서비스입니다.

## 🎯 주요 기능

- 📧 이메일 내용 입력 및 답장 자동 생성
- 🎨 4가지 답장 톤 선택 (정중한, 캐주얼, 거절, 감사)
- 📝 생성된 답장 수정 및 복사
- 📚 이메일 히스토리 저장 및 조회
- 🔐 사용자 인증 (이메일/비밀번호 + 구글 소셜 로그인)
- 💾 Supabase 데이터베이스 연동

## 🛠️ 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase
- **인증**: Supabase Auth
- **AI**: OpenAI GPT-4
- **폼 관리**: React Hook Form + Zod

## 📦 설치 방법

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정

\`.env.local\` 파일을 생성하고 다음 값들을 입력하세요:

\`\`\`env

# Supabase 설정

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI 설정

OPENAI_API_KEY=your-openai-api-key
\`\`\`

#### Supabase 설정 방법

1. [supabase.com](https://supabase.com) 접속 후 프로젝트 생성
2. Settings > API에서 URL과 anon key 복사
3. SQL Editor에서 데이터베이스 테이블 생성 (아래 SQL 참고)

#### OpenAI 설정 방법

1. [platform.openai.com](https://platform.openai.com) 접속
2. API Keys에서 새 키 생성
3. 결제 정보 등록 (사용량 기반 과금)

### 3. 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

\`\`\`sql
-- profiles 테이블 (사용자 프로필)
CREATE TABLE profiles (
id UUID REFERENCES auth.users PRIMARY KEY,
email TEXT UNIQUE NOT NULL,
full_name TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- email_replies 테이블 (이메일 답장 히스토리)
CREATE TABLE email_replies (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
original_email TEXT NOT NULL,
generated_reply TEXT NOT NULL,
tone TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_replies ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- email_replies 정책
CREATE POLICY "Users can view own email replies" ON email_replies
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email replies" ON email_replies
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email replies" ON email_replies
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email replies" ON email_replies
FOR DELETE USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX email_replies_user_id_idx ON email_replies(user_id);
CREATE INDEX email_replies_created_at_idx ON email_replies(created_at DESC);
\`\`\`

### 4. 구글 소셜 로그인 설정 (선택사항)

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성
3. OAuth 동의 화면 구성 (외부 선택)
4. 사용자 인증 정보 > OAuth 클라이언트 ID 생성
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: \`https://[your-project].supabase.co/auth/v1/callback\`
5. Client ID와 Secret을 Supabase > Authentication > Providers > Google에 입력

## 🚀 실행 방법

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 프로젝트 구조

\`\`\`
/ai-email-reply
├── app/ # Next.js App Router
│ ├── page.tsx # 랜딩 페이지
│ ├── login/ # 로그인 페이지
│ ├── signup/ # 회원가입 페이지
│ ├── auth/callback/ # OAuth 콜백
│ ├── dashboard/ # 사용자 대시보드
│ │ ├── page.tsx # 답장 생성
│ │ └── history/ # 히스토리 조회
│ └── api/
│ └── generate-reply/ # AI 답장 생성 API
├── components/
│ ├── ui/ # 재사용 UI 컴포넌트
│ ├── layout/ # 레이아웃 컴포넌트
│ ├── EmailReplyForm.tsx # 이메일 입력 폼
│ ├── ReplyResult.tsx # 답장 결과 표시
│ ├── HistoryList.tsx # 히스토리 목록
│ └── HistoryItem.tsx # 히스토리 아이템
├── lib/
│ ├── supabase.ts # Supabase 클라이언트
│ ├── auth.ts # 인증 함수
│ ├── database.ts # 데이터베이스 CRUD
│ └── utils.ts # 유틸리티 함수
├── .env.local # 환경 변수 (git에 포함 안됨)
└── middleware.ts # 보호된 라우트 설정
\`\`\`

## 🎨 사용 방법

1. **회원가입/로그인**: 이메일 또는 구글 계정으로 가입
2. **이메일 입력**: 받은 이메일 내용을 입력
3. **톤 선택**: 정중한, 캐주얼, 거절, 감사 중 선택
4. **답장 생성**: AI가 자동으로 답장 작성
5. **수정 및 복사**: 필요시 수정 후 복사하여 사용
6. **히스토리 저장**: 생성된 답장은 자동으로 저장됨

## 🌐 배포

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에 연결
3. 환경 변수 설정
4. 자동 배포 완료

자세한 배포 가이드는 \`DEPLOYMENT.md\`를 참고하세요.

## 📝 라이선스

MIT License

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

## 📧 문의

문제가 있거나 질문이 있으시면 이슈를 등록해주세요.
