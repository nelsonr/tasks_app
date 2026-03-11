import { useStickyHeader } from "../hooks/useStickyHeader";
import { formatDate, formatTime } from "../lib/dateUtils";
import { Task } from "../types";

export function DateGroup({ date, tasks }: { date: string; tasks: Task[] }) {
  const { sentinelRef, isSticky } = useStickyHeader();

  return (
    <div>
      <div ref={sentinelRef} className="tasks-by-date__sentinel" />
      <h3
        className={`tasks-by-date__date${isSticky ? " tasks-by-date__date--sticky" : ""}`}
      >
        {formatDate(date)}
      </h3>
      <ul className="tasks-by-date__list">
        {tasks.map((task) => (
          <li key={task.datetime}>
            {formatTime(task.datetime)} &ndash;{" "}
            <span className="tasks-by-date__name">
              {task.name[0].toUpperCase() + task.name.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
