"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import TimePickerComp from "./TimePickerComp";
import DatePickerComp from "./DatePickerComp";
import PeriodPickerComp from "./TimePickerComp";
import dayjs, { Dayjs } from "dayjs";
import { categories, hasEmptyFields } from "../lib/utils";
import { createTask } from "../lib/action";

function FloatingButton() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [categoryClicked, setCategoryClicked] = useState("");
  const [hourFrom, setHourFrom] = useState<Date | null>(null);
  const [hourTo, setHourTo] = useState<Date | null>(null);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [showWarningText, setShowWarningText] = useState(false);

  const [newTask, setNewTask] = useState({
    name: "",
    category: "",
    date: "",
    status: "Pending",
    hourfrom: "",
    hourto: "",
  });
  

  const toggleOverlay = () => {
    const isVisible = isOverlayVisible;
    console.log(isVisible);

    setIsOverlayVisible(!isVisible);
  };

  function handleCategory(e: any, category: string) {
    console.log(category);
    setCategoryClicked(category);
    setNewTask({ ...newTask, category: category });
  }

  function handleAddTask() {
    let temp = newTask;
    temp = {
      ...temp,
      date: dayjs(date).format("YYYY-MM-DD") || dayjs().toString(),
      hourfrom: dayjs(hourFrom).format("HH-mm") || "",
      hourto: dayjs(hourTo).format("HH-mm") || "",
    };
    setNewTask(temp);

    console.log(temp);

    if (!hasEmptyFields(temp)) {
      createTask(temp);

      temp = {
        name: "",
        category: "",
        date: "",
        status: "Pending",
        hourfrom: "",
        hourto: "",
      };
      setIsOverlayVisible(false);
      setCategoryClicked("");
      setHourFrom(null);
      setHourTo(null);
      setDate(null);
      setNewTask(temp);
    } else setShowWarningText(true);
  }

  return (
    <div className="relative w-full flex justify-center">
      <div className="w-1/5  bg-transparent fixed flex flex-col justify-end z-10 bottom-10">
        <div
          className={`h-full bg-white mb-3 rounded-lg drop-shadow-xl p-2 ${
            !isOverlayVisible && "hidden"
          }`}
        >
          <div className="w-full">
            <div
              className={`w-full flex justify-end mb-2 text-red-500 ${
                !showWarningText && "hidden"
              }`}
            >
              A field is missing
            </div>
            <input
              type="text"
              className="p-2 bg-gray-100 w-full active:border-none rounded-md"
              placeholder="New task"
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            ></input>
            <div className="flex flex-col gap-y-1 mt-2">
              {categories.map((category, index) => {
                return (
                  <div
                    key={category.name}
                    onClick={(e) => handleCategory(e, category.name)}
                    className={`flex justify-between hover:cursor-pointer p-2 rounded-md ${
                      category.name === categoryClicked && "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <img
                        src={`/icons/${category.icon}`}
                        className="w-5"
                        alt="home"
                      />
                      <span>{category.name}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full w-4 font-light text-gray-500 flex items-center justify-center">
                      2
                    </div>
                  </div>
                );
              })}
              <input
                type="text"
                className="p-2 bg-gray-100 w-full active:border-none rounded-md"
                placeholder="Create a new category"
                onChange={(e) => handleCategory(e, e.target.value)}
              ></input>
              <div className="flex gap-x-2 mt-2">
                <PeriodPickerComp
                  hourFrom={hourFrom}
                  setHourFrom={setHourFrom}
                  hourTo={hourTo}
                  setHourTo={setHourTo}
                />
              </div>
              <div className="mt-2 w-full">
                <DatePickerComp value={date} setDate={setDate} />
              </div>
              <button
                className="w-full bg-black text-white p-2 mt-2 rounded-lg"
                onClick={handleAddTask}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={toggleOverlay}
          className="flex items-center justify-center w-full bg-black text-white text-sm p-2 rounded-xl"
        >
          Create a task
        </button>
      </div>
      {/*
       */}
    </div>
  );
}

export default FloatingButton;
