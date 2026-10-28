"use client";

import { categories } from "@/app/lib/categories";
import { CategorizedTasks } from "@/app/lib/definitions";
import {
  deleteCategory,
  fetchAllPendingTask,
  fetchCategories,
  updateCategory,
} from "@/app/lib/script";
import {
  hasIcon,
  iconIndex,
  stringToColor,
  stringToTint,
} from "@/app/lib/utils";
import TaskCard from "@/app/ui/components/Categories/TaskCard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "next/image";

import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@mui/material";
import SkeletonLoader from "@/app/ui/components/Categories/TasksSkeleton";
import PageHeader from "@/app/ui/components/PageHeader";
import NothingToDo from "@/app/ui/components/Tasks/NothingToDo";

const noDrag = { id: -1, src: "", target: "" };

function Home() {
  const [categorizedTasks, setCategorizedTasks] = useState<CategorizedTasks[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dndItem, setDndItem] = useState(noDrag);

  async function loadTasks() {
    setIsLoading(true);
    try {
      const results: CategorizedTasks[] = await fetchAllPendingTask();
      setCategorizedTasks(results);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    setIsLoading(false);
  }

  function handleDeleteCategory(category: string, index: number) {
    let newCategorizedTasks = [...categorizedTasks];
    newCategorizedTasks.splice(index, 1);
    setCategorizedTasks(newCategorizedTasks);

    deleteCategory(category).catch((err) => {
      console.warn(`Error deleting category ${category}: `, err);
    });
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="px-4 py-6 md:px-10 md:py-10 w-full">
        <PageHeader
          title="Categories"
          subtitle="Drag a task onto another category to move it."
        />
        <div className="flex flex-col gap-y-5 mt-8 w-full">
          {isLoading ? (
            <SkeletonLoader categories={categorizedTasks} />
          ) : !categorizedTasks.length ? (
            <NothingToDo
              title="No categories yet"
              hint="Create a task to start a category."
            />
          ) : (
            categorizedTasks.map((tasksByCategory, index) => {
              const color = stringToColor(tasksByCategory.category);
              const isDropTarget =
                dndItem.id !== -1 &&
                dndItem.target === tasksByCategory.category &&
                dndItem.src !== tasksByCategory.category;
              return (
                <section
                  className={`flex flex-col w-full rounded-2xl border p-4 transition-colors ${
                    isDropTarget
                      ? "border-primary bg-primary-soft"
                      : "border-slate-200 bg-white"
                  }`}
                  key={index}
                  onDragEnter={() => {
                    setDndItem({
                      ...dndItem,
                      target: tasksByCategory.category,
                    });
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dndItem.src !== dndItem.target) {
                      updateCategory(dndItem.id, dndItem.target);
                      loadTasks();
                    }
                    setDndItem(noDrag);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{ backgroundColor: stringToTint(tasksByCategory.category) }}
                        aria-hidden="true"
                      >
                        {hasIcon(tasksByCategory.category) ? (
                          <Image
                            src={`/icons/${
                              categories[iconIndex(tasksByCategory.category)].icon
                            }`}
                            width={18}
                            height={18}
                            alt=""
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        )}
                      </span>
                      <h2 className="font-semibold text-base text-slate-900">
                        {tasksByCategory.category}
                      </h2>
                      <span className="px-2 rounded-full bg-slate-100 text-xs font-medium text-slate-500 tabular-nums">
                        {tasksByCategory.tasks.length}
                      </span>
                    </div>
                    <Tooltip title="Delete this category and its tasks" placement="top">
                      <button
                        type="button"
                        aria-label={`Delete category ${tasksByCategory.category}`}
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() =>
                          handleDeleteCategory(tasksByCategory.category, index)
                        }
                      >
                        <TrashIcon className="w-[18px]" aria-hidden="true" />
                      </button>
                    </Tooltip>
                  </div>
                  {tasksByCategory.tasks.length ? (
                    <div className="grid gap-3 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {tasksByCategory.tasks.map((task, taskIndex) => {
                        return (
                          <TaskCard
                            key={task + taskIndex}
                            tasks={task}
                            color={color}
                            item={dndItem}
                            setDndItem={setDndItem}
                          />
                        );
                      })}
                    </div>
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
      </div>
    </LocalizationProvider>
  );
}

export default Home;
