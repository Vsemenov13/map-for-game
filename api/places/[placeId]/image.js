/**
 * GET /api/places/:placeId/image?path=... — прокси одного изображения по пути на Диске.
 * Путь и mime приходят из списка; список вызывается один раз, картинки — без повторного листинга.
 */

const {
  getDownloadLink,
  pipeToResponse,
  DEFAULT_MIME,
  IMAGE_MIME_PREFIX,
} = require('../../../lib/yandex-disk');

function getQuery(req) {
  const q = req.query && typeof req.query === 'object' ? { ...req.query } : {};
  const raw = req.url || '';
  const i = raw.indexOf('?');
  if (i === -1) return q;
  raw.slice(i + 1).split('&').forEach((pair) => {
    const eq = pair.indexOf('=');
    const k = eq === -1 ? decodeURIComponent(pair) : decodeURIComponent(pair.slice(0, eq));
    const v = eq === -1 ? '' : decodeURIComponent(pair.slice(eq + 1));
    if (k) q[k] = v;
  });
  return q;
}

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

  const query = getQuery(req);
  const filePath = query.path;
  if (!filePath) {
    sendError(res, 400, 'Параметр path не указан.');
    return;
  }

  try {
    const href = await getDownloadLink(filePath, token);
    if (!href) {
      sendError(res, 502, 'Не удалось получить ссылку на файл.');
      return;
    }
    const mime = query.mime;
    const contentType = (mime && mime.startsWith(IMAGE_MIME_PREFIX)) ? mime : DEFAULT_MIME;
    await pipeToResponse(href, res, contentType);
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    sendError(res, notFound ? 404 : 500, err.message || 'Ошибка загрузки изображения.');
  }
};
