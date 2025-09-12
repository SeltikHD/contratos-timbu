import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numValue);
}

export function formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(dateObj);
}

export function getProjectStatus(situacao: string): {
    label: string;
    variant:
        | "default"
        | "primary"
        | "secondary"
        | "accent"
        | "info"
        | "success"
        | "warning"
        | "error";
} {
    const statusMap = {
        "1": { label: "Planejamento", variant: "info" as const },
        "2": { label: "Em Andamento", variant: "primary" as const },
        "3": { label: "Suspenso", variant: "warning" as const },
        "4": { label: "Cancelado", variant: "error" as const },
        "5": { label: "Concluído", variant: "success" as const },
        "6": { label: "Arquivado", variant: "secondary" as const },
    };

    return (
        statusMap[situacao as keyof typeof statusMap] || {
            label: "Desconhecido",
            variant: "default",
        }
    );
}

export function calculateProjectProgress(
    dataInicio: string | Date,
    dataEncerramento: string | Date
): number {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataEncerramento);
    const hoje = new Date();

    const totalDias = fim.getTime() - inicio.getTime();
    const diasDecorridos = hoje.getTime() - inicio.getTime();

    if (diasDecorridos < 0) return 0;
    if (diasDecorridos > totalDias) return 100;

    return Math.round((diasDecorridos / totalDias) * 100);
}
