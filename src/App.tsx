import { useMemo, useRef } from "react";
import { DailyTasks } from "./components/DailyTasks";
import { useTasks } from "./hooks/useTasks";
import { getTimestamp } from "./lib/dateUtils";
import { Task } from "./types";

import "./App.css";

function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    updateTaskName,
    updateTaskTime,
    isLoading,
    errorMessage,
  } = useTasks();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input?.value.trim()) return;
    await addTask(input.value.trim());
    input.value = "";
  };

  const tasksByDate = useMemo(() => {
    const dateTasks: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      const date = new Date(task.datetime).toISOString().slice(0, 10);
      if (!dateTasks[date]) {
        dateTasks[date] = [];
      }
      dateTasks[date].push(task);
    });

    return Object.entries(dateTasks);
  }, [tasks]);

  return (
    <main>
      <section className="content">
        {isLoading && <p>Loading...</p>}
        {errorMessage && <p>Error: {errorMessage}</p>}

        <div className="tasks">
          {tasksByDate.map(([date, tasks]) => (
            <DailyTasks
              key={getTimestamp(date)}
              date={date}
              tasks={tasks}
              onUpdateName={updateTaskName}
              onUpdateTime={updateTaskTime}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </section>

      <footer className="form">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            name="name"
            placeholder="Add a task..."
            autoFocus
          />
        </form>
      </footer>
    </main>
  );
}

export default App;
