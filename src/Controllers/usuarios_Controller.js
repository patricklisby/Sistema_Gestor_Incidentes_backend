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


module.exports = {
    mostrar_tecnicos
};
