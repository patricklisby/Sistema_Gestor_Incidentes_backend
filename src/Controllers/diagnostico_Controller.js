const database = require("../database");



const mostrar_diagnosticos_general = async (req, res) => {
    let connection;
    try {
        // Obtener una conexión del pool
        connection = await database.getConnection();

        // Realizar la consulta a la base de datos
        const results = await connection.query("SELECT * FROM t_registro_diagnosticos");

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


const mostrar_diagnosticos_por_tecnico = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario } = req.body;
        console.log(cn_id_usuario);

        // Obtener una conexión del pool
        connection = await database.getConnection();

        // Realizar la consulta a la base de datos
        const result = await connection.query("SELECT * FROM t_registro_diagnosticos where cn_id_usuario = ?", [cn_id_usuario]);

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

const mostrar_diagnosticos_por_id_incidencia = async (req, res) => {
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
        console.log("El id en el backend : "+ct_id_incidencia);
        connection = await database.getConnection();
        const result = await connection.query("SELECT * FROM t_registro_diagnosticos where ct_id_incidencia = ?", [ct_id_incidencia]);
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




const registrar_diagnosticos = async (req, res) => {
    let connection;
    try {
        const { ct_diagnostico, cn_tiempo_estimado_reparacion, ct_observaciones, ct_id_incidencia, cn_id_usuario } = req.body;
        const cn_id_imagen = 1;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const cf_fecha_completa_incidencia = formattedDate;


        connection = await database.getConnection();

        // Insertar la incidencia en la base de datos
        const result = await connection.query("INSERT INTO t_registro_diagnosticos (cf_fecha_hora_diagnostico, ct_diagnostico, cn_tiempo_estimado_reparacion, cn_id_imagen, ct_observaciones, ct_id_incidencia, cn_id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [cf_fecha_completa_incidencia, ct_diagnostico, cn_tiempo_estimado_reparacion, cn_id_imagen, ct_observaciones, ct_id_incidencia, cn_id_usuario]);

        //console.log(result);
        res.json(result);
    } catch (error) {
        //console.error("Error:", error);
        res.send(error.code +" Server error "+error.message);
    }
};

module.exports = {
    mostrar_diagnosticos_general,
    mostrar_diagnosticos_por_tecnico,
    mostrar_diagnosticos_por_id_incidencia,
    registrar_diagnosticos
}