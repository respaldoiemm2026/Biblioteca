let todosLosLibros = [];
let todasLasCategorias = [];

document.addEventListener("DOMContentLoaded", async () => {
    await descargarDatosParaElCatalogo();

    const buscador = document.getElementById("inputBuscarLibroCards");
    if (buscador) buscador.addEventListener("input", filtrarAgrupados);
});

async function descargarDatosParaElCatalogo() {
    try {
        console.log("Iniciando descarga de datos...");

        const peticionCategorias = await fetch(`${API_URL}/categoria`, { credentials: "include" });
        if (peticionCategorias.ok) {
            todasLasCategorias = await peticionCategorias.json();
            console.log("Categorías descargadas:", todasLasCategorias);
        }

        const peticionLibros = await fetch(`${API_URL}/libro`, { credentials: "include" });
        if (peticionLibros.ok) {
            todosLosLibros = await peticionLibros.json();
            console.log("Libros descargados:", todosLosLibros);
        }

        dibujarLibrosConSalvavidas(todosLosLibros, todasLasCategorias);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("Error de conexión al intentar descargar los libros.");
    }
}

function dibujarLibrosConSalvavidas(libros, categoriasOficiales) {
    const contenedor = document.getElementById("contenedorLibrosCards");
    if (!contenedor) return;
    
    contenedor.innerHTML = ""; 
    contenedor.className = ""; 

    if (!libros || libros.length === 0) {
        contenedor.innerHTML = "<p style='padding: 20px; font-size: 18px;'>No hay libros en la biblioteca o no se pudieron cargar.</p>";
        return;
    }

    let librosSinAcomodar = [...libros];

    // 1. DIBUJAR CATEGORÍAS OFICIALES
    if (categoriasOficiales && categoriasOficiales.length > 0) {
        categoriasOficiales.forEach(categoria => {
            // BLINDAJE: Si nombreCategoria viene nulo, no se estrella, usa un texto vacío
            const nombreSeguro = categoria.nombreCategoria || "Sin Nombre";
            const nombreCatOficial = nombreSeguro.toLowerCase().trim();

            const librosDeEstaCategoria = librosSinAcomodar.filter(libro => {
                return (libro.tipo || "").toLowerCase().trim() === nombreCatOficial;
            });

            librosSinAcomodar = librosSinAcomodar.filter(libro => {
                return (libro.tipo || "").toLowerCase().trim() !== nombreCatOficial;
            });

            const tituloFormateado = nombreSeguro.charAt(0).toUpperCase() + nombreSeguro.slice(1).toLowerCase();
            construirSeccionHTML(contenedor, tituloFormateado, librosDeEstaCategoria);
        });
    }

    // 2. DIBUJAR LOS LIBROS HUÉRFANOS (o todos si no hay categorías)
    if (librosSinAcomodar.length > 0) {
        const gruposSobrantes = {};
        
        librosSinAcomodar.forEach(libro => {
            const categoriaFaltante = libro.tipo || "Sin Categoría";
            const catFormateada = categoriaFaltante.charAt(0).toUpperCase() + categoriaFaltante.slice(1).toLowerCase();
            
            if (!gruposSobrantes[catFormateada]) gruposSobrantes[catFormateada] = [];
            gruposSobrantes[catFormateada].push(libro);
        });

        for (const nombreCat in gruposSobrantes) {
            construirSeccionHTML(contenedor, nombreCat + " (⚠️ Falta registrar en panel)", gruposSobrantes[nombreCat]);
        }
    }
}

function construirSeccionHTML(contenedor, titulo, listaLibros) {
    const seccionHTML = document.createElement("div");
    seccionHTML.style.marginBottom = "50px";
    seccionHTML.style.width = "100%";

    const tituloSeccion = document.createElement("h2");
    tituloSeccion.textContent = titulo;
    tituloSeccion.style.borderBottom = "2px solid #2c4a85";
    tituloSeccion.style.paddingBottom = "10px";
    tituloSeccion.style.marginBottom = "20px";
    tituloSeccion.style.color = "#1e2b4d";

    const gridLibros = document.createElement("div");
    gridLibros.className = "grid-libros";
    gridLibros.style.display = "grid";
    gridLibros.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
    gridLibros.style.gap = "20px";

    if (listaLibros.length > 0) {
        listaLibros.forEach(libro => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "card";
            tarjeta.style.cursor = "pointer"; // Para que el ratón cambie a manito
            tarjeta.onclick = () => window.location.href = `../info_libro_disponi/Info_libro_disponi.html?id=${libro.id}`;
            
            const nombreTag = titulo.split(" (")[0];

            tarjeta.innerHTML = `
                <span class="tag">${nombreTag}</span>
                <div class="book-cover">
                    <img src="${libro.imagen || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'}" alt="Portada" class="imagenes">
                </div>
                <h3>${libro.titulo || 'Sin título'}</h3>
                <p>${libro.autor ? libro.autor.nombreAutor : "Sin Autor"}</p>
            `;
            gridLibros.appendChild(tarjeta);
        });
    } else {
        gridLibros.innerHTML = "<p style='grid-column: 1 / -1; color: #777;'>Aún no hay libros en esta categoría.</p>";
    }

    seccionHTML.appendChild(tituloSeccion);
    seccionHTML.appendChild(gridLibros);
    contenedor.appendChild(seccionHTML);
}

function filtrarAgrupados(evento) {
    const palabra = evento.target.value.toLowerCase().trim();
    
    const filtrados = todosLosLibros.filter(libro => {
        const titulo = (libro.titulo || "").toLowerCase();
        // BLINDAJE: Verificamos que autor y nombreAutor existan antes de buscar
        const autor = libro.autor && libro.autor.nombreAutor ? libro.autor.nombreAutor.toLowerCase() : "";
        return titulo.includes(palabra) || autor.includes(palabra);
    });
    
    dibujarLibrosConSalvavidas(filtrados, todasLasCategorias);
}