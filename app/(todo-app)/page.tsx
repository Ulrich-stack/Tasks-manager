"use client";

import { useMemo, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Taskslist from "../ui/components/Tasks/Taskslist";
import TaskCreation from "../ui/components/Tasks/TaskCreation";
import NothingToDo from "../ui/components/Tasks/NothingToDo";
import QuickAdd from "../ui/components/Tasks/QuickAdd";
import PageHeader from "../ui/components/PageHeader";
import SearchFilter, { filterTasks } from "../ui/components/SearchFilter";
import SkeletonCategorie from "../ui/components/Tasks/SkeletonCategorie";
import { useTasks } from "../lib/hooks/TasksProvider";
import dayjs, { dayKey, todayKey } from "../lib/dates";

const periods = ["Today", "Next 3 days"];
const userName = process.env.NEXT_PUBLIC_USER_NAME;

function greeting() {
  const hour = dayjs().hour();
  const hello =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return userName ? `${hello}, ${userName}` : hello;
}

export default function Home() {
  const { pending, categories, isLoading, update } = useTasks();
  const [period, setPeriod] = useState("Today");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const today = todayKey();
  const visible = useMemo(
    () => filterTasks(pending, query, category),
    [pending, query, category]
  );
  const overdue = visible.filter((t) => t.date < today);
  const todays = visible.filter((t) => t.date === today);
  const isFiltering = Boolean(query || category);

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 pb-28 md:pb-28 w-full">
      <PageHeader
        title={greeting()}
        subtitle={`Today, ${dayjs().format("dddd D MMMM YYYY")}`}
      >
        <div role="group" aria-label="Period" className="inline-flex p-1 rounded-lg bg-slate-100">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                period === p
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="mt-6">
        <SearchFilter
          query={query}
          setQuery={setQuery}
          categories={categories}
          category={category}
          setCategory={setCategory}
        />
      </div>

      {isLoading ? (
        <div className="max-w-2xl mt-8">
          <SkeletonCategorie />
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <section
              aria-labelledby="overdue-title"
              className="max-w-2xl mt-8 rounded-2xl border border-red-200 bg-red-50/60 p-3"
            >
              <div className="flex items-center justify-between gap-2 px-1 mb-3">
                <h2 id="overdue-title" className="flex items-center gap-x-2 font-semibold text-red-700">
                  <ExclamationTriangleIcon className="w-5" aria-hidden="true" />
                  Overdue
                  <span className="px-2 rounded-full bg-red-100 text-xs tabular-nums">
                    {overdue.length}
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => overdue.forEach((t) => update(t, { date: today }))}
                  className="px-3 py-1.5 rounded-lg font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  Move all to today
                </button>
              </div>
              <Taskslist tasksList={overdue} />
            </section>
          )}

          {period === "Today" ? (
            <section aria-labelledby="today-title" className="max-w-2xl mt-8">
              <h2 id="today-title" className="sr-only">
                Today
              </h2>
              <QuickAdd category={category || undefined} />
              {todays.length ? (
                <div className="mt-3">
                  <Taskslist tasksList={todays} />
                </div>
              ) : isFiltering ? (
                <NothingToDo title="No matching task" hint="Try another search or category." />
              ) : (
                <NothingToDo />
              )}
            </section>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[0, 1, 2].map((offset) => {
                const key = dayKey(offset);
                const day = dayjs(key);
                const tasks = visible.filter((t) => t.date === key);
                const label =
                  offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : day.format("dddd");

                return (
                  <section className="rounded-xl bg-slate-100/70 p-3" key={key}>
                    <div className="flex items-baseline justify-between px-1 mb-3">
                      <h2 className="font-semibold text-slate-900">
                        {label}
                        <span className="ml-2 font-normal text-slate-500">
                          {day.format("D MMM")}
                        </span>
                      </h2>
                      <span className="text-xs font-medium text-slate-500">
                        {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                    {tasks.length ? (
                      <Taskslist tasksList={tasks} />
                    ) : (
                      <NothingToDo hint="Nothing planned for this day." />
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}
      <TaskCreation />
    </div>
  );
}
