import prisma from "../prisma.js"

export const crearUsuario = (UserData)=> {
    return prisma.usuario.create({data: UserData})
}

export const leerUsuario = ()=> {
    return prisma.usuario.findMany();
}

export const buscarUsuarioPorCorreo = (correo)=> {
    return prisma.usuario.findUnique({
        where: {correo}
    });
}

export const buscarUsuarioPorId = (id)=> {
    return prisma.usuario.findUnique({
        where: {id}
    });
}

export const actualizarUsuario = (UsuarioId, UsuarioData)=> {
    return prisma.usuario.update({
        where: {id: UsuarioId},
        data: UsuarioData
    });
}

export const guardarToken = (UsuarioId, token)=> {
    return prisma.usuario.update({
        where: {id: UsuarioId},
        data: {token}
    });
}

export const eliminarUsuario = (UserId)=> {
    return prisma.usuario.delete({
        where: {id: UserId}
    })
}
