let listaUsuarios = [];
let idUsuarioAEditar = null;

document.addEventListener("DOMContentLoaded", async () => {
    const esAdmin = await verificarPermisos();
    
    if (esAdmin) {
        cargarUsuarios();

        const inputBuscar = document.getElementById("inputBuscarUsuario");
        if (inputBuscar) {
            inputBuscar.addEventListener("input", filtrarUsuarios);
        }

        const modal = document.getElementById("modalUsuario");
        const btnAbrir = document.getElementById("btnAbrirModalUsuario");
        const btnCerrar = document.getElementById("btnCerrarModalUsuario");
        const formulario = document.getElementById("formularioUsuario");

        if (btnAbrir) {
            btnAbrir.addEventListener("click", () => {
                idUsuarioAEditar = null;
                formulario.reset();
                document.getElementById("tituloModalUsuario").textContent = "Nuevo Usuario";
                document.getElementById("btnGuardarUsuario").textContent = "Guardar Usuario";
                document.getElementById("grupoPassword").style.display = "block";
                document.getElementById("inputPassword").setAttribute("required", "true");
                modal.style.display = "flex";
            });
        }

        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });

        if (formulario) {
            formulario.addEventListener("submit", guardarUsuario);
        }
    }
});

async function verificarPermisos() {
    try {
        const respuesta = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) {
            window.location.href = "../inicio_sesion/inicio_de_sesion.html";
            return false;
        }

        const datos = await respuesta.json();
        if (datos.usuario.idRol !== 2) { 
            alert("Acceso denegado: Solo Administradores.");
            window.location.href = "../home/pagina2.html"; 
            return false;
        }

        return true;
    } catch (error) {
        window.location.href = "../inicio_sesion/inicio_de_sesion.html";
        return false;
    }
}

async function cargarUsuarios() {
    try {
        const respuesta = await fetch(`${API_URL}/usuario`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include" 
        });
        
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.mensaje || "Error al obtener usuarios");

        listaUsuarios = datos;
        renderizarTablaUsuarios(listaUsuarios);
    } catch (error) {
        const tablaBody = document.getElementById("tablaUsuariosBody");
        if(tablaBody) tablaBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
    }
}

function renderizarTablaUsuarios(usuarios) {
    const tablaBody = document.getElementById("tablaUsuariosBody");
    if (!tablaBody) return;
    tablaBody.innerHTML = "";

    if (usuarios.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay usuarios registrados.</td></tr>`;
        return;
    }

    usuarios.forEach((usuario) => {
        const nombreRol = usuario.idRol === 2 ? "Administrador" : "Estudiante";
        const correo = usuario.correo || usuario.email || "Sin correo";
        const curso = usuario.curso || "No asignado";
        
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${usuario.nombre || 'Sin nombre'}</td>
            <td>${correo}</td>
            <td><span style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: #1e2b4d;">${curso}</span></td>
            <td>${nombreRol}</td>
            <td>
                <button class="btn-accion" onclick="eliminarUsuario(${usuario.id})" title="Eliminar">🗑️</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

function filtrarUsuarios(e) {
    const texto = e.target.value.toLowerCase().trim();
    const filtrados = listaUsuarios.filter((usuario) => {
        const nombre = (usuario.nombre || "").toLowerCase();
        const correo = (usuario.correo || usuario.email || "").toLowerCase();
        const curso = (usuario.curso || "").toLowerCase();
        return nombre.includes(texto) || correo.includes(texto) || curso.includes(texto);
    });
    renderizarTablaUsuarios(filtrados);
}
    
window.eliminarUsuario = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario de forma permanente?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/usuario/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) {
            const datos = await respuesta.json();
            throw new Error(datos.mensaje || "No se pudo eliminar el usuario");
        }

        alert("Usuario eliminado correctamente.");
        cargarUsuarios(); 
    } catch (error) {
        alert("Error al eliminar: " + error.message);
    }
};
