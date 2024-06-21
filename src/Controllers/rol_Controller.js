const database = require("../database");

/**
 * Función para mostrar todos los roles.
 * Realiza una consulta a la base de datos para obtener todos los roles.
 *
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 */
const mostrar_roles = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const query = `
            SELECT * FROM t_roles
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

module.exports = {
    mostrar_roles,
};
