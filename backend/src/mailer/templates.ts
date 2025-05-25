export const onboardingTemplate = (email: string, password: string) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto;">
      <h2 style="color: #2e6c80;">Welcome to the Training Portal!</h2>
      <p>Hello,</p>
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
