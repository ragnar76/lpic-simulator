function PruefungStarten(pruefung_fortschritt) {	
	var AnzahlFragen = Number(document.Fragenanzahl.EingabeAnzahl.value);
	switch (pruefung_fortschritt) {	
		// var Gesamtanzahl = Number(document.Fragenanzahl.VerfuegbarAnzahl.value);		
		case 10:
			document.getElementById("Einstellungen").style.visibility = "hidden";
			document.getElementById("ladebalken").style.visibility = "visible";			
			// Die Prüfung wird vorbereitet und gestartet
			break;
		case 20:
			FrageWaehlen(Math.round(AnzahlFragen/7));
			break;
		case 30:
			FrageWaehlen(Math.round(AnzahlFragen/7));
			break;
		case 40:
			FrageWaehlen(Math.round(AnzahlFragen/7));
			break;
		case 50:
			FrageWaehlen(Math.round(AnzahlFragen/7));
			break;
		case 60:
			FrageWaehlen(Math.round(AnzahlFragen/7));
			break;
		case 70:
			FrageWaehlen(Math.round(AnzahlFragen/7));
			break;
		case 80:
			// Rest
			FrageWaehlen(AnzahlFragen-(Math.round(AnzahlFragen/7))*6);
			break;
		case 90:
			// Den Index der Fragelisten auf 0 setzen
			IndexSetzen(0);
			AktivierenDeaktivieren();
			FragenanzahlAnpassen()
			FrageGesetzt();
			GeneriereAntworten();
			WerteHolen();
			Gesamtpunktzahl();
			break;
		case 100:
			//alert("angekommen");
			
			if (document.Zeitangabe.Zeit.checked == true) {
				initializeCountdown(Number(document.Zeitangabe.EingabeStunde.value), Number(document.Zeitangabe.EingabeMinute.value), Number(document.Zeitangabe.EingabeSekunde.value))
			} else {
				document.getElementById("Zeitanzeige").firstChild.nodeValue = "Keine Zeitbegrenzung";
				document.getElementById("Zeitanzeige_ka").firstChild.nodeValue = "Keine Zeitbegrenzung";
				document.getElementById("Pauseknopf").style.visibility = "hidden";
				document.getElementById("Pauseknopf_ka").style.visibility = "hidden";
			}
			document.getElementById("Einstellungen").style.visibility = "hidden";
			document.getElementById("Test").style.visibility = "visible";
			document.getElementById("ladebalken").style.visibility = "hidden";
			break;
	}
	progress(pruefung_fortschritt,2);
	pruefung_fortschritt+=10;
	if (pruefung_fortschritt <= 100) setTimeout(function() {PruefungStarten(pruefung_fortschritt);},500);	
}

function PruefungBeenden(BeendenTyp) {
	// Selbe();
	// Modus="beenden";
	// Wenn die Pruefung selber beendet wurde muss noch eine Prüfroutine erfolgen
	// die den Benutzer evtl nicht beantwortete Fragen meldet
	if (Modus=="wiedervorlage") {
		// Alle Wiedervorlagewerte auf 0 setzen
		for (var i2=0;i2<document.listen_choice.wiedervorlage_choice.length;i2++) {
			document.listen_choice.wiedervorlage_choice.options[i2].text = "0";
		}
	}
	if (BeendenTyp == "selbst") {
		// Die Liste der Antwortmatrix wird durchlaufen
		// Eine Matrix, die nur nullen enthält (Wert=0) wird als
		// nicht beantwortet gewertet und gezählt
		var AnzFragenUnbeantwortet = 0;
		for (var i = 0;i < document.getElementById("antwortmatrix_choice").length;i++) {
			var Matrixwert = Number(document.getElementById("antwortmatrix_choice").options[i].text); // Multiple Choice
			var Antwortwert = document.getElementById("antworteingabe_choice").options[i].text; // Fill-In 
			var Wiedervorlage = document.getElementById("wiedervorlage_choice").options[i].text;
			var Korrigiert = document.getElementById("korrigiert_choice").options[i].text;

			//alert (Matrixwert + " " + Antwortwert + " " + Wiedervorlage);
			if (Matrixwert == 0 && Antwortwert == "" && Wiedervorlage == "0" && Korrigiert== "0") {
				// Frage wurde nicht beantwortet -> zählen
				AnzFragenUnbeantwortet++;
			}
		}
		// Meldung ausgeben, wenn Unbeantwortete Fragen vorhanden
		if (AnzFragenUnbeantwortet > 0 && Modus=="test") {
			var WirklichKeine = confirm("Sie haben " + AnzFragenUnbeantwortet + " Fragen nicht beantwortet und auch nicht zur Wiedervorlage markiert!!!\n\nWollen Sie die Prüfung trotzdem beenden?");
			if (WirklichKeine == true) {
				Modus="beenden";
			} else  {
				Modus="test";
			}
		} else {
			Modus="beenden"
		}
		// Hier wird geprüft, ob eine der Fragen zur Wiedervorlage markiert wurde
		for (var i = 0;i < document.getElementById("wiedervorlage_choice").length;i++) {
			var Wieder = document.getElementById("wiedervorlage_choice").options[i].text;
			if (Wieder == "1") {
				WirklichWieder = confirm("Sie haben einige Fragen zur Wiedervorlage markiert.\n\nMöchten Sie diese Fragen jetzt noch bearbeiten?");
				if (WirklichWieder == true) {
					Modus="wiedervorlage";
					document.getElementById("Wiedervorlage").style.visibility = "hidden";
					LoescheAntworten();
					var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
					var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
					AktuellerIndex=i;
					IndexSetzen(AktuellerIndex);
					AktivierenDeaktivieren();
					FragenanzahlAnpassen();
					FrageGesetzt();
					GeneriereAntworten();
					WerteHolen();
					PunkteErmitteln();					
				} else {
					Modus="beenden";
				}
				break;
			}
		}
	} else {
		Modus="beenden";
	} 
	if (Modus=="beenden") {
		PruefungBeendet="ja";
		PunkteErmitteln();
		for (var i=0;i< document.listen_choice.korrigiert_choice.length;i++) {
			if (document.listen_choice.korrigiert_choice.options[i].text == "0") document.listen_choice.korrigiert_choice.options[i].text ="1";
		}
		document.getElementById("PruefungEnde_ka").style.visibility = "hidden";
		document.getElementById("Korrekturansicht").style.visibility = "hidden";
		document.getElementById("Test").style.visibility = "hidden";
		document.getElementById("korrekturknopf").style.visibility = "hidden";

		document.getElementById("AntwortChoice_ka").style.visibility = "hidden";
		document.getElementById("Eingabefeld_ka").style.visibility = "hidden";
		document.getElementById("AntwortText_ka").style.visibility = "hidden";
		document.getElementById("MusterAntworttext_ka").style.visibility = "hidden";

		document.getElementById("AntwortChoice").style.visibility = "hidden";
		document.getElementById("Eingabefeld").style.visibility = "hidden";
		document.getElementById("AntwortText").style.visibility = "hidden";

		document.getElementById("Ergebnis").style.visibility = "visible";
		if (BeendenTyp == "zeit") {
			alert("Ihre Prüfungszeit ist abgelaufen.\nDie Prüfung wurde somit automatisch beendet!");
		}
		document.getElementById("RichtigeFragen").value = document.listen_choice.RichtigBeantworteteFragen.value;
		document.getElementById("GesamtFragen").value = document.listen_choice.fragetitel_choice.length;
	
		document.getElementById("Endpunkte").value = document.listen_choice.ErreichtePunkte.value;
		document.getElementById("Gesamtpunkte").value = document.listen_choice.ZuErreichendePunkte.value;
		document.getElementById("Gesamtprozent").value = Math.round((Number(document.listen_choice.ErreichtePunkte.value) * 100) / Number(document.listen_choice.ZuErreichendePunkte.value));
		KorrekturlisteBauen();	
	}
}

