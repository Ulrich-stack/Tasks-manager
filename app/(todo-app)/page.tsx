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
import { MenuItem, TextField } from "@mui/material";
import { TextfieldStyle } from "../lib/utils";
import NothingToDo from "../ui/components/Tasks/NothingToDo";
import { initialState, taskReducer } from "../lib/hooks/tasksReducer";
import { TasksStateContext } from "../lib/hooks/TasksStateContext";
import { SnackbarProvider } from "../ui/components/Tasks/SnackbarContext";



export default function Home() {
  const [period, setPeriod] = useState("Today");
  const [state, dispatch] = useReducer(taskReducer, initialState);

  async function reloadData() {
    console.log("Reloading");
  }

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
          <div className="px-20 py-10 w-full h-full">
            <div className="flex items-center justify-between w-full border-b pb-6">
              <div>
                <h1 className="font-bold text-2xl">Good morning Ulrich! 👋</h1>
                <p className="text-gray-600 mt-3">
                  Today, {dayjs()?.format("dddd D MMMM YYYY")}
                </p>
              </div>
              <TextField
                select
                name="Period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                sx={TextfieldStyle}
                size="small"
              >
                <MenuItem
                  value="Today"
                  sx={{
                    fontSize: "0.75rem",
                  }}
                >
                  Today
                </MenuItem>
                <MenuItem
                  value="Next 3 days"
                  sx={{
                    fontSize: "0.75rem",
                  }}
                >
                  Next 3 days
                </MenuItem>
              </TextField>
            </div>
            <>
              {period === "Today" ? (
                state.tasksList.length ? (
                  <div className="w-1/3 mt-10 max-h-screen overflow-hidden">
                    <Taskslist
                      tasksList={state.tasksList}
                      reloadData={reloadData}
                    />
                  </div>
                ) : (
                  <NothingToDo />
                )
              ) : (
                <div className="flex h-full gap-x-2 mt-4">
                  {state.next3Days?.map((tab: any, index: number) => {
                    console.log("Tab ", index, " content: ", tab);
                    const dateIn2Days = dayjs().add(2, "day");

                    return (
                      <div
                        className="w-1/3 p-2 border-x h-full"
                        key={"Day " + index}
                      >
                        {index === 0 && (
                          <span className="font-bold">Today</span>
                        )}
                        {index === 1 && (
                          <span className="font-bold">Tomorrow</span>
                        )}
                        {index === 2 && (
                          <span className="font-bold">
                            {dateIn2Days?.format("dddd D MMMM YYYY")}
                          </span>
                        )}
                        {tab.length ? (
                          <Taskslist tasksList={tab} reloadData={reloadData} />
                        ) : (
                          <NothingToDo />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
            <TaskCreation reloadData={reloadData} />
          </div>
        </LocalizationProvider>
      </SnackbarProvider>
    </TasksStateContext.Provider>
  );
}
