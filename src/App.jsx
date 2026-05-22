import { useState, useCallback, useMemo, useEffect } from "react";

// ─────────────────────────────────────────────
//  TRANSLATIONS
// ─────────────────────────────────────────────
// Environment variables — injected by Vite's define config at build time
// Falls back silently in non-Vite environments (artifact sandbox, etc.)
// Proxy-aware API URLs (proxy only works in Vite dev server)
const IS_DEV=typeof window!=="undefined"&&window.location.hostname==="localhost";
const FOOTBALL_URL=(path)=>IS_DEV?`/api/football${path}`:`/api/football?path=${encodeURIComponent(path)}`;
const BSD_URL=(path)=>IS_DEV?`/api/bsd${path}`:`/api/bsd?path=${encodeURIComponent(path)}`;

let ENV_FOOTBALL_KEY="",ENV_BSD_KEY="",ENV_SHEET_USA="",ENV_SHEET_FAM="",ENV_SHEET_CO="";
try{ENV_FOOTBALL_KEY=WCENV_FOOTBALL}catch(e){}
try{ENV_BSD_KEY=WCENV_BSD}catch(e){}
try{ENV_SHEET_USA=WCENV_SHEET_USA}catch(e){}
try{ENV_SHEET_FAM=WCENV_SHEET_FAM}catch(e){}
try{ENV_SHEET_CO=WCENV_SHEET_CO}catch(e){}
const ENV_HAS_SHEETS = !!(ENV_SHEET_USA||ENV_SHEET_FAM||ENV_SHEET_CO);

const LANG = {
  es: {
    // Header
    brandSub: "Zona Mundialista",
    brandTitle: "Zona Mundialista 2026",
    brandDesc: "Cuatro vistas conectadas: Partidos del Día, Mapa de Partidos, Estadísticas y Polla Mundialista.",
    dataMode: "Modo de datos:",
    apiLive: "API en Vivo Conectada",
    demoActive: "Modo Demo Activo",
    manualMode: "Modo Manual",
    simulate: "Simular datos de API",
    reset: "Reiniciar datos",
    matches: "PARTIDOS", teams: "EQUIPOS", cities: "CIUDADES", views: "VISTAS",
    finished: "finalizados", liveCount: "en vivo", upcomingCount: "próximos",
    // Nav
    navHome: "Inicio", navFixtures: "Partidos", navStats: "Estadísticas", navAI: "Predicciones", navPolla: "Polla",
    // Status
    statusFt: "Final", statusLive: "En Vivo", statusUpcoming: "Próximo",
    // Home
    todayGames: "PARTIDOS DEL DÍA", liveNow: "EN VIVO", completed: "FINALIZADOS", comingNext: "PRÓXIMOS",
    todayDesc: "Partidos agrupados por día con marcadores y estado. Haz clic en un partido para ver detalles.",
    selectMatch: "Selecciona un partido de la lista para ver detalles, eventos y estadísticas.",
    noMatches: "No hay partidos programados para esta fecha.",
    liveReady: "Listo",
    // Match detail
    groupStage: "FASE DE GRUPOS · GRUPO",
    matchEvents: "Eventos del Partido", liveStats: "Estadísticas en Vivo",
    noEvents: "Sin eventos registrados aún.",
    editMatch: "Editar datos del partido",
    potmLabel: "Jugador del partido:",
    possession: "Posesión", shots: "Tiros", shotsOnTarget: "Tiros a Puerta",
    corners: "Esquinas", fouls: "Faltas",
    // Edit modal
    editTitle: "EDITAR PARTIDO", statusLabel: "Estado", scoreLabel: "Goles",
    potmInput: "Jugador del Partido",
    eventsInput: "Eventos (uno por línea: tipo|jugador|equipo|minuto|detalle)",
    statsInput: "Estadísticas (local,visitante)",
    possInput: "Posesión %", shotsInput: "Tiros", sotInput: "Tiros a Puerta",
    cornersInput: "Esquinas",
    cancel: "Cancelar", save: "Guardar",
    optUpcoming: "Próximo", optLive: "En Vivo", optFt: "Final",
    // Fixtures
    played: "jugados", all: "Todos",
    // Fetch
    apiTitle: "API EN VIVO", apiPlaceholder: "Pega tu API key de football-data.org",
    fetchScores: "Obtener Marcadores", fetchDetails: "Obtener Detalles",
    fetching: "Cargando...", freeTier: "Gratis · 10 req/min",
    apiKeyError: "Pega tu API key de football-data.org",
    apiInvalid: "API key inválida o expirada",
    apiRateLimit: "Límite de solicitudes — espera 60s e intenta de nuevo",
    apiUpdated: "partido(s) actualizados. Haz clic en \"Obtener Detalles\" para eventos y estadísticas.",
    apiNoResults: "Sin resultados nuevos. El torneo inicia el 11 de junio de 2026.",
    apiNoFinished: "Sin partidos finalizados nuevos.",
    apiLoaded: "Detalles cargados para",
    apiFetching: "Cargando detalles para",
    apiFetchFirst: "Obtén marcadores primero, luego detalles",
    apiKeyFirst: "Ingresa la API key primero",
    apiCapped: "máximo 9 — vuelve a buscar para más",
    // Stats
    tournamentOverview: "RESUMEN DEL TORNEO",
    matchesPlayed: "Partidos Jugados", goalsScored: "Goles Anotados",
    goalsPerGame: "Goles / Partido", totalGoals: "Total de Goles",
    yellowCards: "Tarjetas Amarillas", redCards: "Tarjetas Rojas",
    topScorers: "GOLEADORES", noGoals: "Sin goles aún.",
    potmAwards: "PREMIOS JUGADOR DEL PARTIDO", noAwards: "Sin premios aún.",
    topAttacking: "EQUIPOS MÁS OFENSIVOS", noData: "Sin datos aún.",
    groupLeaders: "LÍDERES DE GRUPO",
    shotsLabel: "tiros", onTargetLabel: "a puerta", cornersLabel: "esquinas",
    // Team stats
    selectTeam: "SELECCIONA UN EQUIPO PARA ESTADÍSTICAS DETALLADAS",
    backToTournament: "← Volver a Estadísticas del Torneo",
    inGroup: "en Grupo", noMatchesYet: "Sin partidos jugados aún.",
    matchResults: "RESULTADOS", teamScorers: "GOLEADORES DEL EQUIPO",
    discipline: "DISCIPLINA", yellow: "Amarilla", red: "Roja",
    perfMetrics: "MÉTRICAS DE RENDIMIENTO",
    goalsScoredLabel: "Goles Anotados", goalsConceded: "Goles Recibidos",
    totalShots: "Total de Tiros", cornersWon: "Esquinas Ganadas",
    foulsCommitted: "Faltas Cometidas",
    matchByMatch: "ESTADÍSTICAS POR PARTIDO",
    opponent: "Rival", result: "Resultado",
    pj: "PJ", g: "G", e: "E", p: "P", gf: "GF", gc: "GC", dg: "DG",
    pts: "Pts", avgPoss: "Pos. Prom.", cleanSheet: "Valla Inv.",
    // Polla
    pollaTitle: "POLLA MUNDIALISTA",
    pollaDesc: "Resultado correcto (V/E/D) = 3 pts · Marcador exacto = +5 pts · Ganador grupo = 5 pts · Campeón = 15 pts · Bota de Oro = 10 pts",
    importPlayers: "Importar jugadores",
    importDesc: "Pega datos JSON de los participantes. Usa el convertidor de Excel para generar el JSON desde los archivos .xlsx",
    importBtn: "📋 Importar JSON", importClose: "Cerrar", importGo: "Importar",
    imported: "importado", importedPlural: "importados",
    friends_usa: "AMIGOS USA", friends_co: "AMIGOS COLOMBIA", family: "FAMILIA", players: "jugadores",
    showDemo: "Datos demo", noPlayers: "Sin jugadores. Importa datos o activa el demo.",
    pos: "Pos", name: "Nombre", resultsCol: "Resultado", exactCol: "Exacto",
    groupCol: "Grupo", bonusCol: "Bonos", totalCol: "Total",
    back: "← Volver", totalPoints: "PUNTOS TOTALES",
    preTournament: "PICKS PRE-TORNEO", champion: "Campeón", goldenBoot: "Bota de Oro",
    groupWinners: "GANADORES DE GRUPO", matchPredictions: "POLLA MUNDIALISTA",
    pred: "Pred", real: "Real", noPlayedYet: "Sin partidos jugados aún.",
    resultados: "Resultados", exactos: "Exactos", grupos: "Grupos", bonos: "Bonos",
    // Events
    evGoal: "Gol", evPenalty: "Penal", evOwnGoal: "Autogol",
    evFreeKick: "Tiro Libre", evHeader: "Cabezazo", evFoul: "Falta",
    evYellow: "Tarjeta Amarilla", evRed: "Tarjeta Roja",

    // Knockout
    groupStage: "Fase de Grupos", knockoutStage: "Eliminatorias",
    r32Label: "Octavos de Final (16 partidos)", bracketLabel: "Cuadro Final (R16 → Final)",
    r32Short: "Octavos", bracketShort: "Cuadro Final",
    roundR32: "Octavos", roundR16: "Cuartos", roundQF: "Semifinal", roundSF: "Semifinal",
    roundFinal: "Final", roundThird: "3er Puesto",
    // Welcome
    welcomeTitle: "¿A QUIÉN LE VAS?",
    welcomeQ1: "¿A QUIÉN LE VAS?", welcomeQ1Sub: "Escoge tu selección favorita",
    welcomeQ2: "¿QUIÉN ERES?", welcomeQ2Sub: "Escoge tu nombre para ver tu posición en la Polla",
    welcomeSearch: "Buscar equipo...", welcomeNext: "Siguiente →", welcomeSkip: "Saltar →",
    welcomeBack: "← Atrás", welcomeEnterAs: "Entrar como", welcomeEnterNoName: "Entrar sin nombre",
    // Status
    apiConnectedLabel: "API Conectada", apiWaiting: "Esperando datos", apiNoKey: "Sin API key",
    apiLoading: "Conectando...", apiRefresh: "↻ Actualizar", apiAuto: "Auto 60s",
    // Home personal
    nextMatch: "{t.nextMatch}", yourPosition: "{t.yourPosition}",
    posOf: "de", posIn: "en",
    // Polla filters
    pollaAll: "Todos", pollaUSA: "Amigos USA", pollaCO: "Amigos Colombia", pollaFam: "Familia",
    connectingSheets: "Conectando con Google Sheets...",
    noPredictions: "Sin predicciones disponibles.",
    loadingPreds: "Cargando predicciones...",
    // Countdown
    daysToWC: "días para\nel Mundial", wcLive: "⚽ EN VIVO",
    // Footer
    changeTeam: "Cambiar equipo", pickTeam: "⚽ Elegir equipo",
    // AI page
    aiDesc: "Predicciones generadas por inteligencia artificial (CatBoost ML) con datos de Bzzoiro Sports Data.",
    aiDraw: "Empate",
  },
  en: {
    brandSub: "WorldCup Zone",
    brandTitle: "WorldCup Zone 2026",
    brandDesc: "Four connected views: Today's Games, Fixture Map, Statistics Center and Prediction Game.",
    dataMode: "Data mode:",
    apiLive: "Live API Connected", demoActive: "Demo Mode Active", manualMode: "Manual Mode",
    simulate: "Simulate API refresh", reset: "Reset data",
    matches: "MATCHES", teams: "TEAMS", cities: "HOST CITIES", views: "VIEWS",
    finished: "completed", liveCount: "live", upcomingCount: "upcoming",
    navHome: "Home", navFixtures: "Fixtures", navStats: "Stats", navAI: "Predictions", navPolla: "Polla",
    statusFt: "Full Time", statusLive: "Live", statusUpcoming: "Upcoming",
    todayGames: "TODAY'S GAMES", liveNow: "LIVE NOW", completed: "COMPLETED", comingNext: "COMING NEXT",
    todayDesc: "Games grouped by day, with live scores and status updates. Click a match to see full details.",
    selectMatch: "Select a match from the list to view details, events, and live stats.",
    noMatches: "No matches scheduled for this date.",
    liveReady: "Live-ready",
    groupStage: "GROUP STAGE · GROUP",
    matchEvents: "Match Events", liveStats: "Live Stats",
    noEvents: "No events recorded yet.",
    editMatch: "Edit match data", potmLabel: "Player of the game:",
    possession: "Possession", shots: "Shots", shotsOnTarget: "Shots on Target",
    corners: "Corners", fouls: "Fouls",
    editTitle: "EDIT MATCH", statusLabel: "Status", scoreLabel: "Score",
    potmInput: "Player of the Game",
    eventsInput: "Events (one per line: type|player|team|minute|detail)",
    statsInput: "Match Stats (home,away)",
    possInput: "Possession %", shotsInput: "Shots", sotInput: "Shots on Target",
    cornersInput: "Corners",
    cancel: "Cancel", save: "Save",
    optUpcoming: "Upcoming", optLive: "Live", optFt: "Full Time",
    played: "played", all: "All",
    apiTitle: "LIVE API", apiPlaceholder: "Paste your football-data.org API key",
    fetchScores: "Fetch Scores", fetchDetails: "Fetch Details",
    fetching: "Fetching...", freeTier: "Free tier · 10 req/min",
    apiKeyError: "Paste your football-data.org API key above",
    apiInvalid: "Invalid or expired API key",
    apiRateLimit: "Rate limit hit — wait 60s and retry",
    apiUpdated: "match(es) updated. Click \"Fetch Details\" for events & stats.",
    apiNoResults: "No new results found. Tournament starts June 11, 2026.",
    apiNoFinished: "No new finished matches found.",
    apiLoaded: "Loaded details for", apiFetching: "Fetching details for",
    apiFetchFirst: "Fetch scores first, then fetch details",
    apiKeyFirst: "Enter API key first", apiCapped: "capped at 9 — refetch for more",
    tournamentOverview: "TOURNAMENT OVERVIEW",
    matchesPlayed: "Matches Played", goalsScored: "Goals Scored",
    goalsPerGame: "Goals / Game", totalGoals: "Total Goals",
    yellowCards: "Yellow Cards", redCards: "Red Cards",
    topScorers: "TOP SCORERS", noGoals: "No goals yet.",
    potmAwards: "PLAYER OF THE MATCH AWARDS", noAwards: "No awards yet.",
    topAttacking: "TOP ATTACKING TEAMS", noData: "No data yet.",
    groupLeaders: "GROUP LEADERS",
    shotsLabel: "shots", onTargetLabel: "on target", cornersLabel: "corners",
    selectTeam: "SELECT A TEAM FOR DETAILED STATS",
    backToTournament: "← Back to Tournament Stats",
    inGroup: "in Group", noMatchesYet: "No matches played yet.",
    matchResults: "MATCH RESULTS", teamScorers: "GOALSCORERS",
    discipline: "DISCIPLINE", yellow: "Yellow", red: "Red",
    perfMetrics: "PERFORMANCE METRICS",
    goalsScoredLabel: "Goals Scored", goalsConceded: "Goals Conceded",
    totalShots: "Total Shots", cornersWon: "Corners Won",
    foulsCommitted: "Fouls Committed",
    matchByMatch: "MATCH-BY-MATCH STATS",
    opponent: "Opponent", result: "Result",
    pj: "MP", g: "W", e: "D", p: "L", gf: "GF", gc: "GA", dg: "GD",
    pts: "Pts", avgPoss: "Avg Poss.", cleanSheet: "Clean Sh.",
    pollaTitle: "POLLA MUNDIALISTA",
    pollaDesc: "Correct result (W/D/L) = 3 pts · Exact score = +5 pts · Group winner = 5 pts · Champion = 15 pts · Golden Boot = 10 pts",
    importPlayers: "Import players",
    importDesc: "Paste JSON data from participants. Use the Excel converter to generate JSON from .xlsx files",
    importBtn: "📋 Import JSON", importClose: "Close", importGo: "Import",
    imported: "imported", importedPlural: "imported",
    friends_usa: "FRIENDS USA", friends_co: "FRIENDS COLOMBIA", family: "FAMILY", players: "players",
    showDemo: "Demo data", noPlayers: "No players. Import data or enable demo.",
    pos: "Pos", name: "Name", resultsCol: "Results", exactCol: "Exact",
    groupCol: "Groups", bonusCol: "Bonus", totalCol: "Total",
    back: "← Back", totalPoints: "TOTAL POINTS",
    preTournament: "PRE-TOURNAMENT PICKS", champion: "Champion", goldenBoot: "Golden Boot",
    groupWinners: "GROUP WINNERS", matchPredictions: "MATCH PREDICTIONS",
    pred: "Pred", real: "Actual", noPlayedYet: "No matches played yet.",
    resultados: "Results", exactos: "Exact", grupos: "Groups", bonos: "Bonus",
    evGoal: "Goal", evPenalty: "Penalty", evOwnGoal: "Own Goal",
    evFreeKick: "Free Kick", evHeader: "Header", evFoul: "Foul",
    evYellow: "Yellow Card", evRed: "Red Card",
    // Knockout
    groupStage: "Group Stage", knockoutStage: "Knockout Stage",
    r32Label: "Round of 32 (16 matches)", bracketLabel: "Final Bracket (R16 → Final)",
    r32Short: "Round of 32", bracketShort: "Final Bracket",
    roundR32: "R32", roundR16: "R16", roundQF: "Quarterfinal", roundSF: "Semifinal",
    roundFinal: "Final", roundThird: "3rd Place",
    // Welcome
    welcomeTitle: "WHO ARE YOU ROOTING FOR?",
    welcomeQ1: "WHO ARE YOU ROOTING FOR?", welcomeQ1Sub: "Pick your favorite team",
    welcomeQ2: "WHO ARE YOU?", welcomeQ2Sub: "Pick your name to see your Polla ranking",
    welcomeSearch: "Search team...", welcomeNext: "Next →", welcomeSkip: "Skip →",
    welcomeBack: "← Back", welcomeEnterAs: "Enter as", welcomeEnterNoName: "Enter without name",
    // Status
    apiConnectedLabel: "API Connected", apiWaiting: "Waiting for data", apiNoKey: "No API key",
    apiLoading: "Connecting...", apiRefresh: "↻ Refresh", apiAuto: "Auto 60s",
    // Home personal
    nextMatch: "NEXT MATCH", yourPosition: "YOUR POLLA POSITION",
    posOf: "of", posIn: "in",
    // Polla filters
    pollaAll: "All", pollaUSA: "Friends USA", pollaCO: "Friends Colombia", pollaFam: "Family",
    connectingSheets: "Connecting to Google Sheets...",
    noPredictions: "No predictions available.",
    loadingPreds: "Loading predictions...",
    // Countdown
    daysToWC: "days to\nWorld Cup", wcLive: "⚽ LIVE",
    // Footer
    changeTeam: "Change team", pickTeam: "⚽ Pick team",
    // AI page
    aiDesc: "AI-generated predictions (CatBoost ML) powered by Bzzoiro Sports Data.",
    aiDraw: "Draw",
  }
};

