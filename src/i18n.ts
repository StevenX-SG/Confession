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
  /** The 4 confession/proposal lines shown in the carousel, in order. */
  dialogues: [string, string, string, string];
  /** The 4 progressive "No" button stage labels, in order. */
  noStages: [string, string, string, string];

  // Creation screen
  creationTitle: string;
  senderNameLabel: string;
  recipientNameLabel: string;
  generateLink: string;
  linkCopied: string;
  copyLink: string;

  // Calendar
  calendarTitle: string;
  monthNames: string[];      // 12 month names
  dayHeaders: string[];      // 7 day abbreviations (Sun-Sat)
  selectedDateLabel: string; // "Selected: {date}"

  // Venue
  venueTitle: string;
  customVenueLabel: string;
  customVenuePlaceholder: string;

  // Confirmation
  confirmTitle: string;
  confirmDate: string;
  confirmVenue: string;
  confirmButton: string;

  // Date Pass
  datePassTitle: string;
  dateConfirmedBadge: string;
  shareButton: string;
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
      'I don\'t know when it started, but I realised I care about you more than I should.',
      '[Their Name]\u2026 I\'m scared this might make things awkward between us.',
      'But\u2026 will you be my girlfriend?',
    ],
    noStages: ['No', 'Are you sure?', 'Please say yes...', 'Please...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
      '\u4F46\u662F\u2026\u4F60\u613F\u610F\u505A\u6211\u7684\u5973\u670B\u53CB\u5417\uFF1F',
    ],
    noStages: ['\u4E0D', '\u4F60\u786E\u5B9A\u5417\uFF1F', '\u8BF7\u8BF4\u597D...', '\u6C42\u4F60\u4E86...'],
    creationTitle: '\u521B\u5EFA\u4F60\u7684\u544A\u767D',
    senderNameLabel: '\u4F60\u7684\u540D\u5B57',
    recipientNameLabel: 'TA\u7684\u540D\u5B57',
    generateLink: '\u751F\u6210\u94FE\u63A5',
    linkCopied: '\u2713 \u94FE\u63A5\u5DF2\u590D\u5236\uFF01',
    copyLink: '\u590D\u5236\u94FE\u63A5',
    calendarTitle: '\u9009\u4E00\u4E2A\u6211\u4EEC\u521D\u6B21\u7EA6\u4F1A\u7684\u65E5\u5B50',
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
      'Pero\u2026 \u00BFquieres ser mi novia?',
    ],
    noStages: ['No', '\u00BFEst\u00E1s segura?', 'Por favor di que s\u00ED...', 'Por favor...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
      'Mais\u2026 veux-tu \u00EAtre ma petite amie\u00A0?',
    ],
    noStages: ['Non', 'Tu es s\u00FBre\u00A0?', 'Dis oui, s\u2019il te pla\u00EEt...', 'S\u2019il te pla\u00EEt...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
      'Ma\u2026 vuoi essere la mia ragazza?',
    ],
    noStages: ['No', 'Sei sicura?', 'Per favore d\u00EC di s\u00EC...', 'Ti prego...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
      'Mas\u2026 voc\u00EA quer ser minha namorada?',
    ],
    noStages: ['N\u00E3o', 'Voc\u00EA tem certeza?', 'Por favor, diga sim...', 'Por favor...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
      'Aber\u2026 m\u00F6chtest du meine Freundin sein?',
    ],
    noStages: ['Nein', 'Bist du sicher?', 'Bitte sag ja...', 'Bitte...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
      'Tapi\u2026 maukah kamu menjadi pacarku?',
    ],
    noStages: ['Tidak', 'Apakah kamu yakin?', 'Tolong bilang iya...', 'Kumohon...'],
    creationTitle: 'Create Your Proposal',
    senderNameLabel: 'Your Name',
    recipientNameLabel: 'Their Name',
    generateLink: 'Generate Link',
    linkCopied: '\u2713 Link copied!',
    copyLink: 'Copy Link',
    calendarTitle: 'Pick a date for our first date',
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
