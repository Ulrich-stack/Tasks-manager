import { Task } from "./definitions";
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
