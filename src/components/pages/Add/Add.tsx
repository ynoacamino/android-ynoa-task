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
import { useHistory } from 'react-router';
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

export default function Add() {
  const form = useForm<Task>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      id: '',
      title: '',
      description: '',
      completed: false,
      createdAt: Date.now().valueOf(),
      updatedAt: Date.now().valueOf(),
    },
  });

  const { addTask } = useTask();
  const { push } = useHistory();

  const onSubmit = async (task: Task) => {
    const randomTask = {
      ...task,
      id: crypto.randomUUID(),
    };
    addTask(randomTask);
    form.reset();
    push('/home');
  };

  return (
    <IonPage>
      <div className="flex flex-col w-full">
        <Header title="Add task" back />
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
                      disabled={(date) => date > new Date('2026-01-01') || date < new Date()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button type="submit">
                Add task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </IonPage>
  );
}
