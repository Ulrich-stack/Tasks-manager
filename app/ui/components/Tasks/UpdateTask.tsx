import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DatePickerComp from "./DatePickerComp";
import { MenuItem, Select, TextField } from "@mui/material";
import { TextfieldStyle } from "../../../lib/utils";
import TimePickerComp from "./TimePickerComp";
import { Textarea } from "@mui/joy";
import { fetchCategories, updateTask } from "../../../lib/script";
import { TasksStateContext } from "../../../(todo-app)/page";
import { useSnackbar } from "./SnackbarContext";

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
  reloadData
}: {
  task: any;
  open: boolean;
  onClose: () => void;
  reloadData: ()=> void
}) {
  const {showMessage} =useSnackbar();

  const [date, setDate] = useState<Dayjs | null>(dayjs(task.date));
  const [hourFrom, setHourFrom] = useState<Dayjs | null>(
    dayjs(task.hourfrom, "HH:mm")
  );
  const [hourTo, setHourTo] = useState<Dayjs | null>(
    dayjs(task.hourto, "HH:mm")
  );
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
        console.log(newCategories);

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
      console.log("Update with success: ", task.id);
    }catch(error){
      console.log("Update failed", error);
      throw new Error("We could not update this task");
    }  
    reloadData();

  }

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
            <form className="" onSubmit={update}>
              <div className="flex flex-col gap-y-2">
                <label className="font-semibold">Task name</label>
                {/* <input className="border p-2 rounded-lg" name="taskName" id="taskName" value={task.name}></input> */}
                <TextField
                  name="taskName"
                  size="small"
                  sx={TextfieldStyle}
                  defaultValue={task.name}
                />
              </div>
              <div className="flex flex-col gap-y-2 mt-4">
                <label className="font-semibold">Category</label>
                <TextField
                select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={TextfieldStyle}
                size="small"
                >
                   {allCategories.map((category) => {
                    return (
                      <MenuItem key={"select " + category.name} value={category.name}>{category.name}</MenuItem>
                    );
                  })}
                  </TextField>
              </div>
              <div className="flex flex-col gap-y-2 mt-2">
                <DatePickerComp
                  name="date"
                  value={date}
                  setDate={setDate}
                />
                <TimePickerComp
                  nameFrom="hourFrom"
                  nameTo="hourTo"
                  hourTo={hourTo}
                  hourFrom={hourFrom}
                  setHourFrom={setHourFrom}
                  setHourTo={setHourTo}
                />
              </div>
              <div className="w-full flex flex-col mt-4 gap-y-2">
                <label className="font-semibold">Description</label>
                <Textarea
                  minRows={4}
                  name="details"
                  sx={TextfieldStyle}
                  defaultValue={task.details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-lg mt-4"
              >
                Update
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
