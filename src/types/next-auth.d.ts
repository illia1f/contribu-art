import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    username: string;
    accountCreatedYear: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    accountCreatedYear?: number;
  }
}
