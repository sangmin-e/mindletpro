"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPanel } from "@/components/AdminPanel";
import { Board } from "@/components/Board";
import { DeleteMemoModal } from "@/components/DeleteMemoModal";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Header } from "@/components/Header";
import { MemoFormModal } from "@/components/MemoFormModal";
import { Toast } from "@/components/Toast";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { Memo, ToastTone } from "@/lib/types";

type DeleteState = {
  memo: Memo;
  mode: "owner" | "admin";
} | null;

export function MindletApp() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ id: number; message: string; tone: ToastTone } | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

  const loadMemos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/memos", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "메모를 불러오지 못했습니다.");
      }

      setMemos(result.memos ?? []);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "동기화에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const checkAdmin = useCallback(
    async (token: string | null) => {
      if (!token) {
        setIsAdmin(false);
        setAdminEmail(null);
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();

      setIsAdmin(Boolean(result.isAdmin));
      setAdminEmail(result.email ?? null);
    },
    [],
  );

  useEffect(() => {
    void loadMemos();

    let supabase: ReturnType<typeof getSupabaseClient>;

    try {
      supabase = getSupabaseClient();
    } catch {
      showToast("Supabase 환경 변수를 설정하면 로그인과 저장을 사용할 수 있습니다.", "info");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token ?? null;
      setUserEmail(data.session?.user.email ?? null);
      setAccessToken(token);
      void checkAdmin(token);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const token = session?.access_token ?? null;
      setUserEmail(session?.user.email ?? null);
      setAccessToken(token);
      void checkAdmin(token);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [checkAdmin, loadMemos, showToast]);

  async function createMemo(input: { title: string; content: string; password: string }) {
    setSaving(true);
    try {
      const response = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "메모를 저장하지 못했습니다.");
      }

      setMemos((current) => [result.memo, ...current]);
      setFormOpen(false);
      showToast("메모 작성 완료", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "메모 작성 실패", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMemo(password?: string) {
    if (!deleteState) {
      return;
    }

    setDeleting(true);
    try {
      const adminDelete = deleteState.mode === "admin";
      const response = await fetch(adminDelete ? "/api/admin/delete" : "/api/memos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminDelete && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ id: deleteState.memo.id, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "삭제 실패");
      }

      setMemos((current) => current.filter((memo) => memo.id !== deleteState.memo.id));
      setDeleteState(null);
      showToast("메모 삭제 완료", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "메모 삭제 실패", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function deleteAll() {
    if (!accessToken) {
      showToast("관리자 로그인이 필요합니다.", "error");
      return;
    }

    const confirmed = window.confirm("전체 메모를 삭제할까요? 이 작업은 되돌릴 수 없습니다.");

    if (!confirmed) {
      return;
    }

    setDeletingAll(true);
    try {
      const response = await fetch("/api/admin/delete-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "전체 삭제 실패");
      }

      setMemos([]);
      setAdminPanelOpen(false);
      showToast("전체 메모 삭제 완료", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "전체 삭제 실패", "error");
    } finally {
      setDeletingAll(false);
    }
  }

  async function logout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminEmail(null);
    setUserEmail(null);
    setAccessToken(null);
    showToast("로그아웃 완료", "success");
  }

  async function reorderMemos(nextMemos: Memo[]) {
    if (!accessToken) {
      showToast("관리자 로그인이 필요합니다.", "error");
      return;
    }

    const previousMemos = memos;
    setMemos(nextMemos.map((memo, index) => ({ ...memo, position_index: index })));

    try {
      const response = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids: nextMemos.map((memo) => memo.id) }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "위치 저장 실패");
      }

      showToast("메모 위치 저장 완료", "success");
    } catch (error) {
      setMemos(previousMemos);
      showToast(error instanceof Error ? error.message : "메모 위치 저장 실패", "error");
    }
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleMemos = normalizedSearch
    ? memos.filter((memo) =>
        `${memo.title} ${memo.content}`.toLowerCase().includes(normalizedSearch),
      )
    : memos;
  const canReorder = isAdmin && !normalizedSearch;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        isAdmin={isAdmin}
        userEmail={userEmail ?? adminEmail}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSync={() => {
          void loadMemos().then(() => showToast("동기화 완료", "success"));
        }}
        onAdminPanel={() => setAdminPanelOpen(true)}
        onLogout={() => void logout()}
      />
      <Board
        memos={visibleMemos}
        isAdmin={isAdmin}
        canReorder={canReorder}
        onDelete={(memo, mode) => setDeleteState({ memo, mode })}
        onReorder={(nextMemos) => void reorderMemos(nextMemos)}
      />
      <FloatingActionButton onClick={() => setFormOpen(true)} />
      <MemoFormModal
        open={formOpen}
        saving={saving}
        onClose={() => setFormOpen(false)}
        onCreate={createMemo}
      />
      <DeleteMemoModal
        memo={deleteState?.memo ?? null}
        mode={deleteState?.mode ?? "owner"}
        deleting={deleting}
        onClose={() => setDeleteState(null)}
        onConfirm={deleteMemo}
      />
      <AdminPanel
        open={adminPanelOpen}
        email={adminEmail}
        deletingAll={deletingAll}
        onClose={() => setAdminPanelOpen(false)}
        onDeleteAll={deleteAll}
      />
      <Toast toast={toast} />
    </div>
  );
}
