import { pgTable, serial, float8, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';

export const journeys = pgTable('journeys', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  distance: float8('distance').notNull().default(0),
  mode: text('mode').notNull(),
  userId: uuid('user_id').notNull(),
});