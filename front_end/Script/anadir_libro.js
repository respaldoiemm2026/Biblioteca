let todosLosLibros = [];
let idLibroAEditar = null; 

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificamos que el usuario tenga permisos de Administrador
    const esAdmin = await comprobarSiEsAdmin();
    
    if (esAdmin) {
        // Cargar libros al iniciar
        descargarLibros();

        // Escuchador para la barra de búsqueda dinámica
        const inputBuscar = document.getElementById("inputBuscar");
        if (inputBuscar) inputBuscar.addEventListener("input", filtrarTabla);

        // Control de Modal (Abrir y Cerrar)
        const ventanaModal = document.getElementById("ventanaModal");
        const btnAbrirModal = document.getElementById("btnAbrirModalNuevo");
        const btnCerrarModal = document.getElementById("btnCerrarModal");
        const formulario = document.getElementById("formularioLibro");

        if (btnAbrirModal) {
            btnAbrirModal.addEventListener("click", () => {
                idLibroAEditar = null; 
                formulario.reset(); 
                document.getElementById("tituloModal").textContent = "Añadir Nuevo Libro";
                document.getElementById("btnGuardarFormulario").textContent = "Guardar Libro";
                ventanaModal.style.display = "flex";
            });
        }

        if (btnCerrarModal) {
            btnCerrarModal.addEventListener("click", () => ventanaModal.style.display = "none");
        }

        window.addEventListener("click", (e) => { 
            if (e.target === ventanaModal) ventanaModal.style.display = "none"; 
        });

        // Evento Submit del formulario
        if (formulario) {
            formulario.addEventListener("submit", guardarLibro);
        }
    }
});

// Comprobar rol de usuario
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
        console.error("Error al verificar permisos:", error);
        return false; 
    }
}

// Obtener libros desde la API
async function descargarLibros() {
    try {
        const respuesta = await fetch(`${API_URL}/libro`, { 
            method: "GET", 
            credentials: "include" 
        });
        todosLosLibros = await respuesta.json();
        dibujarTabla(todosLosLibros);
    } catch (error) { 
        console.error("Error al pedir libros:", error); 
    }
}

// Renderizar las filas de la tabla
function dibujarTabla(lista) {
    const cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = "";
    
    lista.forEach((libro) => {
        const fila = document.createElement("tr");
        
        // Formatear categoría con primera letra en mayúscula
        let textoCategoria = (libro.tipo || "General").trim();
        let categoriaFormateada = textoCategoria.charAt(0).toUpperCase() + textoCategoria.slice(1).toLowerCase();

        // Obtener nombres de autor y editorial previniendo nulos
        const nombreAutor = libro.autor 
            ? (libro.autor.nombreAutor || libro.autor.nombre || "Sin Autor") 
            : "Sin Autor";

        const nombreEditorial = libro.editorial 
            ? (libro.editorial.nombre || libro.editorial.nombreEditorial || "Sin Editorial") 
            : "Sin Editorial";

        fila.innerHTML = `
            <td>${libro.ISBN || "N/A"}</td>
            <td>${libro.titulo || "Sin Título"}</td>
            <td>${nombreAutor}</td>
            <td>${nombreEditorial}</td>
            <td>
                <span style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: #1e2b4d;">
                    ${categoriaFormateada}
                </span>
            </td>
            <td>
                <button onclick="prepararEdicion(${libro.id})">✏️</button>
                <button onclick="borrarLibro(${libro.id})">🗑️</button>
            </td>
        `;
        cuerpo.appendChild(fila);
    });
}

// Filtrar tabla en tiempo real (Título, ISBN, Autor y Editorial)
function filtrarTabla(evento) {
    const palabra = evento.target.value.toLowerCase().trim();
    
    const encontrados = todosLosLibros.filter(libro => {
        const titulo = (libro.titulo || "").toLowerCase();
        const isbn = (libro.ISBN || "").toLowerCase(); 
        const nombreAutor = libro.autor 
            ? (libro.autor.nombreAutor || libro.autor.nombre || "").toLowerCase() 
            : "";
        const nombreEditorial = libro.editorial 
            ? (libro.editorial.nombre || libro.editorial.nombreEditorial || "").toLowerCase() 
            : "";

        return titulo.includes(palabra) || 
               isbn.includes(palabra) || 
               nombreAutor.includes(palabra) || 
               nombreEditorial.includes(palabra);
    });

    dibujarTabla(encontrados);
}

// Guardar o Actualizar libro
async function guardarLibro(evento) {
    evento.preventDefault();

    const datos = {
        titulo: document.getElementById("campoTitulo").value,
        ISBN: document.getElementById("campoIsbn").value,
        idAutor: Number(document.getElementById("campoAutor").value),
        idEditorial: Number(document.getElementById("campoEditorial").value),
        tipo: document.getElementById("campoTipo").value.trim(), 
        imagen: document.getElementById("campoImagen").value || null,
        descripcion: document.getElementById("campoDescripcion").value || null
    };

    const url = idLibroAEditar 
        ? `${API_URL}/libro/${idLibroAEditar}` 
        : `${API_URL}/libro`;
    const metodo = idLibroAEditar ? "PUT" : "POST";

    try {
        const respuesta = await fetch(url, { 
            method: metodo, 
            headers: { "Content-Type": "application/json" }, 
            credentials: "include", 
            body: JSON.stringify(datos) 
        });

        if (!respuesta.ok) {
            alert("Error al guardar el libro");
            return;
        }

        document.getElementById("ventanaModal").style.display = "none";
        descargarLibros(); 
    } catch (error) { 
        console.error("Error al guardar:", error);
        alert("Ocurrió un error al intentar guardar");
    }
}

// Cargar datos en el modal para editar
window.prepararEdicion = (id) => {
    const libro = todosLosLibros.find(l => l.id === id);
    if (!libro) return;

    idLibroAEditar = id; 
    
    document.getElementById("campoTitulo").value = libro.titulo || "";
    document.getElementById("campoIsbn").value = libro.ISBN || "";
    document.getElementById("campoAutor").value = libro.idAutor || "";
    document.getElementById("campoEditorial").value = libro.idEditorial || "";
    document.getElementById("campoTipo").value = libro.tipo || ""; 
    document.getElementById("campoImagen").value = libro.imagen || "";
    document.getElementById("campoDescripcion").value = libro.descripcion || "";

    document.getElementById("tituloModal").textContent = "Editar Libro";
    document.getElementById("btnGuardarFormulario").textContent = "Actualizar Libro";
    document.getElementById("ventanaModal").style.display = "flex";
};

// Eliminar libro
window.borrarLibro = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/libro/${id}`, { 
            method: "DELETE", 
            credentials: "include" 
        });

        if (respuesta.ok) {
            descargarLibros();
        } else {
            alert("Error al eliminar el libro");
        }
    } catch (error) {
        console.error("Error al borrar libro:", error);
    }
};