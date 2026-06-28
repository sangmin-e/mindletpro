"use client";

import { FormEvent, useState } from "react";
import type { Memo } from "@/lib/types";

type DeleteMemoModalProps = {
  memo: Memo | null;
  mode: "owner" | "admin";
  deleting: boolean;
  onClose: () => void;
  onConfirm: (password?: string) => Promise<void>;
};

export function DeleteMemoModal({
  memo,
  mode,
  deleting,
  onClose,
  onConfirm,
}: DeleteMemoModalProps) {
  const [password, setPassword] = useState("");

  if (!memo) {
    return null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onConfirm(mode === "owner" ? password : undefined);
    setPassword("");
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/35 p-3 sm:items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-slate-900">메모 삭제</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {mode === "admin"
            ? `"${memo.title}" 메모를 관리자 권한으로 삭제합니다.`
            : `"${memo.title}" 메모 작성 시 입력한 4자리 암호를 입력해주세요.`}
        </p>

        {mode === "owner" ? (
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">4자리 작성자 암호</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm tracking-[0.4em] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              inputMode="numeric"
              maxLength={4}
              type="password"
              autoFocus
            />
          </label>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={deleting}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "삭제 중" : "삭제"}
          </button>
        </div>
      </form>
    </div>
  );
}
