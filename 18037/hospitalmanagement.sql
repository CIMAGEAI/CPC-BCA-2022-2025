create database hospitalphp;
use hospitalphp;

create table admin
(
adminname varchar(50) primary key,
password varchar(10)
);

insert into admin values('admin','admin');

create table doctor
(
doctorid int(5) primary key auto_increment,
doctorname varchar(70),
specialization varchar(50),
contact varchar(10)
);


create table patient
(
patientid int(5) primary key auto_increment,
patientname varchar(70),
patientaddress varchar(100),
gender varchar(10),
contact varchar(10)
);

create table appointment
(
appointmentid int(5) primary key auto_increment,
doctorname varchar(70),
patientname varchar(70),
adate varchar(50),
atime varchar(50)
);