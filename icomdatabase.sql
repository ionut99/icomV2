-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mai 07, 2022 la 07:41 PM
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
  `type` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `folderId` varchar(255) DEFAULT NULL,
  `createdTime` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `file`
--

INSERT INTO `file` (`fileId`, `type`, `fileName`, `folderId`, `createdTime`, `userId`, `size`) VALUES
('3eaad642-2e1d-475f-99a0-0b514d8d4281', 1, 'ft-cartoonnetwork.jpg', 'root', 'Sat, 07 May 2022 17:30:52 GMT', '780ef1c3-280a-437b-ad23-e1cae38605ec', 266343),
('515a7fec-0714-435a-8916-f2e7cbe8899d', 1, 'cover.jpg', '4aae8b8e-3ca2-4ca5-ba18-e1d6606c39fd', 'Sat, 07 May 2022 17:34:33 GMT', '780ef1c3-280a-437b-ad23-e1cae38605ec', 963371),
('b4519ac9-9ce9-4cb2-857e-d0d3c2051816', 37, 'Anexa II.35 - Plan invatamant master IAAS 2022-2024.pdf', '4aae8b8e-3ca2-4ca5-ba18-e1d6606c39fd', 'Sat, 07 May 2022 17:35:13 GMT', 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', 507234);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `filesusers`
--

CREATE TABLE `filesusers` (
  `ID` int(11) NOT NULL,
  `fileResourceId` varchar(255) NOT NULL,
  `userBeneficiaryId` varchar(255) DEFAULT NULL,
  `roomBeneficiaryId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `filesusers`
--

INSERT INTO `filesusers` (`ID`, `fileResourceId`, `userBeneficiaryId`, `roomBeneficiaryId`) VALUES
(30, '3eaad642-2e1d-475f-99a0-0b514d8d4281', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'null'),
(31, '515a7fec-0714-435a-8916-f2e7cbe8899d', '780ef1c3-280a-437b-ad23-e1cae38605ec', '4183db19-3f4e-4ecb-94c5-25855d4f391a'),
(32, 'b4519ac9-9ce9-4cb2-857e-d0d3c2051816', 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', '4183db19-3f4e-4ecb-94c5-25855d4f391a');

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

--
-- Eliminarea datelor din tabel `folders`
--

INSERT INTO `folders` (`folderId`, `Name`, `parentID`, `userID`, `createdTime`, `path`) VALUES
('30132a75-2c70-49ed-b45c-cfe3bc831fe4', 'grup Nou 2', 'root', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Sat May 07 2022 20:39:58 GMT+0300 (Eastern European Summer Time)', '[]'),
('4aae8b8e-3ca2-4ca5-ba18-e1d6606c39fd', 'Miu Adriana # Pavel Ionut', 'root', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Sat May 07 2022 20:29:12 GMT+0300 (Eastern European Summer Time)', '[]'),
('54ec1108-1ca5-4ef9-bfc2-0bfc97bec01a', 'grup Nou', 'root', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Sat May 07 2022 20:37:08 GMT+0300 (Eastern European Summer Time)', '[]'),
('fd2ba102-bbba-4baf-9bb8-1865cf97d6f9', 'folderas', '4aae8b8e-3ca2-4ca5-ba18-e1d6606c39fd', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Sat May 07 2022 20:34:55 GMT+0300 (Eastern European Summer Time)', '[{\"Name\":\"Miu Adriana # Pavel Ionut\",\"folderId\":\"4aae8b8e-3ca2-4ca5-ba18-e1d6606c39fd\"}]');

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

--
-- Eliminarea datelor din tabel `foldersusers`
--

INSERT INTO `foldersusers` (`ID`, `folderIdResource`, `userIdBeneficiary`, `RoomIdBeneficiary`) VALUES
(142, '4aae8b8e-3ca2-4ca5-ba18-e1d6606c39fd', NULL, '4183db19-3f4e-4ecb-94c5-25855d4f391a'),
(143, 'fd2ba102-bbba-4baf-9bb8-1865cf97d6f9', '780ef1c3-280a-437b-ad23-e1cae38605ec', '4183db19-3f4e-4ecb-94c5-25855d4f391a'),
(144, '54ec1108-1ca5-4ef9-bfc2-0bfc97bec01a', NULL, '5bc521be-a692-4ac7-9994-b79b5096c835'),
(145, '30132a75-2c70-49ed-b45c-cfe3bc831fe4', NULL, '3e32aa4d-4d17-4601-9cf1-5b22c76bb5ac');

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
('780ef1c3-280a-437b-ad23-e1cae38605ec', 'Pavel', 'Ionut', 'ionut.pavel@mta.ro', 'parola', 1, 'users\\images\\avatar\\1651905335141-AEBD8603.JPG'),
('a7cded9d-38b2-49fe-bf16-103891a2d5f3', 'Miu', 'Adriana', 'adriana.miu@mta.ro', 'parola', 1, 'users\\images\\avatar\\1651937437531-IMG_33.JPG');

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

--
-- Eliminarea datelor din tabel `participants`
--

INSERT INTO `participants` (`ID`, `UserID`, `RoomID`) VALUES
(585, 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', '4183db19-3f4e-4ecb-94c5-25855d4f391a'),
(586, '780ef1c3-280a-437b-ad23-e1cae38605ec', '4183db19-3f4e-4ecb-94c5-25855d4f391a'),
(587, '780ef1c3-280a-437b-ad23-e1cae38605ec', '5bc521be-a692-4ac7-9994-b79b5096c835'),
(588, 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', '5bc521be-a692-4ac7-9994-b79b5096c835'),
(589, '780ef1c3-280a-437b-ad23-e1cae38605ec', '3e32aa4d-4d17-4601-9cf1-5b22c76bb5ac');

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
('3e32aa4d-4d17-4601-9cf1-5b22c76bb5ac', 'grup Nou 2', 0),
('4183db19-3f4e-4ecb-94c5-25855d4f391a', 'Miu Adriana # Pavel Ionut', 1),
('5bc521be-a692-4ac7-9994-b79b5096c835', 'grup Nou', 0);

--
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`fileId`),
  ADD KEY `ffk_folderId` (`folderId`),
  ADD KEY `ffk_userId` (`userId`),
  ADD KEY `fk_mimetype` (`type`);

--
-- Indexuri pentru tabele `filesusers`
--
ALTER TABLE `filesusers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_fileID` (`fileResourceId`);

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
-- AUTO_INCREMENT pentru tabele `filesusers`
--
ALTER TABLE `filesusers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT pentru tabele `participants`
--
ALTER TABLE `participants`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=590;

--
-- Constrângeri pentru tabele eliminate
--

--
-- Constrângeri pentru tabele `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `ffk_userId` FOREIGN KEY (`userId`) REFERENCES `iusers` (`userId`);

--
-- Constrângeri pentru tabele `filesusers`
--
ALTER TABLE `filesusers`
  ADD CONSTRAINT `fk_fileID` FOREIGN KEY (`fileResourceId`) REFERENCES `file` (`fileId`);

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
