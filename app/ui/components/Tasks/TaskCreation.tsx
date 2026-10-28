"use client";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TimePicker } from "@mui/x-date-pickers";
import { useContext, useEffect, useReducer, useState } from "react";
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
import {
  fetch3NextDays,
  fetchCategories,
  fetchTodayTasks,
} from "../../../lib/script";
import { useSnackbar } from "./SnackbarContext";
import { TasksStateContext } from "@/app/lib/hooks/TasksStateContext";
import SkeletonCategorie from "./SkeletonCategorie";
import {
  initialTaskCreationState,
  taskCreationReducer,
} from "@/app/lib/hooks/TaskCreationReducer";

function TaskCreation() {
  const { showMessage } = useSnackbar();
  const [state, dispatchCreation] = useReducer(
    taskCreationReducer,
    initialTaskCreationState
  );
  const context = useContext(TasksStateContext);

  if (!context) throw new Error("Could not find provider");
  const { dispatch } = context;

  function loadData() {
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
  }

  async function loadCategories() {
    dispatchCreation({ type: "SET_LOADING", payload: true });
    try {
      const newCategories = await fetchCategories();
      console.log(newCategories);
      dispatchCreation({
        type: "SET_ALL_CATEGORIES",
        payload: newCategories,
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    dispatchCreation({ type: "SET_LOADING", payload: false });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleOverlay = () => {
    dispatchCreation({ type: "TOGGLE_OVERLAY" });
  };

  function handleCategory(e: any, category: string) {
    dispatchCreation({ type: "SET_CATEGORY", payload: category });
  }

  function handleAddTask() {
    let temp = state.newTask;
    const categoryExists = state.allCategories.some(
      (category: any) => category.name === temp.category
    ); //Verify if we create a new category

    console.log(temp);

    if (!hasEmptyFields(temp)) {
      createTask(temp);
      loadData(); // Fetch the database for change once we add a task and change the taskList Array of the parent component
      showMessage(
        <span>
          <strong>{temp.name}</strong> has been added!
        </span>
      );

      if (!categoryExists) loadCategories();

      dispatchCreation({ type: "RESET_NEW_TASK_FIELDS" });
      dispatchCreation({ type: "SET_WARNING_TEXT", payload: false });
      dispatchCreation({ type: "TOGGLE_OVERLAY" });
    } else dispatchCreation({ type: "SET_WARNING_TEXT", payload: true });
  }

  return (
    <div className="fixed z-20 bottom-6 left-4 right-4 md:left-[calc(15rem+2.5rem)] md:right-10 flex justify-center pointer-events-none">
      <div className="w-full max-w-sm flex flex-col items-stretch pointer-events-auto">
        <div
          id="task-creation-panel"
          className={`mb-3 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 ${
            !state.isOverlayVisible && "hidden"
          }`}
        >
          <h2 className="font-semibold text-slate-900">New task</h2>
          <div className="flex flex-col gap-y-3 mt-3 overflow-y-auto max-h-[60vh] pr-1">
            <div className="flex flex-col gap-y-1.5">
              <label htmlFor="new-task-name" className="font-medium text-slate-700">
                Name
              </label>
              <input
                id="new-task-name"
                type="text"
                className="px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors"
                placeholder="e.g. Call the plumber"
                value={state.newTask.name}
                onChange={(e) =>
                  dispatchCreation({
                    type: "SET_TASK_NAME",
                    payload: e.target.value,
                  })
                }
              ></input>
            </div>
            <fieldset className="flex flex-col gap-y-1.5">
              <legend className="font-medium text-slate-700 mb-1.5">Category</legend>
              {state.isLoading ? (
                <SkeletonCategorie />
              ) : (
                <div className="flex flex-col gap-y-0.5">
                  {state.allCategories
                    .filter((category: any) => category.name)
                    .map((category: any) => {
                    const selected = category.name === state.categoryClicked;
                    return (
                      <button
                        type="button"
                        key={category.name}
                        aria-pressed={selected}
                        onClick={(e) => handleCategory(e, category.name)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                          selected
                            ? "bg-primary-soft text-primary font-semibold ring-1 ring-primary/30"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-x-2">
                          {hasIcon(category.name) ? (
                            <img
                              src={`/icons/${
                                categories[iconIndex(category.name)].icon
                              }`}
                              alt=""
                              className="w-5"
                            ></img>
                          ) : (
                            <span
                              className="w-5 h-5 flex items-center justify-center"
                              aria-hidden="true"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor: stringToColor(category.name),
                                }}
                              />
                            </span>
                          )}
                          {category.name}
                        </span>
                        <span className="min-w-[1.5rem] px-1.5 rounded-full bg-slate-100 text-xs text-slate-500 tabular-nums">
                          {category.numbers}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              <input
                type="text"
                aria-label="Create a new category"
                className="px-3 py-2 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 focus:border-primary focus:border-solid focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors"
                placeholder="+ New category"
                onChange={(e) => handleCategory(e, e.target.value)}
              ></input>
            </fieldset>
            <DatePickerComp
              name="date"
              value={state.date}
              setDate={(newDate) =>
                dispatchCreation({ type: "SET_DATE", payload: newDate })
              }
            />
            <PeriodPickerComp
              hourFrom={state.hourFrom}
              setHourFrom={(newHourFrom) =>
                dispatchCreation({
                  type: "SET_HOUR_FROM",
                  payload: dayjs(newHourFrom, "HH:mm"),
                })
              }
              hourTo={state.hourTo}
              setHourTo={(newHourTo) =>
                dispatchCreation({
                  type: "SET_HOUR_TO",
                  payload: dayjs(newHourTo, "HH:mm"),
                })
              }
              nameFrom=""
              nameTo=""
            />
          </div>
          {state.showWarningText && (
            <p role="alert" className="mt-3 text-red-600">
              Please fill in every field.
            </p>
          )}
          <button
            type="button"
            className="w-full mt-3 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
            onClick={handleAddTask}
          >
            Add task
          </button>
        </div>

        <button
          type="button"
          onClick={toggleOverlay}
          aria-expanded={state.isOverlayVisible}
          aria-controls="task-creation-panel"
          className={`self-center flex items-center justify-center gap-x-2 px-5 py-3 rounded-full font-semibold shadow-lg transition-colors ${
            state.isOverlayVisible
              ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          {state.isOverlayVisible ? (
            <>
              <XMarkIcon className="w-5" aria-hidden="true" />
              Close
            </>
          ) : (
            <>
              <PlusIcon className="w-5" aria-hidden="true" />
              Create a task
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TaskCreation;
