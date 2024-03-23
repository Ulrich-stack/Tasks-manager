import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React from "react";

export default function TaskCard({
  tasks,
  color,
}: {
  tasks: any;
  color: string;
}) {
  return (
    <div
      className="h-[80px] w-[200px] border border-t-4 flex flex-col p-2 rounded-md justify-between shadow-md"
      style={{
        borderTopColor: color,
      }}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{tasks.name}</h3>
        <span className="text-xs text-gray-400">
          {dayjs(tasks.hourfrom, "HH:mm").format("HH:mm")}
        </span>
      </div>
      <div className="">
        <div className="flex gap-x-1 text-gray-400 items-center">
          <CalendarDaysIcon width={"12px"} />{" "}
          <p>{dayjs(tasks.date).format("D MMMM")}</p>{" "}
        </div>
      </div>
    </div>
  );
}
