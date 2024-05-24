const database = require("../database");


const guardar_imagen = async (req, res) => {
    let connection;
    try {
        const { ct_direccion_imagen } = req.body;

        connection = await database.getConnection();

        // Insertar la incidencia en la base de datos
        const result = await connection.query("INSERT INTO t_imagenes (ct_direccion_imagen) VALUES (?)",
            [ct_direccion_imagen]);

        console.log(result);
        res.json(result);
    } catch (error) {
        //console.error("Error:", error);
        res.send("Server error "+error.message);
    }
};
const mostrar_imagenes = async (req, res) => {
    let connection;
    try {
        connection = await database.getConnection();

        // Insertar la incidencia en la base de datos
        const result = await connection.query("select * from t_imagenes");

        console.log(result);
        res.json(result);
    } catch (error) {
        //console.error("Error:", error);
        res.send("Server error "+error.message);
    }
};



module.exports = {
    guardar_imagen,
    mostrar_imagenes
}