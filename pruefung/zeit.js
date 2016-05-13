function ZeitErrechnen() // var MinutenFaktor
{
	// Diese Funktion berechnet eine Prüfungszeit anhand der Anzahl der gewählten 
	// Fragen
	// Funktion wird nur ausgeführt, wenn diese aktion vom benutzer bestätigt
	// wurde
	// In Zukunft soll die Funktion skalierbar per init-Wert sein
	var MinutenFaktor = 1.5;
	var AnzahlFragen = 0;
	
	if (document.getElementById("AutoZeit").checked == true)
	{
		//alert("Nochmal Hallo ");
		// Anzahl der gewählten Fragen erfassen
		AnzahlFragen = Number(document.getElementById("EingabeAnzahl").value);
		// Gerundete Minuten
		var Gesamtminuten = Math.round(AnzahlFragen * MinutenFaktor);
		// Errechnen der Zeiteinheiten
		if (Gesamtminuten >=60)
		{
			var StrStunden = String(Gesamtminuten / 60);
			Stunden = StrStunden.substr(0,1);
			Stunden = Number(Stunden);
			var Minuten = Gesamtminuten % 60;
		}
		else
		{
			var Stunden = 0;
			var Minuten = Gesamtminuten;
		}
		var Sekunden = 0; // (Minuten*60) % 60;
		// alert(Stunden + ":" + Minuten + ":" + Sekunden);
		// und eintragen
		document.getElementById("EingabeStunde").value = Stunden;
		document.getElementById("EingabeMinute").value = Minuten;
		document.getElementById("EingabeSekunde").value = Sekunden;
	}	
}
// Ziel-Datum in MEZ
function initializeCountdown(Stunde, Minute, Sekunde)
{ 
	BasisDatum = new Date();
	zielDatum=new Date(BasisDatum.getYear()+1900,BasisDatum.getMonth(),BasisDatum.getDate(),BasisDatum.getHours()+Stunde,BasisDatum.getMinutes()+Minute, BasisDatum.getMinutes() + Sekunde);
	countdown();
}

function countdown() {
        startDatum=new Date(); // Aktuelles Datum

        // Countdown berechnen und anzeigen, bis Ziel-Datum erreicht ist
        if(startDatum<zielDatum)  {
	
		var jahre=0, monate=0, tage=0;
		stunden=0; 
		minuten=0; 
		sekunden=0;
	
		// Jahre
		while(startDatum<zielDatum) {
		jahre++;
		startDatum.setFullYear(startDatum.getFullYear()+1);
		}
		startDatum.setFullYear(startDatum.getFullYear()-1);
		jahre--;
	
		// Monate
		while(startDatum<zielDatum) {
		monate++;
		startDatum.setMonth(startDatum.getMonth()+1);
		}
		startDatum.setMonth(startDatum.getMonth()-1);
		monate--;
	
		// Tage
		while(startDatum.getTime()+(24*60*60*1000)<zielDatum) {
		tage++;
		startDatum.setTime(startDatum.getTime()+(24*60*60*1000));
		}
	
		// Stunden
		stunden=Math.floor((zielDatum-startDatum)/(60*60*1000));
		startDatum.setTime(startDatum.getTime()+stunden*60*60*1000);
	
		// Minuten
		minuten=Math.floor((zielDatum-startDatum)/(60*1000));
		startDatum.setTime(startDatum.getTime()+minuten*60*1000);
	
		// Sekunden
		sekunden=Math.floor((zielDatum-startDatum)/1000);
	
		// Anzeige formatieren
		(jahre!=1)?jahre=jahre+"":jahre=jahre+"";
		(monate!=1)?monate=monate+"":monate=monate+"";
		(tage!=1)?tage=tage+"":tage=tage+"";
		if(stunden<10) stunden="0"+stunden;
		(stunden!=1)?stunden=stunden+"":stunden=stunden+"";
		if(minuten<10) minuten="0"+minuten;
		(minuten!=1)?minuten=minuten+"":minuten=minuten+"";
		if(sekunden<10) sekunden="0"+sekunden;
		(sekunden!=1)?sekunden=sekunden+"":sekunden=sekunden+"";
		if (PruefungBeendet == "ja")
		{
			document.getElementById("Zeitanzeige_ka").firstChild.nodeValue =
			"Prüfung ist beendet";
			document.getElementById("Pauseknopf").style.visibility = "hidden";
			document.getElementById("Pauseknopf_ka").style.visibility = "hidden";

		}
		else
		{
		document.getElementById("Zeitanzeige").firstChild.nodeValue =
		"Verbleibende Zeit: " + stunden+":"+minuten+":"+sekunden+" ";
		document.getElementById("Zeitanzeige_ka").firstChild.nodeValue =
		"Verbleibende Zeit: " + stunden+":"+minuten+":"+sekunden+" ";
		}
		// Wenn die Zeit verstrichen ist soll die Funktion PruefungBeenden
		// aufgerufen werden
		if (stunden<=0 && minuten<=0 && sekunden<=0)
		{
			if(PruefungBeendet=="nein") PruefungBeenden("zeit");		
		}
		if (PruefungBeendet == "nein" &&  Modus != "pause")
		{
			setTimeout('countdown()',200);
		}
        }
        // Anderenfalls alles auf Null setzen
        else document.getElementById("Zeitanzeige").firstChild.nodeValue=
            "Fehler";
}
function Pausieren()
{
	// Der Benutzer hat während des Tests auf Pause gedrückt
	if (Modus=="test")
	{
		if (PruefungBeendet == "nein")
		{
			Modus="pause";
		}
		// Die aktuelle Zeit wird in feldern zwischengspeichert
		document.getElementById("pause_stunde").value = stunden;
		document.getElementById("pause_minute").value = minuten;
		document.getElementById("pause_sekunde").value = sekunden;
		document.getElementById("Pauseknopf").value = "Weiter";
	}
	else if(Modus =="pause")
	{
		if (PruefungBeendet == "nein")
		{
			Modus="test";
		}
		var pause_stunde = Number(document.getElementById("pause_stunde").value);
		var pause_minute = Number(document.getElementById("pause_minute").value);
		var pause_sekunde = Number(document.getElementById("pause_sekunde").value);
		document.getElementById("Pauseknopf").value = "Pause";
		initializeCountdown(pause_stunde, pause_minute, pause_sekunde);
	}
}
