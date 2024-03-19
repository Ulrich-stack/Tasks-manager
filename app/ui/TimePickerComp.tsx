import React from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, styled } from '@mui/material';
import { Dayjs } from 'dayjs';



type PeriodPickerCompProps = {
  hourFrom: Dayjs | null;
  setHourFrom: (value: Dayjs | null) => void;
  hourTo: Dayjs | null;
  setHourTo: (value: Dayjs | null) => void;
};

const TimePickerStyle={
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
}

const PeriodPickerComp: React.FC<PeriodPickerCompProps> = ({ hourFrom, setHourFrom, hourTo, setHourTo }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="From"
        value={hourFrom}
        maxTime={hourTo || undefined}
        onChange={(newValue) => setHourFrom(newValue as Dayjs | null)}
        slotProps={{textField: {size: 'small', placeholder:""}}}
        sx={TimePickerStyle}
      />
      <TimePicker
        label="To"
        value={hourTo}
        minTime={hourFrom || undefined}
        onChange={(newValue) => setHourTo(newValue as Dayjs | null)}
        slotProps={{textField: {size: 'small', placeholder:""}}}
        sx={TimePickerStyle}
      />
    </LocalizationProvider>
  );
};

export default PeriodPickerComp;
