"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Dialog, Tooltip } from "@mui/material";
import { categories as categoryIcons } from "@/app/lib/categories";
import { hasIcon, iconIndex, stringToColor, stringToTint } from "@/app/lib/utils";
import { useCategorizedTasks, useTasks } from "@/app/lib/hooks/TasksProvider";
import { TaskType } from "@/app/lib/definitions";
import SkeletonLoader from "@/app/ui/components/Categories/TasksSkeleton";
import PageHeader from "@/app/ui/components/PageHeader";
import NothingToDo from "@/app/ui/components/Tasks/NothingToDo";
import TaskItem from "@/app/ui/components/Tasks/TaskItem";
import SearchFilter, { filterTasks } from "@/app/ui/components/SearchFilter";

function Home() {
  const { pending, isLoading, moveTo, removeCategory } = useTasks();
  const [query, setQuery] = useState("");
  const [dragged, setDragged] = useState<TaskType | null>(null);
  const [dropTarget, setDropTarget] = useState("");
  const [toDelete, setToDelete] = useState("");

  const visible = useMemo(() => filterTasks(pending, query), [pending, query]);
  const groups = useCategorizedTasks(visible).filter(
    (group) => !query || group.tasks.length
  );
  const deleteCount = pending.filter((t) => t.category === toDelete).length;

  const endDrag = () => {
    setDragged(null);
    setDropTarget("");
  };

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 w-full">
      <PageHeader
        title="Categories"
        subtitle="Drag a task onto another category, or use its ⋮ menu → Move to…"
      />
      <div className="mt-6">
        <SearchFilter query={query} setQuery={setQuery} />
      </div>
      <div className="flex flex-col gap-y-5 mt-6 w-full">
        {isLoading ? (
          <SkeletonLoader categories={[]} />
        ) : !groups.length ? (
          query ? (
            <NothingToDo title="No matching task" hint="Try another search." />
          ) : (
            <NothingToDo title="No categories yet" hint="Create a task to start a category." />
          )
        ) : (
          groups.map(({ category, tasks }) => {
            const isDropTarget =
              dragged !== null && dropTarget === category && dragged.category !== category;
            return (
              <section
                key={category}
                aria-labelledby={`cat-${category}`}
                className={`flex flex-col w-full rounded-2xl border p-4 transition-colors ${
                  isDropTarget ? "border-primary bg-primary-soft" : "border-slate-200 bg-white"
                }`}
                onDragEnter={() => setDropTarget(category)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragged) moveTo(dragged, category);
                  endDrag();
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ backgroundColor: stringToTint(category) }}
                      aria-hidden="true"
                    >
                      {hasIcon(category) ? (
                        <Image
                          src={`/icons/${categoryIcons[iconIndex(category)].icon}`}
                          width={18}
                          height={18}
                          alt=""
                        />
                      ) : (
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: stringToColor(category) }}
                        />
                      )}
                    </span>
                    <h2 id={`cat-${category}`} className="font-semibold text-base text-slate-900">
                      {category}
                    </h2>
                    <span className="px-2 rounded-full bg-slate-100 text-xs font-medium text-slate-500 tabular-nums">
                      {tasks.length}
                    </span>
                  </div>
                  <Tooltip title="Delete this category" placement="top">
                    <button
                      type="button"
                      aria-label={`Delete category ${category}`}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => setToDelete(category)}
                    >
                      <TrashIcon className="w-[18px]" aria-hidden="true" />
                    </button>
                  </Tooltip>
                </div>
                {tasks.length ? (
                  <ul className="grid gap-3 mt-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((task) => (
                      <li key={task.id}>
                        <TaskItem
                          task={task}
                          showDate
                          showCategory={false}
                          onDragStart={() => setDragged(task)}
                          onDragEnd={endDrag}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4 h-20 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-500">
                    No pending task. Drop one here.
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>

      <Dialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete("")}
        aria-labelledby="delete-category-title"
        PaperProps={{ sx: { borderRadius: "16px", p: 3, maxWidth: 400 } }}
      >
        <h2 id="delete-category-title" className="text-lg font-bold text-slate-900">
          Delete “{toDelete}”?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {deleteCount
            ? `Its ${deleteCount} pending ${deleteCount === 1 ? "task" : "tasks"} and its completed tasks will be deleted too. This cannot be undone.`
            : "Its completed tasks will be deleted too. This cannot be undone."}
        </p>
        <div className="flex justify-end gap-x-2 mt-6 text-sm">
          <button
            type="button"
            autoFocus
            onClick={() => setToDelete("")}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              removeCategory(toDelete);
              setToDelete("");
            }}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
          >
            Delete category
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default Home;
