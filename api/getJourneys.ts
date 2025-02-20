import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { journeys } from '../drizzle/schema.ts';
import { authenticateUser } from './_apiUtils.ts';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID,
    },
  },
});

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const user = await authenticateUser(req);

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const records = await db.select().from(journeys).where(journeys.userId.eq(user.id)).orderBy(journeys.date, 'desc');

    res.status(200).json(records);
    console.log('Journeys fetched for user:', user.id);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in getJourneys:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}