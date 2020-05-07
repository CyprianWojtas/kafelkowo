<?php
$calyRezultat = Array();
//===== Rozpoczynanie sesji =====//
session_start();
if (!isset($_SESSION["uzytkownikId"])) $_SESSION["uzytkownikId"] = 0;
//===== Zamiast logowania =====// - USUNĄĆ
if ($_SESSION["uzytkownikId"] == 0)
	$_SESSION["uzytkownikId"] = 1;

//===== Sprawdzanie czy użytkownik jest zalogowany =====//
if ($_SESSION["uzytkownikId"] == 0)
{
	$calyRezultat["blad"] = 1;
	echo json_encode($calyRezultat);
	exit();
}
//===== Sprawdzanie zmiennych =====//
if (!isset($_GET["x"]) || !isset($_GET["y"]) || !isset($_GET["rx"]) || !isset($_GET["ry"]))
{
	$calyRezultat["blad"] = 100;
	echo json_encode($calyRezultat);
	exit();
}

$pozycjaX = $_GET["x"];
$pozycjaY = $_GET["y"];

if ($_GET["rx"] <= 30)
	$rozmiarX = $_GET["rx"];
else
	$rozmiarX = 30 + $pozycjaX;
	
if ($_GET["ry"] <= 30)
	$rozmiarY = $_GET["ry"];
else
	$rozmiarY = 30 + $pozycjaY;

include("mysql.php");

//===== Sprawszanie uzytkownika =====//
$zapytanie = $mysql->prepare("SELECT dostepneKafelki FROM uzytkownicy WHERE id = :id");
$zapytanie->bindValue(':id', $_SESSION["uzytkownikId"], PDO::PARAM_INT);
$zapytanie->execute();

$rezultat = $zapytanie->fetch();

if ($rezultat["dostepneKafelki"] >= $rozmiarX * $rozmiarY)
{
	$kafelkiPozostale = $rezultat["dostepneKafelki"] - $rozmiarX * $rozmiarY;
	//===== Sprawdzanie czy pole jest dostępne =====//
	$zapytanie = $mysql->prepare("SELECT id FROM panele WHERE pozycjaX < :rozmiarX + :pozycjaX AND :pozycjaX2 < pozycjaX + rozmiarX AND pozycjaY < :rozmiarY + :pozycjaY AND :pozycjaY2 < pozycjaY + rozmiarY AND data >= now() - INTERVAL 7 DAY");
	$zapytanie->bindValue(':pozycjaX', $pozycjaX, PDO::PARAM_INT);
	$zapytanie->bindValue(':pozycjaX2', $pozycjaX, PDO::PARAM_INT);
	$zapytanie->bindValue(':rozmiarX', $rozmiarX, PDO::PARAM_INT);
	$zapytanie->bindValue(':pozycjaY', $pozycjaY, PDO::PARAM_INT);
	$zapytanie->bindValue(':pozycjaY2', $pozycjaY, PDO::PARAM_INT);
	$zapytanie->bindValue(':rozmiarY', $rozmiarY, PDO::PARAM_INT);

	$zapytanie->execute();

	if ($zapytanie->rowCount() == 0)
	{
		//===== Wstawianie pola do bazy danych =====//
		$zapytanie = $mysql->prepare("UPDATE uzytkownicy SET dostepneKafelki = dostepneKafelki - :zuzyteKafelki WHERE id = :id");
		$zapytanie->bindValue(':zuzyteKafelki', $rozmiarX * $rozmiarY, PDO::PARAM_INT);
		$zapytanie->bindValue(':id', $_SESSION["uzytkownikId"], PDO::PARAM_INT);

		if($zapytanie->execute())
		{
			$zapytanie = $mysql->prepare("INSERT INTO panele(idWlasciciela, pozycjaX, pozycjaY, rozmiarX, rozmiarY, kolor, zawartosc) VALUES (:id, :pozycjaX, :pozycjaY, :rozmiarX, :rozmiarY, :kolor, '')");
			$zapytanie->bindValue(':id', $_SESSION["uzytkownikId"], PDO::PARAM_INT);
			$zapytanie->bindValue(':pozycjaX', $pozycjaX, PDO::PARAM_INT);
			$zapytanie->bindValue(':rozmiarX', $rozmiarX, PDO::PARAM_INT);
			$zapytanie->bindValue(':pozycjaY', $pozycjaY, PDO::PARAM_INT);
			$zapytanie->bindValue(':rozmiarY', $rozmiarY, PDO::PARAM_INT);
			//===== Losowy kolor =====//
			$zapytanie->bindValue(':kolor', strtoupper(str_pad(dechex(mt_rand( 0, 16777215)), 6, '0', STR_PAD_LEFT)), PDO::PARAM_STR);

			if($zapytanie->execute())
			{
				$calyRezultat["pozostaleKafelki"] = $kafelkiPozostale;
				$calyRezultat["zapytanieSQL"] = "SELECT * FROM panele WHERE pozycjaX <= $rozmiarX + $pozycjaX AND $pozycjaX <= pozycjaX + rozmiarX AND pozycjaY <= $rozmiarY + $pozycjaY AND $pozycjaY <= pozycjaY + rozmiarY";
				$calyRezultat["blad"] = 0;
			}
			else
			{
				$calyRezultat["blad"] = 152;
			}
		}
		else
		{
			$calyRezultat["blad"] = 153;
		}
	}
	else
	{
		$calyRezultat["mysql"] = $zapytanie;
		$calyRezultat["mysqlO"] = $zapytanie->fetchAll();
		$calyRezultat["blad"] = 201;
	}
}
else
{
	$calyRezultat["blad"] = 200;
}
//===== Zwrócenie odpowiedzi =====//
echo json_encode($calyRezultat);