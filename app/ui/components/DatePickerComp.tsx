import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { TextField } from "@mui/material";
import { TextfieldStyle } from "../../lib/utils";

type DatePickerCompProps = {
  value: Dayjs | null;
  setDate: (value: Dayjs | null) => void;
  name: string;
};

export default function DatePickerComp({
  value,
  setDate,
  name
}: DatePickerCompProps) {
  return (
    <div className="flex flex-col gap-y-2 mt-2">
      <span className="font-semibold ml-1">Date</span>
      <DatePicker
        key={value?.toString() || 'date-picker'}
        name={name}
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
                sx={TextfieldStyle}
              />
              
            );
          },
        }}

      />
    </div>

  );
}
