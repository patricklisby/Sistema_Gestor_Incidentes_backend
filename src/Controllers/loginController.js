const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../database");

const register = async (req, res) => {
  try {
    const { ct_nombre_completo, ct_cedula, ct_descripcion_puesto,ct_celular,ct_id_departamento,ct_correo_institucional,ct_contrasena,cn_id_rol } = req.body;
    const hashedPassword = await bcrypt.hash(ct_contrasena, 10);
    const connection = await database.getConnection();
    await connection.query(
      "INSERT INTO t_usuarios (ct_nombre_completo, ct_cedula, ct_descripcion_puesto,ct_celular,ct_id_departamento,ct_correo_institucional,ct_contrasena,cn_id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ct_nombre_completo, ct_cedula, ct_descripcion_puesto,ct_celular,ct_id_departamento,ct_correo_institucional,hashedPassword,cn_id_rol]
    );
    res.status(201).json({ message: "Se ha registrado correctamente" });
  } catch (error) {
    console.error("Error registrar usuario:", error);
    res.status(500).send("Error servidor");
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { ct_correo_institucional, ct_contrasena } = req.body;
    console.log(ct_correo_institucional + " "+ ct_contrasena);
    const connection = await database.getConnection();
    const [user] = await connection.query(
      "SELECT * FROM t_usuarios WHERE ct_correo_institucional = ?",
      [ct_correo_institucional]
    );
    if (user && await bcrypt.compare(ct_contrasena, user.ct_contrasena)) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
};


/**
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
 */

module.exports = { register, login };//, authenticateToken
