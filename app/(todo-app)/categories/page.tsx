"use client";

import { CategorizedTasks } from "@/app/lib/definitions";
import { fetchAllPendingTask, fetchCategories } from "@/app/lib/script";
import { stringToColor } from "@/app/lib/utils";
import TaskCard from "@/app/ui/components/Categories/TaskCard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { log } from "console";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

function page() {
  const [today, setToday] = useState<Dayjs | undefined>(dayjs());
  const [categorizedTasks, setCategorizedTasks] = useState<CategorizedTasks[]>([]);


  useEffect(() => {
    async function loadTasks() {
      try {
        const results:CategorizedTasks[] = await fetchAllPendingTask();
        setCategorizedTasks(results);
        console.log(results);
        
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    loadTasks();
  }, []);



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

    <div className="px-20 py-10">
      <div className="w-full border-b pb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-gray-600 mt-3">
          Today, {today?.format("dddd D MMMM YYYY")}
        </p>
      </div>
      <div className="flex flex-col w-full gap-y-4 mt-5">
        {
            categorizedTasks.map((tasksByCategory, index) =>{
                const color = stringToColor(tasksByCategory.category);
                return(
                    <div className="flex flex-col" key={index}>
                        <h2 className="font-bold" style={{color: color}}>{tasksByCategory.category}</h2>
                        <div className="flex gap-x-2 pt-2">
                            {
                                tasksByCategory.tasks.map((task, taskIndex)=>{
                                    return(
                                        <TaskCard key={task + taskIndex} tasks={task} color = {color}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            })
        }
      </div>
    </div>
    </LocalizationProvider>
  );
}

export default page;
