import React from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from '@mui/material';



type PeriodPickerCompProps = {
  hourFrom: Date | null;
  setHourFrom: (value: Date | null) => void;
  hourTo: Date | null;
  setHourTo: (value: Date | null) => void;
};

const PeriodPickerComp: React.FC<PeriodPickerCompProps> = ({ hourFrom, setHourFrom, hourTo, setHourTo }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="From"
        value={hourFrom}
        maxTime={hourTo || undefined}
        onChange={(newValue) => setHourFrom(newValue as Date | null)}
        slotProps={{textField: {size: 'small'}}}
      />
      <TimePicker
        label="To"
        value={hourTo}
        minTime={hourFrom || undefined}
        onChange={(newValue) => setHourTo(newValue as Date | null)}
        slotProps={{textField: {size: 'small'}}}
      />
    </LocalizationProvider>
  );
};

export default PeriodPickerComp;
