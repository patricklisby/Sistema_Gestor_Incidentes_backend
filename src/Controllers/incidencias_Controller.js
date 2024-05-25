const database = require("../database");


const mostrar_incidencias_general = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * FROM t_incidencias");
        //console.log("Número de incidencias:", results.length);
        //console.log("Resultados:", results);
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

const mostrar_incidencias_por_usuario = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario_registro } = req.body;
        console.log(cn_id_usuario_registro);
        connection = await database.getConnection();
        const result = await connection.query("SELECT * FROM t_incidencias where cn_id_usuario_registro = ?", [cn_id_usuario_registro]);
        console.log("Resultados:", result);
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

const mostrar_incidencias_por_id = async (req, res) => {
    let connection;
    try {
        let ct_id_incidencia;
        if (req.params.ct_id_incidencia) {
            ct_id_incidencia = req.params.ct_id_incidencia;
        } else if (req.body.ct_id_incidencia) {
            ct_id_incidencia = req.body.ct_id_incidencia;
        } else {
            throw new Error('ct_id_incidencia no encontrado en la URL ni en el cuerpo de la solicitud');
        }
        //console.log(ct_id_incidencia);
        connection = await database.getConnection();
        const result = await connection.query("SELECT * FROM t_incidencias where ct_id_incidencia = ?", [ct_id_incidencia]);
       // console.log("Resultados:", result);
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
            //console.log("Ultimo id", lastId);
            //Cambiar esto por el año
            //const year = new Date().getFullYear();
            const numericPart = parseInt(lastId.split('-')[1], 10);
            const incrementedPart = (numericPart + 1).toString().padStart(6, '0');
            newId = `2024-${incrementedPart}`;
        } else {
            //console.log("Estoy vacio", result);
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
        const result = await connection.query("INSERT INTO t_incidencias (ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro ) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
    mostrar_incidencias_por_usuario,
    registrar_incidencias,
    verificar_id,
    mostrar_incidencias_por_id
}