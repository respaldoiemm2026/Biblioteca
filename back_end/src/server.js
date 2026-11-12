import app from "./app.js";

const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET"];
const faltantes = REQUIRED_ENV.filter((nombre) => !process.env[nombre]);

if (faltantes.length > 0) {
  console.error(`Faltan variables de entorno: ${faltantes.join(", ")}`);
  process.exit(1);
}

// Render asigna el puerto en la variable PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
