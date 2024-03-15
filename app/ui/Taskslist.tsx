import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { fetchCategories, fetchTasks } from "../lib/script";
import { ClockIcon } from "@heroicons/react/24/outline";
import { hasIcon, iconIndex } from "../lib/utils";
import { categories } from "../lib/utils";

async function Taskslist() {
  const tasksList = await fetchTasks();

  return (
    <div className="mt-10 w-full flex flex-col gap-y-2">
      {tasksList.map((task) => {
        return (
          <div
            key={"task " + task.id}
            className="border rounded-md p-2 text-xs bg-white flex justify-between"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-3 hover:cursor-pointer"
              ></input>
              <p className="ml-2">{task.name}</p>
              {hasIcon(task.category) ? (
                <img
                  src={`/icons/${categories[iconIndex(task.category)].icon}`}
                  className="w-5 ml-2"
                ></img>
              ) : (
                <div className=" ml-2 w-4 h-4 border rounded-md border-sky-700"></div>
              )}
            </div>
            <div className="flex">
              <div className="flex items-center bg-[#edeced] p-1 rounded text-gray-400">
                <ClockIcon className="w-4 text-gray-500 mr-1" />
                <span className="text-xs">
                  {task.hourfrom + " - " + task.hourto}
                </span>
              </div>
              <EllipsisVerticalIcon className="w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Taskslist;
