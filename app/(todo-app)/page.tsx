"use client";

import Taskslist from "../ui/Taskslist";
import { fetch3NextDays, fetchTodayTasks } from "../lib/script";
import { useEffect, useState } from "react";
import { QueryResultRow } from "@vercel/postgres";
import TaskCreation from "../ui/TaskCreation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Grid, MenuItem, TextField } from "@mui/material";
import { TextfieldStyle } from "../lib/utils";
import NothingToDo from "../ui/components/NothingToDo";

export default function Home() {
  const [tasksList, setTasklist] = useState<QueryResultRow[]>([]);
  const [today, setToday] = useState<Dayjs | undefined>(dayjs());
  const [period, setPeriod] = useState("Today");
  const [next3days, setNext3days] = useState<QueryResultRow[][] | undefined>([
    [],
    [],
    [],
  ]);

  async function getTasks() {
    try {
      const data = await fetchTodayTasks();
      setTasklist(data);
      console.log("Fetch", data);
    } catch (error) {
      console.log("An error occured while fetching data from client");
    }
  }

  async function getNext3Days() {
    try {
      const data = await fetch3NextDays();
      setNext3days(data);
      console.log("Fetch", data);
    } catch (error) {
      console.log("An error occured while fetching data from client");
    }
  }
  async function reloadData() {
    await getTasks();
    await getNext3Days();
    console.log("Reloading");
  }

  useEffect(() => {
    getTasks();
    // fetch3NextDays();
    getNext3Days();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="px-20 py-10 w-full h-full">
        <div className="flex items-center justify-between w-full border-b pb-6">
          <div>
            <h1 className="font-bold text-2xl">Good morning Ulrich! 👋</h1>
            <p className="text-gray-600 mt-3">
              Today, {today?.format("dddd D MMMM YYYY")}
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
            tasksList.length?
            <div className="w-1/3 mt-10 max-h-screen overflow-hidden">
              
              <Taskslist tasksList={tasksList} reloadData={reloadData} />
            </div>:<NothingToDo/>
          ) : (
            <div className="flex h-full gap-x-2 mt-4">
              {next3days?.map((tab, index) => {
                console.log("Tab ", index, " content: ", tab);
                const dateIn2Days = dayjs().add(2, 'day');

                return (
                  <div
                    className="w-1/3 p-2 border-x h-full"
                    key={"Day " + index}
                  >
                    {index === 0 && <span className="font-bold">Today</span>}
                    {index === 1 && <span className="font-bold">Tomorrow</span>}
                    {index === 2 && (
                      <span className="font-bold">
                        {dateIn2Days?.format("dddd D MMMM YYYY")}
                      </span>
                    )}
                    {tab.length ? (
                      <Taskslist tasksList={tab} reloadData={reloadData} />
                    ) : <NothingToDo/>}
                  </div>
                );
              })}
            </div>
          )}
        </>
        <TaskCreation reloadData={reloadData} />
      </div>
    </LocalizationProvider>
  );
}
