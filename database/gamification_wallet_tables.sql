-- ============================================
-- EduConnect Database
-- Gamification & Wallet Module Tables
-- Created by: 22FIS0550
-- ============================================

CREATE DATABASE IF NOT EXISTS educonnect;
USE educonnect;

-- Task 11: Badge Table
CREATE TABLE IF NOT EXISTS Badge (
  badge_id       INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100)  NOT NULL,
  description    TEXT          NOT NULL,
  icon_url       VARCHAR(255)  DEFAULT NULL,
  trigger_type   VARCHAR(50)   NOT NULL,
  threshold      INT           NOT NULL DEFAULT 1,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Badge (name, description, icon_url, trigger_type, threshold) VALUES
('First Session',  'Completed your very first learning session', NULL, 'session_count',   1),
('Fast Learner',   'Finished a full course module in 24 hours',  NULL, 'session_count',   5),
('Top Student',    'Reached #1 on the weekly leaderboard',       NULL, 'leaderboard_top', 1),
('7-Day Streak',   'Studied for 7 consecutive days',             NULL, 'streak_days',     7),
('Collaborator',   'Contributed to 5 community discussions',     NULL, 'community',       5),
('Course Master',  'Completed 10 full courses at 90% average',   NULL, 'session_count',   10),
('Coin Collector', 'Earned over 1000 Skill Coins',               NULL, 'coins_earned',    1000);

-- Task 12: User_Badge Table
CREATE TABLE IF NOT EXISTS User_Badge (
  user_badge_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  badge_id       INT           NOT NULL,
  awarded_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_badge (user_id, badge_id),
  FOREIGN KEY (badge_id) REFERENCES Badge(badge_id) ON DELETE CASCADE
);

-- Task 13: Levelling_Data Table
CREATE TABLE IF NOT EXISTS Levelling_Data (
  level_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  skill_id       INT           NOT NULL,
  score          INT           DEFAULT 0,
  level          ENUM('BRONZE','SILVER','GOLD') DEFAULT 'BRONZE',
  session_count  INT           DEFAULT 0,
  average_rating DECIMAL(3,2)  DEFAULT 0.00,
  updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP
);

-- Task 24: Wallet_Transaction Table
CREATE TABLE IF NOT EXISTS Wallet_Transaction (
  transaction_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT           NOT NULL,
  type            ENUM('CREDIT','DEBIT') NOT NULL,
  amount          INT           NOT NULL,
  reason          VARCHAR(255)  NOT NULL,
  session_id      INT           DEFAULT NULL,
  running_balance INT           NOT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Task 26: Coin_Config Table
CREATE TABLE IF NOT EXISTS Coin_Config (
  config_id    INT AUTO_INCREMENT PRIMARY KEY,
  config_key   VARCHAR(100) NOT NULL UNIQUE,
  config_value INT          NOT NULL,
  description  VARCHAR(255) NOT NULL
);

INSERT INTO Coin_Config (config_key, config_value, description) VALUES
('SESSION_COMPLETE_REWARD',   200, 'Coins mentor earns per completed session'),
('SKILL_VERIFY_REWARD',       100, 'Coins earned when skill is verified'),
('DAILY_LOGIN_BONUS',          10, 'Coins earned for daily login'),
('STREAK_7_DAY_BONUS',        100, 'Bonus coins for 7 day streak'),
('CHALLENGE_COMPLETE_REWARD',  50, 'Coins earned for completing weekly challenge'),
('REFERRAL_REWARD',           500, 'Coins earned when referred friend joins'),
('COMMUNITY_ANSWER_REWARD',    10, 'Coins earned per community forum answer'),
('BADGE_UNLOCK_REWARD',        25, 'Coins earned when new badge is unlocked'),
('SESSION_BOOKING_COST',      150, 'Coins deducted when learner books a session'),
('NEW_USER_STARTING_BALANCE', 100, 'Coins given to new users on registration');

-- Task 25: Add coins column to User table
-- Run this ONLY after teammate creates the users table
-- ALTER TABLE users ADD COLUMN skill_coins_balance INT DEFAULT 100;
