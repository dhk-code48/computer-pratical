import { Section, UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  sections: Section[];
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

// declare module "@auth/core/jwt" {
//   interface JWT {
//     role?: UserRole;
//   }
// }
