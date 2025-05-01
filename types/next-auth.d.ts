import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
      is_pass_otp: boolean;
      token_otp: string | null;
      token: string | null;
      birthdate: string | null;
      username?: string | null;
      phone: string | number | null;
      role: string | null;
      credentials: string;
    };
  }
}