let _t = LANG.es;

const GROUPS = {
  A:[ {name:"Mexico",flag:"🇲🇽",conf:"CONCACAF"},{name:"South Korea",flag:"🇰🇷",conf:"AFC"},{name:"South Africa",flag:"🇿🇦",conf:"CAF"},{name:"Czechia",flag:"🇨🇿",conf:"UEFA"} ],
  B:[ {name:"Canada",flag:"🇨🇦",conf:"CONCACAF"},{name:"Switzerland",flag:"🇨🇭",conf:"UEFA"},{name:"Qatar",flag:"🇶🇦",conf:"AFC"},{name:"Bosnia & Herz.",flag:"🇧🇦",conf:"UEFA"} ],
  C:[ {name:"Brazil",flag:"🇧🇷",conf:"CONMEBOL"},{name:"Morocco",flag:"🇲🇦",conf:"CAF"},{name:"Haiti",flag:"🇭🇹",conf:"CONCACAF"},{name:"Scotland",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",conf:"UEFA"} ],
  D:[ {name:"USA",flag:"🇺🇸",conf:"CONCACAF"},{name:"Paraguay",flag:"🇵🇾",conf:"CONMEBOL"},{name:"Australia",flag:"🇦🇺",conf:"AFC"},{name:"Türkiye",flag:"🇹🇷",conf:"UEFA"} ],
  E:[ {name:"Germany",flag:"🇩🇪",conf:"UEFA"},{name:"Curaçao",flag:"🇨🇼",conf:"CONCACAF"},{name:"Ivory Coast",flag:"🇨🇮",conf:"CAF"},{name:"Ecuador",flag:"🇪🇨",conf:"CONMEBOL"} ],
  F:[ {name:"Netherlands",flag:"🇳🇱",conf:"UEFA"},{name:"Japan",flag:"🇯🇵",conf:"AFC"},{name:"Sweden",flag:"🇸🇪",conf:"UEFA"},{name:"Tunisia",flag:"🇹🇳",conf:"CAF"} ],
  G:[ {name:"Belgium",flag:"🇧🇪",conf:"UEFA"},{name:"Iran",flag:"🇮🇷",conf:"AFC"},{name:"New Zealand",flag:"🇳🇿",conf:"OFC"},{name:"Egypt",flag:"🇪🇬",conf:"CAF"} ],
  H:[ {name:"Spain",flag:"🇪🇸",conf:"UEFA"},{name:"Cape Verde",flag:"🇨🇻",conf:"CAF"},{name:"Saudi Arabia",flag:"🇸🇦",conf:"AFC"},{name:"Uruguay",flag:"🇺🇾",conf:"CONMEBOL"} ],
  I:[ {name:"France",flag:"🇫🇷",conf:"UEFA"},{name:"Senegal",flag:"🇸🇳",conf:"CAF"},{name:"Iraq",flag:"🇮🇶",conf:"AFC"},{name:"Norway",flag:"🇳🇴",conf:"UEFA"} ],
  J:[ {name:"Argentina",flag:"🇦🇷",conf:"CONMEBOL"},{name:"Algeria",flag:"🇩🇿",conf:"CAF"},{name:"Austria",flag:"🇦🇹",conf:"UEFA"},{name:"Jordan",flag:"🇯🇴",conf:"AFC"} ],
  K:[ {name:"Portugal",flag:"🇵🇹",conf:"UEFA"},{name:"DR Congo",flag:"🇨🇩",conf:"CAF"},{name:"Uzbekistan",flag:"🇺🇿",conf:"AFC"},{name:"Colombia",flag:"🇨🇴",conf:"CONMEBOL"} ],
  L:[ {name:"England",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",conf:"UEFA"},{name:"Croatia",flag:"🇭🇷",conf:"UEFA"},{name:"Ghana",flag:"🇬🇭",conf:"CAF"},{name:"Panama",flag:"🇵🇦",conf:"CONCACAF"} ],
};
const ALL_TEAMS = Object.values(GROUPS).flat();
const team = n => ALL_TEAMS.find(t=>t.name===n) || {name:n,flag:"🏳️",conf:""};
const CONF_C = {UEFA:"#2563eb",CONMEBOL:"#059669",CAF:"#d97706",AFC:"#dc2626",CONCACAF:"#C8102E",OFC:"#0891b2"};
const GC = {A:"#1B2A6B",B:"#6B3FA0",C:"#B8860B",D:"#ef4444",E:"#10b981",F:"#009B3A",G:"#2E5DB5",H:"#6B3FA0",I:"#0E7C7B",J:"#E8642C",K:"#1B2A6B",L:"#f97316"};

const NAME_MAP = {
  "korea republic":"South Korea","republic of korea":"South Korea","south korea":"South Korea",
  "bosnia and herzegovina":"Bosnia & Herz.","bosnia-herzegovina":"Bosnia & Herz.","bosnia & herzegovina":"Bosnia & Herz.",
  "côte d'ivoire":"Ivory Coast","cote d'ivoire":"Ivory Coast","ivory coast":"Ivory Coast",
  "cabo verde":"Cape Verde","cape verde":"Cape Verde",
  "congo dr":"DR Congo","dr congo":"DR Congo","dem. rep. congo":"DR Congo",
  "democratic republic of the congo":"DR Congo","congo":"DR Congo",
  "united states":"USA","usa":"USA","türkiye":"Türkiye","turkey":"Türkiye",
  "saudi arabia":"Saudi Arabia","curacao":"Curaçao","curaçao":"Curaçao",
  "czech republic":"Czechia","czechia":"Czechia","south africa":"South Africa",
  mexico:"Mexico",brazil:"Brazil",canada:"Canada",switzerland:"Switzerland",
  qatar:"Qatar",morocco:"Morocco",haiti:"Haiti",scotland:"Scotland",
  paraguay:"Paraguay",australia:"Australia",germany:"Germany",ecuador:"Ecuador",
  netherlands:"Netherlands",japan:"Japan",sweden:"Sweden",tunisia:"Tunisia",
  belgium:"Belgium",iran:"Iran","new zealand":"New Zealand",egypt:"Egypt",
  spain:"Spain",uruguay:"Uruguay",france:"France",senegal:"Senegal",
  iraq:"Iraq",norway:"Norway",argentina:"Argentina",algeria:"Algeria",
  austria:"Austria",jordan:"Jordan",portugal:"Portugal",uzbekistan:"Uzbekistan",
  colombia:"Colombia",england:"England",croatia:"Croatia",ghana:"Ghana",panama:"Panama",
};
const resolve = (raw) => { if(!raw)return raw; return NAME_MAP[raw.toLowerCase().trim()] || raw; };

const RAW_FIXTURES = [
  {g:"A",h:"Mexico",a:"South Africa",date:"Jun 11",time:"3:00 PM",city:"Mexico City",venue:"Estadio Azteca"},
  {g:"A",h:"South Korea",a:"Czechia",date:"Jun 11",time:"10:00 PM",city:"Guadalajara",venue:"Estadio Akron"},
  {g:"B",h:"Canada",a:"Bosnia & Herz.",date:"Jun 12",time:"3:00 PM",city:"Toronto",venue:"BMO Field"},
  {g:"D",h:"USA",a:"Paraguay",date:"Jun 12",time:"9:00 PM",city:"Los Angeles",venue:"SoFi Stadium"},
  {g:"D",h:"Australia",a:"Türkiye",date:"Jun 13",time:"12:00 AM",city:"Vancouver",venue:"BC Place"},
  {g:"B",h:"Qatar",a:"Switzerland",date:"Jun 13",time:"3:00 PM",city:"Santa Clara",venue:"Levi's Stadium"},
  {g:"C",h:"Brazil",a:"Morocco",date:"Jun 13",time:"6:00 PM",city:"East Rutherford",venue:"MetLife Stadium"},
  {g:"C",h:"Haiti",a:"Scotland",date:"Jun 13",time:"9:00 PM",city:"Foxborough",venue:"Gillette Stadium"},
  {g:"E",h:"Germany",a:"Curaçao",date:"Jun 14",time:"1:00 PM",city:"Houston",venue:"NRG Stadium"},
  {g:"E",h:"Ivory Coast",a:"Ecuador",date:"Jun 14",time:"7:00 PM",city:"Philadelphia",venue:"Lincoln Financial Field"},
  {g:"F",h:"Netherlands",a:"Japan",date:"Jun 14",time:"4:00 PM",city:"Arlington",venue:"AT&T Stadium"},
  {g:"F",h:"Sweden",a:"Tunisia",date:"Jun 14",time:"10:00 PM",city:"Monterrey",venue:"Estadio BBVA"},
  {g:"G",h:"Belgium",a:"Egypt",date:"Jun 15",time:"1:00 PM",city:"Miami",venue:"Hard Rock Stadium"},
  {g:"G",h:"Iran",a:"New Zealand",date:"Jun 15",time:"9:00 PM",city:"Los Angeles",venue:"SoFi Stadium"},
  {g:"H",h:"Spain",a:"Cape Verde",date:"Jun 15",time:"4:00 PM",city:"Atlanta",venue:"Mercedes-Benz Stadium"},
  {g:"H",h:"Saudi Arabia",a:"Uruguay",date:"Jun 15",time:"6:00 PM",city:"Miami",venue:"Hard Rock Stadium"},
  {g:"I",h:"France",a:"Senegal",date:"Jun 16",time:"3:00 PM",city:"East Rutherford",venue:"MetLife Stadium"},
  {g:"I",h:"Iraq",a:"Norway",date:"Jun 16",time:"6:00 PM",city:"Foxborough",venue:"Gillette Stadium"},
  {g:"J",h:"Argentina",a:"Algeria",date:"Jun 16",time:"9:00 PM",city:"Kansas City",venue:"Arrowhead Stadium"},
  {g:"J",h:"Austria",a:"Jordan",date:"Jun 17",time:"12:00 AM",city:"Santa Clara",venue:"Levi's Stadium"},
  {g:"K",h:"Portugal",a:"DR Congo",date:"Jun 17",time:"1:00 PM",city:"Houston",venue:"NRG Stadium"},
  {g:"K",h:"Uzbekistan",a:"Colombia",date:"Jun 17",time:"10:00 PM",city:"Mexico City",venue:"Estadio Azteca"},
  {g:"L",h:"England",a:"Croatia",date:"Jun 17",time:"4:00 PM",city:"Arlington",venue:"AT&T Stadium"},
  {g:"L",h:"Ghana",a:"Panama",date:"Jun 17",time:"7:00 PM",city:"Toronto",venue:"BMO Field"},
  {g:"A",h:"Czechia",a:"South Africa",date:"Jun 18",time:"12:00 PM",city:"Atlanta",venue:"Mercedes-Benz Stadium"},
  {g:"A",h:"Mexico",a:"South Korea",date:"Jun 18",time:"9:00 PM",city:"Guadalajara",venue:"Estadio Akron"},
  {g:"B",h:"Switzerland",a:"Bosnia & Herz.",date:"Jun 18",time:"3:00 PM",city:"Los Angeles",venue:"SoFi Stadium"},
  {g:"B",h:"Canada",a:"Qatar",date:"Jun 18",time:"6:00 PM",city:"Vancouver",venue:"BC Place"},
  {g:"D",h:"USA",a:"Australia",date:"Jun 19",time:"4:00 PM",city:"Arlington",venue:"AT&T Stadium"},
  {g:"D",h:"Türkiye",a:"Paraguay",date:"Jun 19",time:"10:00 PM",city:"Santa Clara",venue:"Levi's Stadium"},
  {g:"C",h:"Scotland",a:"Morocco",date:"Jun 19",time:"6:00 PM",city:"Foxborough",venue:"Gillette Stadium"},
  {g:"C",h:"Brazil",a:"Haiti",date:"Jun 19",time:"8:30 PM",city:"Miami",venue:"Hard Rock Stadium"},
  {g:"E",h:"Germany",a:"Ivory Coast",date:"Jun 20",time:"4:00 PM",city:"Toronto",venue:"BMO Field"},
  {g:"E",h:"Ecuador",a:"Curaçao",date:"Jun 20",time:"8:00 PM",city:"Kansas City",venue:"Arrowhead Stadium"},
  {g:"F",h:"Netherlands",a:"Sweden",date:"Jun 20",time:"1:00 PM",city:"Houston",venue:"NRG Stadium"},
  {g:"F",h:"Tunisia",a:"Japan",date:"Jun 20",time:"12:00 AM",city:"Monterrey",venue:"Estadio BBVA"},
  {g:"G",h:"Belgium",a:"Iran",date:"Jun 21",time:"3:00 PM",city:"Los Angeles",venue:"SoFi Stadium"},
  {g:"G",h:"New Zealand",a:"Egypt",date:"Jun 21",time:"9:00 PM",city:"Vancouver",venue:"BC Place"},
  {g:"H",h:"Spain",a:"Saudi Arabia",date:"Jun 21",time:"12:00 PM",city:"Atlanta",venue:"Mercedes-Benz Stadium"},
  {g:"H",h:"Uruguay",a:"Cape Verde",date:"Jun 21",time:"6:00 PM",city:"Miami",venue:"Hard Rock Stadium"},
  {g:"I",h:"France",a:"Iraq",date:"Jun 22",time:"5:00 PM",city:"Philadelphia",venue:"Lincoln Financial Field"},
  {g:"I",h:"Norway",a:"Senegal",date:"Jun 22",time:"8:00 PM",city:"East Rutherford",venue:"MetLife Stadium"},
  {g:"J",h:"Argentina",a:"Austria",date:"Jun 22",time:"1:00 PM",city:"Arlington",venue:"AT&T Stadium"},
  {g:"J",h:"Jordan",a:"Algeria",date:"Jun 22",time:"11:00 PM",city:"Santa Clara",venue:"Levi's Stadium"},
  {g:"K",h:"Portugal",a:"Uzbekistan",date:"Jun 23",time:"1:00 PM",city:"Houston",venue:"NRG Stadium"},
  {g:"K",h:"Colombia",a:"DR Congo",date:"Jun 23",time:"7:00 PM",city:"Guadalajara",venue:"Estadio Akron"},
  {g:"L",h:"England",a:"Ghana",date:"Jun 23",time:"4:00 PM",city:"East Rutherford",venue:"MetLife Stadium"},
  {g:"L",h:"Panama",a:"Croatia",date:"Jun 23",time:"10:00 PM",city:"Seattle",venue:"Lumen Field"},
  {g:"A",h:"Czechia",a:"Mexico",date:"Jun 24",time:"9:00 PM",city:"Mexico City",venue:"Estadio Azteca"},
  {g:"A",h:"South Africa",a:"South Korea",date:"Jun 24",time:"9:00 PM",city:"Monterrey",venue:"Estadio BBVA"},
  {g:"B",h:"Switzerland",a:"Canada",date:"Jun 24",time:"3:00 PM",city:"Vancouver",venue:"BC Place"},
  {g:"B",h:"Bosnia & Herz.",a:"Qatar",date:"Jun 24",time:"3:00 PM",city:"Seattle",venue:"Lumen Field"},
  {g:"C",h:"Morocco",a:"Haiti",date:"Jun 24",time:"6:00 PM",city:"Atlanta",venue:"Mercedes-Benz Stadium"},
  {g:"C",h:"Scotland",a:"Brazil",date:"Jun 24",time:"6:00 PM",city:"Philadelphia",venue:"Lincoln Financial Field"},
  {g:"D",h:"Türkiye",a:"USA",date:"Jun 25",time:"10:00 PM",city:"Los Angeles",venue:"SoFi Stadium"},
  {g:"D",h:"Paraguay",a:"Australia",date:"Jun 25",time:"10:00 PM",city:"Santa Clara",venue:"Levi's Stadium"},
  {g:"E",h:"Curaçao",a:"Ivory Coast",date:"Jun 25",time:"4:00 PM",city:"Philadelphia",venue:"Lincoln Financial Field"},
  {g:"E",h:"Ecuador",a:"Germany",date:"Jun 25",time:"4:00 PM",city:"East Rutherford",venue:"MetLife Stadium"},
  {g:"F",h:"Japan",a:"Sweden",date:"Jun 25",time:"7:00 PM",city:"Arlington",venue:"AT&T Stadium"},
  {g:"F",h:"Tunisia",a:"Netherlands",date:"Jun 25",time:"7:00 PM",city:"Kansas City",venue:"Arrowhead Stadium"},
  {g:"G",h:"New Zealand",a:"Belgium",date:"Jun 26",time:"10:00 PM",city:"Seattle",venue:"Lumen Field"},
  {g:"G",h:"Egypt",a:"Iran",date:"Jun 26",time:"10:00 PM",city:"Santa Clara",venue:"Levi's Stadium"},
  {g:"H",h:"Cape Verde",a:"Saudi Arabia",date:"Jun 26",time:"8:00 PM",city:"Houston",venue:"NRG Stadium"},
  {g:"H",h:"Uruguay",a:"Spain",date:"Jun 26",time:"8:00 PM",city:"Guadalajara",venue:"Estadio Akron"},
  {g:"I",h:"Norway",a:"France",date:"Jun 26",time:"3:00 PM",city:"Foxborough",venue:"Gillette Stadium"},
  {g:"I",h:"Senegal",a:"Iraq",date:"Jun 26",time:"3:00 PM",city:"Toronto",venue:"BMO Field"},
  {g:"J",h:"Algeria",a:"Austria",date:"Jun 27",time:"7:00 PM",city:"Kansas City",venue:"Arrowhead Stadium"},
  {g:"J",h:"Jordan",a:"Argentina",date:"Jun 27",time:"7:00 PM",city:"Arlington",venue:"AT&T Stadium"},
  {g:"K",h:"DR Congo",a:"Uzbekistan",date:"Jun 27",time:"4:00 PM",city:"Monterrey",venue:"Estadio BBVA"},
  {g:"K",h:"Colombia",a:"Portugal",date:"Jun 27",time:"4:00 PM",city:"Miami",venue:"Hard Rock Stadium"},
  {g:"L",h:"Panama",a:"England",date:"Jun 27",time:"10:00 PM",city:"East Rutherford",venue:"MetLife Stadium"},
  {g:"L",h:"Croatia",a:"Ghana",date:"Jun 27",time:"10:00 PM",city:"Foxborough",venue:"Gillette Stadium"},
];

const MATCH_DATES = [...new Set(RAW_FIXTURES.map(f=>f.date))];

function initFixtures() {
  return RAW_FIXTURES.map((f,i)=>({
    id:i, group:f.g, home:f.h, away:f.a, date:f.date, time:f.time, city:f.city, venue:f.venue,
    status:"upcoming", // próximos | live | ft
    homeScore:null, awayScore:null,
    events:[], // {type:'goal'|'yellow'|'red'|'sub', player:str, team:str, minute:int, detail:str}
    stats:null, // {possession:[h,a], shots:[h,a], shotsOnTarget:[h,a],esquinas:[h,a], fouls:[h,a]}
    potm:"", // player of the match
  }));
}

// Demo data for simulation
const DEMO_DATA = {
  0: {status:"ft",homeScore:2,awayScore:1,potm:"Santiago Giménez",
    events:[{type:"goal",player:"Santiago Giménez",team:"Mexico",minute:23,detail:"Gol"},{type:"goal",player:"Percy Tau",team:"South Africa",minute:51,detail:"Gol"},{type:"goal",player:"Edson Álvarez",team:"Mexico",minute:78,detail:"Cabezazo"}],
    stats:{possession:[57,43],shots:[14,8],shotsOnTarget:[6,3],corners:[7,4],fouls:[11,13]}},
  1: {status:"ft",homeScore:1,awayScore:1,potm:"Patrik Schick",
    events:[{type:"goal",player:"Son Heung-min",team:"South Korea",minute:34,detail:"Gol"},{type:"yellow",player:"Tomáš Souček",team:"Czechia",minute:41,detail:"Falta"},{type:"goal",player:"Patrik Schick",team:"Czechia",minute:67,detail:"Penal"}],
    stats:{possession:[48,52],shots:[10,12],shotsOnTarget:[4,5],corners:[5,6],fouls:[14,10]}},
  2: {status:"ft",homeScore:2,awayScore:0,potm:"Alphonso Davies",
    events:[{type:"goal",player:"Alphonso Davies",team:"Canada",minute:17,detail:"Gol"},{type:"goal",player:"Jonathan David",team:"Canada",minute:55,detail:"Gol"},{type:"yellow",player:"Ermedin Demirović",team:"Bosnia & Herz.",minute:63,detail:"Falta"}],
    stats:{possession:[54,46],shots:[16,7],shotsOnTarget:[7,2],corners:[8,3],fouls:[9,15]}},
  3: {status:"live",homeScore:1,awayScore:1,potm:"",
    events:[{type:"goal",player:"Christian Pulisic",team:"USA",minute:28,detail:"Gol"},{type:"goal",player:"Miguel Almirón",team:"Paraguay",minute:44,detail:"Tiro Libre"},{type:"yellow",player:"Weston McKennie",team:"USA",minute:52,detail:"Falta"}],
    stats:{possession:[61,39],shots:[11,6],shotsOnTarget:[5,3],corners:[6,2],fouls:[8,11]}},
  4: {status:"upcoming",homeScore:null,awayScore:null,potm:"",events:[],stats:null},
  5: {status:"upcoming",homeScore:null,awayScore:null,potm:"",events:[],stats:null},
};

const DEMO_PLAYERS = [
  {name:"Che",group:"friends_usa",champion:"Argentina",goldenBoot:"Álvarez",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Uruguay",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:1,a:0},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:1},3:{r:"W",h:3,a:0}}},
  {name:"Chucky",group:"friends_usa",champion:"Argentina",goldenBoot:"Mbappé",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"D",h:1,a:1},2:{r:"W",h:1,a:0},3:{r:"W",h:2,a:0}}},
  {name:"Duva",group:"friends_usa",champion:"Brazil",goldenBoot:"Vinícius Jr.",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Brazil",D:"Türkiye",E:"Ecuador",F:"Japan",G:"Egypt",H:"Uruguay",I:"France",J:"Argentina",K:"Colombia",L:"Croatia"},
    matches:{0:{r:"D",h:1,a:1},1:{r:"W",h:2,a:0},2:{r:"W",h:3,a:1},3:{r:"D",h:1,a:1}}},
  {name:"Fercho",group:"friends_usa",champion:"Spain",goldenBoot:"Yamal",
    groupWinners:{A:"South Korea",B:"Canada",C:"Morocco",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:3,a:0},1:{r:"D",h:0,a:0},2:{r:"W",h:2,a:0},3:{r:"W",h:3,a:1}}},
  {name:"Helder",group:"friends_usa",champion:"France",goldenBoot:"Haaland",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Japan",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:1,a:0},1:{r:"W",h:2,a:1},2:{r:"D",h:0,a:0},3:{r:"D",h:0,a:0}}},
  {name:"Javi",group:"friends_usa",champion:"Germany",goldenBoot:"Musiala",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"Norway",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"L",h:0,a:2},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:1},3:{r:"L",h:0,a:1}}},
  {name:"Juani",group:"friends_usa",champion:"Argentina",goldenBoot:"Messi",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:2,a:0},1:{r:"L",h:0,a:2},2:{r:"W",h:2,a:0},3:{r:"W",h:2,a:1}}},
  {name:"Marcel",group:"friends_usa",champion:"England",goldenBoot:"Kane",
    groupWinners:{A:"Czechia",B:"Switzerland",C:"Morocco",D:"Türkiye",E:"Ecuador",F:"Japan",G:"Egypt",H:"Uruguay",I:"Norway",J:"Algeria",K:"Colombia",L:"England"},
    matches:{0:{r:"D",h:0,a:0},1:{r:"W",h:3,a:1},2:{r:"L",h:0,a:1},3:{r:"D",h:2,a:2}}},
  {name:"Papo",group:"friends_usa",champion:"Colombia",goldenBoot:"Luis Díaz",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:0},3:{r:"D",h:1,a:1}}},
  {name:"Stui",group:"friends_usa",champion:"France",goldenBoot:"Mbappé",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Brazil",D:"USA",E:"Germany",F:"Japan",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"Croatia"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"W",h:3,a:1},2:{r:"D",h:1,a:1},3:{r:"D",h:0,a:0}}},
  {name:"Arieh",group:"family",champion:"Argentina",goldenBoot:"Mbappé",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:3,a:1},1:{r:"D",h:2,a:2},2:{r:"W",h:1,a:0},3:{r:"W",h:2,a:0}}},
  {name:"Cata",group:"family",champion:"France",goldenBoot:"Haaland",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Morocco",D:"USA",E:"Germany",F:"Japan",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"Croatia"},
    matches:{0:{r:"W",h:1,a:0},1:{r:"W",h:2,a:0},2:{r:"D",h:1,a:1},3:{r:"D",h:1,a:1}}},
  {name:"Chica",group:"family",champion:"Brazil",goldenBoot:"Vinícius Jr.",
    groupWinners:{A:"South Korea",B:"Canada",C:"Brazil",D:"Türkiye",E:"Ivory Coast",F:"Netherlands",G:"Egypt",H:"Uruguay",I:"Senegal",J:"Argentina",K:"Portugal",L:"Croatia"},
    matches:{0:{r:"L",h:0,a:1},1:{r:"D",h:1,a:1},2:{r:"W",h:3,a:0},3:{r:"L",h:0,a:2}}},
  {name:"Jorge",group:"family",champion:"Colombia",goldenBoot:"Luis Díaz",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"Paraguay",E:"Ecuador",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:2,a:0},1:{r:"W",h:3,a:2},2:{r:"W",h:2,a:0},3:{r:"W",h:1,a:0}}},
  {name:"Map",group:"family",champion:"Mexico",goldenBoot:"Santiago Giménez",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:3,a:0},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:1},3:{r:"W",h:3,a:0}}},
  {name:"Milo",group:"family",champion:"Spain",goldenBoot:"Yamal",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"L",h:0,a:1},2:{r:"D",h:0,a:0},3:{r:"D",h:0,a:0}}},
  {name:"Papo_Fam",group:"family",champion:"Argentina",goldenBoot:"Messi",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:0},3:{r:"W",h:2,a:0}}},
  {name:"Sebas",group:"family",champion:"Brazil",goldenBoot:"Vinícius Jr.",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Japan",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:2,a:0},1:{r:"D",h:1,a:1},2:{r:"W",h:1,a:0},3:{r:"D",h:0,a:0}}},
  // Amigos Colombia
  {name:"Chami",group:"friends_co",champion:"Colombia",goldenBoot:"Luis Díaz",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"D",h:0,a:0},2:{r:"W",h:2,a:0},3:{r:"D",h:1,a:1}}},
  {name:"Charly",group:"friends_co",champion:"Argentina",goldenBoot:"Messi",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Brazil",D:"USA",E:"Germany",F:"Japan",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:1,a:0},1:{r:"W",h:2,a:1},2:{r:"D",h:1,a:1},3:{r:"W",h:2,a:0}}},
  {name:"Fan",group:"friends_co",champion:"Brazil",goldenBoot:"Vinícius Jr.",
    groupWinners:{A:"Mexico",B:"Canada",C:"Morocco",D:"Türkiye",E:"Ecuador",F:"Netherlands",G:"Egypt",H:"Uruguay",I:"France",J:"Argentina",K:"Colombia",L:"Croatia"},
    matches:{0:{r:"D",h:1,a:1},1:{r:"D",h:1,a:1},2:{r:"W",h:3,a:0},3:{r:"L",h:0,a:2}}},
  {name:"Fede",group:"friends_co",champion:"Colombia",goldenBoot:"Jhon Durán",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:3,a:0},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:1},3:{r:"W",h:1,a:0}}},
  {name:"Flaco",group:"friends_co",champion:"Spain",goldenBoot:"Yamal",
    groupWinners:{A:"South Korea",B:"Switzerland",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"L",h:0,a:1},2:{r:"D",h:0,a:0},3:{r:"D",h:2,a:2}}},
  {name:"Jose",group:"friends_co",champion:"Argentina",goldenBoot:"Mbappé",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"W",h:2,a:0},1:{r:"D",h:1,a:1},2:{r:"W",h:1,a:0},3:{r:"W",h:3,a:1}}},
  {name:"Juan",group:"friends_co",champion:"France",goldenBoot:"Haaland",
    groupWinners:{A:"Mexico",B:"Switzerland",C:"Brazil",D:"USA",E:"Germany",F:"Japan",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"Croatia"},
    matches:{0:{r:"L",h:0,a:2},1:{r:"W",h:2,a:0},2:{r:"W",h:2,a:0},3:{r:"D",h:0,a:0}}},
  {name:"Kiko",group:"friends_co",champion:"Colombia",goldenBoot:"Luis Díaz",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"Paraguay",E:"Ecuador",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:1,a:0},1:{r:"D",h:2,a:2},2:{r:"W",h:2,a:1},3:{r:"W",h:2,a:0}}},
  {name:"Lucho",group:"friends_co",champion:"Germany",goldenBoot:"Musiala",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Uruguay",I:"Norway",J:"Argentina",K:"Portugal",L:"England"},
    matches:{0:{r:"D",h:0,a:0},1:{r:"W",h:3,a:1},2:{r:"L",h:0,a:1},3:{r:"W",h:2,a:1}}},
  {name:"Mario",group:"friends_co",champion:"Colombia",goldenBoot:"Jhon Durán",
    groupWinners:{A:"Mexico",B:"Canada",C:"Brazil",D:"USA",E:"Germany",F:"Netherlands",G:"Belgium",H:"Spain",I:"France",J:"Argentina",K:"Colombia",L:"England"},
    matches:{0:{r:"W",h:2,a:1},1:{r:"D",h:1,a:1},2:{r:"W",h:2,a:0},3:{r:"W",h:1,a:0}}},
];

