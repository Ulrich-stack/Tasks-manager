export type TaskStatus = "Pending" | "Done";

export interface TaskType {
  id: number;
  name: string;
  category: string;
  date: string; // YYYY-MM-DD
  status: TaskStatus;
  hourfrom: string;
  hourto: string;
  details: string;
}

export type NewTask = Omit<TaskType, "id" | "status">;

export type TaskUpdate = Partial<Omit<TaskType, "id">>;

export interface CategorizedTasks {
  category: string;
  tasks: TaskType[];
}
