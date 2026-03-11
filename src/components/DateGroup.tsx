import { useRef, useState } from "react";
import { useStickyHeader } from "../hooks/useStickyHeader";
import { formatDate, formatTime } from "../lib/dateUtils";
import { Task } from "../types";

type Props = {
  date: string;
  tasks: Task[];
  onUpdateDatetime: (id: number, datetime: string) => Promise<void>;
};

function toTimeInputValue(datetime: string): string {
  const d = new Date(datetime);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function EditableTime({ task, onUpdateDatetime }: { task: Task; onUpdateDatetime: Props["onUpdateDatetime"] }) {
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
    await onUpdateDatetime(task.id, date.toISOString());
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <span className="tasks-by-date__time-wrapper">
      <span className="tasks-by-date__time" onClick={startEditing}>
        {formatTime(task.datetime)}
      </span>
      {editing && (
        <input
          ref={inputRef}
          className="tasks-by-date__time-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
        />
      )}
    </span>
  );
}

export function DateGroup({ date, tasks, onUpdateDatetime }: Props) {
  const { sentinelRef, isSticky } = useStickyHeader();

  const headerClassName = `tasks-by-date__date${isSticky ? " tasks-by-date__date--sticky" : ""}`;

  return (
    <div>
      <div ref={sentinelRef} className="tasks-by-date__sentinel" />

      <h3 className={headerClassName}>{formatDate(date)}</h3>

      <ul className="tasks-by-date__list">
        {tasks.map((task) => (
          <li key={task.datetime}>
            <EditableTime task={task} onUpdateDatetime={onUpdateDatetime} /> &ndash;{" "}
            <span className="tasks-by-date__name">
              {task.name[0].toUpperCase() + task.name.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
