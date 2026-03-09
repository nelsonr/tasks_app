import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Task } from "../types";

type UseTasksResult = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (name: string) => Promise<void>;
};

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = () =>
    invoke<Task[]>("list_tasks")
      .then(setTasks)
      .catch((e: string) => setError(e))
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (name: string) => {
    await invoke("add_task", { name });
    await fetchTasks();
  };

  return { tasks, loading, error, addTask };
}
