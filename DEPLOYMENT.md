# 🚀 배포 가이드

AI 이메일 답장 생성기를 Vercel에 배포하는 방법입니다.

## 📋 배포 전 체크리스트

배포하기 전에 다음 사항들을 확인하세요:

- [ ] 로컬에서 모든 기능이 정상 작동하는가?
- [ ] `QA_CHECKLIST.md`의 주요 항목들을 테스트했는가?
- [ ] Supabase 프로젝트가 생성되어 있는가?
- [ ] OpenAI API 키가 준비되어 있는가?
- [ ] GitHub 계정이 있는가?

## 🔧 1단계: Supabase 설정

### 1.1 Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속
2. "Start your project" 클릭
3. 새 프로젝트 생성
   - Organization 선택 또는 생성
   - Project name 입력
   - Database Password 설정 (안전한 곳에 저장!)
   - Region 선택 (Korea - Seoul 권장)
4. 프로젝트 생성 완료 대기 (약 2분)

### 1.2 데이터베이스 테이블 생성

1. Supabase 대시보드에서 "SQL Editor" 메뉴 클릭
2. "New query" 클릭
3. 프로젝트 루트의 `supabase-schema.sql` 파일 내용 복사
4. SQL Editor에 붙여넣기
5. "Run" 버튼 클릭하여 실행
6. 성공 메시지 확인

### 1.3 API 키 확인

1. Supabase 대시보드에서 "Settings" > "API" 메뉴 클릭
2. 다음 값들을 복사하여 안전한 곳에 저장:
   - Project URL
   - anon public key

### 1.4 구글 OAuth 설정 (선택사항)

구글 소셜 로그인을 사용하려면:

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" > "OAuth consent screen" 메뉴
4. User Type: External 선택
5. 앱 정보 입력 (앱 이름, 사용자 지원 이메일 등)
6. "APIs & Services" > "Credentials" 메뉴
7. "Create Credentials" > "OAuth client ID" 클릭
8. Application type: Web application
9. Authorized redirect URIs 추가:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
10. Client ID와 Client Secret 복사
11. Supabase 대시보드 > "Authentication" > "Providers" > "Google"
12. Client ID와 Client Secret 입력 후 저장

## 🔑 2단계: OpenAI API 키 준비

