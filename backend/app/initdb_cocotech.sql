CREATE DATABASE IF NOT EXISTS `cocotech1`;

USE `cocotech1`; 

DROP TABLE IF EXISTS `stocks`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `wallets`;
DROP TABLE IF EXISTS `txn_history`;


CREATE TABLE IF NOT EXISTS `stocks` (
  `id` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `cocotech1`.`stocks`
(`id`)
VALUES
("TSLA");

INSERT INTO `cocotech1`.`stocks`
(`id`)
VALUES
("AAPL");

INSERT INTO `cocotech1`.`stocks`
(`id`)
VALUES
("NVDA");

INSERT INTO `cocotech1`.`stocks`
(`id`)
VALUES
("COCO");

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `cocotech1`.`users`
(`email`,
`first_name`,
`last_name`)
VALUES
("user@gmail.com",
"user",
"lastname");

CREATE TABLE IF NOT EXISTS `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `txn_time` datetime NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `is_topup` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_idx` (`user_id`),
  CONSTRAINT `` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `cocotech1`.`wallets`
(
`user_id`,
`txn_time`,
`amount`,
`is_topup`)
VALUES
(
1,
CURRENT_TIMESTAMP(),
100000,
1);

CREATE TABLE IF NOT EXISTS `txn_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `stock_id` varchar(10) NOT NULL,
  `units_of_stock` decimal(38,2) NOT NULL,
  `txn_amt` decimal(38,2) NOT NULL,
  `unit_stock_price` decimal(38,2) NOT NULL,
  `txn_time` varchar(45) NOT NULL,
  `is_buy` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `stock_id_idx` (`stock_id`),
  CONSTRAINT `stock_id` FOREIGN KEY (`stock_id`) REFERENCES `stocks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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


CREATE OR REPLACE VIEW wallet_movements AS
SELECT 
    user_id,
    SUM(
        CASE 
            WHEN is_topup = b'1' THEN amount     -- topup adds to cash
            WHEN is_topup = b'0' THEN -amount    -- cashout reduces cash
            ELSE 0
        END
    ) AS total_wallet
FROM wallets
GROUP BY user_id;

CREATE OR REPLACE VIEW stock_cashflow AS
SELECT 
    user_id,
    SUM(
        CASE 
            WHEN is_buy = b'0' THEN txn_amt     -- Sell adds to cash
            WHEN is_buy = b'1' THEN -txn_amt    -- Buy reduces cash
            ELSE 0
        END
    ) AS total_stock_cash
FROM txn_history
GROUP BY user_id;


CREATE OR REPLACE VIEW user_wallet_balance AS
SELECT 
    u.id AS user_id,
    COALESCE(w.total_wallet, 0) + COALESCE(s.total_stock_cash, 0) AS current_balance
FROM (
    SELECT id FROM users
) u
LEFT JOIN wallet_movements w ON u.id = w.user_id
LEFT JOIN stock_cashflow s ON u.id = s.user_id;


CREATE OR REPLACE VIEW invested_amt AS
SELECT 
    user_id,
    stock_id,
    SUM(
        CASE 
            WHEN is_buy = b'1' THEN txn_amt
            ELSE 0
        END
    ) AS invested_amt
FROM txn_history
GROUP BY user_id, stock_id
HAVING invested_amt <> 0;