function Naechste() {
	AntwortenEintragen();
	LoescheAntworten();
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	if (Modus=="wiedervorlage") {
		for (var i = Number(AktuellerIndex +1);i<document.listen_choice.wiedervorlage_choice.length;i++) {
			Wiedervorlagewert = document.listen_choice.wiedervorlage_choice.options[i].text;
			if (Wiedervorlagewert == "1") {
				AktuellerIndex=i;
				break;
			}
			if (i == document.listen_choice.wiedervorlage_choice.length-1) {
				var AmEnde = "ja";
			}
		}
		if (AmEnde=="ja") {
			// Hier kommen wir nur an, wenn wir am Ende der Liste angekommen sind
			// In diesem Fall erfolgt dieselbe Prüfung ab Index 0 nochmal
			for (var i = 0;i<document.listen_choice.wiedervorlage_choice.length;i++) {
				Wiedervorlagewert = document.listen_choice.wiedervorlage_choice.options[i].text;
				if (Wiedervorlagewert == "1") {
					AktuellerIndex=i;
					break;
				}
				if (i == document.listen_choice.wiedervorlage_choice.length-1) {
					alert("Ein Fehler mit dem Wiedervorlagemodus ist aufgetreten");
				}
			}
		}
	} else {	
		AktuellerIndex=AktuellerIndex +1;
	}
	IndexSetzen(AktuellerIndex);
	AktivierenDeaktivieren();
	FragenanzahlAnpassen();
	FrageGesetzt();
	GeneriereAntworten();
	WerteHolen();
	// PunkteErmitteln();
}

function Vorige() {
	AntwortenEintragen(); // Gegebene Antwort/en in die antwortmatrix oder antworteingabe eintragen
	LoescheAntworten(); // !!! XML-Knoten löschen, die angezeigt werden
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	if (Modus=="wiedervorlage") {
		for (var i = Number(AktuellerIndex -1);i>=0;i--) {
			Wiedervorlagewert = document.listen_choice.wiedervorlage_choice.options[i].text;
			if (Wiedervorlagewert == "1") {
				AktuellerIndex=i;
				break;
			}
			if (i == 0) {
				var AmEnde = "ja";
			}
		}
		if (AmEnde=="ja") {
			// Hier kommen wir nur an, wenn wir am Ende der Liste angekommen sind
			// In diesem Fall erfolgt dieselbe Prüfung ab Index 0 nochmal
			for (var i = document.listen_choice.wiedervorlage_choice.length-1;i>=0;i--) {
				Wiedervorlagewert = document.listen_choice.wiedervorlage_choice.options[i].text;
				if (Wiedervorlagewert == "1") {
					AktuellerIndex=i;
					break;
				}
				if (i == 0) {
					alert("Ein Fehler mit dem Wiedervorlagemodus ist aufgetreten");
				}
			}
		}
	} else {	
		AktuellerIndex=AktuellerIndex -1;
	}
	IndexSetzen(AktuellerIndex);    // Alle Listen auf Index setzen ERLEDIGT!
	AktivierenDeaktivieren();       // !!! welche Elemente sichtbar sein sollen und welche nicht (zr. Zt. nur Naechster und Voriger) 
	EingabeMatrix="";
	FragenanzahlAnpassen();         // !!! Der Wert und das Element Frage X von Y wird an den aktuellen Zusatand angepasst ERLEDIGT
	FrageGesetzt();                 // !!! Der Fragetext wird in die Bedienoberfläche eingebaut ELEDIGT!
	GeneriereAntworten();           // !!! Die Antworten werden in die Bedienoberfläche eingebaut // ERLEDIGT
	// GeneriereErklaerung();
	WerteHolen();                   // !!! Gegebene Antwortmatrix oder Eingabefeld wird aus der Liste ins Element geholt
	// PunkteErmitteln();
}

function Selbe() {
	AntwortenEintragen();           // Gegebene Antwort/en in die antwortmatrix oder antworteingabe eintragen
	LoescheAntworten();             // XML-Knoten löschen, die angezeigt werden ERSTMAL ERLEDIGT
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	AktuellerIndex=AktuellerIndex;
	IndexSetzen(AktuellerIndex);    // Alle Listen auf Index setzen
	AktivierenDeaktivieren();       // !!! welche Elemente sichtbar sein sollen und welche nicht (zr. Zt. nur Naechster und Voriger)
	EingabeMatrix="";
	FragenanzahlAnpassen();         // !!! Der Wert und das Element Frage X von Y wird an den aktuellen Zusatand angepasst
	FrageGesetzt();                 // !!! Der Fragetext wird in die Bedienoberfläche eingebaut ELEDIGT!
	GeneriereAntworten();           // !!! Die Antworten werden in die Bedienoberfläche eingebaut ERLEDIGT!
	// GeneriereErklaerung();
	WerteHolen();                   // !!! Gegebene Antwortmatrix oder Eingabefeld wird aus der Liste ins Element geholt
	// PunkteErmitteln();	
}

function Sofortantwort() {
	// Sofort korrigieren wurde gedrückt
	// Wert auf 1 setzen
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	document.getElementById("korrigiert_choice").options[AktuellerIndex].text="1";
	// Selbe Frage nochmal aufrufen
	AntwortenEintragen();           // Gegebene Antwort/en in die antwortmatrix oder antworteingabe eintragen
	LoescheAntworten();             // XML-Knoten löschen, die angezeigt werden ERSTMAL ERLEDIGT
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	AktuellerIndex=AktuellerIndex;
	IndexSetzen(AktuellerIndex);    // Alle Listen auf Index setzen
	AktivierenDeaktivieren();       // !!! welche Elemente sichtbar sein sollen und welche nicht (zr. Zt. nur Naechster und Voriger)
	EingabeMatrix="";
	FragenanzahlAnpassen();         // !!! Der Wert und das Element Frage X von Y wird an den aktuellen Zusatand angepasst
	FrageGesetzt();                 // !!! Der Fragetext wird in die Bedienoberfläche eingebaut ELEDIGT!
	GeneriereAntworten();           // !!! Die Antworten werden in die Bedienoberfläche eingebaut ERLEDIGT!
	// GeneriereErklaerung();
	WerteHolen();                   // !!! Gegebene Antwortmatrix oder Eingabefeld wird aus der Liste ins Element geholt
	// PunkteErmitteln();		
}

function AntwortenEintragen() {	
	var Fragetyp = document.listen_choice.fragetyp_choice.options[document.listen_choice.fragetyp_choice.selectedIndex].value;
	// Wurde die Frage zur wiedervorlage markiert
	if (document.getElementById("Wiedervorlage").checked == true) {
		// Eintragen in die Liste Wiedervorlage
		// alert("Eintragen WV=1");
		document.listen_choice.wiedervorlage_choice.options[document.listen_choice.wiedervorlage_choice.selectedIndex].text = "1";
	} else {
		document.listen_choice.wiedervorlage_choice.options[document.listen_choice.wiedervorlage_choice.selectedIndex].text = "0";
	}
	if (Fragetyp=="auswahl") {
		var EingabeMatrix="";
		for (var i=0; i < Anzahl_Antworten;i++) {
			if (document.getElementById("Antwort"+i).checked == true) {
				EingabeMatrix = EingabeMatrix + "1";	
			}	else {
				EingabeMatrix = EingabeMatrix + "0";	
			}
		}
		// alert(EingabeMatrix);
		document.listen_choice.antwortmatrix_choice.options[document.listen_choice.antwortmatrix_choice.selectedIndex].text = EingabeMatrix;
	} else {
		// alert(document.getElementById("Eingabefeld").value);
		document.getElementById("antworteingabe_choice").options[document.getElementById("antworteingabe_choice").selectedIndex].text = document.getElementById("Eingabefeld").value;
	}
}

