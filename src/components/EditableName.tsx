import { useRef, useState } from "react";
import { Task } from "../types";

type Props = {
  task: Task;
  onUpdateName: (id: number, name: string) => Promise<void>;
};

export function EditableName({ task, onUpdateName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.name);

  const taskName = task.name[0].toUpperCase() + task.name.slice(1);

  const startEditing = () => {
    setValue(task.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditing(false);
      onUpdateName(task.id, value);
    }
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <span className="task__name">
      <span className="task__name-label" onClick={startEditing}>
        {taskName}
      </span>
      <div className="task__name-input">
        {editing && (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setEditing(false)}
          />
        )}
      </div>
    </span>
  );
}
