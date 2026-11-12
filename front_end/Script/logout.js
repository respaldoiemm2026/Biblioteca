async function ejecutarLogout() {
    try {
        const respuesta = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // credentials: "include" es obligatorio para que Express reciba y borre la cookie 'token'
            credentials: "include" 
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Limpieza del navegador y redirección al login
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "../inicio_sesion/inicio_de_sesion.html";
        } else {
            alert("Error al cerrar sesión: " + (datos.mensaje || "Error desconocido"));
        }
    } catch (error) {
        console.error("Error de red al cerrar sesión:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

// Cuando la página cargue, busca el botón de salir y actívalo
document.addEventListener("DOMContentLoaded", () => {
    const btnSalir = document.getElementById("btnSalir");
    if (btnSalir) {
        btnSalir.addEventListener("click", ejecutarLogout);
    }
});