function WerteHolen() {
	var Fragetyp = document.listen_choice.fragetyp_choice.options[document.listen_choice.fragetyp_choice.selectedIndex].value;
	// Wurde die Frage zur wiedervorlage markiert (entnahme aus der Liste)
	if (document.listen_choice.wiedervorlage_choice.options[document.listen_choice.wiedervorlage_choice.selectedIndex].text == "1") {
		// Element markieren
		// alert("Wert geholt und ist 1");
		document.getElementById("Wiedervorlage").checked = true;
	} else {
		//alert("Dann eben hier");
		document.getElementById("Wiedervorlage").checked = false;
	}	
	if (Fragetyp=="auswahl") {
		var EingabeMatrix= document.listen_choice.antwortmatrix_choice.options[document.listen_choice.antwortmatrix_choice.selectedIndex].text;
		for (var i=0; i < Anzahl_Antworten;i++) {
			if (EingabeMatrix.substr(i,1) == "1") {
				document.getElementById("Antwort"+i).checked = true;	
				document.getElementById("Antwort_ka"+i).checked = true;	
			} else {
				document.getElementById("Antwort"+i).checked = false;	
				document.getElementById("Antwort_ka"+i).checked = false;	
			}
		}
	} else {
		document.getElementById("Eingabefeld").value = document.getElementById("antworteingabe_choice").options[document.getElementById("antworteingabe_choice").selectedIndex].text;
		document.getElementById("Eingabefeld_ka").value = document.getElementById("antworteingabe_choice").options[document.getElementById("antworteingabe_choice").selectedIndex].text;
	}
}

function IndexSetzen(AktuellerIndex) {
	
	document.getElementById("fragetitel_choice").selectedIndex = AktuellerIndex;
	document.getElementById("fragetyp_choice").selectedIndex = AktuellerIndex;
	document.getElementById("punkte_choice").selectedIndex = AktuellerIndex;
	document.getElementById("hinweis_choice").selectedIndex = AktuellerIndex;
	document.getElementById("erklaerung_choice").selectedIndex = AktuellerIndex;
	document.getElementById("fragetext_choice").selectedIndex = AktuellerIndex;
	document.getElementById("mustermatrix_choice").selectedIndex = AktuellerIndex;
	document.getElementById("antwortmatrix_choice").selectedIndex = AktuellerIndex;
	document.getElementById("antworteingabe_choice").selectedIndex = AktuellerIndex;
	document.getElementById("wiedervorlage_choice").selectedIndex = AktuellerIndex;
	document.getElementById("korrigiert_choice").selectedIndex = AktuellerIndex;
}

function AktivierenDeaktivieren() {
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	var Fragetyp = document.listen_choice.fragetyp_choice.options[AktuellerIndex].text;
	// Aufgabe bereits gelöst?
	var AktuelleAufgabeGeloest = document.listen_choice.korrigiert_choice.options[AktuellerIndex].text;

	document.getElementById("Test").style.visibility = "hidden";
	document.getElementById("Korrekturansicht").style.visibility = "hidden";
	document.getElementById("Eingabefeld_ka").style.visibility = "hidden"
	document.getElementById("MusterAntworttext_ka").style.visibility = "hidden"

	if (document.getElementById("DirekteAntwort").checked == true) {
		document.getElementById("korrekturknopf").style.visibility = "visible";
	}
	if (PruefungBeendet == "ja") {
		document.getElementById("ZurKorrekturliste").style.visibility = "visible";
	}
	if (AktuellerIndex == AnzahlFragen-1) {
		// Nächste-Knopf deaktivieren	
		document.getElementById("Naechster").disabled = true;
		document.getElementById("Naechster_ka").disabled = true;		
	} else {
		// Nächste-Knopf aktivieren
		document.getElementById("Naechster").disabled = false;
		document.getElementById("Naechster_ka").disabled = false;
	}	
	if (AktuellerIndex == 0) {
		// Voriger-Knopf deaktivieren	
		document.getElementById("Voriger").disabled = true;
		document.getElementById("Voriger_ka").disabled = true;
	} else {
		// Voriger-Knopf aktivieren
		document.getElementById("Voriger").disabled = false;
		document.getElementById("Voriger_ka").disabled = false;
	}
	if (AktuelleAufgabeGeloest == "1") {
		// Die Aufgabe wurde bereits gelöst
		// In den entsprechenden Ansichtsmodus wechseln
		document.getElementById("Test").style.visibility = "hidden";
		document.getElementById("Korrekturansicht").style.visibility = "visible";
		document.getElementById("korrekturknopf").style.visibility = "hidden";
		if (Fragetyp=="text") {
			document.getElementById("Eingabefeld_ka").style.visibility = "visible";
			document.getElementById("MusterAntworttext_ka").style.visibility = "visible"
		} else {
			document.getElementById("Eingabefeld_ka").style.visibility = "hidden";
			document.getElementById("MusterAntworttext_ka").style.visibility = "hidden"
		}
	} else {
		document.getElementById("Test").style.visibility = "visible";
		document.getElementById("Korrekturansicht").style.visibility = "hidden";
		if (document.getElementById("DirekteAntwort").checked == true) {
			document.getElementById("korrekturknopf").style.visibility = "visible";
		} else {
			document.getElementById("korrekturknopf").style.visibility = "hidden";
		}
	}
}

