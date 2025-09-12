import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate, getProjectStatus } from "@/lib/utils";
import { ProjetoWithStats } from "@/types";

interface ProjectCarouselProps {
    readonly projects: ProjetoWithStats[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
                <p className="text-base-content/70">Comece criando seu primeiro projeto</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-base-content">Projetos</h2>
                    <p className="text-base-content/70">Gerencie e acompanhe seus projetos</p>
                </div>
                <button className="btn btn-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Novo Projeto
                </button>
            </div>

            <div className="carousel carousel-center space-x-4 p-4 bg-transparent">
                {projects.map(projeto => {
                    const status = getProjectStatus(projeto.situacao);

                    return (
                        <div key={projeto.codprojeto} className="carousel-item">
                            <Card className="w-80 bg-base-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="line-clamp-2 min-h-[3rem]">
                                                {projeto.nome}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                Projeto #{projeto.codprojeto}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={status.variant} size="sm">
                                            {status.label}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex justify-between items-center text-sm mb-1">
                                                <span>Progresso</span>
                                                <span className="font-medium">
                                                    {projeto.progresso}%
                                                </span>
                                            </div>
                                            <progress
                                                className="progress progress-primary w-full"
                                                value={projeto.progresso}
                                                max="100"
                                            />
                                        </div>

                                        {/* Project Info */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-base-content/70">
                                                    Início:
                                                </span>
                                                <p className="font-medium">
                                                    {formatDate(projeto.datainicio)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-base-content/70">Fim:</span>
                                                <p className="font-medium">
                                                    {formatDate(projeto.dataencerramento)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-base-content/70">Valor:</span>
                                                <p className="font-medium text-success">
                                                    {formatCurrency(projeto.valor)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-base-content/70">
                                                    Contratos:
                                                </span>
                                                <p className="font-medium">
                                                    {projeto.totalContratos}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between items-center text-xs bg-base-200 rounded-lg p-2">
                                            <div className="text-center">
                                                <div className="font-bold text-primary">
                                                    {projeto.totalRequisicoes}
                                                </div>
                                                <div className="text-base-content/70">
                                                    Requisições
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-secondary">
                                                    {projeto.totalOrdens}
                                                </div>
                                                <div className="text-base-content/70">Ordens</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-accent">
                                                    {formatCurrency(projeto.valorTotalContratos)}
                                                </div>
                                                <div className="text-base-content/70">
                                                    Contratos
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <div className="flex w-full gap-2">
                                        <button className="btn btn-sm btn-outline flex-1">
                                            Ver Detalhes
                                        </button>
                                        <button className="btn btn-sm btn-primary flex-1">
                                            Gerenciar
                                        </button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(projects.length / 3) }, (_, i) => (
                    <button
                        key={i}
                        className="w-2 h-2 rounded-full bg-base-300 hover:bg-primary transition-colors"
                        aria-label={`Ir para página ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
