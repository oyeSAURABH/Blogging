import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function sendOtpToEmail(email, otp) {
  try {
    const title = "blogging - OTP",
      body = `
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center; max-width: 400px;">
        <h1 style="color: #333333; margin-bottom: 20px;">OTP Verification</h1>
        <p style="color: #666666; margin-bottom: 30px;">Please enter the OTP sent to your email/phone:</p>
        <div style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px; margin-bottom: 20px;">${otp}</div>
        <p style="color: #999999; font-size: 14px;">Thank You!</p>
      </div>
          `;

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let info = await transport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: title,
      html: body,
    });
    // console.log("Email info: ", info);
    return { success: true, data: info };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
}
