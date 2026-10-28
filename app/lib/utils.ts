import dayjs from "dayjs";
import { CategorizedTasks, Task, TaskType } from "./definitions";
import { addToDb, fetchCategories } from "./script";

export function hasEmptyFields(task: object) {
  return Object.values(task).some(
    (value) => value === "" || value === "Invalid Date"
  );
}

export async function createTask(task: Task) {
  let newTask = {
      ...task,
  }
  addToDb(newTask);
}

export const TextfieldStyle = {
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    fontSize: "0.875rem",
    backgroundColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#CBD5E1",
    },
    "&:hover fieldset": {
      borderColor: "#94A3B8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0F766E",
      borderWidth: "2px",
    },
  },
};

export const fixedCategories = ["Home", "Personal", "Work", "Sport", "Grocery", "Other"];

export const iconIndex = (category: string | any) =>
  fixedCategories.indexOf(category);

export const hasIcon = (item: string | any) => fixedCategories.includes(item);

function stringToHue(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

// Fixed saturation/lightness so every category color stays readable,
// whatever hue the name hashes to.
export function stringToColor(str: string) {
  return `hsl(${stringToHue(str)} 60% 42%)`;
}

export function stringToTint(str: string) {
  return `hsl(${stringToHue(str)} 70% 96%)`;
}

export function insertAndSortTaskById(categorizedTasks: CategorizedTasks[], taskId: number, newCategory: string): CategorizedTasks[] { 
  let movedTask: TaskType | undefined;
  let sourceCategoryIndex: number | undefined;

  // Find the moved task and its original category
  categorizedTasks.forEach((category, index) => {
    const foundTaskIndex = category.tasks.findIndex((task: any) => task.id === taskId);
    if (foundTaskIndex !== -1) {
      movedTask = category.tasks[foundTaskIndex];
      sourceCategoryIndex = index;
      // Remove the task from its old category
      category.tasks.splice(foundTaskIndex, 1);
    }
  });

  // Check if the task was found
  if (!movedTask) {
    console.error("Task not found with ID:", taskId);
    return categorizedTasks;
  }

  // Find or initialize the new category
  let targetCategory = categorizedTasks.find(category => category.category === newCategory);
  if (!targetCategory) {
    targetCategory = { category: newCategory, tasks: [] };
    categorizedTasks.push(targetCategory);
  }

  // Add the task to the new category
  targetCategory.tasks.push(movedTask);

  // Sort the tasks in the new category by date and then by time
  targetCategory.tasks.sort((a: any, b: any) => {
    const dateComparison = dayjs(a.date).diff(dayjs(b.date));
    if (dateComparison !== 0) return dateComparison;
    return a.hourfrom.localeCompare(b.hourfrom);
  });

  return categorizedTasks;
}
