import nodemailer from "nodemailer";

export default async function sendOtpToEmail(email, otp) {
  try {
    const title = "blogging - OTP",
      body = `
          <h3>Your OTP is: <strong>${otp}<strong></h3>
          `;

    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d22fd5c314d7d9",
        pass: "04a8df495f670d",
      },
    });
    let info = await transport.sendMail({
      from: "BloggingApp@gmail.com",
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
