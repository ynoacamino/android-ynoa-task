import { useTask } from '@/components/providers/TaskProvider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Task } from '@/types/Task';
import { useHistory } from 'react-router';

function SingleTask({ task }: { task: Task }) {
  const { toggleCompleteTask } = useTask();
  const { push } = useHistory();
  const { removeTask } = useTask();

  const changeState = () => {
    toggleCompleteTask(task.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Label className="flex gap-2 items-center hover:bg-zinc-200 px-3 py-2 rounded-md transition-colors">
          <Checkbox checked={task.completed} onCheckedChange={changeState} />
          <span className={cn('text-zinc-600 text-base', { 'text-zinc-400': task.completed })}>
            {task.title}
          </span>
        </Label>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset onClick={() => push(`/edit/${task.id}`)}>
          Edit
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => removeTask({ id: task.id })}>
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function TitleDay({ date }: { date: string }) {
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 864e5).toLocaleDateString();
  const tomorrow = new Date(Date.now() + 864e5).toLocaleDateString();

  if (date === today) {
    return <h2 className="text-2xl font-bold">Today</h2>;
  }
  if (date === yesterday) {
    return <h2 className="text-2xl font-bold">Yesterday</h2>;
  }
  if (date === tomorrow) {
    return <h2 className="text-2xl font-bold">Tomorrow</h2>;
  }
  return <h2 className="text-2xl font-bold">{date}</h2>;
}

export default function Tasks({ date, tasks }: { date: string, tasks: Task[] }) {
  const completed = tasks.filter((task) => task.completed);
  const pending = tasks.filter((task) => !task.completed);

  return (
    <div className="flex flex-col gap-4 w-full px-4 py-2">
      <TitleDay date={date} />
      {
        pending.length > 0 && (
          <div className="flex flex-col gap-2 pl-3">
            {
            pending.map((task) => (
              <SingleTask key={task.id} task={task} />
            ))
            }
          </div>
        )
      }
      {
        completed.length > 0
        && (
          <div className="flex flex-col gap-4 pl-6">
            {
            completed.map((task) => (
              <SingleTask key={task.id} task={task} />
            ))
            }
          </div>
        )
        }
    </div>
  );
}
