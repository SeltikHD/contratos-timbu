import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory data for demonstration
const notificacoes = [
    {
        id: "1",
        titulo: "Novo projeto criado",
        mensagem: "O projeto 'Website Corporativo' foi criado com sucesso",
        tipo: "info",
        lida: false,
        dataEnvio: new Date().toISOString(),
    },
    {
        id: "2",
        titulo: "Pagamento recebido",
        mensagem: "Pagamento de R$ 5.000,00 foi recebido",
        tipo: "success",
        lida: true,
        dataEnvio: new Date(Date.now() - 86400000).toISOString(),
    },
];

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: notificacoes,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch notificações" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { titulo, mensagem, tipo } = await request.json();

        if (!titulo || !mensagem) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const notificacao = {
            id: Date.now().toString(),
            titulo,
            mensagem,
            tipo: tipo || "info",
            lida: false,
            dataEnvio: new Date().toISOString(),
        };

        notificacoes.push(notificacao);

        return NextResponse.json({ success: true, data: notificacao }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to create notificação" },
            { status: 500 }
        );
    }
}
