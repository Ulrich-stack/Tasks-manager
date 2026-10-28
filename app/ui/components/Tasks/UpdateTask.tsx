import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { Autocomplete, TextField } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DatePickerComp from "./DatePickerComp";
import TimePickerComp from "./TimePickerComp";
import { TextfieldStyle } from "../../../lib/utils";
import dayjs, { DATE_FORMAT, parseTime } from "@/app/lib/dates";
import { TaskType } from "@/app/lib/definitions";
import { useTasks } from "@/app/lib/hooks/TasksProvider";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 440px)",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 24px 48px rgba(15, 23, 42, 0.18)",
  p: 3,
  outline: "none",
};

export default function UpdateTask({
  task,
  open,
  onClose,
}: {
  task: TaskType;
  open: boolean;
  onClose: () => void;
}) {
  const { categories, update } = useTasks();
  const [name, setName] = useState(task.name);
  const [category, setCategory] = useState(task.category);
  const [date, setDate] = useState<Dayjs | null>(dayjs(task.date));
  const [hourFrom, setHourFrom] = useState<Dayjs | null>(parseTime(task.hourfrom));
  const [hourTo, setHourTo] = useState<Dayjs | null>(parseTime(task.hourto));
  const [details, setDetails] = useState(task.details);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !date?.isValid()) {
      setError("Name, category and date are required.");
      return;
    }
    onClose();
    update(task, {
      name: name.trim(),
      category: category.trim(),
      date: date.format(DATE_FORMAT),
      hourfrom: hourFrom?.isValid() ? hourFrom.format("HH:mm") : "",
      hourto: hourTo?.isValid() ? hourTo.format("HH:mm") : "",
      details,
    });
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby={`edit-title-${task.id}`}>
      <Box sx={style}>
        <div className="flex items-center justify-between">
          <h2 id={`edit-title-${task.id}`} className="text-lg font-bold text-slate-900">
            Edit task
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5" aria-hidden="true" />
          </button>
        </div>
        <form className="flex flex-col gap-y-4 mt-4 text-sm" onSubmit={submit}>
          <div className="flex flex-col gap-y-1.5">
            <label htmlFor={`name-${task.id}`} className="font-medium text-slate-700">
              Task name
            </label>
            <TextField
              id={`name-${task.id}`}
              size="small"
              sx={TextfieldStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <label htmlFor={`category-${task.id}`} className="font-medium text-slate-700">
              Category
            </label>
            <Autocomplete
              id={`category-${task.id}`}
              freeSolo
              options={categories}
              inputValue={category}
              onInputChange={(_, value) => setCategory(value)}
              size="small"
              renderInput={(params) => (
                <TextField {...params} sx={TextfieldStyle} placeholder="Pick or type a new one" />
              )}
            />
          </div>
          <DatePickerComp value={date} setDate={setDate} />
          <TimePickerComp
            hourTo={hourTo}
            hourFrom={hourFrom}
            setHourFrom={setHourFrom}
            setHourTo={setHourTo}
          />
          <div className="flex flex-col gap-y-1.5">
            <label htmlFor={`details-${task.id}`} className="font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id={`details-${task.id}`}
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors resize-y"
            />
          </div>
          {error && (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          )}
          <div className="flex gap-x-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
            >
              Save changes
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
