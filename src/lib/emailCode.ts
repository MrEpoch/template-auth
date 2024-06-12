import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { prisma } from "./db";
import { emailCodeRateLimiterMiddleware } from "./RateLimiter";

interface EmailVerificationCodeReturnType {
  data: string | null;
  error: string | null;
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string,
  ip: string,
): Promise<EmailVerificationCodeReturnType> {
  const emailLimiter = await emailCodeRateLimiterMiddleware({
    remoteAddress: ip,
  });
  console.log(emailLimiter);
  if (!emailLimiter) {
    return { data: null, error: "Too many requests" };
  }

  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
  const code = generateRandomString(8, alphabet("0-9"));

  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")),
    },
  });

  return { data: code, error: null };
}
