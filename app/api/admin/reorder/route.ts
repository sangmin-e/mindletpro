import { jsonError, requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.ok) {
    return jsonError(admin.message, admin.status);
  }

  const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;

  if (!Array.isArray(body?.ids) || body.ids.length === 0) {
    return jsonError("저장할 메모 순서가 없습니다.");
  }

  const ids = body.ids.filter((id): id is string => typeof id === "string" && id.length > 0);
  const uniqueIds = Array.from(new Set(ids));

  if (uniqueIds.length !== ids.length) {
    return jsonError("중복된 메모가 포함되어 있습니다.");
  }

  const supabase = getSupabaseAdmin();
  const updates = await Promise.all(
    uniqueIds.map((id, index) =>
      supabase
        .from("memos")
        .update({ position_index: index })
        .eq("id", id),
    ),
  );

  const failed = updates.find((result) => result.error);

  if (failed?.error) {
    return jsonError("메모 위치 저장에 실패했습니다.", 500);
  }

  return Response.json({ ok: true });
}
