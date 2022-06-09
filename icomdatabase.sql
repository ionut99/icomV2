-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: iun. 09, 2022 la 09:26 PM
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
  `type` varchar(255) NOT NULL,
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
('2402e87d-0cd1-4f2f-9164-f63b0ae546b3', 'image/png', 'video_conference.png', 'd4f597dc-5893-4399-8a29-e114f80c6897', '2022/06/09 01:14:58.940', '77c0cb4a-68cf-40b9-89a7-2443571ad458', 237646, 'users\\\\77c0cb4a-68cf-40b9-89a7-2443571ad458\\\\1654726498940 video_conference.png');

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
(121, '2402e87d-0cd1-4f2f-9164-f63b0ae546b3', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '368cb990-2de4-468f-8121-3deb8a65bc1a');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `folders`
--

CREATE TABLE `folders` (
  `folderId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parentId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `createdTime` varchar(255) NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `folders`
--

INSERT INTO `folders` (`folderId`, `name`, `parentId`, `userId`, `createdTime`, `path`) VALUES
('03f6a303-fbf7-4183-828c-fd60a4b9d337', 'Vlasceanu Mihnea # Pavel Ionut', 'root', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022-06-08 20:53:04.355', '[]'),
('24ab6329-9b4e-4335-ba37-fa9d27ec509e', 'C114C', 'root', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022-06-09 01:17:19.063', '[]'),
('2da9b5d3-5848-419c-9f8f-d2fb559e2422', 'new ', '03f6a303-fbf7-4183-828c-fd60a4b9d337', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022/06/09 00:52:15.322', '[\"[\",\"]\",{\"name\":\"Vlasceanu Mihnea # Pavel Ionut\",\"folderId\":\"03f6a303-fbf7-4183-828c-fd60a4b9d337\"}]'),
('4d024c82-4fd5-4414-8748-6c90bf1c1968', 'folderul meu nou ', 'root', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022/06/08 21:18:31.927', '[]'),
('5d792ad1-d980-44c9-b4ce-41c0343df63e', 'folderul meu', '03f6a303-fbf7-4183-828c-fd60a4b9d337', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022/06/08 21:10:23.390', '[{\"folderId\":\"03f6a303-fbf7-4183-828c-fd60a4b9d337\"}]'),
('69145891-69b1-459b-9fb3-2f5cd7ad26ce', 'folder 2', 'root', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022/06/08 21:20:30.745', '[]'),
('d4f597dc-5893-4399-8a29-e114f80c6897', 'Cazamir Teodor # Pavel Ionut', 'root', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022-06-08 21:28:13.066', '[]'),
('d795da12-f427-4955-bbd3-8de35eecef41', 'new 2', '2da9b5d3-5848-419c-9f8f-d2fb559e2422', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022/06/09 00:52:28.948', '[\"[\",\"\\\"\",\"[\",\"\\\"\",\",\",\"\\\"\",\"]\",\"\\\"\",\",\",\"{\",\"\\\"\",\"n\",\"a\",\"m\",\"e\",\"\\\"\",\":\",\"\\\"\",\"V\",\"l\",\"a\",\"s\",\"c\",\"e\",\"a\",\"n\",\"u\",\" \",\"M\",\"i\",\"h\",\"n\",\"e\",\"a\",\" \",\"#\",\" \",\"P\",\"a\",\"v\",\"e\",\"l\",\" \",\"I\",\"o\",\"n\",\"u\",\"t\",\"\\\"\",\",\",\"\\\"\",\"f\",\"o\",\"l\",\"d\",\"e\",\"r\",\"I\",\"d\",\"\\\"\",\":\",\"\\\"\",\"0\",\"3\",\"f\",\"6\",\"a\",\"3\",\"0\",\"3\",\"-\",\"f\",\"b\",\"f\",\"7\",\"-\",\"4\",\"1\",\"8\",\"3\",\"-\",\"8\",\"2\",\"8\",\"c\",\"-\",\"f\",\"d\",\"6\",\"0\",\"a\",\"4\",\"b\",\"9\",\"d\",\"3\",\"3\",\"7\",\"\\\"\",\"}\",\"]\",{\"name\":\"new \",\"folderId\":\"2da9b5d3-5848-419c-9f8f-d2fb559e2422\"}]'),
('fac464df-68a8-4ac5-a1b4-45fd85492d3b', 'sssssssssssssssss', 'root', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '2022/06/08 21:24:48.219', '[]');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `foldersusers`
--

CREATE TABLE `foldersusers` (
  `ID` int(11) NOT NULL,
  `folderIdResource` varchar(255) NOT NULL,
  `userIdBeneficiary` varchar(255) DEFAULT NULL,
  `roomIdBeneficiary` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `foldersusers`
--

INSERT INTO `foldersusers` (`ID`, `folderIdResource`, `userIdBeneficiary`, `roomIdBeneficiary`) VALUES
(216, '03f6a303-fbf7-4183-828c-fd60a4b9d337', NULL, '5efe79d3-7cfb-4231-a7ce-21930bea62d1'),
(218, '4d024c82-4fd5-4414-8748-6c90bf1c1968', '77c0cb4a-68cf-40b9-89a7-2443571ad458', NULL),
(219, '69145891-69b1-459b-9fb3-2f5cd7ad26ce', '77c0cb4a-68cf-40b9-89a7-2443571ad458', NULL),
(220, 'fac464df-68a8-4ac5-a1b4-45fd85492d3b', '77c0cb4a-68cf-40b9-89a7-2443571ad458', NULL),
(221, 'd4f597dc-5893-4399-8a29-e114f80c6897', NULL, '368cb990-2de4-468f-8121-3deb8a65bc1a'),
(222, '2da9b5d3-5848-419c-9f8f-d2fb559e2422', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '5efe79d3-7cfb-4231-a7ce-21930bea62d1'),
(223, 'd795da12-f427-4955-bbd3-8de35eecef41', '77c0cb4a-68cf-40b9-89a7-2443571ad458', '5efe79d3-7cfb-4231-a7ce-21930bea62d1'),
(224, '24ab6329-9b4e-4335-ba37-fa9d27ec509e', NULL, 'a213e001-c3dd-4f67-9c84-f803ad9c773c');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `iusers`
--

CREATE TABLE `iusers` (
  `userId` varchar(255) NOT NULL,
  `surname` varchar(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `password` varchar(200) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `isOnline` tinyint(1) NOT NULL,
  `lastOnline` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `iusers`
--

INSERT INTO `iusers` (`userId`, `surname`, `name`, `email`, `salt`, `password`, `isAdmin`, `isOnline`, `lastOnline`, `avatar`) VALUES
('0298b788-a1ce-4bca-8c6f-bb97f13eee27', 'Olaru', 'Cristian', 'cristian.olaru@mta.ro', '1!oUdIoYFmKKEp&!^Kb!nEdBF_0QfT2Q+-RNbNE!9W$Yi!EiyXfv$L^!Qahf=5vW', '2a1b932662888ba699d4feb213e183ff8409524314de3939edcd7966e8536d6eb0e7af8adad2b0d7405e06ea51445c5c42432a66c400c391bdf8bd09514b57d7', 0, 0, '', NULL),
('113bfc88-4b4a-4c75-ae92-df61309781a3', 'Alex', 'Alex', 'ionut_pavel1999@yahoo.com', 'V1n@4nLA%jgE-1TZH$o30qCYUI5KZM3%T9gkT0wxr3YQKA+-LiCi8d0nFkTH%C5c', '6ec053e6f33e0b254657f4c066576e3b26935a3ec9c740d8f1835886a3771f97d158d518ddbef7da2a3b1270e1d10c68690de4e687792d0a39b8bf618e4799e0', 0, 0, '', NULL),
('39428aec-3975-4daa-ad93-0f7a8c61e6dd', 'Pilipautanu', 'Denissa', 'denissa.pilipautan@mta.ro', 'e2FqOo^RBbmr&jLtkR2+eo*O2dtvbPms$fya*ziOs_&%ubC1h&DN$jQKyawYdjpf', '581930adaf6f3ffc8a712c1f59d05877dfbd46e821d9cb2aba2b9ba8bef26ecf16c3bb93261c7029db42aa5fcd80607971699bd1c602a37b301a99d2b56a35a0', 0, 0, '', NULL),
('3d8855a3-1f3a-40ac-9b80-27ab3be15e60', 'Ion', 'Roberta', 'roberta.ion@mta.ro', 'NeI_gr^+FgD2f4qR#^00cKYCBMkoGAldC^PNXIkI5CmlW^N7d9z@#LsAqXXi&jKq', '9afc2d3907ae810c8c9c493cf24b849cb7442e95a1115c9b7d2b006506e396ff9545952252f05ef2250004d8a7ef7d90f97e76c2be59401ee52ac99555d913cf', 0, 0, '', NULL),
('4956073b-6da9-431e-9c5c-185c45a0a577', 'Popescu', 'Ion', 'ion.popescu@mta.ro', 'KlZ3pL6cuNxpXl4TiGhDqW-IsIGvsd3-0*$c^YXZ@iy4QGetKGCJPX=88dxy=mqs', '38d6f6e898f1684a17e0d0c2468ccd07840bb5c1dc9f43ad09e84d615f3ebf12ef6c7123ab71ffec732f42f31ad3830df24ffb2d15c6daab470605e93aac35bd', 1, 0, '', NULL),
('77c0cb4a-68cf-40b9-89a7-2443571ad458', 'Pavel', 'Ionut', 'ionut.pavel@mta.ro', '%Qd#gVRclmr+dOA=#4wsEvO^-JITFY6h1Zc^m85cCD9rKaLFf5ejs+vnWAtz!Rx9', '78df84997cdd3b79053f4bb57900a5ec2094437f2ac0b38f138d5f5a167957a4b8c98ecf6dc508b9e9083771770764a9b1a2b72e21562175947688dda035e44b', 1, 0, '', 'users\\77c0cb4a-68cf-40b9-89a7-2443571ad458\\1654724441939 video_conference.png'),
('8c8b6858-d853-40b7-9c1c-72776092c191', 'Lihor', 'Ioachim', 'ioachim.lihor@mta.ro', 'zwzpU8vUKyxbb+#D+jE2Rwr4nD7XrqH=tMEsjE#J60Ug5NI2=Uz_ETyIG^C4DFp*', '4f4e040636139ca0aaf282915028504a71199bb2872bc49eaa42b80448c6aebe2ab10a20b4d59f38eff05656a9f3c264eae5c034a2c65536dbfd80d7c9b7fe26', 0, 0, '', NULL),
('a420a649-9e2b-4a6d-bfd0-2ab88b78054d', 'Fuiorea ', 'Daniela', 'daniela.fuioarea@mta.ro', 'v@76G6uW-zc7c*$z_cd!CyZ4DFtsv*9FESvzglpG-JaEB#*wwNQyZXoIT1UOR3Gb', '698d915e6d283c5bad8135c725c9873e4b0ff4309c89b5b4369d7ca9813c82d3d1023e6d6223fefcf76a6d2ceee31f7421e3f6d9a46ece24ec929ab1a681c554', 0, 0, '', NULL),
('aa659487-fbbc-4808-be2c-f17a97032e71', 'Marian', 'Razvan', 'razvan.marian@mta.ro', 'MGDpR-hXbpGH195-x7wlCI!Tpcw$6AHN!U+hEzG3vwsl@*nXAutghmzz*#f#$19h', '59cfd7fe0259af8ba5879f0e4530935df4153aac4a9def46f7856ae45d0c8bce906b0d25d7e4f0f95eee1ba6ffebaab0233622d043873c2a37cc2bdf9b3d95ae', 0, 0, '', NULL),
('b1ffc96e-32c1-4ad3-945c-a893768a529c', 'Cazamir', 'Teodor', 'teodor.cazamir@mta.ro', '9x*pahk_XTzgRf2prO$Q%&asf*Zs@X$GRC^Jm1booXYJvaZvkS9YtL4lT3=JydEj', '08ef60dd9f6caa6719eb16ac00ad0c6b1d29a4569a26a8fed768a2e683449e78a86c53a56b04697da078130a914b0142f27425d661ff0c0ff736ee60f3e8d081', 0, 0, '', 'users\\b1ffc96e-32c1-4ad3-945c-a893768a529c\\1654730440228 model_homepage.png'),
('c3fdbf59-000c-45f0-a59f-434f2ab02a95', 'Cojocaru', 'Marian', 'cojocaru.marian@mta.ro', 'Emj62qkArF0xt^EM4jNhJx9bv+_x9BQKJF4UI9W@bME%s0uXJt^gYr$NzO4_99ci', '5b9039a7527831eebbcdd797801cb62076530aeb04b06810d0f946f60b5f5bc86fed478e14092db8c11914d11745ba851554b4d47a7663cc23a77ca7ccdfb2ca', 0, 0, '', NULL),
('cd1914a4-d9f9-4909-b6ad-edc5cd2f579a', 'Vlasceanu', 'Mihnea', 'mihnea.vlasceanu@mta.ro', 't39uByh8DLNs=L-LTrRrWyqurI@GZXDMPkD$C!p+D7kGX$=uazwMfpJr1iGU9OML', '2e2a83f08628325d44b4694e9585aacaeff7c65c1871d46125953fa3668dfd1d644b365667d852857f87ec8bb1a388bda78b3465c558f2f1fdbf4814db601d5d', 1, 0, '', NULL),
('cfd36115-1657-441c-8130-69353cb00a56', 'Bursuc', 'Alex', 'alex.bursuc@mta.ro', 'e%9osI5Dmd&XP83VTZ2ixgJFp1cE-tGWox4yG8NCH99c977HNdU%zPWoZss3sbH_', '52f41416fea51e7ea359b77b7975fdc469661052bf1be2029d34dd27425d8a24681df5778b8cb92e8cb12214aafc3a9492c36457045189956df2003e0f83cd81', 0, 0, '', NULL),
('e68817a7-c973-4ccd-9f51-9d869fe622fb', 'Pitulice', 'Maria', 'maria.pitulice@mta.ro', '&ff@yO!JBUYgL%O*xMlDeK8MrkzCZ&Z%tWcnmGS1r&NZDM1t#jobH4wEsjgzW!1*', 'e70d80b8ab6b5ebb18903def3be2651af51d14857fad2330f365a0b2fe3281565ef2dd6720a074487f7149baf142e638e709727c9ddc5583dc7bf3d6019ef2d1', 0, 0, '', NULL);

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `messages`
--

CREATE TABLE `messages` (
  `ID_message` varchar(100) NOT NULL,
  `roomId` varchar(100) NOT NULL,
  `senderId` varchar(255) NOT NULL,
  `body` longtext NOT NULL,
  `type` varchar(255) NOT NULL,
  `fileId` varchar(255) DEFAULT NULL,
  `createdTime` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `messages`
--

INSERT INTO `messages` (`ID_message`, `roomId`, `senderId`, `body`, `type`, `fileId`, `createdTime`) VALUES
('e1c8d5ff-bbd0-4194-9929-941cb65dae72', '368cb990-2de4-468f-8121-3deb8a65bc1a', '77c0cb4a-68cf-40b9-89a7-2443571ad458', 'video_conference.png', 'image/png', '2402e87d-0cd1-4f2f-9164-f63b0ae546b3', '2022/06/09 01:14:58.909');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `participants`
--

CREATE TABLE `participants` (
  `ID` int(10) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `roomId` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `participants`
--

INSERT INTO `participants` (`ID`, `userId`, `roomId`) VALUES
(681, 'cd1914a4-d9f9-4909-b6ad-edc5cd2f579a', '5efe79d3-7cfb-4231-a7ce-21930bea62d1'),
(682, '77c0cb4a-68cf-40b9-89a7-2443571ad458', '5efe79d3-7cfb-4231-a7ce-21930bea62d1'),
(683, 'b1ffc96e-32c1-4ad3-945c-a893768a529c', '368cb990-2de4-468f-8121-3deb8a65bc1a'),
(684, '77c0cb4a-68cf-40b9-89a7-2443571ad458', '368cb990-2de4-468f-8121-3deb8a65bc1a'),
(685, '77c0cb4a-68cf-40b9-89a7-2443571ad458', 'a213e001-c3dd-4f67-9c84-f803ad9c773c');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `room`
--

CREATE TABLE `room` (
  `ID` varchar(100) NOT NULL,
  `name` varchar(300) NOT NULL,
  `private` tinyint(1) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `room`
--

INSERT INTO `room` (`ID`, `name`, `private`, `avatar`) VALUES
('368cb990-2de4-468f-8121-3deb8a65bc1a', 'Cazamir Teodor # Pavel Ionut', 1, NULL),
('5efe79d3-7cfb-4231-a7ce-21930bea62d1', 'Vlasceanu Mihnea # Pavel Ionut', 1, NULL),
('a213e001-c3dd-4f67-9c84-f803ad9c773c', 'C114C', 0, NULL);

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
  ADD KEY `fk_userID` (`userId`);

--
-- Indexuri pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `jk_folderId` (`folderIdResource`),
  ADD KEY `fk_roomIdBeneficiary` (`roomIdBeneficiary`),
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
  ADD KEY `fk_roomId` (`roomId`),
  ADD KEY `fk_sender` (`senderId`);

--
-- Indexuri pentru tabele `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `jk_roomId` (`roomId`),
  ADD KEY `fjk_userId` (`userId`);

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT pentru tabele `foldersusers`
--
ALTER TABLE `foldersusers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT pentru tabele `participants`
--
ALTER TABLE `participants`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=686;

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