function GeneriereAntworten() {
	// Zuerst muss die Anzahl der Antworten ermittelt werden
	var Fragetitel = document.listen_choice.fragetitel_choice.options[document.listen_choice.fragetitel_choice.selectedIndex].value;
	var Fragetyp = document.listen_choice.fragetyp_choice.options[document.listen_choice.fragetyp_choice.selectedIndex].value;
	var Mustermatrix = document.listen_choice.mustermatrix_choice.options[document.listen_choice.mustermatrix_choice.selectedIndex].text;
	var Antwortmatrix = document.listen_choice.antwortmatrix_choice.options[document.listen_choice.antwortmatrix_choice.selectedIndex].text;
	
	// alert(Fragetitel + " " + Fragetyp);
	var Anzahl_AlleAntworten = document.listen_choice.zufrage_choice.length;
	Anzahl_Antworten = 0;
	for (var i = 0;i < Anzahl_AlleAntworten; i++) {
		Antwort_ZuFrage = document.listen_choice.zufrage_choice.options[i].value;
		if (Fragetitel == Antwort_ZuFrage) {
			Anzahl_Antworten = Anzahl_Antworten +1;
		}
	}
	var Antwortindizies = new Array(Anzahl_Antworten);
	var DerIndex = 0;
	for (var i = 0;i < Anzahl_AlleAntworten; i++) {
		Antwort_ZuFrage = document.listen_choice.zufrage_choice.options[i].value;
		if (Fragetitel == Antwort_ZuFrage) {
			Antwortindizies[DerIndex] = i;
			DerIndex++;
		}
	}
	var EinBR = document.createElement("br");
	document.getElementById("AntwortChoice").appendChild(EinBR);
	var EinBR = document.createElement("br");
	document.getElementById("AntwortChoice").appendChild(EinBR);
		// gelöste form
  var EinBR = document.createElement("br");
  document.getElementById("AntwortChoice_ka").appendChild(EinBR);
  var EinBR = document.createElement("br");
  document.getElementById("AntwortChoice_ka").appendChild(EinBR);

	if (Fragetyp=="auswahl") {
		// An dieser Stelle muss geprüft werden, wieviel richtige Antworten 
		// zu der Frage existieren
		var AnzAntwortRichtig = 0;
		for (var i2=0;i2 < Anzahl_Antworten; i2++) {
			AktuellerIndex = Antwortindizies[i2];
			// Antwort richtig oder falsch
			var AntwortRichtig = document.listen_choice.richtig_choice.options[AktuellerIndex].value;
			if (AntwortRichtig == "ja") {
				AnzAntwortRichtig++
			}
		}
		for (var i2=0;i2 < Anzahl_Antworten; i2++) {
			AktuellerIndex = Antwortindizies[i2];
			var Antwort = document.listen_choice.antworttext_choice.options[AktuellerIndex].value;
			// var Mustermatrix_ka = document.listen_choice.mustermatrix_choice.options[AktuellerIndex].text;
		
			var EinInput = document.createElement("input");
			var TypCheck = document.createAttribute("type");
			if (AnzAntwortRichtig > 1) {
				TypCheck.nodeValue = "checkbox";
				document.getElementById("Anweisung").firstChild.nodeValue = "Bitte markieren Sie die richtigen Lösungen";
			} else {
				TypCheck.nodeValue = "radio";	
				document.getElementById("Anweisung").firstChild.nodeValue = "Bitte markieren Sie die richtige Lösung";
			}
			var DerName = document.createAttribute("name");
			DerName.nodeValue = "mc_antwort";
			var TypID = document.createAttribute("id");
			TypID.nodeValue = "Antwort"+i2;

			var Geaendert = document.createAttribute("onclick");
			Geaendert.nodeValue = "javascript:Antwortmatrix_Change()";
						
			EinInput.setAttributeNode(TypCheck);
			EinInput.setAttributeNode(DerName);
			EinInput.setAttributeNode(TypID);
			EinInput.setAttributeNode(Geaendert);
			
			document.getElementById("AntwortChoice").appendChild(EinInput);
			var CheckText = document.createTextNode(Antwort);
			document.getElementById("AntwortChoice").appendChild(CheckText);
			var EinBR = document.createElement("br");
			document.getElementById("AntwortChoice").appendChild(EinBR);
      // gelöste form
      EinInput_ka = document.createElement("input");
      TypCheck_ka = document.createAttribute("type");
      if (AnzAntwortRichtig > 1) {
        TypCheck_ka.nodeValue = "checkbox";
      } else {
        TypCheck_ka.nodeValue = "radio";
      }
      var DerName_ka = document.createAttribute("name");
      DerName_ka.nodeValue = "mc_antwort_ka";
      TypID_ka = document.createAttribute("id");
      TypID_ka.nodeValue = "Antwort_ka"+i2;
      Geaendert_ka = document.createAttribute("onclick");
      Geaendert_ka.nodeValue = "javascript:Antwortmatrix_Change()";
      Abgeschaltet_ka = document.createAttribute("disabled");
      Abgeschaltet_ka.nodeValue = "true";			

      EinInput_ka.setAttributeNode(TypCheck_ka);
      EinInput_ka.setAttributeNode(TypID_ka);
      EinInput_ka.setAttributeNode(DerName_ka);
      EinInput_ka.setAttributeNode(Geaendert_ka);
      EinInput_ka.setAttributeNode(Abgeschaltet_ka);

      EinImg_ka = document.createElement("img");
      if (Mustermatrix.substr(i2,1) == "1" && Mustermatrix.substr(i2,1) ==  Antwortmatrix.substr(i2,1)) {
        // alert("Hallo");
        EinImg_Quelle = document.createAttribute("src");
        EinImg_Quelle.nodeValue = "ok.png";
      }
      else if (Mustermatrix.substr(i2,1) == "0" && Antwortmatrix.substr(i2,1) == "1") {
        EinImg_Quelle = document.createAttribute("src");
        EinImg_Quelle.nodeValue = "falsch.png";
      }
      else if (Mustermatrix.substr(i2,1) == "1" && Antwortmatrix.substr(i2,1) == "0") {
        EinImg_Quelle = document.createAttribute("src");
        EinImg_Quelle.nodeValue = "ok.png";
      }
      else {
        EinImg_Quelle = document.createAttribute("src");
        EinImg_Quelle.nodeValue = "nix.png";
      }
      EinImg_ka.setAttributeNode(EinImg_Quelle);

      document.getElementById("AntwortChoice_ka").appendChild(EinImg_ka);
      document.getElementById("AntwortChoice_ka").appendChild(EinInput_ka);
      CheckText_ka = document.createTextNode(Antwort);
      document.getElementById("AntwortChoice_ka").appendChild(CheckText_ka);
      EinBR_ka = document.createElement("br");
      document.getElementById("AntwortChoice_ka").appendChild(EinBR_ka);
		}
	}
}

function LoescheAntworten() {
	var Fragetitel = document.listen_choice.fragetitel_choice.options[document.listen_choice.fragetitel_choice.selectedIndex].value;
	var Fragetyp = document.listen_choice.fragetyp_choice.options[document.listen_choice.fragetyp_choice.selectedIndex].value;

	var Anzahl_AlleAntworten = document.listen_choice.zufrage_choice.length;
	var Anzahl_Antworten = 0;
	for (var i = 0;i < Anzahl_AlleAntworten; i++) {
		Antwort_ZuFrage = document.listen_choice.zufrage_choice.options[i].value; 
    if (Fragetitel == Antwort_ZuFrage) {
			Anzahl_Antworten = Anzahl_Antworten +1;
		}
	}
	var Durchlauf = (Anzahl_Antworten *3) +1;
	var Durchlauf_ka = (Anzahl_Antworten *4) +1;
	if (Fragetyp=="auswahl") {
		for (var i=0; i<=Durchlauf ;i++) {
			var Knoten = document.getElementById("AntwortChoice").lastChild;
			document.getElementById("AntwortChoice").removeChild(Knoten);
		}
		for (var i=0; i<=Durchlauf_ka ;i++) {
			var Knoten_ka = document.getElementById("AntwortChoice_ka").lastChild;			
			document.getElementById("AntwortChoice_ka").removeChild(Knoten_ka);				
		}
	} else {
		for (var i=0; i<=1 ;i++) {
			var Knoten = document.getElementById("AntwortChoice").lastChild;
			var Knoten_ka = document.getElementById("AntwortChoice_ka").lastChild;			
			document.getElementById("AntwortChoice").removeChild(Knoten);	
			document.getElementById("AntwortChoice_ka").removeChild(Knoten_ka);				
		}
	}
	for (var i=0; i< 4;i++) {
		var Knoten = document.getElementById("Fragetext").lastChild;
		var Knoten_ka = document.getElementById("Fragetext_ka").lastChild;			
		document.getElementById("Fragetext").removeChild(Knoten);	
		document.getElementById("Fragetext_ka").removeChild(Knoten_ka);	
	}
}

function FragenanzahlAnpassen() {
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuelleFrage = Number(document.listen_choice.fragetitel_choice.selectedIndex)+1;
	var Fragezahltext = "Frage " + AktuelleFrage + " von " + AnzahlFragen;
	document.getElementById("Fragenanzahl_test").firstChild.nodeValue = Fragezahltext;
	document.getElementById("Fragenanzahl_ka").firstChild.nodeValue = Fragezahltext;
}

function Antwortmatrix_Change() {
	// alert("Hallo");
	if (Modus=="pause") {
		Pausieren();
	}
	AntwortenEintragen();
	// PunkteErmitteln();	
}

