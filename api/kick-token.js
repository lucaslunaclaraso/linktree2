// api/exchange-token.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { code, code_verifier } = req.body;

  const response = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: '01JW6K1RY4R70K7B6KSJ8GK5CV',
      redirect_uri: 'https://eldenguee.com/callback',
      code,
      code_verifier,
    }),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
