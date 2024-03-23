import React from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, styled } from '@mui/material';
import { Dayjs } from 'dayjs';
import { TextfieldStyle } from '../../../lib/utils';



type PeriodPickerCompProps = {
  hourFrom: Dayjs | null;
  setHourFrom: (value: Dayjs | null) => void;
  hourTo: Dayjs | null;
  setHourTo: (value: Dayjs | null) => void;
  nameFrom: string;
  nameTo: string
};


const PeriodPickerComp: React.FC<PeriodPickerCompProps> = ({ hourFrom, setHourFrom, hourTo, setHourTo, nameFrom, nameTo }) => {
  return (
    <div className="flex gap-x-2 mt-2">
    <div className='w-1/2 flex flex-col gap-y-2'>
      <span className='ml-1 font-semibold'>Start</span>
    <TimePicker
        name={nameFrom}
        label=""
        value={hourFrom}
        maxTime={hourTo || undefined}
        onChange={(newValue) => setHourFrom(newValue as Dayjs | null)}
        slotProps={{textField: {size: 'small', placeholder:" "}}}
        sx={TextfieldStyle}
      />
    </div>
    <div className='w-1/2 flex flex-col gap-y-2'>
    <span className='ml-1 font-semibold'>End</span>
    <TimePicker
        name={nameTo}
        label=""
        value={hourTo}
        minTime={hourFrom || undefined}
        onChange={(newValue) => setHourTo(newValue as Dayjs | null)}
        slotProps={{textField: {size: 'small', placeholder:" "}}}
        sx={TextfieldStyle}
      />
    </div>

    </div>
  );
};

export default PeriodPickerComp;
