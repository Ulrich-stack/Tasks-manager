"use client";

import React, { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useTasks } from "@/app/lib/hooks/TasksProvider";
import { todayKey } from "@/app/lib/dates";

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

// One-line task creation for today. "N" anywhere on the page focuses it.
export default function QuickAdd({ category }: { category?: string }) {
  const { categories, create } = useTasks();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [chosen, setChosen] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fallback = categories.includes("Other") ? "Other" : categories[0] || "Other";
  const target = chosen || category || fallback;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target) || document.querySelector("[role=dialog], [role=menu]")) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || isSaving) return;
    setIsSaving(true);
    const ok = await create({
      name: name.trim(),
      category: target,
      date: todayKey(),
      hourfrom: "",
      hourto: "",
      details: "",
    });
    setIsSaving(false);
    if (ok) setName("");
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-x-2 rounded-xl border border-dashed border-slate-300 bg-white pl-3 pr-1.5 py-1.5 focus-within:border-primary focus-within:border-solid focus-within:ring-2 focus-within:ring-primary-ring/30 transition-colors"
    >
      <PlusIcon className="w-5 shrink-0 text-slate-400" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a task for today…"
        aria-label="Add a task for today"
        aria-keyshortcuts="N"
        className="flex-1 min-w-0 py-1.5 bg-transparent placeholder:text-slate-400 focus:outline-none"
      />
      <select
        value={target}
        onChange={(e) => setChosen(e.target.value)}
        aria-label="Category of the new task"
        className="max-w-[9rem] rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-ring/40"
      >
        {Array.from(new Set([target, ...categories])).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <kbd className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded border border-slate-200 text-xs text-slate-400 font-sans">
        N
      </kbd>
    </form>
  );
}