function FrageGesetzt() {
	// Diese Funktion wird immer dann aufgerufen, wenn eine neue Frage ausgewählt wurde
	var Mustermatrix = document.listen_choice.mustermatrix_choice.options[document.listen_choice.mustermatrix_choice.selectedIndex].text;
	var Antwortmatrix = document.listen_choice.antwortmatrix_choice.options[document.listen_choice.antwortmatrix_choice.selectedIndex].text;
	var Korrigiert = document.listen_choice.korrigiert_choice.options[document.listen_choice.korrigiert_choice.selectedIndex].text;
	var Erklaerung = document.listen_choice.erklaerung_choice.options[document.listen_choice.erklaerung_choice.selectedIndex].text;
	
	// Der Text der Frage wird in das Testformular eingebettet
	var EinBR = document.createElement("br");
	document.getElementById("Fragetext").appendChild(EinBR);
	var EinBR = document.createElement("br");
	document.getElementById("Fragetext").appendChild(EinBR);
  // Und noch mal für die gelöste form
  var EinBR = document.createElement("br");
  document.getElementById("Fragetext_ka").appendChild(EinBR);
  var EinBR = document.createElement("br");
  document.getElementById("Fragetext_ka").appendChild(EinBR);
	Fragetext = document.listen_choice.fragetext_choice.options[document.listen_choice.fragetext_choice.selectedIndex].value;
  
  // 2011.03.06 MK 1. Zeile neu, 2. Zeile deaktiviert -> nun sind auch HTML-tags im Fragentext möglich
  document.getElementById("Fragehtml").innerHTML = Fragetext;
  // document.getElementById("Fragetext").firstChild.nodeValue = Fragetext;	

	// gelöste form
	
  // 2011.03.06 MK deaktiviert -> nun sind auch HTML-tags im Fragentext möglich
  // document.getElementById("Fragetext_ka").firstChild.nodeValue = Fragetext;	
  
	Hinweis = document.listen_choice.hinweis_choice.options[document.listen_choice.hinweis_choice.selectedIndex].value;	
	if (Hinweis == "keiner") {
		Hinweis = " ";
	} else {
		Hinweis = "Hinweis: "+ Hinweis;
	}
	var Hinweistext = document.createTextNode(Hinweis);
	document.getElementById("Fragetext").appendChild(Hinweistext);
  // gelöste form
  var Hinweistext = document.createTextNode(Hinweis);
  
  
  document.getElementById("Fragetext_ka").appendChild(Hinweistext);
	var EinBR = document.createElement("br");
	document.getElementById("Fragetext").appendChild(EinBR);
  // gelöste form
  
  var EinBR = document.createElement("br");
  document.getElementById("Fragetext_ka").appendChild(EinBR);
  
  // 2011.03.06 MK neu eingefügt -> nun sind auch HTML-tags im Fragentext möglich
  document.getElementById("Fragehtml_ka").innerHTML = Fragetext;
  
    

  //Der Fragetyp wird abgefragt
	var Fragetyp = document.listen_choice.fragetyp_choice.options[document.listen_choice.fragetyp_choice.selectedIndex].value;
	// Und dann entsprechend gesetzt
	if (Fragetyp == "text") {
		if (Korrigiert == "0") {
			document.getElementById("AntwortChoice").style.visibility = "hidden";
			document.getElementById("AntwortText").style.visibility = "visible";
			document.getElementById("AntwortChoice_ka").style.visibility = "hidden";
			document.getElementById("AntwortText_ka").style.visibility = "hidden";					
			document.getElementById("MusterAntworttext_ka").style.visibility = "hidden";
		} else {
			document.getElementById("AntwortChoice_ka").style.visibility = "hidden";
			document.getElementById("AntwortText_ka").style.visibility = "visible";
			document.getElementById("AntwortChoice").style.visibility = "hidden";
			document.getElementById("AntwortText").style.visibility = "hidden";
			document.getElementById("MusterAntworttext_ka").style.visibility = "visible";
		}
		if (Erklaerung == "keine") {
			document.getElementById("Erklaerungstext").firstChild.nodeValue = "Keine Erklärung im Fragenkatalog vorhanden";
		} else {
      // 2011.03.06 MK 1+2.Zeile neu, 3. Zeile deaktiviert -> nun sind auch HTML-tags im Erklärungstext möglich 
      document.getElementById("Erklaerungshtml").innerHTML = "Erklärung: <br />" + Erklaerung;
      document.getElementById("Erklaerungstext").style.visibility = "hidden";
			// document.getElementById("Erklaerungstext").firstChild.nodeValue = "Erklärung: " + Erklaerung;
		}
		var Fragetitel = document.listen_choice.fragetitel_choice.options[document.listen_choice.fragetitel_choice.selectedIndex].text;
		var LaengeAntwortliste = document.listen_choice.zufrage_choice.length;
		var Antworteingabe = document.listen_choice.antworteingabe_choice.options[document.listen_choice.antworteingabe_choice.selectedIndex].text;
		for (var i2=0;i2 < LaengeAntwortliste; i2++) {
			var ZuFrage = document.listen_choice.zufrage_choice.options[i2].text;
			if (Fragetitel == ZuFrage) {
				var Musterantwort = document.listen_choice.antworttext_choice.options[i2].text;
				if (Musterantwort == Antworteingabe) {
					document.getElementById("Anweisung_ka").firstChild.nodeValue = "Sie haben die Aufgabe erfolgreich gelöst !!!";
					break;
				} else {
					document.getElementById("Anweisung_ka").firstChild.nodeValue = "Ihre Eingabe war leider Falsch";
				}
			}
		}
		var Musterantwort = "Richtige Eingabe: ";
		var AnzahlDerAntworten = 0;
		for (var i2=0;i2 < LaengeAntwortliste; i2++) {
			var ZuFrage = document.listen_choice.zufrage_choice.options[i2].text;
			var AktuelleAntwort = "";
			if (Fragetitel == ZuFrage) {			
				AnzahlDerAntworten++;
				AktuelleAntwort += " ";
				if(AnzahlDerAntworten > 1) {
					AktuelleAntwort += "oder ";
				}
				AktuelleAntwort += document.listen_choice.antworttext_choice.options[i2].text;
				var Musterantwort = Musterantwort + AktuelleAntwort;
			}
		}
		document.getElementById("MusterAntworttext_ka").firstChild.nodeValue = Musterantwort ;
		document.getElementById("Anweisung").firstChild.nodeValue = "Geben Sie Ihre Antwort in das Feld ein";
	} else {
		document.getElementById("MusterAntworttext_ka").firstChild.nodeValue = "";
		if (Korrigiert == "0") {
			document.getElementById("AntwortChoice").style.visibility = "visible";
			document.getElementById("AntwortText").style.visibility = "hidden";
			document.getElementById("AntwortChoice_ka").style.visibility = "hidden";
			document.getElementById("AntwortText_ka").style.visibility = "hidden";
			// document.getElementById("MusterAntworttext_ka").style.visibility = "visible";
		} else {
			document.getElementById("AntwortChoice_ka").style.visibility = "visible";
			document.getElementById("AntwortText_ka").style.visibility = "hidden";
			document.getElementById("AntwortChoice").style.visibility = "hidden";
			document.getElementById("AntwortText").style.visibility = "hidden";
			document.getElementById("MusterAntworttext_ka").style.visibility = "hidden";
		}
		if (Erklaerung == "keine") {
			document.getElementById("Erklaerungstext").firstChild.nodeValue = "Keine Erklärung im Fragenkatalog vorhanden";
		} else {
      // 2011.03.06 MK 1+2.Zeile neu, 3. Zeile deaktiviert -> nun sind auch HTML-tags im Erklärungstext möglich 
      document.getElementById("Erklaerungshtml").innerHTML = "Erklärung: <br />" + Erklaerung;
      document.getElementById("Erklaerungstext").style.visibility = "hidden";
      // document.getElementById("Erklaerungstext").firstChild.nodeValue = "Erklärung: " + Erklaerung;
		}
		if (Mustermatrix == Antwortmatrix) {
			document.getElementById("Anweisung_ka").firstChild.nodeValue = "Diese Aufgabe haben Sie richtig gelöst!!!";		
		} else {
			document.getElementById("Anweisung_ka").firstChild.nodeValue = "Ihre Antwort war leider Falsch";		
		}
	}
}

