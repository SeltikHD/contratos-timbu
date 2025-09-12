import { contrato, ordem, projetos, requisicao } from "@/db/schema";
import { db } from "@/lib/db";
import { calculateProjectProgress } from "@/lib/utils";
import { Projeto, ProjetoWithStats } from "@/types";
import { eq, sql } from "drizzle-orm";

export async function getProjects(): Promise<ProjetoWithStats[]> {
    try {
        const result = await db
            .select({
                // Dados do projeto
                codprojeto: projetos.codprojeto,
                nome: projetos.nome,
                datainicio: projetos.datainicio,
                dataencerramento: projetos.dataencerramento,
                valor: projetos.valor,
                situacao: projetos.situacao,
                // Estatísticas agregadas
                totalRequisicoes: sql<number>`COALESCE(COUNT(DISTINCT ${requisicao.codrequisicao}), 0)`,
                totalOrdens: sql<number>`COALESCE(COUNT(DISTINCT ${ordem.codordem}), 0)`,
                totalContratos: sql<number>`COALESCE(COUNT(DISTINCT ${contrato.numcontrato}), 0)`,
                valorTotalContratos: sql<string>`COALESCE(SUM(DISTINCT ${contrato.valor}), 0)`,
            })
            .from(projetos)
            .leftJoin(requisicao, eq(projetos.codprojeto, requisicao.codprojeto))
            .leftJoin(ordem, eq(requisicao.codrequisicao, ordem.codrequisicao))
            .leftJoin(contrato, eq(ordem.codordem, contrato.codordem))
            .groupBy(
                projetos.codprojeto,
                projetos.nome,
                projetos.datainicio,
                projetos.dataencerramento,
                projetos.valor,
                projetos.situacao
            )
            .orderBy(projetos.datainicio);

        return result.map(projeto => ({
            ...projeto,
            progresso: calculateProjectProgress(projeto.datainicio, projeto.dataencerramento),
        }));
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        return [];
    }
}

export async function getProjectById(id: number): Promise<Projeto | null> {
    try {
        const result = await db.select().from(projetos).where(eq(projetos.codprojeto, id)).limit(1);

        return result[0] || null;
    } catch (error) {
        console.error("Erro ao buscar projeto por ID:", error);
        return null;
    }
}

export async function getProjectsStats() {
    try {
        const stats = await db
            .select({
                totalProjetos: sql<number>`COUNT(*)`,
                projetosAtivos: sql<number>`SUM(CASE WHEN ${projetos.situacao} = '2' THEN 1 ELSE 0 END)`,
                projetosConcluidos: sql<number>`SUM(CASE WHEN ${projetos.situacao} = '5' THEN 1 ELSE 0 END)`,
                valorTotalProjetos: sql<string>`SUM(${projetos.valor})`,
            })
            .from(projetos);

        return (
            stats[0] || {
                totalProjetos: 0,
                projetosAtivos: 0,
                projetosConcluidos: 0,
                valorTotalProjetos: "0",
            }
        );
    } catch (error) {
        console.error("Erro ao buscar estatísticas dos projetos:", error);
        return {
            totalProjetos: 0,
            projetosAtivos: 0,
            projetosConcluidos: 0,
            valorTotalProjetos: "0",
        };
    }
}
