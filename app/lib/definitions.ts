import { QueryResultRow } from "@vercel/postgres";

export type Action =
  | { type: "LOADING" }
  | { type: "LOAD_TASKS_SUCCESS"; payload: any[] }
  | { type: "LOAD_NEXT_3DAYS_SUCCESS"; payload: QueryResultRow[][] | undefined }
  | { type: "EDIT_TASK"; payload: any }
  | { type: "DELETE"; payload: number }
  | { type: "DONE"; payload: number};

export type Task = {
    name: string,
    category: string;
    date: string,
    status: string,
    hourfrom:string,
    hourto: string,
}

export interface TaskType {
    id: number;
    name: string;
    category: string;
    date: Date; // Assurez-vous que ce type correspond au type de données de votre colonne date.
    status: string;
    hourfrom: string;
    hourto: string;
    details: string;
  }
  
  export interface CategorizedTasks {
    category: string;
    tasks: any[];
  }
  
  export interface TasksContextType {
    state: any;
    dispatch: React.Dispatch<Action>;
  }