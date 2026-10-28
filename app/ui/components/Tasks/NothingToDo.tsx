import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function NothingToDo({
  title = "Nothing to do",
  hint = "Enjoy the free time, or plan something new.",
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-soft text-primary">
        <ClipboardDocumentCheckIcon className="w-6" aria-hidden="true" />
      </div>
      <p className="mt-3 font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-slate-500">{hint}</p>
    </div>
  );
}
