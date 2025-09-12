import { accounts, profiles, sessions, users, verificationTokens } from "@/db/schema";
import { db } from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),

    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],

    callbacks: {
        async session({ token, session }) {
            if (token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role as "USER" | "ADMIN";
                session.user.emailVerified = token.emailVerified as Date | null;
            }
            return session;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Login inicial
                token.role = user.role;
                token.emailVerified = user.emailVerified;
            }

            if (trigger === "update" && session) {
                // Atualização de sessão
                token = { ...token, ...session };
                return token;
            }

            return token;
        },

        async signIn({ user, account, profile: _profile }) {
            if (account?.provider === "google") {
                try {
                    // Criar ou atualizar perfil do usuário
                    if (user.id) {
                        await db
                            .insert(profiles)
                            .values({
                                id: crypto.randomUUID(),
                                userId: user.id,
                                bio: null,
                                company: null,
                                location: null,
                            })
                            .onConflictDoNothing();
                    }
                } catch (error) {
                    // Erro ao criar perfil - log interno
                    console.error("Profile creation error:", error);
                }
            }
            return true;
        },
    },

    events: {
        async linkAccount({ user }) {
            // Verificar email automaticamente para OAuth
            if (user.id) {
                await db
                    .update(users)
                    .set({ emailVerified: new Date() })
                    .where(eq(users.id, user.id));
            }
        },
    },

    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },

    session: {
        strategy: "jwt",
    },

    debug: process.env.NODE_ENV === "development",
});