function FrageWaehlen(Anzahl)
{
	// Anzahl mal eine zufällige Frage auswählen
	for (var i=0; i < Anzahl; i++) {
		// progress(Math.round(i * 100 / Anzahl))
		// Zufallszahl erzeugen
		var Zufallszahl = (Number(document.getElementById("fragetitel").length-1) *(Math.random()))+1;
		Zufallszahl = Math.round(Zufallszahl);
		// alert("Zufallszahl:" + Zufallszahl);
		// Die Listenelemente der Zufallszahl übertragen
		var DerFragetitel = document.getElementById("fragetitel").options[Zufallszahl-1].value;

		var Feldwert = document.getElementById("fragetitel").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.fragetitel_choice.options[document.listen_choice.fragetitel_choice.length] = NeuerEintrag;
		document.getElementById("fragetitel").options[Zufallszahl-1] = null;	
		// alert(document.getElementById("fragetyp").length);
		var Feldwert = document.getElementById("fragetyp").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.fragetyp_choice.options[document.listen_choice.fragetyp_choice.length] = NeuerEintrag;
		document.getElementById("fragetyp").options[Zufallszahl-1] = null;		

		var Feldwert = document.getElementById("punkte").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.punkte_choice.options[document.listen_choice.punkte_choice.length] = NeuerEintrag;
		document.getElementById("punkte").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("hinweis").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.hinweis_choice.options[document.listen_choice.hinweis_choice.length] = NeuerEintrag;
		document.getElementById("hinweis").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("erklaerung").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.erklaerung_choice.options[document.listen_choice.erklaerung_choice.length] = NeuerEintrag;
		document.getElementById("erklaerung").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("fragetext").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.fragetext_choice.options[document.listen_choice.fragetext_choice.length] = NeuerEintrag;
		document.getElementById("fragetext").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("mustermatrix").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.mustermatrix_choice.options[document.listen_choice.mustermatrix_choice.length] = NeuerEintrag;
		document.getElementById("mustermatrix").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("antwortmatrix").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.antwortmatrix_choice.options[document.listen_choice.antwortmatrix_choice.length] = NeuerEintrag;
		document.getElementById("antwortmatrix").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("antworteingabe").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.antworteingabe_choice.options[document.listen_choice.antworteingabe_choice.length] = NeuerEintrag;
		document.getElementById("antworteingabe").options[Zufallszahl-1] = null;

		var Feldwert = document.getElementById("wiedervorlage").options[Zufallszahl-1].value;
		NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
		document.listen_choice.wiedervorlage_choice.options[document.listen_choice.wiedervorlage_choice.length] = NeuerEintrag;
		document.getElementById("wiedervorlage").options[Zufallszahl-1] = null;

		var Zero ="0";
		NeuerEintrag = new Option(Zero, Zero, false, true);
		document.listen_choice.korrigiert_choice.options[document.listen_choice.korrigiert_choice.length] = NeuerEintrag;


		// Jetzt kommen die passenden Antworten zur aktuellen Frage
		
		for (var i2=0;i2 < document.getElementById("antworttext").length; i2++) {
			// alert(document.getElementById("antworttext").length);
			// alert("ID ist:" + i2);
			DerAntworttext = document.getElementById("antworttext").options[i2].value;
			DieZuFrage = document.getElementById("zufrage").options[i2].value;
			DerRichtig = document.getElementById("richtig").options[i2].value;
			// alert(DerFragetitel + "==" + DieZuFrage);
			if (DerFragetitel == DieZuFrage) {
				var Feldwert = document.getElementById("antworttext").options[i2].value;
				NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
				document.listen_choice.antworttext_choice.options[document.listen_choice.antworttext_choice.length] = NeuerEintrag;
				document.getElementById("antworttext").options[i2] = null;

				var Feldwert = document.getElementById("zufrage").options[i2].value;
				NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
				document.listen_choice.zufrage_choice.options[document.listen_choice.zufrage_choice.length] = NeuerEintrag;
				document.getElementById("zufrage").options[i2] = null;

				var Feldwert = document.getElementById("richtig").options[i2].value;
				NeuerEintrag = new Option(Feldwert, Feldwert, false, true);
				document.listen_choice.richtig_choice.options[document.listen_choice.richtig_choice.length] = NeuerEintrag;
				document.getElementById("richtig").options[i2] = null;
				i2--;
			}
		}
	}
}

function AnzahlFragenPlus() {
	if (Number(document.Fragenanzahl.EingabeAnzahl.value) >= Number(document.Fragenanzahl.VerfuegbarAnzahl.value)) {
		document.Fragenanzahl.EingabeAnzahl.value = 1;
		// alert("Der Wert überschreitet die Gesamtzahl der verf&uuml;gbaren Fragen");
	} else {
		document.Fragenanzahl.EingabeAnzahl.value = Number(document.Fragenanzahl.EingabeAnzahl.value) +1;
	}
	ZeitErrechnen();
}

function AnzahlFragenMinus (){
	if (Number(document.Fragenanzahl.EingabeAnzahl.value) <= 1) {
		document.Fragenanzahl.EingabeAnzahl.value = document.Fragenanzahl.VerfuegbarAnzahl.value;
		// alert("Mindestens eine Frage muss der Test beeinhalten");
	} else {
		document.Fragenanzahl.EingabeAnzahl.value = Number(document.Fragenanzahl.EingabeAnzahl.value) -1;
	}
	ZeitErrechnen();
}

function AnzahlFragenPlus10() {
	var Verfuegbar = Number(document.Fragenanzahl.VerfuegbarAnzahl.value);
	var AktuelleFrage = Number(document.Fragenanzahl.EingabeAnzahl.value);
	if ( AktuelleFrage +10 >= Verfuegbar) {
		document.Fragenanzahl.EingabeAnzahl.value = 10-(Verfuegbar - AktuelleFrage);
		// alert("Der Wert überschreitet die Gesamtzahl der verf&uuml;gbaren Fragen");
	} else {
		document.Fragenanzahl.EingabeAnzahl.value = Number(document.Fragenanzahl.EingabeAnzahl.value) +10;
	}
	ZeitErrechnen();
}

function AnzahlFragenMinus10 (){
	var Verfuegbar = Number(document.Fragenanzahl.VerfuegbarAnzahl.value);
	var AktuelleFrage = Number(document.Fragenanzahl.EingabeAnzahl.value);
	if (AktuelleFrage -10 < 1) {
		document.Fragenanzahl.EingabeAnzahl.value = Verfuegbar -10 + AktuelleFrage;
		// alert("Mindestens eine Frage muss der Test beeinhalten");
	} else {
		document.Fragenanzahl.EingabeAnzahl.value = Number(document.Fragenanzahl.EingabeAnzahl.value) -10;
	}
	ZeitErrechnen();
}

function StundePlus() {
	if (document.Zeitangabe.EingabeStunde.value >= 4) {
		document.Zeitangabe.EingabeStunde.value = 4;
		alert("Testzeiten sind auf unter 5 Std. begrenzt");
	} else {
		document.Zeitangabe.EingabeStunde.value = Number(document.Zeitangabe.EingabeStunde.value) +1;
	}
}

function StundeMinus() {
	if(document.Zeitangabe.EingabeStunde.value == 1 && document.Zeitangabe.EingabeMinute.value == 0) {
		document.Zeitangabe.EingabeMinute.value = 1;
		document.Zeitangabe.EingabeStunde.value = Number(document.Zeitangabe.EingabeStunde.value) -1;
	}
	else if (document.Zeitangabe.EingabeStunde.value <= 0) {
		document.Zeitangabe.EingabeStunde.value = 0;
		alert("Weniger als 0 Stunden ist nicht korrekt!");
	} else {
		document.Zeitangabe.EingabeStunde.value = Number(document.Zeitangabe.EingabeStunde.value) -1;
	}
}

