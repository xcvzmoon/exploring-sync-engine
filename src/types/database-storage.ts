import { z } from 'zod';
import { itemSchema } from './item';

export const databaseStorageSchema = z.object({
  select: z.function().args(z.string()).returns(itemSchema.optional()),
  selectAll: z.function().returns(itemSchema.array()),
  synchronize: z.function().args(itemSchema.array()).returns(z.void()),
});

export type DatabaseStorage = z.infer<typeof databaseStorageSchema>;
