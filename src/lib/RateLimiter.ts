import { RateLimiterMemory } from "rate-limiter-flexible";

const emailCodeOpts = {
  points: 2, // 50 points
  duration: 300, // Per second
};

const emailCodeRateLimiter = new RateLimiterMemory(emailCodeOpts);

export function emailCodeRateLimiterMiddleware({
  remoteAddress,
}: {
  remoteAddress: string;
}) {
  const rateLimiterRes = emailCodeRateLimiter
    .consume(remoteAddress, 1) // consume 2 points
    .then((rateLimiterRes) => {
      return true;
    })
    .catch((rateLimiterRes) => {
      return false;
    });

  return rateLimiterRes;
}
