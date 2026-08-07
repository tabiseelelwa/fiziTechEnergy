import mysql from 'mysql2/promise';

let pool;

export const getConnection = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 4000,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'test',
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            },
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
            connectTimeout: 10000
        });
    }
    return pool;
};