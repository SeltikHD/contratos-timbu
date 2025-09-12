-- PROJETOS
CREATE TABLE IF NOT EXISTS projetos (
    codProjeto INTEGER PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    dataInicio DATE NOT NULL,
    dataEncerramento DATE NOT NULL,
    valor NUMERIC(14, 2) NOT NULL,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('1', '2', '3', '4', '5', '6'))
);
-- REQUISICAO
CREATE TABLE IF NOT EXISTS requisicao (
    codRequisicao INTEGER PRIMARY KEY,
    codProjeto INTEGER NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    dataSolicitacao DATE NOT NULL,
    dataLimite DATE NOT NULL,
    valor NUMERIC(14, 2) NOT NULL,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('1', '2', '3', '4', '5')),
    CONSTRAINT fk_requisicao_projeto FOREIGN KEY (codProjeto) REFERENCES projetos(codProjeto) ON DELETE RESTRICT ON UPDATE CASCADE
);
-- ORDEM
CREATE TABLE IF NOT EXISTS ordem (
    codOrdem INTEGER PRIMARY KEY,
    codRequisicao INTEGER NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    dataSolicitacao DATE NOT NULL,
    dataLimite DATE NOT NULL,
    valor NUMERIC(14, 2) NOT NULL,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('1', '2', '3', '4')),
    CONSTRAINT fk_ordem_requisicao FOREIGN KEY (codRequisicao) REFERENCES requisicao(codRequisicao) ON DELETE RESTRICT ON UPDATE CASCADE
);
-- ITENS_ORDEM
CREATE TABLE IF NOT EXISTS itens_ordem (
    codOrdem INTEGER NOT NULL,
    codItem INTEGER NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    dataSolicitacao DATE NOT NULL,
    dataLimite DATE NOT NULL,
    valor NUMERIC(14, 2) NOT NULL,
    dataRecebido DATE,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('1', '2', '3')),
    CONSTRAINT pk_itens_ordem PRIMARY KEY (codOrdem, codItem),
    CONSTRAINT fk_itens_ordem_ordem FOREIGN KEY (codOrdem) REFERENCES ordem(codOrdem) ON DELETE CASCADE ON UPDATE CASCADE
);
-- CONTRATO (1:1 com ORDEM)
CREATE TABLE IF NOT EXISTS contrato (
    numContrato VARCHAR(10) PRIMARY KEY,
    codOrdem INTEGER NOT NULL UNIQUE,
    descricao VARCHAR(500) NOT NULL,
    cpfcnpj CHAR(14) NOT NULL CHECK (cpfcnpj ~ '^[0-9]{14}$'),
    contratado VARCHAR(150) NOT NULL,
    tipoPessoa INTEGER NOT NULL CHECK (tipoPessoa IN (1, 2)),
    -- 1=PF, 2=PJ
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    valor NUMERIC(14, 2) NOT NULL,
    parcelas INTEGER NOT NULL,
    dataParcelaInicial DATE NOT NULL,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('1', '2', '3', '4')),
    CONSTRAINT contrato_num_formato CHECK (numContrato ~ '^[0-9]{4}/[0-9]{4}$'),
    CONSTRAINT fk_contrato_ordem FOREIGN KEY (codOrdem) REFERENCES ordem(codOrdem) ON DELETE RESTRICT ON UPDATE CASCADE
);
-- ITENS_CONTRATO (lançamentos/parcelas)
CREATE TABLE IF NOT EXISTS itens_contrato (
    numContrato VARCHAR(10) NOT NULL,
    codLancamento INTEGER NOT NULL,
    dataLancamento DATE NOT NULL,
    numParcela INTEGER NOT NULL,
    valorParcela NUMERIC(14, 2) NOT NULL,
    dataVencimento DATE NOT NULL,
    valorPago NUMERIC(14, 2) NOT NULL DEFAULT 0,
    dataPagamento DATE,
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('1', '2', '3')),
    CONSTRAINT pk_itens_contrato PRIMARY KEY (numContrato, codLancamento),
    CONSTRAINT fk_itens_contrato_contrato FOREIGN KEY (numContrato) REFERENCES contrato(numContrato) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Índices e regras adicionais
CREATE INDEX IF NOT EXISTS idx_requisicao_codProjeto ON requisicao(codProjeto);
CREATE INDEX IF NOT EXISTS idx_ordem_codRequisicao ON ordem(codRequisicao);
CREATE INDEX IF NOT EXISTS idx_itens_ordem_situacao ON itens_ordem(situacao);
CREATE INDEX IF NOT EXISTS idx_contrato_codOrdem ON contrato(codOrdem);
CREATE INDEX IF NOT EXISTS idx_itens_contrato_status ON itens_contrato(situacao);
CREATE INDEX IF NOT EXISTS idx_itens_contrato_numPar ON itens_contrato(numContrato, numParcela);
ALTER TABLE projetos
ADD CONSTRAINT chk_projetos_periodo CHECK (dataEncerramento >= dataInicio);
ALTER TABLE requisicao
ADD CONSTRAINT chk_requisicao_prazo CHECK (dataLimite >= dataSolicitacao);
ALTER TABLE ordem
ADD CONSTRAINT chk_ordem_prazo CHECK (dataLimite >= dataSolicitacao);
ALTER TABLE itens_ordem
ADD CONSTRAINT chk_itens_ordem_prazo CHECK (dataLimite >= dataSolicitacao);
ALTER TABLE itens_contrato
ADD CONSTRAINT chk_itens_contrato_parcela CHECK (numParcela >= 1);
ALTER TABLE itens_contrato
ADD CONSTRAINT chk_itens_contrato_liquidado_valor CHECK (
        (situacao <> '3')
        OR (valorPago >= valorParcela)
    );