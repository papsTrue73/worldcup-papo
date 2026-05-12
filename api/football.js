export default async function handler(req, res) {
  // Only allow requests from your domain
  const origin = req.headers.origin || req.headers.referer || "";
  const allowed = ["worldcup-papo.vercel.app", "localhost"];
  if (!allowed.some(d => origin.includes(d))) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.VITE_FOOTBALL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "No API key configured" });

  const path = req.query.path || "/v4/competitions/WC/matches?season=2026";
  try {
    const response = await fetch(`https://api.football-data.org${path}`, {
      headers: { "X-Auth-Token": apiKey }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
