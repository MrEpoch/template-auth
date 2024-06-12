import { headers } from "next/headers";

export function getIpAddress() {
  const fallBack = "0.0.0.0";
  let ip = headers().get("x-forwarded-for");
  if (!ip) {
    ip = headers().get("x-real-ip") ?? fallBack;
  } else ip.split(",")[0];

  return ip;
}
