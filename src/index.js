const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const database = require("./database");
const loginController = require("./Controllers/loginController");
const incidenciasController = require("./Controllers/incidenciasController");

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
app.get("/mostrar_incidentes_por_tecnico", incidenciasController.mostrar_incidencias_por_tecnico);
//app.get("/protected", loginController.authenticateToken, (req, res) => {


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
