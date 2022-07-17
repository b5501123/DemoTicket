
CREATE DATABASE `Demo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `Demo`.`User` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Account` VARCHAR(45) NOT NULL,
  `Name` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Role` INT NOT NULL,
  PRIMARY KEY (`UserID`));
  
  CREATE TABLE  `Demo`.`Ticket` (
  `TicketID` int NOT NULL AUTO_INCREMENT,
  `Type` int NOT NULL,
  `Severity` int NOT NULL,
  `Summary` varchar(50) NOT NULL,
  `Description` varchar(500) NOT NULL,
  `IsResolved` tinyint(1) NOT NULL,
  `IsDel` tinyint(1) NOT NULL,
  `ResolvedTime` datetime DEFAULT NULL,
  `CreateBy` varchar(45) NOT NULL,
  `CreateTime` datetime NOT NULL,
  PRIMARY KEY (`TicketID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('1', 'RD01', 'RD01', '123456', '1');
INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('2', 'QA01', 'QA01', '123456', '2');
INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('3', 'PM01', 'PM01', '123456', '3');
INSERT INTO `Demo`.`User` (`UserID`, `Account`, `Name`, `Password`, `Role`) VALUES ('4', 'Admin01', 'Admin01', '123456', '4');

