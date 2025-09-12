import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Types
interface Projeto {
    id: string;
    nome: string;
    descricao: string;
    clienteId: string;
    requisicoes: string[]; // Array de IDs das requisições
    status: "planejamento" | "ativo" | "pausado" | "concluido" | "cancelado";
    dataInicio: Date;
    dataFim?: Date;
    orcamento?: number;
    valorGasto?: number;
    progresso: number; // 0-100%
    createdAt: Date;
    updatedAt: Date;
}

// Validation Schema
const projetoSchema = z.object({
    nome: z.string().min(3),
    descricao: z.string().min(10),
    clienteId: z.string(),
    requisicoes: z.array(z.string()).default([]),
    status: z
        .enum(["planejamento", "ativo", "pausado", "concluido", "cancelado"])
        .default("planejamento"),
    dataInicio: z.string().datetime(),
    dataFim: z.string().datetime().optional(),
    orcamento: z.number().positive().optional(),
    valorGasto: z.number().min(0).optional(),
    progresso: z.number().min(0).max(100).default(0),
});

// Mock database - simplified
let projetos: Projeto[] = [
    {
        id: "1",
        nome: "Website Corporativo",
        descricao: "Desenvolvimento de website institucional moderno",
        clienteId: "1",
        requisicoes: ["1"],
        status: "ativo",
        dataInicio: new Date(),
        orcamento: 15000,
        valorGasto: 5000,
        progresso: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        nome: "App Mobile E-commerce",
        descricao: "Aplicativo mobile para vendas online",
        clienteId: "2",
        requisicoes: ["2"],
        status: "planejamento",
        dataInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        orcamento: 25000,
        valorGasto: 0,
        progresso: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// GET - Listar projetos com filtros ou obter projeto por ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projetoId = searchParams.get("id");
        const status = searchParams.get("status");
        const clienteId = searchParams.get("clienteId");

        if (projetoId) {
            const projeto = projetos.find(p => p.id === projetoId);
            if (!projeto) {
                return NextResponse.json(
                    { success: false, message: "Projeto not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: projeto });
        }

        // Filtrar projetos
        let filteredProjetos = projetos;

        if (status) {
            filteredProjetos = filteredProjetos.filter(p => p.status === status);
        }

        if (clienteId) {
            filteredProjetos = filteredProjetos.filter(p => p.clienteId === clienteId);
        }

        return NextResponse.json({
            success: true,
            data: filteredProjetos,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch projetos" },
            { status: 500 }
        );
    }
}

// POST - Criar projeto ou executar ações específicas
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");
        const projetoId = searchParams.get("id");

        if (action === "add-requisicao" && projetoId) {
            // Adicionar requisição ao projeto
            const { requisicaoId } = await request.json();

            const projeto = projetos.find(p => p.id === projetoId);
            if (!projeto) {
                return NextResponse.json(
                    { success: false, message: "Projeto not found" },
                    { status: 404 }
                );
            }

            if (!projeto.requisicoes.includes(requisicaoId)) {
                projeto.requisicoes.push(requisicaoId);
                projeto.updatedAt = new Date();
            }

            return NextResponse.json({ success: true, data: projeto });
        }

        // Criar projeto
        const body = await request.json();
        const data = projetoSchema.parse(body);

        const projeto: Projeto = {
            id: Date.now().toString(),
            ...data,
            dataInicio: new Date(data.dataInicio),
            dataFim: data.dataFim ? new Date(data.dataFim) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        projetos.push(projeto);

        return NextResponse.json({ success: true, data: projeto }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create projeto" },
            { status: 500 }
        );
    }
}

// PUT - Atualizar projeto
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projetoId = searchParams.get("id");
        const action = searchParams.get("action");

        if (!projetoId) {
            return NextResponse.json(
                { success: false, message: "Projeto ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const index = projetos.findIndex(p => p.id === projetoId);

        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Projeto not found" },
                { status: 404 }
            );
        }

        if (action === "status") {
            // Atualizar apenas o status
            const { status } = body;
            projetos[index].status = status;
            if (status === "concluido") {
                projetos[index].dataFim = new Date();
                projetos[index].progresso = 100;
            }
            projetos[index].updatedAt = new Date();
        } else if (action === "progresso") {
            // Atualizar apenas o progresso
            const { progresso } = body;
            if (typeof progresso !== "number" || progresso < 0 || progresso > 100) {
                return NextResponse.json(
                    { success: false, message: "Progresso deve ser entre 0 e 100" },
                    { status: 400 }
                );
            }
            projetos[index].progresso = progresso;
            projetos[index].updatedAt = new Date();
        } else {
            // Atualizar dados do projeto
            const data = projetoSchema.partial().parse(body);
            projetos[index] = {
                ...projetos[index],
                ...data,
                dataInicio: data.dataInicio
                    ? new Date(data.dataInicio)
                    : projetos[index].dataInicio,
                dataFim: data.dataFim ? new Date(data.dataFim) : projetos[index].dataFim,
                updatedAt: new Date(),
            };
        }

        return NextResponse.json({ success: true, data: projetos[index] });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update projeto" },
            { status: 500 }
        );
    }
}

// DELETE - Deletar projeto
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projetoId = searchParams.get("id");

        if (!projetoId) {
            return NextResponse.json(
                { success: false, message: "Projeto ID is required" },
                { status: 400 }
            );
        }

        const index = projetos.findIndex(p => p.id === projetoId);
        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Projeto not found" },
                { status: 404 }
            );
        }

        projetos.splice(index, 1);

        return NextResponse.json({
            success: true,
            message: "Projeto deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete projeto" },
            { status: 500 }
        );
    }
}
