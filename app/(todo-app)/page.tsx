"use client";

import Taskslist from "../ui/components/Tasks/Taskslist";
import { fetch3NextDays, fetchTodayTasks } from "../lib/script";
import {
  useEffect,
  useReducer,
  useState,
} from "react";
import TaskCreation from "../ui/components/Tasks/TaskCreation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import NothingToDo from "../ui/components/Tasks/NothingToDo";
import { initialState, taskReducer } from "../lib/hooks/tasksReducer";
import { TasksStateContext } from "../lib/hooks/TasksStateContext";
import { SnackbarProvider } from "../ui/components/Tasks/SnackbarContext";
import PageHeader from "../ui/components/PageHeader";

const periods = ["Today", "Next 3 days"];

function greeting() {
  const hour = dayjs().hour();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}



export default function Home() {
  const [period, setPeriod] = useState("Today");
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    dispatch({ type: "LOADING" });

    fetchTodayTasks()
      .then((tasks) => {
        dispatch({ type: "LOAD_TASKS_SUCCESS", payload: tasks });
      })
      .catch((error) => {
        console.log(error);
      });

    fetch3NextDays().then((tasks) => {
      dispatch({ type: "LOAD_NEXT_3DAYS_SUCCESS", payload: tasks });
    });
  }, []);

  return (
    <TasksStateContext.Provider value={{ state, dispatch }}>
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="px-4 py-6 md:px-10 md:py-10 pb-28 md:pb-28 w-full">
            <PageHeader
              title={`${greeting()}, Ulrich`}
              subtitle={`Today, ${dayjs().format("dddd D MMMM YYYY")}`}
            >
              <div
                role="group"
                aria-label="Period"
                className="inline-flex p-1 rounded-lg bg-slate-100"
              >
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
            {period === "Today" ? (
              state.tasksList.length ? (
                <div className="max-w-2xl mt-8">
                  <Taskslist tasksList={state.tasksList} />
                </div>
              ) : (
                <NothingToDo />
              )
            ) : (
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                {state.next3Days?.map((tab: any, index: number) => {
                  const day = dayjs().add(index, "day");
                  const label =
                    index === 0
                      ? "Today"
                      : index === 1
                      ? "Tomorrow"
                      : day.format("dddd");

                  return (
                    <section
                      className="rounded-xl bg-slate-100/70 p-3"
                      key={"Day " + index}
                    >
                      <div className="flex items-baseline justify-between px-1">
                        <h2 className="font-semibold text-slate-900">
                          {label}
                          <span className="ml-2 font-normal text-slate-500">
                            {day.format("D MMM")}
                          </span>
                        </h2>
                        <span className="text-xs font-medium text-slate-500">
                          {tab.length} {tab.length === 1 ? "task" : "tasks"}
                        </span>
                      </div>
                      {tab.length ? (
                        <Taskslist tasksList={tab} />
                      ) : (
                        <NothingToDo hint="Nothing planned for this day." />
                      )}
                    </section>
                  );
                })}
              </div>
            )}
            <TaskCreation />
          </div>
        </LocalizationProvider>
      </SnackbarProvider>
    </TasksStateContext.Provider>
  );
}
