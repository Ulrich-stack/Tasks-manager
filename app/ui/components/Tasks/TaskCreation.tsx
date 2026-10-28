"use client";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import TimePickerComp from "./TimePickerComp";
import DatePickerComp from "./DatePickerComp";
import { hasIcon, iconIndex, stringToColor } from "../../../lib/utils";
import { categories as categoryIcons } from "../../../lib/categories";
import dayjs, { DATE_FORMAT } from "@/app/lib/dates";
import { useTasks } from "@/app/lib/hooks/TasksProvider";
import SkeletonCategorie from "./SkeletonCategorie";

function TaskCreation({ defaultDate }: { defaultDate?: string }) {
  const { categories, pending, isLoading, create } = useTasks();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs(defaultDate));
  const [hourFrom, setHourFrom] = useState<Dayjs | null>(null);
  const [hourTo, setHourTo] = useState<Dayjs | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDate(dayjs(defaultDate));
  }, [defaultDate]);

  const counts = (name: string) => pending.filter((t) => t.category === name).length;

  function reset() {
    setName("");
    setCategory("");
    setHourFrom(null);
    setHourTo(null);
    setShowWarning(false);
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !date?.isValid()) {
      setShowWarning(true);
      return;
    }
    setIsSaving(true);
    const ok = await create({
      name: name.trim(),
      category: category.trim(),
      date: date.format(DATE_FORMAT),
      hourfrom: hourFrom?.isValid() ? hourFrom.format("HH:mm") : "",
      hourto: hourTo?.isValid() ? hourTo.format("HH:mm") : "",
      details: "",
    });
    setIsSaving(false);
    if (ok) {
      reset();
      setOpen(false);
    }
  }

  return (
    <div className="fixed z-20 bottom-6 left-4 right-4 md:left-[calc(15rem+2.5rem)] md:right-10 flex justify-center pointer-events-none">
      <div className="w-full max-w-sm flex flex-col items-stretch pointer-events-auto">
        {open && (
          <form
            id="task-creation-panel"
            onSubmit={handleAddTask}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            className="mb-3 bg-white rounded-2xl border border-slate-200 shadow-xl p-4"
          >
            <h2 className="font-semibold text-slate-900">New task</h2>
            <div className="flex flex-col gap-y-3 mt-3 overflow-y-auto max-h-[60vh] pr-1">
              <div className="flex flex-col gap-y-1.5">
                <label htmlFor="new-task-name" className="font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="new-task-name"
                  type="text"
                  autoFocus
                  className="px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors"
                  placeholder="e.g. Call the plumber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <fieldset className="flex flex-col gap-y-1.5">
                <legend className="font-medium text-slate-700 mb-1.5">Category</legend>
                {isLoading ? (
                  <SkeletonCategorie />
                ) : (
                  <div className="flex flex-col gap-y-0.5">
                    {categories.map((item) => {
                      const selected = item === category;
                      return (
                        <button
                          type="button"
                          key={item}
                          aria-pressed={selected}
                          onClick={() => setCategory(item)}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                            selected
                              ? "bg-primary-soft text-primary font-semibold ring-1 ring-primary/30"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-x-2">
                            {hasIcon(item) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={`/icons/${categoryIcons[iconIndex(item)].icon}`}
                                alt=""
                                className="w-5"
                              />
                            ) : (
                              <span className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: stringToColor(item) }}
                                />
                              </span>
                            )}
                            {item}
                          </span>
                          <span className="min-w-[1.5rem] px-1.5 rounded-full bg-slate-100 text-xs text-slate-500 tabular-nums">
                            {counts(item)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <input
                  type="text"
                  aria-label="Create a new category"
                  className="px-3 py-2 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 focus:border-primary focus:border-solid focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors"
                  placeholder="+ New category"
                  value={categories.includes(category) ? "" : category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </fieldset>
              <DatePickerComp value={date} setDate={setDate} />
              <TimePickerComp
                hourFrom={hourFrom}
                setHourFrom={setHourFrom}
                hourTo={hourTo}
                setHourTo={setHourTo}
              />
            </div>
            {showWarning && (
              <p role="alert" className="mt-3 text-red-600">
                Give the task a name, a category and a date.
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full mt-3 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold transition-colors"
            >
              {isSaving ? "Adding…" : "Add task"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="task-creation-panel"
          className={`self-center flex items-center justify-center gap-x-2 px-5 py-3 rounded-full font-semibold shadow-lg transition-colors ${
            open
              ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          {open ? (
            <>
              <XMarkIcon className="w-5" aria-hidden="true" />
              Close
            </>
          ) : (
            <>
              <PlusIcon className="w-5" aria-hidden="true" />
              Create a task
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TaskCreation;
