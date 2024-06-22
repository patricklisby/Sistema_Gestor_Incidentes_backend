const database = require("../database");

const mostrar_tecnicos = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();

        const query = `
            SELECT usr.*, COALESCE(asignaciones.cantidad, 0) as cantidad_asignaciones
            FROM t_usuarios usr
            JOIN t_roles_por_usuario upr ON upr.cn_id_usuario = usr.cn_id_usuario
            LEFT JOIN (
                SELECT cn_id_usuario, COUNT(*) as cantidad
                FROM t_asignacion_incidencia_empleados
                GROUP BY cn_id_usuario
            ) asignaciones ON usr.cn_id_usuario = asignaciones.cn_id_usuario
            WHERE upr.cn_id_rol = 4
            ORDER BY cantidad_asignaciones ASC
        `;

        const results = await connection.query(query);

        const usuarios = results.map(usuario => ({
            ...usuario,
            cb_imagen: usuario.cb_imagen ? usuario.cb_imagen.toString('base64') : null
        }));

        res.json(usuarios);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error " + error.message);
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                console.error("Error al liberar conexión:", releaseError);
            }
        }
    }
};

const mostrar_usuarios = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();

        const query = `
            SELECT * from t_usuarios
        `;

        const results = await connection.query(query);

        res.json(results);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error " + error.message);
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                console.error("Error al liberar conexión:", releaseError);
            }
        }
    }
};

const obtener_email_usuario = async (cn_id_usuario) => {
    const connection = await database.getConnection();
    const rows = await connection.query('SELECT ct_correo_institucional FROM t_usuarios WHERE cn_id_usuario = ?', [cn_id_usuario]);
    connection.release();
    return rows.length ? rows[0].ct_correo_institucional : null;
};


module.exports = {
    mostrar_tecnicos,
    mostrar_usuarios,
    obtener_email_usuario
};
