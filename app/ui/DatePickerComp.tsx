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
        label="Date"
        format="DD-MM-YYYY"
        value={value}
        minDate={dayjs()}
        onChange={(newValue) => setDate(newValue as Dayjs | null)}
        slotProps={{textField: {size: 'small'}}}
        sx={{
          width: "100%"
        }}
        
      />
    </LocalizationProvider>
  );
}
