import { prisma } from "./db";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, TimeSpan } from "lucia";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "w"),
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (user) => {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      emailVerified: boolean;
    };
  }
}
