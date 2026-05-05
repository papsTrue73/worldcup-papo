// TEST CHANGEimport { useState, useCallback, useMemo} from "react";

// ─────────────────────────────────────────────
//  TRANSLATIONS
// ─────────────────────────────────────────────
const LANG = {
  es: {
    // Header
    brandSub: "Mundial 2026 de Papo",
    brandTitle: "Centro de Mando del Mundial 2026 de Papo",
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
    navHome: "Inicio / Hoy", navFixtures: "Partidos", navStats: "Estadísticas", navPolla: "Polla Mundialista",
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
    friends: "AMIGOS", family: "FAMILIA", players: "jugadores",
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
  },
  en: {
    brandSub: "Papo's 2026 World Cup",
    brandTitle: "Papo's 2026 World Cup Command Center",
    brandDesc: "Four connected views: Today's Games, Fixture Map, Statistics Center and Prediction Game.",
    dataMode: "Data mode:",
    apiLive: "Live API Connected", demoActive: "Demo Mode Active", manualMode: "Manual Mode",
    simulate: "Simulate API refresh", reset: "Reset data",
    matches: "MATCHES", teams: "TEAMS", cities: "HOST CITIES", views: "VIEWS",
    finished: "completed", liveCount: "live", upcomingCount: "upcoming",
    navHome: "Home / Today", navFixtures: "Fixture Map", navStats: "Statistics Center", navPolla: "Polla Mundialista",
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
    friends: "FRIENDS", family: "FAMILY", players: "players",
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
const CONF_C = {UEFA:"#2563eb",CONMEBOL:"#059669",CAF:"#d97706",AFC:"#dc2626",CONCACAF:"#7c3aed",OFC:"#0891b2"};
const GC = {A:"#06b6d4",B:"#7c3aed",C:"#f59e0b",D:"#ef4444",E:"#10b981",F:"#f43f5e",G:"#3b82f6",H:"#8b5cf6",I:"#14b8a6",J:"#ec4899",K:"#06b6d4",L:"#f97316"};

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
  {name:"Chucky",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Duva",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Fercho",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Helder",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Javi",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Juani",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Marcel",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Papo",group:"friends",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Arieh",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Cata",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Chica",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Jorge",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Map",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Milo",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
  {name:"Papo",group:"family",champion:"",goldenBoot:"",groupWinners:{},matches:{}},
];

// ─────────────────────────────────────────────
//  FONTS
// ─────────────────────────────────────────────
const fl=document.createElement("link");
fl.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap";
fl.rel="stylesheet";document.head.appendChild(fl);

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
    upcoming:{bg:"rgba(100,116,139,.12)",color:"#94a3b8",label:t.statusUpcoming},
  }[status]||{bg:"rgba(100,116,139,.12)",color:"#94a3b8",label:status};
  return <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:cfg.bg,color:cfg.color,letterSpacing:.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{cfg.label}</span>;
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
      border: `1px solid ${isSel ? "rgba(6,182,212,.3)" : "rgba(255,255,255,.05)"}`,
      marginBottom:8,
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:10,color:"#64748b",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>
          Group {m.group} · {m.date} · {m.time}
        </span>
        <EstadoBadge status={m.status}/>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:20}}>{ht.flag}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.home}</span>
        </div>
        <span style={{fontFamily:fb,fontSize:22,color:"#fff",minWidth:24,textAlign:"center"}}>{m.status!=="upcoming"?m.homeScore:"—"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:20}}>{at.flag}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{m.away}</span>
        </div>
        <span style={{fontFamily:fb,fontSize:22,color:"#fff",minWidth:24,textAlign:"center"}}>{m.status!=="upcoming"?m.awayScore:"—"}</span>
      </div>
      <div style={{fontSize:10,color:"#475569",marginTop:6,display:"flex",alignItems:"center",gap:4}}>
        <span style={{color:"#64748b"}}>📍</span> {m.city} · {m.venue}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MATCH DETAIL PANEL (right side)
// ─────────────────────────────────────────────
function MatchDetail({match:m, onEdit}) {
  const t=_t;
  if(!m) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#475569",fontSize:14,padding:40,textAlign:"center"}}>
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
          <span style={{fontSize:10,color:"#64748b",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase"}}>
            FASE DE GRUPOS · GRUPO {m.group}
          </span>
          <div style={{fontFamily:fb,fontSize:28,letterSpacing:2,color:"#fff",marginTop:4}}>
            {m.home} vs {m.away}
          </div>
        </div>
        <EstadoBadge status={m.status}/>
      </div>

      {/* Goles display */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:32,padding:"24px 0",background:"rgba(255,255,255,.02)",borderRadius:16,marginBottom:20}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:52,lineHeight:1}}>{ht.flag}</div>
          <div style={{fontSize:14,fontWeight:600,marginTop:8,color:"#e2e8f0"}}>{m.home}</div>
        </div>
        <div style={{textAlign:"center"}}>
          {m.status !== "upcoming" ? (
            <div style={{fontFamily:fb,fontSize:56,color:"#fff",letterSpacing:4}}>
              {m.homeScore}<span style={{color:"#475569",margin:"0 6px"}}>:</span>{m.awayScore}
            </div>
          ) : (
            <div style={{fontFamily:fb,fontSize:28,color:"#475569",letterSpacing:4}}>VS</div>
          )}
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:52,lineHeight:1}}>{at.flag}</div>
          <div style={{fontSize:14,fontWeight:600,marginTop:8,color:"#e2e8f0"}}>{m.away}</div>
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
        padding:"8px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",
        background:"rgba(255,255,255,.04)",color:"#94a3b8",fontSize:12,fontWeight:600,fontFamily:ff,
        marginBottom:24,transition:"all .15s",
      }}>{`✏️ ${t.editMatch}`}</button>

      {/* Two columns: Events + Stats */}
      <div style={{display:"grid",gridTemplateColumns: m.stats?"1fr 1fr":"1fr",gap:20}}>
        {/* Events */}
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            ⚽ Eventos del Partido
          </div>
          {(m.events||[]).length===0 ? (
            <div style={{fontSize:12,color:"#475569"}}>{t.noEvents}</div>
          ) : (
            <div>{(m.events||[]).map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontFamily:fb,fontSize:20,color:e.type==="goal"?"#f59e0b":e.type==="yellow"?"#eab308":"#ef4444",minWidth:36,textAlign:"right"}}>{e.minute}'</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{e.player}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{e.team} · {e.detail || e.type}</div>
                </div>
              </div>
            ))}</div>
          )}
        </div>

        {/* Stats */}
        {m.stats && (
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
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
    background:accent?"rgba(245,158,11,.1)":"rgba(255,255,255,.04)",
    border:`1px solid ${accent?"rgba(245,158,11,.2)":"rgba(255,255,255,.06)"}`,
    fontSize:11,fontWeight:500,color:accent?"#f59e0b":"#cbd5e1"}}>{icon} {text}</div>;
}

