import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { addDetailsToDb, deleteTaskFromDb, fetchCategories, fetchTasks } from "../lib/script";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { hasIcon, iconIndex, stringToColor } from "../lib/utils";
import { categories } from "../lib/utils";
import { useEffect, useState } from "react";
import EditTask from "./EditTask";
import { QueryResultRow } from "@vercel/postgres";
import { Textarea } from "@mui/joy";

function Taskslist({
  tasksList,
  reloadData,
}: {
  tasksList: QueryResultRow[];
  reloadData: any;
}) {
  const [displayDetails, setDisplayDetails] = useState(0);
  const [details, setDetails] = useState("");

  async function handleDetailsAdding(id: number) {
    if (!displayDetails) {
      await addDetailsToDb(id, details);
      console.log("Adding");
    }
  }

  async function deleteTask(idTask: number) {
    try {
      
      await deleteTaskFromDb(idTask); // Attendre la suppression de la tâche
      await reloadData(); // Attendre la récupération des données mises à jour
      
      console.log("Task deleted:", idTask);
    } catch (error) {
      console.error("An error occurred while deleting the task", error);
    }
  }

  return (
    <div className="mt-10 w-1/2 flex flex-col gap-y-2">
      {tasksList.map((task) => {
        const color = stringToColor(task.category);
        return (
          // <div key={"global " + task.id}>
          //   <div
          //     key={"task " + task.id}
          //     className="border rounded-md p-2 text-xs bg-white flex justify-between hover:cursor-pointer"
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       if (displayDetails !== task.id)
          //       {
          //         setDisplayDetails(task.id);
          //         setDetails(task.details);
          //       }
          //       else setDisplayDetails(0);
          //       console.log("CCC");
          //     }}
          //   >
          //     <div className="flex items-center">
          //       <input
          //         type="checkbox"
          //         className="w-3 hover:cursor-pointer"
          //       ></input>
          //       <p className="ml-2">{task.name}</p>
          //       {hasIcon(task.category) ? (
          //         <img
          //           src={`/icons/${categories[iconIndex(task.category)].icon}`}
          //           className="w-5 ml-2"
          //         ></img>
          //       ) : (
          //         <div
          //           className={`ml-2 w-4 h-4 border rounded-md`}
          //           style={{ borderColor: stringToColor(task.category) }}
          //         ></div>
          //       )}
          //     </div>
          //     <div className="flex">
          //       <div className="flex items-center bg-[#edeced] p-1 rounded text-gray-400">
          //         <ClockIcon className="w-4 text-gray-500 mr-1" />
          //         <span className="text-xs">
          //           {task.hourfrom + " - " + task.hourto}
          //         </span>
          //       </div>
          //       <EditTask idTask={task.id} reloadData={reloadData} />
          //     </div>
          //   </div>
          //   <div
          //     key={"Details " + task.id}
          //     className={`bg-transparent ${
          //       task.id === displayDetails ? "h-[100px]" : " overflow-hidden h-0"
          //     }`}
          //     style={{
          //       transition: 'height .5s ease',
          //     }}
          //   >
          //     <Textarea
          //       minRows={2}
          //       variant="plain"
          //       value={details}
          //       sx={{
          //         minHeight: "100%",
          //         boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
          //         '--Textarea-focusedThickness': '0rem',
          //       }}
          //       onChange={e =>setDetails(e.target.value)}
          //       onKeyUp={e => handleDetailsAdding(task.id)}
          //     />
          //   </div>
          // </div>

          <div
            key={"task " + task.id}
            className="w-full flex flex-col gap-y-2 bg-white p-2 rounded-md border"
          >
            <div className="w-full flex items-center justify-between">
              <p className="font-bold">{task.name}</p>
              <div className="flex items-center gap-x-1">
                <TrashIcon
                  width={"15px"}
                  className="text-red-500 hover:cursor-pointer"
                  onClick={e=>deleteTask(task.id)}
                />
                {/* <EllipsisHorizontalIcon width={"15px"} className="hover:cursor-pointer"/> */}
                <EditTask task={task} reloadData={reloadData} />
              </div>
            </div>
            <div className="flex items-center rounded text-gray-400 w-fit">
              <ClockIcon className="w-4 text-gray-500 mr-1" />
              <span className="text-xs">
                {task.hourfrom + " - " + task.hourto}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className="px-1 rounded-md"
                style={{
                  backgroundColor: `rgba(${color}, 0,1)`,
                  color: color,
                }}
              >
                {task.category}
              </div>
              {hasIcon(task.category) ? (
                <img
                  src={`/icons/${categories[iconIndex(task.category)].icon}`}
                  className="w-5 ml-2"
                ></img>
              ) : (
                <div
                  className={`ml-2 w-4 h-4 border rounded-md`}
                  style={{ borderColor: color }}
                ></div>
              )}{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Taskslist;
