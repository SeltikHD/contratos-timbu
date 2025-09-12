import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
    readonly totalProjetos: number;
    readonly projetosAtivos: number;
    readonly projetosConcluidos: number;
    readonly valorTotalProjetos: string;
}

export default function DashboardStats({
    totalProjetos,
    projetosAtivos,
    projetosConcluidos,
    valorTotalProjetos,
}: DashboardStatsProps) {
    return (
        <div className="stats shadow w-full bg-base-100 border border-base-300">
            <div className="stat">
                <div className="stat-figure text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div className="stat-title">Total de Projetos</div>
                <div className="stat-value text-primary">{totalProjetos}</div>
                <div className="stat-desc">Todos os projetos cadastrados</div>
            </div>

            <div className="stat">
                <div className="stat-figure text-secondary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                    </svg>
                </div>
                <div className="stat-title">Projetos Ativos</div>
                <div className="stat-value text-secondary">{projetosAtivos}</div>
                <div className="stat-desc">Em andamento</div>
            </div>

            <div className="stat">
                <div className="stat-figure text-success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <div className="stat-title">Projetos Concluídos</div>
                <div className="stat-value text-success">{projetosConcluidos}</div>
                <div className="stat-desc">Finalizados com sucesso</div>
            </div>

            <div className="stat">
                <div className="stat-figure text-info">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                    </svg>
                </div>
                <div className="stat-title">Valor Total</div>
                <div className="stat-value text-info text-lg lg:text-2xl">
                    {formatCurrency(valorTotalProjetos)}
                </div>
                <div className="stat-desc">Valor total dos projetos</div>
            </div>
        </div>
    );
}
