import { LanguageCode } from '../types/fairshift';

export interface Translations {
  appName: string;
  tagline: string;
  selectRole: string;
  workerApp: string;
  workerSubtitle: string;
  adminDashboard: string;
  adminSubtitle: string;
  
  // Navigation & Tabs
  clockInOut: string;
  myPayslip: string;
  reportHazard: string;
  rateWorkplace: string;
  switchSector: string;
  changeLanguage: string;
  changeWorker: string;
  
  // Clock in / out
  currentlyOnShift: string;
  notOnShift: string;
  clockInNow: string;
  clockOutNow: string;
  selectMethod: string;
  geoCheckIn: string;
  qrCheckIn: string;
  scanQrPrompt: string;
  confirmLocation: string;
  simulatedGeoSuccess: string;
  simulatedQrSuccess: string;
  shiftStartedAt: string;
  currentHours: string;
  overtimeAccruing: string;
  earnedToday: string;
  recentShifts: string;

  // Payslip
  payslipTitle: string;
  listenToPayslip: string;
  stopListening: string;
  regularPay: string;
  overtimePay: string;
  deductions: string;
  takeHomePay: string;
  totalHoursWorked: string;
  standardHours: string;
  overtimeHours: string;
  hourlyRate: string;
  transparentProof: string;
  downloadSlip: string;
  
  // Safety Hazard
  safetyTitle: string;
  speakToReport: string;
  listening: string;
  tapToSpeak: string;
  typeOrSpeakPlaceholder: string;
  selectHazardType: string;
  addPhotoOptional: string;
  submitSafetyReport: string;
  aiAnalyzing: string;
  reportSubmittedSuccess: string;
  myPastReports: string;
  statusReported: string;
  statusAcknowledged: string;
  statusInProgress: string;
  statusResolved: string;

  // Anonymous Feedback
  feedbackTitle: string;
  privacyShieldNotice: string;
  ratingManagerLabel: string;
  ratingSafetyLabel: string;
  ratingFairnessLabel: string;
  ratingRestLabel: string;
  additionalCommentsOptional: string;
  submitFeedback: string;
  feedbackSubmittedNotice: string;

  // Fatigue & Health
  restAdvisory: string;
  restAdvisoryMessage: string;
  needBreak: string;
  hydrationReminder: string;

  // Common
  loading: string;
  close: string;
  save: string;
  done: string;
  hours: string;
  currency: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: "FairShift",
    tagline: "UN SDG 8 Decent Work & Transparent Wages",
    selectRole: "Choose Your Portal",
    workerApp: "Worker Mobile App",
    workerSubtitle: "Simple tap & voice check-in, verified payslips, and safe reporting",
    adminDashboard: "Admin & Operations Hub",
    adminSubtitle: "Workplace compliance, overtime audits, safety Kanban, and fatigue risk",

    clockInOut: "Shift Clock",
    myPayslip: "My Payslip",
    reportHazard: "Report Hazard",
    rateWorkplace: "Safe Feedback",
    switchSector: "Switch Sector",
    changeLanguage: "Language",
    changeWorker: "Switch Profile",

    currentlyOnShift: "Active Shift Ongoing",
    notOnShift: "Ready to Start Work",
    clockInNow: "CLOCK IN NOW",
    clockOutNow: "CLOCK OUT NOW",
    selectMethod: "Select Check-In Verification",
    geoCheckIn: "GPS Geofence Match",
    qrCheckIn: "QR Code Scan",
    scanQrPrompt: "Point camera at Site Gate QR Board",
    confirmLocation: "Confirm Site Coordinates",
    simulatedGeoSuccess: "GPS verified inside work premises!",
    simulatedQrSuccess: "QR code validated at site entrance!",
    shiftStartedAt: "Shift Started",
    currentHours: "Hours Elapsed",
    overtimeAccruing: "Overtime Rate Activated (2x)",
    earnedToday: "Estimated Earnings Today",
    recentShifts: "Recent Shift Records",

