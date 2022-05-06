-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mai 06, 2022 la 11:50 PM
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
  `userId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `folders`
--

CREATE TABLE `folders` (
  `folderId` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `parentID` varchar(255) NOT NULL,
  `userID` varchar(255) NOT NULL,
  `createdTime` varchar(255) NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `foldersusers`
--

CREATE TABLE `foldersusers` (
  `ID` int(11) NOT NULL,
  `folderIdResource` varchar(255) NOT NULL,
  `userIdBeneficiary` varchar(255) DEFAULT NULL,
  `RoomIdBeneficiary` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `iusers`
--

CREATE TABLE `iusers` (
  `userId` varchar(255) NOT NULL,
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
('5435d83b-5305-46a3-bf62-ce5e64a67e0b', 'Miu', 'Adriana', 'adriana.miu@mta.ro', 'parola', 0, NULL),
('555fb214-e365-4ef1-9191-b489534baf91', 'Cazamir', 'Teodor', 'teodor.cazamir@mta.ro', 'parola', 1, NULL),
('5ff64656-6385-4c72-abf7-b73abfa59498', 'Bursuc', 'Alex', 'bursuc.alex@mta.ro', 'parola', 0, NULL),
('780ef1c3-280a-437b-ad23-e1cae38605ec', 'Pavel', 'Ionut', 'ionut.pavel@mta.ro', 'parola', 1, NULL);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `messages`
--

CREATE TABLE `messages` (
  `ID_message` varchar(100) NOT NULL,
  `RoomID` varchar(100) NOT NULL,
  `senderID` varchar(255) NOT NULL,
  `Body` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `participants`
--

CREATE TABLE `participants` (
  `ID` int(10) NOT NULL,
  `UserID` varchar(255) NOT NULL,
  `RoomID` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`fileId`),
  ADD KEY `ffk_folderId` (`folderId`),
  ADD KEY `ffk_userId` (`userId`);

--
-- Indexuri pentru tabele `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`folderId`),
  ADD KEY `fk_userID` (`userID`);

--
-- Indexuri pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `jk_folderId` (`folderIdResource`),
  ADD KEY `fk_roomIdBeneficiary` (`RoomIdBeneficiary`),
  ADD KEY `jk_userID` (`userIdBeneficiary`);

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
  ADD KEY `fk_roomId` (`RoomID`),
  ADD KEY `fk_sender` (`senderID`);

--
-- Indexuri pentru tabele `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `jk_roomId` (`RoomID`),
  ADD KEY `fjk_userId` (`UserID`);

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
  ADD CONSTRAINT `ffk_userId` FOREIGN KEY (`userId`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `fk_userID` FOREIGN KEY (`userID`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  ADD CONSTRAINT `fk_roomIdBeneficiary` FOREIGN KEY (`RoomIdBeneficiary`) REFERENCES `room` (`ID`),
  ADD CONSTRAINT `jk_userID` FOREIGN KEY (`userIdBeneficiary`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_roomId` FOREIGN KEY (`RoomID`) REFERENCES `room` (`ID`),
  ADD CONSTRAINT `fk_sender` FOREIGN KEY (`senderID`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `fjk_userId` FOREIGN KEY (`UserID`) REFERENCES `iusers` (`userId`),
  ADD CONSTRAINT `jk_roomId` FOREIGN KEY (`RoomID`) REFERENCES `room` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
