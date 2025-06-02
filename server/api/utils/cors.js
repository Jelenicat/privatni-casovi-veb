export default function applyCors(req, res) {
  const allowedOrigins = ['https://www.pronadjiprofesora.com', 'http://localhost:3000'];

  const origin = req.headers.origin;
  console.log('🌐 Zahtev dolazi sa origin:', origin); // loguj da vidiš tačno

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // ako origin nije u listi ali postoji, bar mu reci nešto:
    console.warn('🚫 Blokiran origin:', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}
