import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/app/ui/components/PageHeader";

function page() {
  return (
    <div className="px-4 py-6 md:px-10 md:py-10 w-full">
      <PageHeader title="Calendar" subtitle="See all your tasks laid out by day." />
      <div className="mt-8 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-300 py-16 px-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-soft text-primary">
          <CalendarIcon className="w-6" aria-hidden="true" />
        </div>
        <p className="mt-3 font-semibold text-slate-700">Coming soon</p>
        <p className="mt-1 text-slate-500">This view is still being built.</p>
      </div>
    </div>
  );
}

export default page;
