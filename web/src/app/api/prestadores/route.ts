import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Types
interface Prestador {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    documento: string; // CPF/CNPJ
    especialidade: string;
    valorHora?: number;
    disponivel: boolean;
    avaliacao?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Validation Schema
const prestadorSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    telefone: z.string().min(10),
    documento: z.string().min(11),
    especialidade: z.string().min(2),
    valorHora: z.number().positive().optional(),
    disponivel: z.boolean().default(true),
});

// Mock database - simplified
let prestadores: Prestador[] = [
    {
        id: "1",
        nome: "Carlos Developer",
        email: "carlos@dev.com",
        telefone: "(11) 77777-7777",
        documento: "111.222.333-44",
        especialidade: "Desenvolvimento Web",
        valorHora: 120,
        disponivel: true,
        avaliacao: 4.8,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        nome: "Ana Designer",
        email: "ana@design.com",
        telefone: "(11) 66666-6666",
        documento: "555.666.777-88",
        especialidade: "UI/UX Design",
        valorHora: 100,
        disponivel: true,
        avaliacao: 4.9,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// GET - Listar prestadores com filtros ou obter prestador por ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const prestadorId = searchParams.get("id");
        const disponivel = searchParams.get("disponivel");
        const especialidade = searchParams.get("especialidade");

        if (prestadorId) {
            const prestador = prestadores.find(p => p.id === prestadorId);
            if (!prestador) {
                return NextResponse.json(
                    { success: false, message: "Prestador not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: prestador });
        }

        // Filtrar prestadores
        let filteredPrestadores = prestadores;

        if (disponivel !== null) {
            const isDisponivel = disponivel === "true";
            filteredPrestadores = filteredPrestadores.filter(p => p.disponivel === isDisponivel);
        }

        if (especialidade) {
            filteredPrestadores = filteredPrestadores.filter(p =>
                p.especialidade.toLowerCase().includes(especialidade.toLowerCase())
            );
        }

        return NextResponse.json({
            success: true,
            data: filteredPrestadores,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch prestadores" },
            { status: 500 }
        );
    }
}

// POST - Criar prestador
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = prestadorSchema.parse(body);

        const prestador: Prestador = {
            id: Date.now().toString(),
            ...data,
            avaliacao: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        prestadores.push(prestador);

        return NextResponse.json({ success: true, data: prestador }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create prestador" },
            { status: 500 }
        );
    }
}

// PUT - Atualizar prestador ou avaliação
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const prestadorId = searchParams.get("id");
        const action = searchParams.get("action");

        if (!prestadorId) {
            return NextResponse.json(
                { success: false, message: "Prestador ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const index = prestadores.findIndex(p => p.id === prestadorId);
        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Prestador not found" },
                { status: 404 }
            );
        }

        if (action === "avaliacao") {
            // Atualizar apenas a avaliação
            const { avaliacao } = body;
            if (typeof avaliacao !== "number" || avaliacao < 0 || avaliacao > 5) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Avaliação deve ser um número entre 0 e 5",
                    },
                    { status: 400 }
                );
            }

            prestadores[index].avaliacao = avaliacao;
            prestadores[index].updatedAt = new Date();
        } else {
            // Atualizar dados do prestador
            const data = prestadorSchema.partial().parse(body);
            prestadores[index] = {
                ...prestadores[index],
                ...data,
                updatedAt: new Date(),
            };
        }

        return NextResponse.json({ success: true, data: prestadores[index] });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update prestador" },
            { status: 500 }
        );
    }
}

// DELETE - Deletar prestador
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const prestadorId = searchParams.get("id");

        if (!prestadorId) {
            return NextResponse.json(
                { success: false, message: "Prestador ID is required" },
                { status: 400 }
            );
        }

        const index = prestadores.findIndex(p => p.id === prestadorId);
        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Prestador not found" },
                { status: 404 }
            );
        }

        prestadores.splice(index, 1);

        return NextResponse.json({
            success: true,
            message: "Prestador deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete prestador" },
            { status: 500 }
        );
    }
}
