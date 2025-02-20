CREATE TABLE IF NOT EXISTS "journeys" (
  "id" SERIAL PRIMARY KEY,
  "date" DATE NOT NULL,
  "start_time" TIMESTAMP NOT NULL,
  "end_time" TIMESTAMP,
  "distance" FLOAT8 NOT NULL DEFAULT 0,
  "mode" TEXT NOT NULL,
  "user_id" UUID NOT NULL
);