"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { fetchTasksBetween } from "@/app/lib/script";
import { TaskType } from "@/app/lib/definitions";
import { useTasks } from "@/app/lib/hooks/TasksProvider";
import dayjs, { DATE_FORMAT, compareTasks, relativeDayLabel, todayKey } from "@/app/lib/dates";
import { stringToColor } from "@/app/lib/utils";
import PageHeader from "@/app/ui/components/PageHeader";
import NothingToDo from "@/app/ui/components/Tasks/NothingToDo";
import TaskItem from "@/app/ui/components/Tasks/TaskItem";
import TaskCreation from "@/app/ui/components/Tasks/TaskCreation";
import { useSnackbar } from "@/app/ui/components/Tasks/SnackbarContext";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Monday-first grid covering the whole month.
function monthGrid(month: dayjs.Dayjs) {
  const first = month.startOf("month");
  const start = first.subtract((first.day() + 6) % 7, "day");
  const weeks = Math.ceil(((first.day() + 6) % 7 + month.daysInMonth()) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => start.add(i, "day"));
}

export default function Calendar() {
  const { pending, deleting, version, isLoading } = useTasks();
  const { showError } = useSnackbar();
  const [month, setMonth] = useState(() => dayjs().startOf("month"));
  const [selected, setSelected] = useState(todayKey());
  const [fetched, setFetched] = useState<TaskType[]>([]);

  const days = useMemo(() => monthGrid(month), [month]);
  const from = days[0].format(DATE_FORMAT);
  const to = days[days.length - 1].format(DATE_FORMAT);

  useEffect(() => {
    fetchTasksBetween(from, to)
      .then(setFetched)
      .catch(() => showError("Could not load the calendar."));
  }, [from, to, version, showError]);

  // Pending tasks from the shared state are always the freshest version.
  const tasks = useMemo(() => {
    if (isLoading) return fetched;
    const pendingById = new Map(pending.map((t) => [t.id, t]));
    const merged = fetched
      .filter((t) => !deleting.includes(t.id) && !pendingById.has(t.id))
      .map((t) => (t.status === "Pending" ? { ...t, status: "Done" as const } : t));
    const inRange = pending.filter((t) => t.date >= from && t.date <= to);
    return [...merged, ...inRange].sort(compareTasks);
  }, [fetched, pending, deleting, from, to, isLoading]);

  const byDay = useMemo(() => {
    const map = new Map<string, TaskType[]>();
    tasks.forEach((t) => map.set(t.date, [...(map.get(t.date) ?? []), t]));
    return map;
  }, [tasks]);

  const today = todayKey();
  const selectedTasks = byDay.get(selected) ?? [];

  const goTo = (target: dayjs.Dayjs) => {
    setMonth(target.startOf("month"));
    setSelected(target.format(DATE_FORMAT));
  };

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 pb-28 md:pb-28 w-full">
      <PageHeader title="Calendar" subtitle="Pick a day to see and plan its tasks.">
        <div className="flex items-center gap-x-1">
          <button
            type="button"
            onClick={() => goTo(dayjs())}
            className="px-3 py-2 mr-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth(month.subtract(1, "month"))}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeftIcon className="w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth(month.add(1, "month"))}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ChevronRightIcon className="w-5" aria-hidden="true" />
          </button>
        </div>
      </PageHeader>

      <div className="grid gap-6 mt-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="month-title" className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
          <h2 id="month-title" className="px-1 mb-3 text-lg font-semibold text-slate-900" aria-live="polite">
            {month.format("MMMM YYYY")}
          </h2>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-1" aria-hidden="true">
            {weekDays.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const key = day.format(DATE_FORMAT);
              const dayTasks = byDay.get(key) ?? [];
              const open = dayTasks.filter((t) => t.status === "Pending");
              const inMonth = day.month() === month.month();
              const isSelected = key === selected;
              const isToday = key === today;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${day.format("dddd D MMMM")}, ${open.length} to do, ${dayTasks.length - open.length} done`}
                  onClick={() => setSelected(key)}
                  className={`flex flex-col items-center sm:items-start gap-1 min-h-[3.25rem] sm:min-h-[5.5rem] p-1.5 sm:p-2 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-primary-soft ring-2 ring-primary"
                      : "hover:bg-slate-50"
                  } ${inMonth ? "" : "opacity-40"}`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-sm tabular-nums ${
                      isToday ? "bg-primary text-white font-semibold" : "text-slate-700"
                    }`}
                  >
                    {day.date()}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="flex flex-wrap items-center gap-0.5" aria-hidden="true">
                      {dayTasks.slice(0, 4).map((t) => (
                        <span
                          key={t.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: t.status === "Done" ? "#CBD5E1" : stringToColor(t.category),
                          }}
                        />
                      ))}
                      {dayTasks.length > 4 && (
                        <span className="text-[10px] leading-none text-slate-500">+{dayTasks.length - 4}</span>
                      )}
                    </span>
                  )}
                  {open[0] && (
                    <span className="hidden sm:block w-full truncate text-xs text-slate-600" aria-hidden="true">
                      {open[0].name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="selected-title" className="lg:sticky lg:top-6 self-start">
          <h2 id="selected-title" className="flex items-baseline gap-x-2 px-1 mb-3 font-semibold text-slate-900">
            {relativeDayLabel(selected)}
            <span className="font-normal text-slate-500">{dayjs(selected).format("D MMM YYYY")}</span>
          </h2>
          {selectedTasks.length ? (
            <ul className="flex flex-col gap-y-2">
              {selectedTasks.map((task) => (
                <li key={task.id}>
                  <TaskItem task={task} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300">
              <NothingToDo
                title="Nothing planned"
                hint="Use “Create a task” to add one on this day."
              />
            </div>
          )}
        </section>
      </div>
      <TaskCreation defaultDate={selected} />
    </div>
  );
}
