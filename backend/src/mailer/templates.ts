export const onboardingTemplate = (name: string, email: string, password: string) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto;">
      <h2 style="color: #2e6c80;">Welcome to the Training Portal!</h2>
      <p>Hello ${name},</p>
      <p>Your login credentials are as follows:</p>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Email</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Password</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
        </tr>
      </table>
      <p style="color: #b22222;"><strong>Please change your password after logging in for security reasons.</strong></p>
      <p>Best regards,<br>The Training Portal Team</p>
    </div>
`;

export const trainingEnrollmentTemplate = (name: string, title: string, mode: string, startDate: Date, endDate: Date, location: string, platform: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2e6c80;">You're enrolled in a new training!</h2>
      <p>Hello ${name},</p>
      <p>Here are your training details:</p>
      <ul>
        <li><strong>Title:</strong> ${title}</li>
        <li><strong>Mode:</strong> ${mode}</li>
        <li><strong>Start Date:</strong> ${startDate}</li>
        <li><strong>End Date:</strong> ${endDate}</li>
        ${mode === 'OFFLINE' && location ? `<li><strong>Location:</strong> ${location}</li>` : ''}
        ${mode === 'ONLINE' && platform ? `<li><strong>Platform:</strong> ${platform}</li>` : ''}
      </ul>
      <p>Please join the training on time. Reach out to HR for any queries.</p>
    </div>
`;