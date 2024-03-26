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
  insertAndSortTaskById,
  stringToColor,
} from "@/app/lib/utils";
import TaskCard from "@/app/ui/components/Categories/TaskCard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "next/image";

import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { number } from "zod";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import SkeletonLoader from "@/app/ui/components/Categories/TasksSkeleton";

function Home() {
  const [today, setToday] = useState<Dayjs | undefined>(dayjs());
  const [categorizedTasks, setCategorizedTasks] = useState<CategorizedTasks[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dndItem, setDndItem] = useState({
    id: -1,
    src: "",
    target: "",
  });

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
      <div className="px-20 py-10 w-full h-full">
        <div className="w-full border-b pb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-600 mt-3">
            Today, {today?.format("dddd D MMMM YYYY")}
          </p>
        </div>
        <div className="flex flex-col gap-y-4 mt-5 w-full">
          {isLoading ? (
            <SkeletonLoader categories={categorizedTasks} />
          ) : (
            categorizedTasks.map((tasksByCategory, index) => {
              const color = stringToColor(tasksByCategory.category);
              return (
                <div className="flex flex-col w-full mb-4" key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h2 className="font-bold" style={{ color: color }}>
                        {tasksByCategory.category}
                      </h2>
                      {hasIcon(tasksByCategory.category) && (
                        <Image
                          src={`/icons/${
                            categories[iconIndex(tasksByCategory.category)].icon
                          }`}
                          width={18}
                          height={18}
                          alt={tasksByCategory.category}
                          className="ml-2"
                        />
                      )}
                      <div className="ml-2 bg-gray-100 text-gray-500 px-1 rounded-full">{tasksByCategory.tasks.length}</div>
                    </div>
                    <div className="">
                      <button
                        onClick={() =>
                          handleDeleteCategory(tasksByCategory.category, index)
                        }
                      >
                        <Tooltip title="Delete this category" placement="top">
                          <TrashIcon className="w-4 text-red-600" />
                        </Tooltip>
                      </button>
                    </div>
                  </div>
                  <div
                    className={`gap-3 mt-2 pt-2 border-t ${tasksByCategory.tasks.length && 'grid grid-cols-4 max-md:grid-cols-2 '}`}
                    onDragEnter={(e) => {
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
                    }}
                  >
                    {tasksByCategory.tasks.length?  tasksByCategory.tasks.map((task, taskIndex) => {
                      return (
                        <TaskCard
                          key={task + taskIndex}
                          tasks={task}
                          color={color}
                          item={dndItem}
                          setDndItem={setDndItem}
                        />
                      );
                    }): <div className="h-[80px] w-full flex items-center justify-center text-gray-400">Nothing to do</div>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Home;
