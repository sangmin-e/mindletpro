"use client";

import { LogOut, RefreshCw, Search, Share2, Shield } from "lucide-react";
import { GoogleAdminLoginButton } from "@/components/GoogleAdminLoginButton";

type HeaderProps = {
  isAdmin: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSync: () => void;
  onAdminPanel: () => void;
  onLogout: () => void;
};

export function Header({
  isAdmin,
  isLoggedIn,
  loading,
  searchQuery,
  onSearchChange,
  onSync,
  onAdminPanel,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-[0_8px_28px_-24px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-7">
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.34em] text-sky-500">
            INSTANT BOARD
          </p>
          <div className="mt-1 flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
            <h1 className="truncate text-[26px] font-extrabold leading-none text-slate-950">MINDLET</h1>
            <p className="pb-0.5 text-[15px] font-semibold text-slate-500">상민의 메모보드</p>
            <p className="pb-0.5 text-[15px] font-semibold text-sky-500 md:ml-8">
              Development by Sangmin Lee
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <label className="relative block w-full md:w-[360px] lg:w-[430px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-12 pr-4 text-[15px] font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="메모 검색"
              aria-label="메모 검색"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSync}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
              <span>동기화</span>
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
              aria-label="공유"
              title="공유"
            >
              <Share2 className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">공유</span>
            </button>

            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={onAdminPanel}
                    className="inline-flex h-12 items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-[15px] font-bold text-sky-700 shadow-sm transition hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-100"
                  >
                    <Shield className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Admin Mode</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  aria-label="로그아웃"
                  title="로그아웃"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
              </>
            ) : (
              <GoogleAdminLoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
