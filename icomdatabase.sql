-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mai 14, 2022 la 12:23 PM
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
  `size` int(11) NOT NULL,
  `systemPath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `file`
--

INSERT INTO `file` (`fileId`, `type`, `fileName`, `folderId`, `createdTime`, `userId`, `size`, `systemPath`) VALUES
('731b9251-d79a-4143-bd58-f1bcabb0db70', 8, 'model_homepage.png', '62ba3064-7346-4dd9-b1eb-4ea4637b36d4', '1652521111914', 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', 56472, 'users\\a7cded9d-38b2-49fe-bf16-103891a2d5f3\\1652521111914 model_homepage.png');

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
(57, '731b9251-d79a-4143-bd58-f1bcabb0db70', 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', 'd12ca86c-a732-46c5-9833-76dadafed460');

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
('13a29ca1-060c-45b2-af4e-2596b9f065a8', 'Neagoe Donia # Pavel Ionut', 'root', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Fri May 13 2022 16:08:22 GMT+0300 (Eastern European Summer Time)', '[]'),
('1e0e8535-ede7-40cd-81d8-ff8b0eb897a6', 'poze', '13a29ca1-060c-45b2-af4e-2596b9f065a8', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Fri May 13 2022 20:46:41 GMT+0300 (Eastern European Summer Time)', '[{\"Name\":\"Neagoe Donia # Pavel Ionut\",\"folderId\":\"13a29ca1-060c-45b2-af4e-2596b9f065a8\"}]'),
('62ba3064-7346-4dd9-b1eb-4ea4637b36d4', 'Miu Adriana # Pavel Ionut', 'root', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Thu May 12 2022 22:23:10 GMT+0300 (Eastern European Summer Time)', '[]'),
('91f10841-8355-4639-87e8-ee810127f946', 'fisiere', '13a29ca1-060c-45b2-af4e-2596b9f065a8', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'Fri May 13 2022 20:45:42 GMT+0300 (Eastern European Summer Time)', '[{\"Name\":\"Neagoe Donia # Pavel Ionut\",\"folderId\":\"13a29ca1-060c-45b2-af4e-2596b9f065a8\"}]');

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
(171, '62ba3064-7346-4dd9-b1eb-4ea4637b36d4', NULL, 'd12ca86c-a732-46c5-9833-76dadafed460'),
(172, '13a29ca1-060c-45b2-af4e-2596b9f065a8', NULL, '5f12e5e5-b1bf-4758-968a-0e4f8c4d3a42'),
(173, '91f10841-8355-4639-87e8-ee810127f946', '780ef1c3-280a-437b-ad23-e1cae38605ec', '5f12e5e5-b1bf-4758-968a-0e4f8c4d3a42'),
(174, '1e0e8535-ede7-40cd-81d8-ff8b0eb897a6', '780ef1c3-280a-437b-ad23-e1cae38605ec', '5f12e5e5-b1bf-4758-968a-0e4f8c4d3a42');

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
('3565f250-f5d2-4de3-beea-7ee9efb2a587', 'Cazamir', 'Teodor', 'teodor.cazamir@mta.ro', 'parola', 1, NULL),
('780ef1c3-280a-437b-ad23-e1cae38605ec', 'Pavel', 'Ionut', 'ionut.pavel@mta.ro', 'parola', 1, 'users\\780ef1c3-280a-437b-ad23-e1cae38605ec\\1652463504436 profil-pisica.jpg'),
('913166e3-cd4c-4ec5-9fd0-fda16c4cb0ab', 'Fuiorea', 'Daniela', 'daniela.fuiorea@mta.ro', 'parola', 0, NULL),
('94a1ff1c-ac1e-4ef2-9e75-9b1d5e486e53', 'Popa', 'Cosmin', 'cosmin.popa@mta.ro', 'parola', 0, NULL),
('a7cded9d-38b2-49fe-bf16-103891a2d5f3', 'Miu', 'Adriana', 'adriana.miu@mta.ro', 'parola', 1, 'users\\a7cded9d-38b2-49fe-bf16-103891a2d5f3\\1652464238559 IMG_33.JPG'),
('aa2f78cc-4117-4c3d-808d-75774ce732d0', 'Petruse', 'Anamaria', 'ana.petruse@mta.ro', 'parola', 1, NULL),
('ac6849f7-216f-48bb-a629-ea7b95b2dfab', 'Bursuc', 'Alex', 'bursuc.alex@mta.ro', 'parola', 1, NULL),
('c217d7bd-491d-4d74-ae1d-dea2e4af6f3e', 'Pilipautan', 'Denissa', 'denissa.pilipautan@mta.ro', 'parola', 1, NULL),
('d9192493-e340-4f05-a302-f7e9438bd3e1', 'Cazamir', 'Teodor', 'teodor.cazamir@mta.ro', 'parola', 1, NULL),
('dadacd16-0f5b-42f1-9c45-e2a3a06dcc29', 'Neagoe', 'Donia', 'donia.neagoe@mta.ro', 'parola', 1, NULL),
('ec68cc69-8a41-455e-88d8-dd84ed548861', 'Marghescu', 'Bogdan', 'bogdan.marghescu@mta.ro', 'parola', 1, NULL),
('fddb0e4b-0239-4d84-85a6-14cbd782c16a', 'Cojocaru', 'Marian', 'marian.cojocaru@mta.ro', 'parola', 1, NULL);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `messages`
--

CREATE TABLE `messages` (
  `ID_message` varchar(100) NOT NULL,
  `RoomID` varchar(100) NOT NULL,
  `senderID` varchar(255) NOT NULL,
  `Body` longtext NOT NULL,
  `createdTime` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `messages`
--

INSERT INTO `messages` (`ID_message`, `RoomID`, `senderID`, `Body`, `createdTime`) VALUES
('95c035ab-d2a7-453b-be5f-8a6f1312bb55', 'd12ca86c-a732-46c5-9833-76dadafed460', '780ef1c3-280a-437b-ad23-e1cae38605ec', 'buna', 'Thu May 12 2022 22:23:17 GMT+0300 (Eastern European Summer Time)'),
('c9e7648e-40ed-400b-9974-925d336a68af', 'd12ca86c-a732-46c5-9833-76dadafed460', 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', 'buna si tie ', 'Thu May 12 2022 22:26:36 GMT+0300 (Eastern European Summer Time)');

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
(605, 'a7cded9d-38b2-49fe-bf16-103891a2d5f3', 'd12ca86c-a732-46c5-9833-76dadafed460'),
(606, '780ef1c3-280a-437b-ad23-e1cae38605ec', 'd12ca86c-a732-46c5-9833-76dadafed460'),
(607, 'dadacd16-0f5b-42f1-9c45-e2a3a06dcc29', '5f12e5e5-b1bf-4758-968a-0e4f8c4d3a42'),
(608, '780ef1c3-280a-437b-ad23-e1cae38605ec', '5f12e5e5-b1bf-4758-968a-0e4f8c4d3a42');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `room`
--

CREATE TABLE `room` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(300) NOT NULL,
  `Private` tinyint(1) NOT NULL,
  `Avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `room`
--

INSERT INTO `room` (`ID`, `Name`, `Private`, `Avatar`) VALUES
('5f12e5e5-b1bf-4758-968a-0e4f8c4d3a42', 'Neagoe Donia # Pavel Ionut', 1, NULL),
('d12ca86c-a732-46c5-9833-76dadafed460', 'Miu Adriana # Pavel Ionut', 1, NULL);

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT pentru tabele `participants`
--
ALTER TABLE `participants`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=609;

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
