document.addEventListener("DOMContentLoaded", () => {
    descargarSolicitudesPrestamo();
});

async function descargarSolicitudesPrestamo() {
    try {
        const respuesta = await fetch(`${API_URL}/detalleprestamo`, {
            method: "GET",
            credentials: "include"
        });

        if (!respuesta.ok) throw new Error("No se pudieron cargar las solicitudes");

        const listaDetalles = await respuesta.json();
        dibujarTablaPrestamos(listaDetalles);

    } catch (error) {
        console.error("Error al obtener los préstamos:", error);
    }
}

function dibujarTablaPrestamos(detalles) {
    const cuerpoTabla = document.getElementById("cuerpoTablaPrestamos");
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = "";

    if (!detalles || detalles.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #777;">No hay solicitudes de préstamo registradas.</td></tr>`;
        return;
    }

    detalles.forEach(detalle => {
        const fila = document.createElement("tr");

        const idDetalle = detalle.id;
        const nombreEstudiante = detalle.usuario ? detalle.usuario.nombre : "Estudiante desconocido";
        const tituloLibro = detalle.libro ? detalle.libro.titulo : "Libro desconocido";
        
        const fechaCruda = detalle.prestamo?.fechaPrestamo;
        const fechaFormateada = fechaCruda ? new Date(fechaCruda).toLocaleDateString() : "Sin fecha";
        
        const estado = detalle.prestamo?.estado || "Pendiente";

        fila.innerHTML = `
            <td>#${idDetalle}</td>
            <td>${nombreEstudiante}</td>
            <td>${tituloLibro}</td>
            <td>${fechaFormateada}</td>
            <td><span class="badge badge-${estado.toLowerCase()}">${estado}</span></td>
            <td>
                <button onclick="cambiarEstadoPrestamo(${idDetalle}, 'Aprobado')" class="btn-aprobar">Aprobado</button>
                <button onclick="cambiarEstadoPrestamo(${idDetalle}, 'Rechazado')" class="btn-rechazar">Rechazado</button>
            </td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}

// Función encargada de comunicarse con el backend para aprobar o rechazar
// Función encargada de comunicarse con el backend para aprobar o rechazar
async function cambiarEstadoPrestamo(idDetalle, nuevoEstado) {
    try {
        // 1. Primero actualizamos el estado (para que se ponga rojo visualmente)
        const respuesta = await fetch(`${API_URL}/detalleprestamo/${idDetalle}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo actualizar el estado del préstamo");
        }

        // Recargamos la tabla para ver reflejado el cambio de color e insignia al instante
        descargarSolicitudesPrestamo();

        // 2. Si el nuevo estado es "Rechazado", activamos el temporizador de 5 segundos
        if (nuevoEstado === "Rechazado") {
            setTimeout(async () => {
                try {
                    // Enviamos la petición DELETE para borrar la solicitud permanentemente
                    const peticionBorrar = await fetch(`${API_URL}/detalleprestamo/${idDetalle}`, {
                        method: "DELETE",
                        credentials: "include"
                    });

                    if (peticionBorrar.ok) {
                        console.log(`La solicitud #${idDetalle} fue eliminada tras 5 segundos.`);
                        // Volvemos a descargar la lista para que desaparezca de la tabla
                        descargarSolicitudesPrestamo();
                    } else {
                        console.error("El backend no pudo borrar la solicitud.");
                    }
                } catch (err) {
                    console.error("Error al intentar borrar la solicitud rechazada:", err);
                }
            }, 5000); // 5000 milisegundos = 5 segundos
        }

    } catch (error) {
        console.error("Error al cambiar el estado:", error);
        alert("Hubo un error al procesar la solicitud.");
    }
}