import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { profiles, projetos, userProjects, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Buscar dados do perfil
    const [userProfile] = await db
        .select({
            user: {
                id: users.id,
                name: users.name,
                email: users.email,
                emailVerified: users.emailVerified,
                image: users.image,
                role: users.role,
                createdAt: users.createdAt,
            },
            profile: {
                id: profiles.id,
                bio: profiles.bio,
                company: profiles.company,
                location: profiles.location,
                website: profiles.website,
                phone: profiles.phone,
                birthDate: profiles.birthDate,
                linkedin: profiles.linkedin,
                github: profiles.github,
                theme: profiles.theme,
                language: profiles.language,
                timezone: profiles.timezone,
                emailNotifications: profiles.emailNotifications,
                pushNotifications: profiles.pushNotifications,
            },
        })
        .from(users)
        .leftJoin(profiles, eq(users.id, profiles.userId))
        .where(eq(users.id, session.user.id));

    // Buscar estatísticas do usuário
    const [stats] = await db
        .select({
            totalProjects: sql<number>`COUNT(DISTINCT ${userProjects.codProjeto})`,
            totalAsOwner: sql<number>`COUNT(DISTINCT CASE WHEN ${userProjects.role} = 'OWNER' THEN ${userProjects.codProjeto} END)`,
            totalAsManager: sql<number>`COUNT(DISTINCT CASE WHEN ${userProjects.role} = 'MANAGER' THEN ${userProjects.codProjeto} END)`,
        })
        .from(userProjects)
        .where(eq(userProjects.userId, session.user.id));

    // Buscar projetos recentes do usuário
    const recentProjects = await db
        .select({
            codprojeto: projetos.codprojeto,
            nome: projetos.nome,
            valor: projetos.valor,
            situacao: projetos.situacao,
            role: userProjects.role,
        })
        .from(userProjects)
        .innerJoin(projetos, eq(userProjects.codProjeto, projetos.codprojeto))
        .where(eq(userProjects.userId, session.user.id))
        .limit(5);

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header com avatar e info básica */}
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-content">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg">
                                {userProfile.user.image ? (
                                    <Image
                                        src={userProfile.user.image}
                                        alt={userProfile.user.name || "Avatar"}
                                        width={96}
                                        height={96}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-base-200 flex items-center justify-center text-base-content text-2xl font-bold">
                                        {userProfile.user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold">{userProfile.user.name}</h1>
                            <p className="text-primary-content/80 text-lg">
                                {userProfile.user.email}
                            </p>
                            {userProfile.profile?.bio && (
                                <p className="mt-2 text-primary-content/90">
                                    {userProfile.profile.bio}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                <div className="badge badge-ghost text-primary-content">
                                    {userProfile.user.role === "ADMIN"
                                        ? "Administrador"
                                        : "Usuário"}
                                </div>
                                {userProfile.user.emailVerified && (
                                    <div className="badge badge-success">Email verificado</div>
                                )}
                                {userProfile.profile?.company && (
                                    <div className="badge badge-ghost text-primary-content">
                                        {userProfile.profile.company}
                                    </div>
                                )}
                                {userProfile.profile?.location && (
                                    <div className="badge badge-ghost text-primary-content">
                                        📍 {userProfile.profile.location}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="btn btn-ghost text-primary-content">
                                Editar Perfil
                            </button>
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Estatísticas */}
                    <div className="lg:col-span-3">
                        <div className="stats shadow bg-base-100 w-full">
                            <div className="stat">
                                <div className="stat-figure text-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block w-8 h-8 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Projetos Totais</div>
                                <div className="stat-value text-primary">
                                    {stats?.totalProjects || 0}
                                </div>
                                <div className="stat-desc">Projetos em que você participa</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block w-8 h-8 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Como Proprietário</div>
                                <div className="stat-value text-secondary">
                                    {stats?.totalAsOwner || 0}
                                </div>
                                <div className="stat-desc">Projetos que você possui</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-accent">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block w-8 h-8 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Como Gerente</div>
                                <div className="stat-value text-accent">
                                    {stats?.totalAsManager || 0}
                                </div>
                                <div className="stat-desc">Projetos que você gerencia</div>
                            </div>
                        </div>
                    </div>

                    {/* Informações do perfil */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Informações Pessoais</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-base-content/70">
                                            Email
                                        </label>
                                        <p className="text-base-content">
                                            {userProfile.user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-base-content/70">
                                            Telefone
                                        </label>
                                        <p className="text-base-content">
                                            {userProfile.profile?.phone || "Não informado"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-base-content/70">
                                            Empresa
                                        </label>
                                        <p className="text-base-content">
                                            {userProfile.profile?.company || "Não informada"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-base-content/70">
                                            Website
                                        </label>
                                        <p className="text-base-content">
                                            {userProfile.profile?.website ? (
                                                <a
                                                    href={userProfile.profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link link-primary"
                                                >
                                                    {userProfile.profile.website}
                                                </a>
                                            ) : (
                                                "Não informado"
                                            )}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-base-content/70">
                                            Bio
                                        </label>
                                        <p className="text-base-content">
                                            {userProfile.profile?.bio || "Nenhuma bio adicionada"}
                                        </p>
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <ProfileEditForm userProfile={userProfile} />
                                </div>
                            </div>
                        </div>

                        {/* Projetos recentes */}
                        <div className="card bg-base-100 shadow-xl mt-6">
                            <div className="card-body">
                                <h2 className="card-title">Projetos Recentes</h2>

                                {recentProjects.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentProjects.map(project => (
                                            <div
                                                key={project.codprojeto}
                                                className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                                            >
                                                <div>
                                                    <h3 className="font-medium">{project.nome}</h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="badge badge-sm">
                                                            {project.role}
                                                        </span>
                                                        <span className="badge badge-sm badge-outline">
                                                            {project.situacao}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-success">
                                                        R${" "}
                                                        {parseFloat(project.valor).toLocaleString(
                                                            "pt-BR"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-base-content/70">
                                        <p>Você ainda não possui projetos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configurações rápidas */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Configurações</h2>

                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                Notificações por email
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={
                                                    userProfile.profile?.emailNotifications ?? true
                                                }
                                                readOnly
                                            />
                                        </label>
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">Notificações push</span>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={
                                                    userProfile.profile?.pushNotifications ?? true
                                                }
                                                readOnly
                                            />
                                        </label>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Tema</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={userProfile.profile?.theme || "system"}
                                            disabled
                                        >
                                            <option value="light">Claro</option>
                                            <option value="dark">Escuro</option>
                                            <option value="system">Sistema</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Idioma</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={userProfile.profile?.language || "pt-BR"}
                                            disabled
                                        >
                                            <option value="pt-BR">Português (Brasil)</option>
                                            <option value="en-US">English (US)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links sociais */}
                        {(userProfile.profile?.linkedin || userProfile.profile?.github) && (
                            <div className="card bg-base-100 shadow-xl mt-6">
                                <div className="card-body">
                                    <h2 className="card-title">Links Sociais</h2>

                                    <div className="space-y-3">
                                        {userProfile.profile?.linkedin && (
                                            <a
                                                href={userProfile.profile.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline w-full justify-start"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                LinkedIn
                                            </a>
                                        )}

                                        {userProfile.profile?.github && (
                                            <a
                                                href={userProfile.profile.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline w-full justify-start"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}