import {leerRoles} from "../repository/roles.repository.js"
import {createRoles} from "../repository/roles.repository.js"
import {actualizarRoles} from "../repository/roles.repository.js"
import {eliminarRoles} from "../repository/roles.repository.js"


export const servicioCrearRoles = (RolesData) => {
    return createRoles(RolesData);
}


export const servicioLeerRoles = ()=> {
    return leerRoles();
}

export const servicioActualizarRoles = (RolesId, RolesData)=> {
    return actualizarRoles(RolesId, RolesData);
}

export const servicioEliminarRoles = (RolesId)=> {
    return eliminarRoles(RolesId);
}
