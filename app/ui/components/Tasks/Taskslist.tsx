import {
  addDetailsToDb,
  deleteTaskFromDb,
  fetchCategories,
  fetchTodayTasks,
} from "../../../lib/script";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { stringToColor } from "../../../lib/utils";
import { useContext, useEffect, useState } from "react";
import EditTask from "./EditTask";
import { QueryResultRow } from "@vercel/postgres";
import dayjs from "dayjs";
import { useSnackbar } from "./SnackbarContext";
import { TasksStateContext } from "@/app/lib/hooks/TasksStateContext";
import CategoryBadge from "../CategoryBadge";

function Taskslist({
  tasksList,
}: {
  tasksList: QueryResultRow[];

}) {

  const context = useContext(TasksStateContext);
  const {showMessage} = useSnackbar();

  if(!context) 
  throw new Error("Could not find provider");

  const {dispatch} = context;

  async function deleteTask(idTask: number) {
    try {
      await deleteTaskFromDb(idTask);

    } catch (error) {
      console.error("An error occurred while deleting the task", error);
    }
    
  }

  return (
    <ul className="w-full flex flex-col gap-y-2 mt-3">
      {tasksList.map((task) => {
        const color = stringToColor(task.category);
        return (
          <li
            key={"task " + task.id}
            className="group relative w-full flex flex-col gap-y-2 bg-white pl-5 pr-2 py-3 rounded-xl border border-slate-200 transition-shadow hover:shadow-md"
          >
            <span
              className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <div className="w-full flex items-start justify-between gap-x-2">
              <p className="font-semibold text-slate-900 pt-1">{task.name}</p>
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  aria-label={`Delete ${task.name}`}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    deleteTask(task.id);
                    dispatch({ type: "DELETE", payload: task.id });
                    showMessage(
                      <span>
                        <strong>{task.name}</strong> successfully deleted.
                      </span>
                    );
                  }}
                >
                  <TrashIcon className="w-[18px]" aria-hidden="true" />
                </button>
                <EditTask task={task} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-x-1 text-slate-500 tabular-nums">
                <ClockIcon className="w-4" aria-hidden="true" />
                {dayjs(task.hourfrom, "HH:mm A").format("HH:mm") +
                  " – " +
                  dayjs(task.hourto, "HH:mm A").format("HH:mm")}
              </span>
              <CategoryBadge category={task.category} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default Taskslist;
