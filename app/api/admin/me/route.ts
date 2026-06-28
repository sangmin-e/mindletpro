import { isAdminEmail, readBearerToken } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  const token = readBearerToken(request);

  if (!token) {
    return Response.json({ isAdmin: false, email: null }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email ?? null;

  if (error || !email) {
    return Response.json({ isAdmin: false, email: null }, { status: 401 });
  }

  return Response.json({ isAdmin: isAdminEmail(email), email });
}
