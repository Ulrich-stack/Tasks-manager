import styled from "@emotion/styled";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import {
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { IconButton, Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: 'black',
    border: '1px thin #ccc', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
}));

export default function TaskCard({
  tasks,
  color,
  item,
  setDndItem
}: {
  tasks: any;
  color: string;
  item: any;
  setDndItem: (item: any)=>void
}) {
  return (
    <div
      className="h-[80px] border border-t-4 flex flex-col p-2 rounded-md justify-between shadow-md"
      style={{
        borderTopColor: color,
      }}
      draggable
      onDragStart={(e)=>{
        setDndItem({...item, id: tasks.id, src:tasks.category});
        console.log("Drag start");
        
      }}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{tasks.name}</h3>
        <LightTooltip title={tasks.details} placement="top" >
            <InformationCircleIcon
              className="hover:cursor-pointer"
              width={"16px"}
            />
        </LightTooltip>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-x-1 text-gray-400 items-center">
          <CalendarDaysIcon width={"12px"} />{" "}
          <p>{dayjs(tasks.date).format("D MMMM")}</p>{" "}
        </div>
        <span className="text-xs text-gray-400">
          {dayjs(tasks.hourfrom, "HH:mm").format("HH:mm")}
        </span>
      </div>
    </div>
  );
}
