CREATE DATABASE IF NOT EXISTS educonnect;
USE educonnect;

CREATE TABLE User (
    User_Id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    First_Name     VARCHAR(50)  NOT NULL,
    Last_Name      VARCHAR(50)  NOT NULL,
    Email          VARCHAR(100) NOT NULL UNIQUE,
    Password       VARCHAR(255) NOT NULL,
    University     VARCHAR(150),
    Role           ENUM('Student', 'Admin') NOT NULL DEFAULT 'Student',
    Wallet_Balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Bio            TEXT,
    Status         ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active',
    Created_At     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Skill (
    Skill_Id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Skill_Name  VARCHAR(100) NOT NULL,
    Category    ENUM('Technical', 'Non-Technical') NOT NULL,
    Description TEXT
);


CREATE TABLE Session (
    Session_Id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Skill_Id     INT UNSIGNED NOT NULL,
    Learner_Id   INT UNSIGNED NOT NULL,
    Mentor_Id    INT UNSIGNED NOT NULL,
    Session_Type ENUM('Online-Chat', 'Online-Video', 'Physical') NOT NULL,
    Date         DATE         NOT NULL,
    Time         TIME         NOT NULL,
    Duration     SMALLINT UNSIGNED NOT NULL COMMENT 'Duration in minutes',
    Status       ENUM('Pending', 'Scheduled', 'In-Session', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    Rating       TINYINT UNSIGNED DEFAULT NULL CHECK (Rating BETWEEN 1 AND 5),
    Cost         DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Coins charged from learner',
    Reward       DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Coins earned by mentor',
    Feedback     TEXT DEFAULT NULL,

    CONSTRAINT fk_session_skill    FOREIGN KEY (Skill_Id)   REFERENCES Skill(Skill_Id),
    CONSTRAINT fk_session_learner  FOREIGN KEY (Learner_Id) REFERENCES User(User_Id),
    CONSTRAINT fk_session_mentor   FOREIGN KEY (Mentor_Id)  REFERENCES User(User_Id)
);


CREATE TABLE Badge (
    Badge_Id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Badge_Name  VARCHAR(100) NOT NULL,
    Criteria    TEXT         NOT NULL,
    Description TEXT
);


CREATE TABLE User_Skill (
    User_Skill_Id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    User_Id             INT UNSIGNED NOT NULL,
    Skill_Id            INT UNSIGNED NOT NULL,
    Role                ENUM('Learner', 'Mentor') NOT NULL,
    Mentor_Level        ENUM('Bronze', 'Silver', 'Gold') DEFAULT NULL,
    Verification_Status ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
    Certificates        VARCHAR(500) DEFAULT NULL COMMENT 'File path or URL to uploaded certificate',

    CONSTRAINT fk_userskill_user  FOREIGN KEY (User_Id)  REFERENCES User(User_Id),
    CONSTRAINT fk_userskill_skill FOREIGN KEY (Skill_Id) REFERENCES Skill(Skill_Id),
    CONSTRAINT uq_user_skill_role UNIQUE (User_Id, Skill_Id, Role)
);


CREATE TABLE User_Badge (
    User_Id      INT UNSIGNED NOT NULL,
    Badge_Id     INT UNSIGNED NOT NULL,
    Awarded_Date DATE         NOT NULL DEFAULT (CURRENT_DATE),

    PRIMARY KEY (User_Id, Badge_Id),
    CONSTRAINT fk_userbadge_user  FOREIGN KEY (User_Id)  REFERENCES User(User_Id),
    CONSTRAINT fk_userbadge_badge FOREIGN KEY (Badge_Id) REFERENCES Badge(Badge_Id)
);


CREATE TABLE Wallet_Transaction (
    Transaction_Id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    User_Id          INT UNSIGNED NOT NULL,
    Transaction_Type ENUM('Credit', 'Debit') NOT NULL,
    Amount           DECIMAL(10, 2) NOT NULL CHECK (Amount > 0),
    Timestamp        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Description      VARCHAR(255),

    CONSTRAINT fk_wallettx_user FOREIGN KEY (User_Id) REFERENCES User(User_Id)
);


CREATE TABLE Levelling_Data (
    Record_Id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Mentor_Id            INT UNSIGNED NOT NULL,
    Skill_Id             INT UNSIGNED NOT NULL,
    Average_Rating       DECIMAL(3, 2) DEFAULT 0.00 CHECK (Average_Rating BETWEEN 0 AND 5),
    Total_Sessions       INT UNSIGNED  DEFAULT 0,
    Score                DECIMAL(10, 2) GENERATED ALWAYS AS
                             ((Total_Sessions * 1) + (Average_Rating * 5)) STORED,
    Mentor_Level         ENUM('Bronze', 'Silver', 'Gold') DEFAULT NULL,
    Last_Evaluation_Date DATE DEFAULT NULL,

    CONSTRAINT fk_levelling_mentor FOREIGN KEY (Mentor_Id) REFERENCES User(User_Id),
    CONSTRAINT fk_levelling_skill  FOREIGN KEY (Skill_Id)  REFERENCES Skill(Skill_Id),
    CONSTRAINT uq_levelling_mentor_skill UNIQUE (Mentor_Id, Skill_Id)
);

ALTER TABLE User
  ADD COLUMN otp_code VARCHAR(6) DEFAULT NULL,
  ADD COLUMN otp_expiry DATETIME DEFAULT NULL,
  ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN reset_token VARCHAR(100) DEFAULT NULL,
  ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;