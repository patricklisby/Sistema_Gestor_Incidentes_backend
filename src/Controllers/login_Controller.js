const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../database");

const register = async (req, res) => {
  const connection = await database.getConnection();
  await connection.beginTransaction();
  try {
    const {
      ct_nombre_completo,
      ct_cedula,
      ct_descripcion_puesto,
      ct_celular,
      ct_id_departamento,
      ct_correo_institucional,
      ct_contrasena,
      cn_id_rol
    } = req.body;

    const hashedPassword = await bcrypt.hash(ct_contrasena, 10);

    // Inserta el usuario en la tabla t_usuarios
    const userResult = await connection.query(
      "INSERT INTO t_usuarios (ct_nombre_completo, ct_cedula, ct_descripcion_puesto, ct_celular, ct_id_departamento, ct_correo_institucional, ct_contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        ct_nombre_completo,
        ct_cedula,
        ct_descripcion_puesto,
        ct_celular,
        ct_id_departamento,
        ct_correo_institucional,
        hashedPassword
      ]
    );

    const cn_id_usuario = userResult.insertId;

    // Verifica si cn_id_rol es un array y si tiene roles
    if (Array.isArray(cn_id_rol) && cn_id_rol.length > 0) {
      const roleQueries = cn_id_rol.map(rol =>
        connection.query(
          "INSERT INTO t_roles_por_usuario (cn_id_usuario, cn_id_rol) VALUES (?, ?)",
          [cn_id_usuario, rol]
        )
      );
      await Promise.all(roleQueries);
    } else {
      // Si no es un array o está vacío, devuelve un error
      throw new Error("El campo cn_id_rol debe ser un array con al menos un rol.");
    }

    await connection.commit();
    res.status(201).json({ message: "Se ha registrado correctamente" });
  } catch (error) {
    await connection.rollback();
    console.error("Error registrar usuario:", error);
    res.status(500).send("Error servidor");
  } finally {
    connection.release();
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
      const token = jwt.sign(
        { userId: user.cn_id_usuario, nombre: user.ct_nombre_completo },
        process.env.JWT_SECRET
      );
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
  let connection;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    connection = await database.getConnection();
    await connection.query(
      "UPDATE t_usuarios SET ct_token = NULL WHERE cn_id_usuario = ?",
      [userId]
    );
    res.json({ message: "Logout exitoso" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { register, login, logout };