function PossessionBar({home,away}) {
  const t=_t;
  return (
    <div style={{marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#94a3b8",marginBottom:6,fontWeight:600}}>
        <span>{t.possession}</span><span>{home}% / {away}%</span>
      </div>
      <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",background:"rgba(255,255,255,.06)"}}>
        <div style={{width:`${home}%`,background:"linear-gradient(90deg,#06b6d4,#3b82f6)",borderRadius:"4px 0 0 4px",transition:"width .5s"}}/>
        <div style={{width:`${away}%`,background:"linear-gradient(90deg,#f43f5e,#ec4899)",borderRadius:"0 4px 4px 0",transition:"width .5s"}}/>
      </div>
    </div>
  );
}

function StatBox({label,homeVal,awayVal,homeName,awayName}) {
  const t=_t;
  return (
    <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.05)",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{fontFamily:fb,fontSize:24,color:"#06b6d4"}}>{homeVal}</span>
        <span style={{fontFamily:fb,fontSize:24,color:"#f43f5e"}}>{awayVal}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:.5}}>
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

  const fieldStyle = {width:"100%",padding:"8px 12px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,color:"#e2e8f0",fontSize:13,fontFamily:ff,outline:"none",boxSizing:"border-box"};
  const labelStyle = {fontSize:10,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2,marginBottom:4,display:"block"};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"linear-gradient(160deg,#0f172a,#1e293b)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,maxWidth:560,width:"100%",maxHeight:"90vh",overflow:"auto",padding:"24px 20px"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontFamily:fb,fontSize:20,letterSpacing:3,color:"#06b6d4"}}>{t.editTitle}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{fontWeight:600,fontSize:14,marginBottom:16,color:"#e2e8f0"}}>{m.home} vs {m.away}</div>

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

        <div style={{fontWeight:600,fontSize:12,color:"#94a3b8",marginBottom:8}}>Estadísticas (local,visitante)</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <div><label style={labelStyle}>Posesión %</label><input value={data.possession} onChange={e=>upd("possession",e.target.value)} style={fieldStyle} placeholder="57,43"/></div>
          <div><label style={labelStyle}>Tiros</label><input value={data.shots} onChange={e=>upd("shots",e.target.value)} style={fieldStyle} placeholder="14,8"/></div>
          <div><label style={labelStyle}>Tiros a Puerta</label><input value={data.sot} onChange={e=>upd("sot",e.target.value)} style={fieldStyle} placeholder="6,3"/></div>
          <div><label style={labelStyle}>Esquinas</label><input value={data.corners} onChange={e=>upd("corners",e.target.value)} style={fieldStyle} placeholder="7,4"/></div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",background:"rgba(255,255,255,.06)",color:"#94a3b8",fontFamily:ff,fontSize:13,fontWeight:600}}>{t.cancel}</button>
          <button onClick={save} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#06b6d4,#7c3aed)",color:"#fff",fontFamily:ff,fontSize:13,fontWeight:600}}>{t.save}</button>
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
  const dayMatches = useMemo(()=> fixtures.filter(f=>f.date===selectedDate), [fixtures,selectedDate]);
  const jugados = dayMatches.filter(f=>f.status==="ft");
  const live = dayMatches.filter(f=>f.status==="live");
  const upcoming = dayMatches.filter(f=>f.status==="upcoming");

  return (
    <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:0,minHeight:"calc(100vh - 180px)"}}>
      {/* LEFT: Game list */}
      <div style={{borderRight:"1px solid rgba(255,255,255,.06)",padding:"20px 16px",overflow:"auto",maxHeight:"calc(100vh - 180px)"}}>
        {/* Date nav */}
        <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
          {MATCH_DATES.map(d=>(
            <button key={d} onClick={()=>{setSelectedDate(d);setSelectedMatch(null)}} style={{
              padding:"5px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,.06)",cursor:"pointer",
              fontSize:11,fontWeight:600,fontFamily:ff,transition:"all .15s",
              background:selectedDate===d?"rgba(6,182,212,.15)":"transparent",
              color:selectedDate===d?"#06b6d4":"#64748b",
            }}>{d}</button>
          ))}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <span style={{fontFamily:fb,fontSize:20,letterSpacing:2,color:"#e2e8f0"}}>{t.todayGames}</span>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,
            background: live.length>0?"rgba(239,68,68,.12)":"rgba(16,185,129,.1)",
            color: live.length>0?"#ef4444":"#10b981",
          }}>{live.length>0?`${live.length} ${t.statusLive}`:t.liveReady}</span>
        </div>
        <p style={{fontSize:11,color:"#64748b",marginBottom:16,lineHeight:1.5}}>
          Partidos agrupados por día con marcadores y estado. Haz clic en un partido para ver detalles.
        </p>

        {live.length>0 && <>
          <div style={{fontSize:10,fontWeight:700,color:"#ef4444",letterSpacing:1.5,marginBottom:8}}>{t.liveNow}</div>
          {live.map(m=><GameCard key={m.id} match={m} selected={selectedMatch} onClick={setSelectedMatch}/>)}
        </>}
        {jugados.length>0 && <>
          <div style={{fontSize:10,fontWeight:700,color:"#10b981",letterSpacing:1.5,marginBottom:8,marginTop:live.length?16:0}}>{t.completed}</div>
          {jugados.map(m=><GameCard key={m.id} match={m} selected={selectedMatch} onClick={setSelectedMatch}/>)}
        </>}
        {upcoming.length>0 && <>
          <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",letterSpacing:1.5,marginBottom:8,marginTop:(jugados.length||live.length)?16:0}}>{t.comingNext}</div>
          {upcoming.map(m=><GameCard key={m.id} match={m} selected={selectedMatch} onClick={setSelectedMatch}/>)}
        </>}
        {dayMatches.length===0 && <div style={{color:"#475569",fontSize:13,padding:20}}>{t.noMatches}</div>}
      </div>

      {/* RIGHT: Match detail */}
      <div style={{overflow:"auto",maxHeight:"calc(100vh - 180px)"}}>
        <MatchDetail match={selectedMatch} onEdit={onEdit}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE 2: FIXTURES
