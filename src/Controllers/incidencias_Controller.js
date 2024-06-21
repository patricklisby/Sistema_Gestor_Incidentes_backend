const database = require("../database");
const multer = require("multer");

// Configuración de almacenamiento en memoria para multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10); // Permite hasta 10 imágenes

/**
 * Función para mostrar todas las incidencias generales.
 * Realiza una consulta a la base de datos para obtener todas las incidencias,
 * junto con la descripción del estado y el nombre completo del usuario que las registró.
 */

const mostrar_incidencias_general = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT i.*, e.ct_descripcion_estado, u.ct_nombre_completo 
             FROM t_incidencias i
             LEFT JOIN t_estados e ON i.cn_id_estado = e.cn_id_estado
             LEFT JOIN t_usuarios u ON i.cn_id_usuario_registro = u.cn_id_usuario`
        );

        const incidencias = results.map(incidencia => ({
            ...incidencia
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

/**
 * Función para mostrar incidencias por usuario.
 * Recibe el ID del usuario a través de los parámetros de la solicitud y realiza una consulta
 * para obtener todas las incidencias registradas por ese usuario, incluyendo las imágenes asociadas.
 */
const mostrar_incidencias_por_usuario = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario } = req.params;
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT i.*, img.cb_imagen 
             FROM t_incidencias i 
             LEFT JOIN t_imagenes_por_incidencias ipi ON i.ct_id_incidencia = ipi.ct_id_incidencia
             LEFT JOIN t_imagenes img ON ipi.cn_id_imagen = img.cn_id_imagen
             WHERE i.cn_id_usuario_registro = ?`,
            [cn_id_usuario]
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

/**
 * Función para mostrar una incidencia específica por ID.
 * Recibe el ID de la incidencia a través de los parámetros de la solicitud o el cuerpo de la solicitud.
 * Realiza una consulta para obtener la información de la incidencia y las imágenes asociadas.
 */
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

        connection = await database.getConnection();

        // Obtener la información de la incidencia
        const incidenciaResult = await connection.query(
            `SELECT i.*, e.ct_descripcion_estado, u.ct_nombre_completo 
             FROM t_incidencias i
             LEFT JOIN t_estados e ON i.cn_id_estado = e.cn_id_estado
             LEFT JOIN t_usuarios u ON i.cn_id_usuario_registro = u.cn_id_usuario
             WHERE i.ct_id_incidencia = ?`,
            [ct_id_incidencia]
        );

        if (incidenciaResult.length === 0) {
            return res.status(404).send("Incidencia no encontrada");
        }

        const incidencia = incidenciaResult[0];

        // Obtener las imágenes asociadas a la incidencia
        const imagenesResult = await connection.query(
            `SELECT img.cb_imagen 
             FROM t_imagenes img
             LEFT JOIN t_imagenes_por_incidencias ipi ON img.cn_id_imagen = ipi.cn_id_imagen
             WHERE ipi.ct_id_incidencia = ?`,
            [ct_id_incidencia]
        );

        const imagenes = imagenesResult.map(img => img.cb_imagen ? img.cb_imagen.toString('base64') : null);

        // Combinar la información de la incidencia y las imágenes
        const respuesta = {
            ...incidencia,
            imagenes
        };

        res.json(respuesta);
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

/**
 * Función para verificar el ID de la incidencia.
 * Obtiene el ID de la última incidencia registrada y genera un nuevo ID
 * incrementando el número en la parte numérica del ID.
 */
