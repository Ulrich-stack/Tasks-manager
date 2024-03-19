"use server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Task } from "./definitions";

export async function createTask() {
  console.log(process.env.POSTGRES_URL);
  try {
    await sql`INSERT INTO tasks (Name, Category, CreationDate, DueDate, Status, HourFrom, HourTo, Details)
        VALUES ('Nom', 'Catégorie de la tâche', '2023-01-01T00:00:00', '2023-01-07T00:00:00', 'Pending', '09:00', '11:00', 'Ceci est un détail de la tâche.');
        `;
  } catch (error) {
    throw new Error("Serveur error");
  }
}

export async function addToDb(task: Task) {
  try {
    console.log("Task object", task);
    await sql`INSERT INTO tasks (Name, Category, Date, Status, HourFrom, HourTo, Details) VALUES (${task.name}, ${task.category}, ${task.date}, ${task.status}, ${task.hourfrom}, ${task.hourto}, 'Enter more Details here')`;
  } catch (error) {
    console.log("Error when adding to db : ", error);
    throw new Error("Creating Error");
  }
}

export async function fetchTasks() {
  try {
    const tasks = await sql`SELECT * FROM tasks  ORDER BY Date ASC`;
    console.log("Fetched Tasks: ", tasks.rows);
    console.log("End");

    return tasks.rows;
  } catch (error) {
    console.log("Error fetching database for tasks: ", error);
    throw new Error("Error fetching database for tasks");
  }
}

export async function fetchCategories() {
  try {
    const result = await sql`SELECT DISTINCT Category, COUNT(*) as NumberOfTasks FROM tasks GROUP BY Category ORDER BY NumberOfTasks DESC`;
    console.log("Result: ", result);
    
      const categories = result.rows.map(row =>{
        return { 
          name: row.category, 
          numbers: row.numberoftasks
        };
      });
      console.log("Categories: ", categories);
      
      return categories; 
     } catch (error) {
    console.log("Error fetching categories", error);
    throw new Error("Error fetching Categories");
  }
}


export async function deleteTaskFromDb(id: number){
  try{
    await sql`DELETE FROM tasks where  id=${id}`;
  }catch(error){
    console.log("Error while trying to delete  task from db: ", error);
    throw new Error("Error while  deleting the task.");
  }
}

export async function addDetailsToDb(id: number, details: string){
  try{
    await sql`UPDATE tasks SET details = ${details} WHERE id= ${id};`;
  }catch(error){
    console.log("Error adding Details to task ", error);
    throw new Error("There was an error adding the details to this task.");
  }
}

export async function taskCompleted(id: number){
  try{
    await sql`UPDATE tasks SET status = 'Done' WHERE id = ${id};`;
  }catch(error){
    console.log("Error while ending task", error);
    throw new Error("We could not end this task.");
  }
}