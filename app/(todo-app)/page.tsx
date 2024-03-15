import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/outline";
import Taskslist from "../ui/Taskslist";
import { createTask } from "../lib/script";
import { MouseEvent } from "react";
import ButtonTask from "../ui/ButtonTask";
import FloatingButton from "../ui/FloatingButton";

export default async function Home() {

  
  return (
    <div className="px-20 py-10 w-f overflow-scroll">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="font-bold text-2xl">Good morning Ulrich!</h1>
          <p className="text-gray-600 mt-3">Today, Sunday 10th Februray 2023</p>
        </div>
      <ButtonTask/>
      </div>
      <>
      <Taskslist/>
      </>
      <FloatingButton/>
    </div>
  );
}
