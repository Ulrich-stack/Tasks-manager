import { TaskType } from "@/app/lib/definitions";
import TaskItem from "./TaskItem";

function Taskslist({
  tasksList,
  showDate = false,
}: {
  tasksList: TaskType[];
  showDate?: boolean;
}) {
  return (
    <ul className="w-full flex flex-col gap-y-2">
      {tasksList.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} showDate={showDate} />
        </li>
      ))}
    </ul>
  );
}

export default Taskslist;
