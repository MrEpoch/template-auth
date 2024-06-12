"use server";
import { z } from "zod";
import { sendMail } from "../SendMail";
import crypto from "crypto";

export async function ContactEmailSend(formData: FormData) {
  const uncheckedData = {
    email: formData.get("email"),
    title: formData.get("title"),
    message: formData.get("message"),
  };

  const dataZod = z.object({
    email: z.string().email(),
    title: z.string(),
    message: z.string(),
  });

  const dataZodResult = dataZod.safeParse(uncheckedData);

  if (!dataZodResult.success) {
    return { error: "Invalid values", data: null };
  }

  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: dataZodResult.data.title,
      text:
        dataZodResult.data.message +
        "\n\n" +
        "Received from hashed mail: " +
        crypto
          .createCipheriv(
            "aes-256-cbc",
            process.env.CONTACT_EMAIL_SECRET as string,
            process.env.CONTACT_EMAIL_SECRET_INIT as string,
          )
          .update(dataZodResult.data.email, "utf8", "hex"),
    });

    // const decrypted = crypto.createDecipheriv("aes-256-cbc", process.env.CONTACT_EMAIL_SECRET as string, process.env.CONTACT_EMAIL_SECRET_INIT as string).update(--Encrypted--, "hex", "utf8");
    return { data: null, error: null };
  } catch (error) {
    return { error: "Could not send data", data: null };
  }
}
