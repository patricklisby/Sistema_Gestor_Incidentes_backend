const database = require("../database");

const mostrar_tecnicos = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT usr. * from t_usuarios`
        );

        const incidencias = results.map(incidencia => ({
            ...incidencia,
            cb_imagen: incidencia.cb_imagen ? incidencia.cb_imagen.toString('base64') : null
        }));

        res.json(incidencias);
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
};