// ─────────────────────────────────────────────
function FixturesPage({fixtures, onSelect}) {
  const t=_t;
  const [gf, setGf] = useState("ALL");
  const list = gf==="ALL" ? fixtures : fixtures.filter(f=>f.group===gf);
  return (<div style={{padding:"20px 0"}}>
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20}}>
      <button style={fbtn(gf==="ALL")} onClick={()=>setGf("ALL")}>{t.all}</button>
      {Object.keys(GROUPS).map(g=><button key={g} style={fbtn(gf===g)} onClick={()=>setGf(g)}>{g}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:20}}>
      {Object.keys(GROUPS).filter(g=>gf==="ALL"||gf===g).map(g=>{
        const st = calcStandings(g, fixtures);
        const gMatches = list.filter(f=>f.group===g);
        return (<div key={g} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",
            background:`linear-gradient(90deg,${GC[g]||"#06b6d4"}15,transparent)`,borderBottom:`1px solid ${GC[g]||"#06b6d4"}30`}}>
            <span style={{fontFamily:fb,fontSize:20,letterSpacing:3,color:GC[g]||"#06b6d4"}}>GROUP {g}</span>
            <span style={{fontSize:10,color:"#64748b"}}>{gMatches.filter(f=>f.status==="ft").length}/6 {t.played}</span>
          </div>
          {/* Standings mini */}
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["","Equipo","P","W","D","L","GD","Pts"].map(h=><th key={h} style={{padding:"6px 4px",textAlign:h==="Equipo"?"left":"center",color:"#64748b",fontSize:9,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{st.map((t,i)=>(
              <tr key={t.name} style={{borderTop:"1px solid rgba(255,255,255,.03)",background:i<2?"rgba(16,185,129,.04)":i===2?"rgba(245,158,11,.04)":"transparent"}}>
                <td style={{padding:"6px 4px",textAlign:"center"}}><span style={{width:16,height:16,borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,background:i<2?"rgba(16,185,129,.2)":i===2?"rgba(245,158,11,.2)":"rgba(255,255,255,.05)",color:i<2?"#10b981":i===2?"#f59e0b":"#64748b"}}>{i+1}</span></td>
                <td style={{padding:"6px 4px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{t.flag}</span><span style={{fontWeight:500}}>{t.name}</span></td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{t.mp}</td><td style={{textAlign:"center",color:"#94a3b8"}}>{t.w}</td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{t.d}</td><td style={{textAlign:"center",color:"#94a3b8"}}>{t.l}</td>
                <td style={{textAlign:"center",color:t.gd>0?"#10b981":t.gd<0?"#ef4444":"#64748b"}}>{t.gd>0?"+":""}{t.gd}</td>
                <td style={{textAlign:"center",fontWeight:700,color:"#fff"}}>{t.pts}</td>
              </tr>))}</tbody>
          </table>
          {/* Match list */}
          {gMatches.map(m=>{
            const ht=team(m.home),at=team(m.away);
            return (<div key={m.id} onClick={()=>onSelect(m)} style={{padding:"8px 14px",borderTop:"1px solid rgba(255,255,255,.03)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
                <span>{ht.flag}</span><span style={{fontWeight:500}}>{m.home}</span>
                <span style={{color:"#475569",fontSize:10}}>vs</span>
                <span style={{fontWeight:500}}>{m.away}</span><span>{at.flag}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {m.status!=="upcoming"&&<span style={{fontFamily:fb,fontSize:16,color:"#fff"}}>{m.homeScore}-{m.awayScore}</span>}
                <EstadoBadge status={m.status}/>
              </div>
            </div>);
          })}
        </div>);
      })}
    </div>
  </div>);
}

function fbtn(a){return{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,.08)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:ff,background:a?"rgba(6,182,212,.15)":"transparent",color:a?"#06b6d4":"#64748b",transition:"all .15s"}}

// ─────────────────────────────────────────────
//  PAGE 3: STATISTICS
// ─────────────────────────────────────────────
function StatsPage({fixtures}) {
  const t=_t;
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

  const card = ch => ({background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:20,...(ch||{})});

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
        padding:"8px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,.08)",cursor:"pointer",
        background:"rgba(255,255,255,.03)",color:"#94a3b8",fontSize:12,fontWeight:600,fontFamily:ff,
        marginBottom:20,display:"flex",alignItems:"center",gap:6,
      }}>{t.backToTournament}</button>

      {/* Team header */}
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{fontSize:64,lineHeight:1}}>{tm.flag}</div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontFamily:fb,fontSize:36,letterSpacing:2,color:"#fff",lineHeight:1.1}}>{selTeam}</div>
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:`${CONF_C[tm.conf]||"#666"}20`,color:CONF_C[tm.conf]||"#666",letterSpacing:.5}}>{tm.conf}</span>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:`${GC[groupKey]||"#06b6d4"}20`,color:GC[groupKey]||"#06b6d4",letterSpacing:.5}}>Group {groupKey}</span>
            {groupPos>0&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,
              background:groupPos<=2?"rgba(16,185,129,.12)":groupPos===3?"rgba(245,158,11,.12)":"rgba(239,68,68,.12)",
              color:groupPos<=2?"#10b981":groupPos===3?"#f59e0b":"#ef4444",
            }}>{groupPos===1?"1st":groupPos===2?"2nd":groupPos===3?"3rd":"4th"} en Grupo</span>}
          </div>
        </div>
        {/* Form badges */}
        <div style={{display:"flex",gap:4}}>
          {ts.matches.map((m,i)=>(
            <span key={i} style={{width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,fontWeight:800,
              background:m.result==="W"?"rgba(16,185,129,.15)":m.result==="D"?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)",
              color:m.result==="W"?"#10b981":m.result==="D"?"#f59e0b":"#ef4444",
            }}>{m.result}</span>
          ))}
          {mp===0&&<span style={{fontSize:11,color:"#475569"}}>Sin partidos aún</span>}
        </div>
      </div>

      {/* Key numbers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:24}}>
        {[
          {v:mp,l:t.pj,c:"#06b6d4"},{v:w,l:"G",c:"#10b981"},{v:d,l:"E",c:"#f59e0b"},{v:l,l:"P",c:"#ef4444"},
          {v:ts.gf,l:t.gf,c:"#7c3aed"},{v:ts.ga,l:t.gc,c:"#f43f5e"},{v:ts.gf-ts.ga,l:t.dg,c:ts.gf-ts.ga>0?"#10b981":ts.gf-ts.ga<0?"#ef4444":"#64748b"},
          {v:pts,l:t.pts,c:"#fff"},{v:avgPoss+"%",l:t.avgPoss,c:"#3b82f6"},{v:ts.cleanSheets,l:t.cleanSheet,c:"#14b8a6"},
        ].map(x=>(
          <div key={x.l} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontFamily:fb,fontSize:24,color:x.c}}>{x.v}</div>
            <div style={{fontSize:9,color:"#64748b",letterSpacing:.5,textTransform:"uppercase",marginTop:2}}>{x.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        {/* Match results */}
        <div style={card()}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12}}>{t.matchResults}</div>
          {ts.matches.length===0?<div style={{color:"#475569",fontSize:12}}>{t.noMatchesYet}</div>:
          ts.matches.map((m,i)=>{
            const opp = team(m.opponent);
            return (<div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,
                  background:m.result==="W"?"rgba(16,185,129,.15)":m.result==="D"?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)",
                  color:m.result==="W"?"#10b981":m.result==="D"?"#f59e0b":"#ef4444"}}>{m.result}</span>
                <span style={{fontSize:18}}>{opp.flag}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{m.isHome?"vs":"@"} {m.opponent}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{m.date} · {m.venue}</div>
                </div>
              </div>
              <div style={{fontFamily:fb,fontSize:20,color:"#fff"}}>{m.teamScore} - {m.oppScore}</div>
            </div>);
          })}
        </div>

        {/* Team goalscorers */}
        <div style={card()}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12}}>{t.teamScorers}</div>
          {teamGoals.length===0?<div style={{color:"#475569",fontSize:12}}>No goals scored yet.</div>:
          teamGoals.map((g,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13}}>⚽</span>
                <span style={{fontSize:13,fontWeight:600}}>{g.name}</span>
              </div>
              <span style={{fontFamily:fb,fontSize:20,color:"#f59e0b"}}>{g.goals}</span>
            </div>
          ))}

          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12,marginTop:24}}>{t.discipline}</div>
          <div style={{display:"flex",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:14,height:18,borderRadius:2,background:"#eab308"}}/> 
              <span style={{fontSize:13,fontWeight:600}}>{ts.yellows}</span>
              <span style={{fontSize:11,color:"#64748b"}}>Amarilla</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:14,height:18,borderRadius:2,background:"#ef4444"}}/> 
              <span style={{fontSize:13,fontWeight:600}}>{ts.reds}</span>
              <span style={{fontSize:11,color:"#64748b"}}>Roja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance bars */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:16}}>{t.perfMetrics}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <StatBar label="Goles Anotados" value={ts.gf} max={maxGoals} color="#10b981"/>
          <StatBar label="Goles Recibidos" value={ts.ga} max={maxGoals} color="#ef4444"/>
          <StatBar label="Total de Tiros" value={ts.shots} max={maxShots} color="#3b82f6"/>
          <StatBar label="Tiros a Puerta" value={ts.sot} max={maxShots} color="#7c3aed"/>
          <StatBar label="Esquinas Ganadas" value={ts.corners} max={maxCorners} color="#f59e0b"/>
          <StatBar label="Faltas Cometidas" value={ts.fouls} max={Math.max(...allTeamStats.map(t=>t.fouls),1)} color="#f43f5e"/>
        </div>
      </div>

      {/* Match-by-match stats breakdown */}
      {ts.matches.some(m=>m.stats)&&<div style={{...card(),marginTop:20}}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:16}}>{t.matchByMatch}</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:500}}>
            <thead><tr>{["Rival","Resultado","Pos","Tiros","TAP","Esq","Faltas"].map(h=>
              <th key={h} style={{padding:"8px 6px",textAlign:h==="Rival"?"left":"center",color:"#64748b",fontSize:10,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",borderBottom:"1px solid rgba(255,255,255,.06)"}}>{h}</th>
            )}</tr></thead>
            <tbody>{ts.matches.map((m,i)=>{
              const idx = m.isHome?0:1;
              return(<tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                <td style={{padding:"8px 6px",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14}}>{team(m.opponent).flag}</span>
                  <span style={{fontWeight:500}}>{m.opponent}</span>
                </td>
                <td style={{textAlign:"center"}}><span style={{fontWeight:700,color:m.result==="W"?"#10b981":m.result==="D"?"#f59e0b":"#ef4444"}}>{m.teamScore}-{m.oppScore}</span></td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{m.stats?m.stats.possession[idx]+"%":"—"}</td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{m.stats?m.stats.shots[idx]:"—"}</td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{m.stats?m.stats.shotsOnTarget[idx]:"—"}</td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{m.stats?m.stats.corners[idx]:"—"}</td>
                <td style={{textAlign:"center",color:"#94a3b8"}}>{m.stats?m.stats.fouls[idx]:"—"}</td>
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
      <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#94a3b8",marginBottom:12}}>{t.selectTeam}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:6}}>
        {ALL_TEAMS.map(t=>{
          const hasData = !!teamStats[t.name];
          return (<button key={t.name} onClick={()=>selectTeam(t.name)} style={{
            display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,cursor:"pointer",
            border:"1px solid rgba(255,255,255,.06)",fontFamily:ff,fontSize:12,fontWeight:500,
            background:hasData?"rgba(255,255,255,.03)":"rgba(255,255,255,.01)",
            color:hasData?"#e2e8f0":"#475569",transition:"all .15s",textAlign:"left",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(6,182,212,.3)";e.currentTarget.style.background="rgba(6,182,212,.06)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.background=hasData?"rgba(255,255,255,.03)":"rgba(255,255,255,.01)"}}>
            <span style={{fontSize:18}}>{t.flag}</span>
            <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
          </button>);
        })}
      </div>
    </div>

    {/* Overview row */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
      {[{v:done.length,l:"Partidos Jugados",c:"#06b6d4"},{v:totalGoals,l:"Goles Anotados",c:"#7c3aed"},
        {v:done.length>0?(totalGoals/done.length).toFixed(1):"—",l:"Goles / Partido",c:"#f43f5e"},
        {v:goals.length,l:"Total de Goles",c:"#f59e0b"},{v:yellows,l:"Tarjetas Amarillas",c:"#eab308"},{v:reds,l:"Tarjetas Rojas",c:"#ef4444"},
      ].map(x=>(
        <div key={x.l} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"16px 12px",textAlign:"center"}}>
          <div style={{fontFamily:fb,fontSize:32,color:x.c}}>{x.v}</div>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:.5,textTransform:"uppercase",marginTop:4}}>{x.l}</div>
        </div>
      ))}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
      {/* Top scorers */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12}}>{t.topScorers}</div>
        {topScorers.length===0?<div style={{color:"#475569",fontSize:12}}>{t.noGoals}</div>:
        topScorers.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)",cursor:"pointer"}}
            onClick={()=>selectTeam(s.team)}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,
                background:i===0?"rgba(245,158,11,.2)":i<3?"rgba(16,185,129,.15)":"rgba(255,255,255,.05)",
                color:i===0?"#f59e0b":i<3?"#10b981":"#64748b"}}>{i+1}</span>
              <span style={{fontSize:20}}>{team(s.team).flag}</span>
              <div><div style={{fontSize:13,fontWeight:600}}>{s.name}</div><div style={{fontSize:10,color:"#64748b"}}>{s.team}</div></div>
            </div>
            <span style={{fontFamily:fb,fontSize:22,color:"#f59e0b"}}>{s.goals}</span>
          </div>
        ))}
      </div>

      {/* POTM */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12}}>{t.potmAwards}</div>
        {topPotm.length===0?<div style={{color:"#475569",fontSize:12}}>{t.noAwards}</div>:
        topPotm.map(([n,c],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#f59e0b"}}>⭐</span><span style={{fontSize:13,fontWeight:500}}>{n}</span></div>
            <span style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>{c}×</span></div>
        ))}
      </div>

      {/* Top attacking teams */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12}}>{t.topAttacking}</div>
        {topAttack.length===0?<div style={{color:"#475569",fontSize:12}}>{t.noData}</div>:
        topAttack.map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)",cursor:"pointer"}}
            onClick={()=>selectTeam(t.name)}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{team(t.name).flag}</span>
              <div><div style={{fontSize:13,fontWeight:600}}>{t.name}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{t.shots} tiros · {t.sot} a puerta · {t.corners}esquinas</div></div>
            </div>
            <span style={{fontFamily:fb,fontSize:22,color:"#10b981"}}>{t.gf}</span>
          </div>
        ))}
      </div>

      {/* Group leaders */}
      <div style={card()}>
        <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:12}}>{t.groupLeaders}</div>
        {Object.keys(GROUPS).map(g=>{
          const st=calcStandings(g,fixtures);
          const leader=st[0];
          return (<div key={g} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)",cursor:"pointer"}}
            onClick={()=>selectTeam(leader.name)}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:fb,fontSize:14,color:GC[g],letterSpacing:1}}>GRP {g}</span>
              <span style={{fontSize:16}}>{leader.flag}</span>
              <span style={{fontSize:12,fontWeight:500}}>{leader.name}</span>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{leader.pts} pts</span>
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
        <span style={{fontSize:11,color:"#94a3b8",fontWeight:500}}>{label}</span>
        <span style={{fontFamily:fb,fontSize:16,color}}>{value}</span>
      </div>
      <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
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
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("all");
  const [showDemo,setShowDemo]=useState(true);
  const [showImport,setShowImport]=useState(false);
  const [jsonText,setJsonText]=useState("");
  const [importMsg,setImportMsg]=useState(null);

  const all=[...(showDemo?DEMO_PLAYERS:[]),...uploaded];
  const fri=all.filter(p=>p.group==="friends");
  const fam=all.filter(p=>p.group==="family");

  const doImport=()=>{
    try{
      const data=JSON.parse(jsonText);
      const arr=Array.isArray(data)?data:[data];
      let added=0;
      arr.forEach(p=>{
        if(!p.name)return;
        if(!p.group) p.group="friends";
        if(!p.groupWinners) p.groupWinners={};
        if(!p.matches) p.matches={};
        const exists=uploaded.findIndex(u=>u.name.toLowerCase()===p.name.toLowerCase());
        if(exists>=0){setUploaded(prev=>{const n=[...prev];n[exists]={...p,uploaded:true};return n})}
        else{setUploaded(prev=>[...prev,{...p,uploaded:true}])}
        added++;
      });
      setImportMsg({ok:true,msg:`${added} jugador(es) importado(s)`});
      setJsonText("");setShowImport(false);
    }catch(err){setImportMsg({ok:false,msg:`Error JSON: ${err.message}`})}
  };

  const remove=(name)=>{setUploaded(prev=>prev.filter(p=>p.name!==name));if(sel?.name===name)setSel(null)};

  const board=(players,label,accent)=>{
    const ranked=players.map(p=>({...p,pts:calcPts(p,fixtures)})).sort((a,b)=>b.pts.total-a.pts.total);
    return(<div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,overflow:"hidden"}}>
      <div style={{padding:"14px 18px",background:accent,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:fb,fontSize:20,letterSpacing:2,color:"#fff"}}>{label}</span>
        <span style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:600}}>{players.length} {t.players}</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
        {[t.pos,t.name,t.resultsCol,t.exactCol,t.groupCol,t.totalCol].map(h=><th key={h} style={{padding:"10px 8px",textAlign:h==="Nombre"?"left":"center",fontSize:12,fontWeight:700,color:"#64748b",borderBottom:"1px solid rgba(255,255,255,.06)"}}>{h}</th>)}
      </tr></thead><tbody>{ranked.map((p,i)=>(
        <tr key={p.name} onClick={()=>setSel(p)} style={{cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,.04)"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 8px",textAlign:"center"}}><span style={{width:24,height:24,borderRadius:7,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,background:i===0?"rgba(245,158,11,.15)":i<3?"rgba(16,185,129,.12)":"rgba(255,255,255,.05)",color:i===0?"#f59e0b":i<3?"#10b981":"#64748b"}}>{i+1}</span></td>
          <td style={{padding:"10px 8px",fontWeight:600,fontSize:14,color:"#e2e8f0"}}>{p.name}{p.uploaded&&<span style={{marginLeft:6,fontSize:10,color:"#06b6d4"}}>(t.imported)</span>}</td>
          <td style={{padding:"10px 8px",textAlign:"center",fontSize:13,color:"#94a3b8"}}>{p.pts.rPts}</td>
          <td style={{padding:"10px 8px",textAlign:"center",fontSize:13,color:"#94a3b8"}}>{p.pts.ePts}</td>
          <td style={{padding:"10px 8px",textAlign:"center",fontSize:13,color:"#94a3b8"}}>{p.pts.gPts}</td>
          <td style={{padding:"10px 8px",textAlign:"center"}}><span style={{fontFamily:fb,fontSize:22,color:accent}}>{p.pts.total}</span></td>
        </tr>))}</tbody></table>
    </div>);
  };

  if(sel){
    const pts=calcPts(sel,fixtures);
    const done=fixtures.filter(f=>f.status==="ft"||f.status==="live");
    return(<div style={{padding:"20px 0"}}>
      <button onClick={()=>setSel(null)} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,.08)",cursor:"pointer",background:"rgba(255,255,255,.03)",color:"#94a3b8",fontSize:12,fontWeight:600,fontFamily:ff,marginBottom:20}}>{t.back}</button>
      <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div><div style={{fontFamily:fb,fontSize:32,letterSpacing:2,color:"#fff"}}>{sel.name}</div>
            <span style={{fontSize:12,fontWeight:700,padding:"3px 12px",borderRadius:20,background:sel.group==="friends"?"rgba(6,182,212,.12)":"rgba(244,63,94,.12)",color:sel.group==="friends"?"#06b6d4":"#f43f5e",marginTop:6,display:"inline-block"}}>{sel.group==="friends"?t.friends.charAt(0).toUpperCase()+t.friends.slice(1).toLowerCase():t.family.charAt(0).toUpperCase()+t.family.slice(1).toLowerCase()}</span></div>
          <div style={{textAlign:"center"}}><div style={{fontFamily:fb,fontSize:48,color:"#f59e0b"}}>{pts.total}</div><div style={{fontSize:12,fontWeight:700,color:"#64748b"}}>PUNTOS</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:20}}>
          {[{v:pts.rCount,l:t.resultados,s:`${pts.rPts} pts`,c:"#06b6d4"},{v:pts.eCount,l:t.exactos,s:`${pts.ePts} pts`,c:"#10b981"},{v:Object.keys(sel.groupWinners||{}).length,l:t.grupos,s:`${pts.gPts} pts`,c:"#7c3aed"},{v:"—",l:t.bonos,s:"0 pts",c:"#f59e0b"}].map(x=>(<div key={x.l} style={{background:"rgba(255,255,255,.03)",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{fontFamily:fb,fontSize:22,color:x.c}}>{x.v}</div><div style={{fontSize:12,color:"#64748b"}}>{x.l}</div><div style={{fontSize:12,fontWeight:700,color:x.c,marginTop:2}}>{x.s}</div></div>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:20}}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:16}}>{t.preTournament}</div>
          {[{l:"Campeón",v:sel.champion},{l:"Bota de Oro",v:sel.goldenBoot}].map(x=>(<div key={x.l} style={{padding:"10px 14px",background:"rgba(255,255,255,.02)",borderRadius:10,marginBottom:8}}>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{x.l}</div><div style={{fontSize:16,fontWeight:700,color:"#e2e8f0",marginTop:2}}>{x.v||"—"}</div></div>))}
          <div style={{fontFamily:fb,fontSize:16,letterSpacing:2,color:"#06b6d4",marginTop:20,marginBottom:12}}>{t.groupWinners}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {Object.entries(sel.groupWinners||{}).map(([g,pick])=>{
              const st=calcStandings(g,fixtures);const actual=st.length>0&&st[0].mp>0?st[0].name:null;const ok=actual&&actual===pick;
              return(<div key={g} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",borderRadius:8,fontSize:12,background:!actual?"rgba(255,255,255,.02)":ok?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${!actual?"rgba(255,255,255,.04)":ok?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)"}`}}>
                <span style={{fontWeight:700,color:GC[g]||"#06b6d4"}}>Gr {g}</span><span style={{fontWeight:600,color:!actual?"#94a3b8":ok?"#10b981":"#ef4444"}}>{pick}</span>{ok&&<span style={{color:"#10b981"}}>✓</span>}
              </div>);})}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:20}}>
          <div style={{fontFamily:fb,fontSize:18,letterSpacing:2,color:"#06b6d4",marginBottom:16}}>{t.pollaTitle}</div>
          {done.length===0?<div style={{color:"#64748b",fontSize:13}}>Sin partidos jugados aún.</div>:done.map(f=>{
            const p=sel.matches?.[f.id];if(!p)return null;
            const aR=(f.homeScore||0)>(f.awayScore||0)?"W":(f.homeScore||0)<(f.awayScore||0)?"L":"D";
            const rOk=p.r===aR,sOk=p.h===f.homeScore&&p.a===f.awayScore;
            return(<div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{team(f.home).flag} {f.home} vs {f.away} {team(f.away).flag}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Pred: <b>{p.h}-{p.a}</b> ({p.r}) · Real: <b>{f.homeScore}-{f.awayScore}</b> ({aR})</div></div>
              <div style={{display:"flex",gap:4}}>
                {rOk&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"rgba(16,185,129,.12)",color:"#10b981",fontWeight:700}}>+3</span>}
                {sOk&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"rgba(245,158,11,.15)",color:"#f59e0b",fontWeight:700}}>+5</span>}
                {!rOk&&!sOk&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"rgba(255,255,255,.05)",color:"#64748b",fontWeight:600}}>0</span>}</div>
            </div>);})}
        </div>
      </div>
    </div>);
  }

  return(<div style={{padding:"20px 0"}}>
    <div style={{fontFamily:fb,fontSize:24,letterSpacing:2,color:"#06b6d4",marginBottom:4}}>POLLA MUNDIALISTA</div>
    <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>{t.pollaDesc}</div>
    {/* Import panel */}
    <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"16px 20px",marginBottom:20}}>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{t.importPlayers}</div>
          <div style={{fontSize:12,color:"#64748b"}}>{t.importDesc}</div>
        </div>
        <button onClick={()=>setShowImport(!showImport)} style={{padding:"8px 18px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#06b6d4,#7c3aed)",color:"#fff",fontSize:12,fontWeight:600,fontFamily:ff}}>
          {showImport?"Cerrar":"📋 Importar JSON"}
        </button>
        {uploaded.length>0&&<span style={{fontSize:12,color:"#06b6d4",fontWeight:600}}>{uploaded.length} importado{uploaded.length>1?"s":""}</span>}
      </div>
      {showImport&&<div style={{marginTop:12}}>
        <textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} rows={6} placeholder={'[\n  {"name":"Juan","group":"friends","champion":"Argentina","goldenBoot":"Mbappé",\n   "groupWinners":{"A":"Mexico","B":"Canada",...},\n   "matches":{"0":{"r":"W","h":2,"a":1},...}}\n]'} style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,color:"#e2e8f0",fontSize:12,fontFamily:"monospace",outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={doImport} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",background:"#10b981",color:"#fff",fontSize:12,fontWeight:600,fontFamily:ff}}>{t.importGo}</button>
          {importMsg&&<span style={{fontSize:12,fontWeight:600,color:importMsg.ok?"#10b981":"#ef4444",alignSelf:"center"}}>{importMsg.msg}</span>}
        </div>
      </div>}
    </div>
    {/* Filters */}
    <div style={{display:"flex",gap:6,marginBottom:20,alignItems:"center",flexWrap:"wrap"}}>
      {[{id:"all",l:"Todos"},{id:"friends",l:"Amigos"},{id:"family",l:"Familia"}].map(f=>(
        <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"7px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.08)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:ff,background:filter===f.id?"rgba(6,182,212,.15)":"transparent",color:filter===f.id?"#06b6d4":"#64748b"}}>{f.l}</button>))}
      <label style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:"#64748b"}}>
        <input type="checkbox" checked={showDemo} onChange={e=>setShowDemo(e.target.checked)}/> {t.showDemo}</label>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      {(filter==="all"||filter==="friends")&&board(fri,"AMIGOS","#06b6d4")}
      {(filter==="all"||filter==="family")&&board(fam,"FAMILIA","#f43f5e")}
      {fri.length===0&&fam.length===0&&<div style={{textAlign:"center",padding:40,color:"#64748b"}}>{t.noPlayers}</div>}
    </div>
  </div>);
}

function FetchPanel({fixtures, onUpdate}) {
  const t=_t;
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState(null); // {ok:bool, msg:string}
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

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
      const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches?season=2026",{
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
        const res = await fetch(`https://api.football-data.org/v4/matches/${m._apiMatchId}`,{
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

  return (
    <div style={{padding:"12px 16px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,marginBottom:16}}>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#06b6d4",letterSpacing:1,whiteSpace:"nowrap"}}>API EN VIVO</div>
        <input
          type="password"
          value={apiKey}
          onChange={e=>setApiKey(e.target.value)}
          placeholder="Pega tu API key de football-data.org"
          style={{flex:1,minWidth:200,maxWidth:320,padding:"7px 12px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",
            borderRadius:8,color:"#e2e8f0",fontSize:12,fontFamily:ff,outline:"none",boxSizing:"border-box"}}
        />
        <button onClick={fetchMatches} disabled={loading} style={{
          padding:"7px 16px",borderRadius:8,border:"none",cursor:loading?"default":"pointer",
          background:loading?"rgba(255,255,255,.04)":"linear-gradient(135deg,#06b6d4,#7c3aed)",
          color:"#fff",fontSize:11,fontWeight:600,fontFamily:ff,opacity:loading?.6:1,whiteSpace:"nowrap",
        }}>{loading?"Cargando...":t.fetchScores}</button>
        <button onClick={fetchDetails} disabled={detailsLoading} style={{
          padding:"7px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",cursor:detailsLoading?"default":"pointer",
          background:"rgba(255,255,255,.04)",color:"#e2e8f0",fontSize:11,fontWeight:600,fontFamily:ff,
          opacity:detailsLoading?.6:1,whiteSpace:"nowrap",
        }}>{detailsLoading?"Cargando...":"Obtener Detalles"}</button>
        <div style={{fontSize:10,color:"#475569",marginLeft:"auto",whiteSpace:"nowrap"}}>Gratis · 10 req/min</div>
      </div>
      {status && <div style={{marginTop:8,fontSize:11,fontWeight:600,padding:"5px 12px",borderRadius:6,display:"inline-block",
        background:status.ok?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)",
        color:status.ok?"#10b981":"#f59e0b",
      }}>{status.msg}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("es");
  const t=LANG[lang]||LANG.es;
  _t=t;
  const [fixtures, setFixtures] = useState(initFixtures);
  const [page, setPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState("Jun 11");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editMatch, setEditMatch] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [apiConnected, setApiConnected] = useState(false);

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

  return (
    <div style={{fontFamily:ff,background:"linear-gradient(145deg,#050816 0%,#0c1229 40%,#111b3a 100%)",minHeight:"100vh",color:"#e2e8f0"}}>
      {/* ─── HEADER ─── */}
      <div style={{background:"linear-gradient(135deg,rgba(6,182,212,.08),rgba(124,58,237,.08),rgba(244,63,94,.06))",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"20px 24px 16px",position:"relative"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:16}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#06b6d4",letterSpacing:2,textTransform:"uppercase",marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:8,height:8,borderRadius:4,background:"#06b6d4"}}/>{t.brandSub}
              </div>
              <div style={{fontFamily:fb,fontSize:36,letterSpacing:3,lineHeight:1.1,
                background:"linear-gradient(90deg,#fff 0%,#94a3b8 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {t.brandTitle}
              </div>
              <div style={{fontSize:12,color:"#64748b",marginTop:4,maxWidth:480}}>
                {t.brandDesc}
              </div>
              <div style={{marginTop:8,fontSize:11,fontWeight:600,color:"#94a3b8"}}>
                {t.dataMode} <span style={{color:apiConnected?"#10b981":demoMode?"#06b6d4":"#f59e0b"}}>{apiConnected?t.apiLive:demoMode?t.demoActive:t.manualMode}</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              <button onClick={()=>setLang(l=>l==="es"?"en":"es")} style={{position:"absolute",top:12,right:12,padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:ff,letterSpacing:1,zIndex:10}}>{lang==="es"?"EN 🇺🇸":"ES 🇪🇸"}</button>
              {[{v:"104",l:t.matches},{v:"48",l:t.teams},{v:"16",l:t.cities},{v:"4",l:t.views}].map(x=>(
                <div key={x.l} style={{background:"rgba(6,182,212,.08)",border:"1px solid rgba(6,182,212,.15)",borderRadius:12,padding:"10px 14px",textAlign:"center",minWidth:72}}>
                  <div style={{fontFamily:fb,fontSize:28,color:"#fff",letterSpacing:1}}>{x.v}</div>
                  <div style={{fontSize:9,color:"#06b6d4",fontWeight:700,letterSpacing:1}}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            <button onClick={simulateDemo} style={{padding:"8px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",background:"rgba(255,255,255,.04)",color:"#e2e8f0",fontSize:12,fontWeight:600,fontFamily:ff,display:"flex",alignItems:"center",gap:6}}>
              {`⚡ ${t.simulate}`}
            </button>
            <button onClick={resetData} style={{padding:"8px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",background:"rgba(255,255,255,.04)",color:"#94a3b8",fontSize:12,fontWeight:600,fontFamily:ff,display:"flex",alignItems:"center",gap:6}}>
              {`🔄 ${t.reset}`}
            </button>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12,fontSize:11,color:"#64748b"}}>
              <span>{totalPlayed} {t.finished}</span>
              {totalLive>0&&<span style={{color:"#ef4444",fontWeight:700}}>{totalLive} {t.liveCount}</span>}
              <span>{72-totalPlayed-totalLive} {t.upcomingCount}</span>
            </div>
          </div>

          {/* API Fetch Panel */}
          <FetchPanel fixtures={fixtures} onUpdate={handleApiUpdate}/>

          {/* Nav tabs */}
          <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.04)",borderRadius:12,padding:4,width:"fit-content"}}>
            {[{id:"home",icon:"🏠",label:t.navHome},{id:"fixtures",icon:"🏟️",label:t.navFixtures},{id:"stats",icon:"📊",label:t.navStats},{id:"predictions",icon:"🏆",label:t.navPolla}].map(t=>(
              <button key={t.id} onClick={()=>setPage(t.id)} style={{
                padding:"10px 22px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:ff,fontSize:13,fontWeight:600,
                letterSpacing:.3,transition:"all .2s",display:"flex",alignItems:"center",gap:6,
                background:page===t.id?"linear-gradient(135deg,#06b6d4,#7c3aed)":"transparent",
                color:page===t.id?"#fff":"#94a3b8",
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        {page==="home" && <HomePage fixtures={fixtures} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedMatch={liveSelected} setSelectedMatch={setSelectedMatch} onEdit={setEditMatch}/>}
        {page==="fixtures" && <FixturesPage fixtures={fixtures} onSelect={handleFixtureSelect}/>}
        {page==="stats" && <StatsPage fixtures={fixtures}/>}
        {page==="predictions" && <PredictionsPage fixtures={fixtures} uploaded={uploaded} setUploaded={setUploaded}/>}
      </div>

      {/* ─── EDIT MODAL ─── */}
      {editMatch && <EditModal match={editMatch} onSave={handleSave} onClose={()=>setEditMatch(null)}/>}
    </div>
  );
}
