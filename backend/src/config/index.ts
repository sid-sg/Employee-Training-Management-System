// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// export const config = {
//   port: process.env.PORT || 3000,
//   smtpUser: process.env.SMTP_USER,
//   smtpPass: process.env.SMTP_PASS,
//   redisUrl: process.env.REDIS_URL,
// };

// const requiredEnvVars = ['SMTP_USER', 'SMTP_PASS'];
// const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

// if (missingEnvVars.length > 0) {
//   throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
// }