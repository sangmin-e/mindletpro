import { jsonError } from "@/lib/adminAuth";
import { verifyMemoPassword } from "@/lib/password";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    password?: string;
  } | null;

  const id = body?.id;
  const password = body?.password?.trim() ?? "";

  if (!id) {
    return jsonError("삭제할 메모를 찾을 수 없습니다.");
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: memo, error: readError } = await supabase
      .from("memos")
      .select("id,password_hash")
      .eq("id", id)
      .single();

    if (readError || !memo) {
      return jsonError("삭제할 메모를 찾을 수 없습니다.", 404);
    }

    const verified = await verifyMemoPassword(password, memo.password_hash);

    if (!verified) {
      return jsonError("작성자 암호가 일치하지 않습니다.", 403);
    }

    const { error: deleteError } = await supabase.from("memos").delete().eq("id", id);

    if (deleteError) {
      return jsonError("메모를 삭제하지 못했습니다.", 500);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.");
  }
}
