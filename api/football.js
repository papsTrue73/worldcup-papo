export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || req.headers.referer || "";
  const allowed = ["worldcup-papo.vercel.app", "localhost"];
  if (!allowed.some(d => origin.includes(d))) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.VITE_FOOTBALL_API_KEY;
  if (!apiKey) {
    console.error("[football] No VITE_FOOTBALL_API_KEY in env vars");
    return res.status(500).json({ error: "No API key configured", detail: "VITE_FOOTBALL_API_KEY is missing from Vercel environment variables" });
  }

  const path = req.query.path || "/v4/competitions/WC/matches";
  const url = `https://api.football-data.org${path}`;

  try {
    console.log(`[football] Fetching: ${url}`);
    const response = await fetch(url, {
      headers: { "X-Auth-Token": apiKey }
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { raw: text }; }

    if (!response.ok) {
      console.error(`[football] API returned ${response.status}: ${JSON.stringify(data)}`);
      // Return a friendly error instead of raw 400/403
      return res.status(200).json({
        error: true,
        status: response.status,
        message: data.message || `football-data.org returned ${response.status}`,
        detail: data.errorCode === 403
          ? "Free tier may not include this competition. Scores will come from Google Sheets instead."
          : `Endpoint: ${url}`,
        matches: [] // empty array so the app doesn't crash
      });
    }

    console.log(`[football] Success: ${(data.matches||[]).length} matches`);
    res.status(200).json(data);
  } catch (err) {
    console.error(`[football] Fetch error: ${err.message}`);
    res.status(200).json({ error: true, message: err.message, matches: [] });
  }
}