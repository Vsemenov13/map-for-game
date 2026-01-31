/**
 * GET /api/places/config — конфиг мест (places-config.json с Яндекс.Диска).
 * Формат: { places: [{ id, title, pin: { top, left }, description? }] }.
 */

const { getPlacesConfig } = require('../../lib/yandex-disk');

function sendError(res, status, message) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json({ error: message });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.YANDEX_DISK_TOKEN;
  if (!token) {
    sendError(res, 503, 'YANDEX_DISK_TOKEN не задан.');
    return;
  }

  try {
    const config = await getPlacesConfig(token);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(config);
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    sendError(res, notFound ? 404 : 500, err.message || 'Ошибка загрузки конфига мест.');
  }
};
