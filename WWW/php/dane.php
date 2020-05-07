<?php
function Blad($kod)
{
	$calyRezultat["blad"] = $kod;
	echo json_encode($calyRezultat);
	exit();
}

$calyRezultat = Array();
$calyRezultat["blad"] = 0;
//===== Rozpoczynanie sesji =====//
session_start();
if (!isset($_SESSION["uzytkownikId"])) $_SESSION["uzytkownikId"] = 0;
//===== Sprawdzanie czy użytkownik jest zalogowany =====//
if ($_SESSION["uzytkownikId"] == 0)
{
	Blad(1);
}

include("../mysql.php");

$zapytanie = $mysql->prepare("SELECT dostepneKafelki, id, login, ostatnioKafelki FROM uzytkownicy WHERE id = :id");
$zapytanie->bindValue(':id', $_SESSION["uzytkownikId"], PDO::PARAM_INT);
$zapytanie->execute();

if ($rezultat = $zapytanie->fetch())
{
	$zapytanie = $mysql->prepare("SELECT COUNT(id) AS ilosc FROM uzytkownicy WHERE ostatnioKafelki <= now() - INTERVAL 1 DAY AND id = :id");
	$zapytanie->bindValue(':id', $_SESSION["uzytkownikId"], PDO::PARAM_INT);
	$zapytanie->execute();
	$rezultat2 = $zapytanie->fetch();

	if ($rezultat2["ilosc"] > 0)
	{
		$zapytanie = $mysql->prepare("UPDATE uzytkownicy SET dostepneKafelki = dostepneKafelki + 5, ostatnioKafelki = CURRENT_TIMESTAMP WHERE id = :id");
		$zapytanie->bindValue(':id', $_SESSION["uzytkownikId"], PDO::PARAM_INT);
		$zapytanie->execute();
	}

	$calyRezultat["uzytkownikId"] = $rezultat["id"];
	$calyRezultat["uzytkownikNazwa"] = $rezultat["login"];
	$calyRezultat["dostepneKafelki"] = $rezultat["dostepneKafelki"];
}
echo json_encode($calyRezultat);