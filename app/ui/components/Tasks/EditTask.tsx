"use client";

import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { EllipsisVerticalIcon, PencilIcon } from "@heroicons/react/24/outline";
import { taskCompleted } from "../../../lib/script";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Task } from "../../../lib/definitions";
import UpdateTask from "./UpdateTask";
import { useContext } from "react";
import { useSnackbar } from "./SnackbarContext";
import { TasksStateContext } from "@/app/lib/hooks/TasksStateContext";

export default function EditTask({
  task,
  reloadData,
}: {
  task: any;
  reloadData: any;
}) {
  const context = useContext(TasksStateContext);
  const {showMessage} =useSnackbar();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if(!context) 
  throw new Error("Could not find provider");

  const {dispatch} = context;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function endTask(id: number) {
    try {
      await taskCompleted(id); // Attendre la suppression de la tâche
      dispatch({type: 'DONE', payload: id})
    } catch (error) {
      console.error("An error occurred while ending the task", error);
    }
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="flex items-center">
      <button onClick={(e) => handleClick(e)}>
        <EllipsisVerticalIcon className="w-4" />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography
          sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <button className="text-xs flex items-center gap-x-2"
          onClick={e=>{
            handleOpenModal();
            setAnchorEl(null);
          }}
          >
            <PencilIcon width={"14px"} />
            <span>Edit</span>
          </button>
          <button
            className="text-xs flex items-center gap-x-2"
            onClick={(e) => {
              endTask(task.id);
              setAnchorEl(null);
              showMessage(<span><strong>{task.name}</strong> completed!</span>)
            }}
          >
            <CheckCircleIcon width={"14px"} />
            <span>Completed</span>
          </button>
        </Typography>
      </Popover>
      <UpdateTask task={task} open={openModal} onClose={handleCloseModal} reloadData={reloadData} />
    </div>
  );
}
