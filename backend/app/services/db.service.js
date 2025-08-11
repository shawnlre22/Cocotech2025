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
        const sql = `
        CREATE DATABASE IF NOT EXISTS 'cocotech1';

USE 'cocotech1'; 

CREATE TABLE IF NOT EXISTS \`stocks\` (
  \`id\` varchar(20) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO \`cocotech1\`.\`stocks\`
(\`id\`)
VALUES
("TSLA");

INSERT INTO \`cocotech1\`.\`stocks\`
(\`id\`)
VALUES
("AAPL");

INSERT INTO \`cocotech1\`.\`stocks\`
(\`id\`)
VALUES
("NVDA");

INSERT INTO \`cocotech1\`.\`stocks\`
(\`id\`)
VALUES
("COCO");

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`email\` varchar(200) DEFAULT NULL,
  \`first_name\` varchar(50) DEFAULT NULL,
  \`last_name\` varchar(50) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO \`cocotech1\`.\`users\`
(\`email\`,
\`first_name\`,
\`last_name\`)
VALUES
("user@gmail.com",
"user",
"lastname");

CREATE TABLE IF NOT EXISTS \`wallets\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`user_id\` int NOT NULL,
  \`txn_time\` datetime NOT NULL,
  \`amount\` decimal(38,2) NOT NULL,
  \`is_topup\` bit(1) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`id_idx\` (\`user_id\`),
  CONSTRAINT \`\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO \`cocotech1\`.\`wallets\`
(
\`user_id\`,
\`txn_time\`,
\`amount\`,
\`is_topup\`)
VALUES
(
1,
CURRENT_TIMESTAMP(),
100000,
1);

CREATE TABLE IF NOT EXISTS \`txn_history\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`user_id\` int NOT NULL,
  \`stock_id\` varchar(10) NOT NULL,
  \`units_of_stock\` decimal(38,2) NOT NULL,
  \`txn_amt\` decimal(38,2) NOT NULL,
  \`unit_stock_price\` decimal(38,4) NOT NULL,
  \`txn_time\` varchar(45) NOT NULL,
  \`is_buy\` bit(1) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`user_id_idx\` (\`user_id\`),
  KEY \`stock_id_idx\` (\`stock_id\`),
  CONSTRAINT \`stock_id\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stocks\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT \`user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE OR REPLACE VIEW active_trades AS
SELECT 
    user_id,
    stock_id,
    SUM(
        CASE 
            WHEN is_buy = b'1' THEN units_of_stock
            ELSE -units_of_stock
        END
    ) AS net_units,
    SUM(
        CASE 
            WHEN is_buy = b'1' THEN txn_amt
            ELSE -txn_amt
        END
    ) AS cost
FROM txn_history
GROUP BY user_id, stock_id
HAVING net_units <> 0;

        `


        // Execute SQL (can contain multiple statements if enabled)
        await connection.query(sql);


        return { message: 'Database initialized and table created successfully' };
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};


export { initializeDB };