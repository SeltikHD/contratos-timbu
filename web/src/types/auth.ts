import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "USER" | "ADMIN";
            emailVerified?: Date | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: "USER" | "ADMIN";
        emailVerified?: Date | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: "USER" | "ADMIN";
        emailVerified?: Date | null;
    }
}
