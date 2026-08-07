import mysql from 'mysql2/promise';

let pool;

if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        },
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
    });
}

pool = global._mysqlPool;

export const getConnection = () => {
    return pool;
};