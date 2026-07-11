-- Travel Leaders demo schema (derived from backend queries)
-- DB name 'traveleaders' is hard-coded in recordController/userController.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS fund_records;
DROP TABLE IF EXISTS user_records;
DROP TABLE IF EXISTS treks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  userName     VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('admin','manager','user') NOT NULL DEFAULT 'user',
  referralCode VARCHAR(100) DEFAULT NULL,
  withdrawCode VARCHAR(100) DEFAULT NULL,
  referredBy   INT DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_referral (referralCode),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_records (
  recordID       INT AUTO_INCREMENT PRIMARY KEY,
  userID         INT NOT NULL,
  managerID      INT DEFAULT NULL,
  totalBalance   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  completedTreks INT NOT NULL DEFAULT 0,
  completedTravel INT NOT NULL DEFAULT 0,
  commission     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  cryptoAddress  VARCHAR(255) DEFAULT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userid (userID),
  INDEX idx_totalbalance (totalBalance),
  INDEX idx_managerid (managerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE fund_records (
  fundID     INT AUTO_INCREMENT PRIMARY KEY,
  userID     INT NOT NULL,
  balance    DECIMAL(12,2) NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userid (userID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE treks (
  trekID     INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  picture    MEDIUMBLOB DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
