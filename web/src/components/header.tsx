import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
    const session = await auth();

    return (
        <header className="bg-base-100 shadow-lg border-b border-base-300">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
                    >
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content w-10 rounded-full">
                                <span className="text-sm font-bold">CT</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">Contratos Timbu</h1>
                            <p className="text-sm text-base-content/70">
                                Sistema de Gestão de Contratos
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {session?.user ? (
                            <>
                                {/* Notificações */}
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost btn-circle"
                                    >
                                        <div className="indicator">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 17h5l-5 5v-5zM10.5 14H21l-5.5 5.5L10.5 14z"
                                                />
                                            </svg>
                                            <span className="badge badge-sm indicator-item">3</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-80">
                                        <div className="p-3">
                                            <h3 className="font-bold text-lg">Notificações</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="alert alert-info">
                                                    <span>Novo projeto aprovado</span>
                                                </div>
                                                <div className="alert alert-warning">
                                                    <span>Contrato vencendo em 3 dias</span>
                                                </div>
                                                <div className="alert alert-success">
                                                    <span>Ordem de serviço concluída</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu do usuário */}
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost btn-circle avatar"
                                    >
                                        <div className="w-10 rounded-full">
                                            {session.user.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt={session.user.name || "Avatar"}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="avatar placeholder">
                                                    <div className="bg-secondary text-secondary-content w-10 rounded-full">
                                                        <span className="text-sm">
                                                            {session.user.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || "U"}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                        <li className="menu-title px-4 py-2">
                                            <span className="text-base-content/70">
                                                {session.user.email}
                                            </span>
                                        </li>
                                        <li>
                                            <Link href="/profile" className="justify-between">
                                                Meu Perfil
                                                {session.user.role === "ADMIN" && (
                                                    <span className="badge badge-primary">
                                                        Admin
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </li>
                                        <li>
                                            <Link href="/settings">Configurações</Link>
                                        </li>
                                        <div className="divider my-1"></div>
                                        <li>
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await signOut();
                                                }}
                                            >
                                                <button
                                                    type="submit"
                                                    className="text-error w-full text-left"
                                                >
                                                    Sair
                                                </button>
                                            </form>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/auth/signin" className="btn btn-ghost">
                                    Entrar
                                </Link>
                                <Link href="/auth/signin" className="btn btn-primary">
                                    Criar Conta
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
