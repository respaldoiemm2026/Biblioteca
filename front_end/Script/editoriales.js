let todasLasEditoriales = [];
let idEditorialAEditar = null; 

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificar si es administrador
    const esAdmin = await comprobarSiEsAdmin();
    
    if (esAdmin) {
        descargarEditoriales();

        // Buscador dinámico
        const inputBuscar = document.getElementById("inputBuscar");
        if (inputBuscar) inputBuscar.addEventListener("input", filtrarTabla);

        // Control del Modal
        const ventanaModal = document.getElementById("ventanaModal");
        const btnAbrirModal = document.getElementById("btnAbrirModalNuevo");
        const btnCerrarModal = document.getElementById("btnCerrarModal");
        const formulario = document.getElementById("formularioEditorial");

        if (btnAbrirModal) {
            btnAbrirModal.addEventListener("click", () => {
                idEditorialAEditar = null; 
                formulario.reset(); 
                document.getElementById("tituloModal").textContent = "Añadir Nueva Editorial";
                document.getElementById("btnGuardarFormulario").textContent = "Guardar Editorial";
                ventanaModal.style.display = "flex";
            });
        }

        if (btnCerrarModal) {
            btnCerrarModal.addEventListener("click", () => ventanaModal.style.display = "none");
        }

        window.addEventListener("click", (e) => { 
            if (e.target === ventanaModal) ventanaModal.style.display = "none"; 
        });

        // Evento guardar/actualizar
        if (formulario) {
            formulario.addEventListener("submit", guardarEditorial);
        }
    }
});

// Comprobar autenticación y rol admin
async function comprobarSiEsAdmin() {
    try {
        const respuesta = await fetch(`${API_URL}/auth/me`, { 
            method: "GET", 
            credentials: "include" 
        });
        if (!respuesta.ok) return false;
        const datos = await respuesta.json();
        return datos.usuario && datos.usuario.idRol === 2;
    } catch (error) { 
        console.error("Error de verificación:", error);
        return false; 
    }
}

// Obtener todas las editoriales
async function descargarEditoriales() {
    try {
        const respuesta = await fetch(`${API_URL}/editorial`, { 
            method: "GET", 
            credentials: "include" 
        });
        todasLasEditoriales = await respuesta.json();
        dibujarTabla(todasLasEditoriales);
    } catch (error) { 
        console.error("Error al obtener editoriales:", error); 
    }
}

// Renderizar filas de la tabla
function dibujarTabla(lista) {
    const cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = "";
    
    lista.forEach((item) => {
        const fila = document.createElement("tr");
        
        const nombre = item.nombre || item.nombreEditorial || "Sin Nombre";

        fila.innerHTML = `
            <td><strong>#${item.id}</strong></td>
            <td>${nombre}</td>
            <td>
                <button onclick="prepararEdicion(${item.id})">✏️</button>
                <button onclick="borrarEditorial(${item.id})">🗑️</button>
            </td>
        `;
        cuerpo.appendChild(fila);
    });
}

// Búsqueda en tiempo real
function filtrarTabla(evento) {
    const palabra = evento.target.value.toLowerCase().trim();
    
    const encontradas = todasLasEditoriales.filter(item => {
        const nombre = (item.nombre || item.nombreEditorial || "").toLowerCase();
        return nombre.includes(palabra) || String(item.id).includes(palabra);
    });

    dibujarTabla(encontradas);
}

// Guardar nueva editorial o actualizar existente
async function guardarEditorial(evento) {
    evento.preventDefault();

    const nombreIngresado = document.getElementById("campoNombre").value.trim();

    const datos = {
        nombre: nombreIngresado,
        nombreEditorial: nombreIngresado // Garantiza compatibilidad con cualquier variante en tu modelo Prisma
    };

    const url = idEditorialAEditar 
        ? `${API_URL}/editorial/${idEditorialAEditar}` 
        : `${API_URL}/editorial`;
    const metodo = idEditorialAEditar ? "PUT" : "POST";

    try {
        const respuesta = await fetch(url, { 
            method: metodo, 
            headers: { "Content-Type": "application/json" }, 
            credentials: "include", 
            body: JSON.stringify(datos) 
        });

        if (!respuesta.ok) {
            alert("Error al guardar la editorial");
            return;
        }

        document.getElementById("ventanaModal").style.display = "none";
        descargarEditoriales(); 
    } catch (error) { 
        console.error("Error al guardar:", error);
        alert("Ocurrió un error al intentar guardar");
    }
}

// Cargar datos en el modal para editar
window.prepararEdicion = (id) => {
    const item = todasLasEditoriales.find(e => e.id === id);
    if (!item) return;

    idEditorialAEditar = id; 
    
    document.getElementById("campoNombre").value = item.nombre || item.nombreEditorial || "";

    document.getElementById("tituloModal").textContent = "Editar Editorial";
    document.getElementById("btnGuardarFormulario").textContent = "Actualizar Editorial";
    document.getElementById("ventanaModal").style.display = "flex";
};

// Eliminar editorial
window.borrarEditorial = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta editorial?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/editorial/${id}`, { 
            method: "DELETE", 
            credentials: "include" 
        });

        if (respuesta.ok) {
            descargarEditoriales();
        } else {
            alert("No se pudo eliminar la editorial. Es posible que esté asociada a un libro.");
        }
    } catch (error) {
        console.error("Error al eliminar editorial:", error);
    }
};