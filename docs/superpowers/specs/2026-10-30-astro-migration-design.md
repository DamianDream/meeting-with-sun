# Миграция "Meeting With Sun" на Astro

Дата: 2026-10-30

## Контекст и цель

Сайт — одностраничный countdown-таймер до слияния Земли с Солнцем, сейчас
живёт как один файл `index.html` (HTML + inline CSS + inline vanilla JS),
с переключением языка RU/EN/UA через JS-словарь и `localStorage`.

Цель перехода на Astro: **чище структура кода** — разбить монолитный
`index.html` на компоненты с ясными границами (Layout, Countdown,
StagesList, LangSwitcher, SunBackground), вместо одного файла на 300+
строк. Новые страницы/контент сейчас не планируются — это не входит в
scope. Побочный эффект, который мы сознательно берём в рамки миграции:
переход на честный multi-page i18n-роутинг Astro (`/`, `/en/`, `/ua/`)
вместо JS-переключателя поверх одной страницы.

Деплой: GitHub Pages, репозиторий `DamianDream/meeting-with-sun`,
публичный URL `https://damiandream.github.io/meeting-with-sun/`. Сейчас
Pages настроен в "legacy" режиме — отдаёт файлы напрямую из `main`/`root`.
После перехода на Astro сайт собирается в `dist/`, поэтому нужен
GitHub Actions workflow и переключение источника Pages на "GitHub Actions"
в настройках репозитория.

## Уже сделано

Astro-проект (`npm create astro@latest`, шаблон `minimal`, TypeScript
`strict`) развёрнут в корне `/Users/dima/Projects/meeting_with_sun` и
объединён с существующим git-репозиторием: `package.json` (переименован
в `meeting-with-sun`), `astro.config.mjs`, `tsconfig.json`,
`src/pages/index.astro`, `public/`, `node_modules/`. Dev-сервер
(`npm run dev`, `localhost:4321`) проверен — отвечает 200.
Старый `index.html` и `README.md` в корне пока не тронуты.

## Архитектура

### Роутинг и i18n

Astro i18n routing: `defaultLocale: 'ru'`, `locales: ['ru', 'en', 'ua']`,
`routing.prefixDefaultLocale: false`. Это значит:

- `ru` живёт на `/` (без префикса — сохраняет текущее поведение по
  умолчанию);
- `en` на `/en/`, `ua` на `/ua/`;
- страницы: `src/pages/index.astro` (ru), `src/pages/en/index.astro`,
  `src/pages/ua/index.astro` — каждая тонкая, просто собирает `Layout` +
  компоненты с пропом `lang`.

Автоопределение языка и запоминание выбора переносятся из текущей
JS-логики в небольшой inline-скрипт внутри `Layout.astro`, исполняемый на
каждой странице:

1. При загрузке страницы текущая локаль (`ru`/`en`/`ua`, известна из
   пропса `Layout`) сохраняется в `localStorage` под ключом
   `sun-timer-lang` — это и есть "запомнить последний выбор" (переход по
   `LangSwitcher` на другую локаль автоматически запоминается, когда
   грузится целевая страница).
2. Если в `localStorage` **нет** сохранённого значения и мы на `/` (ru,
   default) — смотрим `navigator.language`: `uk*` → редирект на `/ua/`,
   `en*` → `/en/`, всё остальное — остаёмся на `/` (ru). Редирект
   делается один раз через `location.replace(...)`, чтобы не засорять
   историю браузера.
3. Если в `localStorage` **есть** сохранённое значение и оно отличается
   от локали текущей страницы, а пользователь зашёл на `/` (например, по
   прямой ссылке или закладке) — редиректим на сохранённую локаль.
   Если сохранённое значение совпадает с текущей локалью — ничего не
   делаем. Редирект НЕ происходит, если пользователь явно открыл `/en/`
   или `/ua/` напрямую — прямые ссылки на конкретную локаль всегда
   уважаются и не перебиваются сохранённым значением.

   **Уточнение, найденное при реализации:** правило 3 само по себе
   создавало ловушку — ссылка "RU" в `LangSwitcher` ведёт на `/`, и если
   сохранённое значение `en`/`ua`, скрипт тут же отбрасывал обратно,
   делая ручной возврат на ru невозможным. Исправлено через
   `sessionStorage`-флаг: проверка (и возможный редирект) по правилам 2–3
   выполняется не более одного раза за сессию вкладки; дальнейшие заходы
   на `/` в той же вкладке просто обновляют `localStorage` на `ru` без
   редиректа. Это сохраняет "запомнить язык между визитами" (новая вкладка
   снова проверяет) и одновременно не ломает ручное переключение.

### Компоненты

- `src/layouts/Layout.astro` — html shell: `<head>` (шрифты, meta,
  `lang`-атрибут из пропса, `<title>` из словаря), `<canvas id="sky">`
  через `SunBackground`, `<slot/>` для контента страницы, подключение
  `global.css` и inline-скрипта автоопределения/редиректа (п. выше).
