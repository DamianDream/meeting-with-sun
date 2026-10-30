export const locales = ["ru", "en", "ua"] as const;
export type Lang = (typeof locales)[number];
export const defaultLocale: Lang = "ru";

export const htmlLang: Record<Lang, string> = { ru: "ru", en: "en", ua: "uk" };

export interface UiDict {
  title: string;
  eyebrow: string;
  h1: string;
  lede: string;
  "unit.d": string;
  "unit.h": string;
  "unit.m": string;
  "unit.s": string;
  "unit.ms": string;
  "years.small": string;
  "legend.left": string;
  "legend.pct": string;
  h2: string;
  "stage0.when": string;
  "stage0.what": string;
  "stage0.why": string;
  "stage1.when": string;
  "stage1.what": string;
  "stage1.why": string;
  "stage2.when": string;
  "stage2.what": string;
  "stage2.why": string;
  "stage3.when": string;
  "stage3.what": string;
  "stage3.why": string;
  "stage4.when": string;
  "stage4.what": string;
  "stage4.why": string;
  foot: string;
  footerAuthor: string;
  footerBy: string;
  footerRights: string;
  "bar.speed": string;
  "event.life": string;
  "event.oxygen": string;
}

export const ui: Record<Lang, UiDict> = {
  ru: {
    title: "Таймер до Солнца",
    eyebrow: "Обратный отсчёт · Земля → Солнце",
    h1: "До встречи с Солнцем осталось",
    lede: 'Земля не упадёт на Солнце. Это Солнце <b>придёт к нам само</b>: состарившись, оно раздуется в красного гиганта, и его край дотянется до орбиты Земли. По модели Шрёдера и Смита (2008) это случится примерно через <b>7,59 млрд лет</b>.',
    "unit.d": "дней",
    "unit.h": "часов",
    "unit.m": "минут",
    "unit.s": "секунд",
    "unit.ms": "мс",
    "years.small": "лет",
    "legend.left": "Рождение Солнца · 4,57 млрд лет назад",
    "legend.pct": "Пройдено",
    h2: "Что будет по дороге",
    "stage0.when": "сейчас",
    "stage0.what": "Солнцу 4,57 млрд лет",
    "stage0.why": "Середина жизни. Ядро спокойно сжигает водород, яркость растёт примерно на 1% за каждые 110 млн лет.",
    "stage1.when": "через ~1 млрд лет",
    "stage1.what": "Океаны начинают выкипать",
    "stage1.why": "Солнце станет ярче на 10%. Влажный парниковый эффект уносит воду в верхние слои атмосферы, где её разрушает ультрафиолет.",
    "stage2.when": "через ~5 млрд лет",
    "stage2.what": "Водород в ядре заканчивается",
    "stage2.why": "Солнце сходит с главной последовательности и начинает медленно раздуваться в субгиганта.",
    "stage3.when": "через ~7,5 млрд лет",
    "stage3.what": "Красный гигант",
    "stage3.why": "Радиус вырастает в ~250 раз. Меркурий и Венера поглощены. Солнце теряет массу, и орбита Земли отодвигается, но недостаточно.",
    "stage4.when": "через ~7,59 млрд лет",
    "stage4.what": "Земля внутри Солнца",
    "stage4.why": "Приливное торможение тянет планету вниз, в разреженную внешнюю оболочку звезды. Здесь таймер и заканчивается.",
    foot: 'Точка отсчёта: 7,59 млрд юлианских лет после 1 января 2008 года (Schröder &amp; Smith, MNRAS 386, 155). Погрешность модели — сотни миллионов лет, так что секунды здесь для красоты.',
    footerAuthor: 'Dima Batalshikov',
    footerBy: 'Разработка и концепт',
    footerRights: 'Все права защищены',
    "bar.speed": "По модели Солнце в среднем приближается к орбите Земли со скоростью ~19,6 м в год (≈5,4 см в сутки) — на деле рост резко ускорится на стадии красного гиганта.",
    "event.life": "Зарождение жизни: ~3,8 млрд лет назад",
    "event.oxygen": "Кислородная катастрофа: ~2,4 млрд лет назад",
  },
  en: {
    title: "Countdown to the Sun",
    eyebrow: "Countdown · Earth → Sun",
    h1: "Time left until the Sun arrives",
    lede: 'Earth won’t fall into the Sun. Instead, the Sun <b>will come to us</b>: as it ages, it will swell into a red giant, and its edge will reach Earth’s orbit. According to the Schröder &amp; Smith model (2008), that happens in roughly <b>7.59 billion years</b>.',
    "unit.d": "days",
    "unit.h": "hours",
    "unit.m": "minutes",
    "unit.s": "seconds",
    "unit.ms": "ms",
    "years.small": "years",
    "legend.left": "Sun's birth · 4.57 billion years ago",
    "legend.pct": "Elapsed",
    h2: "What happens along the way",
    "stage0.when": "now",
    "stage0.what": "The Sun is 4.57 billion years old",
    "stage0.why": "Midlife. The core quietly burns hydrogen, luminosity rising about 1% every 110 million years.",
    "stage1.when": "in ~1 billion years",
    "stage1.what": "Oceans start boiling off",
    "stage1.why": "The Sun gets 10% brighter. A moist greenhouse effect carries water into the upper atmosphere, where UV light breaks it apart.",
    "stage2.when": "in ~5 billion years",
    "stage2.what": "Core hydrogen runs out",
    "stage2.why": "The Sun leaves the main sequence and begins slowly swelling into a subgiant.",
    "stage3.when": "in ~7.5 billion years",
    "stage3.what": "Red giant",
    "stage3.why": "Its radius grows ~250-fold. Mercury and Venus are consumed. The Sun loses mass and Earth’s orbit drifts outward — but not enough.",
    "stage4.when": "in ~7.59 billion years",
    "stage4.what": "Earth inside the Sun",
    "stage4.why": "Tidal drag pulls the planet down into the star’s thin outer envelope. That’s where the timer ends.",
    foot: 'Reference point: 7.59 billion Julian years after January 1, 2008 (Schröder &amp; Smith, MNRAS 386, 155). The model’s uncertainty is hundreds of millions of years, so the seconds here are purely decorative.',
    footerAuthor: 'Dima Batalshikov',
    footerBy: 'Created & designed by',
    footerRights: 'All rights reserved',
    "bar.speed": "By the model, the Sun closes in on Earth's orbit at an average of ~19.6 m per year (≈5.4 cm per day) — the real approach will sharply accelerate during the red-giant stage.",
    "event.life": "First life: ~3.8B years ago",
    "event.oxygen": "Great Oxidation Event: ~2.4B years ago",
  },
  ua: {
    title: "Таймер до Сонця",
    eyebrow: "Зворотний відлік · Земля → Сонце",
    h1: "До зустрічі із Сонцем залишилось",
    lede: 'Земля не впаде на Сонце. Це Сонце <b>прийде до нас самостійно</b>: постарівши, воно роздується в червоного гіганта, і його край дістанеться орбіти Землі. За моделлю Шрьодера і Сміта (2008) це станеться приблизно через <b>7,59 млрд років</b>.',
    "unit.d": "днів",
    "unit.h": "годин",
    "unit.m": "хвилин",
    "unit.s": "секунд",
    "unit.ms": "мс",
    "years.small": "років",
    "legend.left": "Народження Сонця · 4,57 млрд років тому",
    "legend.pct": "Пройдено",
    h2: "Що буде по дорозі",
    "stage0.when": "зараз",
    "stage0.what": "Сонцю 4,57 млрд років",
    "stage0.why": "Середина життя. Ядро спокійно спалює водень, яскравість росте приблизно на 1% кожні 110 млн років.",
    "stage1.when": "через ~1 млрд років",
    "stage1.what": "Океани починають википати",
    "stage1.why": "Сонце стане яскравішим на 10%. Вологий парниковий ефект виносить воду у верхні шари атмосфери, де її руйнує ультрафіолет.",
    "stage2.when": "через ~5 млрд років",
    "stage2.what": "Водень у ядрі закінчується",
    "stage2.why": "Сонце сходить з головної послідовності і починає повільно роздуватися в субгіганта.",
    "stage3.when": "через ~7,5 млрд років",
    "stage3.what": "Червоний гігант",
    "stage3.why": "Радіус зростає у ~250 разів. Меркурій і Венера поглинуті. Сонце втрачає масу, і орбіта Землі віддаляється, але недостатньо.",
    "stage4.when": "через ~7,59 млрд років",
    "stage4.what": "Земля всередині Сонця",
    "stage4.why": "Приливне гальмування тягне планету вниз, у розріджену зовнішню оболонку зірки. Тут таймер і закінчується.",
    foot: 'Точка відліку: 7,59 млрд юліанських років після 1 січня 2008 року (Schröder &amp; Smith, MNRAS 386, 155). Похибка моделі — сотні мільйонів років, тож секунди тут лише для краси.',
    footerAuthor: 'Dima Batalshikov',
    footerBy: 'Розробка та концепт',
    footerRights: 'Усі права захищено',
    "bar.speed": "За моделлю Сонце в середньому наближається до орбіти Землі зі швидкістю ~19,6 м на рік (≈5,4 см на добу) — насправді зростання різко прискориться на стадії червоного гіганта.",
    "event.life": "Зародження життя: ~3,8 млрд років тому",
    "event.oxygen": "Кисенева катастрофа: ~2,4 млрд років тому",
  },
};

export function useTranslations(lang: Lang): UiDict {
  return ui[lang] ?? ui[defaultLocale];
}
