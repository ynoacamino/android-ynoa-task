import { IonPage } from '@ionic/react';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Task, TaskSchema } from '@/types/Task';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useTask } from '@/components/providers/TaskProvider';
import { useHistory, useParams } from 'react-router';
import { useEffect } from 'react';
import Header from '../global/Header';

function AddFormLabel({ children }: { children: React.ReactNode }) {
  return (
    <FormLabel
      className="text-2xl font-bold"
    >
      {children}
    </FormLabel>
  );
}

export default function Edit() {
  const { getTask, updateTask } = useTask();

  const { id } = useParams() as { id: string };
  const { push } = useHistory();

  const form = useForm<Task>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      completed: false,
      createdAt: Date.now().valueOf(),
      updatedAt: Date.now().valueOf(),
    },
  });

  useEffect(() => {
    const currentTask = getTask({ id });
    if (!currentTask) {
      push('/home');
    }

    if (currentTask) {
      form.setValue('id', currentTask.id);
      form.setValue('title', currentTask.title);
      form.setValue('description', currentTask.description);
      form.setValue('completed', currentTask.completed);
      form.setValue('createdAt', currentTask.createdAt);
      form.setValue('updatedAt', currentTask.updatedAt);
      form.setValue('date', currentTask.date);
    }
  }, [id]);

  const onSubmit = async (task: Task) => {
    updateTask(task);
    push('/home');
  };

  return (
    <IonPage>
      <div className="flex flex-col w-full">
        <Header title="Edit task" back />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full my-4 px-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <AddFormLabel>Title</AddFormLabel>
                  <FormControl>
                    <Input placeholder="My new task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <AddFormLabel>Description</AddFormLabel>
                  <FormControl>
                    <Textarea placeholder="Description of my new task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <AddFormLabel>
                    Date
                    {
                      field.value !== 0
                        && (
                        <span className="text-muted-foreground">
                          :
                          {' '}
                          { new Date(field.value).toLocaleDateString()}
                        </span>
                        )
                    }
                  </AddFormLabel>
                  <FormControl className="w-full flex justify-start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(e) => field.onChange(e?.valueOf())}
                      disabled={(date) => date > new Date('2026-01-01') || date < new Date('1900-01-01')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button type="submit">
                Edit task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </IonPage>
  );
}
