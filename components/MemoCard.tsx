"use client";

import { GripVertical, MoreVertical, Trash2 } from "lucide-react";
import type { Memo } from "@/lib/types";

type MemoCardProps = {
  memo: Memo;
  isAdmin: boolean;
  onDelete: (memo: Memo, mode: "owner" | "admin") => void;
};

export function MemoCard({ memo, isAdmin, onDelete }: MemoCardProps) {
  return (
    <article className="group relative min-h-[230px] rounded-xl border border-sky-300 bg-slate-50/95 p-5 shadow-[0_14px_30px_-22px_rgba(2,132,199,0.65),0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-[0_18px_36px_-22px_rgba(2,132,199,0.78),0_2px_5px_rgba(15,23,42,0.1)]">
      <div className="mb-7 flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-[18px] font-extrabold leading-6 text-slate-950">
          {memo.title}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          {isAdmin ? (
            <>
              <span
                className="inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-full text-slate-300 transition group-hover:text-slate-500"
                aria-label="위치 이동"
                title="드래그해서 위치 이동"
              >
                <GripVertical className="h-4 w-4" aria-hidden />
              </span>
              <button
                type="button"
                onClick={() => onDelete(memo, "admin")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 opacity-80 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
                aria-label="관리자 삭제"
                title="관리자 삭제"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(memo, "owner")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 opacity-80 transition hover:bg-slate-100 hover:text-slate-800 group-hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
              aria-label="메모 메뉴"
              title="메모 메뉴"
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
      <p className="whitespace-pre-wrap break-words text-[16px] font-medium leading-8 text-slate-700">{memo.content}</p>
    </article>
  );
}
