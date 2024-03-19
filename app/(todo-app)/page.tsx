  'use client'

  import Taskslist from "../ui/Taskslist";
  import { fetchTasks } from "../lib/script";
  import {useEffect, useState } from "react";
  import ButtonTask from "../ui/ButtonTask";
  import { QueryResultRow } from "@vercel/postgres";
  import TaskCreation from "../ui/TaskCreation";

  export default function Home() {
    const [tasksList, setTasklist] = useState<QueryResultRow[]>([]);

    async function getTasks(){
      try{
        const data = await fetchTasks();
        setTasklist(data);
        console.log("Fetch", data);
        
      }catch(error){
        console.log("An error occured while fetching data from client");
        
      }
    }

    async function reloadData(){
      await getTasks();
      console.log("Reloading");

    }

    useEffect(()=>{
      getTasks();
    },[])

    return (
      <div className="px-20 py-10 w-full">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="font-bold text-2xl">Good morning Ulrich!</h1>
            <p className="text-gray-600 mt-3">Today, Sunday 10th Februray 2023</p>
          </div>
        <ButtonTask/>
        </div>
        <>
        <Taskslist tasksList={tasksList} reloadData={reloadData}/>
        </>
        <TaskCreation reloadData={reloadData}/>
      </div>
    );
  }
