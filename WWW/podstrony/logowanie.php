<?php
session_start();

if (!isset($_SESSION["uzytkownikId"]))
	$_SESSION["uzytkownikId"] = 0;
if ($_SESSION["uzytkownikId"] != 0)
	header("Location: /");

?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="/css/podstawowy.css">
		<link rel="stylesheet" href="/css/logowanie.css">
		<link rel="stylesheet" href="/fontello/css/fontello.css">
		<title>Kafelkowo | Logowanie</title>
		<script src="/js/jquery-3.3.1.min.js"></script>
		<script src="/js/kody-bledow.js"></script>
		<script src="/js/logowanie.js"></script>
		<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
	</head>
	<body>
		<div class="pola">
			<div class="logowanie">
				<h1>Zaloguj</h1>
				<form action="/php/zaloguj.php" method="POST" id="logowanie">
					Login: <input type="text" name="login"><br>
					Hasło: <input type="password" name="haslo"><br>
					<div class="zalogujGuzik" onClick="Zaloguj()">Zaloguj się</div>
				</form>
			</div>
			<span>lub</span>
			<div class="rejestracja">
				<h1>Zarejestruj się</h1>
				<form action="/php/zarejestruj.php" method="POST" id="rejestracja">
					Login: <input type="text" name="login"><br>
					E-mail: <input type="text" name="email"><br>
					Hasło: <input type="password" name="haslo"><br>
					Powtórz Hasło: <input type="password" name="haslo2"><br>
					<div class="zarejestrujGuzik" onClick="Zarejestruj()">Zarejestruj się</div>
				</form>
			</div>
		</div>
		<div class="powiadomienia"></div>
	</body>
</html>