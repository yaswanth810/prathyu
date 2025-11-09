import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email templates
const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to SkillSwap! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SkillSwap!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}! 👋</h2>
            <p>We're excited to have you join our community of learners and teachers!</p>
            <p>SkillSwap is a platform where you can:</p>
            <ul>
              <li>🎓 Share your skills and teach others</li>
              <li>📚 Learn new skills from experts</li>
              <li>💬 Connect with like-minded people</li>
              <li>📹 Have video sessions</li>
              <li>⭐ Build your reputation</li>
            </ul>
            <p>Ready to get started?</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, feel free to reach out!</p>
            <p>Happy learning! 🚀</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
            <p>This email was sent because you signed up for SkillSwap.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  sessionConfirmed: (studentName: string, teacherName: string, sessionTitle: string, date: string, meetingLink?: string) => ({
    subject: `Session Confirmed: ${sessionTitle} ✅`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .session-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Session Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Great news, ${studentName}!</h2>
            <p>${teacherName} has confirmed your learning session.</p>
            <div class="session-info">
              <h3>📚 ${sessionTitle}</h3>
              <p><strong>Teacher:</strong> ${teacherName}</p>
              <p><strong>Date & Time:</strong> ${date}</p>
              ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
            </div>
            ${meetingLink ? `<a href="${meetingLink}" class="button">Join Video Call</a>` : ''}
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/sessions" class="button">View All Sessions</a>
            <p>We'll send you a reminder 1 hour before the session starts.</p>
            <p>Good luck with your learning! 🎯</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  sessionReminder: (userName: string, sessionTitle: string, teacherName: string, date: string, meetingLink?: string) => ({
    subject: `Reminder: Session in 1 Hour - ${sessionTitle} ⏰`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .alert { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Session Starting Soon!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName}!</h2>
            <div class="alert">
              <p><strong>Your session starts in 1 hour!</strong></p>
            </div>
            <h3>📚 ${sessionTitle}</h3>
            <p><strong>With:</strong> ${teacherName}</p>
            <p><strong>Time:</strong> ${date}</p>
            ${meetingLink ? `
              <p><strong>Meeting Link:</strong></p>
              <a href="${meetingLink}" class="button">Join Video Call Now</a>
            ` : ''}
            <p>Make sure you're ready:</p>
            <ul>
              <li>✅ Have a stable internet connection</li>
              <li>✅ Test your camera and microphone</li>
              <li>✅ Prepare any questions you have</li>
              <li>✅ Have a notebook ready</li>
            </ul>
            <p>See you soon! 👋</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  reviewRequest: (studentName: string, teacherName: string, sessionTitle: string) => ({
    subject: `How was your session with ${teacherName}? ⭐`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .stars { font-size: 30px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⭐ Leave a Review</h1>
          </div>
          <div class="content">
            <h2>Hi ${studentName}!</h2>
            <p>You recently completed a learning session:</p>
            <h3>📚 ${sessionTitle}</h3>
            <p><strong>With:</strong> ${teacherName}</p>
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>How was your experience? Your feedback helps teachers improve and helps other learners find great instructors!</p>
            <p>It only takes a minute:</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/sessions" class="button">Leave a Review</a>
            <p>Thank you for being part of our community! 🙏</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Email sending functions
export const emailService = {
  async sendWelcomeEmail(email: string, name: string) {
    try {
      const template = emailTemplates.welcome(name);
      await transporter.sendMail({
        from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw - email failure shouldn't break registration
    }
  },

  async sendSessionConfirmation(
    studentEmail: string,
    studentName: string,
    teacherName: string,
    sessionTitle: string,
    date: string,
    meetingLink?: string
  ) {
    try {
      const template = emailTemplates.sessionConfirmed(studentName, teacherName, sessionTitle, date, meetingLink);
      await transporter.sendMail({
        from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
        to: studentEmail,
        subject: template.subject,
        html: template.html,
      });
      console.log(`Session confirmation sent to ${studentEmail}`);
    } catch (error) {
      console.error('Error sending session confirmation:', error);
    }
  },

  async sendSessionReminder(
    userEmail: string,
    userName: string,
    sessionTitle: string,
    teacherName: string,
    date: string,
    meetingLink?: string
  ) {
    try {
      const template = emailTemplates.sessionReminder(userName, sessionTitle, teacherName, date, meetingLink);
      await transporter.sendMail({
        from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html,
      });
      console.log(`Session reminder sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending session reminder:', error);
    }
  },

  async sendReviewRequest(studentEmail: string, studentName: string, teacherName: string, sessionTitle: string) {
    try {
      const template = emailTemplates.reviewRequest(studentName, teacherName, sessionTitle);
      await transporter.sendMail({
        from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
        to: studentEmail,
        subject: template.subject,
        html: template.html,
      });
      console.log(`Review request sent to ${studentEmail}`);
    } catch (error) {
      console.error('Error sending review request:', error);
    }
  },

  // Test email function
  async sendTestEmail(email: string) {
    try {
      await transporter.sendMail({
        from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Test Email from SkillSwap 🎉',
        html: '<h1>Email is working!</h1><p>Your email service is configured correctly.</p>',
      });
      console.log(`Test email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  },
};
