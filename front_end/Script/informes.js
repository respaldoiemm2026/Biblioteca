let listaCompletaLibros = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarDatosLibros();
    
    const btnGenerarPDF = document.getElementById("btnGenerarPDF");
    if (btnGenerarPDF) {
        btnGenerarPDF.addEventListener("click", generarPDF);
    }
});

async function cargarDatosLibros() {
    try {
        const respuesta = await fetch(`${API_URL}/libro`, {
            method: "GET",
            credentials: "include"
        });
        if (!respuesta.ok) throw new Error("No se pudieron cargar los libros");
        
        listaCompletaLibros = await respuesta.json();
    } catch (error) { 
        console.error("Error al cargar libros:", error); 
    }
}

function generarPDF() {
    // 1. Obtenemos lo que el usuario escribió
    const categoriaBuscada = document.getElementById("inputBuscarCategoria").value.trim().toLowerCase();
    let librosParaInforme = listaCompletaLibros;

    // 2. Si escribió algo, filtramos
    if (categoriaBuscada !== "") {
        librosParaInforme = listaCompletaLibros.filter(libro => {
            const tipo = (libro.tipo || "General").trim().toLowerCase();
            return tipo.includes(categoriaBuscada);
        });

        // 3. Validar si encontró resultados (EL MENSAJE QUE PEDISTE)
        if (librosParaInforme.length === 0) {
            alert(`No se encontró la categoría "${categoriaBuscada}". Verifica que esté bien escrita.`);
            return; // Detiene la generación del PDF
        }
    } else if (librosParaInforme.length === 0) {
        alert("No hay libros en la base de datos.");
        return;
    }

    // 4. Inicializar jsPDF
    const { jsPDF } = window.jspdf;
    const documento = new jsPDF();

    documento.setFontSize(18);
    documento.setTextColor(30, 43, 77);
    documento.text("Informe de Inventario - Biblioteca", 14, 20);
    
    documento.setFontSize(11);
    documento.setTextColor(100);
    const textoFiltro = categoriaBuscada === "" ? "Todos los libros" : `Categoría: ${categoriaBuscada.toUpperCase()}`;
    documento.text(`Filtro: ${textoFiltro} | Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    const columnas = ["ISBN", "Título", "Autor", "Editorial", "Categoría"];
    const filas = librosParaInforme.map(libro => [
        libro.ISBN || "N/A",
        libro.titulo || "Sin título",
        libro.autor ? libro.autor.nombreAutor : "Desconocido",
        libro.editorial ? libro.editorial.nombre : "Desconocida",
        (libro.tipo || "General").trim()
    ]);

    documento.autoTable({
        startY: 35,
        head: [columnas],
        body: filas,
        theme: 'striped',
        headStyles: { fillColor: [30, 43, 77] },
        styles: { fontSize: 9, cellPadding: 5 }
    });

    documento.save(`Informe_${new Date().getTime()}.pdf`);
}