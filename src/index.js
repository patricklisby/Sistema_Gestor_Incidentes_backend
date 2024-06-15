const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require('express-session');
const auth = require('../middleware/auth');

const database = require("./database");

const loginController = require("./Controllers/login_Controller");
const incidenciasController = require("./Controllers/incidencias_Controller");
const imagenController = require('./Controllers/imagen_Controller');
const diagnosticosController = require("./Controllers/diagnostico_Controller");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10); // Permite hasta 10 imágenes

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

// Configurar express-session
app.use(session({
  secret: 'this_is_a_secure_key', // Cambia esto a una clave segura
  resave: false,
  saveUninitialized: true
}));

app.listen(app.get("port"), () => {
  console.log("Hello world, I'm listening on " + app.get("port"));
});

app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.post("/registrar", loginController.register);
app.post("/login", loginController.login);
app.post("/logout", auth, loginController.logout);

// Rutas de incidencias
app.get("/mostrar_incidentes", incidenciasController.mostrar_incidencias_general);
app.get("/mostrar_incidencias_por_usuario", incidenciasController.mostrar_incidencias_por_usuario);
app.get("/mostrar_incidentes_por_id/:ct_id_incidencia?", incidenciasController.mostrar_incidencias_por_id);
app.post('/registrar_incidencia', upload, incidenciasController.registrar_incidencias);
app.get("/verificar_id", incidenciasController.verificar_id);

app.post("/asignar_incidentes", incidenciasController.asignar_incidencias);

// Rutas de imágenes
app.post("/guardar_imagen", imagenController.upload.single('image'), imagenController.guardar_imagen);
app.get("/mostrar_imagenes", imagenController.mostrar_imagenes);

// Rutas de diagnósticos
app.get("/mostrar_diagnosticos", diagnosticosController.mostrar_diagnosticos_general);
app.post("/mostrar_diagnosticos_por_tecnico", diagnosticosController.mostrar_diagnosticos_por_tecnico);
app.get("/mostrar_diagnosticos_id_incidencia/:ct_id_incidencia?", diagnosticosController.mostrar_diagnosticos_por_id_incidencia);
app.post("/registrar_diagnosticos", upload, diagnosticosController.registrar_diagnosticos);


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
