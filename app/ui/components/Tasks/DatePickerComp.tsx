import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { TextfieldStyle } from "../../../lib/utils";

type DatePickerCompProps = {
  value: Dayjs | null;
  setDate: (value: Dayjs | null) => void;
};

export default function DatePickerComp({ value, setDate }: DatePickerCompProps) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <span className="font-medium text-slate-700">Date</span>
      <DatePicker
        format="ddd D MMM YYYY"
        value={value}
        onChange={(newValue) => setDate(newValue as Dayjs | null)}
        slotProps={{ textField: { size: "small", "aria-label": "Date" } }}
        sx={TextfieldStyle}
      />
    </div>
  );
}
