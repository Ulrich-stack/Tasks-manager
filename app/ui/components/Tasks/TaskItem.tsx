"use client";

import React from "react";
import { Tooltip } from "@mui/material";
import {
  Bars3BottomLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { TaskType } from "@/app/lib/definitions";
import { useTasks } from "@/app/lib/hooks/TasksProvider";
import { formatTimeRange, relativeDayLabel, todayKey } from "@/app/lib/dates";
import { stringToColor } from "@/app/lib/utils";
import CategoryBadge from "../CategoryBadge";
import TaskActionsMenu from "./TaskActionsMenu";

export default function TaskItem({
  task,
  showDate = false,
  showCategory = true,
  onDragStart,
  onDragEnd,
}: {
  task: TaskType;
  showDate?: boolean;
  showCategory?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const { complete, reopen } = useTasks();
  const isDone = task.status === "Done";
  const isOverdue = !isDone && task.date < todayKey();
  const time = formatTimeRange(task);

  return (
    <div
      className={`group relative flex items-start gap-x-3 bg-white pl-4 pr-1.5 py-3 rounded-xl border border-slate-200 transition-shadow hover:shadow-md ${
        onDragStart ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <span
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
        style={{ backgroundColor: stringToColor(task.category) }}
        aria-hidden="true"
      />
      <button
        type="button"
        role="checkbox"
        aria-checked={isDone}
        aria-label={isDone ? `Mark ${task.name} as not done` : `Complete ${task.name}`}
        onClick={() => (isDone ? reopen(task) : complete(task))}
        className="shrink-0 -m-2 p-2 rounded-full"
      >
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${
            isDone
              ? "bg-primary border-primary text-white"
              : "border-slate-300 text-transparent hover:border-primary hover:text-primary/40"
          }`}
        >
          <CheckIcon className="w-3" aria-hidden="true" />
        </span>
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold break-words ${
            isDone ? "text-slate-400 line-through" : "text-slate-900"
          }`}
        >
          {task.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-slate-500 tabular-nums">
          {(showDate || isOverdue) && (
            <span
              className={`inline-flex items-center gap-x-1 ${
                isOverdue ? "text-red-600 font-medium" : ""
              }`}
            >
              <CalendarDaysIcon className="w-4" aria-hidden="true" />
              {relativeDayLabel(task.date)}
            </span>
          )}
          {time && (
            <span className="inline-flex items-center gap-x-1">
              <ClockIcon className="w-4" aria-hidden="true" />
              {time}
            </span>
          )}
          {showCategory && <CategoryBadge category={task.category} />}
          {task.details && (
            <Tooltip title={task.details} placement="top">
              <span
                tabIndex={0}
                className="inline-flex items-center gap-x-1 rounded"
                aria-label={`Details: ${task.details}`}
              >
                <Bars3BottomLeftIcon className="w-4" aria-hidden="true" />
                Notes
              </span>
            </Tooltip>
          )}
        </div>
      </div>

      <TaskActionsMenu task={task} />
    </div>
  );
}
