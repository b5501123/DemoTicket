CREATE DATABASE `Demo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `Demo`.`User` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Account` VARCHAR(45) NOT NULL,
  `Name` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Role` INT NOT NULL,
  PRIMARY KEY (`UserID`));
  
  CREATE TABLE `GoDemo`.`Ticket` (
  `TicketID` INT NOT NULL AUTO_INCREMENT,
  `Type` INT NOT NULL,
  `Severity` INT NOT NULL,
  `Summary` VARCHAR(45) NOT NULL,
  `Description` VARCHAR(500) NOT NULL,
  `IsResolved` TINYINT(1) NOT NULL,
  `IsDel` TINYINT(1) NOT NULL,
  `ResolvedTime` DATETIME NULL,
  `CreateBy` VARCHAR(45) NOT NULL,
  `CreateTime` DATETIME NOT NULL,
  PRIMARY KEY (`TicketID`));

INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('1', 'RD01', 'RD01', '123456', '1');
INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('2', 'QA01', 'QA01', '123456', '2');
INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('3', 'PM01', 'PM01', '123456', '3');
INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('4', 'Admin01', 'Admin01', '123456', '4');

