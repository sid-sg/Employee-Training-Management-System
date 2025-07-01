import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { sendEmail } from "./mailer";



dotenv.config({ path: path.resolve(__dirname, '../.env') });

const url = process.env.REDIS_URL;

if (!url) {
  throw new Error("REDIS_URL is not defined in the environment variables");
}

const connection = new Redis(url, {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});


export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    
    const { to, subject, htmlBody } = job.data;
    
    switch (job.name) {
      case 'sendOnboardingEmail':
      case 'trainingEnrollmentEmail':
        await sendEmail(to, subject, htmlBody);
        break;
        
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  { connection }
);


emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});