function MinutePlus() {
	if (document.Zeitangabe.EingabeMinute.value >= 59) {
		document.Zeitangabe.EingabeMinute.value = 0;
	} else {
		document.Zeitangabe.EingabeMinute.value = Number(document.Zeitangabe.EingabeMinute.value) +1;
	}		
}

function MinuteMinus() {
	if(document.Zeitangabe.EingabeMinute.value <= 1 && document.Zeitangabe.EingabeStunde.value == 0) {
		document.Zeitangabe.EingabeMinute.value = 1;
	}
	else if (document.Zeitangabe.EingabeMinute.value <= 0) {
		document.Zeitangabe.EingabeMinute.value = 59;
	} else {
		document.Zeitangabe.EingabeMinute.value = Number(document.Zeitangabe.EingabeMinute.value) -1;
	}
}

function SekundePlus() {
	if (document.Zeitangabe.EingabeSekunde.value >= 59) {
		document.Zeitangabe.EingabeSekunde.value = 0;
	} else {
		document.Zeitangabe.EingabeSekunde.value = Number(document.Zeitangabe.EingabeSekunde.value) +1;
	}
}

function SekundeMinus() {
	if (document.Zeitangabe.EingabeSekunde.value <= 0) {
		document.Zeitangabe.EingabeSekunde.value = 59;
	} else {
		document.Zeitangabe.EingabeSekunde.value = Number(document.Zeitangabe.EingabeSekunde.value) -1;
	}
}

function Gesamtpunktzahl() {
	var Listenlaenge = document.listen_choice.punkte_choice.length;
	var Punktwert_Aktuell=0;
	var Gesamtpunkte=0;
	for (var i=0; i < Listenlaenge;i++) {	
		Punktwert_Aktuell = Number(document.listen_choice.punkte_choice.options[i].value);
		Gesamtpunkte = Gesamtpunkte + Punktwert_Aktuell;
	}
	document.listen_choice.ZuErreichendePunkte.value = Gesamtpunkte;
}

function PunkteErmitteln() {
	// Vor der Standardpunkteermittlung müssen noch die Fragen vom Typ text
	// Auf Richtigkeit geprüft werden und anschließend muss der Wert der antwortmatrix
	// auf 0 (falsch) oder 1 (richtig gesetzt werden)
	var Listenlaenge = document.listen_choice.punkte_choice.length;
	var Punktwert_Aktuell=0;
	var Gesamtpunkte=0;
	var RichtigBeantwortet=0;
	for (var i=0; i < Listenlaenge;i++) {	
		var Fragetyp = document.listen_choice.fragetyp_choice.options[i].value;
		if (Fragetyp=="text") {
			var Fragetitel = document.listen_choice.fragetitel_choice.options[i].text;
			var LaengeAntwortliste = document.listen_choice.zufrage_choice.length;
			var Antworteingabe = document.listen_choice.antworteingabe_choice.options[i].text;
			var Antwortstring = "";
			var MinEineRichtig = "nein";
			for (var i2=0;i2 < LaengeAntwortliste; i2++) {
				var ZuFrage = document.listen_choice.zufrage_choice.options[i2].text;
				if (Fragetitel == ZuFrage && MinEineRichtig != "ja") {
					var Musterantwort = document.listen_choice.antworttext_choice.options[i2].text;
					if (Musterantwort == Antworteingabe) {
						document.listen_choice.antwortmatrix_choice.options[i].text = document.listen_choice.mustermatrix_choice.options[i].text;
						MinEineRichtig = "ja";
					} else {
						// document.listen_choice.antwortmatrix_choice.options[i].text = "0";
					}
				}
			}
		}

		Punktwert_Aktuell = Number(document.listen_choice.punkte_choice.options[i].value);
		var Muster_Aktuell= document.listen_choice.mustermatrix_choice.options[i].text;
		var Antwort_Aktuell = document.listen_choice.antwortmatrix_choice.options[i].text;

		if (Muster_Aktuell == Antwort_Aktuell) {
			Gesamtpunkte = Gesamtpunkte + Punktwert_Aktuell;
			RichtigBeantwortet++;
		}
	}
	document.listen_choice.ErreichtePunkte.value = Gesamtpunkte;
	document.listen_choice.RichtigBeantworteteFragen.value = RichtigBeantwortet;
}

