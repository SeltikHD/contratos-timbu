import { pgTable, check, integer, varchar, date, numeric, index, foreignKey, unique, char, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const projetos = pgTable("projetos", {
	codprojeto: integer().primaryKey().notNull(),
	nome: varchar({ length: 200 }).notNull(),
	datainicio: date().notNull(),
	dataencerramento: date().notNull(),
	valor: numeric({ precision: 14, scale:  2 }).notNull(),
	situacao: varchar({ length: 20 }).notNull(),
}, (table) => [
	check("projetos_situacao_check", sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying, '5'::character varying, '6'::character varying])::text[])`),
	check("chk_projetos_periodo", sql`dataencerramento >= datainicio`),
]);

export const requisicao = pgTable("requisicao", {
	codrequisicao: integer().primaryKey().notNull(),
	codprojeto: integer().notNull(),
	descricao: varchar({ length: 500 }).notNull(),
	datasolicitacao: date().notNull(),
	datalimite: date().notNull(),
	valor: numeric({ precision: 14, scale:  2 }).notNull(),
	situacao: varchar({ length: 20 }).notNull(),
}, (table) => [
	index("idx_requisicao_codprojeto").using("btree", table.codprojeto.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.codprojeto],
			foreignColumns: [projetos.codprojeto],
			name: "fk_requisicao_projeto"
		}).onUpdate("cascade").onDelete("restrict"),
	check("requisicao_situacao_check", sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying, '5'::character varying])::text[])`),
	check("chk_requisicao_prazo", sql`datalimite >= datasolicitacao`),
]);

export const ordem = pgTable("ordem", {
	codordem: integer().primaryKey().notNull(),
	codrequisicao: integer().notNull(),
	descricao: varchar({ length: 500 }).notNull(),
	datasolicitacao: date().notNull(),
	datalimite: date().notNull(),
	valor: numeric({ precision: 14, scale:  2 }).notNull(),
	situacao: varchar({ length: 20 }).notNull(),
}, (table) => [
	index("idx_ordem_codrequisicao").using("btree", table.codrequisicao.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.codrequisicao],
			foreignColumns: [requisicao.codrequisicao],
			name: "fk_ordem_requisicao"
		}).onUpdate("cascade").onDelete("restrict"),
	check("ordem_situacao_check", sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying])::text[])`),
	check("chk_ordem_prazo", sql`datalimite >= datasolicitacao`),
]);

export const contrato = pgTable("contrato", {
	numcontrato: varchar({ length: 10 }).primaryKey().notNull(),
	codordem: integer().notNull(),
	descricao: varchar({ length: 500 }).notNull(),
	cpfcnpj: char({ length: 14 }).notNull(),
	contratado: varchar({ length: 150 }).notNull(),
	tipopessoa: integer().notNull(),
	datainicio: date().notNull(),
	datafim: date().notNull(),
	valor: numeric({ precision: 14, scale:  2 }).notNull(),
	parcelas: integer().notNull(),
	dataparcelainicial: date().notNull(),
	situacao: varchar({ length: 20 }).notNull(),
}, (table) => [
	index("idx_contrato_codordem").using("btree", table.codordem.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.codordem],
			foreignColumns: [ordem.codordem],
			name: "fk_contrato_ordem"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("contrato_codordem_key").on(table.codordem),
	check("contrato_cpfcnpj_check", sql`cpfcnpj ~ '^[0-9]{14}$'::text`),
	check("contrato_tipopessoa_check", sql`tipopessoa = ANY (ARRAY[1, 2])`),
	check("contrato_situacao_check", sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying])::text[])`),
	check("contrato_num_formato", sql`(numcontrato)::text ~ '^[0-9]{4}/[0-9]{4}$'::text`),
]);

export const itensOrdem = pgTable("itens_ordem", {
	codordem: integer().notNull(),
	coditem: integer().notNull(),
	descricao: varchar({ length: 500 }).notNull(),
	datasolicitacao: date().notNull(),
	datalimite: date().notNull(),
	valor: numeric({ precision: 14, scale:  2 }).notNull(),
	datarecebido: date(),
	situacao: varchar({ length: 20 }).notNull(),
}, (table) => [
	index("idx_itens_ordem_situacao").using("btree", table.situacao.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.codordem],
			foreignColumns: [ordem.codordem],
			name: "fk_itens_ordem_ordem"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.codordem, table.coditem], name: "pk_itens_ordem"}),
	check("itens_ordem_situacao_check", sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying])::text[])`),
	check("chk_itens_ordem_prazo", sql`datalimite >= datasolicitacao`),
]);

export const itensContrato = pgTable("itens_contrato", {
	numcontrato: varchar({ length: 10 }).notNull(),
	codlancamento: integer().notNull(),
	datalancamento: date().notNull(),
	numparcela: integer().notNull(),
	valorparcela: numeric({ precision: 14, scale:  2 }).notNull(),
	datavencimento: date().notNull(),
	valorpago: numeric({ precision: 14, scale:  2 }).default('0').notNull(),
	datapagamento: date(),
	situacao: varchar({ length: 20 }).notNull(),
}, (table) => [
	index("idx_itens_contrato_numpar").using("btree", table.numcontrato.asc().nullsLast().op("int4_ops"), table.numparcela.asc().nullsLast().op("text_ops")),
	index("idx_itens_contrato_status").using("btree", table.situacao.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.numcontrato],
			foreignColumns: [contrato.numcontrato],
			name: "fk_itens_contrato_contrato"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.numcontrato, table.codlancamento], name: "pk_itens_contrato"}),
	check("itens_contrato_situacao_check", sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying])::text[])`),
	check("chk_itens_contrato_parcela", sql`numparcela >= 1`),
	check("chk_itens_contrato_liquidado_valor", sql`((situacao)::text <> '3'::text) OR (valorpago >= valorparcela)`),
]);
