let todasLasCategorias = [];
let idCategoriaAEditar = null; 

document.addEventListener("DOMContentLoaded", async () => {
    const esAdmin = await comprobarSiEsAdmin();
    
    if (esAdmin) {
        descargarCategorias();

        const ventanaModal = document.getElementById("ventanaModal");
        const btnAbrirModal = document.getElementById("btnAbrirModalNuevo");
        const btnCerrarModal = document.getElementById("btnCerrarModal");
        const formulario = document.getElementById("formularioCategoria");

        if (btnAbrirModal) btnAbrirModal.addEventListener("click", () => {
            idCategoriaAEditar = null; 
            formulario.reset(); 
            document.getElementById("tituloModal").textContent = "Añadir Categoría";
            document.getElementById("btnGuardarFormulario").textContent = "Guardar Categoría";
            ventanaModal.style.display = "flex";
        });

        if (btnCerrarModal) btnCerrarModal.addEventListener("click", () => ventanaModal.style.display = "none");
        window.addEventListener("click", (e) => { if (e.target === ventanaModal) ventanaModal.style.display = "none"; });

        if (formulario) formulario.addEventListener("submit", guardarCategoria);
    }
});

async function comprobarSiEsAdmin() {
    try {
        const respuesta = await fetch(`${API_URL}/auth/me`, { method: "GET", credentials: "include" });
        if (!respuesta.ok) { window.location.href = "../inicio_sesion/inicio_de_sesion.html"; return false; }
        const datos = await respuesta.json();
        return datos.usuario.idRol === 2;
    } catch { return false; }
}

async function descargarCategorias() {
    try {
        const respuesta = await fetch(`${API_URL}/categoria`, { method: "GET", credentials: "include" });
        todasLasCategorias = await respuesta.json();
        dibujarTabla(todasLasCategorias);
    } catch (error) { 
        console.error("Error al pedir categorías:", error); 
    }
}

function dibujarTabla(lista) {
    const cuerpo = document.getElementById("cuerpoTablaCategorias");
    cuerpo.innerHTML = "";
    
    lista.forEach((categoria) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${categoria.id}</td>
            <td>${categoria.nombreCategoria}</td> 
            <td>
                <button onclick="prepararEdicion(${categoria.id})">✏️</button>
                <button onclick="borrarCategoria(${categoria.id})">🗑️</button>
            </td>
        `;
        cuerpo.appendChild(fila);
    });
}

async function guardarCategoria(evento) {
    evento.preventDefault();

    const datos = {
        nombreCategoria: document.getElementById("campoNombre").value.trim()
    };

    const url = idCategoriaAEditar ? `${API_URL}/categoria/${idCategoriaAEditar}` : `${API_URL}/categoria`;
    const metodo = idCategoriaAEditar ? "PUT" : "POST";

    try {
        const peticion = await fetch(url, { 
            method: metodo, 
            headers: { "Content-Type": "application/json" }, 
            credentials: "include", 
            body: JSON.stringify(datos) 
        });
        
        const respuestaBackend = await peticion.json();
        
        if (!peticion.ok) {
            console.error("El servidor rechazó la petición:", respuestaBackend);
            alert("Error del servidor: " + (respuestaBackend.mensaje || JSON.stringify(respuestaBackend)));
            return;
        }

        document.getElementById("ventanaModal").style.display = "none";
        descargarCategorias(); 
    } catch (error) { 
        console.error("Error de conexión:", error);
        alert("Fallo de red. El servidor backend podría estar apagado."); 
    }
}

window.prepararEdicion = (id) => {
    const categoria = todasLasCategorias.find(c => c.id === id);
    idCategoriaAEditar = id; 
    
    document.getElementById("campoNombre").value = categoria.nombreCategoria;

    document.getElementById("tituloModal").textContent = "Editar Categoría";
    document.getElementById("btnGuardarFormulario").textContent = "Actualizar Categoría";
    document.getElementById("ventanaModal").style.display = "flex";
};

window.borrarCategoria = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría permanentemente?")) return;
    
    try {
        await fetch(`${API_URL}/categoria/${id}`, { method: "DELETE", credentials: "include" });
        descargarCategorias();
    } catch (error) {
        alert("Error al borrar la categoría.");
    }
};