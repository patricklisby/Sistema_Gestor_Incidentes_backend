const database = require("../database");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10); // Permite hasta 10 imágenes

const mostrar_diagnosticos_general = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT d.*, img.cb_imagen 
             FROM t_registro_diagnosticos d 
             LEFT JOIN t_imagenes_por_diagnosticos ipd ON d.cn_id_diagnostico = ipd.cn_id_diagnostico
             LEFT JOIN t_imagenes img ON ipd.cn_id_imagen = img.cn_id_imagen`
        );

        const diagnosticos = results.map(diagnostico => ({
            ...diagnostico,
            cb_imagen: diagnostico.cb_imagen ? diagnostico.cb_imagen.toString('base64') : null
        }));

        res.json(diagnosticos);
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

const mostrar_diagnosticos_por_tecnico = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario } = req.body;
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT d.*, img.cb_imagen 
             FROM t_registro_diagnosticos d 
             LEFT JOIN t_imagenes_por_diagnosticos ipd ON d.cn_id_diagnostico = ipd.cn_id_diagnostico
             LEFT JOIN t_imagenes img ON ipd.cn_id_imagen = img.cn_id_imagen 
             WHERE d.cn_id_usuario = ?`, 
             [cn_id_usuario]
        );

        const diagnosticos = results.map(diagnostico => ({
            ...diagnostico,
            cb_imagen: diagnostico.cb_imagen ? diagnostico.cb_imagen.toString('base64') : null
        }));

        res.json(diagnosticos);
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
        connection = await database.getConnection();
        
        const diagnosticosResult = await connection.query(
            `SELECT d.*, 
                    u.ct_nombre_completo, 
                    DATE_FORMAT(d.cf_fecha_hora_diagnostico, '%Y-%m-%d %H:%i:%s') AS fecha_formateada
             FROM t_registro_diagnosticos d
             LEFT JOIN t_usuarios u ON d.cn_id_usuario = u.cn_id_usuario
             WHERE d.ct_id_incidencia = ?`, [ct_id_incidencia]
        );

        if (diagnosticosResult.length === 0) {
            return res.status(404).send("Diagnósticos no encontrados");
        }

        const diagnosticos = diagnosticosResult.map(async diagnostico => {
            const imagenesResult = await connection.query(
                `SELECT img.cb_imagen 
                 FROM t_imagenes img
                 LEFT JOIN t_imagenes_por_diagnosticos ipd ON img.cn_id_imagen = ipd.cn_id_imagen
                 WHERE ipd.cn_id_diagnostico = ?`,
                [diagnostico.cn_id_diagnostico]
            );

            const imagenes = imagenesResult.map(img => img.cb_imagen ? img.cb_imagen.toString('base64') : null);
            
            return {
                ...diagnostico,
                imagenes
            };
        });

        const resolvedDiagnosticos = await Promise.all(diagnosticos);
        
        res.json(resolvedDiagnosticos);
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


const registrar_diagnosticos = async (req, res) => {
    let connection;
    try {
        const { ct_diagnostico, cn_tiempo_estimado_reparacion, ct_observaciones, ct_id_incidencia, cn_id_usuario } = req.body;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const cf_fecha_hora_diagnostico = formattedDate;

        connection = await database.getConnection();
        await connection.beginTransaction();

        // Insertar el diagnóstico en la base de datos
        const diagnosticoResult = await connection.query(
            "INSERT INTO t_registro_diagnosticos (cf_fecha_hora_diagnostico, ct_diagnostico, cn_tiempo_estimado_reparacion, ct_observaciones, ct_id_incidencia, cn_id_usuario) VALUES (?, ?, ?, ?, ?, ?)",
            [cf_fecha_hora_diagnostico, ct_diagnostico, cn_tiempo_estimado_reparacion, ct_observaciones, ct_id_incidencia, cn_id_usuario]
        );

        const cn_id_diagnostico = diagnosticoResult.insertId;

        // Verifica si hay archivos de imagen en la solicitud
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const imageResult = await connection.query(
                    "INSERT INTO t_imagenes (ct_direccion_imagen, cb_imagen) VALUES (?, ?)",
                    [file.originalname, file.buffer]
                );

                const cn_id_imagen = imageResult.insertId;

                // Insertar el registro en t_imagenes_por_diagnosticos
                await connection.query(
                    "INSERT INTO t_imagenes_por_diagnosticos (cn_id_diagnostico, cn_id_imagen) VALUES (?, ?)",
                    [cn_id_diagnostico, cn_id_imagen]
                );
            }
        }

        // Cambiar el estado de la incidencia al siguiente estado
        const nextEstadoId = await connection.query(
            "SELECT cn_id_estado FROM t_estados WHERE cn_id_estado > (SELECT cn_id_estado FROM t_incidencias WHERE ct_id_incidencia = ?) ORDER BY cn_id_estado LIMIT 1",
            [ct_id_incidencia]
        );

        if (nextEstadoId.length > 0) {
            await connection.query(
                "UPDATE t_incidencias SET cn_id_estado = ? WHERE ct_id_incidencia = ?",
                [nextEstadoId[0].cn_id_estado, ct_id_incidencia]
            );
        }

        await connection.commit();

        res.json({ message: 'Diagnóstico registrado exitosamente', diagnostico: diagnosticoResult });
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



module.exports = {
    mostrar_diagnosticos_general,
    mostrar_diagnosticos_por_tecnico,
    mostrar_diagnosticos_por_id_incidencia,
    registrar_diagnosticos,
    upload // Exportar el middleware de multer para usarlo en las rutas
};
