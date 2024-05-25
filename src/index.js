const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const database = require("./database");
const loginController = require("./Controllers/login_Controller");
const incidenciasController = require("./Controllers/incidencias_Controller");
const imagen_controller = require('./Controllers/imagen_Controller');
const diagnosticos_controller = require("./Controllers/diagnostico_Controller");

dotenv.config();

const app = express();
app.set("port", 3000);

// Configurar CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8100'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.listen(app.get("port"), () => {
  console.log("Hello world, I'm listening on " + app.get("port"));
});

app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.post("/registrar", loginController.register);
app.post("/login", loginController.login);
//Tomar todos los incidentes
app.get("/mostrar_incidentes", incidenciasController.mostrar_incidencias_general);
app.get("/mostrar_incidencias_por_usuario", incidenciasController.mostrar_incidencias_por_usuario);
app.get("/mostrar_incidentes_por_id/:ct_id_incidencia?", incidenciasController.mostrar_incidencias_por_id);
app.post("/registrar_incidencia", incidenciasController.registrar_incidencias);
app.get("/verificar_id", incidenciasController.verificar_id);
//Imagenes
app.post("/guardar_imagen", imagen_controller.guardar_imagen);
//Diagnosticos
app.get("/mostrar_diagnosticos", diagnosticos_controller.mostrar_diagnosticos_general);
app.get("/mostrar_diagnosticos_por_tecnico", diagnosticos_controller.mostrar_diagnosticos_por_tecnico);
app.post("/registrar_diagnosticos", diagnosticos_controller.registrar_diagnosticos);


app.get("/prueba", async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query("SELECT * FROM t_sistemas");
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal Server Error");
  }
});
