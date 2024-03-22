"use server";
import { QueryResultRow, sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Task } from "./definitions";
import dayjs from "dayjs";
interface TaskType {
  id: number;
  name: string;
  category: string;
  date: Date; // Assurez-vous que ce type correspond au type de données de votre colonne date.
  status: string;
  hourfrom: string;
  hourto: string;
  details: string;
}

export async function addToDb(task: Task) {
  try {
    await sql`INSERT INTO tasks (Name, Category, Date, Status, HourFrom, HourTo, Details) VALUES (${task.name}, ${task.category}, ${task.date}, ${task.status}, ${task.hourfrom}, ${task.hourto}, ${task.name})`;
    await sql`INSERT INTO categories (name) SELECT ${task.category} WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = ${task.category})`;
  } catch (error) {
    console.log("Error when adding to db : ", error);
    throw new Error("Creating Error");
  }
}

export async function fetchTodayTasks() {
  try {
    const tasks =
      await sql`SELECT * FROM tasks WHERE date = CURRENT_DATE AND status = 'Pending' ORDER BY TO_TIMESTAMP(hourfrom, 'HH24-MI') ASC;`;
    return tasks.rows;
  } catch (error) {
    console.log("Error fetching database for tasks: ", error);
    throw new Error("Error fetching database for tasks");
  }
}

export async function fetch3NextDays() {
  try {
    const results = await sql`SELECT * FROM tasks
    WHERE date >= CURRENT_DATE
    AND date < CURRENT_DATE + INTERVAL '4 days'
    AND status = 'Pending'
    ORDER BY TO_TIMESTAMP(hourfrom, 'HH24-MI') ASC;`;

    const tasksByDay: QueryResultRow[][] = [[], [], []];

    // Obtenez les dates pour aujourd'hui, demain et après-demain
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    const dayAfterTomorrow = today.add(2, "day");

    // Parcourez les résultats et attribuez chaque tâche au tableau correspondant
    results.rows.map((task: QueryResultRow) => {
      const taskDate = dayjs(task.date).startOf("day");

      if (taskDate.isSame(today)) {
        tasksByDay[0].push(task);
      } else if (taskDate.isSame(tomorrow)) {
        tasksByDay[1].push(task);
      } else if (taskDate.isSame(dayAfterTomorrow)) {
        tasksByDay[2].push(task);
      }
    });
    console.log("Next 3 days", tasksByDay);

    return tasksByDay;
  } catch (error) {
    console.log("Error while fetching for 3 next days");
  }
}

export async function fetchCategories() {
  try {
    const result =
      await sql`SELECT categories.name as category, COUNT(tasks.id) AS numberoftasks
    FROM categories
    LEFT JOIN tasks ON categories.name = tasks.category
    GROUP BY categories.name
    ORDER BY categories.name;`;
    console.log("Result: ", result);

    const categories = result.rows.map((row) => {
      return {
        name: row.category,
        numbers: row.numberoftasks,
      };
    });
    console.log("Categories: ", categories);

    return categories;
  } catch (error) {
    console.log("Error fetching categories", error);
    throw new Error("Error fetching Categories");
  }
}

export async function deleteTaskFromDb(id: number) {
  try {
    await sql`DELETE FROM tasks where  id=${id}`;
  } catch (error) {
    console.log("Error while trying to delete  task from db: ", error);
    throw new Error("Error while  deleting the task.");
  }
}

export async function addDetailsToDb(id: number, details: string) {
  try {
    await sql`UPDATE tasks SET details = ${details} WHERE id= ${id};`;
  } catch (error) {
    console.log("Error adding Details to task ", error);
    throw new Error("There was an error adding the details to this task.");
  }
}

export async function taskCompleted(id: number) {
  try {
    await sql`UPDATE tasks SET status = 'Done' WHERE id = ${id};`;
  } catch (error) {
    console.log("Error while ending task", error);
    throw new Error("We could not end this task.");
  }
}

export async function updateTask(id: number, task: any) {
  try {
    await sql`UPDATE tasks SET name =${task.taskName}, category = ${task.category}, date = ${task.date}, hourfrom = ${task.hourFrom}, hourto = ${task.hourTo}, details = ${task.details} where id = ${id}`;
    console.log("Update task: ", task);
  } catch (error) {
    console.log("Error while updating task", error);
    throw new Error("We could not update this task");
  }
}
