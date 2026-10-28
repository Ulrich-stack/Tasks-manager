"use client";

import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TaskType } from "@/app/lib/definitions";
import { stringToColor } from "@/app/lib/utils";

export function filterTasks(tasks: TaskType[], query: string, category?: string) {
  const q = query.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (!category || t.category === category) &&
      (!q || t.name.toLowerCase().includes(q) || t.details.toLowerCase().includes(q))
  );
}

export default function SearchFilter({
  query,
  setQuery,
  categories,
  category,
  setCategory,
}: {
  query: string;
  setQuery: (value: string) => void;
  categories?: string[];
  category?: string;
  setCategory?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full sm:max-w-sm lg:w-72 shrink-0">
        <MagnifyingGlassIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Search tasks"
          aria-label="Search tasks"
          className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-900"
          >
            <XMarkIcon className="w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {categories && setCategory && categories.length > 0 && (
        <div
          role="group"
          aria-label="Filter by category"
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 md:flex-wrap md:overflow-visible md:pb-0"
        >
          {["", ...categories].map((c) => {
            const active = c === (category ?? "");
            return (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={`shrink-0 inline-flex items-center gap-x-1.5 px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {c && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stringToColor(c) }}
                    aria-hidden="true"
                  />
                )}
                {c || "All"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
