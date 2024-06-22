const database = require("../database");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const guardar_imagen = async (req, res) => {
    let connection;
    try {
        const { originalname, buffer } = req.file;
        connection = await database.getConnection();

        // Insertar la imagen en la base de datos
        const result = await connection.query(
            "INSERT INTO t_imagenes (ct_direccion_imagen, cb_imagen) VALUES (?, ?)",
            [originalname, buffer]
        );
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error " + error.message);
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

const mostrar_imagenes = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.query("SELECT * FROM t_imagenes");

        // Convertir las imágenes a base64
        const images = result.map(image => ({
            cn_id_imagen: image.cn_id_imagen,
            ct_direccion_imagen: image.ct_direccion_imagen,
            cb_imagen: image.cb_imagen.toString('base64')
        }));

        res.json(images);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error " + error.message);
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

module.exports = {
    guardar_imagen,
    mostrar_imagenes,
    upload // Exportar el middleware de multer para usarlo en las rutas
};