// ─────────────────────────────────────────────
//  FONTS
// ─────────────────────────────────────────────
const fl=document.createElement("link");
fl.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap";
fl.rel="stylesheet";document.head.appendChild(fl);
// Hide scrollbar on mobile nav
const mobileCSS = document.createElement("style");
mobileCSS.textContent = `*{-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:4px}@media(max-width:768px){.nav-scroll::-webkit-scrollbar{display:none}}`;
document.head.appendChild(mobileCSS);

// Countdown to World Cup kickoff: June 11, 2026
// Mobile detection
function useIsMobile(bp=768) {
  const [m, setM] = useState(typeof window!=="undefined" && window.innerWidth < bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

const WC_START = new Date("2026-06-11T17:00:00-04:00").getTime();
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id); }, []);
  const diff = WC_START - now;
  if(diff <= 0) return <span style={{fontSize:12,fontWeight:700,color:"#10b981"}}>⚽ EN VIVO</span>;
  const days = Math.ceil(diff/86400000);
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontFamily:fb,fontSize:28,color:"#D4A843",lineHeight:1}}>{days}</span>
      <span style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:600,lineHeight:1.2}} dangerouslySetInnerHTML={{__html:_t.daysToWC.replace("\\n","<br/>")}}/>
    </div>
  );
}

const ff = "'Outfit',sans-serif";
const fb = "'Bebas Neue',sans-serif";

// ─────────────────────────────────────────────
//  STANDINGS CALC
// ─────────────────────────────────────────────
function calcStandings(g, fixtures) {
  const t={};
  GROUPS[g].forEach(tm=>{t[tm.name]={...tm,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}});
  fixtures.filter(f=>f.group===g&&(f.status==="ft"||f.status==="live")).forEach(f=>{
    const h=t[f.home],a=t[f.away]; if(!h||!a)return;
    h.mp++;a.mp++;h.gf+=f.homeScore||0;h.ga+=f.awayScore||0;a.gf+=f.awayScore||0;a.ga+=f.homeScore||0;
    if((f.homeScore||0)>(f.awayScore||0)){h.w++;h.pts+=3;a.l++}
    else if((f.homeScore||0)<(f.awayScore||0)){a.w++;a.pts+=3;h.l++}
    else{h.d++;a.d++;h.pts++;a.pts++}
    h.gd=h.gf-h.ga;a.gd=a.gf-a.ga;
  });
  return Object.values(t).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
}

// ─────────────────────────────────────────────
//  STATUS BADGE
// ─────────────────────────────────────────────
function EstadoBadge({status}) {
  const t=_t;
  const cfg = {
    ft:{bg:"rgba(16,185,129,.12)",color:"#10b981",label:t.statusFt},
    live:{bg:"rgba(239,68,68,.15)",color:"#ef4444",label:t.statusLive},
    upcoming:{bg:"rgba(100,116,139,.12)",color:"#6B7280",label:t.statusUpcoming},
  }[status]||{bg:"rgba(100,116,139,.12)",color:"#6B7280",label:status};
  return <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:cfg.bg,color:cfg.color,letterSpacing:.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{cfg.label}</span>;
}