const verificar_id = async () => {
    try {
        const connection = await database.getConnection();
        const result = await connection.query("SELECT ct_id_incidencia FROM t_incidencias ORDER BY cf_fecha_completa_incidencia DESC LIMIT 1");
        const currentYear = new Date().getFullYear();
        let newId;

        if (result.length > 0) {
            const lastId = result[0].ct_id_incidencia;
            const numericPart = parseInt(lastId.split('-')[1], 10);
            const incrementedPart = (numericPart + 1).toString().padStart(6, '0');
            newId = `${currentYear}-${incrementedPart}`;
        } else {
            newId = `${currentYear}-000001`;
        }

        return newId;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

/**
 * Función para registrar una nueva incidencia.
 * Recibe los datos de la incidencia a través del cuerpo de la solicitud y guarda la incidencia
 * en la base de datos. También guarda las imágenes asociadas si las hay.
 */
const registrar_incidencias = async (req, res) => {
    let connection;
    try {
        const { ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cn_id_usuario_registro } = req.body;

        const ct_id_incidencia = await verificar_id();
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const cf_fecha_completa_incidencia = formattedDate;
        const cn_id_estado = 1;

        connection = await database.getConnection();
        await connection.beginTransaction();

        // Insertar la incidencia en la base de datos
        const incidenciaResult = await connection.query(
            "INSERT INTO t_incidencias (ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro]
        );

        // Verifica si hay archivos de imagen en la solicitud
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const imageResult = await connection.query(
                    "INSERT INTO t_imagenes (ct_direccion_imagen, cb_imagen) VALUES (?, ?)",
                    [file.originalname, file.buffer]
                );

                const cn_id_imagen = imageResult.insertId;

                // Insertar el registro en t_imagenes_por_incidencias
                await connection.query(
                    "INSERT INTO t_imagenes_por_incidencias (ct_id_incidencia, cn_id_imagen) VALUES (?, ?)",
                    [ct_id_incidencia, cn_id_imagen]
                );
            }
        }

        await connection.commit();

        res.json({ message: 'Incidencia registrada exitosamente', incidencia: incidenciaResult });
    } catch (error) {
        if (connection) await connection.rollback();
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

/**
 * Función para editar una incidencia existente.
 * Recibe los datos de la incidencia a través del cuerpo de la solicitud y actualiza la incidencia
 * en la base de datos. También guarda las nuevas imágenes asociadas si están presentes.
 *
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 */
const editar_incidencia = async (req, res) => {
    let connection;
    try {
        const ct_id_incidencia = req.params.ct_id_incidencia; // Obtener el ID de los parámetros de la ruta
        const { ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cn_id_usuario_registro, cn_id_estado, ct_justificacion_incidencia, cn_id_prioridad, cn_id_riesgo, cn_id_afectacion, cn_id_categoria, cn_monto_compra_materiales, cn_duracion_reparacion } = req.body;
        
        // Verificar que se han proporcionado todos los campos necesarios
        if (!ct_id_incidencia || !ct_descripcion_incidencia || !ct_lugar || !cn_id_usuario_registro || !cn_id_estado) {
            return res.status(400).json({ error: 'Faltan datos necesarios para actualizar la incidencia' });
        }

        connection = await database.getConnection();
        await connection.beginTransaction();

        // Actualizar la incidencia en la base de datos sin tocar las imágenes
        const incidenciaResult = await connection.query(
            `UPDATE t_incidencias 
             SET ct_titulo_incidencia = ?, ct_descripcion_incidencia = ?, ct_lugar = ?, cn_id_usuario_registro = ?, cn_id_estado = ?, ct_justificacion_incidencia = ?, cn_id_prioridad = ?, cn_id_riesgo = ?, cn_id_afectacion = ?, cn_id_categoria = ?, cn_monto_compra_materiales = ?, cn_duracion_reparacion = ? 
             WHERE ct_id_incidencia = ?`,
            [ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cn_id_usuario_registro, cn_id_estado, ct_justificacion_incidencia, cn_id_prioridad, cn_id_riesgo, cn_id_afectacion, cn_id_categoria, cn_monto_compra_materiales, cn_duracion_reparacion, ct_id_incidencia]
        );

        // Verificar si la incidencia fue actualizada
        if (incidenciaResult.affectedRows === 0) {
            throw new Error('No se encontró la incidencia o no hubo cambios');
        }

        await connection.commit();

        res.json({ message: 'Incidencia editada exitosamente', incidencia: incidenciaResult });
    } catch (error) {
        if (connection) await connection.rollback();
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

/**
 * Función para asignar incidencias a un usuario.
 * Recibe el ID de la incidencia y el ID del usuario a través del cuerpo de la solicitud.
 * Asigna la incidencia al usuario y actualiza el estado de la incidencia.
 */
const asignar_incidencias = async (req, res) => {
    let connection;
    try {
        const { ct_id_incidencia, cn_id_usuario } = req.body;
        if (!ct_id_incidencia || !cn_id_usuario) {
            return res.status(400).json({ error: "Faltan parámetros requeridos" });
        }

        connection = await database.getConnection();
        await connection.beginTransaction();

        // Asignar la incidencia al usuario
        const query = `
            INSERT INTO t_asignacion_incidencia_empleados (ct_id_incidencia, cn_id_usuario)
            VALUES (?, ?)
        `;
        const result = await connection.query(query, [ct_id_incidencia, cn_id_usuario]);

        // Obtener el estado actual de la incidencia
        const currentEstadoResult = await connection.query(
            "SELECT cn_id_estado FROM t_incidencias WHERE ct_id_incidencia = ?",
            [ct_id_incidencia]
        );

        if (currentEstadoResult.length === 0) {
            throw new Error("Incidencia no encontrada");
        }

        const currentEstadoId = currentEstadoResult[0].cn_id_estado;

        // Encontrar el siguiente estado
        const nextEstadoResult = await connection.query(
            "SELECT cn_id_estado FROM t_estados WHERE cn_id_estado > ? ORDER BY cn_id_estado LIMIT 1",
            [currentEstadoId]
        );

        if (nextEstadoResult.length > 0) {
            await connection.query(
                "UPDATE t_incidencias SET cn_id_estado = ? WHERE ct_id_incidencia = ?",
                [nextEstadoResult[0].cn_id_estado, ct_id_incidencia]
            );
        }

        await connection.commit();
        res.json({ message: 'Incidencia asignada y estado actualizado exitosamente', result });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error durante la asignación de incidencias:", error);
        res.status(500).json({ error: "Server error", details: error.message });
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
    mostrar_incidencias_general,
    mostrar_incidencias_por_usuario,
    registrar_incidencias,
    verificar_id,
    mostrar_incidencias_por_id,
    upload, // Exportar el middleware de multer para usarlo en las rutas
    asignar_incidencias,
    editar_incidencia,
};
