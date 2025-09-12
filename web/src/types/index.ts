export interface Projeto {
    codprojeto: number;
    nome: string;
    datainicio: string;
    dataencerramento: string;
    valor: string;
    situacao: string;
}

export interface Requisicao {
    codrequisicao: number;
    codprojeto: number;
    descricao: string;
    datasolicitacao: string;
    datalimite: string;
    valor: string;
    situacao: string;
}

export interface Ordem {
    codordem: number;
    codrequisicao: number;
    descricao: string;
    datasolicitacao: string;
    datalimite: string;
    valor: string;
    situacao: string;
}

export interface Contrato {
    numcontrato: string;
    codordem: number;
    descricao: string;
    cpfcnpj: string;
    contratado: string;
    tipopessoa: number;
    datainicio: string;
    datafim: string;
    valor: string;
    parcelas: number;
    dataparcelainicial: string;
    situacao: string;
}

export interface ProjetoWithStats extends Projeto {
    totalRequisicoes: number;
    totalOrdens: number;
    totalContratos: number;
    valorTotalContratos: string;
    progresso: number;
}

// Tipos de Autenticação
export interface User {
    id: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | null;
    image?: string | null;
    role: "USER" | "ADMIN";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Profile {
    id: string;
    userId: string;
    bio?: string | null;
    company?: string | null;
    location?: string | null;
    website?: string | null;
    phone?: string | null;
    birthDate?: string | null;
    linkedin?: string | null;
    github?: string | null;
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserProject {
    id: number;
    userId: string;
    codProjeto: number;
    role: "VIEWER" | "EDITOR" | "MANAGER" | "OWNER";
    permissions?: string[] | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ActivityLog {
    id: number;
    userId: string;
    action: string;
    resource?: string | null;
    resourceId?: string | null;
    description?: string | null;
    metadata?: any;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date;
}
