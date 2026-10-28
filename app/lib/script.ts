"use server";
import { QueryResultRow, sql } from "@vercel/postgres";
import { NewTask, TaskType, TaskUpdate } from "./definitions";

// Dates leave the database as "YYYY-MM-DD" strings so the client decides
// what "today" is in its own time zone.
function toTask(row: QueryResultRow): TaskType {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    date: row.date,
    status: row.status,
    hourfrom: row.hourfrom ?? "",
    hourto: row.hourto ?? "",
    details: row.details ?? "",
  };
}

export async function fetchPendingTasks() {
  try {
    const result = await sql`SELECT id, name, category, to_char(date, 'YYYY-MM-DD') AS date,
        status, hourfrom, hourto, details
      FROM tasks WHERE status = 'Pending'`;
    return result.rows.map(toTask);
  } catch (error) {
    console.log("Error fetching pending tasks: ", error);
    throw new Error("Error fetching pending tasks");
  }
}

export async function fetchCompletedTasks() {
  try {
    const result = await sql`SELECT id, name, category, to_char(date, 'YYYY-MM-DD') AS date,
        status, hourfrom, hourto, details
      FROM tasks WHERE status = 'Done'
      ORDER BY date DESC, id DESC
      LIMIT 300`;
    return result.rows.map(toTask);
  } catch (error) {
    console.log("Error fetching completed tasks: ", error);
    throw new Error("Error fetching completed tasks");
  }
}

export async function fetchTasksBetween(from: string, to: string) {
  try {
    const result = await sql`SELECT id, name, category, to_char(date, 'YYYY-MM-DD') AS date,
        status, hourfrom, hourto, details
      FROM tasks WHERE date >= ${from} AND date <= ${to}`;
    return result.rows.map(toTask);
  } catch (error) {
    console.log("Error fetching tasks between dates: ", error);
    throw new Error("Error fetching tasks");
  }
}

export async function fetchCategories() {
  try {
    const result = await sql`SELECT name FROM categories ORDER BY name`;
    return result.rows.map((row) => row.name as string);
  } catch (error) {
    console.log("Error fetching categories", error);
    throw new Error("Error fetching Categories");
  }
}

export async function addToDb(task: NewTask) {
  try {
    const result = await sql`INSERT INTO tasks (Name, Category, Date, Status, HourFrom, HourTo, Details)
      VALUES (${task.name}, ${task.category}, ${task.date}, 'Pending', ${task.hourfrom}, ${task.hourto}, ${task.details})
      RETURNING id, name, category, to_char(date, 'YYYY-MM-DD') AS date, status, hourfrom, hourto, details`;
    await sql`INSERT INTO categories (name) SELECT ${task.category} WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = ${task.category})`;
    return toTask(result.rows[0]);
  } catch (error) {
    console.log("Error when adding to db : ", error);
    throw new Error("Creating Error");
  }
}

export async function updateTask(id: number, task: TaskUpdate) {
  const current = await sql`SELECT name, category, to_char(date, 'YYYY-MM-DD') AS date,
      status, hourfrom, hourto, details FROM tasks WHERE id = ${id}`;
  if (!current.rows.length) throw new Error("This task no longer exists");
  const next = { ...toTask({ id, ...current.rows[0] }), ...task };
  try {
    await sql`UPDATE tasks SET name = ${next.name}, category = ${next.category}, date = ${next.date},
        status = ${next.status}, hourfrom = ${next.hourfrom}, hourto = ${next.hourto}, details = ${next.details}
      WHERE id = ${id}`;
    await sql`INSERT INTO categories (name) SELECT ${next.category} WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = ${next.category})`;
  } catch (error) {
    console.log("Error while updating task", error);
    throw new Error("We could not update this task");
  }
}

export async function deleteTaskFromDb(id: number) {
  try {
    await sql`DELETE FROM tasks WHERE id = ${id}`;
  } catch (error) {
    console.log("Error while trying to delete task from db: ", error);
    throw new Error("Error while deleting the task.");
  }
}

export async function deleteCategory(category: string) {
  try {
    await sql`DELETE FROM tasks WHERE category = ${category}`;
    await sql`DELETE FROM categories WHERE name = ${category}`;
  } catch (error) {
    throw new Error("Error while deleting this category");
  }
}
