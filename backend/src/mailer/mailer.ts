import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  console.error('SMTP_USER or SMTP_PASS is not defined in the environment variables.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, htmlBody: string) => {
  const mailOptions = {
    from: SMTP_USER,
    to,
    subject,
    html: htmlBody,
  };

  await transporter.sendMail(mailOptions);
};
