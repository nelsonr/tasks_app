import { useMemo, useRef } from "react";
import { useTasks } from "./hooks/useTasks";
import { formatDate, formatTime, getTimestamp } from "./lib/dateUtils";
import { Task } from "./types";

import "./App.css";

function App() {
  const { tasks, loading, error, addTask } = useTasks();
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

  const formatName = (name: string) => {
    return name[0].toUpperCase() + name.slice(1);
  };

  return (
    <main>
      <section className="content">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <div className="tasks-by-date">
          {tasksByDate.map(([date, tasks]) => (
            <div key={getTimestamp(date)}>
              <h3 className="tasks-by-date__date">{formatDate(date)}</h3>
              <ul>
                {tasks.map((task) => (
                  <li key={task.datetime}>
                    {formatTime(task.datetime)} &ndash;{" "}
                    <span className="tasks-by-date__name">
                      {formatName(task.name)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
