
import mysql from 'mysql2/promise';

// On crée le pool une seule fois
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// On exporte une fonction pour récupérer ce pool
export const getConnection = () => {
    return pool;
};