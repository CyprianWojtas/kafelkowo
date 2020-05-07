const KAFELKI_ROZMIAR = 100,
	  KAFELKI_ODSTEP = 5;
var idZalogowany = 0;

var startX = 0,
	startY = 0;

var pozycjaX = Math.floor(document.body.clientWidth / 2),
	pozycjaY = Math.floor(document.body.clientHeight / 2);
	
$(".pola").css("transform", "translate(" + pozycjaX + "px," + pozycjaY + "px)");

var przesuwanie = false;
var edytowanie = false;
var edytowanieKafelek = false;
var dostepneKafelki = 0;
var zajetePola = new Array();
//===== BB Code na HTML =====//
function BBCodeNaHTML (tekst)
{
	if (tekst == null)
		return(null);

	doZamiany =
	[
	    / /ig,
	    /</ig,
	    />/ig,
	    /\[b\]([\s\S]*?)\[\/b\]/ig,
	    /\[i\]([\s\S]*?)\[\/i\]/ig,
	    /\[u\]([\s\S]*?)\[\/u\]/ig,
	    /\[s\]([\s\S]*?)\[\/s\]/ig,
	    /\[center\]([\s\S]*?)\[\/center\]\n/ig,
	    /\[center\]([\s\S]*?)\[\/center\]/ig,
	    /\[color\]([\s\S]*?)\[\/color\]/ig,
	    /\[color=([a-zA-Z0-9#,\.\(\) ]*?)\]([\s\S]*?)\[\/color\]/ig,
	    /\[size\]([\s\S]*?)\[\/size\]/ig,
	    /\[size=([0-9]*?)\]([\s\S]*?)\[\/size\]/ig,
	    /\[img\](.*?)\[\/img\]/ig,
	    /\[img=([^"'\n]*?)\]/ig,
	    /\[bimg\](.*?)\[\/bimg\]/ig,
	    /\[bimg=([^"'\n]*?)\]/ig,
	    /\[url\]([^"'\n]*?)\[\/url\]/ig,
	    /\[url=([^"'\n]*?)\]([\s\S]*?)\[\/url\]/ig,
	    /\n/ig
	];

	zamienione =
	[
	    '&thinsp;',
	    '&lt;',
	    '&gt;',
	    '<strong>$1</strong>',
	    '<em>$1</em>',
	    '<span style="text-decoration: underline">$1</span>',
	    '<span style="text-decoration: line-through">$1</span>',
	    '<center>$1</center>',
	    '<center>$1</center>',
	    '<span style="color: black">$1</span>',
	    '<span style="color: $1">$2</span>',
	    '<span style="font-size: initial">$1</span>',
	    '<span style="font-size: $1px">$2</span>',
	    '<span title="$1" style="display: inline-block"><img src="$1" alt="" style="max-width: 100%; max-height: 100%"></span>',
	    '<span title="$1" style="display: inline-block"><img src="$1" alt="" style="max-width: 100%; max-height: 100%"></span>',
	    '<div style="z-index: -1; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: contain; background-position: center; background-repeat: no-repeat; background-image: url(\'$1\')"></div>',
	    '<div style="z-index: -1; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: contain; background-position: center; background-repeat: no-repeat; background-image: url(\'$1\')"></div>',
	    '<a href="$1" target="_blank" title="$1">$1</a>',
	    '<a href="$1" target="_blank" title="$1">$2</a>',
	    '<br>'
	];

	for (var i = 0; i < doZamiany.length; i++)
	{
	  tekst = tekst.replace(doZamiany[i], zamienione[i]);
	}
	return(tekst);
}

//===== Wczytywanie informacji =====//
$.getJSON("/php/dane.php", function(json)
{
	if (json["blad"] == 0)
	{
		dostepneKafelki = json["dostepneKafelki"];
		idZalogowany = json["uzytkownikId"];
		$(".nazwaUzytkownika").html(json["uzytkownikNazwa"]);
		$(".dostepneKafelki").html(dostepneKafelki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
	}
	else if (json["blad"] != 1)
	{
		Blad(json["blad"]);
	}
	Wczytaj();
});

//===== Blokada domyślnego przeciągania =====//
$('img').on('dragstart', function(e) { e.preventDefault(); });

var przesuwanieA = false;

$(document).bind("dragstart", function(e)
{
	if (e.target.nodeName.toLowerCase() == "a")
	{
		przesuwanieA = true;
		e.preventDefault();
	}
});

$(document).on('click', 'a', function(e)
{
	if (przesuwanieA)
	{
		e.preventDefault();
		przesuwanieA = false;
	}
});

//===== Wczytywanie płytek =====//
function Wczytaj()
{

	$(".tlo").css("top", Math.floor((-pozycjaY - $(window).height()) / KAFELKI_ROZMIAR) * KAFELKI_ROZMIAR + "px");
	$(".tlo").css("left", Math.floor((-pozycjaX - $(window).width()) / KAFELKI_ROZMIAR) * KAFELKI_ROZMIAR + "px");

	$.getJSON
	(
		"/wczytaj-plytke.php?x=" + (Math.floor(- pozycjaX / KAFELKI_ROZMIAR) - 5) +
		"&y=" + (Math.floor(- pozycjaY / KAFELKI_ROZMIAR) - 5) +
		"&rx=" + (Math.ceil($(window).width() / KAFELKI_ROZMIAR) + 5) +
		"&ry=" + (Math.ceil($(window).height() / KAFELKI_ROZMIAR) + 5),
	function(json, status)
	{
		if (status != "success")
		{
			Powiadomienie("Błąd połączenia.", 2);
		}
		else
		{
			if (json["blad"] != 0)
			{
				Blad(json["blad"]);
			}
			else
			{
				var paneleHTML = "";
				zajetePola = new Array();

				json = json["plytki"];
				
				for(i = 0; i < json.length; i++)
				{
					if (json[i]["wlasnaPlytka"])
						paneleHTML = paneleHTML + "<div class='pole poleWlasne' style='width: calc(" + (json[i]["rozmiarX"] * KAFELKI_ROZMIAR) + "px - " + (KAFELKI_ODSTEP * 2) + "px); height: calc(" + (json[i]["rozmiarY"] * KAFELKI_ROZMIAR) + "px - " + (KAFELKI_ODSTEP * 2) + "px); top: calc(" + (json[i]["pozycjaY"] * KAFELKI_ROZMIAR) + "px + " + KAFELKI_ODSTEP + "px); left: calc(" + (json[i]["pozycjaX"] * KAFELKI_ROZMIAR) + "px + " + KAFELKI_ODSTEP + "px); background: #" + json[i]["kolor"] + ";'>" + BBCodeNaHTML(json[i]["zawartosc"]) + "<div class='wlasciciel'>" + json[i]["wlasciciel"] + "</div><div class='edytuj' onClick='Edytuj(" + json[i]["id"] + ")'><i class='icon-pencil-squared'></i></div></div>";
					else
						paneleHTML = paneleHTML + "<div class='pole' style='width: calc(" + (json[i]["rozmiarX"] * KAFELKI_ROZMIAR) + "px - " + (KAFELKI_ODSTEP * 2) + "px); height: calc(" + (json[i]["rozmiarY"] * KAFELKI_ROZMIAR) + "px - " + (KAFELKI_ODSTEP * 2) + "px); top: calc(" + (json[i]["pozycjaY"] * KAFELKI_ROZMIAR) + "px + " + KAFELKI_ODSTEP + "px); left: calc(" + (json[i]["pozycjaX"] * KAFELKI_ROZMIAR) + "px + " + KAFELKI_ODSTEP + "px); background: #" + json[i]["kolor"] + ";'>" + BBCodeNaHTML(json[i]["zawartosc"]) + "<div class='wlasciciel'>" + json[i]["wlasciciel"] + "</div></div>";

					for(var x = 0; x < json[i]["rozmiarX"]; x++)
					{
						for(var y = 0; y < json[i]["rozmiarY"]; y++)
						{
							zajetePola[(x + parseInt(json[i]["pozycjaX"])) + ":" + (y + parseInt(json[i]["pozycjaY"]))] = true;
							
						}
					}
				}
				$(".pola .zawartosc").html(paneleHTML);
			}
		}
	});
}
//===== Przełączanie w tryb dodawania =====//
$(".wstaw").click(function(przycisk)
{
	if (edytowanie)
	{
		$(".tlo").css("opacity", "0");
		$("#zaznaczenie").css("visibility", "hidden");
		$(".dostepneKafelki").html(dostepneKafelki);
		edytowanie = false;
	}
	else
	{
		$(".tlo").css("opacity", "1");
		$("#zaznaczenie").css("visibility", "visible");
		edytowanie = true;
	}
	
});
var trwaZaznaczanie = false;
var zaznaczenieStartX, zaznaczenieStartY;
var zaznaczenieKoniecX, zaznaczenieKoniecY;

//===== Działanie myszki =====//
var trwaPrzesuwanie = false;
$(document).mousedown(function(e)
{
	if ($(e.target).parents('.pola').length > 0)
	{
		if (edytowanie)
		{
			if (e.target != $("#zaznaczenie .akceptuj")[0])
			{
				trwaZaznaczanie = true;
				zaznaczenieStartX = Math.floor((e.pageX - pozycjaX) / KAFELKI_ROZMIAR);
				zaznaczenieStartY = Math.floor((e.pageY - pozycjaY) / KAFELKI_ROZMIAR);
				
				zaznaczenieKoniecX = zaznaczenieStartX;
				zaznaczenieKoniecY = zaznaczenieStartY;
				
				$(".zaznaczenieAkceptuj").css("opacity", 0);
				
				OdswierzZaznaczenie(e);
			}
		}
		else
		{
			startX = e.pageX;
			startY = e.pageY;
			przesuwanie = true;
		}
		trwaPrzesuwanie = true;
	}
});

$(document).mouseup(function(e)
{
	if (trwaPrzesuwanie)
	{
		if (edytowanie)
		{
			if (e.target != $("#zaznaczenie .akceptuj")[0])
			{
				trwaZaznaczanie = false;
				zaznaczenieKoniecX = Math.floor((e.pageX - pozycjaX) / KAFELKI_ROZMIAR);
				zaznaczenieKoniecY = Math.floor((e.pageY - pozycjaY) / KAFELKI_ROZMIAR);
				
				OdswierzZaznaczenie(e);
				
				$(".zaznaczenieAkceptuj").css("opacity", 1);
				
				if ($("#zaznaczenie").hasClass("bladZaznaczenia"))
				{
					$("#zaznaczenie").css("width", 0);
					$("#zaznaczenie").css("height", 0);
					$("#zaznaczenie").css("top", 0);
					$("#zaznaczenie").css("left", 0);
				}
			}
		}
		else
		{
			pozycjaX -= startX - e.pageX;
			pozycjaY -= startY - e.pageY;
			przesuwanie = false;
			Wczytaj();
		}
		trwaPrzesuwanie = false;
	}
});
$(document).mousemove(function(e)
{
	if (trwaPrzesuwanie)
	{
		if (edytowanie && trwaZaznaczanie)
		{
			$(".informacje").html("X: " + Math.floor((e.pageX - pozycjaX) / KAFELKI_ROZMIAR) + ", Y: " + Math.floor(-(e.pageY - pozycjaY) / KAFELKI_ROZMIAR));
			
			zaznaczenieKoniecX = Math.floor((e.pageX - pozycjaX) / KAFELKI_ROZMIAR);
			zaznaczenieKoniecY = Math.floor((e.pageY - pozycjaY) / KAFELKI_ROZMIAR);
			OdswierzZaznaczenie(e);
		}
		else if (przesuwanie)
		{
			$(".pola").css("transform", "translate(" + (pozycjaX + e.pageX - startX) + "px," + (pozycjaY + e.pageY - startY) + "px)");
		}
	}
	if (!przesuwanie)
	{
		//Koordynaty rzeczywiste
		//$(".informacje").html("X: " + Math.floor((e.pageX - pozycjaX) / 100) + ", Y: " + Math.floor((e.pageY - pozycjaY) / 100));
		//Koordynaty kartezjańskie
		$(".informacje").html("X: " + Math.floor((e.pageX - pozycjaX) / KAFELKI_ROZMIAR) + ", Y: " + Math.floor(-(e.pageY - pozycjaY) / KAFELKI_ROZMIAR));
	}
});
//===== Odświerzanie Zaznaczenia =====//
var pozycjaZaznaczeniaX = 0;
var pozycjaZaznaczeniaY = 0;
var rozmiarZaznaczenieX = 0;
var rozmiarZaznaczenieY = 0;

function OdswierzZaznaczenie(e)
{
	if (zaznaczenieStartX < zaznaczenieKoniecX) pozycjaZaznaczeniaX = zaznaczenieStartX;
	else										pozycjaZaznaczeniaX = zaznaczenieKoniecX;
	
	if (zaznaczenieStartY < zaznaczenieKoniecY) pozycjaZaznaczeniaY = zaznaczenieStartY;
	else										pozycjaZaznaczeniaY = zaznaczenieKoniecY;
	
	rozmiarZaznaczenieX = Math.abs(zaznaczenieStartX - zaznaczenieKoniecX) + 1;
	rozmiarZaznaczenieY = Math.abs(zaznaczenieStartY - zaznaczenieKoniecY) + 1;
	
	
	
	$("#zaznaczenie").css("left", pozycjaZaznaczeniaX * KAFELKI_ROZMIAR + 5);
	$("#zaznaczenie").css("top", pozycjaZaznaczeniaY * KAFELKI_ROZMIAR + 5);
	$("#zaznaczenie").css("width", rozmiarZaznaczenieX * KAFELKI_ROZMIAR - 10);
	$("#zaznaczenie").css("height", rozmiarZaznaczenieY * KAFELKI_ROZMIAR - 10);
	
	$(".srodekZaznaczenie").html(rozmiarZaznaczenieX + " x " + rozmiarZaznaczenieY + "<br>" + (rozmiarZaznaczenieX * rozmiarZaznaczenieY));
	$(".srodekZaznaczenie").css("margin-top", Math.abs(zaznaczenieStartY - zaznaczenieKoniecY) * (KAFELKI_ROZMIAR / 2) + 14);
	
	var bladZaznaczenia = false;
	
	for (x = pozycjaZaznaczeniaX; x < pozycjaZaznaczeniaX + rozmiarZaznaczenieX; x++)
	{
		for (y = pozycjaZaznaczeniaY; y < pozycjaZaznaczeniaY + rozmiarZaznaczenieY; y++)
		{
			if (zajetePola[x + ":" + y])
				bladZaznaczenia = true;
		}
	}
	
	if (dostepneKafelki < rozmiarZaznaczenieX * rozmiarZaznaczenieY) bladZaznaczenia = true;
	
	if (bladZaznaczenia)	$("#zaznaczenie").addClass("bladZaznaczenia");
	else					$("#zaznaczenie").removeClass("bladZaznaczenia");
}
//===== Dodawanie pola =====//
$("#zaznaczenie .akceptuj").click(function (e)
{
	//console.log ("/wstaw.php?x=" + pozycjaZaznaczeniaX + "&y=" + pozycjaZaznaczeniaY + "&rx=" + rozmiarZaznaczenieX + "&ry=" + rozmiarZaznaczenieY);
	$.getJSON
	(
		"/wstaw.php?x=" + pozycjaZaznaczeniaX +
		"&y=" + pozycjaZaznaczeniaY +
		"&rx=" + rozmiarZaznaczenieX +
		"&ry=" + rozmiarZaznaczenieY,
	function(json, status)
	{
		if (status != "success")
		{
			Powiadomienie("Błąd połączenia.", 2);
		}
		else
		{
			Wczytaj();
			if (json["blad"] == 0)
			{
				$(".tlo").css("opacity", "0");
				$("#zaznaczenie").css("visibility", "hidden");
				dostepneKafelki = json["pozostaleKafelki"];
				$(".dostepneKafelki").html(dostepneKafelki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
				edytowanie = false;
			}
			else
			{
				Blad(json["blad"]);

				$(".tlo").css("opacity", "0");
				$("#zaznaczenie").css("visibility", "hidden");
				edytowanie = false;
			}
		}
	});
});
$("#zaznaczenie .anuluj").click(function (e)
{
	$(".tlo").css("opacity", "0");
	$("#zaznaczenie").css("visibility", "hidden");
	edytowanie = false;
});
//===== Powiadomienia =====//
function Powiadomienie(zawartosc, typ)
{
	switch (typ)
	{
		case 0:
			var powiadomienie = $('<div class="powiadomienie"><div>Powiadomienie</div><span>' + zawartosc + "</span></div>");
			break;
		case 1:
			var powiadomienie = $('<div class="uwaga"><div>Ostrzeżenie</div><span>' + zawartosc + "</span></div>");
			break;
		case 2:
			var powiadomienie = $('<div class="blad"><div>Błąd</div><span>' + zawartosc + "</span></div>");
			break;
		default:
			var powiadomienie = $('<div class="powiadomienie"><div>Powiadomienie</div><span>' + zawartosc + "</span></div>");
			break;
	}
	//$(".powiadomienia").append(powiadomienie);
	$(".powiadomienia").append($(powiadomienie).hide().fadeIn());

	setTimeout(function(){ powiadomienie.fadeOut(); }, 10000);
}
function Blad(kod)
{
	if (KOD_BLEDU[kod] == null)
		Powiadomienie("Nieznany błąd. Kod błedu: " + kod, 2);
	else
		Powiadomienie(KOD_BLEDU[kod], 2);
}
//===== Edytowanie pól =====//
function Edytuj(id)
{
	edytowanieKafelek = true;
	$(".menuEdycji").fadeIn();
	$(".formulazId").val(id);

	$.getJSON("/plytka.php?id=" + id, function(json, status)
	{
		//console.log(json);
		$(".kafelek").html("<div class='pole poleEdytowane' style='width: calc(" + (json["rozmiarX"] * KAFELKI_ROZMIAR) + "px - " + (KAFELKI_ODSTEP * 2) + "px); height: calc(" + (json["rozmiarY"] * KAFELKI_ROZMIAR) + "px - " + (KAFELKI_ODSTEP * 2) + "px); background: #" + json["kolor"] + ";'><div class='zawartosc'>" + BBCodeNaHTML(json["zawartosc"]) + "</div><div class='wlasciciel'>" + json["wlasciciel"] + "</div></div>");
		$(".kafelekBBZawartosc textarea").val(json["zawartosc"]);
		$(".kafelekObrazZawartosc input").val("");
		$(".kafelekTekstRozmiar").val("16");
		$(".kafelekTekstKolor").val("#000000");
		$(".kafelekTekstZawartosc textarea").val("");
		$(".kolor").val("#" + json["kolor"]);
	});
}
$(".menuEdycji .zamknij").click(function()
{
	edytowanieKafelek = false;
	$(".menuEdycji").fadeOut();
});
//===== Pole edycji =====//
$('.menuEdycji .kolor').bind('input propertychange', function(e)
{
	$(".poleEdytowane").css("background", e.target.value);
});
//===== Obraz =====//
$('.menuEdycji .kafelekObraz').click(function(e)
{
	$(".kafelekBBZawartosc").fadeOut();
	$(".kafelekTekstZawartosc").fadeOut();
	$(".kafelekObrazZawartosc").fadeIn();
});
$('.kafelekObrazZawartosc input').bind('input propertychange', function(e)
{
	let tekstBB = "[bimg=" + e.target.value + "]";

	$(".poleEdytowane .zawartosc").html(BBCodeNaHTML(tekstBB));
	$('.kafelekBBZawartosc textarea').val(tekstBB);
});

//===== Tekst =====//
$('.menuEdycji .kafelekTekst').click(function(e)
{
	$(".kafelekBBZawartosc").fadeOut();
	$(".kafelekTekstZawartosc").fadeIn();
	$(".kafelekObrazZawartosc").fadeOut();
});

$('.kafelekTekstKolor').bind('input propertychange', function() { kafelekTekstEdytuj(); });
$('.kafelekTekstRozmiar').bind('input propertychange', function() { kafelekTekstEdytuj(); });
$('.kafelekTekstZawartosc textarea').bind('input propertychange', function() { kafelekTekstEdytuj(); });

function kafelekTekstEdytuj()
{
	let kolor = $(".kafelekTekstKolor").val();
	let rozmiar = $(".kafelekTekstRozmiar").val();
	let tekst = $(".kafelekTekstZawartosc textarea").val();

	tekst = tekst.replace(/\[/ig, '&lsqb;');
	tekst = tekst.replace(/\]/ig, '&rsqb;');


	let tekstBB = "[center][color=" + kolor + "][size=" + rozmiar + "]" + tekst + "[/size][/color][/center]";

	$(".poleEdytowane .zawartosc").html(BBCodeNaHTML(tekstBB));
	$('.kafelekBBZawartosc textarea').val(tekstBB);
}

//===== BB Kod =====//
$('.menuEdycji .kafelekBB').click(function(e)
{
	$(".kafelekBBZawartosc").fadeIn();
	$(".kafelekTekstZawartosc").fadeOut();
	$(".kafelekObrazZawartosc").fadeOut();
});

$('.kafelekBBZawartosc textarea').bind('input propertychange', function(e)
{
	
	$(".poleEdytowane .zawartosc").html(BBCodeNaHTML(e.target.value));
});
//===== Koniec edycji =====//
$(".menuEdycji .gotowe").click(function()
{

	let formulaz = $("#formulazEdytuj").serialize();
	$(".menuEdycji").fadeOut();

	$.post("/edytuj.php", formulaz, function(json, status)
	{
		if (status != "success")
		{
			$(".menuEdycji").fadeIn();
			Powiadomienie("Błąd połączenia.", 2);
		}
		else
		{
			if (json["blad"] != 0)
			{
				Blad(json["blad"]);
			}
			else
			{
				edytowanieKafelek = false;
				Wczytaj();
			}
		}

	}, "json");
});
//===== Usuwanie kafelka =====//
$(".usunKafelek").click(function()
{
	edytowanieKafelek = false;
	$(".menuEdycji").fadeOut();

	let formulaz = $("#formulazUsun").serialize();

	$.post("/usun.php", formulaz, function(json, status)
	{
		if (status != "success")
		{
			$(".menuEdycji").fadeIn();
			Powiadomienie("Błąd połączenia.", 2);
		}
		else
		{
			if (json["blad"] != 0)
			{
				Blad(json["blad"]);
				$(".menuEdycji").fadeIn();
			}
			else
			{
				edytowanieKafelek = false;
				Wczytaj();
			}
		}

	}, "json");
});
//===== Skala podglądu =====//
$('.skalaPodgladu input').bind('input propertychange', function(e)
{
	console.log(e.target.value);
	$(".kafelekWysrodkowanie .kafelek").css("transform", "scale("+ (e.target.value / 100) +")");
	$(".skalaPodgladu span").html(e.target.value + "%");
});