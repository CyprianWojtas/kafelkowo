<?php
$calyRezultat = Array();
//===== Rozpoczynanie sesji =====//
session_start();
if (!isset($_SESSION["uzytkownikId"])) $_SESSION["uzytkownikId"] = 0;
//===== Sprawdzanie czy użytkownik jest zalogowany =====//
if ($_SESSION["uzytkownikId"] == 0)
{
	$calyRezultat["blad"] = 1;
	echo json_encode($calyRezultat);
	exit();
}
//===== Sprawdzanie id =====//
if (!isset($_POST["id"]))
{
	$calyRezultat["blad"] = 100;
	echo json_encode($calyRezultat);
	exit();
}

include("mysql.php");

//===== Sprawdzanie uzytkownika =====//
$zapytanie = $mysql->prepare("SELECT idWlasciciela FROM panele WHERE id = :id");
$zapytanie->bindValue(':id', $_POST["id"], PDO::PARAM_INT);
$zapytanie->execute();

if (!($rezultat = $zapytanie->fetch()))
{
	$calyRezultat["blad"] = 300;
	echo json_encode($calyRezultat);
	exit();
}

if ($rezultat["idWlasciciela"] != $_SESSION["uzytkownikId"])
{
	$calyRezultat["blad"] = 301;
	echo json_encode($calyRezultat);
	exit();
}

$zapytanie = $mysql->prepare("DELETE FROM panele WHERE id = :id");

$zapytanie->bindValue(':id', $_POST["id"], PDO::PARAM_INT);

if($zapytanie->execute())
{
	$calyRezultat["blad"] = 0;
}
else
{
	$calyRezultat["blad"] = 153;
}

//===== Zwrócenie odpowiedzi =====//
echo json_encode($calyRezultat);