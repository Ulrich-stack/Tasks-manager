"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchCompletedTasks } from "@/app/lib/script";
import { TaskType } from "@/app/lib/definitions";
import { useTasks } from "@/app/lib/hooks/TasksProvider";
import { relativeDayLabel, todayKey } from "@/app/lib/dates";
import dayjs from "@/app/lib/dates";
import PageHeader from "@/app/ui/components/PageHeader";
import NothingToDo from "@/app/ui/components/Tasks/NothingToDo";
import SkeletonCategorie from "@/app/ui/components/Tasks/SkeletonCategorie";
import TaskItem from "@/app/ui/components/Tasks/TaskItem";
import SearchFilter, { filterTasks } from "@/app/ui/components/SearchFilter";
import { useSnackbar } from "@/app/ui/components/Tasks/SnackbarContext";

export default function Completed() {
  const { pending, deleting, version, categories } = useTasks();
  const { showError } = useSnackbar();
  const [done, setDone] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchCompletedTasks()
      .then(setDone)
      .catch(() => showError("Could not load your completed tasks."))
      .finally(() => setIsLoading(false));
  }, [version, showError]);

  // Hide right away what was just reopened or deleted, before the refetch.
  const visible = useMemo(() => {
    const reopened = new Set(pending.map((t) => t.id));
    return filterTasks(
      done.filter((t) => !reopened.has(t.id) && !deleting.includes(t.id)),
      query,
      category
    );
  }, [done, pending, deleting, query, category]);

  const groups = useMemo(() => {
    const byDay = new Map<string, TaskType[]>();
    visible.forEach((t) => byDay.set(t.date, [...(byDay.get(t.date) ?? []), t]));
    return Array.from(byDay);
  }, [visible]);

  // Weeks start on Monday, like the calendar.
  const monday = dayjs().subtract((dayjs().day() + 6) % 7, "day").format("YYYY-MM-DD");
  const thisWeek = visible.filter((t) => t.date >= monday && t.date <= todayKey()).length;

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 w-full">
      <PageHeader
        title="Completed"
        subtitle={
          isLoading
            ? "Your finished tasks."
            : `${visible.length} ${visible.length === 1 ? "task" : "tasks"} done · ${thisWeek} this week`
        }
      />
      <div className="mt-6">
        <SearchFilter
          query={query}
          setQuery={setQuery}
          categories={categories}
          category={category}
          setCategory={setCategory}
        />
      </div>
      <div className="max-w-2xl mt-8">
        {isLoading ? (
          <SkeletonCategorie />
        ) : !groups.length ? (
          query || category ? (
            <NothingToDo title="No matching task" hint="Try another search or category." />
          ) : (
            <NothingToDo
              title="Nothing completed yet"
              hint="Tick a task in your list and it will show up here."
            />
          )
        ) : (
          <div className="flex flex-col gap-y-6">
            {groups.map(([date, tasks]) => (
              <section key={date} aria-labelledby={`day-${date}`}>
                <h2
                  id={`day-${date}`}
                  className="flex items-baseline gap-x-2 mb-2 px-1 font-semibold text-slate-900"
                >
                  {relativeDayLabel(date)}
                  <span className="font-normal text-slate-500">
                    {dayjs(date).format("D MMM YYYY")}
                  </span>
                </h2>
                <ul className="flex flex-col gap-y-2">
                  {tasks.map((task) => (
                    <li key={task.id}>
                      <TaskItem task={task} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
