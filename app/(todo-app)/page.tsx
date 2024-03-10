import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/outline";
import Taskslist from "../ui/Taskslist";

export default function Home() {
  return (
    <div className="px-20 py-10 w-f">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="font-bold text-2xl">Good morning Ulrich!</h1>
          <p className="text-gray-600 mt-3">Today, Sunday 10th Februray 2023</p>
        </div>
        <button className="flex items-center border bg-white p-2 rounded-lg">
          <PlusIcon className="w-4 mr-2"/>
          <p>Add a task</p>  
        </button>
      </div>
      <>
      <Taskslist/>
      </>
    </div>
  );
}
