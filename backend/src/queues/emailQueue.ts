import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const url = process.env.REDIS_URL;

if(!url){
  throw new Error("REDIS_URL is not defined in the environment variables");
}

const connection = new Redis(url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const emailQueue = new Queue("email-queue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

