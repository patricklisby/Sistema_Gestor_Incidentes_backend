const database = require("../database");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10); // Permite hasta 10 imágenes

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


const mostrar_incidencias_por_usuario = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario_registro } = req.body;
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT i.*, img.cb_imagen 
             FROM t_incidencias i 
             LEFT JOIN t_imagenes_por_incidencias ipi ON i.ct_id_incidencia = ipi.ct_id_incidencia
             LEFT JOIN t_imagenes img ON ipi.cn_id_imagen = img.cn_id_imagen
             WHERE i.cn_id_usuario_registro = ?`,
            [cn_id_usuario_registro]
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

const asignar_incidencias = async (req, res) => {
    let connection;
    try {
        const { ct_id_incidencia, cn_id_usuario } = req.body;
        if (!ct_id_incidencia || !cn_id_usuario) {
            return res.status(400).json({ error: "Faltan parámetros requeridos" });
        }

        connection = await database.getConnection();
        await connection.beginTransaction();

        const query = `
            INSERT INTO t_asignacion_incidencia_empleados (ct_id_incidencia, cn_id_usuario)
            VALUES (?, ?)
        `;
        const result = await connection.query(query, [ct_id_incidencia, cn_id_usuario]);

        await connection.commit();
        res.json(result);
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
    upload, // Exportar el middleware de multer para usarlo en las rutas,
    asignar_incidencias
};