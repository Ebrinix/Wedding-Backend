-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 05, 2024 at 10:03 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wedding`
--

-- --------------------------------------------------------

--
-- Table structure for table `Rvsps`
--

CREATE TABLE `Rvsps` (
  `id` int(11) NOT NULL,
  `groupName` varchar(100) NOT NULL,
  `numberOfInvites` int(11) NOT NULL,
  `accessCodes` varchar(500) NOT NULL,
  `approvedAccessCodes` varchar(500) DEFAULT NULL,
  `isAttending` enum('TRUE','FALSE') DEFAULT NULL,
  `approve` enum('TRUE','FALSE','REVOKE') DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Rvsps`
--

INSERT INTO `Rvsps` (`id`, `groupName`, `numberOfInvites`, `accessCodes`, `approvedAccessCodes`, `isAttending`, `approve`, `createdAt`, `updatedAt`) VALUES
(1, 'groupName', 4, 'WN21ZBTP-KLDMK0LM-4ELSCFBU-UD3NBM1G', '4ELSCFBU', 'TRUE', 'REVOKE', '2024-09-25 11:28:53', '2024-09-25 14:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `UploadImages`
--

CREATE TABLE `UploadImages` (
  `id` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  `status` enum('APPROVE','DECLINE') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `UploadImages`
--

INSERT INTO `UploadImages` (`id`, `image`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '1728041920619ooo.png', 'APPROVE', '2024-10-04 11:38:40', '2024-10-04 11:48:04'),
(2, '1728041920665kkk.png', 'DECLINE', '2024-10-04 11:38:40', '2024-10-04 11:38:40'),
(3, '1728041920669jjj.png', 'DECLINE', '2024-10-04 11:38:40', '2024-10-04 11:38:40'),
(4, '1728041920674iii.png', 'DECLINE', '2024-10-04 11:38:40', '2024-10-04 11:38:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Rvsps`
--
ALTER TABLE `Rvsps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `UploadImages`
--
ALTER TABLE `UploadImages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Rvsps`
--
ALTER TABLE `Rvsps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `UploadImages`
--
ALTER TABLE `UploadImages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
