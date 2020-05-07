-- phpMyAdmin SQL Dump
-- version 4.7.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 28 Maj 2018, 15:43
-- Wersja serwera: 10.1.29-MariaDB
-- Wersja PHP: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `kafelkowo`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `panele`
--

CREATE TABLE `panele` (
  `id` int(11) NOT NULL,
  `idWlasciciela` int(11) NOT NULL,
  `pozycjaX` bigint(20) NOT NULL,
  `pozycjaY` bigint(20) NOT NULL,
  `rozmiarX` int(11) NOT NULL,
  `rozmiarY` int(11) NOT NULL,
  `kolor` varchar(6) COLLATE utf8_unicode_ci NOT NULL DEFAULT '214',
  `zawartosc` text COLLATE utf8_unicode_ci,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Zrzut danych tabeli `panele`
--

INSERT INTO `panele` (`id`, `idWlasciciela`, `pozycjaX`, `pozycjaY`, `rozmiarX`, `rozmiarY`, `kolor`, `zawartosc`, `data`) VALUES
(1, 1, -3, -4, 7, 7, 'b9e4ff', '\r\n   [size=32][b][color=#040]Kafelkowo[/color][/b][/size] - publiczna tablica internetowa\r\n\r\n\r\n   Na tej tablicy każdy może dodawać swoje kafelki i umieszczać w nich co chce.\r\n   \r\n   Każdy użytkownik dostaje po 5 kafelków co 24 godziny przy każdym zalogowaniu.\r\n\r\n   Ustawiony kafelek znika po 7 dniach.\r\n\r\n\r\n   Po tej tablicy można się poruszać przy użyciu myszki.\r\n\r\n   Do edycji kafelków można używać języka BB Code.', '2019-05-28 15:16:23'),
(2, 1, -8, -2, 5, 5, 'ffffff', '[bimg=http://wzs.zator.pl/images/logo.png]', '2019-05-28 15:23:51'),
(3, 1, -8, -5, 5, 3, '00e6ff', '\r\n[center][size=42]Do tworzenia tablicy użyto biblioteki[/size]\r\n\r\n[img=https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/JQuery_logo_text.svg/420px-JQuery_logo_text.svg.png][/center]', '2019-05-28 15:26:21'),
(4, 1, 4, 0, 4, 4, 'ffffff', '\r\n[center][size=20][b]Projekt na[/b][/size]\r\n[size=32]Festiwal Informatyczny „Projekt na Szóstkę”[/size]\r\n[img=https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/p200x200/10659446_849559078422280_5289966010316106165_n.jpg?_nc_cat=0&oh=08ccf05caac22c225fde0359b88d5c12&oe=5B7A8412][/center]', '2019-05-28 15:33:09');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownicy`
--

CREATE TABLE `uzytkownicy` (
  `id` int(11) NOT NULL,
  `login` tinytext CHARACTER SET latin1 NOT NULL,
  `haslo` tinytext CHARACTER SET latin1 NOT NULL,
  `email` tinytext CHARACTER SET latin1 NOT NULL,
  `dostepneKafelki` int(11) NOT NULL,
  `ostatnioKafelki` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dataZarejestrowania` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Zrzut danych tabeli `uzytkownicy`
--

INSERT INTO `uzytkownicy` (`id`, `login`, `haslo`, `email`, `dostepneKafelki`, `ostatnioKafelki`, `dataZarejestrowania`) VALUES
(1, 'Kafelkowo', '$2y$10$ZoHDSRfu2oHRAM3pHuQt5.w5ZuySlv7pWyokpYWs2DYtAqywoPQba', 'kafelkowo@gmail.com', 14840, '2018-05-28 15:15:38', '2018-05-28 15:15:38');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `panele`
--
ALTER TABLE `panele`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `panele`
--
ALTER TABLE `panele`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
