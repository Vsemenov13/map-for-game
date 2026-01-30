/**
 * Локальный API для разработки: /api/places (список и картинки).
 * Использует lib/yandex-disk.js, не требует vercel login.
 * Запускается на порту 3001; YANDEX_DISK_TOKEN — из .env или окружения.
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const {
  getImageFiles,
  getDownloadLink,
  pipeToResponse,
  PLACE_TITLES,
  IMAGE_MIME_PREFIX,
  DEFAULT_MIME,
} = require('../lib/yandex-disk');

const PORT = process.env.PLACES_API_PORT || 3001;
const ENV_FILE = path.join(__dirname, '..', '.env');
const ENV_LINE = /^\s*([^#=]+)=(.*)$/;

function loadEnv() {
  try {
    const content = fs.readFileSync(ENV_FILE, 'utf8');
    content.split('\n').forEach((line) => {
      const m = line.match(ENV_LINE);
      if (m && process.env[m[1].trim()] === undefined) {
        process.env[m[1].trim()] = m[2].trim();
      }
    });
  } catch (_) {}
}

loadEnv();

const app = express();
app.set('etag', false);
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/places/:placeId/images', async (req, res) => {
  const token = process.env.YANDEX_DISK_TOKEN;
  if (!token) {
    return res.status(503).json({ error: 'YANDEX_DISK_TOKEN не задан. Добавьте в .env или окружение.' });
  }
  const placeId = req.params.placeId;
  try {
    const files = await getImageFiles(placeId, token);
    const title = PLACE_TITLES[placeId] || placeId;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const pathPrefix = `/api/places/${encodeURIComponent(placeId)}/image`;
    const images = files.map((file, i) => ({
      id: `${placeId}-${i + 1}`,
      src: `${baseUrl}${pathPrefix}?path=${encodeURIComponent(file.path || `app:/${placeId}/${file.name}`)}&mime=${encodeURIComponent(file.mime_type || 'image/jpeg')}`,
      alt: `${title}. Фото ${i + 1}`,
    }));
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json({ images });
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    res.status(notFound ? 404 : 500).json({ error: err.message || 'Ошибка загрузки изображений.' });
  }
});

app.get('/api/places/:placeId/image', async (req, res) => {
  const token = process.env.YANDEX_DISK_TOKEN;
  if (!token) {
    return res.status(503).json({ error: 'YANDEX_DISK_TOKEN не задан.' });
  }
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).json({ error: 'Параметр path не указан.' });
  }
  try {
    const href = await getDownloadLink(filePath, token);
    if (!href) {
      return res.status(502).json({ error: 'Не удалось получить ссылку на файл.' });
    }
    const mime = req.query.mime;
    const contentType = (mime && mime.startsWith(IMAGE_MIME_PREFIX)) ? mime : DEFAULT_MIME;
    await pipeToResponse(href, res, contentType);
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    res.status(notFound ? 404 : 500).json({ error: err.message || 'Ошибка загрузки изображения.' });
  }
});

app.listen(PORT, () => {
  console.log(`[dev-api] API на http://localhost:${PORT} (YANDEX_DISK_TOKEN: ${process.env.YANDEX_DISK_TOKEN ? 'задан' : 'не задан'})`);
});
