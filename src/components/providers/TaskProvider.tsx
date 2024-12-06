/* eslint-disable react/jsx-no-constructed-context-values */
import {
  useContext, createContext,
  useState,
  useEffect,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/Task';

import { Preferences } from '@capacitor/preferences';
import Spiiner from '../ui/spinner';

const userContext = createContext({
  tasks: [] as Task[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTask: (task: Task) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDayTasks: ({ date }: { date: Date }) => [] as Task[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGroupTasks: () => ({} as Record<string, Task[]>),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleCompleteTask: (id: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTestTask: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearTasks: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeTask: ({ id }: { id: string }) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTask: ({ id }: { id: string }) => ({} as Task | undefined),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateTask: (task: Task) => {},
  loading: true,
});

export const useTask = () => {
  const contex = useContext(userContext);
  if (!useContext) throw new Error('contect not found');
  return contex;
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const getTasks = async () => {
    const { value } = await Preferences.get({ key: 'tasks' });
    if (value) {
      setTasks(JSON.parse(value));
    }
  };

  const getDayTasks = (
    { date } : { date: Date },
  ) => tasks.filter(
    (task) => date.toLocaleDateString() === new Date(task.date).toLocaleDateString(),
  );

  const getGroupTasks = () => {
    const groupTasks = tasks.reduce((acc, task) => {
      const date = new Date(task.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
    return groupTasks;
  };

  const addTask = async (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(newTasks),
    });
    toast({
      title: 'Task added',
    });
  };

  const addTestTask = () => {
    addTask({
      id: crypto.randomUUID(),
      title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam repellat vel tempore cupiditate itaque ab?',
      createdAt: new Date().valueOf(),
      description: 'This is a test task',
      updatedAt: new Date().valueOf(),
      date: new Date().valueOf(),
      completed: false,
    });
  };

  const clearTasks = async () => {
    setTasks([]);
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify([]),
    });
  };

  const toggleCompleteTask = async (id: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });
    setTasks(newTasks);
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(newTasks),
    });
  };

  const removeTask = async ({ id }: { id: string }) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(newTasks),
    });
    toast({
      title: 'Task removed',
    });
  };

  const getTask = ({ id }: { id:string }) => {
    const task = tasks.find((t) => t.id === id);

    return task;
  };

  const updateTask = async (task: Task) => {
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      }
      return t;
    });
    setTasks(newTasks);
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(newTasks),
    });
    toast({
      title: 'Task updated',
    });
  };

  useEffect(() => {
    getTasks()
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spiiner className="w-16 h-16" />
      </div>
    );
  }

  return (
    <userContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        getDayTasks,
        getGroupTasks,
        toggleCompleteTask,
        addTestTask,
        clearTasks,
        removeTask,
        getTask,
        updateTask,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
