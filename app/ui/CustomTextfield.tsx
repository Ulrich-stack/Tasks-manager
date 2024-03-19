import { TextField, TextFieldProps } from "@mui/material";
import { Dayjs } from "dayjs";

export const CustomTextfield = ({ value, params, placeholder }: {value: Dayjs | null, params: TextFieldProps, placeholder: string}) => (
    <TextField
        key={value?.toString() || 'time-picker'}
      {...params}
      placeholder={placeholder}
      value={value?.format('HH:mm') || ""}
      size="small"
      sx={{
        width: "100%",
        padding: "1px",
        borderWidth: "1px",
        "& .MuiInputBase-root": {
          border: "1px solid #c4c4c4",
          borderRadius: "4px", 
          fontSize: "1rem", 
          lineHeight: "1rem",
          "&:hover": {
            borderColor: "black", // Bordure noire au survol
          },
          "&.Mui-focused": {
            borderColor: "black", // Bordure noire lors de la mise au point
          },
        },
      }}
    />
  );