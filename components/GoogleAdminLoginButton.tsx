"use client";

import { ShieldCheck } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export function GoogleAdminLoginButton() {
  async function login() {
    let supabase: ReturnType<typeof getSupabaseClient>;

    try {
      supabase = getSupabaseClient();
    } catch {
      window.alert("Supabase 환경 변수를 설정한 뒤 Google 로그인을 사용할 수 있습니다.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  return (
    <button
      type="button"
      onClick={login}
      className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
    >
      <ShieldCheck className="h-4 w-4 text-sky-500" aria-hidden />
      <span className="hidden sm:inline">Google 로그인</span>
    </button>
  );
}
