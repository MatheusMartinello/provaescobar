CREATE TABLE "usuario"
(
    "idusuario" serial NOT NULL,
    "nome" varchar(50) NOT NULL,
    "cpf" int NOT NULL,
    CONSTRAINT "PK_usuario" PRIMARY KEY ( "idusuario" )
);
CREATE TABLE "cotacoes"
(
    "idcotacoes" serial NOT NULL,
    "data" date NOT NULL,
    "idusuario" integer NOT NULL,
    CONSTRAINT "PK_cotacoes" PRIMARY KEY ( "idcotacoes", "idusuario" ),
    CONSTRAINT "FK_53" FOREIGN KEY ( "idusuario" ) REFERENCES "usuario" ( "idusuario" )
);
CREATE TABLE "fornecedor"
(
    "idfornecedor" serial NOT NULL,
    "nome" varchar(50) NOT NULL,
    CONSTRAINT "PK_fornecedor" PRIMARY KEY ( "idfornecedor" )
);
CREATE TABLE "produtos"
(
    "idprodutos" serial NOT NULL,
    "nome" varchar(50) NOT NULL,
    "quantidade" integer NOT NULL,
    "valor" numeric NOT NULL,
    "idfornecedor" integer NOT NULL,
    CONSTRAINT "PK_produtos" PRIMARY KEY ( "idprodutos", "idfornecedor" ),
    CONSTRAINT "FK_66" FOREIGN KEY ( "idfornecedor" ) REFERENCES "fornecedor" ( "idfornecedor" )
);
CREATE TABLE "cotacoes_produtos"
(
    "idcotacoes" integer NOT NULL,
    "idusuario" integer NOT NULL,
    "idprodutos" integer NOT NULL,
    "idestoques" integer NOT NULL,
    "valortotal" numeric NOT NULL,
    "prazoentrega" date NOT NULL,
    "prazopagamento" date NOT NULL,
    CONSTRAINT "PK_cotacoes_produtos" PRIMARY KEY ( "idcotacoes", "idusuario", "idprodutos", "idestoques" ),
    CONSTRAINT "FK_70" FOREIGN KEY ( "idcotacoes", "idusuario" ) REFERENCES "cotacoes" ( "idcotacoes", "idusuario" ),
    CONSTRAINT "FK_75" FOREIGN KEY ( "idprodutos", "idestoques" ) REFERENCES "produtos" ( "idprodutos", "idestoques" )
);
CREATE TABLE "ordemfornecimento"
(
    "idordemfornecimento" serial NOT NULL,
    "idcotacoes" integer NOT NULL,
    "idusuario" integer NOT NULL,
    "idprodutos" integer NOT NULL,
    "idestoques" integer NOT NULL,
    "autoriacao" varchar(50) NOT NULL,
    CONSTRAINT "PK_pedido" PRIMARY KEY ( "idordemfornecimento" ),
    CONSTRAINT "FK_97" FOREIGN KEY ( "idcotacoes", "idusuario", "idprodutos", "idestoques" ) REFERENCES "cotacoes_produtos" ( "idcotacoes", "idusuario", "idprodutos", "idestoques" )
);

CREATE TABLE "entrada"
(
    "identrada" serial NOT NULL,
    "data" date NOT NULL,
    "idordemfornecimento" integer NOT NULL,
    "idnotafiscal" integer NOT NULL,
    CONSTRAINT "PK_entrada" PRIMARY KEY ( "identrada" ),
    CONSTRAINT "FK_109" FOREIGN KEY ( "idordemfornecimento" ) REFERENCES "ordemfornecimento" ( "idordemfornecimento" ),
    CONSTRAINT "FK_117" FOREIGN KEY ( "idnotafiscal" ) REFERENCES "notafiscal" ( "idnotafiscal" )
);
