const topics = [
  {
    kicker: "Onderwerp 1",
    title: "De mens is vaak het eerste doelwit",
    duration: "2 min",
    summary:
      "De meeste beveiligingsincidenten beginnen met een heel menselijk moment: haast, te veel vertrouwen, te snel verzenden of stil blijven na een fout.",
    explanation:
      "Informatiebeveiliging is niet alleen een technische maatregel. Het is dagelijks gedrag. Aanvallers spelen in op druk, routine, afleiding, nieuwsgierigheid en beleefdheid. Daarom is onze sterkste verdediging niet perfect geheugen, maar op tijd stoppen, controleren en melden.",
    rules: [
      "Meld verdachte situaties, verdachte bestanden en mogelijke datalekken direct aan de Security Officer.",
      "Gebruik goedgekeurde werksystemen en volg het afgesproken bedrijfsproces, ook onder tijdsdruk.",
      "Zie awareness als onderdeel van je werk: nieuwe medewerkers krijgen instructie tijdens onboarding en medewerkers krijgen doorlopende training."
    ],
    risks: [
      "Klikken of doorsturen voordat je hebt gecontroleerd",
      "Dringende verzoeken vertrouwen omdat de afzender bekend lijkt",
      "Een fout stil proberen op te lossen in plaats van snel te melden",
      "Gemak kiezen boven het afgesproken proces"
    ],
    image: "assets/images/human-risk.svg",
    questions: [
      {
        prompt: "Een collega klikte op een verdachte link en sloot de pagina meteen. Wat moet er daarna gebeuren?",
        choices: [
          { text: "Zelf eerst een volledig malware-onderzoek uitvoeren voordat je iets meldt.", correct: false },
          { text: "Het direct melden, ook als er niets zichtbaar is gebeurd.", correct: true },
          { text: "Alleen melden als het apparaat later traag wordt.", correct: false },
          { text: "De e-mail verwijderen en doorgaan met werken.", correct: false }
        ]
      },
      {
        prompt: "Waarom worden mensen zo vaak gebruikt als ingang voor aanvallen?",
        choices: [
          { text: "Omdat gewoontes, haast en vertrouwen sneller zijn uit te buiten dan systemen kunnen reageren.", correct: true },
          { text: "Omdat technische beveiligingsmaatregelen in de meeste bedrijven niet zijn toegestaan.", correct: false },
          { text: "Omdat alleen managers worden aangevallen.", correct: false },
          { text: "Omdat phishing alleen werkt bij mensen met zwakke wachtwoorden.", correct: false }
        ]
      },
      {
        prompt: "Een verzoek voelt vreemd, maar je kunt niet bewijzen dat het kwaadaardig is. Wat is dan het veiligst?",
        choices: [
          { text: "Pauzeren, verifiëren en je twijfel melden.", correct: true },
          { text: "Doorgaan omdat er geen bewijs is.", correct: false },
          { text: "Alleen een collega vragen, maar niets formeel melden.", correct: false },
          { text: "Het verzoek eerst uitvoeren en je twijfel daarna vastleggen.", correct: false }
        ]
      },
      {
        prompt: "Waardoor wordt een kleine menselijke fout het vaakst een groter beveiligingsprobleem?",
        choices: [
          { text: "Het probleem meteen via het juiste kanaal escaleren.", correct: false },
          { text: "De melding uitstellen en de fout verbergen.", correct: true },
          { text: "Er direct open over praten.", correct: false },
          { text: "Het normale incidentproces volgen.", correct: false }
        ]
      },
      {
        prompt: "Welke houding past het best bij deze training?",
        choices: [
          { text: "Beveiliging is vooral een technisch probleem en ligt grotendeels buiten jouw invloed.", correct: false },
          { text: "Beveiliging is vooral de taak van IT.", correct: false },
          { text: "Als er vandaag niets misgaat, is beveiliging geregeld.", correct: false },
          { text: "Beveiliging is gedeeld gedrag en geen schuldspel.", correct: true }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 2",
    title: "Klantdata moet beheerst blijven",
    duration: "3 min",
    summary:
      "Klantdata wordt gevaarlijk zodra die te lang blijft staan in inboxen, exports, screenshots, lokale mappen of op geprint papier.",
    explanation:
      "We bewaren klantdata alleen zolang die nodig is voor het doel waarvoor we ermee werken. Is het werk klaar, dan moet de extra kopie weg. Het veiligste bestand is het bestand dat alleen in het goedgekeurde systeem staat, niet het bestand dat vergeten is op een bureaublad, in Downloads of naast de printer.",
    rules: [
      "Informatie in systemen, apparaten of andere media moet worden verwijderd zodra die niet meer nodig is.",
      "Sla geen lokale werkbestanden op de computer op; gebruik goedgekeurde bedrijfssystemen zoals SharePoint en OneDrive.",
      "Geprinte documenten moeten direct uit de printer worden gehaald en vertrouwelijk papier moet veilig worden vernietigd.",
      "Sla geen Smart Locking Group-data op een privé-laptop op."
    ],
    risks: [
      "Oude exports met namen, adressen of accountgegevens die op lokale apparaten blijven staan",
      "Klantbijlagen die in mailboxen blijven zitten terwijl het werk al klaar is",
      "Geprinte documenten die bij printers of op bureaus blijven liggen",
      "Privé-opslag, screenshots of gekopieerde lijsten buiten het goedgekeurde systeem"
    ],
    image: "assets/images/customer-data.svg",
    questions: [
      {
        prompt: "Je hebt een klantdossier afgerond en je hebt nog een lokale export met persoonsgegevens. Wat doe je?",
        choices: [
          { text: "De lokale kopie verwijderen zodra die niet meer nodig is en alleen het officiële dossier in het goedgekeurde systeem houden.", correct: true },
          { text: "Het bestand op je bureaublad laten staan voor het geval de klant nog belt.", correct: false },
          { text: "Het bestand naar je privé-mail sturen als back-up.", correct: false },
          { text: "Het bestand op een USB-stick zetten zodat het niet meer op je laptop staat.", correct: false }
        ]
      },
      {
        prompt: "Waarom is opslag 'voor het geval dat' een probleem?",
        choices: [
          { text: "Omdat opslagkosten dan wettelijk moeten worden gerapporteerd.", correct: false },
          { text: "Omdat alle klantdata altijd direct moet worden verwijderd.", correct: false },
          { text: "Omdat opslagruimte het grootste probleem is.", correct: false },
          { text: "Omdat verouderde data de impact van een datalek vergroot en lastiger te beheersen is.", correct: true }
        ]
      },
      {
        prompt: "Je print een klantdocument voor een eenmalige taak. Wat is daarna de juiste stap?",
        choices: [
          { text: "Het tot het einde van de dag in de printerlade laten liggen.", correct: false },
          { text: "Het direct meenemen en vernietigen als het niet meer nodig is.", correct: true },
          { text: "Het naast de printer leggen voor later.", correct: false },
          { text: "Het mee naar huis nemen in je tas.", correct: false }
        ]
      },
      {
        prompt: "Welke opslaglocatie is het beste voor actieve zakelijke bestanden?",
        choices: [
          { text: "Een persoonlijke USB-stick.", correct: false },
          { text: "Een map op een privé-laptop.", correct: false },
          { text: "Het goedgekeurde bedrijfssysteem met gecontroleerde toegang.", correct: true },
          { text: "Een privé-cloudmap die alleen jij kunt zien.", correct: false }
        ]
      },
      {
        prompt: "Wat is de veiligste gewoonte voor klantbijlagen in e-mail?",
        choices: [
          { text: "Alle bijlagen voor altijd in je mailbox bewaren voor later.", correct: false },
          { text: "De benodigde informatie in het juiste systeem zetten en extra kopieën verwijderen zodra ze niet meer nodig zijn.", correct: true },
          { text: "Bijlagen doorsturen naar de privé-mail van een collega voor bewaring.", correct: false },
          { text: "Alle bijlagen opslaan in Downloads omdat dat makkelijk zoekt.", correct: false }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 3",
    title: "Wachtwoorden en MFA beschermen de voordeur",
    duration: "3 min",
    summary:
      "Goed wachtwoordbeheer gaat niet over geheugen, maar over unieke inloggegevens, Passbolt en het niet delen van toegang.",
    explanation:
      "Wachtwoorden worden zwak wanneer ze worden hergebruikt, opgeschreven, gedeeld via chat of gekopieerd naar spreadsheets. Het beleid is duidelijk: gebruik de wachtwoordmanager, wijzig standaardwachtwoorden bij het eerste gebruik, houd inloggegevens persoonlijk en gebruik tweestapsverificatie waar mogelijk.",
    rules: [
      "Gebruik een wachtwoordmanager om wachtwoorden te registreren en te genereren; Passbolt is het goedgekeurde proces.",
      "Tijdelijke of standaardwachtwoorden moeten bij het eerste gebruik worden vervangen.",
      "Wachtwoorden zijn persoonlijk en mogen niet worden gedeeld, ook niet met collega's.",
      "Gebruik waar mogelijk tweestapsverificatie.",
      "Sla wachtwoorden niet op papier of in losse bestanden op."
    ],
    risks: [
      "Wachtwoorden hergebruiken over meerdere tools en accounts",
      "Inloggegevens delen via WhatsApp, e-mail of mondeling",
      "Wachtwoorden opschrijven op post-its of in notitieboekjes",
      "Zwakke tijdelijke wachtwoorden die te lang actief blijven"
    ],
    image: "assets/images/passwords.svg",
    questions: [
      {
        prompt: "Een teamgenoot vraagt om jouw wachtwoord 'alleen voor vandaag'. Wat is het juiste antwoord?",
        choices: [
          { text: "Nee. Gebruik in plaats daarvan het goedgekeurde toegangsproces.", correct: true },
          { text: "Ja, als je de collega vertrouwt.", correct: false },
          { text: "Ja, maar alleen via WhatsApp.", correct: false },
          { text: "Ja, als je het later weer verandert.", correct: false }
        ]
      },
      {
        prompt: "Wat is de beste inrichting voor een nieuw werkaccount?",
        choices: [
          { text: "Het wachtwoord van je e-mail hergebruiken om het simpel te houden.", correct: false },
          { text: "Het wachtwoord opschrijven tot je het uit je hoofd kent.", correct: false },
          { text: "Een uniek wachtwoord genereren in Passbolt en MFA inschakelen als dat kan.", correct: true },
          { text: "Eén gedeeld teamwachtwoord gebruiken zodat iedereen elkaar kan helpen.", correct: false }
        ]
      },
      {
        prompt: "Waarom zijn gedeelde wachtwoorden een beveiligingsprobleem?",
        choices: [
          { text: "Omdat je dan niet meer kunt zien wie het account echt heeft gebruikt.", correct: true },
          { text: "Omdat wachtwoorden niet meer werken als twee mensen ze kennen.", correct: false },
          { text: "Omdat alleen managers wachtwoorden mogen delen.", correct: false },
          { text: "Omdat de wachtwoordmanager automatisch maar één gebruiker toestaat.", correct: false }
        ]
      },
      {
        prompt: "Wat moet er gebeuren met een standaardwachtwoord dat met software of hardware is meegeleverd?",
        choices: [
          { text: "Het moet bij het eerste gebruik worden gewijzigd.", correct: true },
          { text: "Het mag blijven staan als het apparaat op kantoor staat.", correct: false },
          { text: "Het moet voor het team worden opgeschreven.", correct: false },
          { text: "Het kan actief blijven als MFA later nog wordt ingericht.", correct: false }
        ]
      },
      {
        prompt: "Welke gewoonte verbetert wachtwoordbeveiliging dagelijks het meest?",
        choices: [
          { text: "Eén goed te onthouden wachtwoord voor alles gebruiken.", correct: false },
          { text: "Jezelf een lijst met wachtwoorden mailen.", correct: false },
          { text: "Wachtwoorden in browsernotities bewaren en later opruimen.", correct: false },
          { text: "Steeds de wachtwoordmanager gebruiken in plaats van snelle omwegen.", correct: true }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 4",
    title: "Vergrendel je pc altijd als je wegloopt",
    duration: "2 min",
    summary:
      "Een ontgrendeld scherm geeft in seconden toegang tot mail, bestanden, systemen en klantdata.",
    explanation:
      "Schermdiscipline is een van de eenvoudigste maatregelen om toe te passen. Het beschermt tegen meekijken, ongeautoriseerde toegang, bezoekers, gedeelde ruimtes en snel misbruik. Automatisch vergrendelen na vijf minuten is een vangnet. De hoofdregel is simpel: sta je op, dan vergrendel je je scherm.",
    rules: [
      "Vergrendel je scherm met een wachtwoord wanneer je je werkplek verlaat.",
      "Automatische schermbeveiliging na vijf minuten zonder activiteit moet zijn ingeschakeld.",
      "Kantoorruimte mag alleen onbeheerd worden achtergelaten als computers zijn vergrendeld en deuren gesloten zijn.",
      "Berg laptops aan het einde van de werkdag veilig op in je locker of neem ze veilig mee naar huis."
    ],
    risks: [
      "Bezoekers of collega's die klantinformatie op een open scherm zien",
      "Misbruik van een open sessie terwijl jij maar één minuut weg bent",
      "Vergaderruimtes en gedeelde bureaus die een vals gevoel van veiligheid geven",
      "Thuiswerken zonder dezelfde schermdiscipline"
    ],
    image: "assets/images/lock-screen.svg",
    questions: [
      {
        prompt: "Je loopt kort naar de printer. Wat moet je eerst doen?",
        choices: [
          { text: "Niets, want de automatische vergrendeling springt zo aan.", correct: false },
          { text: "Het beeldscherm uitzetten en de sessie open laten.", correct: false },
          { text: "Je scherm vergrendelen voordat je wegloopt.", correct: true },
          { text: "Een collega vragen om op je laptop te letten.", correct: false }
        ]
      },
      {
        prompt: "Waarom is schermdiscipline belangrijk in het dagelijks kantoorwerk?",
        choices: [
          { text: "Omdat iemand in de buurt heel snel misbruik kan maken van een open sessie.", correct: true },
          { text: "Omdat een vergrendeld scherm apparaten sneller maakt.", correct: false },
          { text: "Omdat alleen bezoekers een risico vormen.", correct: false },
          { text: "Omdat een open sessie mag zolang er geen klantbestand zichtbaar is.", correct: false }
        ]
      },
      {
        prompt: "Je loopt even uit een vergaderruimte waar nog andere mensen zijn. Wat is het veiligst?",
        choices: [
          { text: "De laptop vergrendelen voordat je de ruimte verlaat.", correct: true },
          { text: "De laptop open laten omdat het een interne ruimte is.", correct: false },
          { text: "De laptop half dichtklappen.", correct: false },
          { text: "Alle vensters minimaliseren zodat gevoelige informatie niet zichtbaar is.", correct: false }
        ]
      },
      {
        prompt: "Wat is de juiste rol van de automatische vergrendeling na vijf minuten?",
        choices: [
          { text: "Dat is de enige vergrendeling die je nodig hebt.", correct: false },
          { text: "Iets dat je uitzet als het onhandig voelt.", correct: false },
          { text: "Een instelling die alleen voor desktops op kantoor relevant is.", correct: false },
          { text: "Een vangnet als iemand het vergeet, niet de hoofdmaatregel.", correct: true }
        ]
      },
      {
        prompt: "Welke uitspraak past het best bij het beleid?",
        choices: [
          { text: "Alleen vergrendelen als er gevoelige bestanden open staan.", correct: false },
          { text: "Alleen vergrendelen aan het einde van de dag.", correct: false },
          { text: "Verlaat je je werkplek, dan vergrendel je je scherm altijd.", correct: true },
          { text: "Vergrendelen is optioneel als de deur van de ruimte dicht is.", correct: false }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 5",
    title: "Gebruik AI veilig en bewust",
    duration: "4 min",
    summary:
      "AI kan helpen bij het werk, maar mag nooit een verborgen kanaal worden voor klantdata, vertrouwelijke informatie of ongecontroleerde output.",
    explanation:
      "De bedrijfsprocedure staat AI toe als ondersteuning bij research, rapportages, communicatie en softwareontwikkeling, maar alleen met menselijke controle en goedgekeurde tools. De grens is duidelijk: geen vertrouwelijke bedrijfsinformatie, persoonsgegevens, klantgegevens, prijzen, gebruikersnamen of vergelijkbaar gevoelig materiaal invoeren zonder expliciete goedkeuring.",
    rules: [
      "Gebruik alleen AI-tools die zijn goedgekeurd door de Security Officer.",
      "Voer geen vertrouwelijke bedrijfsinformatie of persoonsgegevens in AI-tools in, tenzij daar expliciet toestemming voor is gegeven.",
      "Gebruik AI niet voor juridische of financiële beslissingen zonder menselijke controle.",
      "Sla gegenereerde content niet op in onbeveiligde omgevingen zoals publieke cloud zonder encryptie.",
      "Nieuwe AI-initiatieven moeten vooraf worden gemeld voor een risicoanalyse."
    ],
    risks: [
      "Klantnamen, adressen, klantnummers, prijzen of interne strategie in AI-tools plakken",
      "AI-output vertrouwen zonder die te controleren",
      "Documenten uploaden naar niet-goedgekeurde tools omdat dat snel is",
      "Aannemen dat verwijderde prompts of chats alle blootstelling ongedaan maken"
    ],
    image: "assets/images/ai-safe.svg",
    questions: [
      {
        prompt: "Je wilt AI gebruiken om een samenvatting te maken van een klantescalatie. Wat is acceptabel?",
        choices: [
          { text: "De volledige klantmailwisseling met namen en contractdetails plakken.", correct: false },
          { text: "De prijslijst uploaden zodat het antwoord preciezer wordt.", correct: false },
          { text: "Een opgeschoonde versie zonder herleidbare persoonsgegevens of vertrouwelijke details gebruiken en de uitkomst zelf controleren.", correct: true },
          { text: "AI eerst de ruwe klacht laten samenvatten en de namen daarna verwijderen.", correct: false }
        ]
      },
      {
        prompt: "Wat is de hoofdregel voordat je een nieuwe AI-werkwijze op het werk gebruikt?",
        choices: [
          { text: "Elke publieke AI-tool gebruiken als die populair is.", correct: false },
          { text: "Eerst gebruiken en pas later vragen of het mocht.", correct: false },
          { text: "Alleen toestemming vragen als de output naar een klant gaat.", correct: false },
          { text: "Controleren of de tool en het gebruik zijn goedgekeurd en zo nodig een risicoanalyse laten doen.", correct: true }
        ]
      },
      {
        prompt: "Waarom is 'het antwoord zag er goed uit' niet genoeg bij AI?",
        choices: [
          { text: "Omdat AI alleen door developers gebruikt mag worden.", correct: false },
          { text: "Omdat AI-output nog steeds menselijk gecontroleerd moet worden op juistheid, ethiek en impact.", correct: true },
          { text: "Omdat AI nooit op het werk gebruikt mag worden.", correct: false },
          { text: "Omdat tools elk antwoord altijd permanent opslaan.", correct: false }
        ]
      },
      {
        prompt: "Een collega zegt: 'Ik heb de AI-chat verwijderd, dus het is goed.' Wat is het juiste antwoord?",
        choices: [
          { text: "Dan is elke prompt veilig.", correct: false },
          { text: "Dat is alleen relevant voor beursgenoteerde bedrijven.", correct: false },
          { text: "Het probleem is de oorspronkelijke deling van gevoelige data, niet alleen wat er daarna gebeurt.", correct: true },
          { text: "Verwijderen is voldoende zolang de prompt werkgerelateerd was.", correct: false }
        ]
      },
      {
        prompt: "Welke uitspraak past het best bij een veilige AI-houding?",
        choices: [
          { text: "Gebruik AI als hulpmiddel, niet als ongecontroleerde opslagplaats voor bedrijfskennis.", correct: true },
          { text: "AI kan de controle vervangen als de prompt maar goed genoeg is.", correct: false },
          { text: "Alleen de output telt, niet de input.", correct: false },
          { text: "Als het model geavanceerd is, zijn gevoelige prompts acceptabel.", correct: false }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 6",
    title: "E-mail blijft een van de makkelijkste aanvalspaden",
    duration: "4 min",
    summary:
      "E-mailrisico gaat niet alleen over phishing. Het gaat ook over verkeerd adresseren, urgentie, spoofing, bijlagen en te snel handelen.",
    explanation:
      "Veilig e-mailgebruik betekent op het juiste moment vertragen. Controleer de afzender, de echte bestemming, de bijlage, de toon en de ontvangerslijst voordat je klikt of verzendt. Eén verkeerd adres of één gehaaste klik kan heel snel een datalek worden.",
    rules: [
      "E-mail is strikt voor zakelijk gebruik.",
      "Stuur e-mail alleen naar degene die die moet ontvangen en vermijd onnodige CC.",
      "Klik niet op links en download geen bestanden van onbekende of onbetrouwbare bronnen.",
      "Toegang tot e-mail op privé-apparaten vereist toestemming, wachtwoordbeveiliging en veilige configuratie.",
      "Meld verdachte e-mails, verdachte bestanden en mogelijke datalekken direct."
    ],
    risks: [
      "Gespoofte afzenders en urgente betaal- of loginverzoeken",
      "E-mails naar de verkeerde ontvanger door autoaanvullen",
      "Onverwachte bijlagen of links van bekende namen",
      "Zakelijke mail op privé-apparaten zonder de vereiste beveiliging"
    ],
    image: "assets/images/email-safe.svg",
    questions: [
      {
        prompt: "Je ontvangt een urgente factuurmail van een bekende partner, maar de bankgegevens zijn veranderd. Wat doe je?",
        choices: [
          { text: "In dezelfde e-mailthread antwoorden om bevestiging te vragen.", correct: false },
          { text: "Snel betalen om vertraging te voorkomen.", correct: false },
          { text: "Via een apart vertrouwd kanaal verifiëren en de verdachte mail intern melden.", correct: true },
          { text: "De mail naar meerdere collega's doorsturen om te vragen of iemand hem herkent.", correct: false }
        ]
      },
      {
        prompt: "Autoaanvullen zet een extra externe ontvanger in een e-mail met klantinformatie. Wat moet er gebeuren vóór verzending?",
        choices: [
          { text: "Toch verzenden, want die persoon negeert de mail waarschijnlijk wel.", correct: false },
          { text: "De persoon naar CC verplaatsen zodat het minder ernstig is.", correct: false },
          { text: "De onbedoelde ontvanger verwijderen en alle adressen opnieuw zorgvuldig controleren.", correct: true },
          { text: "De bestandsnaam van de bijlage aanpassen en verdergaan.", correct: false }
        ]
      },
      {
        prompt: "Wat is de veiligste reactie op een onverwachte bijlage van een bekende naam?",
        choices: [
          { text: "Openen, want je kent de afzender.", correct: false },
          { text: "Pauzeren en eerst verifiëren voordat je opent.", correct: true },
          { text: "Doorsturen naar een collega om te testen.", correct: false },
          { text: "Eerst downloaden en later scannen als het vreemd lijkt.", correct: false }
        ]
      },
      {
        prompt: "Je krijgt een Microsoft 365-waarschuwing dat je wachtwoord vandaag verloopt en dat je via een link moet inloggen. Wat is het veiligst?",
        choices: [
          { text: "Snel op de link klikken als de branding er goed uitziet.", correct: false },
          { text: "Zelf naar de officiële inlogpagina gaan in een nieuw browservenster en controleren of de melding echt is.", correct: true },
          { text: "Op de e-mail antwoorden en vragen of de melding legitiem is.", correct: false },
          { text: "De e-mail naar een collega doorsturen zodat die de link eerst kan testen.", correct: false }
        ]
      },
      {
        prompt: "Wat is de beste basishouding voordat je op een link in een e-mail klikt?",
        choices: [
          { text: "Als het logo klopt, kun je klikken.", correct: false },
          { text: "Eerst klikken en daarna pas beslissen.", correct: false },
          { text: "Controleren wie het stuurde, waar de link echt heen gaat en of het verzoek logisch is.", correct: true },
          { text: "Alleen links controleren als de afzender onbekend is.", correct: false }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 7",
    title: "Meld incidenten snel en duidelijk",
    duration: "2 min",
    summary:
      "Snel melden beperkt schade, beschermt klanten en geeft het bedrijf tijd om goed in te grijpen.",
    explanation:
      "Een vertraging in melden veroorzaakt vaak meer schade dan de oorspronkelijke fout. Ons responseplan leunt op snelle escalatie: wat is er gebeurd, wanneer gebeurde het en welke data of systemen kunnen betrokken zijn? Je hoeft geen volledig onderzoek af te ronden voordat je meldt. Snelheid en de eerste bruikbare feiten zijn het belangrijkst.",
    rules: [
      "Elke vermoedelijke inbreuk moet direct aan de Security Officer worden gemeld.",
      "Verlies of diefstal van een gegevensdrager moet direct worden gemeld.",
      "De eerste melding moet tijd en datum, betrokken systemen of data en eerste observaties bevatten.",
      "Elk incident moet worden geregistreerd in het incidenten- en afwijkingenoverzicht."
    ],
    risks: [
      "Wachten omdat je hoopt dat het vanzelf verdwijnt",
      "Bewijs verwijderen voordat je meldt",
      "Te laat melden voor beheersing of verplichte meldingen",
      "Een vage melding doen zonder eerste bruikbare feiten"
    ],
    image: "assets/images/incident-reporting.svg",
    questions: [
      {
        prompt: "Wat is de eerste regel als je een datalek of ander serieus beveiligingsprobleem vermoedt?",
        choices: [
          { text: "Wachten tot je de volledige oorzaak weet.", correct: false },
          { text: "Het stil oplossen en alleen melden als het erger wordt.", correct: false },
          { text: "Het direct melden aan de Security Officer.", correct: true },
          { text: "Eerst bewijs verwijderen zodat de melding netter is.", correct: false }
        ]
      },
      {
        prompt: "Wat hoort in de eerste incidentmelding thuis?",
        choices: [
          { text: "Alleen je persoonlijke mening over wie de fout maakte.", correct: false },
          { text: "Niets totdat je van alles screenshots hebt.", correct: false },
          { text: "Tijd, datum, betrokken systemen of data en eerste observaties.", correct: true },
          { text: "Alleen de uiteindelijke bedrijfsimpact nadat management die heeft beoordeeld.", correct: false }
        ]
      },
      {
        prompt: "Waarom is vertraging zo gevaarlijk bij incidentafhandeling?",
        choices: [
          { text: "Omdat meldingen alleen tijdens kantooruren mogen.", correct: false },
          { text: "Omdat alleen technische incidenten ertoe doen.", correct: false },
          { text: "Omdat meer tijd kan betekenen: meer verspreiding, meer blootstelling en minder ruimte om in te grijpen.", correct: true },
          { text: "Omdat management kortere meldingen prettiger vindt.", correct: false }
        ]
      },
      {
        prompt: "Een apparaat met bedrijfstoegang is kwijt. Wat is de juiste actie?",
        choices: [
          { text: "Eén dag wachten voor het geval het nog opduikt.", correct: false },
          { text: "Het alleen informeel aan een collega vertellen.", correct: false },
          { text: "Het direct melden zodat toegang kan worden geblokkeerd en vervolgacties kunnen starten.", correct: true },
          { text: "Zelf op afstand uitloggen en de melding overslaan.", correct: false }
        ]
      },
      {
        prompt: "Wat is de beste afsluitende gewoonte na deze training?",
        choices: [
          { text: "Als het klein voelt, houd het dan stil.", correct: false },
          { text: "Alleen iets melden als je zeker weet dat het ernstig is.", correct: false },
          { text: "Vertrouwen op je geheugen en geschreven processtappen vermijden.", correct: false },
          { text: "Bij twijfel: stoppen, verifiëren en vroeg melden.", correct: true }
        ]
      }
    ]
  },
  {
    kicker: "Onderwerp 8",
    title: "Lees en volg de SLG-beveiligingsregels",
    duration: "2 min",
    summary:
      "Deze training helpt, maar de officiële SLG-beveiligingsregels blijven de basis die iedere medewerker moet lezen en volgen.",
    explanation:
      "Awarenesssessies zorgen voor gedeeld begrip, maar de formele bedrijfsregels blijven de bron die je moet kennen en toepassen in je dagelijkse werk. Lees de Smart Locking Group-beveiligingsregels zorgvuldig, stel vragen als iets onduidelijk is en behandel ze als onderdeel van je normale werkproces.",
    rules: [
      "Lees de Smart Locking Group-beveiligingsregels en gebruik die als basis voor dagelijks gedrag.",
      "Pas de regels toe voor schermvergrendeling, e-mailgebruik, wachtwoorden, klantdata, thuiswerken en incidentmelding.",
      "Is een regel onduidelijk, vraag dan je manager of de Security Officer om uitleg voordat je handelt.",
      "Bedenk geen eigen snelkoppeling als de SLG-regel al bestaat."
    ],
    risks: [
      "De training onthouden maar de echte bedrijfsregel niet kennen",
      "Persoonlijke gewoontes gebruiken in plaats van het goedgekeurde SLG-proces",
      "Uitzonderingen maken omdat een regel onhandig voelt",
      "Aannemen dat informeel advies van een collega de geschreven policy vervangt"
    ],
    image: "assets/images/read-rules.svg",
    questions: [
      {
        prompt: "Wat moet je na deze training doen als je niet zeker weet hoe een SLG-regel in de praktijk moet worden toegepast?",
        choices: [
          { text: "Je eigen voorkeur volgen als het risico laag lijkt.", correct: false },
          { text: "Je manager of de Security Officer om uitleg vragen voordat je handelt.", correct: true },
          { text: "Wachten tot iemand je later corrigeert.", correct: false },
          { text: "Doen wat een collega meestal doet.", correct: false }
        ]
      },
      {
        prompt: "Waarom is het belangrijk om de echte SLG-beveiligingsregels te lezen en niet alleen op de training te vertrouwen?",
        choices: [
          { text: "Omdat de geschreven regels de formele basis zijn voor hoe we werken.", correct: true },
          { text: "Omdat alleen de geschreven regels tellen en awarenesstraining geen waarde heeft.", correct: false },
          { text: "Omdat de regels alleen voor managers gelden tenzij ze breder gedeeld worden.", correct: false },
          { text: "Omdat het lezen van de regels incidentmelding overbodig maakt.", correct: false }
        ]
      },
      {
        prompt: "Welke aanpak past het best bij de juiste beveiligingshouding na deze sessie?",
        choices: [
          { text: "De training gebruiken als geheugensteun en de SLG-regels als officiële bron.", correct: true },
          { text: "Alleen de delen van de regels gebruiken die in jouw rol het makkelijkst zijn.", correct: false },
          { text: "De trainingsslides belangrijker vinden dan de geschreven regels.", correct: false },
          { text: "Aannemen dat dagelijkse praktijk genoeg is, ook als die afwijkt van de regels.", correct: false }
        ]
      },
      {
        prompt: "Een collega zegt: 'Ik weet dat de regel iets anders zegt, maar wij doen het altijd zo.' Wat is dan het beste antwoord?",
        choices: [
          { text: "De collega volgen, want ervaring is belangrijker dan beleid.", correct: false },
          { text: "Het verschil negeren totdat er een incident gebeurt.", correct: false },
          { text: "De geschreven SLG-regel controleren en zo nodig het juiste proces laten verduidelijken.", correct: true },
          { text: "Ondertussen je eigen workaround bedenken.", correct: false }
        ]
      },
      {
        prompt: "Wat is de duidelijkste kernboodschap van dit laatste onderwerp?",
        choices: [
          { text: "Deze training vervangt het lezen van de formele SLG-beveiligingsregels.", correct: false },
          { text: "Alleen IT-medewerkers hoeven de geschreven regels echt goed te kennen.", correct: false },
          { text: "De geschreven SLG-regels moeten worden gelezen, begrepen en dagelijks toegepast.", correct: true },
          { text: "Als je de training één keer hebt gevolgd, zijn de regels alleen nog optioneel naslagwerk.", correct: false }
        ]
      }
    ]
  }
];

let currentTopicIndex = 0;
