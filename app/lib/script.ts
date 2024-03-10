import { sql } from "@vercel/postgres";


export async function createTask(){
    console.log(process.env.POSTGRES_URL);
    await sql `INSERT INTO tasks (Name, Category, CreationDate, DueDate, Status, HourFrom, HourTo, Details)
    VALUES ('Nom', 'Catégorie de la tâche', '2023-01-01T00:00:00', '2023-01-07T00:00:00', 'Pending', '09:00', '11:00', 'Ceci est un détail de la tâche.');
    `
}