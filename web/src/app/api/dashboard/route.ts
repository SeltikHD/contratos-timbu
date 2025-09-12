import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Mock dashboard stats
        const stats = {
            clientes: { total: 2 },
            prestadores: { total: 2, disponiveis: 2 },
            projetos: { total: 2, ativos: 1 },
            requisicoes: { total: 2, abertas: 1 },
        };

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
