
// // interface OtpEmailData {
// //   email: string;
// //   name: string;
// //   otp: string;
// // }

// function sendOtpEmail(email: string, otp:number){
//   // const apiKey = process.env.SENDGRID_API_KEY; // Fetch API key from environment variable

//   // if (!apiKey) {
//   //   throw new Error("SendGrid API key is not defined");
//   // }

//   // sgMail.setApiKey(apiKey);

//   // const msg = {
//   //   to: data.email,
//   //   from: "satyam2001anand@gmail.com", // This should be a verified sender email
//   //   subject: "Sending OTP for Verification",
//   //   html: ``,
//   // };

//   // sgMail
//   //   .send(msg)
//   //   .then(() => {
//   //     console.log("Email sent");
//   //   })
//   //   .catch((error: any) => {
//   //     console.error("Error sending email:", error);
//   //   });
// }

// export default sendOtpEmail;



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

