"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";

type MemoFormModalProps = {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onCreate: (input: { title: string; content: string; password: string }) => Promise<void>;
};

export function MemoFormModal({ open, saving, onClose, onCreate }: MemoFormModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");

  if (!open) {
    return null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreate({ title, content, password });
    setTitle("");
    setContent("");
    setPassword("");
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/35 p-3 sm:items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">메모 작성</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            aria-label="닫기"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-700">제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            maxLength={80}
            autoFocus
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-700">내용</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            maxLength={1200}
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-medium text-slate-700">4자리 작성자 암호</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm tracking-[0.4em] outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            inputMode="numeric"
            maxLength={4}
            type="password"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
