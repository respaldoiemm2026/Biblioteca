-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "rol" VARCHAR(16),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autor" (
    "id" SERIAL NOT NULL,
    "nombre_autor" VARCHAR(20),

    CONSTRAINT "autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editoriales" (
    "id" SERIAL NOT NULL,
    "nombre_editorial" VARCHAR(100),

    CONSTRAINT "editoriales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20),
    "contraseña" VARCHAR(20),
    "correo" VARCHAR(100),
    "id_rol" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libro" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(50),
    "ISBN" BIGINT,
    "id_autor" INTEGER,
    "id_editorial" INTEGER,

    CONSTRAINT "libro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestamo" (
    "id" SERIAL NOT NULL,
    "fecha_prestamo" DATE,
    "fecha_regreso" DATE,

    CONSTRAINT "prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nombre_categoria" VARCHAR(50),
    "cantidad_libros" INTEGER,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libro_categoria" (
    "id_libro" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,

    CONSTRAINT "libro_categoria_pkey" PRIMARY KEY ("id_libro","id_categoria")
);

-- CreateTable
CREATE TABLE "detalle_prestamo" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_prestamo" INTEGER NOT NULL,
    "id_libro" INTEGER NOT NULL,

    CONSTRAINT "detalle_prestamo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro" ADD CONSTRAINT "libro_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "autor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro" ADD CONSTRAINT "libro_id_editorial_fkey" FOREIGN KEY ("id_editorial") REFERENCES "editoriales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_categoria" ADD CONSTRAINT "libro_categoria_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_categoria" ADD CONSTRAINT "libro_categoria_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_prestamo" ADD CONSTRAINT "detalle_prestamo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_prestamo" ADD CONSTRAINT "detalle_prestamo_id_prestamo_fkey" FOREIGN KEY ("id_prestamo") REFERENCES "prestamo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_prestamo" ADD CONSTRAINT "detalle_prestamo_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
