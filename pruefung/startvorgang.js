// XML Datei Laden und weiter zur initialisierung
// 
// 19.12.2007 ah
function startvorgang(lpic) {

  xmlDatei="lpic" + lpic + ".xml";
  
	if (document.implementation && document.implementation.createDocument) {
		xmlDoc = document.implementation.createDocument("", "", null);
	} else if (window.ActiveXObject) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.onreadystatechange = function () {
			if (xmlDoc.readyState == 4) initialisierung()
		};
 	}	else {
		alert('Mit diesem Browser funktioniert die Software nicht.\n Diese Software ist für den Browser Firefox optimiert');
		return;
	}
	// xmlDoc.async = false;
	PruefungBeendet="nein";
	Modus="test";
	xmlDoc.load(xmlDatei);
	initial(10)
}

// Initialisierungsvorgang der Testeinstellungen
function initial(fortschritt) {
	switch (fortschritt) {
		case 10:
			// liste_fuellen("fragetitel", "fragetitel", 1, "");
			break;
		case 20:
			liste_fuellen("fragetyp", "fragetyp", 1, "");
			liste_fuellen("punkte", "punkte", 1, "");
			break;
		case 30:
			liste_fuellen("hinweis", "hinweis", 1, "");
			liste_fuellen("erklaerung", "erklaerung", 1, "");
			break;
		case 40:
			liste_fuellen("fragetext", "fragetext", 1, "");
			liste_fuellen("antwort", "antworttext", 1, "");
			break;
		case 50:
			liste_fuellen("antwort", "zufrage", 2, "zuFrage");
			liste_fuellen("antwort", "richtig", 2, "richtig");
			break;
		case 60:
			matrix_fuellen(0, Math.round(Number(document.listen.fragetitel.length)/5));
			break;
		case 70:
			matrix_fuellen(1*(Math.round(Number(document.listen.fragetitel.length)/5)) 
			,(1* Math.round(Number(document.listen.fragetitel.length)/5)) 
			+ Math.round(Number(document.listen.fragetitel.length)/5));
			break;
		case 80:
			matrix_fuellen(2*(Math.round(Number(document.listen.fragetitel.length)/5))
			, (2* Math.round(Number(document.listen.fragetitel.length)/5)) 
			+ (Math.round(Number(document.listen.fragetitel.length)/5)));
			break;		
		case 90:
			matrix_fuellen(3*(Math.round(Number(document.listen.fragetitel.length)/5))
			, (3* Math.round(Number(document.listen.fragetitel.length)/5)) 
			+ Math.round(Number(document.listen.fragetitel.length)/5));
			break;			
		case 100:
			matrix_fuellen(4*(Math.round(Number(document.listen.fragetitel.length)/5))
			, Number(document.listen.fragetitel.length));
			document.getElementById("ladebalken").style.visibility = "hidden";
			document.getElementById("Einstellungen").style.visibility = "visible";
			document.Fragenanzahl.VerfuegbarAnzahl.value = AnzahlFragenkatalog();
			break;
		default:
			liste_fuellen("fragetitel", "fragetitel", 1, "");
			break;
 	}
	progress(fortschritt,1);
	if (fortschritt ==50 || fortschritt==55) {
		fortschritt +=5;
	} else {
		fortschritt+=10;
	}
	if (fortschritt <= 100) setTimeout(function() {initial(fortschritt);},500);
}

function progress(fortschritt_aktuell, teil) {	
	if (teil==1) {
		document.getElementById("rahmenbalken").firstChild.nodeValue = fortschritt_aktuell +" % des Fragenkatalogs geladen...";
		document.getElementById("balken").style.width = fortschritt_aktuell + "%";
	}
	if (teil==2) {
		document.getElementById("rahmenbalken").firstChild.nodeValue = fortschritt_aktuell +" % der Prüfung geladen...";
		document.getElementById("balken").style.width = fortschritt_aktuell + "%";
	}
}

function liste_fuellen(xml_tag, liste, typ, attribut) {
	var xml_element = xmlDoc.getElementsByTagName(xml_tag);
	var anzahl_elemente=xml_element.length;
	// alert("Tag: " + xml_tag +"\nElemente: " +anzahl_elemente);
	
  var select=document.getElementById(liste);
	for (var i=0;i<anzahl_elemente;i++) {
		var element = xml_element[i];
		for (j=0;j<element.childNodes.length;j++) {
      var inhalt = element.firstChild.nodeValue;
      if (typ==2) {
        var attributeValue = element.getAttribute(attribut);
        var inhalt = attributeValue;
      }
      var NeuerEintrag = new Option(inhalt, inhalt, false, true);
      select.options[select.options.length] = NeuerEintrag;
    }
	}
}

function matrix_fuellen(start,ende) {
	// Die Liste mit den Fragetiteln durchlaufen
	// alert(document.listen.fragetitel.length);
	// alert(start + " " +ende);
	for (var i=start;i < ende; i++) {
		progress
		var AktuellerFragetitel = document.listen.fragetitel.options[i].value;
		var MatrixString = "";
		var AntwortString = "";
		// Die zweite Schleife durchläuft die Liste zufrage nach den zum fragetitel passenden Antworten
		for (var i2=0; i2 < document.listen.zufrage.length; i2++) {
			var AktuelleZuFrage = document.listen.zufrage.options[i2].value;
			// Auf übereinstimmung Prüfen
			if(AktuelleZuFrage == AktuellerFragetitel) {
				// Bei übereinstimmung den Wert aus der Liste richtig auswerten 
				// Der Matrix den entsprechenden Wert (0 oder 1) zuweisen
				AktuellRichtig = document.listen.richtig.options[i2].value;
				// Wenn Antwort richtig, dann eine 1 sonst eine 0
				if (AktuellRichtig == "ja") {
					MatrixString = MatrixString + "1";
				} else {
					MatrixString = MatrixString + "0";
				}
				AntwortString= AntwortString + "0";
			}
		}
		// Nach Auswertung der vorgegebenen Antworten und ihre Richtigkeit wird der MatrixString in die
		// zur Frage passende mustermatrix-Liste
		// alert(MatrixString);
		NeuerEintrag = new Option(MatrixString, MatrixString, false, true);
		document.listen.mustermatrix.options[document.listen.mustermatrix.length] = NeuerEintrag;
		// Nach Auswertung der vorgegebenen Antworten und ihre Richtigkeit wird der MatrixString in die
		// zur Frage passende mustermatrix-Liste		
		NeuerEintrag = new Option(AntwortString, AntwortString, false, true);
		document.listen.antwortmatrix.options[document.listen.antwortmatrix.length] = NeuerEintrag;
		var Free = "";
		NeuerEintrag = new Option(Free, Free, false, true);
		document.listen.antworteingabe.options[document.listen.antworteingabe.length] = NeuerEintrag;
		var Zero ="0";
		NeuerEintrag = new Option(Zero, Zero, false, true);
		document.listen.wiedervorlage.options[document.listen.wiedervorlage.length] = NeuerEintrag;
	}
}

function AnzahlFragenkatalog()
{
	// Liefert die Anzahl der verfügbaren Fragen zurück
	return document.listen.fragetitel.length;
}
