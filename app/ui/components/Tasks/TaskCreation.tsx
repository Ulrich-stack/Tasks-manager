"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { TimePicker } from "@mui/x-date-pickers";
import { useContext, useEffect, useState } from "react";
import TimePickerComp from "./TimePickerComp";
import DatePickerComp from "./DatePickerComp";
import PeriodPickerComp from "./TimePickerComp";
import dayjs, { Dayjs } from "dayjs";
import {
  fixedCategories,
  hasEmptyFields,
  hasIcon,
  iconIndex,
  stringToColor,
} from "../../../lib/utils";
import { categories } from "../../../lib/categories";
import { createTask } from "../../../lib/utils";
import { fetch3NextDays, fetchCategories, fetchTodayTasks } from "../../../lib/script";
import { useSnackbar } from "./SnackbarContext";
import { TasksStateContext } from "@/app/lib/hooks/TasksStateContext";

function TaskCreation({ reloadData }: { reloadData: any }) {
  const {showMessage} = useSnackbar();

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [categoryClicked, setCategoryClicked] = useState("");
  const [hourFrom, setHourFrom] = useState<Dayjs | null>(null);
  const [hourTo, setHourTo] = useState<Dayjs | null>(null);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [showWarningText, setShowWarningText] = useState(false);
  const [allCategories, setAllCategories] = useState([
    {
      name: "",
      numbers: "",
    },
  ]);

  const [newTask, setNewTask] = useState({
    name: "",
    category: "",
    date: "",
    status: "Pending",
    hourfrom: "",
    hourto: "",
  });

  const context = useContext(TasksStateContext);

  if(!context) 
  throw new Error("Could not find provider");

  const {dispatch} = context;

  function loadData(){
    dispatch({type: 'LOADING'});

    fetchTodayTasks()
    .then(tasks =>{
      dispatch({type: 'LOAD_TASKS_SUCCESS', payload: tasks})
    })
    .catch(error =>{
      console.log(error);
    })

    fetch3NextDays()
    .then(tasks =>{
      dispatch({type: 'LOAD_NEXT_3DAYS_SUCCESS', payload: tasks})
    })
  }

  useEffect(() => {
    async function loadCategories() {
      try {
        const newCategories = await fetchCategories();
        console.log(newCategories);

        setAllCategories(newCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    loadCategories();
  }, [isOverlayVisible]);

  const toggleOverlay = () => {
    const isVisible = isOverlayVisible;
    console.log(isVisible);
    console.log(allCategories);

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
      hourfrom: dayjs(hourFrom, 'hh:mm A').format("hh:mm A") || "",
      hourto: dayjs(hourTo, 'hh:mm A').format("hh:mm A") || "",
    };
    setNewTask(temp);

    console.log(temp);

    if (!hasEmptyFields(temp)) {
      createTask(temp);
      loadData(); // Fetch the database for change once we add a task and change the taskList Array of the parent component
      showMessage(<span><strong>{temp.name}</strong>  has been added!</span>);
      temp = {
        name: "",
        category: "",
        date: dayjs().format("YYYY-MM-DD"),
        status: "Pending",
        hourfrom: "",
        hourto: "",
      };
      setIsOverlayVisible(false);
      setCategoryClicked("");
      setHourFrom(null);
      setHourTo(null);
      setDate(dayjs());
      setNewTask(temp);
    } else setShowWarningText(true);
  }

  return (
    <div className="relative w-full flex justify-center max-h-[600px]">
      <div className="w-1/4 max-h-[400px] bg-transparent fixed flex flex-col justify-end z-10 bottom-10">
        <div
          className={`max-h-full bg-white mb-3 rounded-lg drop-shadow-xl p-2 ${
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
            <div className="flex flex-col gap-y-1 mt-2 overflow-y-auto max-h-[500px]">
              {allCategories.map((category) => {
                return (
                  <div
                    key={category.name}
                    onClick={(e) => handleCategory(e, category.name)}
                    className={`flex justify-between hover:cursor-pointer p-2 rounded-md ${
                      category.name === categoryClicked && "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {hasIcon(category.name) ? (
                        <img
                          src={`/icons/${
                            categories[iconIndex(category.name)].icon
                          }`}
                          className="w-5 ml-2"
                        ></img>
                      ) : (
                        <div
                          className={`ml-3 w-4 h-4 border rounded-md`}
                          style={{ borderColor: stringToColor(category.name) }}
                        ></div>
                      )}
                      <span className="ml-1">{category.name}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full w-4 font-light text-gray-500 flex items-center justify-center">
                      {category.numbers}
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
                <DatePickerComp name="date" value={date} setDate={setDate} />
              <div className="flex gap-x-2 mt-2">
                <PeriodPickerComp
                  hourFrom={hourFrom}
                  setHourFrom={setHourFrom}
                  hourTo={hourTo}
                  setHourTo={setHourTo}
                  nameFrom=""
                  nameTo=""
                />
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

export default TaskCreation;
