# MINDLET PRO

Next.js + Supabase + Vercel 기반 개인용 패들렛형 메모 보드입니다. 섹션, 컬럼, 카테고리, 기본 샘플 카드 없이 빈 보드에서 시작하고, 하단 `+` 버튼으로 메모를 작성합니다.

## 설치

```bash
npm install
npm run dev
```

## Supabase 설정

1. Supabase SQL Editor에서 `schema.sql` 전체를 실행합니다.
2. `.env.local.example`을 참고해 `.env.local`을 만듭니다.
3. `SUPABASE_SERVICE_ROLE_KEY`는 서버 API에서만 사용되며 브라우저 코드에 노출하지 않습니다.

필수 환경 변수:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=3potato79@gmail.com
```

## Google OAuth 관리자 로그인

1. Supabase Dashboard에서 Authentication > Providers > Google을 활성화합니다.
2. Google Cloud Console에서 OAuth Client ID를 만듭니다.
3. Authorized JavaScript origins에 배포 주소를 추가합니다.
4. Authorized redirect URI에 Supabase callback URL을 추가합니다.

예:

```text
https://PROJECT_REF.supabase.co/auth/v1/callback
```

5. Supabase Google Provider에 Client ID와 Client Secret을 입력합니다.
6. Authentication > URL Configuration의 Site URL을 `NEXT_PUBLIC_SITE_URL`과 같은 값으로 맞춥니다.
7. 관리자 허용 이메일은 `ADMIN_EMAILS`에 쉼표로 구분해 입력합니다.

## Vercel 배포

Vercel 프로젝트 환경 변수에 `.env.local.example`의 모든 값을 등록합니다. `SUPABASE_SERVICE_ROLE_KEY`와 `ADMIN_EMAILS`는 절대 클라이언트 공개 변수인 `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.

## 기능

- 일반 사용자: 메모 조회, 작성, 4자리 작성자 암호로 본인 메모 삭제
- 관리자: Supabase Auth Google OAuth 로그인, `ADMIN_EMAILS` 검증, 개별/전체 삭제
- 동기화: 자동 realtime 없이 버튼으로 최신 메모 다시 불러오기
