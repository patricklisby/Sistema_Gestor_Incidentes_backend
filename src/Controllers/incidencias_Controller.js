const database = require("../database");

/**
 * Crear incidencias 
 * Ver las incidencias
 * Filtros de las incidencias por categoria, trabajo
 */

const mostrar_incidencias_general = async (req, res) => {
    let connection;
    try {
        // Obtener una conexión del pool
        connection = await database.getConnection();

        // Realizar la consulta a la base de datos
        const results = await connection.query("SELECT * FROM t_incidencias");

        // Depuración: Verificar el contenido de los resultados
        console.log("Número de incidencias:", results.length);
        console.log("Resultados:", results);

        // Devolver los resultados en formato JSON
        res.json(results);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error");
    } finally {
        if (connection) {
            try {
                connection.release(); // Liberar la conexión
            } catch (releaseError) {
                console.error("Error al liberar conexión:", releaseError);
            }
        }
    }
};


const mostrar_incidencias_por_tecnico = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario } = req.body;
        console.log(cn_id_usuario);

        // Obtener una conexión del pool
        connection = await database.getConnection();

        // Realizar la consulta a la base de datos
        const result = await connection.query("SELECT * FROM t_incidencias where cn_id_usuario_registro = ?", [cn_id_usuario]);

        // Depuración: Verificar el contenido de los resultados
        console.log("Resultados:", result);

        // Devolver los resultados en formato JSON
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error");
    } finally {
        if (connection) {
            try {
                connection.release(); // Liberar la conexión
            } catch (releaseError) {
                console.error("Error al liberar conexión:", releaseError);
            }
        }
    }
};

const verificar_id = async () => {
    try {
        // Obtener una conexión del pool
        const connection = await database.getConnection();

        // Realizar la consulta a la base de datos
        const result = await connection.query("SELECT ct_id_incidencia FROM t_incidencias ORDER BY cf_fecha_completa_incidencia DESC LIMIT 1");

        //console.log("Consulta", result);

        let newId;
        if (result.length > 0) {
            const lastId = result[0].ct_id_incidencia;
            //console.log("No estoy vacio", lastId);

            // Extraer la parte numérica e incrementarla
            const numericPart = parseInt(lastId.split('-')[1], 10);
            const incrementedPart = (numericPart + 1).toString().padStart(6, '0');
            newId = `2024-${incrementedPart}`;
        } else {
            console.log("Estoy vacio", result);
            newId = '2024-000001';
        }

        // Devolver el nuevo ID
        return newId;
       //res.json(newId);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

const registrar_incidencias = async (req, res) => {
    let connection;
    try {
        const { ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cn_id_usuario_registro } = req.body;

        // Obtener el nuevo ID
        const ct_id_incidencia = await verificar_id();
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const cf_fecha_completa_incidencia = formattedDate;

        const cn_id_estado = 1;
        //console.log("ID ", ct_id_incidencia);

        connection = await database.getConnection();

        // Insertar la incidencia en la base de datos
        const [result] = await connection.query("INSERT INTO t_incidencias (ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro ) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro]);

        //console.log(result);
        res.json(result);
    } catch (error) {
        //console.error("Error:", error);
        res.send(error.code +" Server error "+error.message);
    }
};

module.exports = {
    mostrar_incidencias_general,
    mostrar_incidencias_por_tecnico,
    registrar_incidencias,
    verificar_id
}