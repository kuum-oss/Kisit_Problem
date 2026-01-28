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

