create database hospital_management_system;

use hospital_management_system;

create table login(ID varchar(20), PW varchar(20));

select * from login;

insert into login value("ankit", "123456789");

create table patient_info(ID varchar(20), Number varchar(40), Name varchar(20), Gender varchar(20), Patient_Disease varchar(20), Room_Number varchar(20), Time varchar(100), Deposite varchar (20));
select * from patient_info;
create table Room (room_no varchar(20) primary key,Availability varchar(20),Price varchar(20),Room_Type varchar(100));
select * from Room;


insert into Room values("100","Availabil","500","G Bed 1");
insert into Room values("101","Availabil","500","G Bed 2");
insert into Room values("102","Availabil","500","G Bed 3");
insert into Room values("103","Availabil","500","G Bed 4");
insert into Room values("200","Availabil","1500","Private Room");
insert into Room values("201","Availabil","1500","Private Room");
insert into Room values("202","Availabil","1500","Private Room");
insert into Room values("203","Availabil","1500","Private Room");
insert into Room values("300","Availabil","3500","ICU Bed 1");
insert into Room values("301","Availabil","3500","ICU Bed 2");
insert into Room values("302","Availabil","3500","ICU Bed 3");
insert into Room values("303","Availabil","3500","ICU Bed 4");
insert into Room values("304","Availabil","3500","ICU Bed 5");
insert into Room values("305","Availabil","3500","ICU Bed 6");


create table department(Department varchar(100), phone_no varchar(20));
select * from department;

insert into department values("Surgical department", "9122222286");
insert into department values("Nursing department", "9122222288");
insert into department values("Opreation department", "9122222289");
insert into department values("Paramedical department", "9122222290");

create table EMP_INFO(Name varchar(20), Age varchar(20), Phone_Number varchar(20), salary varchar(20), Aadhar_Number varchar(20));
select* from emp_info;

insert into EMP_INFO values("Doctors1", "30", "9655264624", "80000", "123456789012");
insert into EMP_INFO values("Doctors2", "35", "9852631475", "85000", "123456789012");

create table Ambulance(Name varchar(20),Gender varchar(20),Car_name varchar(20), Available varchar(20), Location varchar(20));
insert into Ambulance value("Hundai", "male", "Creta", "Available", "Patna");
insert into Ambulance value("Maruti", "male", "Swift", "Available", "Gaya");
select* from ambulance;
