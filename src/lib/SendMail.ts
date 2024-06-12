//importing modules
import nodemailer from "nodemailer";

//function to send email to the user
export async function sendMail({ to, subject, text }) {
  try {
    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    };
    //asign createTransport method in nodemailer to a variable
    //service: to determine which email platform to use
    //auth contains the senders email and password which are all saved in the .env
    const Transporter = nodemailer.createTransport({
      host: "mailhog",
      port: 1025,
    });

    //return the Transporter variable which has the sendMail method to send the mail
    //which is within the mailOptions
    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}
