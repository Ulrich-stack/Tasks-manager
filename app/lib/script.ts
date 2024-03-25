"use server";
import { QueryResultRow, sql } from "@vercel/postgres";
import { CategorizedTasks, Task } from "./definitions";
import dayjs from "dayjs";

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

export async function fetchAllPendingTask() {
  try {
    const results = await sql`SELECT * FROM tasks 
      WHERE date >= CURRENT_DATE 
        AND status = 'Pending' 
      ORDER BY date ASC, TO_TIMESTAMP(hourfrom, 'HH24-MI') ASC;`;

    const tasksByCategory: Map<string, any[]> = new Map();

    results.rows.forEach((task) => { // obtain the array of tasks for each category or set it to a void array
      const categoryTasks = tasksByCategory.get(task.category) || [];
      categoryTasks.push(task);
      tasksByCategory.set(task.category, categoryTasks);
    });

    const categorizedTasks: CategorizedTasks[] = Array.from(
      tasksByCategory,
      ([category, tasks]) => ({
        category,
        tasks,
      })
    );

    return categorizedTasks;
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

    // Obtain the next 3 days date
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    const dayAfterTomorrow = today.add(2, "day");

    // Run through all of the elements and assign each to one row
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

    return tasksByDay;
  } catch (error) {
    console.log("Error while fetching for 3 next days");
  }
}

export async function fetchCategories() {
  try {
    const result =
      await sql`SELECT categories.name AS category, COUNT(tasks.id) AS numberoftasks
      FROM categories
      LEFT JOIN tasks ON categories.name = tasks.category AND tasks.status = 'Pending'
      GROUP BY categories.name
      ORDER BY categories.name;`;

    const categories = result.rows.map((row) => {
      return {
        name: row.category,
        numbers: row.numberoftasks,
      };
    });

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
  } catch (error) {
    console.log("Error while updating task", error);
    throw new Error("We could not update this task");
  }
}

export async function updateCategory(id: number, category: string){
  try{
    await sql`UPDATE tasks SET category = ${category} WHERE tasks.id = ${id}`
  }catch(error){
    throw new Error("Error while changing category")
  }
}

export async function deleteCategory(category: string){
  try{
    await sql`DELETE FROM tasks  WHERE category = ${category}`;
    await sql`DELETE FROM categories WHERE  name = ${category}`;
  }catch(error){
    throw new Error("Error while deleting this category");
  }
}