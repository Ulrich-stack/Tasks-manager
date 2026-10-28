import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { CategorizedTasks } from "@/app/lib/definitions";

export default function SkeletonLoader({
  categories,
}: {
  categories: CategorizedTasks[];
}) {
  // On first load there are no categories yet: show placeholders anyway.
  const sections = categories.length
    ? categories.map((c) => c.category)
    : ["placeholder-1", "placeholder-2", "placeholder-3"];

  return (
    <>
      {sections.map((name) => (
        <div
          className="flex flex-col w-full rounded-2xl border border-slate-200 bg-white p-4"
          key={name}
          aria-hidden="true"
        >
          <Skeleton animation="wave" variant="text" width={140} height={32} />
          <div className="grid gap-3 mt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                animation="wave"
                variant="rectangular"
                height={80}
                sx={{ borderRadius: "12px" }}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
