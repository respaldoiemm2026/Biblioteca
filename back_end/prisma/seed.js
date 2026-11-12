import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/prisma.js";

const ROLES = ["admin", "bibliotecario", "usuario"];
const SALT_ROUNDS = 10;

const seedRoles = async () => {

    const rolesPorNombre = {};

    for (const nombre of ROLES) {

        let rol = await prisma.roles.findFirst({ where: { rol: nombre } });

        if (!rol) {
            rol = await prisma.roles.create({ data: { rol: nombre } });
            console.log(`Rol creado: ${nombre}`);
        } else {
            console.log(`Rol ya existente: ${nombre}`);
        }

        rolesPorNombre[nombre] = rol;
    }

    return rolesPorNombre;

}

const seedAdmin = async (rolAdmin) => {

    const correo = process.env.ADMIN_EMAIL || "admin@biblioteca.com";
    const contrasena = process.env.ADMIN_PASSWORD || "CambiarEstaClave123";
    const nombre = process.env.ADMIN_NOMBRE || "Administrador";

    const existente = await prisma.usuario.findUnique({ where: { correo } });

    if (existente) {
        console.log(`Usuario admin ya existe: ${correo}`);
        return;
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.warn(
            "ADMIN_EMAIL/ADMIN_PASSWORD no estan definidas en .env, " +
            "se usaran valores de desarrollo por defecto. Cambia la clave despues de iniciar sesion."
        );
    }

    const contrasenaHasheada = await bcrypt.hash(contrasena, SALT_ROUNDS);

    await prisma.usuario.create({
        data: {
            nombre,
            correo,
            contrasena: contrasenaHasheada,
            idRol: rolAdmin.id
        }
    });

    console.log(`Usuario admin creado: ${correo}`);

}

const main = async () => {

    const roles = await seedRoles();
    await seedAdmin(roles.admin);

}

main()
    .catch((error) => {
        console.error("Error ejecutando el seed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