    payslipTitle: "Digital Payslip Breakdown",
    listenToPayslip: "Listen to Payslip (Audio)",
    stopListening: "Stop Audio",
    regularPay: "Base Shift Pay",
    overtimePay: "Overtime Pay (Over 8h)",
    deductions: "Statutory Deductions & Food",
    takeHomePay: "Net Take-Home Pay",
    totalHoursWorked: "Total Hours",
    standardHours: "Standard Hours",
    overtimeHours: "Overtime Hours",
    hourlyRate: "Base Rate / Hour",
    transparentProof: "Zero uncounted overtime. Every minute recorded.",
    downloadSlip: "Download Statement",

    safetyTitle: "Instant Safety & Hazard Report",
    speakToReport: "Voice Recording",
    listening: "Listening... Speak in your language",
    tapToSpeak: "Tap to Speak (Regional Voice)",
    typeOrSpeakPlaceholder: "Or type your hazard report here...",
    selectHazardType: "Select Hazard Category",
    addPhotoOptional: "Attach Photo (Optional)",
    submitSafetyReport: "Submit Safety Report",
    aiAnalyzing: "Gemini AI is analyzing, translating & prioritizing...",
    reportSubmittedSuccess: "Hazard safely reported to management!",
    myPastReports: "Hazard Tracking Status",
    statusReported: "Reported",
    statusAcknowledged: "Acknowledged",
    statusInProgress: "In Progress",
    statusResolved: "Resolved & Safe",

    feedbackTitle: "100% Anonymous Workplace Rating",
    privacyShieldNotice: "Privacy Shield Active: No names or worker IDs are ever saved with your responses. Results are only revealed when 5 or more workers respond.",
    ratingManagerLabel: "Manager & Supervisor Fairness",
    ratingSafetyLabel: "Safety Gear & Workplace Cleanliness",
    ratingFairnessLabel: "Fair Overtime & Shift Distribution",
    ratingRestLabel: "Adequate Rest Breaks & Clean Drinking Water",
    additionalCommentsOptional: "Any message for higher management (anonymous)...",
    submitFeedback: "Send Anonymous Feedback",
    feedbackSubmittedNotice: "Your voice was securely submitted without personal ID.",

    restAdvisory: "Fatigue Advisory",
    restAdvisoryMessage: "You have worked over 8 hours or consecutive days. Stay hydrated and take a mandatory 15-minute shaded rest break.",
    needBreak: "Take Rest Break",
    hydrationReminder: "Drink Water Now",

