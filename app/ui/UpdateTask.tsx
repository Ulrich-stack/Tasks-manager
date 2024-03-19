import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DatePickerComp from "./DatePickerComp";
import { TextField } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function UpdateTask({
  task,
  open,
  onClose,
}: {
  task: any;
  open: boolean;
  onClose: () => void;
}) {

  const [date, setDate] = useState<Dayjs | null>(dayjs(task.date));

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-center">
            <h1 className="font-bold">Edit task</h1>
          </div>
          <div className="text-xs">
            <form className="" action="">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="taskName" className="font-semibold">Task name</label>
                {/* <input className="border p-2 rounded-lg" name="taskName" id="taskName" value={task.name}></input> */}
                <TextField size="small"
                                
                  />
              </div>
              <div className="flex flex-col gap-y-2 mt-2">
                <label htmlFor="taskDate" className="font-semibold">Date</label>
                {/* <input className="border p-2 rounded-lg" name="taskDate" id="taskDate" value={task.name}></input> */}
                <DatePickerComp value={date} setDate={setDate }/>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
