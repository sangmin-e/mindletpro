"use client";

import { Plus } from "lucide-react";

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-7 right-8 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_18px_36px_-14px_rgba(2,132,199,0.85)] transition hover:-translate-y-0.5 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-200"
      aria-label="메모 작성"
      title="메모 작성"
    >
      <Plus className="h-9 w-9" aria-hidden />
    </button>
  );
}
