import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z
    .string({
      message: 'Title is required',
    })
    .min(3, {
      message: 'Title must be at least 3 character long',
    })
    .max(50, {
      message: 'Title must be at most 50 character long',
    }),
  description: z
    .string({
      message: 'Description is required',
    })
    .max(100, {
      message: 'Description must be at most 100 character long',
    })
    .optional(),
  completed: z.boolean(),
  date: z.number().gte(new Date('1900-01-01').valueOf(), {
    message: 'Select a valid date',
  }),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Task = z.infer<typeof TaskSchema>;
