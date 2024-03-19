import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { TextField } from "@mui/material";

type DatePickerCompProps = {
  value: Dayjs | null;
  setDate: (value: Dayjs | null) => void;
};

export default function DatePickerComp({
  value,
  setDate,
}: DatePickerCompProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        key={value?.toString() || 'date-picker'}
        format="DD-MM-YYYY"
        value={value}
        minDate={dayjs()}
        onChange={(newValue) => setDate(newValue as Dayjs | null)}
        slots={{
          textField: (params) => {
            const formattedValue = value?.format("DD MMM YYYY");
            return (
              <TextField
                {...params}
                placeholder=""
                value={formattedValue || ""}
                size="small"
                sx={{
                  width:"100%",
                  padding:"1px",
                  borderWidth:"1px",
                  "& .MuiInputBase-root": { // cible la racine du Input
                    border: "1px thin #000",
                    borderRadius: "4px", 
                    fontSize: "1rem", 
                    lineHeight:"1rem",
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
                }}
              />
            );
          },
        }}

      />
    </LocalizationProvider>
  );
}
