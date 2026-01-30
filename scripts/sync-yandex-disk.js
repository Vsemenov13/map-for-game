/**
 * Синхронизация изображений мест с Яндекс.Диска.
 *
 * ЧТО НУЖНО СДЕЛАТЬ ВАМ:
 *
 * 1. Получить OAuth-токен для Яндекс.Диска:
 *    - Зайдите на https://oauth.yandex.ru/
 *    - Создайте приложение (тип «Для доступа к API» или «Веб-сервисы»).
 *    - В настройках укажите права «Яндекс.Диск» → чтение.
 *    - Получите токен (кнопка «Получить токен» или через OAuth-поток).
 *
 * 2. Сохранить токен в переменную окружения:
 *    - Windows (PowerShell): $env:YANDEX_DISK_TOKEN = "ваш_токен"
 *    - Или создайте файл .env в корне проекта и добавьте: YANDEX_DISK_TOKEN=ваш_токен
 *    - Файл .env не коммитьте (должен быть в .gitignore).
 *
 * 3. В папке приложения на Диске (Приложения → имя вашего приложения из OAuth)
 *    создать папки с именами, совпадающими с id мест из приложения:
 *    village, cemetery, quarry, forest, kindergarten, playground,
 *    tochki-houses, roof-house, market, school, pool, post, garages,
 *    stadium, culture-house, church, ambulatory.
 *
 * 4. Загрузить в каждую папку изображения (jpg, png, gif и т.п.).
 *
 * 5. Запускать перед сборкой: npm run sync-images
 *    (или: node scripts/sync-yandex-disk.js)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE = 'https://cloud-api.yandex.net/v1/disk';
const PLACE_IDS = [
  'village',
  'cemetery',
  'quarry',
  'forest',
  'kindergarten',
  'playground',
  'tochki-houses',
  'roof-house',
  'market',
  'school',
  'pool',
  'post',
  'garages',
  'stadium',
  'culture-house',
  'church',
  'ambulatory',
];

const IMAGE_MIME_PREFIX = 'image/';

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
      const m = line.match(/^\s*([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    });
  }
}

function request(url, token, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method, headers: { Authorization: `OAuth ${token}` } },
      (res) => {
        let body = '';
        res.on('data', (ch) => { body += ch; });
        res.on('end', () => {
          try {
            const data = body ? JSON.parse(body) : {};
            if (res.statusCode >= 400) reject(new Error(data.message || data.description || `HTTP ${res.statusCode}`));
            else resolve(data);
          } catch (e) {
            reject(new Error(body || e.message));
          }
        });
      },
    );
    req.on('error', reject);
    req.end();
  });
}

function downloadFile(url, token) {
  return new Promise((resolve, reject) => {
    const doGet = (targetUrl) => {
      const u = new URL(targetUrl);
      const opts = { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { Authorization: `OAuth ${token}` } };
      https.get(opts, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const loc = res.headers.location;
          if (loc) return doGet(loc);
        }
        if (res.statusCode !== 200) {
          let b = '';
          res.on('data', (c) => { b += c; });
          res.on('end', () => reject(new Error(b || `HTTP ${res.statusCode}`)));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    };
    doGet(url);
  });
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function main() {
  loadEnv();
  const token = process.env.YANDEX_DISK_TOKEN;

  if (!token) {
    console.log('YANDEX_DISK_TOKEN не задан — синхронизация с Яндекс.Диском пропущена.');
    process.exit(0);
  }

  const publicDir = path.join(__dirname, '..', 'public');
  const placesDir = path.join(publicDir, 'places');
  if (fs.existsSync(placesDir)) {
    fs.rmSync(placesDir, { recursive: true });
  }
  fs.mkdirSync(placesDir, { recursive: true });

  const manifest = {};

  for (const placeId of PLACE_IDS) {
    const diskPath = `app:/${placeId}`;
    const encodedPath = encodeURIComponent(diskPath);
    const listUrl = `${API_BASE}/resources?path=${encodedPath}&limit=500`;

    let data;
    try {
      data = await request(listUrl, token);
    } catch (err) {
      const msg = err.message || '';
      const notFound = msg.includes('404') || msg.includes('Не найдено') || msg.includes('Не удалось найти запрошенный ресурс');
      if (notFound) {
        console.log(`Папка пропущена (нет на Диске): ${placeId}`);
        continue;
      }
      throw err;
    }

    const items = (data._embedded && data._embedded.items) || [];
    const files = items.filter((item) => item.type === 'file' && (item.mime_type || '').startsWith(IMAGE_MIME_PREFIX));
    if (files.length === 0) {
      console.log(`Нет изображений: ${placeId}`);
      continue;
    }

    const placeDir = path.join(placesDir, placeId);
    if (!fs.existsSync(placeDir)) fs.mkdirSync(placeDir, { recursive: true });

    const placeTitles = {
      village: 'Деревня',
      cemetery: 'Кладбище',
      quarry: 'Карьер',
      forest: 'Лес',
      kindergarten: 'Детский сад',
      playground: 'Площадка',
      'tochki-houses': 'Дома точки',
      'roof-house': 'Дома корабли',
      market: 'Рынок',
      school: 'Школа',
      pool: 'Бассейн',
      post: 'Почта',
      garages: 'Гаражи',
      stadium: 'Стадион',
      'culture-house': 'Дом культуры',
      church: 'Церковь',
      ambulatory: 'Амбулатория',
    };
    const title = placeTitles[placeId] || placeId;

    const images = [];
    files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const filePath = file.path || `${diskPath}/${file.name}`;
      const encodedFilePath = encodeURIComponent(filePath);
      const downloadUrl = `${API_BASE}/resources/download?path=${encodedFilePath}`;

      const linkData = await request(downloadUrl, token);
      const href = linkData.href;
      if (!href) throw new Error(`Нет ссылки на скачивание: ${file.name}`);

      const buf = await downloadFile(href, token);
      const safeName = sanitizeFileName(file.name) || `image_${i + 1}`;
      const ext = path.extname(safeName) || (file.mime_type === 'image/png' ? '.png' : '.jpg');
      const outName = safeName.includes('.') ? safeName : `${safeName}${ext}`;
      const outPath = path.join(placeDir, outName);
      fs.writeFileSync(outPath, buf);

      const src = `/places/${placeId}/${outName}`;
      images.push({
        id: `${placeId}-${i + 1}`,
        src,
        alt: `${title}. Фото ${i + 1}`,
      });
    }

    manifest[placeId] = images;
    console.log(`Синхронизировано ${files.length} файлов: ${placeId}`);
  }

  const manifestPath = path.join(publicDir, 'places-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Манифест записан: public/places-manifest.json');
  console.log('Синхронизация завершена.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
