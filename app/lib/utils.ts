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
  padding: "1px",
  borderWidth: "1px",
  "& .MuiInputBase-root": {
    // cible la racine du Input
    border: "1px thin #000",
    borderRadius: "4px",
    fontSize: "1rem",
    "&:hover": {
      borderColor: "black", // Bordure noire au survol
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#c4c4c4", // Modifie la couleur de la bordure par défaut
    },
    "&:hover fieldset": {
      borderColor: "black", // Bordure noire au survol
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // Bordure grise lors de la mise au point
    },
  },
};

export const fixedCategories = ["Home", "Personal", "Work", "Sport", "Grocery", "Other"];

export const iconIndex = (category: string | any) =>
  fixedCategories.indexOf(category);

export const hasIcon = (item: string | any) => fixedCategories.includes(item);

export function stringToColor(str: string) {
  // Générer une valeur de hachage à partir de la chaîne de caractères
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convertir la valeur de hachage en une couleur hexadécimale
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
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
