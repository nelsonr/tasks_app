import { useStickyHeader } from "../hooks/useStickyHeader";
import { formatDate } from "../lib/dateUtils";
import { Task } from "../types";
import { EditableName } from "./EditableName";
import { EditableTime } from "./EditableTime";

type Props = {
  date: string;
  tasks: Task[];
  onUpdateName: (id: number, name: string) => Promise<void>;
  onUpdateTime: (id: number, datetime: string) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
};

export function DailyTasks({
  date,
  tasks,
  onUpdateName,
  onUpdateTime,
  onDeleteTask,
}: Props) {
  const { sentinelRef, isSticky } = useStickyHeader();

  const headerClassName = `tasks__header${isSticky ? " tasks__header--sticky" : ""}`;

  return (
    <div className="tasks__date">
      <div ref={sentinelRef} className="tasks__sentinel" />

      <h3 className={headerClassName}>{formatDate(date)}</h3>

      <ul className="tasks__list">
        {tasks.map((task) => (
          <li key={task.id} className="task">
            <div className="task__content">
              <EditableName task={task} onUpdateName={onUpdateName} />
              <EditableTime task={task} onUpdateTime={onUpdateTime} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
