import { fetchCategories } from "./script";

export function hasEmptyFields(task: object) {
    return Object.values(task).some(value => value === '' || value === 'Invalid Date');
  }

export const categories = [
    {
      name: "Home",
      icon: "home.png",
    },
    {
      name: "Personal",
      icon: "private.png",
    },
    {
      name: "Work",
      icon: "bureau.png",
    },
    {
      name: "Sport", 
      icon: "biceps.png",
    },
    {
      name: "Grocery",
      icon: "grocery.png",
    },
    {
        name: "Other",
        icon: "other.png",
      },
  ];

export const fixedCategories = ["Home", "Personal", "Work", "Sport", "Grocery"];

export const iconIndex = (category: string | any) => fixedCategories.indexOf(category);

export const hasIcon = (item: string | any) => fixedCategories.includes(item);

export function stringToColor(str: string) {
    // Générer une valeur de hachage à partir de la chaîne de caractères
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Convertir la valeur de hachage en une couleur hexadécimale
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
  
    return color;
  }
