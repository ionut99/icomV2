-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mai 06, 2022 la 07:44 PM
-- Versiune server: 10.4.18-MariaDB
-- Versiune PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Bază de date: `icomdatabase`
--

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `file`
--

CREATE TABLE `file` (
  `fileId` varchar(255) NOT NULL,
  `fIleName` varchar(255) NOT NULL,
  `folderId` varchar(255) DEFAULT NULL,
  `createdTime` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `folders`
--

CREATE TABLE `folders` (
  `folderId` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `parentID` varchar(255) NOT NULL,
  `userID` int(11) NOT NULL,
  `createdTime` varchar(255) NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `folders`
--

INSERT INTO `folders` (`folderId`, `Name`, `parentID`, `userID`, `createdTime`, `path`) VALUES
('67dbc5a4-fca1-4ad2-a6b9-3b5467866445', 'personalIonut', 'root', 2, 'Fri May 06 2022 20:24:32 GMT+0300 (Eastern European Summer Time)', '[]'),
('8f71764c-4dd7-4c0a-9522-64b4ddeee2ab', 'Pesu Ciprian # Pavel Ionut', 'root', 2, 'Fri May 06 2022 20:24:22 GMT+0300 (Eastern European Summer Time)', '[]');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `foldersusers`
--

CREATE TABLE `foldersusers` (
  `ID` int(11) NOT NULL,
  `folderIdResource` varchar(255) NOT NULL,
  `userIdBeneficiary` int(11) DEFAULT NULL,
  `RoomIdBeneficiary` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `foldersusers`
--

INSERT INTO `foldersusers` (`ID`, `folderIdResource`, `userIdBeneficiary`, `RoomIdBeneficiary`) VALUES
(131, '8f71764c-4dd7-4c0a-9522-64b4ddeee2ab', NULL, '95aa9e5a-c340-4541-a6b9-8c8b87e45e6d'),
(132, '67dbc5a4-fca1-4ad2-a6b9-3b5467866445', 2, NULL);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `iusers`
--

CREATE TABLE `iusers` (
  `userId` int(11) NOT NULL,
  `Surname` varchar(200) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `IsAdmin` tinyint(1) NOT NULL,
  `Avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `iusers`
--

INSERT INTO `iusers` (`userId`, `Surname`, `Name`, `Email`, `Password`, `IsAdmin`, `Avatar`) VALUES
(1, 'Stanciu', 'Marian', 'marian.stanciu@mta.ro', 'parolastanciu', 1, NULL),
(2, 'Pavel', 'Ionut', 'ionut.pavel@mta.ro', 'parola', 1, 'users\\images\\avatar\\1651136449402-model_homepage.png'),
(3, 'Pesu', 'Ciprian', 'ciprian.pesu@mta.ro', 'parolapesu', 0, 'users\\images\\avatar\\1650659616225-profil-pisica.jpg'),
(4, 'Popescu', 'Alexandru', 'alexandru.popescu@mta.ro', 'parolapopescu', 1, NULL),
(5, 'Vasilescu', 'Matei', 'matei.vasilescu@mta.ro', 'parolavasilescu', 0, NULL),
(6, 'Cazamir', 'Teodor', 'teodor.cazamir@mta.ro', 'parolacazamir', 0, 'users\\images\\avatar\\1651670066044-anton-repponen-wxxAx26SXys-unsplash.jpg'),
(7, 'Chiforiuc', 'Gabriela', 'gabriela.chiforiuc@mta.ro', 'parolagabriela', 0, NULL),
(8, 'Fuiorea', 'Daniela', 'daniela.fuiorea@mta.ro', 'paroladaniela', 0, NULL),
(9, 'Cojocaru', 'Marian', 'marian.cojocaru@mta.ro', 'parolamarian', 0, NULL),
(10, 'Oprea', 'Stefan', 'stefan.oprea@mta.ro', 'parolastefen', 0, NULL),
(11, 'Marghescu', 'Bogdan', 'bogdan.marghescu@mta.ro', 'parolabogdan', 1, NULL),
(12, 'Marian', 'Razvan', 'ravan.marian@mta.ro', 'parolarazvan', 0, NULL),
(13, 'Petruse', 'Ana-Maria', 'ana.petruse@mta.ro', 'parolaana', 0, NULL),
(14, 'Neagoe', 'Donia', 'donia.neagoe@mta.ro', 'paroladonia', 0, NULL),
(15, 'Ion', 'Roberta', 'roberat.ion@mta.ro', 'parolaroberta', 0, NULL),
(16, 'Pilipautanu', 'Denissa-Porfirie', 'denissa.porfirie@mta.ro', 'paroladenissa', 0, NULL),
(17, 'Pitulice', 'Maria', 'maria.pitulice@mta.ro', 'parolamaria', 0, NULL),
(18, 'Olaru', 'Cristian', 'cristian.olaru@mta.ro', 'parolacristian', 0, NULL),
(19, 'Popa', 'Cosmin', 'cosmin.popa@mta.ro', 'parolacosmin', 0, NULL),
(20, 'Bursuc', 'Alex-George', 'alex.bursuc@mta.ro', 'parolaalex', 1, NULL);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `messages`
--

CREATE TABLE `messages` (
  `ID_message` varchar(100) NOT NULL,
  `RoomID` varchar(100) NOT NULL,
  `senderID` int(11) NOT NULL,
  `Body` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `participants`
--

CREATE TABLE `participants` (
  `ID` int(10) NOT NULL,
  `UserID` int(10) NOT NULL,
  `RoomID` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `participants`
--

INSERT INTO `participants` (`ID`, `UserID`, `RoomID`) VALUES
(577, 3, '95aa9e5a-c340-4541-a6b9-8c8b87e45e6d'),
(578, 2, '95aa9e5a-c340-4541-a6b9-8c8b87e45e6d');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `room`
--

CREATE TABLE `room` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(300) NOT NULL,
  `Private` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `room`
--

INSERT INTO `room` (`ID`, `Name`, `Private`) VALUES
('95aa9e5a-c340-4541-a6b9-8c8b87e45e6d', 'Pesu Ciprian # Pavel Ionut', 1);

--
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`fileId`),
  ADD KEY `ffk_folderId` (`folderId`),
  ADD KEY `jjk_userId` (`userId`);

--
-- Indexuri pentru tabele `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`folderId`),
  ADD KEY `ffk_userID` (`userID`);

--
-- Indexuri pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `jk_userId` (`userIdBeneficiary`),
  ADD KEY `jk_folderId` (`folderIdResource`),
  ADD KEY `fk_roomIdBeneficiary` (`RoomIdBeneficiary`);

--
-- Indexuri pentru tabele `iusers`
--
ALTER TABLE `iusers`
  ADD PRIMARY KEY (`userId`) USING BTREE;

--
-- Indexuri pentru tabele `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`ID_message`),
  ADD UNIQUE KEY `UC_MessageID` (`ID_message`),
  ADD KEY `fk_message` (`senderID`),
  ADD KEY `fk_roomId` (`RoomID`);

--
-- Indexuri pentru tabele `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_userID` (`UserID`),
  ADD KEY `jk_roomId` (`RoomID`);

--
-- Indexuri pentru tabele `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `UC_RoomID` (`ID`);

--
-- AUTO_INCREMENT pentru tabele eliminate
--

--
-- AUTO_INCREMENT pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT pentru tabele `iusers`
--
ALTER TABLE `iusers`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pentru tabele `participants`
--
ALTER TABLE `participants`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=579;

--
-- Constrângeri pentru tabele eliminate
--

--
-- Constrângeri pentru tabele `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `ffk_folderId` FOREIGN KEY (`folderId`) REFERENCES `folders` (`folderId`),
  ADD CONSTRAINT `jjk_userId` FOREIGN KEY (`userId`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `ffk_userID` FOREIGN KEY (`userID`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  ADD CONSTRAINT `fk_roomIdBeneficiary` FOREIGN KEY (`RoomIdBeneficiary`) REFERENCES `room` (`ID`);

--
-- Constrângeri pentru tabele `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_message` FOREIGN KEY (`senderID`) REFERENCES `iusers` (`userId`),
  ADD CONSTRAINT `fk_roomId` FOREIGN KEY (`RoomID`) REFERENCES `room` (`ID`);

--
-- Constrângeri pentru tabele `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `fk_userID` FOREIGN KEY (`UserID`) REFERENCES `iusers` (`userId`),
  ADD CONSTRAINT `jk_roomId` FOREIGN KEY (`RoomID`) REFERENCES `room` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
