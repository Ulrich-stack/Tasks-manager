export function hasEmptyFields(task: object) {
    return Object.values(task).some(value => value === '');
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