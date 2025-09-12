import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Types
interface Cliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    documento: string; // CPF/CNPJ
    tipo: "pessoa_fisica" | "pessoa_juridica";
    endereco?: {
        cep: string;
        logradouro: string;
        numero: string;
        cidade: string;
        estado: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Validation Schema
const clienteSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    telefone: z.string().min(10),
    documento: z.string().min(11),
    tipo: z.enum(["pessoa_fisica", "pessoa_juridica"]),
    endereco: z
        .object({
            cep: z.string().length(8),
            logradouro: z.string(),
            numero: z.string(),
            cidade: z.string(),
            estado: z.string().length(2),
        })
        .optional(),
});

// Mock database - simplified
let clientes: Cliente[] = [
    {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(11) 99999-9999",
        documento: "123.456.789-00",
        tipo: "pessoa_fisica",
        endereco: {
            cep: "01234567",
            logradouro: "Rua das Flores",
            numero: "123",
            cidade: "São Paulo",
            estado: "SP",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        telefone: "(11) 88888-8888",
        documento: "987.654.321-00",
        tipo: "pessoa_fisica",
        endereco: {
            cep: "09876543",
            logradouro: "Av. Principal",
            numero: "456",
            cidade: "São Paulo",
            estado: "SP",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// GET - Listar clientes ou obter cliente por ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clienteId = searchParams.get("id");

        if (clienteId) {
            const cliente = clientes.find(c => c.id === clienteId);
            if (!cliente) {
                return NextResponse.json(
                    { success: false, message: "Cliente not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: cliente });
        }

        // Retornar todos os clientes
        return NextResponse.json({
            success: true,
            data: clientes,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch clientes" },
            { status: 500 }
        );
    }
}

// POST - Criar cliente
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = clienteSchema.parse(body);

        const cliente: Cliente = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        clientes.push(cliente);

        return NextResponse.json({ success: true, data: cliente }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to create cliente" },
            { status: 500 }
        );
    }
}

// PUT - Atualizar cliente
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clienteId = searchParams.get("id");

        if (!clienteId) {
            return NextResponse.json(
                { success: false, message: "Cliente ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const data = clienteSchema.partial().parse(body);

        const index = clientes.findIndex(c => c.id === clienteId);
        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Cliente not found" },
                { status: 404 }
            );
        }

        clientes[index] = {
            ...clientes[index],
            ...data,
            updatedAt: new Date(),
        };

        return NextResponse.json({ success: true, data: clientes[index] });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Validation error", errors: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update cliente" },
            { status: 500 }
        );
    }
}

// DELETE - Deletar cliente
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clienteId = searchParams.get("id");

        if (!clienteId) {
            return NextResponse.json(
                { success: false, message: "Cliente ID is required" },
                { status: 400 }
            );
        }

        const index = clientes.findIndex(c => c.id === clienteId);
        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "Cliente not found" },
                { status: 404 }
            );
        }

        clientes.splice(index, 1);

        return NextResponse.json({
            success: true,
            message: "Cliente deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete cliente" },
            { status: 500 }
        );
    }
}
