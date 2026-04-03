# AUREA v13 — эталонная база для следующих окон

Это не новая визуальная версия. Это техническая база, собранная **именно из проекта `AUREA_UI_home_logo_line_v13`**.

## Что считать эталоном

- `assets/foundation/reference/home-v13-exact-4k.png` — **строго эталонный Home v13**. Его не трогаем.
- `assets/foundation/reference/home-v13-exact.png` — компактная версия того же эталона.

## Что вытащено из v13 для следующих экранов

- `assets/foundation/chrome/background-only.png` — общий фон.
- `assets/foundation/chrome/hero.png` — верхний логотип / линия.
- `assets/foundation/chrome/nav-*.png` — нижнее меню со всеми активными состояниями.
- `assets/foundation/reference/home-v13-without-nav.png` — Home без нижнего меню, как референсный scaffold.
- `assets/foundation/reference/send-v13-reference.png`
- `assets/foundation/reference/contacts-v13-reference.png`
- `assets/foundation/reference/history-v13-reference.png`

## Главный принцип

Дальше мы **не переделываем Home**.
Мы используем Home v13 как source-of-truth и строим новые окна так:

1. фон / hero / нижнее меню остаются из семейства v13;
2. меняется только центральное окно контента;
3. интерактивность накладывается hit-zones поверх арта;
4. вся геометрия остаётся в одной системе координат.

## Готовые технические файлы

- `src/foundation/v13SourceOfTruth.js` — карта ассетов и нормализованные rect-координаты.
- `src/foundation/V13ChromeShell.js` — shell для сборки следующих окон на базе v13.

## Что уже сохранено

Текущий `App.js` по-прежнему запускает **точный Home v13**, без замены его на новый shell.
То есть эталонная первая страница осталась нетронутой.
