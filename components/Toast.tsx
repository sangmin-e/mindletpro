"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import type { ToastTone } from "@/lib/types";

type ToastMessage = {
  id: number;
  message: string;
  tone: ToastTone;
};

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) {
    return null;
  }

  const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "error" ? XCircle : Info;
  const toneClass =
    toast.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : toast.tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-sky-200 bg-sky-50 text-sky-900";

  return (
    <div
      className={`fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-md ${toneClass}`}
      role="status"
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>{toast.message}</span>
    </div>
  );
}
