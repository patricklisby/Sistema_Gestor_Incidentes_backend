const mysql = require("promise-mysql");
const dotenv = require("dotenv");
dotenv.config();

let pool;

async function initializePool() {
    pool = await mysql.createPool({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD,
        connectionLimit: 10 // Ajusta esto según tus necesidades
    });
}

const getConnection = async () => {
    if (!pool) {
        await initializePool();
    }
    return await pool.getConnection();
};

module.exports = { getConnection };
