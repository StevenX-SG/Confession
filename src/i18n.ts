// Lightweight static i18n for the Midnight Romance confession app.
//
// All UI strings are pre-translated here so language switching is instant,
// works offline, needs no API key, and never triggers a page reload.
//
// The default display mode is 'en-zh' (English + Chinese shown together, as the
// app originally did). Selecting any single language shows only that language.

export type LanguageCode = 'en' | 'zh' | 'es' | 'fr' | 'it' | 'pt' | 'de' | 'id';
export type DisplayMode = 'en-zh' | LanguageCode;

export interface Translation {
  disclaimerTitle: string;
  disclaimerLine1: string;
  disclaimerLine2: string;
  disclaimerLine3: string;
  continue: string;
  leave: string;
  next: string;
  accept: string;
  happy: string;
  sad: string;
  /** The confession/proposal lines shown in the carousel, in order. */
  dialogues: string[];
  /** The 4 progressive "No" button stage labels, in order. */
  noStages: [string, string, string, string];

  // Sender gender selection + gendered partner terms
  /** Term substituted into `{partner}` when the sender is a man (asks a girlfriend). */
  partnerGirlfriend: string;
  /** Term substituted into `{partner}` when the sender is a woman (asks a boyfriend). */
  partnerBoyfriend: string;
  /** Label for the sender's gender selector, e.g. "I am…". */
  genderLabel: string;
  /** Gender option: man. */
  genderMan: string;
  /** Gender option: woman. */
  genderWoman: string;
  /** Optional feminine form of the happy message for gendered languages (e.g. FR). */
  happyFemale?: string;

  // Creation screen
  creationTitle: string;
  senderNameLabel: string;
  recipientNameLabel: string;
  generateLink: string;
  linkCopied: string;
  copyLink: string;

  // Calendar
  calendarTitle: string;
  calendarSubtitle: string;
  monthNames: string[];      // 12 month names
  dayHeaders: string[];      // 7 day abbreviations (Sun-Sat)
  selectedDateLabel: string; // "Selected: {date}"

  // Venue
  venueTitle: string;
  /** Creation-screen label for the sender's country selector. */
  venueRegionLabel: string;
  customVenueLabel: string;
  customVenuePlaceholder: string;
  meetingSpotLabel: string;
  meetingSpotPlaceholder: string;
  meetingPointLabel: string;

  // Confirmation
  confirmTitle: string;
  confirmDate: string;
  confirmVenue: string;
  confirmButton: string;

  // Date Pass
  datePassTitle: string;
  dateConfirmedBadge: string;
  shareButton: string;

  // Evil Mode celebration (shown when a `mode=evil` link's final "No" is clicked).
  // The recipient never knows the mode exists — this is the cheeky payoff screen.
  /** Big celebratory heading, e.g. "YAY!!!". */
  evilYayTitle: string;
  /** Main happy line, e.g. "I'm so glad you said yes." */
  evilGladYes: string;
  /** Cheeky wink at what they actually clicked. */
  evilCheeky: string;
  /** Optional supporting line thanking them for not rejecting. */
  evilThankYou: string;

  // Creation screen — Evil Mode toggle (sender-only, never shown to recipient).
  /** Label for the Evil Mode toggle, e.g. "Enable Evil Mode 😈". */
  evilModeLabel: string;
  /** Short helper text explaining what Evil Mode does. */
  evilModeHint: string;
}

