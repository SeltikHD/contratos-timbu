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
