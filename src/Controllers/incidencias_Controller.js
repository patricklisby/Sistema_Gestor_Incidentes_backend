const database = require("../database");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mostrar_incidencias_general = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT i.*, img.cb_imagen 
             FROM t_incidencias i 
             LEFT JOIN t_imagenes img ON i.cn_id_imagen = img.cn_id_imagen`
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

const mostrar_incidencias_por_usuario = async (req, res) => {
    let connection;
    try {
        const { cn_id_usuario_registro } = req.body;
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT i.*, img.cb_imagen 
             FROM t_incidencias i 
             LEFT JOIN t_imagenes img ON i.cn_id_imagen = img.cn_id_imagen 
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
        const results = await connection.query(
            `SELECT i.*, img.cb_imagen 
             FROM t_incidencias i 
             LEFT JOIN t_imagenes img ON i.cn_id_imagen = img.cn_id_imagen 
             WHERE i.ct_id_incidencia = ?`, 
             [ct_id_incidencia]
        );

        const incidencia = results.map(incidencia => ({
            ...incidencia,
            cb_imagen: incidencia.cb_imagen ? incidencia.cb_imagen.toString('base64') : null
        }));

        res.json(incidencia);
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
        let newId;
        if (result.length > 0) {
            const lastId = result[0].ct_id_incidencia;
            const numericPart = parseInt(lastId.split('-')[1], 10);
            const incrementedPart = (numericPart + 1).toString().padStart(6, '0');
            newId = `2024-${incrementedPart}`;
        } else {
            newId = '2024-000001';
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
        const { originalname, buffer } = req.file;

        const ct_id_incidencia = await verificar_id();
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const cf_fecha_completa_incidencia = formattedDate;
        const cn_id_estado = 1;

        connection = await database.getConnection();
        await connection.beginTransaction();

        // Insertar la imagen en la base de datos
        const imageResult = await connection.query(
            "INSERT INTO t_imagenes (ct_direccion_imagen, cb_imagen) VALUES (?, ?)",
            [originalname, buffer]
        );

        const cn_id_imagen = imageResult.insertId;

        // Insertar la incidencia en la base de datos
        const result = await connection.query(
            "INSERT INTO t_incidencias (ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro, cn_id_imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [ct_id_incidencia, ct_titulo_incidencia, ct_descripcion_incidencia, ct_lugar, cf_fecha_completa_incidencia, cn_id_estado, cn_id_usuario_registro, cn_id_imagen]
        );

        await connection.commit();

        console.log(result);
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
    mostrar_incidencias_general,
    mostrar_incidencias_por_usuario,
    registrar_incidencias,
    verificar_id,
    mostrar_incidencias_por_id,
    upload // Exportar el middleware de multer para usarlo en las rutas
};