- `src/components/LangSwitcher.astro` — три ссылки RU/EN/UA,
  построенные через `getRelativeLocaleUrl` (учитывает `base`), активная
  локаль помечена `aria-current="page"` и подсвечена стилем (как сейчас
  `aria-pressed`/подсветка `var(--sun)`).
- `src/components/Countdown.astro` — блок `years` + `units` (д/ч/м/с/мс)
  + прогресс-бар с легендой. Подключает `src/scripts/timer.ts` как
  client-side `<script>`. Принимает `lang` только чтобы прокинуть
  переведённые подписи юнитов и легенды из `ui.ts`; сама числовая логика
  языка не знает.
- `src/components/StagesList.astro` — таймлайн пяти этапов (`now`/`end`
  классы сохраняются), тексты приходят из `ui.ts` по `lang`.
- `src/components/SunBackground.astro` — `<canvas id="sky">` +
  `src/scripts/sky.ts` (анимация звёзд и "дышащего" Солнца).
- `src/i18n/ui.ts` — словарь `{ ru: {...}, en: {...}, ua: {...} }`,
  перенесённый 1:1 из текущего `I18N` в `index.html` (те же ключи:
  `eyebrow`, `h1`, `lede`, `unit.d/h/m/s/ms`, `years.small`,
  `legend.left`, `legend.pct`, `h2`, `stage0..4.when/what/why`, `foot`,
  `title`), плюс `HTML_LANG` (`ua` → `uk` для атрибута `lang`) и функция
  `useTranslations(lang)`.

### Стили и скрипты

- Весь текущий `<style>` (CSS-переменные, разметка) переносится как есть
  в `src/styles/global.css`, импортируется один раз в `Layout.astro`. Без
  разбивки на scoped-стили по компонентам — цель миграции уже достигается
  разбивкой разметки на `.astro`-компоненты, доп. дробление CSS сейчас не
  нужно (YAGNI). Можно вынести позже, если понадобится.
- `src/scripts/timer.ts` — функция `tick()` и константы
  (`YEAR`/`DAY`/`START2008`/`TARGET`/`TOTAL_Y`), логика переносится без
  изменений (BigInt-арифметика как есть).
- `src/scripts/sky.ts` — анимация canvas, логика без изменений.
- Оба скрипта языко-независимы (не используют `ui.ts`), поэтому
  подключаются одинаково на всех трёх страницах.

### Деплой

- `astro.config.mjs`: `site: 'https://damiandream.github.io'`,
  `base: '/meeting-with-sun/'` (проектный, не user/org Pages — URL
  остаётся `https://damiandream.github.io/meeting-with-sun/`),
  `i18n: { defaultLocale: 'ru', locales: ['ru', 'en', 'ua'], routing: { prefixDefaultLocale: false } }`.
- `.github/workflows/deploy.yml`: триггер — push в `main`; шаги —
  `actions/checkout`, `actions/setup-node`, `npm ci`, `astro build`,
  `actions/upload-pages-artifact` (artifact = `dist/`),
  `actions/deploy-pages`.
- Переключение Settings → Pages → Source на "GitHub Actions" в репозитории
  `DamianDream/meeting-with-sun` делается отдельным шагом с явным
  подтверждением пользователя непосредственно перед первым реальным
  деплоем через новый workflow — чтобы не было окна, когда переключатель
  уже стоит на "Actions", а workflow ещё не смержен/не прогнан.
- Корневой `index.html` (текущая статическая версия) удаляется в самом
  конце миграции, после того как Astro-версия пройдёт локальную проверку
  (`npm run build` + `npm run preview`, визуальная сверка RU/EN/UA через
  браузер) — чтобы не терять рабочую fallback-версию раньше времени.

## Тестирование

Сборка статическая, без backend — проверка вручную:

- `npm run dev` — визуально сверить все три локали (`/`, `/en/`, `/ua/`)
  с текущей продакшен-версией (тексты, вёрстка, прогресс-бар, анимация
  фона).
- Проверить автоопределение языка: эмулировать `navigator.language` для
  `en`/`uk`/прочих в devtools, зайти на `/` без `localStorage` —
  убедиться в редиректе на правильную локаль (и в отсутствии редиректа,
  если зашли сразу на `/en/` или `/ua/`).
- Проверить персистентность: переключиться через `LangSwitcher`,
  перезагрузить `/` — должен остаться сохранённый выбор.
- `npm run build && npm run preview` — убедиться, что статическая сборка
  с `base: '/meeting-with-sun/'` корректно резолвит ссылки/ассеты (как
  если бы она лежала в `https://damiandream.github.io/meeting-with-sun/`).
- После первого реального деплоя через Actions — открыть
  `https://damiandream.github.io/meeting-with-sun/` и проверить все три
  локали live.

## Вне рамок (явно не делаем)

- Markdown/content collections, блог, дополнительные страницы.
- hreflang/alternate SEO-теги (не было в текущей версии, не запрошено).
- Scoped CSS по компонентам.
- React/Vue/другие UI-фреймворки — весь интерактив остаётся vanilla JS.
