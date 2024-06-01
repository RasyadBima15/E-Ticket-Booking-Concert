CREATE DATABASE `e-ticket-concert`;

USE `e-ticket-concert`;

-- Tabel User
CREATE TABLE User (
    idUser INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Fullname VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    NoTelp VARCHAR(15),
    Gender VARCHAR(10),
    Role ENUM('User', 'Admin') NOT NULL,
    Balance INT DEFAULT 100000
);
-- Tabel Concert
CREATE TABLE Concert (
    IdConcert INT PRIMARY KEY AUTO_INCREMENT,
    Nama VARCHAR(100) NOT NULL,
    Lokasi VARCHAR(150) NOT NULL,
    ImageConcert VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Deskripsi TEXT NOT NULL
);
-- Tabel Band
CREATE TABLE Band (
    IdBand INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    ImageBand VARCHAR(255) NOT NULL,
    IdConcert INT,
    FOREIGN KEY (IdConcert) REFERENCES Concert(IdConcert) ON DELETE SET NULL
);
-- Tabel Ticket
CREATE TABLE Ticket (
    IdTicket INT PRIMARY KEY AUTO_INCREMENT,
    IdConcert INT,
    TicketType ENUM('VIP', 'Umum') NOT NULL,
    Status ENUM('Available', 'Soldout') NOT NULL,
    Price INT NOT NULL,
    FOREIGN KEY (IdConcert) REFERENCES Concert(IdConcert) ON DELETE SET NULL
);
-- Tabel Payment
CREATE TABLE Payment (
    IdPayment INT PRIMARY KEY AUTO_INCREMENT,
    IdUser INT,
    IdTicket INT,
    PaymentDate DATE NOT NULL,
    Amount INT NOT NULL,
    FOREIGN KEY (IdUser) REFERENCES User(IdUser) ON DELETE SET NULL,
    FOREIGN KEY (IdTicket) REFERENCES Ticket(IdTicket) ON DELETE SET NULL
);

