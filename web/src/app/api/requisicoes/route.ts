import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Types
interface Requisicao {
    id: string;
    titulo: string;
    descricao: string;
    clienteId: string;
    prestadorId?: string;
    categoria: string;
    prioridade: "baixa" | "media" | "alta" | "urgente";
    status: "aberta" | "em_andamento" | "concluida" | "cancelada";
    dataInicio?: Date;
    dataFim?: Date;
    valorEstimado?: number;
    valorFinal?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Validation Schema
const requisicaoSchema = z.object({
    titulo: z.string().min(3),
    descricao: z.string().min(10),
    clienteId: z.string(),
    prestadorId: z.string().optional(),
    categoria: z.string().min(2),
    prioridade: z.enum(["baixa", "media", "alta", "urgente"]).default("media"),
    status: z.enum(["aberta", "em_andamento", "concluida", "cancelada"]).default("aberta"),
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    valorEstimado: z.number().positive().optional(),
    valorFinal: z.number().positive().optional(),
});

// Mock database - simplified
let requisicoes: Requisicao[] = [
    {
        id: "1",
        titulo: "Desenvolvimento Frontend",
        descricao: "Criar interface responsiva para o website corporativo",
        clienteId: "1",
        prestadorId: "1",
        categoria: "Desenvolvimento Web",
        prioridade: "alta",
        status: "em_andamento",
        dataInicio: new Date(),
        valorEstimado: 8000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        titulo: "Design UI/UX",
        descricao: "Criar protótipos e interfaces para aplicativo mobile",
        clienteId: "2",
        categoria: "Design",
        prioridade: "media",
        status: "aberta",
        valorEstimado: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// GET - Listar requisições com filtros ou obter requisição por ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requisicaoId = searchParams.get("id");
        const status = searchParams.get("status");
        const prioridade = searchParams.get("prioridade");
        const clienteId = searchParams.get("clienteId");
        const prestadorId = searchParams.get("prestadorId");

        if (requisicaoId) {
            const requisicao = requisicoes.find(r => r.id === requisicaoId);
            if (!requisicao) {
                return NextResponse.json(
                    { success: false, message: "Requisição not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: requisicao });
        }

        // Filtrar requisições
        let filteredRequisicoes = requisicoes;

        if (status) {
            filteredRequisicoes = filteredRequisicoes.filter(r => r.status === status);
        }

        if (prioridade) {
            filteredRequisicoes = filteredRequisicoes.filter(r => r.prioridade === prioridade);
        }

        if (clienteId) {
            filteredRequisicoes = filteredRequisicoes.filter(r => r.clienteId === clienteId);
        }

        if (prestadorId) {
            filteredRequisicoes = filteredRequisicoes.filter(r => r.prestadorId === prestadorId);
        }

        return NextResponse.json({
            success: true,
            data: filteredRequisicoes,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch requisições" },
            { status: 500 }
        );
    }
}

// POST - Criar requisição
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = requisicaoSchema.parse(body);

        const requisicao: Requisicao = {
            id: Date.now().toString(),
            ...data,
            dataInicio: data.dataInicio ? new Date(data.dataInicio) : undefined,
            dataFim: data.dataFim ? new Date(data.dataFim) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        requisicoes.push(requisicao);

        return NextResponse.json({ success: true, data: requisicao }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create requisição" },
            { status: 500 }
        );
    }
}

// PUT - Atualizar requisição
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requisicaoId = searchParams.get("id");
        const action = searchParams.get("action");

        if (!requisicaoId) {
            return NextResponse.json(
                { success: false, message: "Requisição ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const index = requisicoes.findIndex(r => r.id === requisicaoId);

        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Requisição not found" },
                { status: 404 }
            );
        }

        if (action === "assign-prestador") {
            // Atribuir prestador à requisição
            const { prestadorId } = body;
            requisicoes[index].prestadorId = prestadorId;
            requisicoes[index].status = "em_andamento";
            requisicoes[index].updatedAt = new Date();
        } else if (action === "status") {
            // Atualizar apenas o status
            const { status } = body;
            requisicoes[index].status = status;
            if (status === "concluida") {
                requisicoes[index].dataFim = new Date();
            }
            requisicoes[index].updatedAt = new Date();
        } else {
            // Atualizar dados da requisição
            const data = requisicaoSchema.partial().parse(body);
            requisicoes[index] = {
                ...requisicoes[index],
                ...data,
                dataInicio: data.dataInicio
                    ? new Date(data.dataInicio)
                    : requisicoes[index].dataInicio,
                dataFim: data.dataFim ? new Date(data.dataFim) : requisicoes[index].dataFim,
                updatedAt: new Date(),
            };
        }

        return NextResponse.json({ success: true, data: requisicoes[index] });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update requisição" },
            { status: 500 }
        );
    }
}

// DELETE - Deletar requisição
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requisicaoId = searchParams.get("id");

        if (!requisicaoId) {
            return NextResponse.json(
                { success: false, message: "Requisição ID is required" },
                { status: 400 }
            );
        }

        const index = requisicoes.findIndex(r => r.id === requisicaoId);
        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Requisição not found" },
                { status: 404 }
            );
        }

        requisicoes.splice(index, 1);

        return NextResponse.json({
            success: true,
            message: "Requisição deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete requisição" },
            { status: 500 }
        );
    }
}
