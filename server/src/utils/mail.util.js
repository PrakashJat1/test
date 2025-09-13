import transporter from "../config/mailer.config.js";

const sendotpmail = async ({ fullName, email, otp }) => {
  const mailOptions = {
    from: '"IBF Team" <un10101known@gmail.com>',
    to: email,
    subject:
      "Complete Your Registration – OTP Verification for InfoBeans Foundation",
    html: `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Welcome ${fullName},</h2>

        <p>Thank you for registering with <strong>InfoBeans Foundation</strong>.</p>

        <p>To complete your registration and verify your email, please use the following One-Time Password (OTP):</p>

        <h1 style="color: #d35400; letter-spacing: 4px;">${otp}</h1>

        <p><strong>This OTP is valid for 5 minutes only.</strong></p>

        <p>Enter this OTP on the registration page to confirm your identity and activate your account.</p>

        <p>If you did not initiate this registration, please ignore this email or contact us at 
        <a href="mailto:support@infobeansfoundation.org">support@infobeansfoundation.org</a>.</p>

        <br />
        <p>Best regards,</p>
        <p><strong>InfoBeans Foundation Team</strong></p>
      </div>
    </body>
  </html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { send: true };
  } catch (error) {
    console.log("Error in sending email ", error);
    return { send: false };
  }
};

const sendFinalSelectionMail = async (fullName, email, batch) => {
  const mailOptions = {
    from: '"IBF Team" <un10101known@gmail.com>',
    to: email,
    subject: `Congratulations! You Have Been Selected for the ITEP Program – InfoBeans Foundation`,
    html: `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Congratulations ${fullName}!</h2>
        <p>We are pleased to inform you that you have been <strong>finally selected</strong> for the ITEP program at <strong>InfoBeans Foundation</strong>.</p>

        <p>You have been assigned to the following batch:</p>
        <ul>
          <li><strong>Batch Name:</strong> ${batch.batch_Name}</li>
          <li><strong>Batch Number:</strong> ${batch.batch_No}</li>
         <li><strong>Start Date:</strong> ${new Date(
           batch.start_Date
         ).toLocaleDateString("en-IN", {
           year: "numeric",
           month: "long",
           day: "numeric",
         })}</li>
        </ul>

        <p>You can now log in to the <strong>InfoBeans Foundation Management System (IBFMS)</strong> using your registered email and password at:</p>
        <p>
          <a href="https://ibf-connect.netlify.app/" target="_blank" style="color: #2e86de;">IBF Connect</a>
        </p>

        <p>Please make sure to check your dashboard for orientation schedules, tasks, and important announcements.</p>

        <p>If you have any queries, feel free to contact us at <a href="mailto:support@infobeansfoundation.org">support@infobeansfoundation.org</a>.</p>

        <p>We are excited to have you on board and wish you all the best for your journey ahead!</p>

        <br />
        <p>Warm regards,</p>
        <p><strong>InfoBeans Foundation Team</strong></p>
      </div>
    </body>
  </html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { send: true };
  } catch (error) {
    console.log("Error in sending email ", error);
    return { send: false };
  }
};

export default {
  sendotpmail,
  sendFinalSelectionMail,
};
