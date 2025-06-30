import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis("redis://localhost:6379");

export const emailQueue = new Queue("email-queue", {
  connection,
});
