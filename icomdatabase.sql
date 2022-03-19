-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: mart. 19, 2022 la 05:43 PM
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
(19, 'Popa', 'Cosmin', 'cosmin.popa@mta.ro', 'parolacosmin', 0);

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
('1337dacc-e6c2-4ada-83ef-284509a5a2bc', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'g'),
('34e7f242-0390-4bb6-b796-5d7e969f14f9', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'sasa'),
('3872a54d-c275-46ab-8019-09e674e36d32', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'),
('4ecbe40b-5d36-4653-99e6-2387b515567e', '13241dfd-e294-440b-a56f-ec55aa996409', 2, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'),
('56ac199f-bf77-4a25-8694-53f5cfb65814', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'sasasa'),
('8dbd3f36-ac72-4213-a87b-f903dd6498f5', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'g'),
('a0dd169b-ad76-44c4-8db3-82fc636df2a2', '13241dfd-e294-440b-a56f-ec55aa996409', 2, 'sasasa'),
('b100a339-0734-4bf9-9eeb-478150aa6703', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'gg'),
('e6546d79-2300-42e6-9a2d-f9847abe32eb', 'bf8bfc87-2b43-4bc2-bafd-c42f0ef214ab', 2, 'sasa'),
('ea99fb87-6bfc-40f8-9536-2911cd72ac80', '13241dfd-e294-440b-a56f-ec55aa996409', 2, 'sasasa'),
('ecc54366-443d-4d5d-88ea-f4e51c272af8', '13241dfd-e294-440b-a56f-ec55aa996409', 2, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'),
('f3e19d45-22a5-4e48-872a-05ac69c3f6ac', '13241dfd-e294-440b-a56f-ec55aa996409', 3, 'sasa');

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
(141, 2, 'e43c62e4-6582-44e9-8f6c-fff0871b8aff'),
(142, 12, 'e43c62e4-6582-44e9-8f6c-fff0871b8aff'),
(143, 2, 'bf8bfc87-2b43-4bc2-bafd-c42f0ef214ab'),
(144, 13, 'bf8bfc87-2b43-4bc2-bafd-c42f0ef214ab'),
(147, 2, '41fdeb6d-b4dd-48cb-a67a-d831cf9e1fc8'),
(148, 7, '41fdeb6d-b4dd-48cb-a67a-d831cf9e1fc8'),
(151, 2, '28c31ef2-bc69-4437-850a-e4a660a75874'),
(152, 15, '28c31ef2-bc69-4437-850a-e4a660a75874'),
(153, 2, '84175328-004b-413d-ae13-7d56fec270b5'),
(154, 16, '84175328-004b-413d-ae13-7d56fec270b5'),
(155, 2, '13241dfd-e294-440b-a56f-ec55aa996409'),
(156, 3, '13241dfd-e294-440b-a56f-ec55aa996409'),
(157, 2, '95d8e1ee-52c3-41ee-9447-31ca424ecb51'),
(158, 1, '95d8e1ee-52c3-41ee-9447-31ca424ecb51'),
(159, 2, '4696d7e1-0a67-4546-9323-890f0eadb0e1'),
(160, 14, '4696d7e1-0a67-4546-9323-890f0eadb0e1'),
(161, 2, 'dd5a9e42-6e79-49f5-9e72-01288951c39d'),
(162, 11, 'dd5a9e42-6e79-49f5-9e72-01288951c39d'),
(163, 2, 'c7e4ce1a-5270-4e1e-bfa1-24222bad5a42'),
(164, 9, 'c7e4ce1a-5270-4e1e-bfa1-24222bad5a42');

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
('13241dfd-e294-440b-a56f-ec55aa996409', 'Pesu Ciprian # Pavel Ionut', 1),
('28c31ef2-bc69-4437-850a-e4a660a75874', 'Ion Roberta # Pavel Ionut', 1),
('41fdeb6d-b4dd-48cb-a67a-d831cf9e1fc8', 'Chiforiuc Gabriela # Pavel Ionut', 1),
('4696d7e1-0a67-4546-9323-890f0eadb0e1', 'Neagoe Donia # Pavel Ionut', 1),
('84175328-004b-413d-ae13-7d56fec270b5', 'Pilipautanu Denissa-Porfirie # Pavel Ionut', 1),
('95d8e1ee-52c3-41ee-9447-31ca424ecb51', 'Stanciu Marian # Pavel Ionut', 1),
('bf8bfc87-2b43-4bc2-bafd-c42f0ef214ab', 'Petruse Ana-Maria # Pavel Ionut', 1),
('c7e4ce1a-5270-4e1e-bfa1-24222bad5a42', 'Cojocaru Marian # Pavel Ionut', 1),
('dd5a9e42-6e79-49f5-9e72-01288951c39d', 'Marghescu Bogdan # Pavel Ionut', 1),
('e43c62e4-6582-44e9-8f6c-fff0871b8aff', 'Marian Razvan # Pavel Ionut', 1);

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
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pentru tabele `participants`
--
ALTER TABLE `participants`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

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