    loading: "Loading...",
    close: "Close",
    save: "Save",
    done: "Done",
    hours: "hrs",
    currency: "₹"
  },

  hi: {
    appName: "फेयरशिफ्ट (FairShift)",
    tagline: "संयुक्त राष्ट्र SDG 8 उचित कार्य और पारदर्शी वेतन",
    selectRole: "अपना पोर्टल चुनें",
    workerApp: "श्रमिक मोबाइल ऐप",
    workerSubtitle: "आसान बटन, आवाज से हाजिरी, पारदर्शी पर्ची और सुरक्षा रिपोर्ट",
    adminDashboard: "प्रबंधन डैशबोर्ड",
    adminSubtitle: "साइट अनुपालन, ओवरटाइम ऑडिट, सुरक्षा और थकान ट्रैकिंग",

    clockInOut: "काम की हाजिरी",
    myPayslip: "मेरी तनख्वाह पर्ची",
    reportHazard: "खतरे की सूचना",
    rateWorkplace: "गोपनीय राय",
    switchSector: "क्षेत्र बदलें",
    changeLanguage: "भाषा बदलें",
    changeWorker: "श्रमिक प्रोफाइल",

    currentlyOnShift: "आपकी ड्यूटी चालू है",
    notOnShift: "ड्यूटी शुरू करने के लिए तैयार",
    clockInNow: "हाजिरी लगाएं (काम शुरू)",
    clockOutNow: "काम समाप्त करें (चेक-आउट)",
    selectMethod: "सत्यापन विधि चुनें",
    geoCheckIn: "जीपीएस लोकेशन सत्यापन",
    qrCheckIn: "गेट क्यूआर कोड स्कैन",
    scanQrPrompt: "साइट गेट क्यूआर पर कैमरा रखें",
    confirmLocation: "साइट लोकेशन पुष्टि करें",
    simulatedGeoSuccess: "साइट पर जीपीएस की पुष्टि हो गई!",
    simulatedQrSuccess: "गेट क्यूआर कोड सही पाया गया!",
    shiftStartedAt: "काम शुरू हुआ",
    currentHours: "कुल समय बीता",
    overtimeAccruing: "ओवरटाइम चालू (दोगुनी दर)",
    earnedToday: "आज की अनुमानित कमाई",
    recentShifts: "हाल की शिफ्ट का इतिहास",

    payslipTitle: "डिजिटल वेतन पर्ची विवरण",
    listenToPayslip: "वेतन पर्ची बोलकर सुनें (ऑडियो)",
    stopListening: "ऑडियो बंद करें",
    regularPay: "मूल शिफ्ट वेतन",
    overtimePay: "ओवरटाइम कमाई (8 घंटे बाद)",
    deductions: "कौशल्या/भोजन कटौती",
    takeHomePay: "कुल मिलने वाली रकम (शुद्ध वेतन)",
    totalHoursWorked: "कुल काम के घंटे",
    standardHours: "सामान्य घंटे",
    overtimeHours: "ओवरटाइम घंटे",
    hourlyRate: "प्रति घंटा दर",
    transparentProof: "एक भी मिनट की चोरी नहीं। पूरा हिसाब दर्ज।",
    downloadSlip: "पर्ची डाउनलोड करें",

    safetyTitle: "सुरक्षा एवं खतरे की रिपोर्ट",
    speakToReport: "आवाज से बोलें",
    listening: "सुन रहे हैं... अपनी भाषा में बोलें",
    tapToSpeak: "माइक दबाकर बोलें (आवाज से रिपोर्ट)",
    typeOrSpeakPlaceholder: "या यहाँ लिखकर खतरे के बारे में बताएं...",
    selectHazardType: "खतरे का प्रकार चुनें",
    addPhotoOptional: "फोटो लगाएं (ऐच्छिक)",
    submitSafetyReport: "सुरक्षा रिपोर्ट भेजें",
    aiAnalyzing: "जेमिनी एआई अनुवाद व खतरे की जांच कर रहा है...",
    reportSubmittedSuccess: "खतरे की सूचना प्रबंधन तक सुरक्षित पहुंच गई!",
    myPastReports: "सुरक्षा रिपोर्ट स्थिति",
    statusReported: "दर्ज की गई",
    statusAcknowledged: "स्वीकार की गई",
    statusInProgress: "काम चालू है",
    statusResolved: "सुरक्षित / हल हो गई",

    feedbackTitle: "100% गोपनीय कार्यस्थल फीडबैक",
    privacyShieldNotice: "गोपनीयता कवच सक्रिय: आपका नाम या आईडी कभी नहीं सहेजा जाता। जब 5 या अधिक कर्मचारी जवाब देते हैं तभी रिपोर्ट दिखाई देती है।",
    ratingManagerLabel: "पर्यवेक्षक (सुपरवाइजर) का व्यवहार",
    ratingSafetyLabel: "सुरक्षा उपकरण व कार्यस्थल सफाई",
    ratingFairnessLabel: "उचित काम व ओवर-टाइम बंटवारा",
    ratingRestLabel: "आराम का समय और पीने का पानी",
    additionalCommentsOptional: "उच्च प्रबंधन के लिए कोई संदेश (पूरी तरह गोपनीय)...",
    submitFeedback: "गोपनीय राय भेजें",
    feedbackSubmittedNotice: "आपकी राय बिना पहचान उजागर किए दर्ज कर ली गई है।",

    restAdvisory: "थकान चेतावनी",
    restAdvisoryMessage: "आप लगातार काम कर रहे हैं। कृपया पानी पिएं और 15 मिनट छांव में विश्राम करें।",
    needBreak: "आराम लें",
    hydrationReminder: "तुरंत पानी पिएं",

    loading: "लोड हो रहा है...",
    close: "बंद करें",
    save: "सुरक्षित करें",
    done: "संपन्न",
    hours: "घंटे",
    currency: "₹"
  },

  ta: {
    appName: "ஃபேர்ஷிப்ட் (FairShift)",
    tagline: "ஐக்கிய நாடுகள் SDG 8 கண்ணியமான வேலை & வெளிப்படையான ஊதியம்",
    selectRole: "உங்கள் தளத்தைத் தேர்ந்தெடுக்கவும்",
    workerApp: "தொழிலாளர் மொபைல் ஆப்",
    workerSubtitle: "குரல் வழி வருகை, தெளிவான சம்பளச் சீட்டு மற்றும் பாதுகாப்பு அறிக்கை",
    adminDashboard: "நிர்வாகி டாஷ்போர்டு",
    adminSubtitle: "பணித்தள விதிகள், கூடுதல் நேர தணிக்கை, பாதுகாப்பு மற்றும் சோர்வு கண்காணிப்பு",

    clockInOut: "வேலை நேரம் / வருகை",
    myPayslip: "என் சம்பளச் சீட்டு",
    reportHazard: "ஆபத்து அறிக்கை",
    rateWorkplace: "ரகசிய கருத்து",
    switchSector: "துறையை மாற்றுக",
    changeLanguage: "மொழி",
    changeWorker: "சுயவிவரம் மாற்றுக",

    currentlyOnShift: "வேலை நேரம் நடப்பில் உள்ளது",
    notOnShift: "வேலை தொடங்க தயார்",
    clockInNow: "வேலையை தொடங்கு (செக்-இன்)",
    clockOutNow: "வேலையை முடி (செக்-அவுட்)",
    selectMethod: "சரிபார்ப்பு முறையைத் தேர்வுசெய்க",
    geoCheckIn: "ஜிபிஎஸ் இடம் சரிபார்ப்பு",
    qrCheckIn: "கேட் QR குறியீடு ஸ்கேன்",
    scanQrPrompt: "தள நுழைவு QR குறியீட்டை நோக்கி கேமராவை வைக்கவும்",
    confirmLocation: "பணித்தள இடத்தை உறுதி செய்க",
    simulatedGeoSuccess: "பணித்தள இருப்பிடம் உறுதிசெய்யப்பட்டது!",
    simulatedQrSuccess: "QR குறியீடு வெற்றிகரமாக சரிபார்க்கப்பட்டது!",
    shiftStartedAt: "வேலை தொடங்கிய நேரம்",
    currentHours: "முடிந்த மணிநேரம்",
    overtimeAccruing: "கூடுதல் நேரம் செயல்படுகிறது (2x ஊதியம்)",
    earnedToday: "இன்றைய மதிப்பிடப்பட்ட வருமானம்",
    recentShifts: "சமீபத்திய வேலைப் பதிவுகள்",

    payslipTitle: "டிஜிட்டல் சம்பள விவரம்",
    listenToPayslip: "சம்பள விவரத்தை குரலில் கேள் (ஆடியோ)",
    stopListening: "ஆடியோவை நிறுத்து",
    regularPay: "அடிப்படை ஷிப்ட் ஊதியம்",
    overtimePay: "கூடுதல் நேர ஊதியம் (8 மணி நேரத்திற்கு மேல்)",
    deductions: "சட்டபூர்வ பிடித்தங்கள் & உணவு",
    takeHomePay: "கைக்கு வரும் நிகர ஊதியம்",
    totalHoursWorked: "மொத்த வேலை நேரம்",
    standardHours: "வழக்கமான நேரம்",
    overtimeHours: "கூடுதல் நேரம்",
    hourlyRate: "ஒரு மணி நேர கட்டணம்",
    transparentProof: "ஒரு நிமிடமும் விடுபடவில்லை. முழு கணக்கு பதிவு.",
    downloadSlip: "சீட்டைப் பதிவிறக்கு",

    safetyTitle: "பாதுகாப்பு & ஆபத்து அறிக்கை",
    speakToReport: "குரல் பதிவு மூலம் பேசுங்கள்",
    listening: "கேட்கிறது... உங்கள் மொழியில் பேசுங்கள்",
    tapToSpeak: "மைக் தட்டி குரலில் புகாரளிக்கவும்",
    typeOrSpeakPlaceholder: "அல்லது இங்கு தட்டச்சு செய்து ஆபத்தைக் கூறவும்...",
    selectHazardType: "ஆபத்து வகையைத் தேர்ந்தெடுக்கவும்",
    addPhotoOptional: "புகைப்படம் சேர்க்கவும் (விரும்பினால்)",
    submitSafetyReport: "பாதுகாப்பு அறிக்கையை அனுப்பு",
    aiAnalyzing: "ஜெமினி AI ஆபத்தை மொழிபெயர்த்து மதிப்பீடு செய்கிறது...",
    reportSubmittedSuccess: "ஆபத்து அறிக்கை நிர்வாகத்திற்கு பாதுகாப்பாக அனுப்பப்பட்டது!",
    myPastReports: "ஆபத்து கண்காணிப்பு நிலை",
    statusReported: "பதிவு செய்யப்பட்டது",
    statusAcknowledged: "ஏற்றுக்கொள்ளப்பட்டது",
    statusInProgress: "நடவடிக்கையில் உள்ளது",
    statusResolved: "சரிசெய்யப்பட்டது",

    feedbackTitle: "100% ரகசிய பணித்தள மதிப்பீடு",
    privacyShieldNotice: "ரகசியத்தன்மை கவசம்: உங்கள் பெயரோ அடையாளமோ ஒருபோதும் சேமிக்கப்படாது. 5 அல்லது அதற்கு மேற்பட்ட தொழிலாளர்கள் பதிலளிக்கும் போது மட்டுமே காட்டப்படும்.",
    ratingManagerLabel: "மேற்பார்வையாளரின் நியாயமான நடத்தை",
    ratingSafetyLabel: "பாதுகாப்பு உபகரணங்கள் & சுகாதாரம்",
    ratingFairnessLabel: "நியாயமான வேலை மற்றும் கூடுதல் நேர பகிர்வு",
    ratingRestLabel: "போதுமான ஓய்வு நேரம் & தூய குடிநீர் வசதி",
    additionalCommentsOptional: "நிர்வாகத்திற்கு தெரிவிக்க வேண்டிய கூடுதல் செய்தி (முழு ரகசியம்)...",
    submitFeedback: "ரகசிய கருத்தை அனுப்பு",
    feedbackSubmittedNotice: "உங்கள் கருத்து அடையாளம் இன்றி பாதுகாப்பாக பதிவு செய்யப்பட்டது.",

    restAdvisory: "சோர்வு தடுப்பு அறிவுரை",
    restAdvisoryMessage: "நீங்கள் தொடர்ச்சியாக வேலை செய்துள்ளீர்கள். தண்ணீர் அருந்தி 15 நிமிடங்கள் நிழலில் ஓய்வெடுக்கவும்.",
    needBreak: "ஓய்வெடுக்கவும்",
    hydrationReminder: "உடனே தண்ணீர் குடிக்கவும்",

    loading: "ஏற்றுகிறது...",
    close: "மூடு",
    save: "சேமி",
    done: "முடிந்தது",
    hours: "மணி",
    currency: "₹"
  },

  te: {
    appName: "ఫెయిర్‌షిఫ్ట్ (FairShift)",
    tagline: "ఐక్యరాజ్యసమితి SDG 8 గౌరవప్రదమైన పని & పారదర్శక వేతనం",
    selectRole: "మీ పోర్టల్ ఎంచుకోండి",
    workerApp: "కార్మికుల మొబైల్ యాప్",
    workerSubtitle: "సులభమైన బటన్లు, వాయిస్ హాజరు, పారదర్శక వేతన రసీదు మరియు రక్షణ రిపోర్ట్",
    adminDashboard: "నిర్వాహక డ్యాష్‌బోర్డ్",
    adminSubtitle: "సైట్ నియమాలు, ఓవర్‌టైమ్ ఆడిట్, భద్రతా కాన్‌బాన్ మరియు శ్రమ అలసట నిఘా",

    clockInOut: "పని హాజరు / షిఫ్ట్",
    myPayslip: "నా వేతన రసీదు",
    reportHazard: "ప్రమాదం నివేదిక",
    rateWorkplace: "రహస్య అభిప్రాయం",
    switchSector: "రంగాన్ని మార్చుకోండి",
    changeLanguage: "భాష",
    changeWorker: "కార్మికుడి ప్రొఫైల్ మార్చు",

    currentlyOnShift: "పని సమయం కొనసాగుతోంది",
    notOnShift: "పని ప్రారంభించడానికి సిద్ధంగా ఉంది",
    clockInNow: "పని ప్రారంభించు (క్లాక్ ఇన్)",
    clockOutNow: "పని ముగించు (క్లాక్ అవుట్)",
    selectMethod: "ధృవీకరణ పద్ధతి ఎంచుకోండి",
    geoCheckIn: "GPS లొకేషన్ ధృవీకరణ",
    qrCheckIn: "గేట్ QR కోడ్ స్కాన్",
    scanQrPrompt: "సైట్ గేట్ QR కోడ్ వైపు కెమెరా చూపండి",
    confirmLocation: "పని ప్రదేశాన్ని ధృవీకరించండి",
    simulatedGeoSuccess: "పని ప్రదేశం GPS సరిగ్గా నిర్ధారించబడింది!",
    simulatedQrSuccess: "QR కోడ్ విజయవంతంగా ధృవీకరించబడింది!",
    shiftStartedAt: "పని ప్రారంభమైన సమయం",
    currentHours: "గడచిన గంటలు",
    overtimeAccruing: "ఓవర్‌టైమ్ రేటు ప్రారంభమైంది (2x వేతనం)",
    earnedToday: "నేటి అంచనా ఆదాయం",
    recentShifts: "ఇటీవలి షిఫ్ట్ వివరాలు",

    payslipTitle: "డిజిటల్ వేతన వివరాలు",
    listenToPayslip: "వేతన వివరాలను వాయిస్‌లో వినండి (ఆడియో)",
    stopListening: "ఆడియో ఆపు",
    regularPay: "ప్రాథమిక షిఫ్ట్ వేతనం",
    overtimePay: "ఓవర్‌టైమ్ వేతనం (8 గంటల దాటినది)",
    deductions: "చట్టపరమైన మినహాయింపులు & భోజనం",
    takeHomePay: "చేతికి వచ్చే నికర వేతనం",
    totalHoursWorked: "మొత్తం పని గంటలు",
    standardHours: "సాధారణ గంటలు",
    overtimeHours: "ఓవర్‌టైమ్ గంటలు",
    hourlyRate: "గంటకు ప్రాథమిక రేటు",
    transparentProof: "ఒక్క నిమిషం కూడా తగ్గలేదు. ప్రతి క్షణం నమోదైంది.",
    downloadSlip: "రసీదు డౌన్‌లోడ్ చేయండి",

    safetyTitle: "భద్రత & ప్రమాద నివేదిక",
    speakToReport: "వాయిస్ రికార్డింగ్ ద్వారా మాట్లాడండి",
    listening: "వింటున్నాము... మీ భాషలో మాట్లాడండి",
    tapToSpeak: "మైక్ నొక్కి మాట్లాడండి (వాయిస్ రిపోర్ట్)",
    typeOrSpeakPlaceholder: "లేదా ఇక్కడ టైప్ చేసి ప్రమాదం గురించి చెప్పండి...",
    selectHazardType: "ప్రమాద రకాన్ని ఎంచుకోండి",
    addPhotoOptional: "ఫోటో జోడించండి (ఐచ్ఛికం)",
    submitSafetyReport: "భద్రతా నివేదికను పంపండి",
    aiAnalyzing: "జెమినీ AI నివేదికను అనువదించి విశ్లేషిస్తోంది...",
    reportSubmittedSuccess: "ప్రమాద నివేదిక యాజమాన్యానికి సురక్షితంగా చేరింది!",
    myPastReports: "ప్రమాద నివేదికల స్థితి",
    statusReported: "నమోదైంది",
    statusAcknowledged: "అంగీకరించబడింది",
    statusInProgress: "పరిష్కారంలో ఉంది",
    statusResolved: "సురక్షితంగా పరిష్కరించబడింది",

    feedbackTitle: "100% అనామక కార్యాలయ రేటింగ్",
    privacyShieldNotice: "గోప్యతా కవచం యాక్టివ్‌గా ఉంది: మీ పేరు లేదా ఐడీ ఎక్కడా సేవ్ అవ్వదు. కనీసం 5 మంది కార్మికులు స్పందించినప్పుడే నివేదిక కనిపిస్తుంది.",
    ratingManagerLabel: "మేనేజర్ / సూపర్‌వైజర్ ప్రవర్తన",
    ratingSafetyLabel: "రక్షణ పరికరాలు & కార్యాలయ పరిశుభ్రత",
    ratingFairnessLabel: "న్యాయమైన పని మరియు ఓవర్‌టైమ్ పంపిణీ",
    ratingRestLabel: "విశ్రాంతి సమయం & స్వచ్ఛమైన తాగునీటి సదుపాయం",
    additionalCommentsOptional: "పై యాజమాన్యానికి ఏదైనా సమాచారం (పూర్తిగా అనామకం)...",
    submitFeedback: "అనామక అభిప్రాయాన్ని పంపండి",
    feedbackSubmittedNotice: "మీ అభిప్రాయం మీ గుర్తింపు లేకుండా సురక్షితంగా చేరింది.",

    restAdvisory: "అలసట సలహా",
    restAdvisoryMessage: "మీరు వరుసగా పనిచేశారు. దయచేసి నీరు తాగి 15 నిమిషాలు నీడలో విశ్రాంతి తీసుకోండి.",
    needBreak: "విశ్రాంతి తీసుకోండి",
    hydrationReminder: "వెంటనే నీరు త్రాగండి",

    loading: "లోడ్ అవుతోంది...",
    close: "మూసివేయి",
    save: "భద్రపరుచు",
    done: "పూర్తయింది",
    hours: "గంటలు",
    currency: "₹"
  }
};

/**
 * Text-to-Speech synthesis in selected regional language
 */
export function speakText(text: string, lang: LanguageCode) {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel(); // Stop any previous speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map language codes to BCP 47
  const langMap: Record<LanguageCode, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN'
  };
  utterance.lang = langMap[lang] || 'en-US';
  utterance.rate = 0.95; // Slightly slower for crisp clarity
  utterance.pitch = 1.0;
  
  // Pick matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(lang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
