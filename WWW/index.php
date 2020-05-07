<?php
session_start();

if (!isset($_SESSION["uzytkownikId"]))
	$_SESSION["uzytkownikId"] = 0;

?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="/css/podstawowy.css">
		<link rel="stylesheet" href="/fontello/css/fontello.css">
		<title>Kafelkowo</title>
		<script src="/js/jquery-3.3.1.min.js"></script>
		<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
	</head>
	<body>
		<div class="pola">
			<div class="tlo"></div>
			<div class="zawartosc"></div>
			
			<div id="zaznaczenie">
				<div class="zaznaczenieAkceptuj">
					<div class="akceptuj">✓</div>
					<div class="anuluj">✗</div>
				</div>
				<div class="srodekZaznaczenie">
					0 x 0<br>
					0
				</div>
			</div>
		</div>
		<div class="informacje"></div>
		<div class="menu">
			<h1>Kafelkowo</h1>
			<div class="menuPrawo">
				<?php 
				if ($_SESSION["uzytkownikId"] != 0)
					echo '<div class="wstaw"><span class="wstaw-napis">Wstaw nowy</span> <i class="icon-pencil-squared"></i></div>
				<div class="uzytkownik">
					<div>
						<span class="nazwaUzytkownika"></span><br>
						Dostępne Kafelki: <span class="dostepneKafelki">0</span>
					</div>
					<div class="wysuwanaLista">
						<a href="/wyloguj/">Wyloguj się</a>
					</div>
				</div>';
				else
				echo '<div>
						<a class="zaloguj" href="/zaloguj/">Zaloguj/Zarejestruj</a>
				</div>'; ?>
			</div>
		</div>
		<div class="menuEdycji">
			<div class="panelPrawo">
				<div class="zamknij">X</div>
				<form id="formulazEdytuj">
					<h2>Kolor kafelka</h2>
					<input type="color" name="kolor" class="kolor">
					<input type="hidden" name="id" class="formulazId">
					<h2>Typ zawartości</h2>
					<div class="kafelekObraz">Obraz</div>
					<div class="kafelekObrazZawartosc">
						Link: <input type="text">
					</div>
					<div class="kafelekTekst">Tekst</div>
					<div class="kafelekTekstZawartosc">
						<textarea name="zawartosc" form="formulazEdytuj"></textarea>
						Kolor: <input type="color" class="kafelekTekstKolor">
						Rozmiar czcionki: <input type="number" class="kafelekTekstRozmiar" value="16">px
					</div>
					<div class="kafelekBB">BB Code</div>
					<div class="kafelekBBZawartosc">
						<textarea name="zawartosc" form="formulazEdytuj"></textarea>
						<a href="/bb-code/" target="_blank">Składnia BB Code</a>
					</div>
				</form>
				<div class="gotowe">Gotowe</div>
				<form id="formulazUsun">
					<div class="usunKafelek">Usuń kafelek</div>
					<input type="hidden" name="id" class="formulazId">
				</form>
				<div class="skalaPodgladu">
					Skala podglądu: <input type="range" min="0" max="200" value="100"><span>100%</span>
				</div>
			</div>
			<div class="kafelekWysrodkowanie"><div class="kafelek"></div></div>
		</div>
		<div class="powiadomienia"></div>
		<script src="/js/kody-bledow.js"></script>
		<script src="/js/podstawowy.js"></script>
	</body>
</html>