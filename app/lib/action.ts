'use server'

import dayjs from "dayjs";
import { Task } from "./definitions";
import { addToDb, fetchCategories } from "./script";


export async function createTask(task: Task) {
    
    let newTask = {
        ...task,
    }
    addToDb(newTask);
}

export async function categories(){
    return  await fetchCategories();
}