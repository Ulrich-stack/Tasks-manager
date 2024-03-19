'use server'

import dayjs from "dayjs";
import { Task } from "./definitions";
import { addToDb, fetchCategories } from "./script";
import { fixedCategories } from "./utils";


export async function createTask(task: Task) {
    
    let newTask = {
        ...task,
    }
    addToDb(newTask);
}

export async function categories(){
    const newCategories = await fetchCategories();
    return [...fixedCategories, ...newCategories];
}