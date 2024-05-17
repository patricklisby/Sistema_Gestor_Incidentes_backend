const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const database = require("./database");
const loginController = require("./Controllers/loginController");

dotenv.config();

const app = express();
app.set("port", 4000);

app.listen(app.get("port"), () => {
  console.log("Hello world, I'm listening on " + app.get("port"));
});

app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.post("/registrar", loginController.register);
app.post("/login", loginController.login);
app.get("/protected", loginController.authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

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