// ─────────────────────────────────────────────
//  GAME CARD (left list)
// ─────────────────────────────────────────────
function GameCard({match:m, selected, onClick}) {
  const t=_t;
  const ht=team(m.home), at=team(m.away);
  const isSel = selected?.id===m.id;
  return (
    <div onClick={()=>onClick(m)} style={{
      padding:"14px 16px", borderRadius:14, cursor:"pointer", transition:"all .15s",
      background: isSel ? "rgba(6,182,212,.08)" : "rgba(255,255,255,.02)",
      border: `1px solid ${isSel ? "rgba(6,182,212,.3)" : "rgba(0,0,0,.06)"}`,
      marginBottom:8,
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,color:"#4B5563",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>
          Group {m.group} · {m.date} · {m.time}
        </span>
        <EstadoBadge status={m.status}/>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:20}}>{ht.flag}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#1F2937"}}>{m.home}</span>
        </div>
        <span style={{fontFamily:fb,fontSize:22,color:"#1B2A6B",minWidth:24,textAlign:"center"}}>{m.status!=="upcoming"?m.homeScore:"—"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:20}}>{at.flag}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#1F2937"}}>{m.away}</span>
        </div>
        <span style={{fontFamily:fb,fontSize:22,color:"#1B2A6B",minWidth:24,textAlign:"center"}}>{m.status!=="upcoming"?m.awayScore:"—"}</span>
      </div>
      <div style={{fontSize:12,color:"#6B7280",marginTop:6,display:"flex",alignItems:"center",gap:4}}>
        <span style={{color:"#4B5563"}}>📍</span> {m.city} · {m.venue}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MATCH DETAIL PANEL (right side)
// ─────────────────────────────────────────────
function MatchDetail({match:m, onEdit}) {
  const t=_t;
  const mobile=useIsMobile();
  if(!m) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#6B7280",fontSize:14,padding:40,textAlign:"center"}}>
      Selecciona un partido de la lista para ver detalles, eventos y estadísticas.
    </div>
  );
  const ht=team(m.home), at=team(m.away);
  const goalEvents = (m.events||[]).filter(e=>e.type==="goal");
  const otherEvents = (m.events||[]).filter(e=>e.type!=="goal");

  return (
    <div style={{padding:"24px 20px",overflow:"auto",height:"100%"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <span style={{fontSize:12,color:"#4B5563",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase"}}>
            FASE DE GRUPOS · GRUPO {m.group}
          </span>
          <div style={{fontFamily:fb,fontSize:28,letterSpacing:2,color:"#1F2937",marginTop:4}}>
            {m.home} vs {m.away}
          </div>
        </div>
        <EstadoBadge status={m.status}/>
      </div>

      {/* Goles display */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:32,padding:"24px 0",background:"#FFFFFF",borderRadius:16,marginBottom:20}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:52,lineHeight:1}}>{ht.flag}</div>
          <div style={{fontSize:14,fontWeight:600,marginTop:8,color:"#1F2937"}}>{m.home}</div>
        </div>
        <div style={{textAlign:"center"}}>
          {m.status !== "upcoming" ? (
            <div style={{fontFamily:fb,fontSize:mobile?40:56,color:"#1B2A6B",letterSpacing:4}}>
              {m.homeScore}<span style={{color:"#9CA3AF",margin:"0 6px"}}>:</span>{m.awayScore}
            </div>
          ) : (
            <div style={{fontFamily:fb,fontSize:mobile?20:28,color:"#9CA3AF",letterSpacing:4}}>VS</div>
          )}
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:52,lineHeight:1}}>{at.flag}</div>
          <div style={{fontSize:14,fontWeight:600,marginTop:8,color:"#1F2937"}}>{m.away}</div>
        </div>
      </div>

      {/* Info pills */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
        <InfoPill icon="📅" text={`${m.date} · ${m.time}`}/>
        <InfoPill icon="🏟️" text={m.venue}/>
        {m.potm && <InfoPill icon="⭐" text={`${t.potmLabel} ${m.potm}`} accent/>}
      </div>

      {/* Edit button */}
      <button onClick={()=>onEdit(m)} style={{
        padding:"8px 18px",borderRadius:10,border:"1px solid rgba(0,0,0,.1)",cursor:"pointer",
        background:"#F3F4F6",border:"1px solid #E5E7EB",color:"#4B5563",fontSize:12,fontWeight:600,fontFamily:ff,
        marginBottom:24,transition:"all .15s",
      }}>{`✏️ ${t.editMatch}`}</button>

      {/* Two columns: Events + Stats */}
      <div style={{display:"grid",gridTemplateColumns: m.stats?"1fr 1fr":"1fr",gap:20}}>
        {/* Events */}
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#6B7280",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            ⚽ Eventos del Partido
          </div>
          {(m.events||[]).length===0 ? (
            <div style={{fontSize:12,color:"#6B7280"}}>{t.noEvents}</div>
          ) : (
            <div>{(m.events||[]).map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F3F4F6"}}>
                <div style={{fontFamily:fb,fontSize:20,color:e.type==="goal"?"#D4A843":e.type==="yellow"?"#CA8A04":"#ef4444",minWidth:36,textAlign:"right"}}>{e.minute}'</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1F2937"}}>{e.player}</div>
                  <div style={{fontSize:12,color:"#4B5563"}}>{e.team} · {e.detail || e.type}</div>
                </div>
              </div>
            ))}</div>
          )}
        </div>

        {/* Stats */}
        {m.stats && (
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#6B7280",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
              📊 Estadísticas en Vivo
            </div>
            <PossessionBar home={m.stats.possession[0]} away={m.stats.possession[1]}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
              <StatBox label={t.shots} homeVal={m.stats.shots[0]} awayVal={m.stats.shots[1]} homeName={m.home} awayName={m.away}/>
              <StatBox label={t.shotsOnTarget} homeVal={m.stats.shotsOnTarget[0]} awayVal={m.stats.shotsOnTarget[1]} homeName={m.home} awayName={m.away}/>
              <StatBox label={t.corners} homeVal={m.stats.corners[0]} awayVal={m.stats.corners[1]} homeName={m.home} awayName={m.away}/>
              <StatBox label={t.fouls} homeVal={m.stats.fouls[0]} awayVal={m.stats.fouls[1]} homeName={m.home} awayName={m.away}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPill({icon,text,accent}) {
  return <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:10,
    background:accent?"rgba(245,158,11,.1)":"rgba(0,0,0,.05)",
    border:`1px solid ${accent?"rgba(245,158,11,.2)":"rgba(0,0,0,.08)"}`,
    fontSize:12,fontWeight:500,color:accent?"#D4A843":"#cbd5e1"}}>{icon} {text}</div>;
}

function PossessionBar({home,away}) {
  const t=_t;
  return (
    <div style={{marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6B7280",marginBottom:6,fontWeight:600}}>
        <span>{t.possession}</span><span>{home}% / {away}%</span>
      </div>
      <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",background:"#F3F4F6"}}>
        <div style={{width:`${home}%`,background:"linear-gradient(90deg,#1B2A6B,#2E5DB5)",borderRadius:"4px 0 0 4px",transition:"width .5s"}}/>
        <div style={{width:`${away}%`,background:"linear-gradient(90deg,#009B3A,#E8642C)",borderRadius:"0 4px 4px 0",transition:"width .5s"}}/>
      </div>
    </div>
  );
}

function StatBox({label,homeVal,awayVal,homeName,awayName}) {
  const t=_t;
  return (
    <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.06)",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{fontFamily:fb,fontSize:24,color:"#1B2A6B"}}>{homeVal}</span>
        <span style={{fontFamily:fb,fontSize:24,color:"#C8102E"}}>{awayVal}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#4B5563",textTransform:"uppercase",letterSpacing:.5}}>
        <span>{homeName}</span><span>{label}</span><span>{awayName}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  EDIT MODAL
// ─────────────────────────────────────────────
function EditModal({match:m, onSave, onClose}) {
  const t=_t;
  const [data, setData] = useState({
    status: m.status,
    homeScore: m.homeScore!=null ? String(m.homeScore) : "",
    awayScore: m.awayScore!=null ? String(m.awayScore) : "",
    potm: m.potm || "",
    eventsText: (m.events||[]).map(e=>`${e.type}|${e.player}|${e.team}|${e.minute}|${e.detail||""}`).join("\n"),
    possession: m.stats?.possession?.join(",") || "",
    shots: m.stats?.shots?.join(",") || "",
    sot: m.stats?.shotsOnTarget?.join(",") || "",
   esquinas: m.stats?.corners?.join(",") || "",
    fouls: m.stats?.fouls?.join(",") || "",
  });
  const upd = (k,v) => setData(p=>({...p,[k]:v}));
  const parsePair = s => { const p=s.split(",").map(Number); return p.length===2&&p.every(n=>!isNaN(n)) ? p : null; };

  const save = () => {
    const events = data.eventsText.trim().split("\n").filter(Boolean).map(line=>{
      const [type,player,tm,min,detail] = line.split("|");
      return {type:type||"goal",player:player||"",team:tm||"",minute:parseInt(min)||0,detail:detail||""};
    });
    const stats = (data.possession||data.shots) ? {
      possession: parsePair(data.possession)||[50,50],
      shots: parsePair(data.shots)||[0,0],
      shotsOnTarget: parsePair(data.sot)||[0,0],
     esquinas: parsePair(data.corners)||[0,0],
      fouls: parsePair(data.fouls)||[0,0],
    } : null;
    onSave({
      ...m, status:data.status,
      homeScore: data.homeScore!=="" ? parseInt(data.homeScore) : null,
      awayScore: data.awayScore!=="" ? parseInt(data.awayScore) : null,
      potm: data.potm, events, stats,
    });
  };

  const fieldStyle = {width:"100%",padding:"8px 12px",background:"#F3F4F6",border:"1px solid #D1D5DB",borderRadius:8,color:"#1F2937",fontSize:13,fontFamily:ff,outline:"none",boxSizing:"border-box"};
  const labelStyle = {fontSize:12,fontWeight:600,color:"#4B5563",textTransform:"uppercase",letterSpacing:1.2,marginBottom:4,display:"block"};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.1)",borderRadius:20,maxWidth:560,width:"100%",maxHeight:"90vh",overflow:"auto",padding:"24px 20px"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontFamily:fb,fontSize:20,letterSpacing:3,color:"#1B2A6B"}}>{t.editTitle}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#4B5563",fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{fontWeight:600,fontSize:14,marginBottom:16,color:"#1F2937"}}>{m.home} vs {m.away}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          <div><label style={labelStyle}>Estado</label>
            <select value={data.status} onChange={e=>upd("status",e.target.value)} style={{...fieldStyle,cursor:"pointer"}}>
              <option value="upcoming">Próximo</option><option value="live">En Vivo</option><option value="ft">Final</option>
            </select></div>
          <div><label style={labelStyle}>{m.home} Goles</label><input type="number" min="0" value={data.homeScore} onChange={e=>upd("homeScore",e.target.value)} style={fieldStyle}/></div>
          <div><label style={labelStyle}>{m.away} Goles</label><input type="number" min="0" value={data.awayScore} onChange={e=>upd("awayScore",e.target.value)} style={fieldStyle}/></div>
        </div>

        <div style={{marginBottom:16}}><label style={labelStyle}>Jugador del Partido</label><input value={data.potm} onChange={e=>upd("potm",e.target.value)} style={fieldStyle} placeholder="e.g. Mbappé"/></div>

        <div style={{marginBottom:16}}><label style={labelStyle}>Eventos (uno por línea: type|player|team|minute|detail)</label>
          <textarea value={data.eventsText} onChange={e=>upd("eventsText",e.target.value)} rows={4} style={{...fieldStyle,resize:"vertical"}} placeholder={"goal|Messi|Argentina|23|Gol\nyellow|Souček|Czechia|41|Falta"}/></div>

        <div style={{fontWeight:600,fontSize:12,color:"#6B7280",marginBottom:8}}>Estadísticas (local,visitante)</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <div><label style={labelStyle}>Posesión %</label><input value={data.possession} onChange={e=>upd("possession",e.target.value)} style={fieldStyle} placeholder="57,43"/></div>
          <div><label style={labelStyle}>Tiros</label><input value={data.shots} onChange={e=>upd("shots",e.target.value)} style={fieldStyle} placeholder="14,8"/></div>
          <div><label style={labelStyle}>Tiros a Puerta</label><input value={data.sot} onChange={e=>upd("sot",e.target.value)} style={fieldStyle} placeholder="6,3"/></div>
          <div><label style={labelStyle}>Esquinas</label><input value={data.corners} onChange={e=>upd("corners",e.target.value)} style={fieldStyle} placeholder="7,4"/></div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",background:"#F3F4F6",color:"#6B7280",fontFamily:ff,fontSize:13,fontWeight:600}}>{t.cancel}</button>
          <button onClick={save} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#1B2A6B,#C8102E)",color:"#fff",fontFamily:ff,fontSize:13,fontWeight:600}}>{t.save}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE 1: HOME / TODAY
// ─────────────────────────────────────────────
function HomePage({fixtures, selectedDate, setSelectedDate, selectedMatch, setSelectedMatch, onEdit}) {
  const t=_t;
  const mobile=useIsMobile();
  const dayMatches = useMemo(()=> fixtures.filter(f=>f.date===selectedDate), [fixtures,selectedDate]);
  const jugados = dayMatches.filter(f=>f.status==="ft");
  const live = dayMatches.filter(f=>f.status==="live");
  const upcoming = dayMatches.filter(f=>f.status==="upcoming");

  return (
    <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:0,minHeight:"calc(100vh - 180px)"}}>
      {/* LEFT: Game list */}
      <div style={{borderRight:"1px solid #E5E7EB",padding:"20px 16px",overflow:"auto",maxHeight:mobile?"none":"calc(100vh - 180px)"}}>
        {/* Date nav */}
        <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
          {MATCH_DATES.map(d=>(
            <button key={d} onClick={()=>{setSelectedDate(d);setSelectedMatch(null)}} style={{
              padding:"5px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,.08)",cursor:"pointer",
              fontSize:12,fontWeight:600,fontFamily:ff,transition:"all .15s",
              background:selectedDate===d?"#1B2A6B":"#FFFFFF",
              color:selectedDate===d?"#FFFFFF":"#4B5563",
            }}>{d}</button>
          ))}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <span style={{fontFamily:fb,fontSize:20,letterSpacing:2,color:"#1F2937"}}>{t.todayGames}</span>
          <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,
            background: live.length>0?"rgba(239,68,68,.12)":"rgba(16,185,129,.1)",
            color: live.length>0?"#ef4444":"#10b981",
          }}>{live.length>0?`${live.length} ${t.statusLive}`:t.liveReady}</span>
        </div>
        <p style={{fontSize:12,color:"#4B5563",marginBottom:16,lineHeight:1.5}}>
          Partidos agrupados por día con marcadores y estado. Haz clic en un partido para ver detalles.
        </p>

        {live.length>0 && <>
          <div style={{fontSize:12,fontWeight:700,color:"#ef4444",letterSpacing:1.5,marginBottom:8}}>{t.liveNow}</div>
          {live.map(m=><GameCard key={m.id} match={m} selected={selectedMatch} onClick={setSelectedMatch}/>)}
        </>}
        {jugados.length>0 && <>
          <div style={{fontSize:12,fontWeight:700,color:"#10b981",letterSpacing:1.5,marginBottom:8,marginTop:live.length?16:0}}>{t.completed}</div>
          {jugados.map(m=><GameCard key={m.id} match={m} selected={selectedMatch} onClick={setSelectedMatch}/>)}
        </>}
        {upcoming.length>0 && <>
          <div style={{fontSize:12,fontWeight:700,color:"#6B7280",letterSpacing:1.5,marginBottom:8,marginTop:(jugados.length||live.length)?16:0}}>{t.comingNext}</div>
          {upcoming.map(m=><GameCard key={m.id} match={m} selected={selectedMatch} onClick={setSelectedMatch}/>)}
        </>}
        {dayMatches.length===0 && <div style={{color:"#6B7280",fontSize:13,padding:20}}>{t.noMatches}</div>}
      </div>

      {/* RIGHT: Match detail */}
      <div style={{overflow:"auto",maxHeight:mobile?"none":"calc(100vh - 180px)"}}>
        <MatchDetail match={selectedMatch} onEdit={onEdit}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE 2: FIXTURES
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  KNOCKOUT BRACKET DATA
// ─────────────────────────────────────────────
const KNOCKOUT_INIT = () => ({
  r32: Array.from({length:16},(_,i)=>({id:`r32_${i}`,home:"TBD",away:"TBD",homeScore:null,awayScore:null,status:"upcoming"})),
  r16: Array.from({length:8},(_,i)=>({id:`r16_${i}`,home:"TBD",away:"TBD",homeScore:null,awayScore:null,status:"upcoming"})),
  qf: Array.from({length:4},(_,i)=>({id:`qf_${i}`,home:"TBD",away:"TBD",homeScore:null,awayScore:null,status:"upcoming"})),
  sf: Array.from({length:2},(_,i)=>({id:`sf_${i}`,home:"TBD",away:"TBD",homeScore:null,awayScore:null,status:"upcoming"})),
  final: [{id:"final",home:"TBD",away:"TBD",homeScore:null,awayScore:null,status:"upcoming"}],
  third: [{id:"third",home:"TBD",away:"TBD",homeScore:null,awayScore:null,status:"upcoming"}],
});

function KnockoutBracket({mobile}) {
  const t=_t;
  const [ko, setKo] = useState(KNOCKOUT_INIT());
  const [koView, setKoView] = useState("bracket");

  const roundColors = {r32:"#1B2A6B",r16:"#C8102E",qf:"#009B3A",sf:"#D4A843",final:"#1B2A6B",third:"#6B7280"};
  const roundLabels = {r32:t.roundR32,r16:t.roundR16,qf:t.roundQF,sf:t.roundSF,final:t.roundFinal,third:t.roundThird};

  const MatchCard = ({match, round, compact}) => {
    const ht=team(match.home), at=team(match.away);
    const rc = roundColors[round]||"#1B2A6B";
    return (
      <div style={{background:"#FFFFFF",border:`2px solid ${rc}30`,borderRadius:10,overflow:"hidden",width:compact?150:180,boxShadow:"0 2px 6px rgba(0,0,0,.06)"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#fff",background:rc,padding:"3px 8px",textAlign:"center",letterSpacing:1}}>{roundLabels[round]||round}</div>
        {[{t:match.home,s:match.homeScore,f:ht.flag,win:match.homeScore!=null&&match.homeScore>match.awayScore},
          {t:match.away,s:match.awayScore,f:at.flag,win:match.awayScore!=null&&match.awayScore>match.homeScore}].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 8px",
            borderTop:i?"1px solid #F3F4F6":"none",background:r.win?`${rc}08`:"transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:4,flex:1,minWidth:0}}>
              <span style={{fontSize:13}}>{r.f}</span>
              <span style={{fontSize:12,fontWeight:r.win?700:500,color:r.t==="TBD"?"#9CA3AF":"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.t}</span>
            </div>
            <span style={{fontFamily:fb,fontSize:16,color:r.win?rc:"#1B2A6B",minWidth:18,textAlign:"center"}}>{r.s!=null?r.s:"–"}</span>
          </div>
        ))}
      </div>
    );
  };

  const Connector = ({h,color}) => (
    <div style={{display:"flex",alignItems:"center",flex:"none",width:16}}>
      <svg width="16" height={h} style={{overflow:"visible"}}>
        <path d={`M0,${h*0.25}L8,${h*0.25}L8,${h*0.75}L0,${h*0.75}`} fill="none" stroke={color||"#D1D5DB"} strokeWidth="2"/>
        <path d={`M8,${h*0.5}L16,${h*0.5}`} fill="none" stroke={color||"#D1D5DB"} strokeWidth="2"/>
      </svg>
    </div>
  );

  const RoundCol = ({matches, round, compact}) => (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-around",gap:compact?6:10,alignItems:"center",flex:"none"}}>
      {matches.map(m=><MatchCard key={m.id} match={m} round={round} compact={compact}/>)}
    </div>
  );

  if(mobile) {
    return (<div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[{id:"r32",l:t.r32Short},{id:"bracket",l:t.bracketShort}].map(v=>(
          <button key={v.id} onClick={()=>setKoView(v.id)} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:ff,fontSize:13,fontWeight:700,
            background:koView===v.id?"#1B2A6B":"#FFFFFF",color:koView===v.id?"#FFFFFF":"#4B5563",boxShadow:koView===v.id?"none":"0 1px 3px rgba(0,0,0,.08)"}}>{v.l}</button>
        ))}
      </div>
      {koView==="r32" ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
          {ko.r32.map(m=><MatchCard key={m.id} match={m} round="r32" compact/>)}
        </div>
      ) : (
        <div>
          {[{r:"r16",m:ko.r16},{r:"qf",m:ko.qf},{r:"sf",m:ko.sf},{r:"third",m:ko.third},{r:"final",m:ko.final}].map(({r,m})=>(
            <div key={r} style={{marginBottom:16}}>
              <div style={{fontFamily:fb,fontSize:16,letterSpacing:2,color:roundColors[r],marginBottom:6}}>{(roundLabels[r]||r).toUpperCase()}</div>
              <div style={{display:"grid",gridTemplateColumns:m.length>2?"1fr 1fr":"1fr",gap:8}}>
                {m.map(match=><MatchCard key={match.id} match={match} round={r} compact/>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>);
  }

  // Desktop: R32 as grid, R16+ as bracket
  return (<div>
    <div style={{display:"flex",gap:6,marginBottom:16}}>
      {[{id:"r32",l:t.r32Label},{id:"bracket",l:t.bracketLabel}].map(v=>(
        <button key={v.id} onClick={()=>setKoView(v.id)} style={{padding:"8px 20px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:ff,fontSize:14,fontWeight:700,
          background:koView===v.id?"#1B2A6B":"#FFFFFF",color:koView===v.id?"#FFFFFF":"#4B5563",boxShadow:koView===v.id?"none":"0 1px 3px rgba(0,0,0,.08)"}}>{v.l}</button>
      ))}
    </div>

    {koView==="r32" ? (
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
        {ko.r32.map(m=><MatchCard key={m.id} match={m} round="r32"/>)}
      </div>
    ) : (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,padding:"20px 0"}}>
        {/* Left: R16(4) → QF(2) → SF(1) */}
        <RoundCol matches={ko.r16.slice(0,4)} round="r16"/>
        <Connector h={140} color="#C8102E50"/>
        <RoundCol matches={ko.qf.slice(0,2)} round="qf"/>
        <Connector h={280} color="#009B3A50"/>
        <RoundCol matches={ko.sf.slice(0,1)} round="sf"/>

        {/* Center: Final + 3rd */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px",gap:12}}>
          <div style={{fontFamily:fb,fontSize:24,letterSpacing:3,color:"#D4A843"}}>🏆 FINAL</div>
          <MatchCard match={ko.final[0]} round="final"/>
          <div style={{width:60,height:2,background:"#E5E7EB",margin:"8px 0"}}/>
          <MatchCard match={ko.third[0]} round="third" compact/>
        </div>

        {/* Right: SF(1) → QF(2) → R16(4) */}
        <RoundCol matches={ko.sf.slice(1)} round="sf"/>
        <Connector h={280} color="#009B3A50"/>
        <RoundCol matches={ko.qf.slice(2)} round="qf"/>
        <Connector h={140} color="#C8102E50"/>
        <RoundCol matches={ko.r16.slice(4)} round="r16"/>
      </div>
    )}
  </div>);
}

function FixturesPage({fixtures, onSelect}) {
  const t=_t;
  const mobile=useIsMobile();
  const [phase, setPhase] = useState("groups");
  const [gf, setGf] = useState("ALL");
  const list = gf==="ALL" ? fixtures : fixtures.filter(f=>f.group===gf);
  return (<div style={{padding:"20px 0"}}>
    {/* Phase toggle */}
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[{id:"groups",label:t.groupStage},{id:"knockout",label:t.knockoutStage}].map(p=>(
        <button key={p.id} onClick={()=>setPhase(p.id)} style={{
          padding:"8px 20px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:ff,fontSize:14,fontWeight:700,
          background:phase===p.id?"#1B2A6B":"#FFFFFF",color:phase===p.id?"#FFFFFF":"#4B5563",
          boxShadow:phase===p.id?"none":"0 1px 3px rgba(0,0,0,.08)",
        }}>{p.label}</button>
      ))}
    </div>

    {phase==="knockout" ? <KnockoutBracket mobile={mobile}/> : <>
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20}}>
      <button style={{...fbtn(gf==="ALL")}} onClick={()=>setGf("ALL")}>{t.all}</button>
      {Object.keys(GROUPS).map(g=><button key={g} style={fbtn(gf===g)} onClick={()=>setGf(g)}>{g}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:20}}>
      {Object.keys(GROUPS).filter(g=>gf==="ALL"||gf===g).map(g=>{
        const st = calcStandings(g, fixtures);
        const gMatches = list.filter(f=>f.group===g);
        return (<div key={g} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
          <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",
            background:`linear-gradient(90deg,${GC[g]||"#1B2A6B"}15,transparent)`,borderBottom:`1px solid ${GC[g]||"#1B2A6B"}30`}}>
            <span style={{fontFamily:fb,fontSize:20,letterSpacing:3,color:GC[g]||"#1B2A6B"}}>GROUP {g}</span>
            <span style={{fontSize:12,color:"#4B5563"}}>{gMatches.filter(f=>f.status==="ft").length}/6 {t.played}</span>
          </div>
          {/* Standings mini */}
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["","Equipo","P","W","D","L","GD","Pts"].map(h=><th key={h} style={{padding:"6px 4px",textAlign:h==="Equipo"?"left":"center",color:"#4B5563",fontSize:12,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{st.map((t,i)=>(
              <tr key={t.name} style={{borderTop:"1px solid #F3F4F6",background:i<2?"rgba(16,185,129,.04)":i===2?"rgba(245,158,11,.04)":"transparent"}}>
                <td style={{padding:"6px 4px",textAlign:"center"}}><span style={{width:16,height:16,borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,background:i<2?"rgba(16,185,129,.2)":i===2?"rgba(245,158,11,.2)":"rgba(0,0,0,.06)",color:i<2?"#10b981":i===2?"#D4A843":"#64748b"}}>{i+1}</span></td>
                <td style={{padding:"6px 4px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{t.flag}</span><span style={{fontWeight:600,color:"#1F2937"}}>{t.name}</span></td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{t.mp}</td><td style={{textAlign:"center",color:"#6B7280"}}>{t.w}</td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{t.d}</td><td style={{textAlign:"center",color:"#6B7280"}}>{t.l}</td>
                <td style={{textAlign:"center",color:t.gd>0?"#10b981":t.gd<0?"#ef4444":"#64748b"}}>{t.gd>0?"+":""}{t.gd}</td>
                <td style={{textAlign:"center",fontWeight:700,color:"#1B2A6B"}}>{t.pts}</td>
              </tr>))}</tbody>
          </table>
          {/* Match list */}
          {gMatches.map(m=>{
            const ht=team(m.home),at=team(m.away);
            return (<div key={m.id} onClick={()=>onSelect(m)} style={{padding:"8px 14px",borderTop:"1px solid #F3F4F6",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13}}>
                  <span>{ht.flag}</span><span style={{fontWeight:600,color:"#1F2937"}}>{m.home}</span>
                  <span style={{color:"#9CA3AF",fontSize:12}}>vs</span>
                  <span style={{fontWeight:600,color:"#1F2937"}}>{m.away}</span><span>{at.flag}</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {m.status!=="upcoming"&&<span style={{fontFamily:fb,fontSize:16,color:"#1B2A6B"}}>{m.homeScore}-{m.awayScore}</span>}
                <EstadoBadge status={m.status}/>
              </div>
            </div>);
          })}
        </div>);
      })}
    </div>
    </>}
  </div>);
}

function fbtn(a){return{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:ff,background:a?"#1B2A6B":"#FFFFFF",color:a?"#FFFFFF":"#4B5563",transition:"all .15s"}}

// ─────────────────────────────────────────────
//  PAGE 3: STATISTICS
// ─────────────────────────────────────────────
function StatsPage({fixtures}) {
  const t=_t;
  const mobile=useIsMobile();
  const [selTeam, setSelTeam] = useState(null);
  const [statsView, setStatsView] = useState("tournament"); // tournament | team
  const done = fixtures.filter(f=>f.status==="ft"||f.status==="live");
  const totalGoals = done.reduce((s,f)=>s+(f.homeScore||0)+(f.awayScore||0),0);
  const allEvents = done.flatMap(f=>f.events||[]);
  const goals = allEvents.filter(e=>e.type==="goal");
  const yellows = allEvents.filter(e=>e.type==="yellow").length;
  const reds = allEvents.filter(e=>e.type==="red").length;

  const scorerMap = {};
  goals.forEach(g=>{ const k=g.player; if(!scorerMap[k])scorerMap[k]={name:k,team:g.team,goals:0}; scorerMap[k].goals++; });
  const topScorers = Object.values(scorerMap).sort((a,b)=>b.goals-a.goals).slice(0,10);

  const potmMap = {};
  done.forEach(f=>{if(f.potm){potmMap[f.potm]=(potmMap[f.potm]||0)+1}});
  const topPotm = Object.entries(potmMap).sort((a,b)=>b[1]-a[1]).slice(0,6);

  // Full team stats aggregation
  const teamStats = {};
  done.forEach(f=>{
    [f.home,f.away].forEach((t,idx)=>{
      if(!teamStats[t]) teamStats[t]={name:t,gf:0,ga:0,shots:0,sot:0,corners:0,fouls:0,poss:[],matches:[],yellows:0,reds:0,cleanSheets:0};
      const ts=teamStats[t];
      const scored = idx===0?(f.homeScore||0):(f.awayScore||0);
      const conceded = idx===0?(f.awayScore||0):(f.homeScore||0);
      ts.gf += scored; ts.ga += conceded;
      if(conceded===0) ts.cleanSheets++;
      const result = scored>conceded?"W":scored<conceded?"L":"D";
      ts.matches.push({...f, teamScore:scored, oppScore:conceded, opponent:idx===0?f.away:f.home, result, isHome:idx===0});
      if(f.stats){
        ts.shots += f.stats.shots[idx]; ts.sot += f.stats.shotsOnTarget[idx];
        ts.corners += f.stats.corners[idx]; ts.fouls += f.stats.fouls[idx];
        ts.poss.push(f.stats.possession[idx]);
      }
      // Count cards for this team
      (f.events||[]).forEach(e=>{
        if(e.team===t && e.type==="yellow") ts.yellows++;
        if(e.team===t && e.type==="red") ts.reds++;
      });
    });
  });
  const topAttack = Object.values(teamStats).sort((a,b)=>b.gf-a.gf).slice(0,5);

  // Find group for a team
  const findGroup = (name) => Object.entries(GROUPS).find(([g,ts])=>ts.some(t=>t.name===name));

  const card = ch => ({background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,padding:20,...(ch||{})});

  const selectTeam = (t) => { setSelTeam(t); setStatsView("team"); };
  const backToTournament = () => { setSelTeam(null); setStatsView("tournament"); };

  // ── Team Dashboard ──
  if(statsView==="team" && selTeam) {
    const tm = team(selTeam);
    const ts = teamStats[selTeam] || {name:selTeam,gf:0,ga:0,shots:0,sot:0,corners:0,fouls:0,poss:[],matches:[],yellows:0,reds:0,cleanSheets:0};
    const grp = findGroup(selTeam);
    const groupKey = grp?grp[0]:"?";
    const standings = grp ? calcStandings(groupKey, fixtures) : [];
    const groupPos = standings.findIndex(s=>s.name===selTeam)+1;
    const mp = ts.matches.length;
    const w = ts.matches.filter(m=>m.result==="W").length;
    const d = ts.matches.filter(m=>m.result==="D").length;
    const l = ts.matches.filter(m=>m.result==="L").length;
    const pts = w*3+d;
    const avgPoss = ts.poss.length>0 ? (ts.poss.reduce((a,b)=>a+b,0)/ts.poss.length).toFixed(1) : "—";

    // Team goalscorers
    const teamGoals = [];
    ts.matches.forEach(m=>{
      (m.events||[]).filter(e=>e.type==="goal"&&e.team===selTeam).forEach(e=>{
        const existing = teamGoals.find(g=>g.name===e.player);
        if(existing) existing.goals++;
        else teamGoals.push({name:e.player, goals:1});
      });
    });
    teamGoals.sort((a,b)=>b.goals-a.goals);

    // Max stat for bar scaling
    const allTeamStats = Object.values(teamStats);
    const maxShots = Math.max(...allTeamStats.map(t=>t.shots),1);
    const maxGoals = Math.max(...allTeamStats.map(t=>t.gf),1);
    const maxCorners = Math.max(...allTeamStats.map(t=>t.corners),1);

    return (<div style={{padding:"20px 0"}}>
      {/* Back button */}
      <button onClick={backToTournament} style={{
        padding:"8px 16px",borderRadius:10,border:"1px solid rgba(0,0,0,.08)",cursor:"pointer",
        background:"#FFFFFF",color:"#6B7280",fontSize:12,fontWeight:600,fontFamily:ff,
        marginBottom:20,display:"flex",alignItems:"center",gap:6,
      }}>{t.backToTournament}</button>

      {/* Team header */}
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{fontSize:64,lineHeight:1}}>{tm.flag}</div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontFamily:fb,fontSize:36,letterSpacing:2,color:"#1B2A6B",lineHeight:1.1}}>{selTeam}</div>
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:`${CONF_C[tm.conf]||"#666"}20`,color:CONF_C[tm.conf]||"#666",letterSpacing:.5}}>{tm.conf}</span>
            <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:`${GC[groupKey]||"#1B2A6B"}20`,color:GC[groupKey]||"#1B2A6B",letterSpacing:.5}}>Group {groupKey}</span>
            {groupPos>0&&<span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,
              background:groupPos<=2?"rgba(16,185,129,.12)":groupPos===3?"rgba(245,158,11,.12)":"rgba(239,68,68,.12)",
              color:groupPos<=2?"#10b981":groupPos===3?"#D4A843":"#ef4444",
            }}>{groupPos===1?"1st":groupPos===2?"2nd":groupPos===3?"3rd":"4th"} en Grupo</span>}
          </div>
        </div>
        {/* Form badges */}
        <div style={{display:"flex",gap:4}}>
          {ts.matches.map((m,i)=>(
            <span key={i} style={{width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:12,fontWeight:800,
              background:m.result==="W"?"rgba(16,185,129,.15)":m.result==="D"?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)",
              color:m.result==="W"?"#10b981":m.result==="D"?"#D4A843":"#ef4444",
            }}>{m.result}</span>
          ))}
          {mp===0&&<span style={{fontSize:12,color:"#6B7280"}}>Sin partidos aún</span>}
        </div>
      </div>

      {/* Key numbers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:24}}>
        {[
          {v:mp,l:t.pj,c:"#1B2A6B"},{v:w,l:"G",c:"#10b981"},{v:d,l:"E",c:"#D4A843"},{v:l,l:"P",c:"#ef4444"},
          {v:ts.gf,l:t.gf,c:"#C8102E"},{v:ts.ga,l:t.gc,c:"#009B3A"},{v:ts.gf-ts.ga,l:t.dg,c:ts.gf-ts.ga>0?"#10b981":ts.gf-ts.ga<0?"#ef4444":"#64748b"},
          {v:pts,l:t.pts,c:"#fff"},{v:avgPoss+"%",l:t.avgPoss,c:"#2E5DB5"},{v:ts.cleanSheets,l:t.cleanSheet,c:"#00A89D"},
        ].map(x=>(
          <div key={x.l} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontFamily:fb,fontSize:24,color:x.c}}>{x.v}</div>
            <div style={{fontSize:12,color:"#4B5563",letterSpacing:.5,textTransform:"uppercase",marginTop:2}}>{x.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?16:20,marginBottom:20}}>
        {/* Match results */}
        <div style={card()}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12}}>{t.matchResults}</div>
          {ts.matches.length===0?<div style={{color:"#6B7280",fontSize:12}}>{t.noMatchesYet}</div>:
          ts.matches.map((m,i)=>{
            const opp = team(m.opponent);
            return (<div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #F3F4F6"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,
                  background:m.result==="W"?"rgba(16,185,129,.15)":m.result==="D"?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)",
                  color:m.result==="W"?"#10b981":m.result==="D"?"#D4A843":"#ef4444"}}>{m.result}</span>
                <span style={{fontSize:18}}>{opp.flag}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{m.isHome?"vs":"@"} {m.opponent}</div>
                  <div style={{fontSize:12,color:"#4B5563"}}>{m.date} · {m.venue}</div>
                </div>
              </div>
              <div style={{fontFamily:fb,fontSize:20,color:"#1B2A6B"}}>{m.teamScore} - {m.oppScore}</div>
            </div>);
          })}
        </div>

        {/* Team goalscorers */}
        <div style={card()}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12}}>{t.teamScorers}</div>
          {teamGoals.length===0?<div style={{color:"#6B7280",fontSize:12}}>No goals scored yet.</div>:
          teamGoals.map((g,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13}}>⚽</span>
                <span style={{fontSize:13,fontWeight:600}}>{g.name}</span>
              </div>
              <span style={{fontFamily:fb,fontSize:20,color:"#D4A843"}}>{g.goals}</span>
            </div>
          ))}

          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12,marginTop:24}}>{t.discipline}</div>
          <div style={{display:"flex",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:14,height:18,borderRadius:2,background:"#CA8A04"}}/> 
              <span style={{fontSize:13,fontWeight:600}}>{ts.yellows}</span>
              <span style={{fontSize:12,color:"#4B5563"}}>Amarilla</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:14,height:18,borderRadius:2,background:"#ef4444"}}/> 
              <span style={{fontSize:13,fontWeight:600}}>{ts.reds}</span>
              <span style={{fontSize:12,color:"#4B5563"}}>Roja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance bars */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:16}}>{t.perfMetrics}</div>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?16:20}}>
          <StatBar label="Goles Anotados" value={ts.gf} max={maxGoals} color="#10b981"/>
          <StatBar label="Goles Recibidos" value={ts.ga} max={maxGoals} color="#ef4444"/>
          <StatBar label="Total de Tiros" value={ts.shots} max={maxShots} color="#2E5DB5"/>
          <StatBar label="Tiros a Puerta" value={ts.sot} max={maxShots} color="#C8102E"/>
          <StatBar label="Esquinas Ganadas" value={ts.corners} max={maxCorners} color="#D4A843"/>
          <StatBar label="Faltas Cometidas" value={ts.fouls} max={Math.max(...allTeamStats.map(t=>t.fouls),1)} color="#009B3A"/>
        </div>
      </div>

      {/* Match-by-match stats breakdown */}
      {ts.matches.some(m=>m.stats)&&<div style={{...card(),marginTop:20}}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:16}}>{t.matchByMatch}</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:500}}>
            <thead><tr>{["Rival","Resultado","Pos","Tiros","TAP","Esq","Faltas"].map(h=>
              <th key={h} style={{padding:"8px 6px",textAlign:h==="Rival"?"left":"center",color:"#4B5563",fontSize:12,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",borderBottom:"1px solid rgba(0,0,0,.08)"}}>{h}</th>
            )}</tr></thead>
            <tbody>{ts.matches.map((m,i)=>{
              const idx = m.isHome?0:1;
              return(<tr key={i} style={{borderBottom:"1px solid #F3F4F6"}}>
                <td style={{padding:"8px 6px",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14}}>{team(m.opponent).flag}</span>
                  <span style={{fontWeight:500}}>{m.opponent}</span>
                </td>
                <td style={{textAlign:"center"}}><span style={{fontWeight:700,color:m.result==="W"?"#10b981":m.result==="D"?"#D4A843":"#ef4444"}}>{m.teamScore}-{m.oppScore}</span></td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{m.stats?m.stats.possession[idx]+"%":"—"}</td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{m.stats?m.stats.shots[idx]:"—"}</td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{m.stats?m.stats.shotsOnTarget[idx]:"—"}</td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{m.stats?m.stats.corners[idx]:"—"}</td>
                <td style={{textAlign:"center",color:"#6B7280"}}>{m.stats?m.stats.fouls[idx]:"—"}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      </div>}
    </div>);
  }

  // ── Tournament Overview (default) ──
  return (<div style={{padding:"20px 0"}}>
    {/* Team selector */}
    <div style={{marginBottom:24}}>
      <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#6B7280",marginBottom:12}}>{t.selectTeam}</div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(3,1fr)":"repeat(auto-fill,minmax(130px,1fr))",gap:6}}>
        {ALL_TEAMS.map(t=>{
          const hasData = !!teamStats[t.name];
          return (<button key={t.name} onClick={()=>selectTeam(t.name)} style={{
            display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,cursor:"pointer",
            border:"1px solid rgba(0,0,0,.08)",fontFamily:ff,fontSize:12,fontWeight:500,
            background:hasData?"#FFFFFF":"#FAFBFC",
            color:hasData?"#e2e8f0":"#475569",transition:"all .15s",textAlign:"left",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#1B2A6B";e.currentTarget.style.background="rgba(6,182,212,.06)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,.08)";e.currentTarget.style.background=hasData?"#FFFFFF":"#FAFBFC"}}>
            <span style={{fontSize:18}}>{t.flag}</span>
            <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
          </button>);
        })}
      </div>
    </div>

    {/* Overview row */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
      {[{v:done.length,l:"Partidos Jugados",c:"#1B2A6B"},{v:totalGoals,l:"Goles Anotados",c:"#C8102E"},
        {v:done.length>0?(totalGoals/done.length).toFixed(1):"—",l:"Goles / Partido",c:"#009B3A"},
        {v:goals.length,l:"Total de Goles",c:"#D4A843"},{v:yellows,l:"Tarjetas Amarillas",c:"#CA8A04"},{v:reds,l:"Tarjetas Rojas",c:"#ef4444"},
      ].map(x=>(
        <div key={x.l} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:14,padding:"16px 12px",textAlign:"center"}}>
          <div style={{fontFamily:fb,fontSize:32,color:x.c}}>{x.v}</div>
          <div style={{fontSize:12,color:"#4B5563",letterSpacing:.5,textTransform:"uppercase",marginTop:4}}>{x.l}</div>
        </div>
      ))}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
      {/* Top scorers */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12}}>{t.topScorers}</div>
        {topScorers.length===0?<div style={{color:"#6B7280",fontSize:12}}>{t.noGoals}</div>:
        topScorers.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6",cursor:"pointer"}}
            onClick={()=>selectTeam(s.team)}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,
                background:i===0?"rgba(245,158,11,.2)":i<3?"rgba(16,185,129,.15)":"rgba(0,0,0,.06)",
                color:i===0?"#D4A843":i<3?"#10b981":"#64748b"}}>{i+1}</span>
              <span style={{fontSize:20}}>{team(s.team).flag}</span>
              <div><div style={{fontSize:13,fontWeight:600}}>{s.name}</div><div style={{fontSize:12,color:"#4B5563"}}>{s.team}</div></div>
            </div>
            <span style={{fontFamily:fb,fontSize:22,color:"#D4A843"}}>{s.goals}</span>
          </div>
        ))}
      </div>

      {/* POTM */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12}}>{t.potmAwards}</div>
        {topPotm.length===0?<div style={{color:"#6B7280",fontSize:12}}>{t.noAwards}</div>:
        topPotm.map(([n,c],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#D4A843"}}>⭐</span><span style={{fontSize:13,fontWeight:500}}>{n}</span></div>
            <span style={{fontSize:12,color:"#D4A843",fontWeight:700}}>{c}×</span></div>
        ))}
      </div>

      {/* Top attacking teams */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12}}>{t.topAttacking}</div>
        {topAttack.length===0?<div style={{color:"#6B7280",fontSize:12}}>{t.noData}</div>:
        topAttack.map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6",cursor:"pointer"}}
            onClick={()=>selectTeam(t.name)}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{team(t.name).flag}</span>
              <div><div style={{fontSize:13,fontWeight:600}}>{t.name}</div>
                <div style={{fontSize:12,color:"#4B5563"}}>{t.shots} tiros · {t.sot} a puerta · {t.corners}esquinas</div></div>
            </div>
            <span style={{fontFamily:fb,fontSize:22,color:"#10b981"}}>{t.gf}</span>
          </div>
        ))}
      </div>

      {/* Group leaders */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:12}}>{t.groupLeaders}</div>
        {Object.keys(GROUPS).map(g=>{
          const st=calcStandings(g,fixtures);
          const leader=st[0];
          return (<div key={g} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F3F4F6",cursor:"pointer"}}
            onClick={()=>selectTeam(leader.name)}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:fb,fontSize:14,color:GC[g],letterSpacing:1}}>GRP {g}</span>
              <span style={{fontSize:16}}>{leader.flag}</span>
              <span style={{fontSize:12,fontWeight:500}}>{leader.name}</span>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:"#1B2A6B"}}>{leader.pts} pts</span>
          </div>);
        })}
      </div>
    </div>
  </div>);
}

