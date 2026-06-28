"use client";

import { Shield, Trash2, X } from "lucide-react";

type AdminPanelProps = {
  open: boolean;
  email: string | null;
  deletingAll: boolean;
  onClose: () => void;
  onDeleteAll: () => Promise<void>;
};

export function AdminPanel({ open, email, deletingAll, onClose, onDeleteAll }: AdminPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/35 p-3 sm:items-center">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              Admin Mode
            </div>
            <h2 className="text-lg font-semibold text-slate-900">관리자 패널</h2>
            <p className="mt-1 break-words text-sm text-slate-500">{email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            aria-label="닫기"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <button
          type="button"
          onClick={onDeleteAll}
          disabled={deletingAll}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          {deletingAll ? "전체 삭제 중" : "전체 메모 삭제"}
        </button>
      </section>
    </div>
  );
}
