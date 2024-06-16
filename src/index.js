const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require('express-session');
const auth = require('../middleware/auth');

const database = require("./database");

const login_controller = require("./Controllers/login_Controller");
const incidencias_controller = require("./Controllers/incidencias_Controller");
const imagen_controller = require('./Controllers/imagen_Controller');
const diagnosticos_controller = require("./Controllers/diagnostico_Controller");
const usuarios_controller = require("./Controllers/usuarios_Controller");
const rol_controller = require("./Controllers/rol_Controller");
const admin_controller = require("./Controllers/admin_controller");

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
app.post("/registrar", login_controller.register);
app.post("/login", login_controller.login);
app.post("/logout", auth, login_controller.logout);

// Rutas de incidencias
app.get("/mostrar_incidentes", incidencias_controller.mostrar_incidencias_general);
app.get("/mostrar_incidencias_por_usuario", incidencias_controller.mostrar_incidencias_por_usuario);
app.get("/mostrar_incidentes_por_id/:ct_id_incidencia?", incidencias_controller.mostrar_incidencias_por_id);
app.post('/registrar_incidencia', upload, incidencias_controller.registrar_incidencias);
app.get("/verificar_id", incidencias_controller.verificar_id);

app.post("/asignar_incidentes", incidencias_controller.asignar_incidencias);
//Usuarios
app.get("/mostrar_tecnicos", usuarios_controller.mostrar_tecnicos);
app.get("/mostrar_usuarios", usuarios_controller.mostrar_usuarios);
app.get("/mostrar_departamentos", admin_controller.mostrar_departamentos);

// Rutas de imágenes
app.post("/guardar_imagen", imagen_controller.upload.single('image'), imagen_controller.guardar_imagen);
app.get("/mostrar_imagenes", imagen_controller.mostrar_imagenes);

// Rutas de diagnósticos
app.get("/mostrar_diagnosticos", diagnosticos_controller.mostrar_diagnosticos_general);
app.post("/mostrar_diagnosticos_por_tecnico", diagnosticos_controller.mostrar_diagnosticos_por_tecnico);
app.get("/mostrar_diagnosticos_id_incidencia/:ct_id_incidencia?", diagnosticos_controller.mostrar_diagnosticos_por_id_incidencia);
app.post("/registrar_diagnosticos", upload, diagnosticos_controller.registrar_diagnosticos);

//Ruta roles
app.get("/mostrar_roles", rol_controller.mostrar_roles);


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
