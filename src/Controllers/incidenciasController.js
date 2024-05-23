const database = require("../database");

/**
 * Crear incidencias 
 * Ver las incidencias
 * Filtros de las incidencias por categoria, trabajo
 */

const mostrar_incidencias_general = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const [result] = await connection.query("SELECT * FROM t_incidencias");
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error("Error :", error);
        res.status(500).send("Server error");
    } finally {
        if (connection) {
            try {
                await connection.release(); //liberar la conexión
            } catch (releaseError) {
                console.error("Error al liberar conexion:", releaseError);
            }
        }
    }
};//Fin mostrar_incidencias_general

const mostrar_incidencias_por_tecnico = async (req, res) => {
    let connection;
    try {
        const {cn_id_usuario} = req.body;
        console.log(cn_id_usuario);
        connection = await database.getConnection();
        const [result] = await connection.query("SELECT * FROM t_incidencias where cn_id_usuario_registro = ?",[cn_id_usuario]);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error("Error :", error);
        res.status(500).send("Server error");
    } finally {
        if (connection) {
            try {
                await connection.release(); //liberar la conexión
            } catch (releaseError) {
                console.error("Error al liberar conexion:", releaseError);
            }
        }
    }
};//Fin mostrar_incidencias_general

const registrar_incidencias = async (req, res) => {
    let connection;
    try {
        const {ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar} = req.body;
        
        connection = await database.getConnection();
        const [result] = await connection.query("insert into t_incidencias (ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar");
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error("Error :", error);
        res.status(500).send("Server error");
    } finally {
        if (connection) {
            try {
                await connection.release(); //liberar la conexión
            } catch (releaseError) {
                console.error("Error al liberar conexion:", releaseError);
            }
        }
    }
};//Fin mostrar_incidencias_general

module.exports = {
    mostrar_incidencias_general,
    mostrar_incidencias_por_tecnico
}