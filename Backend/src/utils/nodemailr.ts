import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Signing Up',
      html: `
        <html>
          <body>
            <p>Thank you for signing up with Sparsh!</p>
            <p>Please verify your email address by using the following OTP:</p>
            <p><strong>Your OTP is: ${otp}</strong></p>
            <p>Thanks and regards,</p>
            <p>The Sparsh Team</p>
          </body>
        </html>
      `,
    };
    const response = await transporter.sendMail(mailOptions);
   console.log( "Email sent successfully", response );

  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

