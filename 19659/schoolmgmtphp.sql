-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2019 at 08:51 AM
-- Server version: 5.5.34
-- PHP Version: 5.4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `schoolmgmtphp`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

create database schoolmgmtphp;
use schoolmgmtphp;
CREATE TABLE IF NOT EXISTS `admin` (
  `adminname` varchar(50) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`adminname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminname`, `password`) VALUES
('admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `employee_info`
--

CREATE TABLE IF NOT EXISTS `employee_info` (
  `Employee_id` int(6) NOT NULL AUTO_INCREMENT,
  `First_name` varchar(20) NOT NULL,
  `Last_name` varchar(20) NOT NULL,
  `Position` varchar(20) NOT NULL,
  `Birth_day` date NOT NULL,
  `Mobile_no` varchar(12) NOT NULL,
  `Sex` varchar(20) NOT NULL,
  `Permanent` varchar(100) NOT NULL,
  `Present` varchar(100) NOT NULL,
  PRIMARY KEY (`Employee_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2009 ;

--
-- Dumping data for table `employee_info`
--

INSERT INTO `employee_info` (`Employee_id`, `First_name`, `Last_name`, `Position`, `Birth_day`, `Mobile_no`, `Sex`, `Permanent`, `Present`) VALUES
(2001, 'Jakir ', 'Sarker', 'Pinon', '1976-05-05', '172965863', 'male', 'Rajshahi', 'Rajshahi,Bangladesh'),
(2005, 'Rahim', 'Khan', 'swiper', '1999-06-04', '1072596586', 'male', 'Nandigram', 'Bogra'),
(2003, 'Anik', 'paul', 'pion', '1999-06-08', '8884568721', 'male', 'nandigam', 'Nandigram'),
(2008, 'juhi', 'pandey', 'peon', '1989-05-08', '0', 'female', ' Bhopal', '  Bhopal');

-- --------------------------------------------------------

--
-- Table structure for table `student_info`
--

CREATE TABLE IF NOT EXISTS `student_info` (
  `Roll` int(10) NOT NULL AUTO_INCREMENT,
  `First_name` varchar(20) NOT NULL,
  `Last_name` varchar(20) NOT NULL,
  `Class` int(20) NOT NULL,
  `Year` int(10) NOT NULL,
  `Birth_date` date NOT NULL,
  `Mobile_no` varchar(10) NOT NULL,
  `Sex` varchar(20) NOT NULL,
  `permanent` varchar(100) NOT NULL,
  `Present` varchar(100) NOT NULL,
  PRIMARY KEY (`Roll`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16004 ;

--
-- Dumping data for table `student_info`
--

INSERT INTO `student_info` (`Roll`, `First_name`, `Last_name`, `Class`, `Year`, `Birth_date`, `Mobile_no`, `Sex`, `permanent`, `Present`) VALUES
(16002, 'abcd', 'Paul', 10, 2012, '1999-05-14', '9200136384', 'male', 'Nandigram', 'Bogra,Rajshahi'),
(15003, 'Kalam', 'Sarker', 9, 2015, '1999-09-05', '1725985632', 'male', 'Hat karai', 'Hat karai'),
(16003, 'soumya', 'rajput', 10, 2012, '1998-05-08', '2147483647', 'female', ' Satna', '  Piplani Bhopal');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_info`
--

CREATE TABLE IF NOT EXISTS `teacher_info` (
  `Teachers_id` int(10) NOT NULL AUTO_INCREMENT,
  `First_name` varchar(20) NOT NULL,
  `Last_name` varchar(20) NOT NULL,
  `Position` varchar(20) NOT NULL,
  `Birth_day` date NOT NULL,
  `Mobile_no` varchar(10) NOT NULL,
  `Sex` varchar(20) NOT NULL,
  `Permanent` varchar(100) NOT NULL,
  `Present` varchar(100) NOT NULL,
  PRIMARY KEY (`Teachers_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3008 ;

--
-- Dumping data for table `teacher_info`
--

INSERT INTO `teacher_info` (`Teachers_id`, `First_name`, `Last_name`, `Position`, `Birth_day`, `Mobile_no`, `Sex`, `Permanent`, `Present`) VALUES
(3002, 'Manob', 'Chandra', 'Jonior Teacher', '1988-05-04', '1728695633', 'male', 'indrapuri', 'Nandigram,Bogra'),
(3001, 'Tangila', 'Akter.', 'Officer', '1989-05-06', '9701239491', 'female', 'Bogra', 'Bogra'),
(3005, 'Akter', 'Hossen', 'Assistant', '1990-06-08', '1728963566', 'male', 'Nandigram', 'Bogra'),
(3006, 'dolly', 'sisodiya', 'junior teacher', '1994-10-20', '2147483647', 'female', '230 Mohini tower F2 Indrapuri C Sector', '230 Mohini tower F2 Indrapuri C Sector'),
(3007, 'nancy', 'choudhary', 'junior teacher', '1997-05-14', '7987851154', 'female', 'ayodhya bypass', 'ayodhya bypass');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
