import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Task } from "../types";

type UseTasksResult = {
  tasks: Task[];
  isLoading: boolean;
  errorMessage: string | null;
  addTask: (name: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTaskTime: (id: number, datetime: string) => Promise<void>;
};

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTasks = () =>
    invoke<Task[]>("list_tasks")
      .then(setTasks)
      .catch((e: string) => setErrorMessage(e))
      .finally(() => setIsLoading(false));

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (name: string) => {
    await invoke("add_task", { name });
    await fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await invoke("delete_task", { id });
    await fetchTasks();
  };

  const updateTaskTime = async (id: number, datetime: string) => {
    await invoke("update_task_datetime", { id, datetime });
    await fetchTasks();
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTaskTime,
    isLoading,
    errorMessage,
  };
}
