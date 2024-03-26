import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { CategorizedTasks } from "@/app/lib/definitions";
import { stringToColor } from "@/app/lib/utils";

export default function SkeletonLoader({
  categories,
}: {
  categories: CategorizedTasks[];
}) {
  return (
    <>
      {categories.map((categoryTab) => {
        const color = stringToColor(categoryTab.category);

        return (
          <div className="flex flex-col w-full mb-4" key={categoryTab.category}>
            <h2 className="font-bold" style={{ color: color }}>
              {categoryTab.category}
            </h2>
            <div className="mt-4 gap-3 pt-3 border-t flex grid-cols-4">
              <Skeleton
              animation="wave"
                variant="rectangular"
                height={80}
                sx={{
                  borderRadius: "10px",
                  width: "25%",
                }}
              />
              <Skeleton
              animation="wave"
                variant="rectangular"
                height={80}
                sx={{
                  borderRadius: "10px",
                  width: "25%",
                }}
              />
              <Skeleton
              animation="wave"

                variant="rectangular"
                height={80}
                sx={{
                  borderRadius: "10px",
                  width: "25%",
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
