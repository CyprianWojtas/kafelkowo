<?php

$mysqlDaneLogowania =
[
	'host' => 'localhost', 
	'login' => 'root',
	'haslo' => '',
	'bazadanych' => 'kafelkowo'
];

try
{
	@$mysql = new PDO("mysql:host={$mysqlDaneLogowania['host']};dbname={$mysqlDaneLogowania['bazadanych']};charset=utf8",
		$mysqlDaneLogowania['login'],
		$mysqlDaneLogowania['haslo'],
		[
			PDO::ATTR_EMULATE_PREPARES => false, 
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		]);	
}
catch (PDOException $error)
{
	$calyRezultat["blad"] = 150;
	echo json_encode($calyRezultat);
	exit();
}
unset($mysqlDaneLogowania);