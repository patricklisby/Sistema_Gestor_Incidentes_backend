const database = require("../database");
const multer = require("multer");

const emailService = require('../emailService');
const { obtener_email_usuario } = require('./usuarios_Controller');

// Configuración de multer para manejar la carga de imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10); // Permite hasta 10 imágenes

/**
 * Controlador para mostrar los departamentos
 * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 */
const mostrar_departamentos = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * from t_departamentos");
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

/**
 * Controlador para mostrar los estados
 * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 */
const mostrar_estados = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * from t_estados");
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

const mostrar_prioridades = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * from t_prioridades");
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

const mostrar_riesgos = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * from t_riesgos");
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
const mostrar_categorias = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * from t_categorias");
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

const mostrar_afectaciones = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query("SELECT * from t_afectaciones");
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

/**
 * Controlador para cambiar el estado de una incidencia por parte de técnicos
 * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 */
const cambiar_estado_por_tecnicos = async (req, res) => {
    let connection;
    try {
        const { ct_id_incidencia , cn_id_usuario} = req.body;
        connection = await database.getConnection();
        await connection.beginTransaction();

        // Obtener el estado actual de la incidencia
        const currentEstadoResult = await connection.query(
            "SELECT cn_id_estado FROM t_incidencias WHERE ct_id_incidencia = ?",
            [ct_id_incidencia]
        );

        if (currentEstadoResult.length === 0) {
            throw new Error("Incidencia no encontrada");
        }

        const currentEstadoId = currentEstadoResult[0].cn_id_estado;
        let nextEstadoId;

        // Lógica para saltar el estado 5 y pasar de 4 a 6
        if (currentEstadoId === 4) {
            nextEstadoId = 6;
        } else if (currentEstadoId === 5) {
            // Encontrar el siguiente estado después del 5
            const nextEstadoResult = await connection.query(
                "SELECT cn_id_estado FROM t_estados WHERE cn_id_estado > 5 ORDER BY cn_id_estado LIMIT 1"
            );
            if (nextEstadoResult.length === 0) {
                throw new Error("No hay un siguiente estado disponible");
            }
            nextEstadoId = nextEstadoResult[0].cn_id_estado;
        } else {
            // Encontrar el siguiente estado para los demás casos
            const nextEstadoResult = await connection.query(
                "SELECT cn_id_estado FROM t_estados WHERE cn_id_estado > ? AND cn_id_estado NOT IN (5) ORDER BY cn_id_estado LIMIT 1",
                [currentEstadoId]
            );
            if (nextEstadoResult.length === 0) {
                throw new Error("No hay un siguiente estado disponible");
            }
            nextEstadoId = nextEstadoResult[0].cn_id_estado;
        }

        // Actualizar el estado de la incidencia
        await connection.query(
            "UPDATE t_incidencias SET cn_id_estado = ? WHERE ct_id_incidencia = ?",
            [nextEstadoId, ct_id_incidencia]
        );

        // Insertar registro en la bitácora de cambios de estado
        await connection.query(
            "INSERT INTO t_bitacora_cambios_estado (cn_id_estado, cn_id_usuario, ct_referencia_incidencia) VALUES (?, ?, ?)",
            [nextEstadoId, cn_id_usuario, ct_id_incidencia]
        );

        await connection.commit();
        res.json({ message: 'Estado de la incidencia actualizado exitosamente', nextEstadoId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error:", error);
        res.status(500).send("Server error: " + error.message);
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
 * Controlador para cambiar el estado de una incidencia por parte de supervisores
 * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 */
const cambiar_estado_por_supervisor = async (req, res) => {
    let connection;
    try {
        const { ct_id_incidencia, cn_id_estado, cn_id_usuario } = req.body; // Asegúrate de que cn_id_estado esté en el cuerpo de la solicitud
        connection = await database.getConnection();
        await connection.beginTransaction();

        // Verificar si la incidencia existe
        const incidenciaResult = await connection.query(
            "SELECT ct_id_incidencia FROM t_incidencias WHERE ct_id_incidencia = ?",
            [ct_id_incidencia]
        );

        if (incidenciaResult.length === 0) {
            throw new Error("Incidencia no encontrada");
        }

        // Actualizar el estado de la incidencia
        await connection.query(
            "UPDATE t_incidencias SET cn_id_estado = ? WHERE ct_id_incidencia = ?",
            [cn_id_estado, ct_id_incidencia]
        );
        // Insertar registro en la bitácora de cambios de estado
        await connection.query(
            "INSERT INTO t_bitacora_cambios_estado (cn_id_estado, cn_id_usuario, ct_referencia_incidencia) VALUES (?, ?, ?)",
            [cn_id_estado, cn_id_usuario, ct_id_incidencia]
        );

        const userEmail = await obtener_email_usuario(cn_id_usuario);
        if (userEmail) {
            let subject, text, html;
            if (cn_id_estado == 9) {
                await emailService.sendEmail(
                    userEmail,
                    'La incidencia cumple con los requisitos de calidad y procede a ser cerrada.',
                    `La incidencia cumple con los requisitos de calidad y procede a ser cerrada.`,
                    ` <p>Estimado Usuario,</p>
                <p>Nos complace informarle que la incidencia <strong>cumple con los requisitos de calidad</strong> y procede a ser <strong>cerrada</strong>.</p>
                <p>Saludos cordiales,</p>
                <p>El equipo de soporte técnico</p>`
                );
            } else if (cn_id_estado == 2) {
                await emailService.sendEmail(
                    userEmail,
                    'Notificación estado diagnóstico',
                    `La incidencia ha sido rechazada por controles de calidad.`,
                    `<p>Estimado Usuario,</p>
                <p>Le informamos que la incidencia ha sido <strong>rechazada por controles de calidad</strong>. Por favor, revise y realice las correcciones necesarias.</p>
                <p>Saludos cordiales,</p>
                <p>El equipo de soporte técnico</p>`
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Estado de la incidencia actualizado exitosamente', cn_id_estado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error:", error);
        res.status(500).send("Server error: " + error.message);
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
 * Controlador para generar un reporte de carga de trabajo
 * @param {Request} req - Objeto de solicitud HTTP
 * @param {Response} res - Objeto de respuesta HTTP
 */
const reporte_carga_trabajo = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.beginTransaction();

        // Obtener los usuarios con rol 4
        const usuarios_rol = await connection.query(
            `SELECT u.cn_id_usuario, u.ct_nombre_completo, u.ct_descripcion_puesto
            FROM t_usuarios u
            JOIN t_roles_por_usuario ur ON u.cn_id_usuario = ur.cn_id_usuario
            WHERE ur.cn_id_rol = 4`
        );

        if (usuarios_rol.length === 0) {
            throw new Error("No se encontraron usuarios con rol 4");
        }

        const report = [];

        for (let usuario of usuarios_rol) {
            // Contar las incidencias asignadas a cada usuario
            const asignaciones = await connection.query(
                `SELECT COUNT(*) as total_incidencias
                FROM t_asignacion_incidencia_empleados
                WHERE cn_id_usuario = ?`,
                [usuario.cn_id_usuario]
            );

            // Calcular el tiempo promedio estimado de reparación
            const tiempoPromedioResult = await connection.query(
                `SELECT AVG(cn_tiempo_estimado_reparacion) as promedio_tiempo_reparacion
                FROM t_registro_diagnosticos
                WHERE cn_id_usuario = ?`,
                [usuario.cn_id_usuario]
            );

            let promedioTiempoReparacionHoras = 0;
            if (tiempoPromedioResult.length > 0 && tiempoPromedioResult[0].promedio_tiempo_reparacion !== null) {
                const tiempoPromedio = tiempoPromedioResult[0].promedio_tiempo_reparacion;
                // Convertir el tiempo promedio de minutos a horas si es necesario
                promedioTiempoReparacionHoras = (tiempoPromedio / 60).toFixed(2);
            }

            // Obtener incidencias terminadas por usuario (estado 6)
            const incidenciasTerminadasUsuario = await connection.query(
                `SELECT COUNT(*) as total_incidencias_terminadas
                FROM t_incidencias i
                JOIN t_asignacion_incidencia_empleados aie ON i.ct_id_incidencia = aie.ct_id_incidencia
                WHERE aie.cn_id_usuario = ? AND i.cn_id_estado = 6`,
                [usuario.cn_id_usuario]
            );

            const totalIncidenciasTerminadasUsuario = incidenciasTerminadasUsuario[0].total_incidencias_terminadas;

            report.push({
                nombre: usuario.ct_nombre_completo,
                puesto: usuario.ct_descripcion_puesto,
                total_incidencias: asignaciones[0].total_incidencias,
                promedio_tiempo_reparacion: promedioTiempoReparacionHoras,
                total_incidencias_terminadas: totalIncidenciasTerminadasUsuario
            });
        }

        await connection.commit();
        res.json(report);
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error:", error);
        res.status(500).send("Server error: " + error.message);
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
    mostrar_departamentos,
    cambiar_estado_por_tecnicos,
    mostrar_estados,
    mostrar_prioridades,
    mostrar_afectaciones,
    mostrar_categorias,
    mostrar_riesgos,
    cambiar_estado_por_supervisor,
    reporte_carga_trabajo
};
