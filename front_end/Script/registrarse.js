document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault(); // Detiene el envío del formulario para que no recargue la página

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const curso = document.getElementById("curso").value.trim(); // Capturamos el curso

  if (!correo || !contrasena || !nombre || !curso) {
    alert("Por favor completa todos los campos requeridos (correo, contraseña, nombre y curso).");
    return;
  }

  const usuarioData = { correo, contrasena, nombre, curso };

  try {
    // RUTA CORREGIDA: /auth/registro
    const respuesta = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioData)
    });

    const esJson = respuesta.headers.get("content-type")?.includes("application/json");

    if (!esJson) {
      throw new Error("La ruta del servidor no devolvió JSON (verifica que el backend esté encendido en el puerto 3000).");
    }

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || resultado.error || "Error al registrar el usuario");
    }

    alert("¡Usuario registrado con éxito!");
    
    window.location.href = "../inicio_sesion/inicio_de_sesion.html";

  } catch (error) {
    console.error("Error en el registro:", error.message);
    alert(`Error: ${error.message}`);
  }
});