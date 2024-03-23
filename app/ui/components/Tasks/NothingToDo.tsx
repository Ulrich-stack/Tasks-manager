import React from "react";

export default function NothingToDo() {
  return (
    <div className="flex flex-col items-center justify-center h-1/2">
      <div className="flex relative">
        <div className="w-10 h-12 border bg-slate-200 rounded-md"></div>
        <div className="w-10 h-12 border bg-slate-100 rounded-md absolute z-10 origin-bottom-right animate-rotate rotate-[20deg] drop-shadow "></div>
      </div>
      <div className="mt-2 text-slate-300">Nothing to do</div>
    </div>
  );
}
