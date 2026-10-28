import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DatePickerComp from "./DatePickerComp";
import { MenuItem, Select, TextField } from "@mui/material";
import { TextfieldStyle } from "../../../lib/utils";
import TimePickerComp from "./TimePickerComp";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { fetchCategories, updateTask } from "../../../lib/script";
import { useSnackbar } from "./SnackbarContext";
import { TasksStateContext } from "@/app/lib/hooks/TasksStateContext";

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
  task: any;
  open: boolean;
  onClose: () => void;
}) {
  const {showMessage} =useSnackbar();

  const [date, setDate] = useState<Dayjs | null>(dayjs(task.date));
  const [hourFrom, setHourFrom] = useState<Dayjs | null>(dayjs(task.hourfrom, "HH:mm"));
  const [hourTo, setHourTo] = useState<Dayjs | null>(dayjs(task.hourto, "HH:mm"));
  const [details, setDetails] = useState<string>(task.details);
  const [category, setCategory] = useState<string>(task.category);
  const [allCategories, setAllCategories] = useState([
    {
      name: "",
      numbers: "",
    },
  ]);

  const context = useContext(TasksStateContext);

  if(!context) 
  throw new Error("Could not find provider");

  const {dispatch} = context;

  React.useEffect(() => {
    async function loadCategories() {
      try {
        const newCategories = await fetchCategories();

        setAllCategories(newCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    loadCategories();
  }, []);

  async function update(e: React.FormEvent) {
    onClose();

    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formObject = Object.fromEntries(formData.entries());
    console.log(formObject);
    
    const updatePayload = {
      id: task.id, 
      data: {
        name: formObject.taskName,
        category: formObject.category,
        date: formObject.date, 
        hourfrom: hourFrom,
        hourto: hourTo,
        details: formObject.details,
      },
    };

    dispatch({
      type: 'EDIT_TASK',
      payload: updatePayload
    });    
    showMessage(<span><strong>{task.name}</strong> successfully updated!</span>)
    
    try{
      await updateTask(task.id, formObject);
    }catch(error){
      console.log("Update failed", error);
      throw new Error("We could not update this task");
    }  

  }

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
              >
        <Box sx={style}>
          <div className="flex items-center justify-between">
            <h2 id="modal-modal-title" className="text-lg font-bold text-slate-900">
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
          <form className="flex flex-col gap-y-4 mt-4 text-sm" onSubmit={update}>
            <div className="flex flex-col gap-y-1.5">
              <label htmlFor="taskName" className="font-medium text-slate-700">
                Task name
              </label>
              <TextField
                id="taskName"
                name="taskName"
                size="small"
                sx={TextfieldStyle}
                defaultValue={task.name}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <label htmlFor="category" className="font-medium text-slate-700">
                Category
              </label>
              <TextField
                id="category"
                select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={TextfieldStyle}
                size="small"
              >
                {allCategories.map((category) => {
                  return (
                    <MenuItem key={"select " + category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <DatePickerComp name="date" value={date} setDate={setDate} />
            <TimePickerComp
              nameFrom="hourFrom"
              nameTo="hourTo"
              hourTo={hourTo}
              hourFrom={hourFrom}
              setHourFrom={setHourFrom}
              setHourTo={setHourTo}
            />
            <div className="flex flex-col gap-y-1.5">
              <label htmlFor="details" className="font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="details"
                name="details"
                rows={4}
                defaultValue={task.details}
                onChange={(e) => setDetails(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring/30 transition-colors resize-y"
              />
            </div>
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
    </div>
  );
}
