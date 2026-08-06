import mysql from 'mysql2/promise';

let pool;

if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        connectTimeout: 10000
    });
}

pool = global._mysqlPool;

export const getConnection = () => {
    return pool;
};