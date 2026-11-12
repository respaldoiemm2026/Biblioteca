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

        configurarPestanas();
        configurarFiltrosHistorial();
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
            <td>${escaparHTML(usuario.nombre || 'Sin nombre')}</td>
            <td>${escaparHTML(correo)}</td>
            <td><span class="etiqueta-curso">${escaparHTML(curso)}</span></td>
            <td>${nombreRol}</td>
            <td>
                <button class="btn-accion" onclick="verHistorialDeUsuario(${usuario.id})" title="Ver historial de préstamos">📜</button>
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


// =====================================================================
// HISTORIAL DE PRÉSTAMOS
// =====================================================================

let historialPrestamos = [];   // una fila por libro prestado
let historialCargado = false;
let idUsuarioFiltroHistorial = null;

function escaparHTML(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Las fechas se guardan como DATE (sin hora); se muestran en UTC
// para que no se corran un día por la zona horaria.
function formatearFecha(fechaISO) {
    if (!fechaISO) return "—";
    const fecha = new Date(fechaISO);
    if (Number.isNaN(fecha.getTime())) return "—";
    return fecha.toLocaleDateString("es-CO", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" });
}

function configurarPestanas() {
    const tabUsuarios = document.getElementById("tabUsuarios");
    const tabHistorial = document.getElementById("tabHistorial");
    if (!tabUsuarios || !tabHistorial) return;

    tabUsuarios.addEventListener("click", () => mostrarPestana("usuarios"));
    tabHistorial.addEventListener("click", () => mostrarPestana("historial"));
}

function mostrarPestana(nombre) {
    const esHistorial = nombre === "historial";

    document.getElementById("tabUsuarios").classList.toggle("active", !esHistorial);
    document.getElementById("tabHistorial").classList.toggle("active", esHistorial);
    document.getElementById("tabUsuarios").setAttribute("aria-selected", String(!esHistorial));
    document.getElementById("tabHistorial").setAttribute("aria-selected", String(esHistorial));
    document.getElementById("seccionUsuarios").hidden = esHistorial;
    document.getElementById("seccionHistorial").hidden = !esHistorial;

    document.querySelector(".header h1").textContent = esHistorial ? "Historial de préstamos" : "Usuarios";
    document.querySelector(".header p").textContent = esHistorial
        ? "Consulta todos los libros que se han prestado"
        : "Administra los usuarios registrados";

    if (esHistorial && !historialCargado) {
        cargarHistorial();
    }
}

function configurarFiltrosHistorial() {
    const inputBuscar = document.getElementById("inputBuscarHistorial");
    const selectEstado = document.getElementById("selectEstadoHistorial");
    const btnLimpiar = document.getElementById("btnLimpiarFiltrosHistorial");

    if (inputBuscar) {
        inputBuscar.addEventListener("input", () => {
            // Si el usuario escribe a mano, se quita el filtro fijo por usuario
            idUsuarioFiltroHistorial = null;
            aplicarFiltrosHistorial();
        });
    }
    if (selectEstado) selectEstado.addEventListener("change", aplicarFiltrosHistorial);
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            idUsuarioFiltroHistorial = null;
            inputBuscar.value = "";
            selectEstado.value = "";
            aplicarFiltrosHistorial();
        });
    }
}

async function cargarHistorial() {
    const tablaBody = document.getElementById("tablaHistorialBody");
    tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Cargando historial...</td></tr>`;

    try {
        const respuesta = await fetch(`${API_URL}/prestamo`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.mensaje || "Error al obtener el historial");

        // Cada préstamo puede tener uno o varios libros (detalles):
        // se aplana a una fila por libro prestado.
        historialPrestamos = [];
        datos.forEach((prestamo) => {
            (prestamo.detallesPrestamo || []).forEach((detalle) => {
                historialPrestamos.push({
                    idPrestamo: prestamo.id,
                    estado: prestamo.estado || "Pendiente",
                    fechaPrestamo: prestamo.fechaPrestamo,
                    fechaRegreso: prestamo.fechaRegreso,
                    idUsuario: detalle.usuario?.id ?? detalle.idUsuario,
                    nombreUsuario: detalle.usuario?.nombre || "Usuario eliminado",
                    correoUsuario: detalle.usuario?.correo || "",
                    curso: detalle.usuario?.curso || "No asignado",
                    tituloLibro: detalle.libro?.titulo || "Libro eliminado",
                    isbn: detalle.libro?.ISBN || ""
                });
            });
        });

        historialCargado = true;
        aplicarFiltrosHistorial();
    } catch (error) {
        tablaBody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error: ${escaparHTML(error.message)}</td></tr>`;
    }
}

