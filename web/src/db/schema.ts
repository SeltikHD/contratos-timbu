import { sql } from "drizzle-orm";
import {
    boolean,
    char,
    check,
    date,
    foreignKey,
    index,
    integer,
    jsonb,
    numeric,
    pgTable,
    primaryKey,
    text,
    timestamp,
    unique,
    varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const projetos = pgTable(
    "projetos",
    {
        codprojeto: integer().primaryKey().notNull(),
        nome: varchar({ length: 200 }).notNull(),
        datainicio: date().notNull(),
        dataencerramento: date().notNull(),
        valor: numeric({ precision: 14, scale: 2 }).notNull(),
        situacao: varchar({ length: 20 }).notNull(),
    },
    _table => [
        check(
            "projetos_situacao_check",
            sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying, '5'::character varying, '6'::character varying])::text[])`
        ),
        check("chk_projetos_periodo", sql`dataencerramento >= datainicio`),
    ]
);

export const requisicao = pgTable(
    "requisicao",
    {
        codrequisicao: integer().primaryKey().notNull(),
        codprojeto: integer().notNull(),
        descricao: varchar({ length: 500 }).notNull(),
        datasolicitacao: date().notNull(),
        datalimite: date().notNull(),
        valor: numeric({ precision: 14, scale: 2 }).notNull(),
        situacao: varchar({ length: 20 }).notNull(),
    },
    table => [
        index("idx_requisicao_codprojeto").using(
            "btree",
            table.codprojeto.asc().nullsLast().op("int4_ops")
        ),
        foreignKey({
            columns: [table.codprojeto],
            foreignColumns: [projetos.codprojeto],
            name: "fk_requisicao_projeto",
        })
            .onUpdate("cascade")
            .onDelete("restrict"),
        check(
            "requisicao_situacao_check",
            sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying, '5'::character varying])::text[])`
        ),
        check("chk_requisicao_prazo", sql`datalimite >= datasolicitacao`),
    ]
);

export const ordem = pgTable(
    "ordem",
    {
        codordem: integer().primaryKey().notNull(),
        codrequisicao: integer().notNull(),
        descricao: varchar({ length: 500 }).notNull(),
        datasolicitacao: date().notNull(),
        datalimite: date().notNull(),
        valor: numeric({ precision: 14, scale: 2 }).notNull(),
        situacao: varchar({ length: 20 }).notNull(),
    },
    table => [
        index("idx_ordem_codrequisicao").using(
            "btree",
            table.codrequisicao.asc().nullsLast().op("int4_ops")
        ),
        foreignKey({
            columns: [table.codrequisicao],
            foreignColumns: [requisicao.codrequisicao],
            name: "fk_ordem_requisicao",
        })
            .onUpdate("cascade")
            .onDelete("restrict"),
        check(
            "ordem_situacao_check",
            sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying])::text[])`
        ),
        check("chk_ordem_prazo", sql`datalimite >= datasolicitacao`),
    ]
);

export const contrato = pgTable(
    "contrato",
    {
        numcontrato: varchar({ length: 10 }).primaryKey().notNull(),
        codordem: integer().notNull(),
        descricao: varchar({ length: 500 }).notNull(),
        cpfcnpj: char({ length: 14 }).notNull(),
        contratado: varchar({ length: 150 }).notNull(),
        tipopessoa: integer().notNull(),
        datainicio: date().notNull(),
        datafim: date().notNull(),
        valor: numeric({ precision: 14, scale: 2 }).notNull(),
        parcelas: integer().notNull(),
        dataparcelainicial: date().notNull(),
        situacao: varchar({ length: 20 }).notNull(),
    },
    table => [
        index("idx_contrato_codordem").using(
            "btree",
            table.codordem.asc().nullsLast().op("int4_ops")
        ),
        foreignKey({
            columns: [table.codordem],
            foreignColumns: [ordem.codordem],
            name: "fk_contrato_ordem",
        })
            .onUpdate("cascade")
            .onDelete("restrict"),
        unique("contrato_codordem_key").on(table.codordem),
        check("contrato_cpfcnpj_check", sql`cpfcnpj ~ '^[0-9]{14}$'::text`),
        check("contrato_tipopessoa_check", sql`tipopessoa = ANY (ARRAY[1, 2])`),
        check(
            "contrato_situacao_check",
            sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying, '4'::character varying])::text[])`
        ),
        check("contrato_num_formato", sql`(numcontrato)::text ~ '^[0-9]{4}/[0-9]{4}$'::text`),
    ]
);

