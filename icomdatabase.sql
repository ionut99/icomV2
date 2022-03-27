-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mart. 27, 2022 la 12:34 PM
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
  `ID` varchar(255) NOT NULL,
  `FIleName` varchar(255) NOT NULL,
  `Content` longtext DEFAULT NULL,
  `RoomID` varchar(255) NOT NULL,
  `FilePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `IsAdmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `iusers`
--

INSERT INTO `iusers` (`userId`, `Surname`, `Name`, `Email`, `Password`, `IsAdmin`) VALUES
(1, 'Stanciu', 'Marian', 'marian.stanciu@mta.ro', 'parolastanciu', 1),
(2, 'Pavel', 'Ionut', 'ionut.pavel@mta.ro', 'parola', 1),
(3, 'Pesu', 'Ciprian', 'ciprian.pesu@mta.ro', 'parolapesu', 0),
(4, 'Popescu', 'Alexandru', 'alexandru.popescu@mta.ro', 'parolapopescu', 1),
(5, 'Vasilescu', 'Matei', 'matei.vasilescu@mta.ro', 'parolavasilescu', 0),
(6, 'Cazamir', 'Teodor', 'teodor.cazamir@mta.ro', 'parolacazamir', 0),
(7, 'Chiforiuc', 'Gabriela', 'gabriela.chiforiuc@mta.ro', 'parolagabriela', 0),
(8, 'Fuiorea', 'Daniela', 'daniela.fuiorea@mta.ro', 'paroladaniela', 0),
(9, 'Cojocaru', 'Marian', 'marian.cojocaru@mta.ro', 'parolamarian', 0),
(10, 'Oprea', 'Stefan', 'stefan.oprea@mta.ro', 'parolastefen', 0),
(11, 'Marghescu', 'Bogdan', 'bogdan.marghescu@mta.ro', 'parolabogdan', 1),
(12, 'Marian', 'Razvan', 'ravan.marian@mta.ro', 'parolarazvan', 0),
(13, 'Petruse', 'Ana-Maria', 'ana.petruse@mta.ro', 'parolaana', 0),
(14, 'Neagoe', 'Donia', 'donia.neagoe@mta.ro', 'paroladonia', 0),
(15, 'Ion', 'Roberta', 'roberat.ion@mta.ro', 'parolaroberta', 0),
(16, 'Pilipautanu', 'Denissa-Porfirie', 'denissa.porfirie@mta.ro', 'paroladenissa', 0),
(17, 'Pitulice', 'Maria', 'maria.pitulice@mta.ro', 'parolamaria', 0),
(18, 'Olaru', 'Cristian', 'cristian.olaru@mta.ro', 'parolacristian', 0),
(19, 'Popa', 'Cosmin', 'cosmin.popa@mta.ro', 'parolacosmin', 0),
(20, 'Bursuc', 'Alex-George', 'alex.bursuc@mta.ro', 'parolaalex', 1);

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

--
-- Eliminarea datelor din tabel `messages`
--

INSERT INTO `messages` (`ID_message`, `RoomID`, `senderID`, `Body`) VALUES
('99adebf6-e8ba-467e-a156-d1c7a4182ed5', '5ffb9135-469d-414a-af66-9f7cf73c7aad', 2, 'un alt mesaj pentru grupul de test'),
('ef930686-b0a1-4dab-8e3d-969c5b839f7b', '5ffb9135-469d-414a-af66-9f7cf73c7aad', 2, 'primul mesaj din grupul de test');

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
(393, 2, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(394, 6, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(395, 20, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(396, 3, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(397, 1, '6a152685-d59e-4b47-ad7c-b254377511cf'),
(398, 2, '6a152685-d59e-4b47-ad7c-b254377511cf'),
(399, 1, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(402, 8, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(403, 9, '5ffb9135-469d-414a-af66-9f7cf73c7aad'),
(412, 3, '63654325-b157-4995-ab5a-8fc7cdec3955'),
(413, 2, '63654325-b157-4995-ab5a-8fc7cdec3955'),
(416, 16, '742080e8-4a0b-44e8-a287-26a2501698f3'),
(418, 16, '0f296fed-3f2c-4caf-b96d-a5fb9e2a545c'),
(420, 17, '06b6f89f-5ab0-480f-af43-528fd137ade9'),
(438, 20, 'a92ada73-2fcc-4cc5-88ab-99cea99a27dd'),
(439, 2, 'a92ada73-2fcc-4cc5-88ab-99cea99a27dd');

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
('06b6f89f-5ab0-480f-af43-528fd137ade9', 'Pitulice Maria # Pavel Ionut', 1),
('0f296fed-3f2c-4caf-b96d-a5fb9e2a545c', 'Pilipautanu Denissa-Porfirie # Pavel Ionut', 1),
('5ffb9135-469d-414a-af66-9f7cf73c7aad', 'grupul de test', 0),
('63654325-b157-4995-ab5a-8fc7cdec3955', 'Pesu Ciprian # Pavel Ionut', 1),
('6a152685-d59e-4b47-ad7c-b254377511cf', 'Stanciu Marian # Pavel Ionut', 1),
('742080e8-4a0b-44e8-a287-26a2501698f3', 'Pilipautanu Denissa-Porfirie # Pavel Ionut', 1),
('a92ada73-2fcc-4cc5-88ab-99cea99a27dd', 'Bursuc Alex-George # Pavel Ionut', 1);

--
-- Indexuri pentru tabele eliminate
--

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
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT pentru tabele eliminate
--

--
-- AUTO_INCREMENT pentru tabele `iusers`
--
ALTER TABLE `iusers`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pentru tabele `participants`
--
ALTER TABLE `participants`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=440;

--
-- Constrângeri pentru tabele eliminate
--

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
