const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
          const { clientId, clientSecret } = req.body;
          if (!clientId || !clientSecret) {
                  return res.status(400).json({ error: 'clientId, clientSecret required' });
          }

      const timestamp = String(Date.now());
          const password = clientId + '_' + timestamp;

      const hashed = await bcrypt.hash(password, clientSecret);
          const signature = Buffer.from(hashed).toString('base64');

      const params = new URLSearchParams({
              client_id: clientId,
              timestamp: timestamp,
              grant_type: 'client_credentials',
              client_secret_sign: signature,
              type: 'SELF'
      });

      const response = await fetch(
              'https://api.commerce.naver.com/external/v1/oauth2/token',
        {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: params.toString()
        }
            );

      const data = await response.json();
          if (!response.ok) return res.status(response.status).json({ error: data });
          return res.status(200).json({ access_token: data.access_token });
    } catch (e) {
          return res.status(500).json({ error: e.message });
    }
};
