/**
 * Получение OAuth-токена Яндекс.Диска по коду авторизации.
 *
 * У вас есть только Client ID и Client secret — это не токен.
 * Токен получается так:
 *
 * 1. В .env добавьте (из настроек приложения на oauth.yandex.ru):
 *    YANDEX_CLIENT_ID=ваш_client_id
 *    YANDEX_CLIENT_SECRET=ваш_client_secret
 *
 * 2. Откройте в браузере ссылку (подставьте свой YANDEX_CLIENT_ID):
 *    https://oauth.yandex.ru/authorize?response_type=code&client_id=ВАШ_CLIENT_ID
 *
 * 3. Войдите в Яндекс и разрешите доступ приложению.
 *
 * 4. Вас перенаправит на страницу с кодом. Скопируйте код (длинная строка).
 *
 * 5. Выполните: node scripts/get-yandex-token.js ВСТАВЬТЕ_КОД_СЮДА
 *
 * 6. В консоль выведется access_token. Добавьте в .env строку:
 *    YANDEX_DISK_TOKEN=полученный_токен
 *
 * После этого npm run sync-images и npm start будут использовать этот токен.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
      const m = line.match(/^\s*([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    });
  }
}

loadEnv();

const clientId = process.env.YANDEX_CLIENT_ID;
const clientSecret = process.env.YANDEX_CLIENT_SECRET;
const code = process.argv[2];

if (!clientId || !clientSecret) {
  console.log('Добавьте в .env из настроек приложения на oauth.yandex.ru:');
  console.log('  YANDEX_CLIENT_ID=ваш_client_id');
  console.log('  YANDEX_CLIENT_SECRET=ваш_client_secret');
  console.log('');
  if (clientId) {
    console.log('Ссылка для авторизации (откройте в браузере):');
    console.log(`https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}`);
  }
  process.exit(1);
}

if (!code) {
  console.log('Ссылка для авторизации (откройте в браузере):');
  console.log(`https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}`);
  console.log('');
  console.log('После входа скопируйте код из адресной строки (параметр code=...) и выполните:');
  console.log(`  node scripts/get-yandex-token.js ВАШ_КОД`);
  process.exit(1);
}

const body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code.trim(),
  client_id: clientId,
  client_secret: clientSecret,
}).toString();

const req = https.request(
  {
    hostname: 'oauth.yandex.ru',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  },
  (res) => {
    let data = '';
    res.on('data', (ch) => { data += ch; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.access_token) {
          console.log('Токен получен. Добавьте в .env строку:');
          console.log('');
          console.log(`YANDEX_DISK_TOKEN=${json.access_token}`);
          console.log('');
          console.log('(Токен действует ограниченное время; при истечении повторите шаги 2–6.)');
        } else {
          console.error('Ошибка:', json.error || json.description || data);
          process.exit(1);
        }
      } catch (e) {
        console.error('Ответ сервера:', data);
        process.exit(1);
      }
    });
  },
);

req.on('error', (e) => {
  console.error(e);
  process.exit(1);
});
req.write(body);
req.end();
