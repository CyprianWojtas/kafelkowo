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

if ($_SESSION["uzytkownikId"] == 0)
{
	if (isset($_POST['login']))
	{
		require_once '../mysql.php';

		$login = filter_input(INPUT_POST, 'login');
		$password = filter_input(INPUT_POST, 'haslo');
		
		$zapytanie = $mysql->prepare('SELECT id, haslo FROM uzytkownicy WHERE login = :login');
		$zapytanie->bindValue(':login', $login, PDO::PARAM_STR);
		$zapytanie->execute();
		
		$uzytkownik = $zapytanie->fetch();
		
		if ($uzytkownik && password_verify($password, $uzytkownik['haslo']))
		{
			$_SESSION['uzytkownikId'] = $uzytkownik['id'];

		}
		else
		{
			Blad(3);
		}
			
	}
	else
	{
		Blad(100);
	}
}
else
{
	Blad(2);
}

echo json_encode($calyRezultat);