function StatBar({label,value,max,color}) {
  const pct = max>0 ? (value/max)*100 : 0;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:12,color:"#6B7280",fontWeight:500}}>{label}</span>
        <span style={{fontFamily:fb,fontSize:16,color}}>{value}</span>
      </div>
      <div style={{height:6,borderRadius:3,background:"#F3F4F6",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:3,background:color,width:`${pct}%`,transition:"width .5s ease"}}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  API FETCH PANEL
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  PAGE 4: PREDICTIONS
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  PAGE: AI PREDICTIONS (BSD)
// ─────────────────────────────────────────────
const DEMO_AI_PREDS = [
  {home:"Mexico",away:"South Africa",date:"Jun 11",group:"A",homeWin:58,draw:24,awayWin:18,btts:42,over25:55,
    oddsH:"1.72",oddsD:"3.40",oddsA:"5.25",homeForm:"WWDWW",awayForm:"WLDLD",
    insight:"México llega como favorito en casa. Historial reciente dominante en partidos inaugurales."},
  {home:"South Korea",away:"Czechia",date:"Jun 11",group:"A",homeWin:38,draw:30,awayWin:32,btts:48,over25:51,
    oddsH:"2.45",oddsD:"3.20",oddsA:"2.90",homeForm:"WDWLD",awayForm:"DWWDL",
    insight:"Partido muy parejo. Ambos equipos con rendimiento similar en clasificatorias."},
  {home:"Canada",away:"Bosnia & Herz.",date:"Jun 12",group:"B",homeWin:52,draw:26,awayWin:22,btts:45,over25:48,
    oddsH:"1.90",oddsD:"3.30",oddsA:"4.10",homeForm:"WWWDL",awayForm:"LDWDW",
    insight:"Canadá con ventaja de local. Bosnia peligrosa en contraataque."},
  {home:"USA",away:"Paraguay",date:"Jun 12",group:"D",homeWin:62,draw:22,awayWin:16,btts:38,over25:52,
    oddsH:"1.55",oddsD:"3.80",oddsA:"6.50",homeForm:"WWWWW",awayForm:"WDLDW",
    insight:"EE.UU. gran favorito en casa. Paraguay busca la sorpresa con bloque defensivo."},
  {home:"Brazil",away:"Morocco",date:"Jun 13",group:"C",homeWin:55,draw:25,awayWin:20,btts:52,over25:60,
    oddsH:"1.78",oddsD:"3.50",oddsA:"4.60",homeForm:"WWDWW",awayForm:"WWWDW",
    insight:"Brasil favorito pero Marruecos viene de un gran Mundial 2022. Partido abierto."},
  {home:"Germany",away:"Curaçao",date:"Jun 14",group:"E",homeWin:88,draw:8,awayWin:4,btts:28,over25:78,
    oddsH:"1.08",oddsD:"10.0",oddsA:"28.0",homeForm:"WWWWW",awayForm:"WLDLL",
    insight:"Dominio total esperado de Alemania. Curaçao busca minimizar la diferencia."},
  {home:"Netherlands",away:"Japan",date:"Jun 14",group:"F",homeWin:45,draw:28,awayWin:27,btts:55,over25:58,
    oddsH:"2.15",oddsD:"3.30",oddsA:"3.40",homeForm:"WDWWL",awayForm:"WWWWW",
    insight:"Japón en su mejor momento. Países Bajos con la calidad pero Japón es impredecible."},
  {home:"Argentina",away:"Algeria",date:"Jun 16",group:"J",homeWin:75,draw:16,awayWin:9,btts:35,over25:58,
    oddsH:"1.28",oddsD:"5.50",oddsA:"11.0",homeForm:"WWWWW",awayForm:"DWWLD",
    insight:"Argentina campeón vigente. Argelia competitiva pero la diferencia de calidad es grande."},
];