function KorrekturlisteBauen() {
	// Hier wird eine Liste Dynamisch erzeugt
	// Vorgaben GesamtBreite:755px
	// Fragenummer:20px
	// Fragetext:535px
	// Punkte:20px;
	// Richtig/Falsch-Icon:30px	
	// Detailbutton:150px;
	// Demnach Tabelle mit breite 755px mit 5 Zellen
	// Je Frage wird eine Zeile angezeigt
	for (var i=0;i< document.listen_choice.fragetitel_choice.length;i++) {
		// alert("Hallo"+i);
		//Eine Komplette Zeile
		var Zellenreihe = document.createElement("tr");	
		var ZellenreiheID = document.createAttribute("id");
		ZellenreiheID.nodeValue = "Reihe" + i;
		Zellenreihe.setAttributeNode(ZellenreiheID);
		// Als erstes die Nummer
		var ZelleNummer = document.createElement("td");
		var ZelleNummerLayout = document.createAttribute("class");
		ZelleNummerLayout.nodeValue = "kl_nummer";
		var ZelleNummerID = document.createAttribute("id");
		ZelleNummerID.nodeValue="Nummer"+i;
		var ZelleNummerInhalt = document.createTextNode(i+1);
		ZelleNummer.setAttributeNode(ZelleNummerLayout);
		ZelleNummer.setAttributeNode(ZelleNummerID);
		
		// Dann der Text
		var ZelleText = document.createElement("td");
		var ZelleTextLayout = document.createAttribute("class");
		ZelleTextLayout.nodeValue = "kl_text";
		var ZelleTextID = document.createAttribute("id");
		ZelleTextID.nodeValue="KorrekturFrage"+i;
		var Rohtext = String(document.listen_choice.fragetext_choice.options[i].text);
		var TextKurz = Rohtext.substr(0,160) + "...";
		var ZelleTextInhalt = document.createTextNode(TextKurz);
		ZelleText.setAttributeNode(ZelleTextLayout);
		ZelleText.setAttributeNode(ZelleTextID);
		
		// Dann Punkte
		var ZellePunkte = document.createElement("td");
		var ZellePunkteLayout = document.createAttribute("class");
		ZellePunkteLayout.nodeValue = "kl_punkte";
		var ZellePunkteID = document.createAttribute("id");
		ZellePunkteID.nodeValue="KorrekturPunkte"+i;
		var PunkteText = String(document.listen_choice.punkte_choice.options[i].text);
		var ZellePunkteInhalt = document.createTextNode(PunkteText);
		ZellePunkte.setAttributeNode(ZellePunkteLayout);
		ZellePunkte.setAttributeNode(ZellePunkteID);

		// Dann Richtig?
		var ZelleRichtig = document.createElement("td");
		var ZelleRichtigLayout = document.createAttribute("class");
		ZelleRichtigLayout.nodeValue = "kl_richtig";
		var ZelleRichtigID = document.createAttribute("id");
		ZelleRichtigID.nodeValue="KorrekturRichtig"+i;
		var ZelleRichtigGrafik =document.createAttribute("style");
		if (document.listen_choice.mustermatrix_choice.options[i].text == document.listen_choice.antwortmatrix_choice.options[i].text) {
			ZelleRichtigGrafik.nodeValue="background-image:url(ok.png);background-repeat:no-repeat;";
			// ZelleRichtigGrafik.nodeValue="background-color:green;";
		} else {
			var Fragetitel = document.listen_choice.fragetitel_choice.options[i].value;
			var DerIndex = 0;
			var AnzAntwortRichtig = 0;

			// Ist die Antwort vielleicht teilweise richtig?
			var Anzahl_AlleAntworten = document.listen_choice.zufrage_choice.length;
			Anzahl_Antworten = 0;
			for (var i2 = 0;i2 < Anzahl_AlleAntworten; i2++) {
				Antwort_ZuFrage = document.listen_choice.zufrage_choice.options[i2].value;
				var AntwortRichtig = document.listen_choice.richtig_choice.options[i2].value;
				if (Fragetitel == Antwort_ZuFrage) {
					// Antwortindizies[DerIndex] = i2;
					// DerIndex++;
				}
				if (Fragetitel == Antwort_ZuFrage) {
					if (AntwortRichtig == "ja") {
						AnzAntwortRichtig++;
					}
					Anzahl_Antworten = Anzahl_Antworten +1;
				}
			}
			// var Antwortindizies = new Array(Anzahl_Antworten);
			// for (var i2 = 0;i2 < Anzahl_AlleAntworten; i2++)
			// {
			// }
			/* var AnzAntwortRichtig = 0;
			for (var i2=0;i2 < Anzahl_Antworten; i2++)
			{
				AktuellerIndex = Antwortindizies[i2];
				// Antwort richtig oder falsch
				var AntwortRichtig = document.listen_choice.richtig_choice.options[AktuellerIndex].value;
				if (AntwortRichtig == "ja")
				{
					AnzAntwortRichtig++;
				}
			}*/
			
			// Beinhaltet die Frage mehrere Antwortmöglichkeiten?
			var AnzRichtigGewaehlt = 0;
			if (AnzAntwortRichtig > 1) {
				var AktuellesMuster = document.getElementById("mustermatrix_choice").options[i].text;
				var AktuelleMatrix = document.getElementById("antwortmatrix_choice").options[i].text;
				for (var i2=0; i2 < Anzahl_Antworten;i2++) {
					ZeichenMuster = AktuellesMuster.substr(i2,1);
					ZeichenMatrix = AktuelleMatrix.substr(i2,1);
					if (ZeichenMuster == ZeichenMatrix && ZeichenMatrix == "1") {
						ZelleRichtigGrafik.nodeValue="background-image:url(okfalsch.png);background-repeat:no-repeat;";
						AnzRichtigGewaehlt = 1;
						break;
					}
				}
				// Wenn keine Richtige Antwortmöglichkeit gewählt wurde, dann Zeige das Kreuz an
				if (AnzRichtigGewaehlt == 0) {
					ZelleRichtigGrafik.nodeValue="background-image:url(falsch.png);background-repeat:no-repeat;";
				}
			} else {
				ZelleRichtigGrafik.nodeValue="background-image:url(falsch.png);background-repeat:no-repeat;";
			}
			//ZelleRichtigGrafik.nodeValue="background-color:red;";
		}
		ZelleRichtig.setAttributeNode(ZelleRichtigLayout);
		ZelleRichtig.setAttributeNode(ZelleRichtigID);
		ZelleRichtig.setAttributeNode(ZelleRichtigGrafik);
		
		// Dann der Button Details
		var ZelleDetails = document.createElement("td");
		var ZelleDetailsLayout = document.createAttribute("class");
		ZelleDetailsLayout.nodeValue = "kl_details";
		var ZelleDetailsID = document.createAttribute("id");
		ZelleDetailsID.nodeValue="KorrekturDetails"+i;
		ZelleDetails.setAttributeNode(ZelleDetailsLayout);
		ZelleDetails.setAttributeNode(ZelleDetailsID);
		
		var ZelleDetailsButton = document.createElement("input");
		var DetailsTyp = document.createAttribute("type");
		DetailsTyp.nodeValue="button";
		var DetailsWert = document.createAttribute("value");
		DetailsWert.nodeValue="Detailansicht";
		var DetailsStil = document.createAttribute("style");
		DetailsStil.nodeValue="height:20px;font-size:10pt;";
		var DetailsAktion = document.createAttribute("onclick");
		var DieAktion = "Korrekturansicht('"+ i +"')";
		DetailsAktion.nodeValue= DieAktion;
		ZelleDetailsButton.setAttributeNode(DetailsTyp);
		ZelleDetailsButton.setAttributeNode(DetailsStil);
		ZelleDetailsButton.setAttributeNode(DetailsWert);
		ZelleDetailsButton.setAttributeNode(DetailsAktion);
		
		
		document.getElementById("tabelle_korrekturliste").appendChild(Zellenreihe);
		document.getElementById("Reihe" +i).appendChild(ZelleNummer);
		document.getElementById("Reihe" +i).appendChild(ZelleText);
		document.getElementById("Reihe" +i).appendChild(ZellePunkte);
		document.getElementById("Reihe" +i).appendChild(ZelleRichtig);
		document.getElementById("Reihe" +i).appendChild(ZelleDetails);

		document.getElementById("Nummer" +i).appendChild(ZelleNummerInhalt);
		document.getElementById("KorrekturFrage" +i).appendChild(ZelleTextInhalt);
		document.getElementById("KorrekturPunkte" +i).appendChild(ZellePunkteInhalt);
		//document.getElementById("KorrekturRichtig" +i).appendChild(ZelleRichtigInhalt);
		document.getElementById("KorrekturDetails" +i).appendChild(ZelleDetailsButton);
	}
}

function Korrekturansicht(Frageindex) {
	document.getElementById("Test").style.visibility = "hidden";
	document.getElementById("Korrekturansicht").style.visibility = "visible";
	// document.getElementById("Eingabefeld_ka").style.visibility = "visible";
  
	AntwortenEintragen();             // Gegebene Antwort/en in die antwortmatrix oder antworteingabe eintragen
	LoescheAntworten();               // XML-Knoten löschen, die angezeigt werden ERSTMAL ERLEDIGT
	var AnzahlFragen = document.listen_choice.fragetitel_choice.length;
	var AktuellerIndex = document.listen_choice.fragetitel_choice.selectedIndex;
	AktuellerIndex=Frageindex;
	IndexSetzen(AktuellerIndex);      // Alle Listen auf Index setzen
	AktivierenDeaktivieren();         // !!! welche Elemente sichtbar sein sollen und welche nicht (zr. Zt. nur Naechster und Voriger)
	EingabeMatrix="";
	FragenanzahlAnpassen();           // !!! Der Wert und das Element Frage X von Y wird an den aktuellen Zusatand angepasst
	FrageGesetzt();                   // !!! Der Fragetext wird in die Bedienoberfläche eingebaut ELEDIGT!
	GeneriereAntworten();             // !!! Die Antworten werden in die Bedienoberfläche eingebaut ERLEDIGT!
	// GeneriereErklaerung();
	WerteHolen();                     // !!! Gegebene Antwortmatrix oder Eingabefeld wird aus der Liste ins Element geholt
	PunkteErmitteln();	
}

function ZurKorrekturliste() {
	document.getElementById("ZurKorrekturliste").style.visibility = "hidden"
	document.getElementById("AntwortChoice_ka").style.visibility = "hidden"
	document.getElementById("Eingabefeld_ka").style.visibility = "hidden"
	document.getElementById("AntwortText_ka").style.visibility = "hidden"
	document.getElementById("MusterAntworttext_ka").style.visibility = "hidden"

	document.getElementById("AntwortChoice").style.visibility = "hidden"
	document.getElementById("Eingabefeld").style.visibility = "hidden"
	document.getElementById("AntwortText").style.visibility = "hidden"

	document.getElementById("Korrekturansicht").style.visibility = "hidden";
}