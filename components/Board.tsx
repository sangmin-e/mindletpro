"use client";

import { useState } from "react";
import type { Memo } from "@/lib/types";
import { MemoCard } from "@/components/MemoCard";

type BoardProps = {
  memos: Memo[];
  isAdmin: boolean;
  onDelete: (memo: Memo, mode: "owner" | "admin") => void;
  onReorder: (memos: Memo[]) => void;
  canReorder: boolean;
};

export function Board({ memos, isAdmin, onDelete, onReorder, canReorder }: BoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  if (memos.length === 0) {
    return <main className="mindlet-board-surface min-h-[calc(100vh-88px)] px-5 py-8 lg:px-7" />;
  }

  function moveMemo(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      return;
    }

    const fromIndex = memos.findIndex((memo) => memo.id === draggedId);
    const toIndex = memos.findIndex((memo) => memo.id === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const nextMemos = [...memos];
    const [movedMemo] = nextMemos.splice(fromIndex, 1);
    nextMemos.splice(toIndex, 0, movedMemo);
    onReorder(nextMemos);
  }

  return (
    <main className="mindlet-board-surface min-h-[calc(100vh-88px)] px-5 py-8 pb-32 lg:px-7">
      <div className="grid max-w-[1580px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {memos.map((memo, index) => (
          <div
            key={memo.id}
            draggable={canReorder}
            onDragStart={(event) => {
              if (!canReorder) {
                return;
              }

              setDraggedId(memo.id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", memo.id);
            }}
            onDragOver={(event) => {
              if (canReorder) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }
            }}
            onDrop={(event) => {
              if (!canReorder) {
                return;
              }

              event.preventDefault();
              moveMemo(memo.id);
              setDraggedId(null);
            }}
            onDragEnd={() => setDraggedId(null)}
            className={`${index % 5 === 1 ? "rotate-[0.15deg]" : index % 5 === 3 ? "rotate-[-0.15deg]" : ""} ${
              canReorder ? "cursor-grab active:cursor-grabbing" : ""
            } ${draggedId === memo.id ? "opacity-50" : ""}`}
          >
            <MemoCard memo={memo} isAdmin={isAdmin} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </main>
  );
}
