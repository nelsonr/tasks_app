import { useRef, useState } from "react";
import { useStickyHeader } from "../hooks/useStickyHeader";
import { formatDate, formatTime } from "../lib/dateUtils";
import { Task } from "../types";
import { TrashIcon } from "./TrashIcon";

type Props = {
  date: string;
  tasks: Task[];
  onUpdateTime: (id: number, datetime: string) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
};

function toTimeInputValue(datetime: string): string {
  const d = new Date(datetime);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function EditableTime({
  task,
  onUpdateDatetime,
}: {
  task: Task;
  onUpdateDatetime: Props["onUpdateTime"];
}) {
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

export function DateGroup({
  date,
  tasks,
  onUpdateTime: onUpdateDatetime,
  onDeleteTask,
}: Props) {
  const { sentinelRef, isSticky } = useStickyHeader();

  const headerClassName = `tasks__header${isSticky ? " tasks__header--sticky" : ""}`;

  const onDelete = (ev: React.MouseEvent, task: Task) => {
    ev.preventDefault();
    onDeleteTask(task.id);
  };

  return (
    <div className="tasks__date">
      <div ref={sentinelRef} className="tasks__sentinel" />

      <h3 className={headerClassName}>{formatDate(date)}</h3>

      <ul className="tasks__list">
        {tasks.map((task) => (
          <li key={task.id} className="task">
            <div className="task__content">
              <EditableTime task={task} onUpdateDatetime={onUpdateDatetime} />
              <span>&ndash;</span>
              <span className="task__name">
                {task.name[0].toUpperCase() + task.name.slice(1)}
              </span>
              <a className="task__delete" onClick={(ev) => onDelete(ev, task)}>
                <TrashIcon />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
