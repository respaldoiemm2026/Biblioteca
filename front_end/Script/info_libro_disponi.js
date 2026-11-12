let idLibroActual = null;

document.addEventListener("DOMContentLoaded", () => {
    const parametrosURL = new URLSearchParams(window.location.search);
    idLibroActual = Number(parametrosURL.get("id"));

    if (idLibroActual) {
        cargarInformacionDelLibro(idLibroActual);
    } else {
        alert("No se encontró el libro especificado.");
        window.location.href = "../home/pagina2.html";
    }

    const btnSolicitar = document.getElementById("btnSolicitarLibro");
    if (btnSolicitar) {
        btnSolicitar.addEventListener("click", procesarSolicitudPrestamo);
    }
});

async function cargarInformacionDelLibro(id) {
    try {
        let idUsuarioActual = null;
        try {
            const respuestaAuth = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                credentials: "include"
            });
            if (respuestaAuth.ok) {
                const datosAuth = await respuestaAuth.json();
                idUsuarioActual = datosAuth.usuario.id;
            }
        } catch (error) {
            console.log("Modo visitante (sin sesión activa)");
        }

        const respuesta = await fetch(`${API_URL}/libro`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) throw new Error("El servidor rechazó la petición");

        const todosLosLibros = await respuesta.json();
        const libro = todosLosLibros.find(l => l.id === id);

        if (!libro) throw new Error("El libro no existe en la base de datos");

        document.getElementById("tituloLibro").textContent = libro.titulo || "Título Desconocido";
        document.getElementById("autorLibro").textContent = libro.autor ? libro.autor.nombreAutor : "Autor Desconocido";
        
        let textoCategoria = (libro.tipo || "General").trim();
        document.getElementById("categoriaLibro").textContent = textoCategoria.charAt(0).toUpperCase() + textoCategoria.slice(1).toLowerCase();
        
        document.getElementById("descripcionLibro").textContent = libro.descripcion || "Sin descripción disponible.";
        
        const imgElement = document.getElementById("imagenLibro");
        if (imgElement) {
            imgElement.src = libro.imagen || "https://images.unsplash.com/photo-1544947950-fa07a98d237f";
        }

        const btnSolicitar = document.getElementById("btnSolicitarLibro");
        if (!btnSolicitar) return;

        let miPeticion = null;
        let otraPeticionActiva = false;

        if (libro.detallesPrestamo && libro.detallesPrestamo.length > 0) {
            miPeticion = libro.detallesPrestamo.slice().reverse().find(d => d.idUsuario === idUsuarioActual);
            otraPeticionActiva = libro.detallesPrestamo.some(d => 
                d.prestamo && 
                ["Pendiente", "Aprobado"].includes(d.prestamo.estado) && 
                d.idUsuario !== idUsuarioActual
            );
        }

        if (miPeticion) {
            const miEstado = miPeticion.prestamo?.estado;
            
            if (miEstado === "Aprobado") {
                btnSolicitar.textContent = "Aceptado ✅";
                btnSolicitar.style.backgroundColor = "#27ae60"; 
                btnSolicitar.disabled = true;
                btnSolicitar.style.cursor = "not-allowed";
            } else if (miEstado === "Rechazado") {
                if (otraPeticionActiva) {
                    btnSolicitar.textContent = "Prestado 🔒";
                    btnSolicitar.style.backgroundColor = "#e74c3c"; 
                    btnSolicitar.disabled = true;
                    btnSolicitar.style.cursor = "not-allowed";
                } else {
                    // Muestra el mensaje de rechazo temporalmente
                    btnSolicitar.textContent = "Solicitud Rechazada ❌";
                    btnSolicitar.style.backgroundColor = "#c0392b"; 
                    btnSolicitar.disabled = true;
                    btnSolicitar.style.cursor = "not-allowed";

                    // Después de 4 segundos, vuelve a permitir solicitarlo
                    setTimeout(() => {
                        btnSolicitar.textContent = "Solicitar Préstamo";
                        btnSolicitar.disabled = false;
                        btnSolicitar.style.backgroundColor = ""; 
                        btnSolicitar.style.cursor = "pointer";
                    }, 4000); 
                }
            } else if (miEstado === "Pendiente") {
                btnSolicitar.textContent = "Solicitud Pendiente ⏳";
                btnSolicitar.style.backgroundColor = "#f39c12"; 
                btnSolicitar.disabled = true;
                btnSolicitar.style.cursor = "not-allowed";
            }
        } else if (otraPeticionActiva) {
            btnSolicitar.textContent = "Prestado 🔒";
            btnSolicitar.style.backgroundColor = "#e74c3c"; 
            btnSolicitar.disabled = true;
            btnSolicitar.style.cursor = "not-allowed";
        } else {
            btnSolicitar.textContent = "Solicitar Préstamo";
            btnSolicitar.disabled = false;
            btnSolicitar.style.backgroundColor = ""; 
            btnSolicitar.style.cursor = "pointer";
        }

    } catch (error) {
        console.error("Error al cargar libro:", error);
        document.getElementById("tituloLibro").textContent = "Error de conexión";
        document.getElementById("descripcionLibro").textContent = "No pudimos cargar este libro. Por favor, verifica tu conexión o intenta más tarde.";
    }
}

async function procesarSolicitudPrestamo() {
    const btnSolicitar = document.getElementById("btnSolicitarLibro");
    
    btnSolicitar.textContent = "Procesando...";
    btnSolicitar.disabled = true;

    try {
        const respuestaAuth = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!respuestaAuth.ok) {
            alert("Debes iniciar sesión para solicitar un libro.");
            window.location.href = "../inicio_sesion/inicio_de_sesion.html";
            return;
        }

        const datosAuth = await respuestaAuth.json();
        const idDelUsuario = datosAuth.usuario.id;

        const fechaHoy = new Date();
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaHoy.getDate() + 7); 

        const datosPrestamo = {
            estado: "Pendiente", 
            fechaPrestamo: fechaHoy.toISOString(),
            fechaRegreso: fechaLimite.toISOString() 
        };

        const peticionPrestamo = await fetch(`${API_URL}/prestamo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datosPrestamo)
        });

        const respuestaBackendPrestamo = await peticionPrestamo.json();

        if (!peticionPrestamo.ok) {
            throw new Error(respuestaBackendPrestamo.mensaje || "Error al crear el préstamo base");
        }

        const datosDetalle = {
            idUsuario: idDelUsuario,
            idPrestamo: respuestaBackendPrestamo.id, 
            idLibro: idLibroActual
        };

        const peticionDetalle = await fetch(`${API_URL}/detalleprestamo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datosDetalle)
        });

        if (!peticionDetalle.ok) {
            const respuestaBackendDetalle = await peticionDetalle.json();
            throw new Error(respuestaBackendDetalle.mensaje || "Error al enlazar el libro");
        }

        alert("¡Solicitud enviada exitosamente! Un administrador revisará tu petición.");
        btnSolicitar.textContent = "Solicitud Pendiente ⏳";
        btnSolicitar.style.backgroundColor = "#f39c12"; 
        btnSolicitar.style.cursor = "not-allowed";

    } catch (error) {
        console.error("Fallo general:", error);
        alert(error.message);
        btnSolicitar.textContent = "Solicitar Préstamo";
        btnSolicitar.disabled = false;
        btnSolicitar.style.backgroundColor = ""; 
        btnSolicitar.style.cursor = "pointer";
    }
}