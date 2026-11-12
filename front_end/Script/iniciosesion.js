document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  if (!correo || !contrasena) {
    alert("Por favor completa el correo y la contraseña.");
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // Envía y guarda la cookie 'token' configurada por COOKIE_OPTIONS
      body: JSON.stringify({ correo, contrasena })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      // Captura la propiedad 'mensaje' definida en tu controlador
      throw new Error(resultado.mensaje || "Error al iniciar sesión");
    }

    alert("¡Inicio de sesión exitoso!");
    
    // Redirección a la vista home tras guardar la cookie
    window.location.href = "../home/pagina2.html";

  } catch (error) {
    console.error("Error en el login:", error.message);
    alert(`Error: ${error.message}`);
  }
});