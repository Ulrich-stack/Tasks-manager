import { QueryResultRow } from "@vercel/postgres";
import { Action } from "../definitions";

export const initialState = {
  isLoading: false,
  tasksList: [],
  next3Days: <QueryResultRow>[[], [], []],
};


export function taskReducer(state: any, action: Action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };
    case "LOAD_TASKS_SUCCESS":
      return { ...state, isLoading: false, tasksList: action.payload };
    case "LOAD_NEXT_3DAYS_SUCCESS":
      return { ...state, next3Days: action.payload };
    case "DELETE":
      return {
        ...state,
        tasksList: state.tasksList.filter(
          (task: any) => task.id !== action.payload
        ),
        next3Days: state.next3Days.map((dayTasks: any) =>
          dayTasks.filter((task: any) => task.id !== action.payload)
        ),
      };
    case "EDIT_TASK":
      return {
        ...state,
        tasksList: state.tasksList.map((task: any) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.data }
            : task
        ),
        next3Days: state.next3Days.map((dayTasks: any) =>
          dayTasks.map((task: any) =>
            task.id === action.payload.id
              ? { ...task, ...action.payload.data }
              : task
          )
        ),
      };
      case "DONE":
        return {
          ...state,
          tasksList: state.tasksList.filter((task: any) => task.id !== action.payload),
          next3Days: state.next3Days.map((dayTasks: any) => 
            dayTasks.filter((task: any) => task.id !== action.payload)
          ),
        };
  }
}
