import { TasksContextType } from "../definitions";
import { createContext } from "react";


export const TasksStateContext = createContext<TasksContextType | undefined>(
  undefined
);
