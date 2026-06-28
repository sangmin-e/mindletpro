import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hashMemoPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("memos")
      .select("id,title,content,created_at,position_index")
      .order("position_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: "메모를 불러오지 못했습니다." }, { status: 500 });
    }

    return Response.json({ memos: data ?? [] });
  } catch {
    return Response.json(
      { error: "Supabase 환경 변수를 설정한 뒤 메모를 불러올 수 있습니다." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    title?: string;
    content?: string;
    password?: string;
  } | null;

  const title = body?.title?.trim() ?? "";
  const content = body?.content?.trim() ?? "";
  const password = body?.password?.trim() ?? "";

  if (!title || !content) {
    return Response.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
  }

  try {
    const passwordHash = await hashMemoPassword(password);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("memos")
      .insert({ title, content, password_hash: passwordHash, position_index: Date.now() })
      .select("id,title,content,created_at,position_index")
      .single();

    if (error) {
      return Response.json({ error: "메모를 저장하지 못했습니다." }, { status: 500 });
    }

    return Response.json({ memo: data }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "메모 저장 중 오류가 발생했습니다." },
      { status: 400 },
    );
  }
}
