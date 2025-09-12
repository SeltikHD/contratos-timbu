"use client";

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
import { useCallback, useEffect, useRef, useState } from "react";

interface ProjectCarouselProps {
    readonly projects: ProjetoWithStats[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const carouselRef = useRef<HTMLDivElement>(null);
    const totalSlides = Math.ceil(projects.length / itemsPerView);
    // Função para calcular quantos itens mostrar baseado no tamanho da tela
    const updateItemsPerView = useCallback(() => {
        const width = window.innerWidth;
        if (width >= 1280) {
            setItemsPerView(3); // XL screens - 3 cards
        } else if (width >= 1024) {
            setItemsPerView(2); // LG screens - 2 cards
        } else if (width >= 640) {
            setItemsPerView(2); // SM screens - 2 cards (smaller)
        } else {
            setItemsPerView(1); // XS screens - 1 card
        }
    }, []);

    // Effect para detectar mudanças no tamanho da tela
    useEffect(() => {
        updateItemsPerView();
        const handleResize = () => updateItemsPerView();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [updateItemsPerView]);

    // Navegação do carrossel
    const goToSlide = (index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    // Função para prevenir comportamento padrão dos botões
    const handleNavigation = (action: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        // Previne scroll e blur
        event.currentTarget.blur();
        // Executa a ação
        action();
        // Força o foco a permanecer no lugar
        setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }, 0);
    };

    // Navegação por teclado
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                prevSlide();
            } else if (event.key === "ArrowRight") {
                nextSlide();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Auto-scroll do carrossel
    useEffect(() => {
        if (projects.length <= itemsPerView) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Muda a cada 5 segundos

        return () => clearInterval(interval);
    }, [currentIndex, itemsPerView, projects.length]);

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

            {/* Carrossel Container */}
            <div className="relative">
                {/* Botões de navegação */}
                {projects.length > itemsPerView && (
                    <>
                        <button
                            type="button"
                            onClick={handleNavigation(prevSlide)}
                            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 btn btn-sm sm:btn-md btn-circle btn-outline bg-base-100/80 backdrop-blur-sm hover:bg-primary hover:text-primary-content border-base-300 shadow-lg no-animation focus:scale-100 active:scale-100"
                            style={{ 
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                touchAction: 'manipulation',
                                outline: 'none',
                                boxShadow: 'none'
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onFocus={(e) => e.preventDefault()}
                            tabIndex={-1}
                            aria-label="Projeto anterior"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleNavigation(nextSlide)}
                            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 btn btn-sm sm:btn-md btn-circle btn-outline bg-base-100/80 backdrop-blur-sm hover:bg-primary hover:text-primary-content border-base-300 shadow-lg no-animation focus:scale-100 active:scale-100"
                            style={{ 
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                touchAction: 'manipulation',
                                outline: 'none',
                                boxShadow: 'none'
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onFocus={(e) => e.preventDefault()}
                            tabIndex={-1}
                            aria-label="Próximo projeto"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>
                    </>
                )}

                {/* Carrossel */}
                <div 
                    ref={carouselRef}
                    className="overflow-hidden rounded-lg"
                >
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`,
                            width: `${totalSlides * 100}%`,
                        }}
                    >
                        {Array.from({ length: totalSlides }, (_, slideIndex) => (
                            <div
                                key={slideIndex}
                                className="flex-shrink-0"
                                style={{ width: `${100 / totalSlides}%` }}
                            >
                                <div className={`grid gap-2 sm:gap-3 lg:gap-4 p-1 sm:p-2 ${
                                    itemsPerView === 3 ? 'grid-cols-3' : 
                                    itemsPerView === 2 ? 'grid-cols-2' : 
                                    'grid-cols-1'
                                }`}>
                                    {projects
                                        .slice(
                                            slideIndex * itemsPerView,
                                            (slideIndex + 1) * itemsPerView
                                        )
                                        .map((projeto) => {
                                            const status = getProjectStatus(projeto.situacao);

                                            return (
                                                <Card 
                                                    key={projeto.codprojeto} 
                                                    className="bg-base-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full"
                                                >
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <CardTitle className="line-clamp-2 min-h-[3rem] text-base lg:text-lg">
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
                                            );
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Indicadores de navegação */}
            {projects.length > itemsPerView && (
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalSlides }, (_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={handleNavigation(() => goToSlide(i))}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                i === currentIndex
                                    ? "bg-primary scale-125 shadow-lg"
                                    : "bg-base-300 hover:bg-base-content/30"
                            }`}
                            style={{ 
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                touchAction: 'manipulation'
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            aria-label={`Ir para slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Contador de projetos */}
            <div className="flex justify-between items-center mt-4 text-sm text-base-content/70">
                <span>
                    {projects.length} projeto{projects.length !== 1 ? "s" : ""} encontrado{projects.length !== 1 ? "s" : ""}
                </span>
                {projects.length > itemsPerView && (
                    <span>
                        Slide {currentIndex + 1} de {totalSlides}
                    </span>
                )}
            </div>
        </div>
    );
}
