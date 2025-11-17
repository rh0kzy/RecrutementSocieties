import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Recruitment Platform" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  role: 'ADMIN' | 'COMPANY' | 'CANDIDATE'
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&role=${role}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0052CC;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #0052CC; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 8px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #5E6C84; word-break: break-all;">${resetUrl}</p>
      <p style="color: #5E6C84; font-size: 14px; margin-top: 30px;">
        This link will expire in 1 hour. If you didn't request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #DFE1E6; margin: 30px 0;">
      <p style="color: #5E6C84; font-size: 12px;">
        Recruitment SaaS Platform<br>
        This is an automated email, please do not reply.
      </p>
    </div>
  `;

  const text = `
    Password Reset Request
    
    Hello,
    
    You requested to reset your password. Use this link to reset it:
    ${resetUrl}
    
    This link will expire in 1 hour. If you didn't request this, please ignore this email.
    
    Recruitment SaaS Platform
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
    text,
  });
};

/**
 * Send welcome email (for future use)
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  role: 'COMPANY' | 'CANDIDATE'
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0052CC;">Welcome to Recruitment Platform!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering as a ${role.toLowerCase()}.</p>
      ${role === 'COMPANY' ? '<p><strong>Note:</strong> Your account is pending admin approval. You will receive an email once your account is activated.</p>' : ''}
      <p>We're excited to have you on board!</p>
      <hr style="border: none; border-top: 1px solid #DFE1E6; margin: 30px 0;">
      <p style="color: #5E6C84; font-size: 12px;">
        Recruitment SaaS Platform<br>
        This is an automated email, please do not reply.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Recruitment Platform!',
    html,
  });
};
