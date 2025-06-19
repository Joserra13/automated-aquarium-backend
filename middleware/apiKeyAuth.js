module.exports = function (req, res, next) {
  const clientKey = req.headers['api-key'];
  if (!clientKey || clientKey !== process.env.BACKEND_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};