<?php
function Blad($kod)
{
	$calyRezultat["blad"] = $kod;
	echo json_encode($calyRezultat);
	exit();
}

session_start();
$calyRezultat = Array();
$calyRezultat["blad"] = 0;

if (!isset($_SESSION["uzytkownikId"]))
	$_SESSION["uzytkownikId"] = 0;

//===== Czy użytkownik jest już zalogowany =====//
if ($_SESSION["uzytkownikId"] != 0)
	Blad(2);

//===== Czy podano wszystkie zmienne =====//
if (!isset($_POST['login']) || !isset($_POST['email']) || !isset($_POST['haslo']) || !isset($_POST['haslo2']))
	Blad(100);

//===== Czy podano nazwę użytkownika =====//
if ($_POST['login'] == "")
	Blad(70);

//===== Czy e-mail jest poprawny =====//
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))
	Blad(51);

//===== Czy hasło się zgadza =====//
if ($_POST['haslo'] != $_POST['haslo2'])
	Blad(50);

//===== Czy nazwa użytkownika jest poprawna =====//
if ($_POST['login'] != preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST['login']))
	Blad(52);

//===== Połączenie do bazy danych =====//
require_once '../mysql.php';

//===== Czy nazwa użytkownika jest wolna =====//
$zapytanie = $mysql->prepare('SELECT COUNT(id) AS ilosc FROM uzytkownicy WHERE login = :login');
$zapytanie->bindValue(':login', $_POST['login'], PDO::PARAM_STR);
$zapytanie->execute();

$rezultat = $zapytanie->fetch();

if ($rezultat["ilosc"] != 0)
	Blad(60);

//===== Czy adres e-mail jest używany =====//
$zapytanie = $mysql->prepare('SELECT COUNT(id) AS ilosc FROM uzytkownicy WHERE email = :email');
$zapytanie->bindValue(':email', $_POST['email'], PDO::PARAM_STR);
$zapytanie->execute();

$rezultat = $zapytanie->fetch();

if ($rezultat["ilosc"] != 0)
	Blad(61);

//===== Dodwanie użytkownika =====//
$zapytanie = $mysql->prepare('INSERT INTO uzytkownicy(login, haslo, email, dostepneKafelki, ostatnioKafelki, dataZarejestrowania) VALUES (:login, :haslo, :email, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
$zapytanie->bindValue(':login', $_POST['login'], PDO::PARAM_STR);
$zapytanie->bindValue(':haslo', password_hash($_POST['haslo'], PASSWORD_BCRYPT), PDO::PARAM_STR);
$zapytanie->bindValue(':email', $_POST['email'], PDO::PARAM_STR);
$zapytanie->execute();

//===== Sprawdzanie ID =====//
$zapytanie = $mysql->prepare('SELECT id FROM uzytkownicy WHERE login = :login');
$zapytanie->bindValue(':login', $_POST['login'], PDO::PARAM_STR);
$zapytanie->execute();

$rezultat = $zapytanie->fetch();

$_SESSION['uzytkownikId'] = $rezultat['id'];

echo json_encode($calyRezultat);