export const itensOrdem = pgTable(
    "itens_ordem",
    {
        codordem: integer().notNull(),
        coditem: integer().notNull(),
        descricao: varchar({ length: 500 }).notNull(),
        datasolicitacao: date().notNull(),
        datalimite: date().notNull(),
        valor: numeric({ precision: 14, scale: 2 }).notNull(),
        datarecebido: date(),
        situacao: varchar({ length: 20 }).notNull(),
    },
    table => [
        index("idx_itens_ordem_situacao").using(
            "btree",
            table.situacao.asc().nullsLast().op("text_ops")
        ),
        foreignKey({
            columns: [table.codordem],
            foreignColumns: [ordem.codordem],
            name: "fk_itens_ordem_ordem",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        primaryKey({ columns: [table.codordem, table.coditem], name: "pk_itens_ordem" }),
        check(
            "itens_ordem_situacao_check",
            sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying])::text[])`
        ),
        check("chk_itens_ordem_prazo", sql`datalimite >= datasolicitacao`),
    ]
);

export const itensContrato = pgTable(
    "itens_contrato",
    {
        numcontrato: varchar({ length: 10 }).notNull(),
        codlancamento: integer().notNull(),
        datalancamento: date().notNull(),
        numparcela: integer().notNull(),
        valorparcela: numeric({ precision: 14, scale: 2 }).notNull(),
        datavencimento: date().notNull(),
        valorpago: numeric({ precision: 14, scale: 2 }).default("0").notNull(),
        datapagamento: date(),
        situacao: varchar({ length: 20 }).notNull(),
    },
    table => [
        index("idx_itens_contrato_numpar").using(
            "btree",
            table.numcontrato.asc().nullsLast().op("int4_ops"),
            table.numparcela.asc().nullsLast().op("text_ops")
        ),
        index("idx_itens_contrato_status").using(
            "btree",
            table.situacao.asc().nullsLast().op("text_ops")
        ),
        foreignKey({
            columns: [table.numcontrato],
            foreignColumns: [contrato.numcontrato],
            name: "fk_itens_contrato_contrato",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        primaryKey({
            columns: [table.numcontrato, table.codlancamento],
            name: "pk_itens_contrato",
        }),
        check(
            "itens_contrato_situacao_check",
            sql`(situacao)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying])::text[])`
        ),
        check("chk_itens_contrato_parcela", sql`numparcela >= 1`),
        check(
            "chk_itens_contrato_liquidado_valor",
            sql`((situacao)::text <> '3'::text) OR (valorpago >= valorparcela)`
        ),
    ]
);

// ============================================================================
// TABELAS DE AUTENTICAÇÃO (NextAuth.js v5)
// ============================================================================

export const users = pgTable(
    "users",
    {
        id: text().primaryKey(),
        name: text(),
        email: text().notNull().unique(),
        emailVerified: timestamp("emailVerified", { withTimezone: true }),
        image: text(),
        role: text().default("USER"),
        createdAt: timestamp("createdAt", { withTimezone: true }).default(sql`NOW()`),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).default(sql`NOW()`),
    },
    table => [
        check("users_role_check", sql`role IN ('USER', 'ADMIN')`),
        index("idx_users_email").on(table.email),
    ]
);

export const accounts = pgTable(
    "accounts",
    {
        id: text()
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: text().notNull(),
        type: text().$type<AdapterAccount["type"]>().notNull(),
        provider: text().notNull(),
        providerAccountId: text().notNull(),
        refresh_token: text(),
        access_token: text(),
        expires_at: integer(),
        token_type: text(),
        scope: text(),
        id_token: text(),
        session_state: text(),
        createdAt: timestamp("createdAt", { withTimezone: true }).default(sql`NOW()`),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).default(sql`NOW()`),
    },
    table => [
        unique("accounts_provider_providerAccountId_key").on(
            table.provider,
            table.providerAccountId
        ),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "accounts_userId_fkey",
        }).onDelete("cascade"),
        index("idx_accounts_userId").on(table.userId),
    ]
);

export const sessions = pgTable(
    "sessions",
    {
        sessionToken: text().primaryKey(),
        userId: text().notNull(),
        expires: timestamp("expires", { withTimezone: true }).notNull(),
        createdAt: timestamp("createdAt", { withTimezone: true }).default(sql`NOW()`),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).default(sql`NOW()`),
    },
    table => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "sessions_userId_fkey",
        }).onDelete("cascade"),
        index("idx_sessions_userId").on(table.userId),
        index("idx_sessions_expires").on(table.expires),
    ]
);

export const verificationTokens = pgTable(
    "verification_tokens",
    {
        identifier: text().notNull(),
        token: text().notNull().unique(),
        expires: timestamp("expires", { withTimezone: true }).notNull(),
    },
    table => [unique("verification_tokens_identifier_token_key").on(table.identifier, table.token)]
);

export const profiles = pgTable(
    "profiles",
    {
        id: text()
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: text().notNull().unique(),
        bio: text(),
        company: text(),
        location: text(),
        website: text(),
        phone: text(),
        birthDate: date("birthDate"),
        linkedin: text(),
        github: text(),
        theme: text().default("system"),
        language: text().default("pt-BR"),
        timezone: text().default("America/Sao_Paulo"),
        emailNotifications: boolean("emailNotifications").default(true),
        pushNotifications: boolean("pushNotifications").default(true),
        createdAt: timestamp("createdAt", { withTimezone: true }).default(sql`NOW()`),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).default(sql`NOW()`),
    },
    table => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "profiles_userId_fkey",
        }).onDelete("cascade"),
        check("profiles_theme_check", sql`theme IN ('light', 'dark', 'system')`),
        index("idx_profiles_userId").on(table.userId),
    ]
);

export const userProjects = pgTable(
    "user_projects",
    {
        id: text()
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: text().notNull(),
        codProjeto: integer("codProjeto").notNull(),
        role: text().default("VIEWER"),
        permissions: text()
            .array()
            .default(sql`ARRAY['read']`),
        createdAt: timestamp("createdAt", { withTimezone: true }).default(sql`NOW()`),
        updatedAt: timestamp("updatedAt", { withTimezone: true }).default(sql`NOW()`),
    },
    table => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "user_projects_userId_fkey",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.codProjeto],
            foreignColumns: [projetos.codprojeto],
            name: "user_projects_codProjeto_fkey",
        }).onDelete("cascade"),
        unique("user_projects_userId_codProjeto_key").on(table.userId, table.codProjeto),
        check("user_projects_role_check", sql`role IN ('VIEWER', 'EDITOR', 'MANAGER', 'OWNER')`),
        index("idx_user_projects_userId").on(table.userId),
        index("idx_user_projects_codProjeto").on(table.codProjeto),
    ]
);

export const activityLogs = pgTable(
    "activity_logs",
    {
        id: text()
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: text().notNull(),
        action: text().notNull(),
        resource: text().notNull(),
        resourceId: text("resourceId"),
        description: text(),
        metadata: jsonb(),
        ipAddress: text("ipAddress"),
        userAgent: text("userAgent"),
        createdAt: timestamp("createdAt", { withTimezone: true }).default(sql`NOW()`),
    },
    table => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "activity_logs_userId_fkey",
        }).onDelete("cascade"),
        index("idx_activity_logs_userId").on(table.userId),
        index("idx_activity_logs_createdAt").on(table.createdAt),
        index("idx_activity_logs_action").on(table.action),
        index("idx_activity_logs_resource").on(table.resource),
    ]
);
