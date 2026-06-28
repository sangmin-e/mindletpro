import { jsonError, requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.ok) {
    return jsonError(admin.message, admin.status);
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;

  if (!body?.id) {
    return jsonError("삭제할 메모를 찾을 수 없습니다.");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("memos").delete().eq("id", body.id);

  if (error) {
    return jsonError("관리자 삭제에 실패했습니다.", 500);
  }

  return Response.json({ ok: true });
}
