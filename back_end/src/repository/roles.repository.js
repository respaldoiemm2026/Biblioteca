import prisma from "../prisma.js";

export const  createRoles = (RolesData)=> {
    return prisma.roles.create({data: RolesData});
}

export const leerRoles = ()=> {
    return prisma.roles.findMany();
}

export const buscarRolPorNombre = (nombre)=> {
    return prisma.roles.findFirst({
        where: { rol: nombre }
    });
}


export const actualizarRoles = (RolesId, RolesData)=> {
    return prisma.roles.update({
        where: {id: RolesId},
        data: RolesData
    });
}

export const eliminarRoles = (UserId)=> {
    return prisma.roles.delete({
        where: {id: UserId}
    });
}
