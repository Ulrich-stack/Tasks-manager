import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import {
  addDetailsToDb,
  deleteTaskFromDb,
  fetchCategories,
  fetchTodayTasks,
} from "../../../lib/script";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { hasIcon, iconIndex, stringToColor } from "../../../lib/utils";
import { categories } from "../../../lib/categories";
import { useContext, useEffect, useState } from "react";
import EditTask from "./EditTask";
import { QueryResultRow } from "@vercel/postgres";
import { Textarea } from "@mui/joy";
import dayjs from "dayjs";
import { useSnackbar } from "./SnackbarContext";
import { TasksStateContext } from "@/app/lib/hooks/TasksStateContext";
import Image from "next/image";

function Taskslist({
  tasksList,
  reloadData,
}: {
  tasksList: QueryResultRow[];
  reloadData: () => void;
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
    <div className="w-full flex flex-col gap-y-2 mt-2">
      {tasksList.map((task) => {
        const color = stringToColor(task.category);
        return (
          <div
            key={"task " + task.id}
            className="w-full flex flex-col gap-y-2 bg-white p-2 rounded-md border border-t-4 shadow-md"
            style={{
              borderTopColor: color
            }}
          >
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold">{task.name}</p>
              <div className="flex items-center gap-x-1">
                <TrashIcon
                  width={"15px"}
                  className="text-red-500 hover:cursor-pointer"
                  onClick={(e) => {
                    deleteTask(task.id);
                  dispatch({type: 'DELETE', payload: task.id});
                  showMessage(<span><strong>{task.name}</strong> successfully deleted.</span>);
                }}
                />
                {/* <EllipsisHorizontalIcon width={"15px"} className="hover:cursor-pointer"/> */}
                <EditTask task={task} reloadData={reloadData} />
              </div>
            </div>
            <div className="flex items-center rounded text-gray-400 w-fit">
              <ClockIcon className="w-4 text-gray-500 mr-1" />
              <span className="text-xs">
                {dayjs(task.hourfrom, "HH:mm A").format("HH:mm") +
                  " - " +
                  dayjs(task.hourto, "HH:mm A").format("HH:mm")}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className="px-1 rounded-md"
                style={{
                  color: color,
                }}
              >
                {task.category}
              </div>
              {hasIcon(task.category) && (
                <Image
                  src={`/icons/${categories[iconIndex(task.category)].icon}`}
                  alt={`${task.category}-icon`}
                  className="ml-2"
                  width={16}
                  height={16}
                ></Image>
              ) }
            </div>
          </div>
        );
      })
      
      }
    </div>
  );
}

export default Taskslist;
