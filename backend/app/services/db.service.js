import connection from '../config/db.js';
import fs from 'fs';
import path from 'path';

const initializeDB = async () => {
    try {
			/*
        // First check if the database exists
        //await connection.query('CREATE DATABASE IF NOT EXISTS car');

        // Use the database
        //await connection.query('USE car');

        // Create the cars table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS cars (
                id INT AUTO_INCREMENT PRIMARY KEY,
                car_name VARCHAR(255) NOT NULL,
                color VARCHAR(255) NOT NULL
            )
        `;

        await connection.query(createTableQuery);
*/

        
        //const sqlFilePath = path.join(__dirname, './initdb_cocotech.sql');
        //const sql = fs.readFileSync('./app/services/initdb_cocotech.sql', 'utf8');
        const sql = ``


        // Execute SQL (can contain multiple statements if enabled)
        await connection.query(sql);


        return { message: 'Database initialized and table created successfully' };
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};


export { initializeDB };