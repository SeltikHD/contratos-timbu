import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
    searchParams,
}: {
    readonly searchParams: { callbackUrl?: string; error?: string };
}) {
    const session = await auth();

    if (session) {
        redirect(searchParams.callbackUrl || "/dashboard");
    }

    const callbackUrl = searchParams.callbackUrl || "/dashboard";
    const error = searchParams.error;

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
                        <span className="text-2xl font-bold text-primary-content">CT</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
                        Entre na sua conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-base-content/70">
                        Acesse o sistema de gestão de contratos
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            {error === "OAuthSignin" && "Erro ao iniciar autenticação"}
                            {error === "OAuthCallback" && "Erro no callback OAuth"}
                            {error === "OAuthCreateAccount" && "Erro ao criar conta"}
                            {error === "EmailCreateAccount" && "Erro ao criar conta com email"}
                            {error === "Callback" && "Erro de callback"}
                            {error === "OAuthAccountNotLinked" &&
                                "Esta conta já está vinculada a outro método"}
                            {error === "EmailSignin" && "Erro ao enviar email"}
                            {error === "CredentialsSignin" && "Credenciais inválidas"}
                            {error === "SessionRequired" && "Sessão requerida"}
                            {![
                                "OAuthSignin",
                                "OAuthCallback",
                                "OAuthCreateAccount",
                                "EmailCreateAccount",
                                "Callback",
                                "OAuthAccountNotLinked",
                                "EmailSignin",
                                "CredentialsSignin",
                                "SessionRequired",
                            ].includes(error) && "Erro de autenticação"}
                        </span>
                    </div>
                )}

                <div className="mt-8 space-y-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <form
                                action={async () => {
                                    "use server";
                                    await signIn("google", { redirectTo: callbackUrl });
                                }}
                            >
                                <button type="submit" className="btn btn-outline w-full gap-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continuar com Google
                                </button>
                            </form>

                            <div className="divider">ou</div>

                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="input input-bordered w-full"
                                        disabled
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Senha</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full"
                                        disabled
                                    />
                                </div>

                                <button className="btn btn-primary w-full" disabled>
                                    Login com Email (Em breve)
                                </button>

                                <div className="text-center">
                                    <button type="button" className="link link-primary text-sm">
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-base-content/70">
                            Novo por aqui?{" "}
                            <a href="/auth/signup" className="link link-primary">
                                Criar conta
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
