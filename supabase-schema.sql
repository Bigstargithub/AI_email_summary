-- 📊 Supabase 데이터베이스 스키마
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. profiles 테이블 (사용자 프로필)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. email_replies 테이블 (이메일 답장 히스토리)
CREATE TABLE IF NOT EXISTS email_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  original_email TEXT NOT NULL,
  generated_reply TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('formal', 'casual', 'decline', 'thanks')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_replies ENABLE ROW LEVEL SECURITY;

-- 4. profiles 테이블 정책
-- 사용자는 자신의 프로필만 조회 가능
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 삽입 가능
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. email_replies 테이블 정책
-- 사용자는 자신의 이메일 답장만 조회 가능
DROP POLICY IF EXISTS "Users can view own email replies" ON email_replies;
CREATE POLICY "Users can view own email replies" ON email_replies
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 이메일 답장만 삽입 가능
DROP POLICY IF EXISTS "Users can insert own email replies" ON email_replies;
CREATE POLICY "Users can insert own email replies" ON email_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 이메일 답장만 수정 가능
DROP POLICY IF EXISTS "Users can update own email replies" ON email_replies;
CREATE POLICY "Users can update own email replies" ON email_replies
  FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 이메일 답장만 삭제 가능
DROP POLICY IF EXISTS "Users can delete own email replies" ON email_replies;
CREATE POLICY "Users can delete own email replies" ON email_replies
  FOR DELETE USING (auth.uid() = user_id);

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS email_replies_user_id_idx ON email_replies(user_id);
CREATE INDEX IF NOT EXISTS email_replies_created_at_idx ON email_replies(created_at DESC);

-- 7. 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_email_replies_updated_at ON email_replies;
CREATE TRIGGER update_email_replies_updated_at
  BEFORE UPDATE ON email_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. 회원가입 시 자동으로 프로필 생성하는 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 완료!
-- 이제 애플리케이션에서 Supabase를 사용할 수 있습니다.

