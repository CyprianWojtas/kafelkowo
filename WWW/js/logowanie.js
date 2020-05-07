function Zaloguj()
{
	let formulaz = $("#logowanie").serialize();

	$.post("/php/zaloguj.php", formulaz, function(json, status)
	{
		if (status != "success")
		{
			$(".menuEdycji").fadeIn();
			Powiadomienie("Błąd połączenia.", 2);
		}
		else
		{
			console.log(json);
			if (json["blad"] == 0)
			{
				window.location.href = '/';
			}
			else
			{
				Blad(json["blad"]);
			}
		}

	}, "json");
}
function Zarejestruj()
{
	let formulaz = $("#rejestracja").serialize();

	$.post("/php/zarejestruj.php", formulaz, function(json, status)
	{
		if (status != "success")
		{
			$(".menuEdycji").fadeIn();
			Powiadomienie("Błąd połączenia.", 2);
		}
		else
		{
			if (json["blad"] == 0)
			{
				window.location.href = '/';
			}
			else
			{
				Blad(json["blad"]);
			}
		}

	}, "json");
}

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