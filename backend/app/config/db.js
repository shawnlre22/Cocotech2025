import mysql from 'mysql2/promise';

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'cocotech',
    multipleStatements: true 
});

export default connection;