function aplicarFiltrosHistorial() {
    const texto = (document.getElementById("inputBuscarHistorial")?.value || "").toLowerCase().trim();
    const estado = document.getElementById("selectEstadoHistorial")?.value || "";

    const filtrados = historialPrestamos.filter((fila) => {
        if (idUsuarioFiltroHistorial !== null && fila.idUsuario !== idUsuarioFiltroHistorial) return false;
        if (estado && fila.estado !== estado) return false;
        if (!texto || idUsuarioFiltroHistorial !== null) return true;
        return [fila.tituloLibro, fila.nombreUsuario, fila.correoUsuario, fila.curso]
            .some((valor) => valor.toLowerCase().includes(texto));
    });

    renderizarResumenHistorial(filtrados);
    renderizarTablaHistorial(filtrados);
}

function renderizarResumenHistorial(filas) {
    const contenedor = document.getElementById("resumenHistorial");
    if (!contenedor) return;

    const contar = (estado) => filas.filter((f) => f.estado === estado).length;

    contenedor.innerHTML = `
        <div class="tarjeta-resumen"><div class="numero">${filas.length}</div><div class="etiqueta">Total de préstamos</div></div>
        <div class="tarjeta-resumen pendiente"><div class="numero">${contar("Pendiente")}</div><div class="etiqueta">Pendientes</div></div>
        <div class="tarjeta-resumen aprobado"><div class="numero">${contar("Aprobado")}</div><div class="etiqueta">Aprobados</div></div>
        <div class="tarjeta-resumen rechazado"><div class="numero">${contar("Rechazado")}</div><div class="etiqueta">Rechazados</div></div>
    `;
}

function renderizarTablaHistorial(filas) {
    const tablaBody = document.getElementById("tablaHistorialBody");
    if (!tablaBody) return;

    if (filas.length === 0) {
        const mensaje = historialPrestamos.length === 0
            ? "Todavía no hay préstamos registrados."
            : "No hay préstamos que coincidan con los filtros.";
        tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">${mensaje}</td></tr>`;
        return;
    }

    const clasesEstado = { Pendiente: "pendiente", Aprobado: "aprobado", Rechazado: "rechazado" };

    tablaBody.innerHTML = filas.map((fila) => `
        <tr>
            <td>
                <span class="libro-celda">${escaparHTML(fila.tituloLibro)}</span>
                ${fila.isbn ? `<span class="texto-secundario">ISBN ${escaparHTML(fila.isbn)}</span>` : ""}
            </td>
            <td>
                ${escaparHTML(fila.nombreUsuario)}
                ${fila.correoUsuario ? `<span class="texto-secundario">${escaparHTML(fila.correoUsuario)}</span>` : ""}
            </td>
            <td><span class="etiqueta-curso">${escaparHTML(fila.curso)}</span></td>
            <td>${formatearFecha(fila.fechaPrestamo)}</td>
            <td>${formatearFecha(fila.fechaRegreso)}</td>
            <td><span class="badge-estado ${clasesEstado[fila.estado] || "otro"}">${escaparHTML(fila.estado)}</span></td>
        </tr>
    `).join("");
}

// Botón 📜 de la tabla de usuarios: abre el historial filtrado por ese usuario
window.verHistorialDeUsuario = (idUsuario) => {
    const usuario = listaUsuarios.find((u) => u.id === idUsuario);
    idUsuarioFiltroHistorial = idUsuario;

    document.getElementById("inputBuscarHistorial").value = usuario?.correo || usuario?.nombre || "";
    document.getElementById("selectEstadoHistorial").value = "";

    mostrarPestana("historial");
    if (historialCargado) aplicarFiltrosHistorial();
};
