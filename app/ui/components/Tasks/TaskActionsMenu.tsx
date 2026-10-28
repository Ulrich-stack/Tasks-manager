"use client";

import React, { useState } from "react";
import { Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  PencilIcon,
  SunIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { TaskType } from "@/app/lib/definitions";
import { useTasks } from "@/app/lib/hooks/TasksProvider";
import { todayKey } from "@/app/lib/dates";
import UpdateTask from "./UpdateTask";

const menuPaper = {
  paper: {
    sx: {
      mt: 0.5,
      minWidth: 200,
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
      "& .MuiMenuItem-root": { fontSize: "0.875rem", borderRadius: "6px", mx: 0.5 },
      "& .MuiListItemIcon-root": { minWidth: 28, color: "#64748B" },
    },
  },
};

export default function TaskActionsMenu({ task }: { task: TaskType }) {
  const { categories, moveTo, remove, update, reopen } = useTasks();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [view, setView] = useState<"main" | "move">("main");
  const [editing, setEditing] = useState(false);

  const close = () => {
    setAnchorEl(null);
    setView("main");
  };
  const run = (action: () => void) => () => {
    close();
    action();
  };

  const isDone = task.status === "Done";
  const today = todayKey();

  return (
    <>
      <button
        type="button"
        aria-label={`More actions for ${task.name}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <EllipsisVerticalIcon className="w-5" aria-hidden="true" />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={menuPaper}
      >
        {view === "main"
          ? [
              <MenuItem key="edit" onClick={run(() => setEditing(true))}>
                <ListItemIcon><PencilIcon className="w-4" /></ListItemIcon>
                Edit
              </MenuItem>,
              !isDone && task.date !== today && (
                <MenuItem key="today" onClick={run(() => update(task, { date: today }))}>
                  <ListItemIcon><SunIcon className="w-4" /></ListItemIcon>
                  Do it today
                </MenuItem>
              ),
              isDone && (
                <MenuItem key="reopen" onClick={run(() => reopen(task))}>
                  <ListItemIcon><ArrowPathIcon className="w-4" /></ListItemIcon>
                  Mark as not done
                </MenuItem>
              ),
              <MenuItem key="move" onClick={() => setView("move")}>
                <ListItemIcon><FolderIcon className="w-4" /></ListItemIcon>
                <span className="flex-1">Move to…</span>
                <ArrowRightIcon className="w-4 text-slate-400" aria-hidden="true" />
              </MenuItem>,
              <Divider key="divider" sx={{ my: 0.5 }} />,
              <MenuItem
                key="delete"
                onClick={run(() => remove(task))}
                sx={{ color: "#DC2626", "& .MuiListItemIcon-root": { color: "#DC2626" } }}
              >
                <ListItemIcon><TrashIcon className="w-4" /></ListItemIcon>
                Delete
              </MenuItem>,
            ]
          : [
              <MenuItem key="back" onClick={() => setView("main")}>
                <ListItemIcon><ChevronLeftIcon className="w-4" /></ListItemIcon>
                <span className="font-semibold">Move to…</span>
              </MenuItem>,
              <Divider key="divider" sx={{ my: 0.5 }} />,
              ...categories.map((category) => (
                <MenuItem
                  key={category}
                  disabled={category === task.category}
                  onClick={run(() => moveTo(task, category))}
                >
                  {category}
                </MenuItem>
              )),
            ]}
      </Menu>
      {editing && (
        <UpdateTask task={task} open={editing} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
