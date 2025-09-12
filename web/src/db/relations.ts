import { relations } from "drizzle-orm/relations";
import { contrato, itensContrato, itensOrdem, ordem, projetos, requisicao } from "./schema";

export const requisicaoRelations = relations(requisicao, ({ one, many }) => ({
    projeto: one(projetos, {
        fields: [requisicao.codprojeto],
        references: [projetos.codprojeto],
    }),
    ordems: many(ordem),
}));

export const projetosRelations = relations(projetos, ({ many }) => ({
    requisicaos: many(requisicao),
}));

export const ordemRelations = relations(ordem, ({ one, many }) => ({
    requisicao: one(requisicao, {
        fields: [ordem.codrequisicao],
        references: [requisicao.codrequisicao],
    }),
    contratoes: many(contrato),
    itensOrdems: many(itensOrdem),
}));

export const contratoRelations = relations(contrato, ({ one, many }) => ({
    ordem: one(ordem, {
        fields: [contrato.codordem],
        references: [ordem.codordem],
    }),
    itensContratoes: many(itensContrato),
}));

export const itensOrdemRelations = relations(itensOrdem, ({ one }) => ({
    ordem: one(ordem, {
        fields: [itensOrdem.codordem],
        references: [ordem.codordem],
    }),
}));

export const itensContratoRelations = relations(itensContrato, ({ one }) => ({
    contrato: one(contrato, {
        fields: [itensContrato.numcontrato],
        references: [contrato.numcontrato],
    }),
}));
