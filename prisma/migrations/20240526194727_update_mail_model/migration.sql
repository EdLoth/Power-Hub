-- CreateTable
CREATE TABLE "Mail" (
    "id" SERIAL NOT NULL,
    "assunto" VARCHAR(445),
    "corpo" TEXT,
    "email" VARCHAR(245),
    "data_cadastro" TIMESTAMP(3),
    "data_envio" TIMESTAMP(3),
    "situacao_envio" INTEGER,
    "origem" VARCHAR(100),

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);
