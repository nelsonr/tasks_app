import { useState, useRef } from "react";
import { formatTime } from "../lib/dateUtils";
import { Task } from "../types";

type Props = {
  task: Task;
  onUpdateTime: (id: number, datetime: string) => Promise<void>;
};

export function EditableTime({ task, onUpdateTime }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(toTimeInputValue(task.datetime));
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setValue(toTimeInputValue(task.datetime));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commit = async () => {
    const [hours, minutes] = value.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      setEditing(false);
      return;
    }
    const date = new Date(task.datetime);
    date.setHours(hours, minutes, 0, 0);
    await onUpdateTime(task.id, date.toISOString());
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <span className="task__time">
      <span className="task__time-label" onClick={startEditing}>
        {formatTime(task.datetime)}
      </span>
      {editing && (
        <input
          ref={inputRef}
          className="task__time-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
        />
      )}
    </span>
  );
}

function toTimeInputValue(datetime: string): string {
  const d = new Date(datetime);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