1. [platform.openai.com](https://platform.openai.com) 접속
2. 로그인 또는 회원가입
3. "API keys" 메뉴 클릭
4. "Create new secret key" 클릭
5. 키 이름 입력 (예: "ai-email-reply-production")
6. API 키 복사 (한 번만 표시되므로 안전한 곳에 저장!)
7. 결제 정보 등록 (Settings > Billing)
   - 사용량 기반 과금
   - GPT-4 사용 시 약 $0.03/1K tokens

## 📦 3단계: GitHub 리포지토리 생성

### 3.1 Git 초기화 (이미 되어 있다면 건너뛰기)

```bash
cd ai-email-reply
git init
git add .
git commit -m "Initial commit: AI Email Reply Generator MVP"
```

### 3.2 GitHub 리포지토리 생성

1. [github.com](https://github.com) 접속
2. 오른쪽 상단 "+" 버튼 > "New repository" 클릭
3. Repository 정보 입력:
   - Repository name: `ai-email-reply-generator`
   - Description: "AI-powered email reply generator"
   - Public 또는 Private 선택
   - README, .gitignore, license는 선택하지 않음 (이미 있음)
4. "Create repository" 클릭

### 3.3 코드 푸시

```bash
git remote add origin https://github.com/[your-username]/ai-email-reply-generator.git
git branch -M main
git push -u origin main
```

## 🌐 4단계: Vercel 배포

### 4.1 Vercel 계정 생성 및 프로젝트 연결

1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" 클릭 (GitHub 계정으로 로그인 권장)
3. "Add New..." > "Project" 클릭
4. GitHub 리포지토리 목록에서 `ai-email-reply-generator` 선택
5. "Import" 클릭

### 4.2 프로젝트 설정

1. **Framework Preset**: Next.js (자동 감지됨)
2. **Root Directory**: `./` (기본값)
3. **Build Command**: `npm run build` (기본값)
4. **Output Directory**: `.next` (기본값)

### 4.3 환경 변수 설정

"Environment Variables" 섹션에서 다음 변수들을 추가:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `OPENAI_API_KEY` | OpenAI API Key |

**중요**: 
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능
- `OPENAI_API_KEY`는 서버에서만 사용되므로 접두사 없음

### 4.4 배포 시작

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 "Visit" 버튼으로 사이트 확인

## ✅ 5단계: 배포 후 확인

배포가 완료되면 다음 사항들을 확인하세요:

### 5.1 기본 기능 테스트

- [ ] 랜딩 페이지가 정상적으로 로드되는가?
- [ ] 회원가입이 작동하는가?
- [ ] 로그인이 작동하는가?
- [ ] AI 답장 생성이 작동하는가?
- [ ] 히스토리 저장/조회가 작동하는가?

### 5.2 구글 OAuth 리디렉션 URI 업데이트

구글 소셜 로그인을 사용한다면:

1. Google Cloud Console > OAuth 클라이언트 설정
2. Authorized redirect URIs에 Vercel 도메인 추가:
   ```
   https://[your-vercel-domain].vercel.app/auth/callback
   ```
3. 저장 후 구글 로그인 테스트

### 5.3 성능 확인

- [ ] 페이지 로딩 속도가 적절한가?
- [ ] AI 답장 생성 시간이 합리적인가?
- [ ] 모바일에서도 잘 작동하는가?

## 🔄 6단계: 업데이트 배포

코드를 수정하고 다시 배포하려면:

```bash
# 코드 수정 후
git add .
git commit -m "Update: [변경 사항 설명]"
git push origin main
```

Vercel이 자동으로 새 배포를 시작합니다.

## 🌍 7단계: 커스텀 도메인 연결 (선택사항)

자신의 도메인을 연결하려면:

1. Vercel 프로젝트 대시보드 > "Settings" > "Domains"
2. 도메인 입력 (예: `email-reply.com`)
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정
4. DNS 전파 대기 (최대 48시간, 보통 몇 분 내)

## 🐛 문제 해결

### 배포 실패 시

1. Vercel 대시보드에서 배포 로그 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. 로컬에서 `npm run build` 실행하여 빌드 에러 확인

### API 에러 발생 시

1. Vercel 대시보드 > "Functions" 탭에서 로그 확인
2. OpenAI API 키가 올바른지 확인
3. OpenAI 계정에 크레딧이 있는지 확인

### 데이터베이스 연결 실패 시

1. Supabase 프로젝트가 활성 상태인지 확인
2. API 키가 올바른지 확인
3. RLS 정책이 올바르게 설정되었는지 확인

## 📊 모니터링

### Vercel Analytics

1. Vercel 프로젝트 대시보드 > "Analytics" 탭
2. 방문자 수, 페이지 뷰 등 확인

### Supabase Dashboard

1. Supabase 대시보드 > "Database" > "Tables"
2. 저장된 데이터 확인
3. "Logs" 메뉴에서 쿼리 로그 확인

### OpenAI Usage

1. OpenAI 대시보드 > "Usage"
2. API 사용량 및 비용 확인

## 💰 비용 예상

### 무료 티어

- **Vercel**: 무료 (Hobby 플랜)
  - 100GB 대역폭/월
  - 무제한 배포
- **Supabase**: 무료
  - 500MB 데이터베이스
  - 50,000 월간 활성 사용자
- **OpenAI**: 사용량 기반
  - GPT-4: ~$0.03/1K tokens
  - 예상 비용: 답장 1개당 약 $0.05-0.10

### 유료 플랜 (필요시)

- **Vercel Pro**: $20/월
- **Supabase Pro**: $25/월
- **OpenAI**: 사용량에 따라 변동

## 🎉 배포 완료!

축하합니다! AI 이메일 답장 생성기가 성공적으로 배포되었습니다.

이제 다음을 할 수 있습니다:
- ✅ 전 세계 어디서나 접속 가능
- ✅ HTTPS 보안 연결
- ✅ 자동 배포 (코드 푸시 시)
- ✅ 무료 호스팅 (Vercel Hobby 플랜)

## 📞 지원

문제가 발생하면:
1. GitHub Issues에 문제 등록
2. Vercel/Supabase 공식 문서 참고
3. 커뮤니티 포럼 활용

---

**배포 날짜**: ___________
**배포 URL**: ___________
**버전**: 1.0.0

