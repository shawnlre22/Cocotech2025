import mysql from 'mysql2/promise';
import 'dotenv/config';

const dbPassword = process.env.DB_PASSWORD;

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: dbPassword,
    database: 'cocotech1',
    multipleStatements: true 
});

export default connection;