export const translations: Record<LanguageCode, Translation> = {
  en: {
    disclaimerTitle: 'Disclaimer',
    disclaimerLine1: 'This webpage is harmless.',
    disclaimerLine2: 'Someone sent you this because they wanted to be honest with you.',
    disclaimerLine3: 'If you\'re comfortable, continue below.',
    continue: 'Continue',
    leave: 'Leave',
    next: 'Next',
    accept: 'Yes',
    happy: '\u2764\uFE0F Yay! I\'m so happy!',
    sad: '\uD83D\uDC94 Oh no...',
    dialogues: [
      'Actually\u2026 I\'ve been thinking about this for a long time.',
      'I don\'t know when it started, but I realized I care about you more than I should.',
      '[Their Name]\u2026 I\'m scared this might make things awkward between us.',
      'But I still have to know\u2026',
      'So, [Their Name]\u2026 will you be my {partner}?',
    ],
    partnerGirlfriend: 'girlfriend',
    partnerBoyfriend: 'boyfriend',
    genderLabel: 'I am\u2026',
    genderMan: 'A man',
    genderWoman: 'A woman',
    noStages: ['No', 'Are you sure?', 'Please say yes...', 'Please...'],
    creationTitle: 'Create Your Proposal',
    venueRegionLabel: 'Your country (sets venue ideas)',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'When shall we make our first memory? \u2728',
    calendarSubtitle: 'Choose a day that feels special to you.',
    meetingSpotLabel: 'Where exactly should we meet? (optional)',
    meetingSpotPlaceholder: 'e.g. Main entrance, drop-off point',
    meetingPointLabel: 'Meeting point',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    dayHeaders: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    selectedDateLabel: 'Selected: {date}',
    venueTitle: 'Where should we go?',
    customVenueLabel: 'Custom venue',
    customVenuePlaceholder: 'Enter a venue...',
    confirmTitle: 'Confirm your date',
    confirmDate: 'Date',
    confirmVenue: 'Venue',
    confirmButton: 'Confirm Date',
    datePassTitle: 'Date Pass',
    dateConfirmedBadge: 'DATE CONFIRMED',
    shareButton: 'Share',
    evilYayTitle: 'YAY!!!',
    evilGladYes: 'I\u2019m so glad you said yes.',
    evilCheeky: 'We both know what you clicked, but let\u2019s not talk about that. \uD83D\uDE08',
    evilThankYou: 'Thank you for not rejecting me \uD83D\uDE2D',
    evilModeLabel: 'Enable Evil Mode \uD83D\uDE08',
    evilModeHint: 'Even if they click \u201CNo\u201D, they\u2019ll still end up saying yes. They\u2019ll never know.',
  },
  zh: {
    disclaimerTitle: '\u58F0\u660E',
    disclaimerLine1: '\u8FD9\u4E2A\u7F51\u9875\u662F\u65E0\u5BB3\u7684\u3002',
    disclaimerLine2: '\u6709\u4EBA\u628A\u5B83\u53D1\u7ED9\u4F60\uFF0C\u662F\u56E0\u4E3A\u60F3\u5BF9\u4F60\u5766\u8BDA\u3002',
    disclaimerLine3: '\u5982\u679C\u4F60\u613F\u610F\uFF0C\u8BF7\u70B9\u51FB\u4E0B\u65B9\u7EE7\u7EED\u3002',
    continue: '\u7EE7\u7EED',
    leave: '\u79BB\u5F00',
    next: '\u4E0B\u4E00\u6B65',
    accept: '\u613F\u610F',
    happy: '\u2764\uFE0F \u592A\u597D\u4E86\uFF01\u6211\u597D\u5F00\u5FC3\uFF01',
    sad: '\uD83D\uDC94 \u54E6\u4E0D\u2026',
    dialogues: [
      '\u5176\u5B9E\u2026\u6211\u4E00\u76F4\u5728\u60F3\u8FD9\u4EF6\u4E8B\u3002',
      '\u6211\u4E0D\u77E5\u9053\u4ECE\u4EC0\u4E48\u65F6\u5019\u5F00\u59CB\uFF0C\u6211\u53D1\u73B0\u6211\u5BF9\u4F60\u7684\u5728\u4E4E\u5DF2\u7ECF\u8D85\u8FC7\u4E86\u6211\u7684\u9884\u671F\u3002',
      '[\u540D\u5B57]\u2026\u6211\u5F88\u5BB3\u6015\u8FD9\u6837\u4F1A\u8BA9\u6211\u4EEC\u4E4B\u95F4\u53D8\u5F97\u5C34\u5C2C\u3002',
      '\u4F46\u6211\u8FD8\u662F\u60F3\u77E5\u9053\u2026',
      '\u6240\u4EE5\uFF0C[\u540D\u5B57]\u2026\u4F60\u613F\u610F\u505A\u6211\u7684{partner}\u5417\uFF1F',
    ],
    partnerGirlfriend: '\u5973\u670B\u53CB',
    partnerBoyfriend: '\u7537\u670B\u53CB',
    genderLabel: '\u6211\u662F\u2026',
    genderMan: '\u7537\u751F',
    genderWoman: '\u5973\u751F',
    noStages: ['\u4E0D', '\u4F60\u786E\u5B9A\u5417\uFF1F', '\u8BF7\u8BF4\u597D...', '\u6C42\u4F60\u4E86...'],
    creationTitle: '\u521B\u5EFA\u4F60\u7684\u544A\u767D',
    venueRegionLabel: '\u4F60\u7684\u56FD\u5BB6\uFF08\u7528\u4E8E\u573A\u5730\u5EFA\u8BAE\uFF09',
    senderNameLabel: '\u4F60\u7684\u540D\u5B57',
    recipientNameLabel: 'TA\u7684\u540D\u5B57',
    generateLink: '\u751F\u6210\u94FE\u63A5',
    linkCopied: '\u2713 \u94FE\u63A5\u5DF2\u590D\u5236\uFF01',
    copyLink: '\u590D\u5236\u94FE\u63A5',
    calendarTitle: '我们何时，一起写下第一个回忆？\u2728',
    calendarSubtitle: '选一个对你来说特别的日子。',
    meetingSpotLabel: '具体在哪里见面？（可选）',
    meetingSpotPlaceholder: '例如：正门、落客点',
    meetingPointLabel: '见面地点',
    monthNames: [
      '\u4E00\u6708', '\u4E8C\u6708', '\u4E09\u6708', '\u56DB\u6708', '\u4E94\u6708', '\u516D\u6708',
      '\u4E03\u6708', '\u516B\u6708', '\u4E5D\u6708', '\u5341\u6708', '\u5341\u4E00\u6708', '\u5341\u4E8C\u6708',
    ],
    dayHeaders: ['\u65E5', '\u4E00', '\u4E8C', '\u4E09', '\u56DB', '\u4E94', '\u516D'],
    selectedDateLabel: '\u5DF2\u9009\uFF1A{date}',
    venueTitle: '\u6211\u4EEC\u53BB\u54EA\u91CC\uFF1F',
    customVenueLabel: '\u81EA\u5B9A\u4E49\u5730\u70B9',
    customVenuePlaceholder: '\u8F93\u5165\u4E00\u4E2A\u5730\u70B9\u2026',
    confirmTitle: '\u786E\u8BA4\u4F60\u7684\u7EA6\u4F1A',
    confirmDate: '\u65E5\u671F',
    confirmVenue: '\u5730\u70B9',
    confirmButton: '\u786E\u8BA4\u7EA6\u4F1A',
    datePassTitle: '\u7EA6\u4F1A\u901A\u884C\u8BC1',
    dateConfirmedBadge: '\u7EA6\u4F1A\u5DF2\u786E\u8BA4',
    shareButton: '\u5206\u4EAB',
    evilYayTitle: '\u8036\uFF01\uFF01\uFF01',
    evilGladYes: '\u6211\u771F\u9AD8\u5174\u4F60\u7B54\u5E94\u4E86\u3002',
    evilCheeky: '\u6211\u4EEC\u90FD\u77E5\u9053\u4F60\u521A\u521A\u70B9\u4E86\u4EC0\u4E48\uFF0C\u4E0D\u8FC7\u5C31\u4E0D\u63D0\u4E86\u3002\uD83D\uDE08',
    evilThankYou: '\u8C22\u8C22\u4F60\u6CA1\u6709\u62D2\u7EDD\u6211 \uD83D\uDE2D',
    evilModeLabel: '\u5F00\u542F\u6076\u9B54\u6A21\u5F0F \uD83D\uDE08',
    evilModeHint: '\u5373\u4F7F TA \u70B9\u201C\u4E0D\u201D\uFF0C\u6700\u540E\u4E5F\u4F1A\u53D8\u6210\u613F\u610F\u3002TA \u6C38\u8FDC\u4E0D\u4F1A\u77E5\u9053\u3002',
  },
  es: {
    disclaimerTitle: 'Aviso',
    disclaimerLine1: 'Esta p\u00E1gina web es inofensiva.',
    disclaimerLine2: 'Alguien te la envi\u00F3 porque quer\u00EDa ser honesto contigo.',
    disclaimerLine3: 'Si te sientes c\u00F3modo, contin\u00FAa abajo.',
    continue: 'Continuar',
    leave: 'Salir',
    next: 'Siguiente',
    accept: 'S\u00ED',
    happy: '\u2764\uFE0F \u00A1Yupi! \u00A1Estoy muy feliz!',
    sad: '\uD83D\uDC94 Oh no...',
    dialogues: [
      'La verdad\u2026 llevo mucho tiempo pensando en esto.',
      'No s\u00E9 cu\u00E1ndo empez\u00F3, pero me di cuenta de que me importas m\u00E1s de lo que deber\u00EDa.',
      '[Su nombre]\u2026 Tengo miedo de que esto haga las cosas inc\u00F3modas entre nosotros.',
      'Pero a\u00FAn necesito saberlo\u2026',
      'Entonces, [Su nombre]\u2026 \u00BFquieres ser mi {partner}?',
    ],
    partnerGirlfriend: 'novia',
    partnerBoyfriend: 'novio',
    genderLabel: 'Soy\u2026',
    genderMan: 'Un hombre',
    genderWoman: 'Una mujer',
    noStages: ['No', '\u00BFEst\u00E1s segura?', 'Por favor di que s\u00ED...', 'Por favor...'],
    creationTitle: 'Crea tu propuesta',
    venueRegionLabel: 'Tu pa\u00EDs (ideas de lugares)',
    senderNameLabel: 'Tu nombre',
    recipientNameLabel: 'Su nombre',
    generateLink: 'Generar enlace',
    linkCopied: '\u2713 \u00A1Enlace copiado!',
    copyLink: 'Copiar enlace',
    calendarTitle: '\u00BFCu\u00E1ndo crearemos nuestro primer recuerdo? \u2728',
    calendarSubtitle: 'Elige un d\u00EDa que te parezca especial.',
    meetingSpotLabel: '\u00BFD\u00F3nde exactamente nos vemos? (opcional)',
    meetingSpotPlaceholder: 'p. ej. entrada principal, punto de encuentro',
    meetingPointLabel: 'Punto de encuentro',
    monthNames: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ],
    dayHeaders: ['dom', 'lun', 'mar', 'mi\u00E9', 'jue', 'vie', 's\u00E1b'],
    selectedDateLabel: 'Seleccionado: {date}',
    venueTitle: '\u00BFA d\u00F3nde vamos?',
    customVenueLabel: 'Lugar personalizado',
    customVenuePlaceholder: 'Escribe un lugar...',
    confirmTitle: 'Confirma tu cita',
    confirmDate: 'Fecha',
    confirmVenue: 'Lugar',
    confirmButton: 'Confirmar cita',
    datePassTitle: 'Pase de cita',
    dateConfirmedBadge: 'CITA CONFIRMADA',
    shareButton: 'Compartir',
    evilYayTitle: '\u00A1YUPI!!!',
    evilGladYes: 'Me alegra mucho que hayas dicho que s\u00ED.',
    evilCheeky: 'Ambos sabemos qu\u00E9 bot\u00F3n tocaste, pero mejor no hablemos de eso. \uD83D\uDE08',
    evilThankYou: 'Gracias por no rechazarme \uD83D\uDE2D',
    evilModeLabel: 'Activar Modo Malvado \uD83D\uDE08',
    evilModeHint: 'Aunque toquen "No", igual terminar\u00E1n diciendo que s\u00ED. Nunca lo sabr\u00E1n.',
  },
  fr: {
    disclaimerTitle: 'Avertissement',
    disclaimerLine1: 'Cette page web est inoffensive.',
    disclaimerLine2: 'Quelqu\u2019un te l\u2019a envoy\u00E9e parce qu\u2019il voulait \u00EAtre honn\u00EAte avec toi.',
    disclaimerLine3: 'Si tu te sens \u00E0 l\u2019aise, continue ci-dessous.',
    continue: 'Continuer',
    leave: 'Quitter',
    next: 'Suivant',
    accept: 'Oui',
    happy: '\u2764\uFE0F Youpi\u00A0! Je suis si heureux\u00A0!',
    sad: '\uD83D\uDC94 Oh non...',
    dialogues: [
      'En fait\u2026 j\u2019y pense depuis longtemps.',
      'Je ne sais pas quand \u00E7a a commenc\u00E9, mais j\u2019ai r\u00E9alis\u00E9 que je tiens \u00E0 toi plus que je ne le devrais.',
      '[Son nom]\u2026 J\u2019ai peur que \u00E7a rende les choses g\u00EAnantes entre nous.',
      'Mais j\u2019ai encore besoin de savoir\u2026',
      'Alors, [Son nom]\u2026 veux-tu \u00EAtre {partner}\u00A0?',
    ],
    partnerGirlfriend: 'ma petite amie',
    partnerBoyfriend: 'mon petit ami',
    genderLabel: 'Je suis\u2026',
    genderMan: 'Un homme',
    genderWoman: 'Une femme',
    happyFemale: '\u2764\uFE0F Youpi\u00A0! Je suis si heureuse\u00A0!',
    noStages: ['Non', 'Tu es s\u00FBre\u00A0?', 'Dis oui, s\u2019il te pla\u00EEt...', 'S\u2019il te pla\u00EEt...'],
    creationTitle: 'Cr\u00E9e ta demande',
    venueRegionLabel: 'Ton pays (id\u00E9es de lieux)',
    senderNameLabel: 'Ton nom',
    recipientNameLabel: 'Son nom',
    generateLink: 'G\u00E9n\u00E9rer le lien',
    linkCopied: '\u2713 Lien copi\u00E9\u00A0!',
    copyLink: 'Copier le lien',
    calendarTitle: 'Quand cr\u00E9erons-nous notre premier souvenir\u00A0? \u2728',
    calendarSubtitle: 'Choisis un jour qui te semble sp\u00E9cial.',
    meetingSpotLabel: 'O\u00F9 exactement doit-on se retrouver\u00A0? (facultatif)',
    meetingSpotPlaceholder: 'ex. entr\u00E9e principale, point de rendez-vous',
    meetingPointLabel: 'Point de rendez-vous',
    monthNames: [
      'janvier', 'f\u00E9vrier', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'ao\u00FBt', 'septembre', 'octobre', 'novembre', 'd\u00E9cembre',
    ],
    dayHeaders: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    selectedDateLabel: 'S\u00E9lectionn\u00E9\u00A0: {date}',
    venueTitle: 'O\u00F9 allons-nous\u00A0?',
    customVenueLabel: 'Lieu personnalis\u00E9',
    customVenuePlaceholder: 'Saisis un lieu...',
    confirmTitle: 'Confirme ton rendez-vous',
    confirmDate: 'Date',
    confirmVenue: 'Lieu',
    confirmButton: 'Confirmer le rendez-vous',
    datePassTitle: 'Pass Rendez-vous',
    dateConfirmedBadge: 'RENDEZ-VOUS CONFIRM\u00C9',
    shareButton: 'Partager',
    evilYayTitle: 'YOUPI\u00A0!!!',
    evilGladYes: 'Je suis si heureux que tu aies dit oui.',
    evilCheeky: 'On sait tous les deux sur quoi tu as cliqu\u00E9, mais n\u2019en parlons pas. \uD83D\uDE08',
    evilThankYou: 'Merci de ne pas m\u2019avoir rejet\u00E9 \uD83D\uDE2D',
    evilModeLabel: 'Activer le Mode Diabolique \uD83D\uDE08',
    evilModeHint: 'M\u00EAme s\u2019ils cliquent sur \u00AB\u00A0Non\u00A0\u00BB, ils finiront par dire oui. Ils ne le sauront jamais.',
  },
  it: {
    disclaimerTitle: 'Avviso',
    disclaimerLine1: 'Questa pagina web \u00E8 innocua.',
    disclaimerLine2: 'Qualcuno te l\u2019ha inviata perch\u00E9 voleva essere sincero con te.',
    disclaimerLine3: 'Se ti senti a tuo agio, continua qui sotto.',
    continue: 'Continua',
    leave: 'Esci',
    next: 'Avanti',
    accept: 'S\u00EC',
    happy: '\u2764\uFE0F Evviva! Sono cos\u00EC felice!',
    sad: '\uD83D\uDC94 Oh no...',
    dialogues: [
      'A dire il vero\u2026 ci penso da molto tempo.',
      'Non so quando sia iniziato, ma ho capito che tengo a te pi\u00F9 di quanto dovrei.',
      '[Il suo nome]\u2026 Ho paura che questo possa rendere le cose imbarazzanti tra noi.',
      'Ma ho ancora bisogno di saperlo\u2026',
      'Allora, [Il suo nome]\u2026 vuoi essere {partner}?',
    ],
    partnerGirlfriend: 'la mia ragazza',
    partnerBoyfriend: 'il mio ragazzo',
    genderLabel: 'Sono\u2026',
    genderMan: 'Un uomo',
    genderWoman: 'Una donna',
    noStages: ['No', 'Sei sicura?', 'Per favore d\u00EC di s\u00EC...', 'Ti prego...'],
    creationTitle: 'Crea la tua proposta',
    venueRegionLabel: 'Il tuo paese (idee sui luoghi)',
    senderNameLabel: 'Il tuo nome',
    recipientNameLabel: 'Il suo nome',
    generateLink: 'Genera link',
    linkCopied: '\u2713 Link copiato!',
    copyLink: 'Copia link',
    calendarTitle: 'Quando creeremo il nostro primo ricordo? \u2728',
    calendarSubtitle: 'Scegli un giorno che senti speciale.',
    meetingSpotLabel: 'Dove esattamente ci incontriamo? (facoltativo)',
    meetingSpotPlaceholder: 'es. ingresso principale, punto di ritrovo',
    meetingPointLabel: 'Punto d\u2019incontro',
    monthNames: [
      'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
    ],
    dayHeaders: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
    selectedDateLabel: 'Selezionato: {date}',
    venueTitle: 'Dove andiamo?',
    customVenueLabel: 'Luogo personalizzato',
    customVenuePlaceholder: 'Inserisci un luogo...',
    confirmTitle: 'Conferma il tuo appuntamento',
    confirmDate: 'Data',
    confirmVenue: 'Luogo',
    confirmButton: 'Conferma appuntamento',
    datePassTitle: 'Pass Appuntamento',
    dateConfirmedBadge: 'APPUNTAMENTO CONFERMATO',
    shareButton: 'Condividi',
    evilYayTitle: 'EVVIVA!!!',
    evilGladYes: 'Sono cos\u00EC felice che tu abbia detto di s\u00EC.',
    evilCheeky: 'Sappiamo entrambi cosa hai cliccato, ma non parliamone. \uD83D\uDE08',
    evilThankYou: 'Grazie per non avermi rifiutato \uD83D\uDE2D',
    evilModeLabel: 'Attiva Modalit\u00E0 Malvagia \uD83D\uDE08',
    evilModeHint: 'Anche se cliccano "No", finiranno comunque per dire di s\u00EC. Non lo sapranno mai.',
  },
  pt: {
    disclaimerTitle: 'Aviso',
    disclaimerLine1: 'Esta p\u00E1gina \u00E9 inofensiva.',
    disclaimerLine2: 'Algu\u00E9m enviou isto para voc\u00EA porque queria ser sincero com voc\u00EA.',
    disclaimerLine3: 'Se voc\u00EA se sentir confort\u00E1vel, continue abaixo.',
    continue: 'Continuar',
    leave: 'Sair',
    next: 'Pr\u00F3ximo',
    accept: 'Sim',
    happy: '\u2764\uFE0F Eba! Estou t\u00E3o feliz!',
    sad: '\uD83D\uDC94 Ah n\u00E3o...',
    dialogues: [
      'Na verdade\u2026 eu venho pensando nisso h\u00E1 muito tempo.',
      'N\u00E3o sei quando come\u00E7ou, mas percebi que me importo com voc\u00EA mais do que deveria.',
      '[Nome dela]\u2026 Tenho medo de que isso deixe as coisas estranhas entre n\u00F3s.',
      'Mas eu ainda preciso saber\u2026',
      'Ent\u00E3o, [Nome dela]\u2026 voc\u00EA quer ser {partner}?',
    ],
    partnerGirlfriend: 'minha namorada',
    partnerBoyfriend: 'meu namorado',
    genderLabel: 'Eu sou\u2026',
    genderMan: 'Um homem',
    genderWoman: 'Uma mulher',
    noStages: ['N\u00E3o', 'Voc\u00EA tem certeza?', 'Por favor, diga sim...', 'Por favor...'],
    creationTitle: 'Crie seu pedido',
    venueRegionLabel: 'Seu pa\u00EDs (sugest\u00F5es de locais)',
    senderNameLabel: 'Seu nome',
    recipientNameLabel: 'Nome da pessoa',
    generateLink: 'Gerar link',
    linkCopied: '\u2713 Link copiado!',
    copyLink: 'Copiar link',
    calendarTitle: 'Quando vamos criar nossa primeira mem\u00F3ria? \u2728',
    calendarSubtitle: 'Escolha um dia que seja especial para voc\u00EA.',
    meetingSpotLabel: 'Onde exatamente vamos nos encontrar? (opcional)',
    meetingSpotPlaceholder: 'ex.: entrada principal, ponto de encontro',
    meetingPointLabel: 'Ponto de encontro',
    monthNames: [
      'janeiro', 'fevereiro', 'mar\u00E7o', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ],
    dayHeaders: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 's\u00E1b'],
    selectedDateLabel: 'Selecionado: {date}',
    venueTitle: 'Para onde vamos?',
    customVenueLabel: 'Local personalizado',
    customVenuePlaceholder: 'Digite um local...',
    confirmTitle: 'Confirme seu encontro',
    confirmDate: 'Data',
    confirmVenue: 'Local',
    confirmButton: 'Confirmar encontro',
    datePassTitle: 'Passe do Encontro',
    dateConfirmedBadge: 'ENCONTRO CONFIRMADO',
    shareButton: 'Compartilhar',
    evilYayTitle: 'EBA!!!',
    evilGladYes: 'Estou t\u00E3o feliz que voc\u00EA disse sim.',
    evilCheeky: 'N\u00F3s dois sabemos no que voc\u00EA clicou, mas vamos deixar isso pra l\u00E1. \uD83D\uDE08',
    evilThankYou: 'Obrigado por n\u00E3o me rejeitar \uD83D\uDE2D',
    evilModeLabel: 'Ativar Modo Vil\u00E3o \uD83D\uDE08',
    evilModeHint: 'Mesmo que cliquem em "N\u00E3o", ainda v\u00E3o acabar dizendo sim. Nunca v\u00E3o saber.',
  },
  de: {
    disclaimerTitle: 'Hinweis',
    disclaimerLine1: 'Diese Webseite ist harmlos.',
    disclaimerLine2: 'Jemand hat sie dir geschickt, weil er ehrlich zu dir sein wollte.',
    disclaimerLine3: 'Wenn du dich wohlf\u00FChlst, mach unten weiter.',
    continue: 'Fortfahren',
    leave: 'Verlassen',
    next: 'Weiter',
    accept: 'Ja',
    happy: '\u2764\uFE0F Juhu! Ich bin so gl\u00FCcklich!',
    sad: '\uD83D\uDC94 Oh nein...',
    dialogues: [
      'Eigentlich\u2026 denke ich schon lange dar\u00FCber nach.',
      'Ich wei\u00DF nicht, wann es angefangen hat, aber mir wurde klar, dass du mir mehr bedeutest, als du solltest.',
      '[Ihr Name]\u2026 Ich habe Angst, dass es die Dinge zwischen uns unangenehm macht.',
      'Aber ich muss es trotzdem wissen\u2026',
      'Also, [Ihr Name]\u2026 m\u00F6chtest du {partner} sein?',
    ],
    partnerGirlfriend: 'meine Freundin',
    partnerBoyfriend: 'mein Freund',
    genderLabel: 'Ich bin\u2026',
    genderMan: 'Ein Mann',
    genderWoman: 'Eine Frau',
    noStages: ['Nein', 'Bist du sicher?', 'Bitte sag ja...', 'Bitte...'],
    creationTitle: 'Erstelle deinen Antrag',
    venueRegionLabel: 'Dein Land (Vorschl\u00E4ge f\u00FCr Orte)',
    senderNameLabel: 'Dein Name',
    recipientNameLabel: 'Ihr Name',
    generateLink: 'Link erstellen',
    linkCopied: '\u2713 Link kopiert!',
    copyLink: 'Link kopieren',
    calendarTitle: 'Wann schaffen wir unsere erste Erinnerung? \u2728',
    calendarSubtitle: 'W\u00E4hle einen Tag, der sich besonders anf\u00FChlt.',
    meetingSpotLabel: 'Wo genau sollen wir uns treffen? (optional)',
    meetingSpotPlaceholder: 'z.\u00A0B. Haupteingang, Treffpunkt',
    meetingPointLabel: 'Treffpunkt',
    monthNames: [
      'Januar', 'Februar', 'M\u00E4rz', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ],
    dayHeaders: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    selectedDateLabel: 'Ausgew\u00E4hlt: {date}',
    venueTitle: 'Wohin sollen wir gehen?',
    customVenueLabel: 'Eigener Ort',
    customVenuePlaceholder: 'Gib einen Ort ein...',
    confirmTitle: 'Best\u00E4tige dein Date',
    confirmDate: 'Datum',
    confirmVenue: 'Ort',
    confirmButton: 'Date best\u00E4tigen',
    datePassTitle: 'Date-Pass',
    dateConfirmedBadge: 'DATE BEST\u00C4TIGT',
    shareButton: 'Teilen',
    evilYayTitle: 'JUHU!!!',
    evilGladYes: 'Ich freue mich so, dass du ja gesagt hast.',
    evilCheeky: 'Wir wissen beide, was du geklickt hast, aber reden wir nicht dar\u00FCber. \uD83D\uDE08',
    evilThankYou: 'Danke, dass du mich nicht abgelehnt hast \uD83D\uDE2D',
    evilModeLabel: 'B\u00F6sen Modus aktivieren \uD83D\uDE08',
    evilModeHint: 'Selbst wenn sie auf \u201ENein\u201C klicken, sagen sie am Ende trotzdem ja. Sie werden es nie erfahren.',
  },
  id: {
    disclaimerTitle: 'Pemberitahuan',
    disclaimerLine1: 'Halaman web ini tidak berbahaya.',
    disclaimerLine2: 'Seseorang mengirimkannya kepadamu karena ingin jujur padamu.',
    disclaimerLine3: 'Jika kamu merasa nyaman, lanjutkan di bawah.',
    continue: 'Lanjutkan',
    leave: 'Keluar',
    next: 'Berikutnya',
    accept: 'Ya',
    happy: '\u2764\uFE0F Hore! Aku sangat senang!',
    sad: '\uD83D\uDC94 Oh tidak...',
    dialogues: [
      'Sebenarnya\u2026 aku sudah lama memikirkan ini.',
      'Aku tidak tahu kapan dimulai, tapi aku sadar aku peduli padamu lebih dari yang seharusnya.',
      '[Namanya]\u2026 Aku takut ini akan membuat canggung di antara kita.',
      'Tapi aku tetap harus tahu\u2026',
      'Jadi, [Namanya]\u2026 maukah kamu menjadi {partner}?',
    ],
    partnerGirlfriend: 'pacarku',
    partnerBoyfriend: 'pacarku',
    genderLabel: 'Saya seorang\u2026',
    genderMan: 'Laki-laki',
    genderWoman: 'Perempuan',
    noStages: ['Tidak', 'Apakah kamu yakin?', 'Tolong bilang iya...', 'Kumohon...'],
    creationTitle: 'Buat pernyataanmu',
    venueRegionLabel: 'Negaramu (saran tempat)',
    senderNameLabel: 'Namamu',
    recipientNameLabel: 'Nama dia',
    generateLink: 'Buat tautan',
    linkCopied: '\u2713 Tautan disalin!',
    copyLink: 'Salin tautan',
    calendarTitle: 'Kapan kita membuat kenangan pertama kita? \u2728',
    calendarSubtitle: 'Pilih hari yang terasa spesial untukmu.',
    meetingSpotLabel: 'Di mana tepatnya kita bertemu? (opsional)',
    meetingSpotPlaceholder: 'mis. pintu masuk utama, titik temu',
    meetingPointLabel: 'Titik temu',
    monthNames: [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ],
    dayHeaders: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    selectedDateLabel: 'Dipilih: {date}',
    venueTitle: 'Kita pergi ke mana?',
    customVenueLabel: 'Tempat khusus',
    customVenuePlaceholder: 'Masukkan tempat...',
    confirmTitle: 'Konfirmasi kencanmu',
    confirmDate: 'Tanggal',
    confirmVenue: 'Tempat',
    confirmButton: 'Konfirmasi kencan',
    datePassTitle: 'Tiket Kencan',
    dateConfirmedBadge: 'KENCAN DIKONFIRMASI',
    shareButton: 'Bagikan',
    evilYayTitle: 'HORE!!!',
    evilGladYes: 'Aku senang sekali kamu bilang iya.',
    evilCheeky: 'Kita berdua tahu kamu tadi klik apa, tapi jangan dibahas ya. \uD83D\uDE08',
    evilThankYou: 'Terima kasih sudah tidak menolakku \uD83D\uDE2D',
    evilModeLabel: 'Aktifkan Mode Jahat \uD83D\uDE08',
    evilModeHint: 'Meski mereka klik "Tidak", mereka tetap akan berkata iya. Mereka tidak akan pernah tahu.',
  },
};

