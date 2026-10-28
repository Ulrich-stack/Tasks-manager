"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NewTask, TaskType, TaskUpdate } from "../definitions";
import {
  addToDb,
  deleteCategory,
  deleteTaskFromDb,
  fetchCategories,
  fetchPendingTasks,
  updateTask,
} from "../script";
import { compareTasks } from "../dates";
import { useSnackbar } from "@/app/ui/components/Tasks/SnackbarContext";

type TasksContextType = {
  pending: TaskType[];
  categories: string[];
  isLoading: boolean;
  // Tasks deleted but still inside their undo delay.
  deleting: number[];
  // Bumped after every change so pages with their own data (Completed,
  // Calendar) know when to refetch.
  version: number;
  reload: () => Promise<void>;
  create: (task: NewTask) => Promise<boolean>;
  update: (task: TaskType, changes: TaskUpdate) => Promise<void>;
  complete: (task: TaskType) => Promise<void>;
  reopen: (task: TaskType) => Promise<void>;
  remove: (task: TaskType) => void;
  moveTo: (task: TaskType, category: string) => Promise<void>;
  removeCategory: (category: string) => Promise<void>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used within a TasksProvider");
  return context;
}

const UNDO_DELAY = 5000;

const sorted = (tasks: TaskType[]) => [...tasks].sort(compareTasks);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { showMessage, showError } = useSnackbar();
  const [pending, setPending] = useState<TaskType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [deleting, setDeleting] = useState<number[]>([]);
  const pendingDeletes = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const bump = () => setVersion((v) => v + 1);

  const reload = useCallback(async () => {
    try {
      const [tasks, names] = await Promise.all([
        fetchPendingTasks(),
        fetchCategories(),
      ]);
      // Tasks waiting for their delayed deletion stay hidden.
      setPending(sorted(tasks.filter((t) => !pendingDeletes.current.has(t.id))));
      setCategories(names);
    } catch (error) {
      console.error(error);
      showError("Could not load your tasks. Check your connection.");
    }
    setIsLoading(false);
  }, [showError]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Run deletions still waiting for their undo delay before the page goes away.
  useEffect(() => {
    const deletes = pendingDeletes.current;
    const flush = () => {
      deletes.forEach((timer, id) => {
        clearTimeout(timer);
        deleteTaskFromDb(id);
      });
      deletes.clear();
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  const upsertLocal = (task: TaskType) =>
    setPending((list) =>
      task.status === "Pending"
        ? sorted([...list.filter((t) => t.id !== task.id), task])
        : list.filter((t) => t.id !== task.id)
    );

  const addCategoryLocal = (name: string) =>
    setCategories((list) =>
      list.includes(name) ? list : [...list, name].sort((a, b) => a.localeCompare(b))
    );

  // Apply locally first, then persist; on failure resync with the database.
  const persist = useCallback(
    async (work: () => Promise<unknown>, errorMessage: string) => {
      try {
        await work();
        bump();
        return true;
      } catch (error) {
        console.error(error);
        showError(errorMessage);
        reload();
        return false;
      }
    },
    [reload, showError]
  );

  const create = async (task: NewTask) => {
    try {
      const created = await addToDb(task);
      upsertLocal(created);
      addCategoryLocal(created.category);
      bump();
      showMessage(
        <span>
          <strong>{created.name}</strong> has been added.
        </span>
      );
      return true;
    } catch (error) {
      console.error(error);
      showError("Could not create this task. Please try again.");
      return false;
    }
  };

  const update = async (task: TaskType, changes: TaskUpdate) => {
    const next = { ...task, ...changes };
    upsertLocal(next);
    if (changes.category) addCategoryLocal(changes.category);
    const ok = await persist(() => updateTask(task.id, changes), "Could not save your changes.");
    if (ok) showMessage(<span><strong>{next.name}</strong> updated.</span>);
  };

  const reopen = async (task: TaskType) => {
    upsertLocal({ ...task, status: "Pending" });
    await persist(
      () => updateTask(task.id, { status: "Pending" }),
      "Could not move this task back to your list."
    );
  };

  const complete = async (task: TaskType) => {
    upsertLocal({ ...task, status: "Done" });
    const ok = await persist(
      () => updateTask(task.id, { status: "Done" }),
      "Could not complete this task."
    );
    if (ok)
      showMessage(
        <span>
          <strong>{task.name}</strong> completed.
        </span>,
        { action: { label: "Undo", onClick: () => reopen(task) } }
      );
  };

  const remove = (task: TaskType) => {
    setPending((list) => list.filter((t) => t.id !== task.id));
    setDeleting((ids) => [...ids, task.id]);
    const forget = () => {
      pendingDeletes.current.delete(task.id);
      setDeleting((ids) => ids.filter((id) => id !== task.id));
    };
    const timer = setTimeout(async () => {
      forget();
      await persist(() => deleteTaskFromDb(task.id), "Could not delete this task.");
    }, UNDO_DELAY);
    pendingDeletes.current.set(task.id, timer);
    showMessage(
      <span>
        <strong>{task.name}</strong> deleted.
      </span>,
      {
        action: {
          label: "Undo",
          onClick: () => {
            clearTimeout(timer);
            forget();
            upsertLocal(task);
            bump();
          },
        },
      }
    );
  };

  const moveTo = async (task: TaskType, category: string) => {
    if (task.category === category) return;
    upsertLocal({ ...task, category });
    addCategoryLocal(category);
    const ok = await persist(
      () => updateTask(task.id, { category }),
      "Could not move this task."
    );
    if (ok)
      showMessage(
        <span>
          <strong>{task.name}</strong> moved to {category}.
        </span>,
        { action: { label: "Undo", onClick: () => moveTo({ ...task, category }, task.category) } }
      );
  };

  const removeCategory = async (category: string) => {
    setPending((list) => list.filter((t) => t.category !== category));
    setCategories((list) => list.filter((c) => c !== category));
    const ok = await persist(
      () => deleteCategory(category),
      "Could not delete this category."
    );
    if (ok) showMessage(<span><strong>{category}</strong> deleted.</span>);
  };

  const value = {
    pending,
    categories,
    isLoading,
    deleting,
    version,
    reload,
    create,
    update,
    complete,
    reopen,
    remove,
    moveTo,
    removeCategory,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

// Pending tasks per category, including categories that have no task.
export function useCategorizedTasks(tasks: TaskType[]) {
  const { categories } = useTasks();
  return useMemo(() => {
    const names = Array.from(new Set([...categories, ...tasks.map((t) => t.category)]));
    return names
      .map((category) => ({
        category,
        tasks: tasks.filter((t) => t.category === category),
      }))
      .sort((a, b) => b.tasks.length - a.tasks.length || a.category.localeCompare(b.category));
  }, [categories, tasks]);
}
