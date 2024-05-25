const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../database");

const register = async (req, res) => {
  try {
    const { ct_nombre_completo, ct_cedula, ct_descripcion_puesto, ct_celular, ct_id_departamento, ct_correo_institucional, ct_contrasena, cn_id_rol } = req.body;
    const hashedPassword = await bcrypt.hash(ct_contrasena, 10);
    const connection = await database.getConnection();
    await connection.query(
      "INSERT INTO t_usuarios (ct_nombre_completo, ct_cedula, ct_descripcion_puesto, ct_celular, ct_id_departamento, ct_correo_institucional, ct_contrasena, cn_id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ct_nombre_completo, ct_cedula, ct_descripcion_puesto, ct_celular, ct_id_departamento, ct_correo_institucional, hashedPassword, cn_id_rol]
    );
    res.status(201).json({ message: "Se ha registrado correctamente" });
  } catch (error) {
    console.error("Error registrar usuario:", error);
    res.status(500).send("Error servidor");
  }
};

const login = async (req, res) => {
  try {
    const { ct_correo_institucional, ct_contrasena } = req.body;
    const connection = await database.getConnection();
    const [user] = await connection.query(
      "SELECT * FROM t_usuarios WHERE ct_correo_institucional = ?",
      [ct_correo_institucional]
    );
    if (user && await bcrypt.compare(ct_contrasena, user.ct_contrasena)) {
      
      const token = jwt.sign({ userId: user.cn_id_usuario }, process.env.JWT_SECRET);
      await connection.query(
        "UPDATE t_usuarios SET ct_token = ? WHERE cn_id_usuario = ?",
        [token, user.cn_id_usuario]
      );
      res.json({ token });
    } else {
      res.status(401).send("Credenciales inválidas");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const logout = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "No autorizado" });
    }
    const userId = req.userId;
    const connection = await database.getConnection();

    await connection.query(
      "UPDATE t_usuarios SET ct_token = NULL WHERE cn_id_usuario = ?",
      [userId]
    );
    res.json({ message: "Logout exitoso" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);

    res.status(500).send("Error interno del servidor");
  } finally {
  }
};

module.exports = { register, login, logout };