/** Dropdown options in display order. 'en-zh' is the default combined view. */
export const LANGUAGE_OPTIONS: { value: DisplayMode; label: string }[] = [
  { value: 'en-zh', label: 'English + \u4E2D\u6587' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '\u4E2D\u6587' },
  { value: 'es', label: 'Espa\u00F1ol' },
  { value: 'fr', label: 'Fran\u00E7ais' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Portugu\u00EAs' },
  { value: 'de', label: 'Deutsch' },
  { value: 'id', label: 'Bahasa Indonesia' },
];

/**
 * Resolve the concrete language used for UI "chrome" (buttons, titles, etc.).
 * The combined 'en-zh' view uses English chrome while the dialogues are shown
 * in both English and Chinese.
 */
export function chromeLang(mode: DisplayMode): LanguageCode {
  return mode === 'en-zh' ? 'en' : mode;
}

/**
 * BCP 47 locale tag for date formatting (Intl.DateTimeFormat), so weekday and
 * month names in formatted dates (calendar aria-labels, "Selected: …", the
 * confirmation summary and the Date Pass) match the chosen language instead of
 * always falling back to English.
 */
export function dateLocale(mode: DisplayMode): string {
  const map: Record<LanguageCode, string> = {
    en: 'en-GB',
    zh: 'zh-CN',
    es: 'es-ES',
    fr: 'fr-FR',
    it: 'it-IT',
    pt: 'pt-BR',
    de: 'de-DE',
    id: 'id-ID',
  };
  return map[chromeLang(mode)];
}
