import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize transporter - configure according to your email service
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export interface SendMailOptions {
  email: string | string[];
  subject: string;
  htmlTemplate: string;
}

export const sendMail = async ({
  email,
  subject,
  htmlTemplate,
}: SendMailOptions) => {
  try {
    const emailArray = Array.isArray(email) ? email : [email];

    const info = await transporter.sendMail({
      from: {
        name: 'ANF App',
        address: process.env.EMAIL_USER,
      },
      to: emailArray.join(', '),
      subject,
      html: htmlTemplate,
    });

    return info;
  } catch (error) {
    console.error('Error sending mail:', error);
    throw error;
  }
};

export const sendNewUserEmail = async (data: any) => {
  try {
    const info = await transporter.sendMail({
      from: `"ANF Team" <${process.env.MAIL_USER}>`,
      to: ['support@sidr.productions'],
      subject: 'New User Registration',
      html: data.html,
    });

    return info;
  } catch (error) {
    console.error('Error sending new user email:', error);
    throw error;
  }
};
