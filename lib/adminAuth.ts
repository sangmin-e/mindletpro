import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.toLowerCase());
}

export function readBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function requireAdmin(request: Request) {
  const token = readBearerToken(request);

  if (!token) {
    return { ok: false as const, status: 401, message: "Google 계정으로 관리자 로그인이 필요합니다." };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email;

  if (error || !email) {
    return { ok: false as const, status: 401, message: "관리자 세션을 확인할 수 없습니다." };
  }

  if (!isAdminEmail(email)) {
    return { ok: false as const, status: 403, message: "관리자로 등록된 Google 계정이 아닙니다." };
  }

  return { ok: true as const, user: data.user, email };
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
