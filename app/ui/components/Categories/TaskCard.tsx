import styled from "@emotion/styled";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#0F172A",
    fontSize: "0.8125rem",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
}));

export default function TaskCard({
  tasks,
  color,
  item,
  setDndItem,
}: {
  tasks: any;
  color: string;
  item: any;
  setDndItem: (item: any) => void;
}) {
  return (
    <div
      className="relative flex flex-col gap-y-3 bg-white pl-4 pr-2 py-3 rounded-xl border border-slate-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
      draggable
      onDragStart={() => {
        setDndItem({ ...item, id: tasks.id, src: tasks.category });
      }}
      onDragEnd={() => setDndItem({ id: -1, src: "", target: "" })}
    >
      <span
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-x-2">
        <h3 className="font-semibold text-slate-900">{tasks.name}</h3>
        {tasks.details && (
          <LightTooltip title={tasks.details} placement="top">
            <button
              type="button"
              aria-label={`Details: ${tasks.details}`}
              className="shrink-0 -mt-1 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <InformationCircleIcon className="w-[18px]" aria-hidden="true" />
            </button>
          </LightTooltip>
        )}
      </div>

      <div className="flex justify-between text-slate-500 text-xs tabular-nums">
        <span className="flex gap-x-1 items-center">
          <CalendarDaysIcon className="w-4" aria-hidden="true" />
          {dayjs(tasks.date).format("D MMMM")}
        </span>
        <span className="flex gap-x-1 items-center">
          <ClockIcon className="w-4" aria-hidden="true" />
          {dayjs(tasks.hourfrom, "HH:mm").format("HH:mm")}
        </span>
      </div>
    </div>
  );
}