function AIPredsPage() {
  const t=_t;
  const mobile=useIsMobile();
  const [bsdKey, setBsdKey] = useState(ENV_BSD_KEY);
  const [bsdPreds, setBsdPreds] = useState([]);
  const [bsdLoading, setBsdLoading] = useState(false);
  const [bsdMsg, setBsdMsg] = useState(null);
  const [bsdConnected, setBsdConnected] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const preds = bsdConnected ? bsdPreds : (showDemo ? DEMO_AI_PREDS : []);

  const fetchBSD = useCallback(async () => {
    if(!bsdKey.trim()){setBsdMsg({ok:false,msg:t.apiKeyFirst || "Ingresa la API key"});return}
    setBsdLoading(true); setBsdMsg(null);
    try {
      const res = await fetch(BSD_URL("/api/events/?competition=world-cup"),{
        headers:{"Authorization":`Token ${bsdKey.trim()}`}
      });
      if(!res.ok) throw new Error(`HTTP ${res.status} — Verifica tu API key`);
      const data = await res.json();
      const events = data.results || data || [];
      const mapped = events.map(e=>({
        home: e.home_team || "?", away: e.away_team || "?",
        date: e.start_time ? new Date(e.start_time).toLocaleDateString() : "?",
        group: e.group || "",
        homeWin: Math.round((e.predictions?.home_win || e.odds_home_prob || 0)*100),
        draw: Math.round((e.predictions?.draw || e.odds_draw_prob || 0)*100),
        awayWin: Math.round((e.predictions?.away_win || e.odds_away_prob || 0)*100),
        btts: Math.round((e.predictions?.btts || 0)*100),
        over25: Math.round((e.predictions?.over_25 || 0)*100),
        oddsH: e.odds_home || "—", oddsD: e.odds_draw || "—", oddsA: e.odds_away || "—",
        homeForm: e.home_form || "", awayForm: e.away_form || "",
        insight: e.predictions?.insight || "",
      })).filter(e=>e.homeWin>0);
      setBsdPreds(mapped);
      setBsdConnected(true);
      setBsdMsg({ok:true, msg:`${mapped.length} predicciones cargadas desde BSD`});
    } catch(err) {
      setBsdMsg({ok:false, msg:err.message});
    }
    setBsdLoading(false);
  },[bsdKey]);

  // Auto-fetch on mount if BSD key is available
  useEffect(() => { if(ENV_BSD_KEY) fetchBSD(); }, []);

  const ProbBar = ({label,pct,color}) => (
    <div style={{flex:1,textAlign:"center"}}>
      <div style={{fontSize:13,fontWeight:700,color,marginBottom:4}}>{pct}%</div>
      <div style={{height:6,borderRadius:3,background:"#E5E7EB",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:3,background:color,width:`${pct}%`,transition:"width .5s"}}/>
      </div>
      <div style={{fontSize:12,color:"#6B7280",marginTop:4}}>{label}</div>
    </div>
  );

  return (
    <div style={{padding:"20px 0"}}>
      <div style={{fontFamily:fb,fontSize:28,letterSpacing:2,color:"#1B2A6B",marginBottom:4}}>
        {t.navAI || "PREDICCIONES AI"}
      </div>
      <div style={{fontSize:13,color:"#6B7280",marginBottom:12}}>
        {t.aiDesc}
      </div>
      {bsdMsg && <div style={{marginBottom:16,fontSize:12,fontWeight:600,padding:"8px 14px",borderRadius:8,display:"inline-flex",alignItems:"center",gap:6,
        background:bsdMsg.ok?"#10b98110":"#ef444410",color:bsdMsg.ok?"#10b981":"#ef4444"}}>
        {bsdConnected && <span style={{width:6,height:6,borderRadius:3,background:"#10b981"}}/>}{bsdMsg.msg}
      </div>}

      {/* Predictions Grid */}
      {preds.length===0 ? (
        <div style={{textAlign:"center",padding:40,color:"#6B7280",fontSize:14}}>
          {bsdLoading ? "Cargando predicciones..." : "Sin predicciones disponibles."}
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(auto-fill,minmax(380px,1fr))",gap:16}}>
          {preds.map((p,i)=>{
            const ht=team(p.home), at=team(p.away);
            const maxProb = Math.max(p.homeWin,p.draw,p.awayWin);
            return (
              <div key={i} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
                {/* Header */}
                <div style={{padding:"12px 16px",background:"#F9FAFB",borderBottom:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#6B7280",letterSpacing:1}}>
                    {p.group ? `GRUPO ${p.group} · `:""}{p.date}
                  </span>
                  <span style={{fontSize:12,fontWeight:700,padding:"2px 10px",borderRadius:12,background:"#1B2A6B10",color:"#1B2A6B"}}>🤖 AI</span>
                </div>
                {/* Teams */}
                <div style={{padding:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <div style={{textAlign:"center",flex:1}}>
                    <div style={{fontSize:28}}>{ht.flag}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#1F2937",marginTop:4}}>{p.home}</div>
                    {p.homeForm && <div style={{fontSize:12,color:"#6B7280",marginTop:2,letterSpacing:2}}>{p.homeForm}</div>}
                  </div>
                  <div style={{fontFamily:fb,fontSize:20,color:"#9CA3AF",letterSpacing:2}}>VS</div>
                  <div style={{textAlign:"center",flex:1}}>
                    <div style={{fontSize:28}}>{at.flag}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#1F2937",marginTop:4}}>{p.away}</div>
                    {p.awayForm && <div style={{fontSize:12,color:"#6B7280",marginTop:2,letterSpacing:2}}>{p.awayForm}</div>}
                  </div>
                </div>
                {/* Probability bars */}
                <div style={{padding:"0 16px 12px",display:"flex",gap:12}}>
                  <ProbBar label={p.home} pct={p.homeWin} color={p.homeWin===maxProb?"#1B2A6B":"#9CA3AF"}/>
                  <ProbBar label={t.aiDraw} pct={p.draw} color={p.draw===maxProb?"#D4A843":"#9CA3AF"}/>
                  <ProbBar label={p.away} pct={p.awayWin} color={p.awayWin===maxProb?"#C8102E":"#9CA3AF"}/>
                </div>
                {/* Odds + markets */}
                <div style={{padding:"12px 16px",background:"#F9FAFB",borderTop:"1px solid #F3F4F6"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",gap:8}}>
                      <span style={{fontSize:12,padding:"2px 10px",borderRadius:6,background:"#1B2A6B10",color:"#1B2A6B",fontWeight:700}}>1: {p.oddsH}</span>
                      <span style={{fontSize:12,padding:"2px 10px",borderRadius:6,background:"#D4A84320",color:"#B8860B",fontWeight:700}}>X: {p.oddsD}</span>
                      <span style={{fontSize:12,padding:"2px 10px",borderRadius:6,background:"#C8102E10",color:"#C8102E",fontWeight:700}}>2: {p.oddsA}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {p.btts>0 && <span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"#10b98110",color:"#10b981",fontWeight:600}}>BTTS {p.btts}%</span>}
                      {p.over25>0 && <span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"#7c3aed10",color:"#6B3FA0",fontWeight:600}}>O2.5 {p.over25}%</span>}
                    </div>
                  </div>
                  {p.insight && <div style={{fontSize:12,color:"#4B5563",lineHeight:1.5,fontStyle:"italic"}}>💡 {p.insight}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE 5: POLLA MUNDIALISTA
// ─────────────────────────────────────────────
function calcPts(player, fixtures) {
  let rPts=0,ePts=0,gPts=0,rCount=0,eCount=0;
  fixtures.filter(f=>f.status==="ft"||f.status==="live").forEach(f=>{
    const p=player.matches?.[f.id]; if(!p)return;
    const aR=(f.homeScore||0)>(f.awayScore||0)?"W":(f.homeScore||0)<(f.awayScore||0)?"L":"D";
    if(p.r===aR){rPts+=3;rCount++}
    if(p.h===f.homeScore&&p.a===f.awayScore){ePts+=5;eCount++}
  });
  Object.entries(player.groupWinners||{}).forEach(([g,pick])=>{
    const st=calcStandings(g,fixtures);
    if(st.length>0&&st[0].mp>0&&st[0].name===pick) gPts+=5;
  });
  return {rPts,ePts,gPts,total:rPts+ePts+gPts,rCount,eCount};
}

function PredictionsPage({fixtures,uploaded,setUploaded}) {
  const t=_t;
  const mobile=useIsMobile();
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("all");
  const [showDemo,setShowDemo]=useState(true);
  const [importMsg,setImportMsg]=useState(null);
  const [sheetConnected,setSheetConnected]=useState(false);
  const [loading,setLoading]=useState(false);

  // Auto-connect if any Sheet ID is configured
  const [autoLoaded, setAutoLoaded] = useState(false);
  useEffect(() => {
    if(ENV_HAS_SHEETS && !autoLoaded && !sheetConnected && uploaded.length === 0) {
      setAutoLoaded(true);
      fetchFromGoogleSheets();
    }
  }, [autoLoaded, sheetConnected, uploaded.length]);

  // Merge: use sheet data where available, demo data for groups without sheets
  const uploadedGroups = new Set(uploaded.map(p=>p.group));
  const demoFiltered = showDemo ? DEMO_PLAYERS.filter(p=>!uploadedGroups.has(p.group)) : [];
  const all=[...demoFiltered,...uploaded];
  const fri=all.filter(p=>p.group==="friends_usa");
  const co=all.filter(p=>p.group==="friends_co");
  const fam=all.filter(p=>p.group==="family");

  // Parse Google Sheet ID from URL or raw ID
  const getSheetId = (input) => {
    if(!input) return null;
    const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if(match) return match[1];
    if(/^[a-zA-Z0-9_-]{20,}$/.test(input.trim())) return input.trim();
    return null;
  };

  // Fetch CSV from a published Google Sheet tab
  const fetchCsv = async (sheetId, tabName) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`No se pudo acceder a la hoja "${tabName}" (HTTP ${res.status})`);
    const text = await res.text();
    const rows = [];
    let current = [];
    let inQuote = false;
    let field = "";
    for(let i=0; i<text.length; i++){
      const c = text[i];
      if(c==='"'){ inQuote=!inQuote; continue; }
      if(c===','&&!inQuote){ current.push(field.trim()); field=""; continue; }
      if((c==='\n'||c==='\r')&&!inQuote){
        if(field||current.length){ current.push(field.trim()); rows.push(current); }
        current=[]; field="";
        if(c==='\r'&&text[i+1]==='\n') i++;
        continue;
      }
      field+=c;
    }
    if(field||current.length){ current.push(field.trim()); rows.push(current); }
    return rows;
  };

  // Parse a master sheet's "Imported Picks" tab
  // Format: Friend(0), Section(1), MatchNum(2), Date(3), Group(4), TeamA(5), TeamB(6), ScoreA(7), ScoreB(8), ...
  const parseMasterSheet = async (sheetId, groupTag) => {
    const players = {};

    // Read "Imported Picks" tab
    const rows = await fetchCsv(sheetId, "Imported Picks");
    if(rows.length < 2) return [];

    // Skip header row
    for(let r=1; r<rows.length; r++){
      const row = rows[r];
      const name = (row[0]||"").trim();
      if(!name) continue;

      const matchNum = parseInt(row[2]);
      if(isNaN(matchNum) || matchNum<1 || matchNum>104) continue;

      // Create player if new
      if(!players[name]){
        players[name] = {name, group:groupTag, champion:"", goldenBoot:"", groupWinners:{}, matches:{}, uploaded:true};
      }

      // Parse predicted scores (columns 7 and 8)
      const hVal = parseInt(row[7]);
      const aVal = parseInt(row[8]);
      if(isNaN(hVal) && isNaN(aVal)) continue; // no prediction yet

      const h = isNaN(hVal) ? 0 : hVal;
      const a = isNaN(aVal) ? 0 : aVal;
      const result = h > a ? "W" : h < a ? "L" : "D";
      players[name].matches[matchNum-1] = {r:result, h, a};
    }

    return Object.values(players);
  };

  const fetchFromGoogleSheets = useCallback(async () => {
    setLoading(true);
    setImportMsg({ok:true, msg:{t.connectingSheets}});
    try {
      const allPlayers = [];

      // Fetch each group's master sheet
      const sheets = [
        {id:ENV_SHEET_USA, group:"friends_usa", label:"Amigos USA"},
        {id:ENV_SHEET_FAM, group:"family", label:"Familia"},
        {id:ENV_SHEET_CO, group:"friends_co", label:"Amigos Colombia"},
      ];

      for(const sheet of sheets){
        if(!sheet.id) continue;
        try {
          const players = await parseMasterSheet(sheet.id, sheet.group);
          allPlayers.push(...players);
        } catch(e) {
          console.warn(`Error al leer ${sheet.label}: ${e.message}`);
        }
      }

      if(allPlayers.length === 0) throw new Error("No se encontraron jugadores con predicciones. Verifica que las hojas estén publicadas.");

      setUploaded(allPlayers);
      setSheetConnected(true);
      setShowDemo(false);
      const matchCount = allPlayers.reduce((s,p)=>s+Object.keys(p.matches).length, 0);
      const groups = [...new Set(allPlayers.map(p=>p.group))];
      setImportMsg({ok:true, msg:`✓ ${allPlayers.length} jugadores · ${matchCount} predicciones · ${groups.length} grupo(s)`});
    } catch(err) {
      setImportMsg({ok:false, msg:err.message});
    }
    setLoading(false);
  },[setUploaded]);

  const remove=(name)=>{setUploaded(prev=>prev.filter(p=>p.name!==name));if(sel?.name===name)setSel(null)};

  const [openGroup, setOpenGroup] = useState(null);
  const board=(players,label,accent,groupKey)=>{
    const ranked=players.map(p=>({...p,pts:calcPts(p,fixtures)})).sort((a,b)=>b.pts.total-a.pts.total);
    const isOpen = openGroup===groupKey;
    const leader = ranked[0];
    return(<div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
      <div onClick={()=>setOpenGroup(isOpen?null:groupKey)} style={{padding:"14px 18px",background:accent,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",userSelect:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:fb,fontSize:20,letterSpacing:2,color:"#fff"}}>{label}</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:600}}>{players.length} {t.players}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {!isOpen && leader && <span style={{fontSize:13,color:"rgba(255,255,255,.85)",fontWeight:600}}>🏆 {leader.name} — {leader.pts.total} pts</span>}
          <span style={{color:"#fff",fontSize:16,transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
        </div>
      </div>
      {isOpen && <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
        {[t.pos,t.name,t.totalCol].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h===t.name?"left":"center",fontSize:13,fontWeight:700,color:"#4B5563",borderBottom:"2px solid #E5E7EB"}}>{h}</th>)}
      </tr></thead><tbody>{ranked.map((p,i)=>(
        <tr key={p.name} onClick={()=>setSel(p)} style={{cursor:"pointer",borderBottom:"1px solid #F3F4F6"}}
          onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"12px 14px",textAlign:"center",width:50}}>
            <span style={{width:28,height:28,borderRadius:8,display:"inline-flex",alignItems:"center",justifyContent:"center",
              fontSize:13,fontWeight:800,background:i===0?"rgba(212,168,67,.15)":i<3?"rgba(16,185,129,.12)":"#F3F4F6",color:i===0?"#D4A843":i<3?"#10b981":"#6B7280"}}>
              {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
            </span>
          </td>
          <td style={{padding:"12px 14px",fontWeight:600,fontSize:15,color:"#1F2937"}}>
            {p.name}
            {p.uploaded&&<span style={{marginLeft:8,fontSize:12,padding:"2px 8px",borderRadius:4,background:"#1B2A6B10",color:"#1B2A6B",fontWeight:600}}>xlsx</span>}
          </td>
          <td style={{padding:"12px 14px",textAlign:"center"}}>
            <span style={{fontFamily:fb,fontSize:26,color:accent}}>{p.pts.total}</span>
            <span style={{fontSize:12,color:"#6B7280",marginLeft:4}}>pts</span>
          </td>
        </tr>))}</tbody></table>}
    </div>);
  };

  if(sel){
    const pts=calcPts(sel,fixtures);
    const done=fixtures.filter(f=>f.status==="ft"||f.status==="live");
    return(<div style={{padding:"20px 0"}}>
      <button onClick={()=>setSel(null)} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(0,0,0,.08)",cursor:"pointer",background:"#FFFFFF",color:"#6B7280",fontSize:12,fontWeight:600,fontFamily:ff,marginBottom:20}}>{t.back}</button>
      <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div><div style={{fontFamily:fb,fontSize:32,letterSpacing:2,color:"#1B2A6B"}}>{sel.name}</div>
            <span style={{fontSize:12,fontWeight:700,padding:"3px 12px",borderRadius:20,background:sel.group==="friends_usa"?"#1B2A6B15":sel.group==="friends_co"?"#D4A84320":"#C8102E15",color:sel.group==="friends_usa"?"#1B2A6B":sel.group==="friends_co"?"#B8860B":"#C8102E",marginTop:6,display:"inline-block"}}>{sel.group==="friends_usa"?"Amigos USA":sel.group==="friends_co"?"Amigos Colombia":"Familia"}</span></div>
          <div style={{textAlign:"center"}}><div style={{fontFamily:fb,fontSize:48,color:"#D4A843"}}>{pts.total}</div><div style={{fontSize:12,fontWeight:700,color:"#4B5563"}}>PUNTOS</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:10,marginTop:20}}>
          {[{v:pts.rCount,l:t.resultados,s:`${pts.rPts} pts`,c:"#1B2A6B"},{v:pts.eCount,l:t.exactos,s:`${pts.ePts} pts`,c:"#10b981"},{v:Object.keys(sel.groupWinners||{}).length,l:t.grupos,s:`${pts.gPts} pts`,c:"#C8102E"},{v:"—",l:t.bonos,s:"0 pts",c:"#D4A843"}].map(x=>(<div key={x.l} style={{background:"#FFFFFF",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid rgba(0,0,0,.05)"}}>
            <div style={{fontFamily:fb,fontSize:22,color:x.c}}>{x.v}</div><div style={{fontSize:12,color:"#4B5563"}}>{x.l}</div><div style={{fontSize:12,fontWeight:700,color:x.c,marginTop:2}}>{x.s}</div></div>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?16:20}}>
        <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,padding:20}}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:16}}>{t.preTournament}</div>
          {[{l:"Campeón",v:sel.champion},{l:"Bota de Oro",v:sel.goldenBoot}].map(x=>(<div key={x.l} style={{padding:"10px 14px",background:"#FFFFFF",borderRadius:10,marginBottom:8}}>
            <div style={{fontSize:12,color:"#4B5563",fontWeight:600}}>{x.l}</div><div style={{fontSize:16,fontWeight:700,color:"#1F2937",marginTop:2}}>{x.v||"—"}</div></div>))}
          <div style={{fontFamily:fb,fontSize:16,letterSpacing:2,color:"#1B2A6B",marginTop:20,marginBottom:12}}>{t.groupWinners}</div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:6}}>
            {Object.entries(sel.groupWinners||{}).map(([g,pick])=>{
              const st=calcStandings(g,fixtures);const actual=st.length>0&&st[0].mp>0?st[0].name:null;const ok=actual&&actual===pick;
              return(<div key={g} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",borderRadius:8,fontSize:12,background:!actual?"rgba(255,255,255,.02)":ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${!actual?"rgba(0,0,0,.05)":ok?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)"}`}}>
                <span style={{fontWeight:700,color:GC[g]||"#1B2A6B"}}>Gr {g}</span><span style={{fontWeight:600,color:!actual?"#94a3b8":ok?"#10b981":"#ef4444"}}>{pick}</span>{ok&&<span style={{color:"#10b981"}}>✓</span>}
              </div>);})}
          </div>
        </div>
        <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:16,padding:20}}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#1B2A6B",marginBottom:16}}>{t.pollaTitle}</div>
          {done.length===0?<div style={{color:"#4B5563",fontSize:13}}>Sin partidos jugados aún.</div>:done.map(f=>{
            const p=sel.matches?.[f.id];if(!p)return null;
            const aR=(f.homeScore||0)>(f.awayScore||0)?"W":(f.homeScore||0)<(f.awayScore||0)?"L":"D";
            const rOk=p.r===aR,sOk=p.h===f.homeScore&&p.a===f.awayScore;
            return(<div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #F3F4F6"}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#1F2937"}}>{team(f.home).flag} {f.home} vs {f.away} {team(f.away).flag}</div>
                <div style={{fontSize:12,color:"#4B5563",marginTop:2}}>Pred: <b>{p.h}-{p.a}</b> ({p.r}) · Real: <b>{f.homeScore}-{f.awayScore}</b> ({aR})</div></div>
              <div style={{display:"flex",gap:4}}>
                {rOk&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"rgba(16,185,129,.12)",color:"#10b981",fontWeight:700}}>+3</span>}
                {sOk&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"rgba(245,158,11,.15)",color:"#D4A843",fontWeight:700}}>+5</span>}
                {!rOk&&!sOk&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"#F9FAFB",color:"#4B5563",fontWeight:600}}>0</span>}</div>
            </div>);})}
        </div>
      </div>
    </div>);
  }

  return(<div style={{padding:"20px 0"}}>
    <div style={{fontFamily:fb,fontSize:24,letterSpacing:2,color:"#1B2A6B",marginBottom:4}}>POLLA MUNDIALISTA</div>
    <div style={{fontSize:13,color:"#4B5563",marginBottom:16}}>{t.pollaDesc}</div>
    {/* Status bar */}
    {importMsg && <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <div style={{fontSize:12,fontWeight:600,padding:"8px 14px",borderRadius:8,display:"inline-flex",alignItems:"center",gap:6,
        background:importMsg.ok?"#10b98110":"#ef444410",color:importMsg.ok?"#10b981":"#ef4444"}}>
        {sheetConnected && <span style={{width:6,height:6,borderRadius:3,background:"#10b981"}}/>}{importMsg.msg}
      </div>
      {sheetConnected && <button onClick={fetchFromGoogleSheets} disabled={loading} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #E5E7EB",background:"#FFFFFF",color:"#4B5563",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:ff}}>↻ Actualizar</button>}
    </div>}
    {/* Filters */}
    <div style={{display:"flex",gap:6,marginBottom:20,alignItems:"center",flexWrap:"wrap"}}>
      {[{id:"all",l:t.pollaAll},{id:"friends_usa",l:t.pollaUSA},{id:"friends_co",l:t.pollaCO},{id:"family",l:t.pollaFam}].map(f=>(
        <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"7px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:ff,background:filter===f.id?"#1B2A6B":"#FFFFFF",color:filter===f.id?"#FFFFFF":"#4B5563"}}>{f.l}</button>))}
      <label style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:"#4B5563"}}>
        <input type="checkbox" checked={showDemo} onChange={e=>setShowDemo(e.target.checked)}/> {t.showDemo}</label>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      {(filter==="all"||filter==="friends_usa")&&board(fri,t.friends_usa,"#1B2A6B","friends_usa")}
      {(filter==="all"||filter==="friends_co")&&board(co,t.friends_co,"#D4A843","friends_co")}
      {(filter==="all"||filter==="family")&&board(fam,t.family,"#C8102E","family")}
      {fri.length===0&&fam.length===0&&<div style={{textAlign:"center",padding:40,color:"#4B5563"}}>{t.noPlayers}</div>}
    </div>
  </div>);
}

function FetchPanel({fixtures, onUpdate}) {
  const t=_t;
  const [apiKey, setApiKey] = useState(ENV_FOOTBALL_KEY);
  const [status, setStatus] = useState(null); // {ok:bool, msg:string}
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const mapEstado = (s) => {
    if(["FINISHED","AWARDED"].includes(s)) return "ft";
    if(["IN_PLAY","PAUSED","LIVE","SUSPENDED"].includes(s)) return "live";
    return "upcoming";
  };

  // Step 1: Fetch all matches (scores + status)
  const fetchMatches = useCallback(async () => {
    if(!apiKey.trim()){setStatus({ok:false,msg:"Pega tu API key de football-data.org"});return}
    setLoading(true); setStatus(null);
    try {
      const res = await fetch(FOOTBALL_URL("/v4/competitions/WC/matches?season=2026"),{
        headers:{"X-Auth-Token":apiKey.trim()}
      });
      if(!res.ok){
        if(res.status===403) throw new Error("API key inválida o expirada");
        if(res.status===429) throw new Error("Límite de solicitudes — espera 60s e intenta de nuevo");
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const matches = data.matches || [];
      const next = [...fixtures];
      let updated = 0;

      matches.forEach(m => {
        const st = mapEstado(m.status);
        if(st==="upcoming") return;
        const homeName = resolve(m.homeTeam?.shortName || m.homeTeam?.name);
        const awayName = resolve(m.awayTeam?.shortName || m.awayTeam?.name);
        if(!homeName||!awayName) return;

        const idx = next.findIndex(f => f.home===homeName && f.away===awayName);
        if(idx===-1) return;
        const f = next[idx];
        if(f.status===st && f.homeScore===m.score?.fullTime?.home) return; // no change

        next[idx] = {...f,
          status: st,
          homeScore: m.score?.fullTime?.home ?? 0,
          awayScore: m.score?.fullTime?.away ?? 0,
          _apiMatchId: m.id, // store for detail fetch
        };
        updated++;
      });

      if(updated > 0) {
        onUpdate(next);
        setStatus({ok:true, msg:`${updated} partido(s) actualizados. Haz clic en "Obtener Detalles" para eventos y estadísticas.`});
      } else {
        setStatus({ok:false, msg:"Sin resultados nuevos. El torneo inicia el 11 de junio de 2026."});
      }
    } catch(err) {
      setStatus({ok:false, msg: err.message});
    }
    setLoading(false);
  }, [apiKey, fixtures, onUpdate]);

  // Step 2: Fetch detailed events for finished/live matches (goals, cards, subs)
  const fetchDetails = useCallback(async () => {
    if(!apiKey.trim()){setStatus({ok:false,msg:"Ingresa la API key primero"});return}
    const matchesWithApi = fixtures.filter(f => f._apiMatchId && (f.status==="ft"||f.status==="live"));
    if(matchesWithApi.length===0){setStatus({ok:false,msg:"Obtén marcadores primero, luego detalles"});return}

    setDetailsLoading(true); setStatus({ok:true, msg:`Cargando detalles para ${matchesWithApi.length} partido(s)...`});
    const next = [...fixtures];
    let fetched = 0;

    // Batch requests (max 9 per minute for free tier safety)
    for(let i=0; i<matchesWithApi.length && i<9; i++){
      const m = matchesWithApi[i];
      try {
        const res = await fetch(FOOTBALL_URL(`/v4/matches/${m._apiMatchId}`),{
          headers:{"X-Auth-Token":apiKey.trim()}
        });
        if(!res.ok) continue;
        const detail = await res.json();
        const idx = next.findIndex(f=>f.id===m.id);
        if(idx===-1) continue;

        // Map goals to events
        const events = [];
        (detail.goals || []).forEach(g => {
          events.push({
            type:"goal",
            player: g.scorer?.name || "Unknown",
            team: resolve(g.team?.name || g.team?.shortName || ""),
            minute: g.minute || 0,
            detail: g.type === "OWN" ? "Autogol" : g.type === "PENALTY" ? "Penal" : "Gol",
          });
        });
        (detail.bookings || []).forEach(b => {
          events.push({
            type: b.card === "RED" ? "red" : "yellow",
            player: b.player?.name || "Unknown",
            team: resolve(b.team?.name || b.team?.shortName || ""),
            minute: b.minute || 0,
            detail: b.card === "RED" ? "Tarjeta Roja" : "Tarjeta Amarilla",
          });
        });
        events.sort((a,b)=>a.minute-b.minute);

        // Map statistics if available
        let stats = null;
        const hs = detail.homeTeam?.statistics;
        const as_ = detail.awayTeam?.statistics;
        if(hs && as_){
          stats = {
            possession: [parseInt(hs.ballPossession)||50, parseInt(as_.ballPossession)||50],
            shots: [hs.shots||0, as_.shots||0],
            shotsOnTarget: [hs.shotsOnTarget||0, as_.shotsOnTarget||0],
           esquinas: [hs.cornerKicks||0, as_.cornerKicks||0],
            fouls: [hs.fouls||0, as_.fouls||0],
          };
        }

        next[idx] = {...next[idx], events, stats: stats || next[idx].stats};
        fetched++;

        // Small delay between requests to stay under rate limit
        if(i < matchesWithApi.length-1) await new Promise(r=>setTimeout(r,700));
      } catch(e) { /* skip failed individual fetches */ }
    }

    onUpdate(next);
    setStatus({ok:true, msg:`Detalles cargados para ${fetched} partido(s)${matchesWithApi.length>9?" (máximo 9 — vuelve a buscar para más)":""}`});
    setDetailsLoading(false);
  }, [apiKey, fixtures, onUpdate]);

  // Auto-fetch on mount if key is available
  useEffect(() => {
    if(ENV_FOOTBALL_KEY && !loading) fetchMatches();
  }, []);

  // Auto-refresh polling
  useEffect(() => {
    if(!autoRefresh || !apiKey.trim()) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(FOOTBALL_URL("/v4/competitions/WC/matches?season=2026"),{
          headers:{"X-Auth-Token":apiKey.trim()}
        });
        if(!res.ok) return;
        const data = await res.json();
        const matches = data.matches || [];
        const next = [...fixtures];
        let updated = 0;
        matches.forEach(m => {
          const home = TEAM_ALIASES[m.homeTeam?.name?.toLowerCase()] || m.homeTeam?.name;
          const idx = next.findIndex(f => f.home === home);
          if(idx < 0) return;
          const st = mapEstado(m.status);
          if(st !== "upcoming") {
            next[idx] = {...next[idx], status:st, homeScore:m.score?.fullTime?.home ?? next[idx].homeScore, awayScore:m.score?.fullTime?.away ?? next[idx].awayScore};
            updated++;
          }
        });
        if(updated > 0) { onUpdate(next); setStatus({ok:true, msg:`Auto-refresh: ${updated} actualizado(s)`}); }
      } catch(e) { /* silent */ }
    }, 60000);
    return () => clearInterval(id);
  }, [autoRefresh, apiKey, fixtures, onUpdate]);

  const hasKey = !!apiKey.trim();
  const isConnected = hasKey && status?.ok;

  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 16px",background:"rgba(255,255,255,.06)",borderRadius:10,marginBottom:12}}>
      <div style={{width:8,height:8,borderRadius:4,background:isConnected?"#10b981":hasKey?"#D4A843":"#6B7280"}}/>
      <span style={{fontSize:12,fontWeight:600,color:isConnected?"#10b981":hasKey?"#D4A843":"rgba(255,255,255,.5)"}}>
        {isConnected?t.apiConnectedLabel:loading?"Conectando...":hasKey?t.apiWaiting:t.apiNoKey}
      </span>
      {status?.msg && <span style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>{status.msg}</span>}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
        {hasKey && <button onClick={fetchMatches} disabled={loading} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"#FFFFFF",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:ff,opacity:loading?.5:1}}>
          {loading?"...":"↻ Actualizar"}
        </button>}
        <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:12,color:autoRefresh?"#10b981":"rgba(255,255,255,.4)",fontWeight:600}}>
          <input type="checkbox" checked={autoRefresh} onChange={e=>setAutoRefresh(e.target.checked)} style={{accentColor:"#10b981"}}/>
          Auto 60s
        </label>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  USER PREFERENCES (localStorage)
// ─────────────────────────────────────────────
function loadPref(key, fallback) {
  try { const v = localStorage.getItem("wc26_"+key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function savePref(key, val) {
  try { localStorage.setItem("wc26_"+key, JSON.stringify(val)); } catch(e) {}
}

// ─────────────────────────────────────────────
//  WELCOME SCREEN
// ─────────────────────────────────────────────
function WelcomeScreen({onComplete, players}) {
  const [step, setStep] = useState(1);
  const [selTeam, setSelTeam] = useState(null);
  const [selName, setSelName] = useState(null);
  const [search, setSearch] = useState("");

  const filteredTeams = search
    ? ALL_TEAMS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : ALL_TEAMS;

  const finish = () => {
    if(selTeam) savePref("team", selTeam);
    if(selName) savePref("name", selName);
    savePref("onboarded", true);
    onComplete({team: selTeam, name: selName});
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"linear-gradient(145deg,#1B2A6B 0%,#243A8E 50%,#1B2A6B 100%)",overflowY:"auto",WebkitOverflowScrolling:"touch",padding:20,display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
      <div style={{maxWidth:520,width:"100%",textAlign:"center",paddingTop:40,paddingBottom:40}}>
        {/* Logo */}
        <div style={{fontSize:64,marginBottom:8}}>⚽</div>
        <div style={{fontFamily:fb,fontSize:36,letterSpacing:3,color:"#FFFFFF",marginBottom:4}}>Zona Mundialista 2026</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:32}}>Tu centro personal del Mundial</div>

        {step === 1 && (
          <div>
            <div style={{fontFamily:fb,fontSize:22,letterSpacing:2,color:"#D4A843",marginBottom:4}}>{t.welcomeQ1}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:16}}>{t.welcomeQ1Sub}</div>

            {/* Search */}
            <input
              type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={t.welcomeSearch}
              style={{width:"100%",padding:"10px 16px",borderRadius:12,border:"2px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",color:"#FFFFFF",fontSize:14,fontFamily:ff,outline:"none",boxSizing:"border-box",marginBottom:16,textAlign:"center"}}
            />

            {/* Team grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,maxHeight:320,overflowY:"auto",padding:"4px 2px"}}>
              {filteredTeams.map(t => (
                <button key={t.name} onClick={()=>setSelTeam(t.name)} style={{
                  padding:"10px 4px",borderRadius:12,border:selTeam===t.name?"2px solid #D4A843":"2px solid transparent",
                  background:selTeam===t.name?"rgba(212,168,67,.15)":"rgba(255,255,255,.06)",
                  cursor:"pointer",textAlign:"center",transition:"all .15s",
                }}>
                  <div style={{fontSize:28}}>{t.flag}</div>
                  <div style={{fontSize:11,fontWeight:600,color:selTeam===t.name?"#D4A843":"rgba(255,255,255,.8)",marginTop:4,lineHeight:1.2}}>{t.name}</div>
                </button>
              ))}
            </div>

            <button onClick={()=>setStep(2)} style={{
              marginTop:20,padding:"12px 40px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:ff,fontSize:15,fontWeight:700,
              background:selTeam?"#D4A843":"rgba(255,255,255,.15)",color:selTeam?"#1B2A6B":"rgba(255,255,255,.4)",
            }}>{selTeam ? t.welcomeNext : t.welcomeSkip}</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{fontFamily:fb,fontSize:22,letterSpacing:2,color:"#D4A843",marginBottom:4}}>{t.welcomeQ2}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:20}}>{t.welcomeQ2Sub}</div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
              {players.map(p => (
                <button key={p.name+"_"+p.group} onClick={()=>setSelName(p.name)} style={{
                  padding:"12px 8px",borderRadius:12,border:selName===p.name?"2px solid #D4A843":"2px solid transparent",
                  background:selName===p.name?"rgba(212,168,67,.15)":"rgba(255,255,255,.06)",
                  cursor:"pointer",textAlign:"center",transition:"all .15s",
                }}>
                  <div style={{fontSize:14,fontWeight:600,color:selName===p.name?"#D4A843":"#FFFFFF"}}>{p.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>{p.group==="friends_usa"?"Amigos USA":p.group==="friends_co"?"Amigos Colombia":"Familia"}</div>
                </button>
              ))}
            </div>

            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={()=>setStep(1)} style={{padding:"12px 24px",borderRadius:12,border:"1px solid rgba(255,255,255,.2)",background:"transparent",color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:ff,fontSize:14,fontWeight:600}}>← Atrás</button>
              <button onClick={finish} style={{
                padding:"12px 40px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:ff,fontSize:15,fontWeight:700,
                background:"#D4A843",color:"#1B2A6B",
              }}>{selName ? `${t.welcomeEnterAs} ${selName}` : t.welcomeEnterNoName}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("es");
  const t=LANG[lang]||LANG.es;
  _t=t;
  const mobile = useIsMobile();
  const [appReady, setAppReady] = useState(false);
  const [userTeam, setUserTeam] = useState(()=>loadPref("team",null));
  const [userName, setUserName] = useState(()=>loadPref("name",null));
  const [showWelcome, setShowWelcome] = useState(()=>!loadPref("onboarded",false));
  const [fixtures, setFixtures] = useState(initFixtures);
  const [page, setPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState("Jun 11");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editMatch, setEditMatch] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [apiConnected, setApiConnected] = useState(false);

  // Initial loading
  useEffect(() => { const timer = setTimeout(() => setAppReady(true), 800); return () => clearTimeout(timer); }, []);

  const totalPlayed = fixtures.filter(f=>f.status==="ft").length;
  const totalLive = fixtures.filter(f=>f.status==="live").length;

  const simulateDemo = useCallback(()=>{
    setFixtures(prev=>{
      const next = prev.map(f=>{
        if(DEMO_DATA[f.id]) return {...f,...DEMO_DATA[f.id]};
        return f;
      });
      return next;
    });
    setDemoMode(true);
    setSelectedDate("Jun 11");
    // Auto-select first match
    setTimeout(()=>{
      setSelectedMatch(prev => prev || null);
    },0);
  },[]);

  const resetData = useCallback(()=>{
    setFixtures(initFixtures());
    setDemoMode(false);
    setApiConnected(false);
    setSelectedMatch(null);
  },[]);

  const handleApiUpdate = useCallback((updated)=>{
    setFixtures(updated);
    setApiConnected(true);
    setDemoMode(false);
  },[]);

  const handleSave = (updated) => {
    setFixtures(prev=>prev.map(f=>f.id===updated.id?updated:f));
    setEditMatch(null);
    setSelectedMatch(updated);
  };

  const handleFixtureSelect = (m) => {
    setSelectedMatch(m);
    setSelectedDate(m.date);
    setPage("home");
  };

  // Keep selectedMatch in sync with fixtures
  const liveSelected = selectedMatch ? fixtures.find(f=>f.id===selectedMatch.id) : null;

  if(showWelcome) return <WelcomeScreen
    players={DEMO_PLAYERS}
    onComplete={({team,name})=>{setUserTeam(team);setUserName(name);setShowWelcome(false);}}
  />;

  if(!appReady) return (
    <div style={{fontFamily:ff,background:"#F5F6FA",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#1F2937"}}>
      <div style={{fontSize:72,marginBottom:16}}>⚽</div>
      <div style={{fontFamily:fb,fontSize:mobile?24:36,letterSpacing:3,color:"#1B2A6B",marginBottom:8}}>Zona Mundialista 2026</div>
      <div style={{fontSize:14,color:"#6B7280"}}>Cargando...</div>
    </div>
  );

  return (
    <div style={{fontFamily:ff,background:"#F5F6FA",minHeight:"100vh",color:"#1F2937"}}>
      {/* ─── HEADER ─── */}
      <div style={{background:"linear-gradient(135deg,#1B2A6B 0%,#243A8E 100%)",borderBottom:"3px solid #C8102E",padding:mobile?"12px 16px":"16px 24px"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:mobile?"0":"0"}}>
          {/* Row 1: Title + Countdown + Stats + Lang */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:mobile?8:12,marginBottom:mobile?8:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontFamily:fb,fontSize:mobile?22:32,letterSpacing:mobile?2:3,lineHeight:1,color:"#FFFFFF"}}>
                Zona Mundialista 2026
              </div>
              {userTeam && <div onClick={()=>setShowWelcome(true)} title="Cambiar equipo o nombre" style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:8,background:"rgba(255,255,255,.12)",cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}>
                <span style={{fontSize:mobile?18:22}}>{team(userTeam).flag}</span>
                {!mobile && <span style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.8)"}}>{userTeam}</span>}
                <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>✎</span>
              </div>}
              {!userTeam && <button onClick={()=>setShowWelcome(true)} style={{padding:"4px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:ff}}>⚽ Elegir equipo</button>}
              {userName && <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.85)"}}>Hola, {userName} 👋</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:mobile?8:16}}>
              <Countdown/>
              {!mobile && [{v:"104",l:t.matches},{v:"48",l:t.teams},{v:"16",l:t.cities}].map(x=>(
                <div key={x.l} style={{background:"rgba(255,255,255,.1)",borderRadius:8,padding:"6px 12px",textAlign:"center"}}>
                  <span style={{fontFamily:fb,fontSize:20,color:"#fff"}}>{x.v}</span>
                  <span style={{fontSize:12,color:"#D4A843",fontWeight:700,marginLeft:4}}>{x.l}</span>
                </div>
              ))}
              <button onClick={()=>setLang(l=>l==="es"?"en":"es")} style={{padding:"5px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(0,0,0,.1)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:ff}}>{lang==="es"?"EN 🇺🇸":"ES 🇪🇸"}</button>
            </div>
          </div>
          {/* Row 2: Nav + Actions */}
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:2,background:"rgba(255,255,255,.08)",borderRadius:8,padding:2,overflowX:"auto",WebkitOverflowScrolling:"touch",flex:mobile?1:"none"}}>
              {[{id:"home",label:t.navHome},{id:"fixtures",label:t.navFixtures},{id:"stats",label:t.navStats},{id:"ai",label:t.navAI},{id:"predictions",label:t.navPolla}].map(t=>(
                <button key={t.id} onClick={()=>setPage(t.id)} style={{
                  padding:mobile?"5px 8px":"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:ff,fontSize:mobile?12:13,fontWeight:600,
                  whiteSpace:"nowrap",transition:"all .15s",
                  background:page===t.id?"#D4A843":"transparent",
                  color:page===t.id?"#1B2A6B":"rgba(255,255,255,.7)",
                }}>{t.label}</button>
              ))}
            </div>
            {!mobile && <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
              <FetchPanel fixtures={fixtures} onUpdate={handleApiUpdate}/>
              <button onClick={simulateDemo} style={{padding:"5px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",cursor:"pointer",background:"rgba(255,255,255,.08)",color:"#FFFFFF",fontSize:12,fontWeight:600,fontFamily:ff}}>
                {`⚡ ${t.simulate}`}
              </button>
              <button onClick={resetData} style={{padding:"5px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",cursor:"pointer",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:600,fontFamily:ff}}>
                {`🔄 ${t.reset}`}
              </button>
            </div>}
          </div>
        </div>
      </div>

      {/* ─── STATUS BAR ─── */}
      <div style={{background:"#FFFFFF",borderBottom:"1px solid #E5E7EB",padding:"6px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:mobile?12:24}}>
        {[
          {label:"Marcadores",key:ENV_FOOTBALL_KEY,icon:"⚽"},
          {label:"Predicciones AI",key:ENV_BSD_KEY,icon:"🤖"},
          {label:"Google Sheets",key:ENV_HAS_SHEETS?"1":"",icon:"📊"},
        ].map(s=>{
          const configured = !!s.key;
          return (
            <div key={s.label} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:4,background:configured?"#10b981":"#D1D5DB"}}/>
              <span style={{fontSize:12,fontWeight:600,color:configured?"#10b981":"#9CA3AF"}}>{mobile?s.icon:`${s.icon} ${s.label}`}</span>
            </div>
          );
        })}
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:mobile?"0 12px":"0"}}>
        {/* Personal card on home page */}
        {page==="home" && (userName || userTeam) && (() => {
          const ut = userTeam ? team(userTeam) : null;
          const myTeamMatches = userTeam ? fixtures.filter(f=>f.home===userTeam||f.away===userTeam) : [];
          const nextMatch = myTeamMatches.find(f=>f.status==="upcoming");
          const pollaPlayer = DEMO_PLAYERS.find(p=>p.name===userName);
          const pollaRank = pollaPlayer ? (() => {
            const grp = DEMO_PLAYERS.filter(p=>p.group===pollaPlayer.group);
            const ranked = grp.map(p=>({name:p.name,total:calcPts(p,fixtures).total})).sort((a,b)=>b.total-a.total);
            const pos = ranked.findIndex(r=>r.name===userName)+1;
            return {pos, total:ranked.find(r=>r.name===userName)?.total||0, of:grp.length};
          })() : null;
          return (
            <div style={{display:"flex",gap:12,padding:"16px 0",flexWrap:"wrap"}}>
              {ut && nextMatch && <div style={{flex:1,minWidth:220,background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:14,padding:"14px 18px",boxShadow:"0 1px 3px rgba(0,0,0,.06)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:32}}>{ut.flag}</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#6B7280"}}>{t.nextMatch}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#1F2937"}}>{nextMatch.home} vs {nextMatch.away}</div>
                  <div style={{fontSize:12,color:"#6B7280"}}>{nextMatch.date} · {nextMatch.time}</div>
                </div>
              </div>}
              {pollaRank && <div style={{flex:1,minWidth:220,background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:14,padding:"14px 18px",boxShadow:"0 1px 3px rgba(0,0,0,.06)",display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontFamily:fb,fontSize:36,color:"#D4A843"}}>{pollaRank.pos}°</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#6B7280"}}>{t.yourPosition}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#1F2937"}}>{pollaRank.total} puntos</div>
                  <div style={{fontSize:12,color:"#6B7280"}}>{pollaRank.pos} de {pollaRank.of} en {DEMO_PLAYERS.find(p=>p.name===userName)?.group==="friends_usa"?"Amigos USA":DEMO_PLAYERS.find(p=>p.name===userName)?.group==="friends_co"?"Amigos Colombia":"Familia"}</div>
                </div>
              </div>}
            </div>
          );
        })()}
        {page==="home" && <HomePage fixtures={fixtures} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedMatch={liveSelected} setSelectedMatch={setSelectedMatch} onEdit={setEditMatch}/>}
        {page==="fixtures" && <FixturesPage fixtures={fixtures} onSelect={handleFixtureSelect}/>}
        {page==="stats" && <StatsPage fixtures={fixtures}/>}
        {page==="ai" && <AIPredsPage/>}
        {page==="predictions" && <PredictionsPage fixtures={fixtures} uploaded={uploaded} setUploaded={setUploaded}/>}
      </div>

      {/* ─── EDIT MODAL ─── */}
      {editMatch && <EditModal match={editMatch} onSave={handleSave} onClose={()=>setEditMatch(null)}/>}
      <div style={{textAlign:"center",padding:"24px 16px",fontSize:12,color:"#9CA3AF",fontWeight:500}}>
        Creado por JPTDesign
        <span style={{margin:"0 8px"}}>·</span>
        <button onClick={()=>{savePref("onboarded",false);savePref("team",null);savePref("name",null);setShowWelcome(true)}} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:12,fontFamily:ff,textDecoration:"underline"}}>{t.changeTeam}</button>
      </div>
    </div>
  );
}
