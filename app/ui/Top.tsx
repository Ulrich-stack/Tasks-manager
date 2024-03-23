import { MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { TextfieldStyle } from "../lib/utils";
import dayjs, { Dayjs } from "dayjs";

type TopProps = {
    period: string,
    setPeriod: (period: string) => void;
}

export default function Top({ period, setPeriod}: TopProps) {
    const [today, setToday] = useState<Dayjs | undefined>(dayjs());

  return (
    <div className="flex items-center justify-between w-full border-b pb-6">
      <div>
        <h1 className="font-bold text-2xl">Good morning Ulrich! 👋</h1>
        <p className="text-gray-600 mt-3">
          Today, {today?.format("dddd D MMMM YYYY")}
        </p>
      </div>
      <TextField
        select
        name="Period"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        sx={TextfieldStyle}
        size="small"
      >
        <MenuItem
          value="Today"
          sx={{
            fontSize: "0.75rem",
          }}
        >
          Today
        </MenuItem>
        <MenuItem
          value="Next 3 days"
          sx={{
            fontSize: "0.75rem",
          }}
        >
          Next 3 days
        </MenuItem>
      </TextField>
    </div>
  );
}
