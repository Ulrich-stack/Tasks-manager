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
