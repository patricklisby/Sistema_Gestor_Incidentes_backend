const database = require("../database");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mostrar_diagnosticos_general = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT d.*, img.cb_imagen 
             FROM t_registro_diagnosticos d 
             LEFT JOIN t_imagenes img ON d.cn_id_imagen = img.cn_id_imagen`
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
             LEFT JOIN t_imagenes img ON d.cn_id_imagen = img.cn_id_imagen 
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
        const results = await connection.query(
            `SELECT d.*, img.cb_imagen 
             FROM t_registro_diagnosticos d
             LEFT JOIN t_imagenes img ON d.cn_id_imagen = img.cn_id_imagen
             WHERE d.ct_id_incidencia = ?`, [ct_id_incidencia]
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

const registrar_diagnosticos = async (req, res) => {
    let connection;
    try {
        const { ct_diagnostico, cn_tiempo_estimado_reparacion, ct_observaciones, ct_id_incidencia, cn_id_usuario } = req.body;
        const { originalname, buffer } = req.file;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const cf_fecha_completa_incidencia = formattedDate;

        connection = await database.getConnection();
        await connection.beginTransaction();

        // Insertar la imagen en la base de datos
        const imageResult = await connection.query(
            "INSERT INTO t_imagenes (ct_direccion_imagen, cb_imagen) VALUES (?, ?)",
            [originalname, buffer]
        );

        const cn_id_imagen = imageResult.insertId;

        // Insertar el diagnóstico en la base de datos
        const result = await connection.query(
            "INSERT INTO t_registro_diagnosticos (cf_fecha_hora_diagnostico, ct_diagnostico, cn_tiempo_estimado_reparacion, cn_id_imagen, ct_observaciones, ct_id_incidencia, cn_id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [cf_fecha_completa_incidencia, ct_diagnostico, cn_tiempo_estimado_reparacion, cn_id_imagen, ct_observaciones, ct_id_incidencia, cn_id_usuario]
        );

        await connection.commit();

        res.json(result);
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
