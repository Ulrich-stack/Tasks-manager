"use client";

import * as React from "react";
import Popover from "@mui/material/Popover";
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
}: {
  task: any;
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
      <button
        type="button"
        aria-label={`More actions for ${task.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        onClick={(e) => handleClick(e)}
      >
        <EllipsisVerticalIcon className="w-5" aria-hidden="true" />
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
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            },
          },
        }}
      >
        <div role="menu" className="flex flex-col p-1 min-w-[160px] text-sm">
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => {
              handleOpenModal();
              setAnchorEl(null);
            }}
          >
            <PencilIcon className="w-4" aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-primary-soft hover:text-primary transition-colors"
            onClick={() => {
              endTask(task.id);
              setAnchorEl(null);
              showMessage(<span><strong>{task.name}</strong> completed!</span>)
            }}
          >
            <CheckCircleIcon className="w-4" aria-hidden="true" />
            <span>Mark as completed</span>
          </button>
        </div>
      </Popover>
      <UpdateTask task={task} open={openModal} onClose={handleCloseModal} />
    </div>
  );
}
