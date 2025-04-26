import { z } from 'zod';

export const itemSchema = z.object({
  uuid: z.string().uuid(),
  content: z.string(),
  lastUpdated: z.number(),
});

export const returnItemSchema = z.object({
  data: itemSchema.optional(),
  error: z.string().optional(),
});

export type Item = z.infer<typeof itemSchema>;

export type ReturnItem = z.infer<typeof returnItemSchema>;
