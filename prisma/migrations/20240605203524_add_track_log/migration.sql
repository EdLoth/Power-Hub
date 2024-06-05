-- CreateTable
CREATE TABLE "track_log" (
    "id" SERIAL NOT NULL,
    "id_modulo" INTEGER,
    "resolver" VARCHAR(255),
    "action" VARCHAR(150),
    "data_acesso" TIMESTAMP(3),
    "param" VARCHAR(255),
    "hash_acesso" VARCHAR(500),
    "user_id" INTEGER,
    "ip" VARCHAR(45),

    CONSTRAINT "track_log_pkey" PRIMARY KEY ("id")
);
