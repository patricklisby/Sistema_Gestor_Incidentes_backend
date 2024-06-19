const database = require("../database");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10); // Permite hasta 10 imágenes

const mostrar_departamentos = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT * from t_departamentos`
        );

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

const mostrar_estados = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const results = await connection.query(
            `SELECT * from t_estados`
        );

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

const cambiar_estado_por_tecnicos = async (req, res) => {
    let connection;
    try {
        const { ct_id_incidencia } = req.body;
        connection = await database.getConnection();
        await connection.beginTransaction();
        const currentEstadoResult = await connection.query(
            "SELECT cn_id_estado FROM t_incidencias WHERE ct_id_incidencia = ?",
            [ct_id_incidencia]);
        if (currentEstadoResult.length === 0) {
            throw new Error("Incidencia no encontrada"); }
        const currentEstadoId = currentEstadoResult[0].cn_id_estado;
        const nextEstadoResult = await connection.query(
            "SELECT cn_id_estado FROM t_estados WHERE cn_id_estado > ? ORDER BY cn_id_estado LIMIT 1",
            [currentEstadoId] );
        if (nextEstadoResult.length === 0) {
            throw new Error("No hay un siguiente estado disponible"); }
        const nextEstadoId = nextEstadoResult[0].cn_id_estado;
        await connection.query(
            "UPDATE t_incidencias SET cn_id_estado = ? WHERE ct_id_incidencia = ?",
            [nextEstadoId, ct_id_incidencia]
        );
        await connection.commit();
        res.json({ message: 'Estado de la incidencia actualizado exitosamente', nextEstadoId });
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
    mostrar_departamentos,
    cambiar_estado_por_tecnicos,
    mostrar_estados
};