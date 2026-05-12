export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || "";
  const allowed = ["worldcup-papo.vercel.app", "localhost"];
  if (!allowed.some(d => origin.includes(d))) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.VITE_BSD_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "No API key configured" });

  const path = req.query.path || "/api/events/?competition=world-cup";
  try {
    const response = await fetch(`https://sports.bzzoiro.com${path}`, {
      headers: { "Authorization": `Token ${apiKey}` }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
