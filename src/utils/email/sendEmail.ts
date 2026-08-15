import { transporter } from "./email.config";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions) => {
  const info = await transporter.sendMail({
    from: `"SAS DoorBD" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
};