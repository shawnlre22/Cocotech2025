CREATE DATABASE IF NOT EXISTS `cocotech1`;

USE `cocotech1`; 

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
  `unit_stock_price` decimal(38,4) NOT NULL,
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

