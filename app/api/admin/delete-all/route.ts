import { jsonError, requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.ok) {
    return jsonError(admin.message, admin.status);
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("memos").delete().not("id", "is", null);

  if (error) {
    return jsonError("전체 메모 삭제에 실패했습니다.", 500);
  }

  return Response.json({ ok: true });
}
