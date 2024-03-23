export type Task = {
    name: string,
    category: string;
    date: string,
    status: string,
    hourfrom:string,
    hourto: string,
}

export interface TaskType {
    id: number;
    name: string;
    category: string;
    date: Date; // Assurez-vous que ce type correspond au type de données de votre colonne date.
    status: string;
    hourfrom: string;
    hourto: string;
    details: string;
  }
  
  export interface CategorizedTasks {
    category: string;
    tasks: any[];
  }
  