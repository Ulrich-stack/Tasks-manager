import React from "react";
import { TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { TextfieldStyle } from "../../../lib/utils";

type PeriodPickerCompProps = {
  hourFrom: Dayjs | null;
  setHourFrom: (value: Dayjs | null) => void;
  hourTo: Dayjs | null;
  setHourTo: (value: Dayjs | null) => void;
};

const fieldProps = {
  textField: { size: "small" as const, placeholder: "--:--" },
  field: { clearable: true },
};

const PeriodPickerComp: React.FC<PeriodPickerCompProps> = ({
  hourFrom,
  setHourFrom,
  hourTo,
  setHourTo,
}) => {
  return (
    <fieldset>
      <legend className="font-medium text-slate-700 mb-1.5">
        Time <span className="font-normal text-slate-500">(optional)</span>
      </legend>
      <div className="flex gap-x-3">
        <div className="w-1/2">
          <TimePicker
            label="Start"
            ampm={false}
            value={hourFrom}
            maxTime={hourTo || undefined}
            onChange={(newValue) => setHourFrom(newValue as Dayjs | null)}
            slotProps={fieldProps}
            sx={TextfieldStyle}
          />
        </div>
        <div className="w-1/2">
          <TimePicker
            label="End"
            ampm={false}
            value={hourTo}
            minTime={hourFrom || undefined}
            onChange={(newValue) => setHourTo(newValue as Dayjs | null)}
            slotProps={fieldProps}
            sx={TextfieldStyle}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default PeriodPickerComp;
