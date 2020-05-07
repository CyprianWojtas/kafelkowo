<?php
$calyRezultat = Array();
$calyRezultat["blad"] = 0;

if (!isset($_GET["x"]) || !isset($_GET["y"]) || !isset($_GET["rx"]) || !isset($_GET["ry"])) exit();

session_start();
if (!isset($_SESSION["uzytkownikId"])) $_SESSION["uzytkownikId"] = 0;

$pozycjaX = $_GET["x"];
$pozycjaY = $_GET["y"];

if ($_GET["rx"] <= 30)
	$rozmiarX = $_GET["rx"] + $pozycjaX;
else
	$rozmiarX = 30 + $pozycjaX;
	
if ($_GET["ry"] <= 30)
	$rozmiarY = $_GET["ry"] + $pozycjaY;
else
	$rozmiarY = 30 + $pozycjaY;

include("mysql.php");

$zapytanie = $mysql->prepare("SELECT panele.id AS id, panele.pozycjaX AS pozycjaX, panele.pozycjaY AS pozycjaY, panele.rozmiarX AS rozmiarX, panele.rozmiarY AS rozmiarY, panele.kolor AS kolor, panele.zawartosc AS zawartosc, uzytkownicy.login AS wlasciciel, panele.idWlasciciela AS idWlasciciela FROM panele INNER JOIN uzytkownicy WHERE panele.idWlasciciela = uzytkownicy.id AND panele.pozycjaX <= :rozmiarX AND (panele.pozycjaX + panele.rozmiarX - 1) >= :pozycjaX AND panele.pozycjaY <= :rozmiarY AND (panele.pozycjaY + panele.rozmiarY - 1) >= :pozycjaY AND data > now() - INTERVAL 7 DAY");
$zapytanie->bindValue(':pozycjaX', $pozycjaX, PDO::PARAM_INT);
$zapytanie->bindValue(':rozmiarX', $rozmiarX, PDO::PARAM_INT);
$zapytanie->bindValue(':pozycjaY', $pozycjaY, PDO::PARAM_INT);
$zapytanie->bindValue(':rozmiarY', $rozmiarY, PDO::PARAM_INT);
$zapytanie->execute();

$calyRezultat["plytki"] = Array();
while ($rezultat = $zapytanie->fetch(PDO::FETCH_ASSOC))
{
	if ($rezultat["idWlasciciela"] == $_SESSION["uzytkownikId"])
		$rezultat["wlasnaPlytka"] = true;
	else
		$rezultat["wlasnaPlytka"] = false;

	unset($rezultat["idWlasciciela"]);

	array_push($calyRezultat["plytki"], $rezultat);
}
echo json_encode($calyRezultat);