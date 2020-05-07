<?php
if (!isset($_GET["id"])) exit();

include("mysql.php");

$zapytanie = $mysql->prepare("SELECT panele.id AS id, panele.rozmiarX AS rozmiarX, panele.rozmiarY AS rozmiarY, panele.kolor AS kolor, panele.zawartosc AS zawartosc, uzytkownicy.login AS wlasciciel, panele.idWlasciciela AS idWlasciciela FROM panele INNER JOIN uzytkownicy WHERE panele.idWlasciciela = uzytkownicy.id AND panele.id = :id");
$zapytanie->bindValue(':id', $_GET["id"], PDO::PARAM_INT);
$zapytanie->execute();

$calyRezultat = Array();
while ($rezultat = $zapytanie->fetch(PDO::FETCH_ASSOC))
{
	$calyRezultat = $rezultat;
}
echo json_encode($calyRezultat);