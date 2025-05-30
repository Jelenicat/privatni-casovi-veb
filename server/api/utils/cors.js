// utils/cors.js
export default function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pronadjiprofesora.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // da znaš da je završeno ranije
  }

  return false;
}
