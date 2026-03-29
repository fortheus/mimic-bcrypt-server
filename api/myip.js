odule.exports = function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ ip: ip.split(',')[0].trim() });
};
