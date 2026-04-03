# AUREA UI — v13 source-of-truth base

Это обновлённый проект, где **именно версия `AUREA_UI_home_logo_line_v13`** закреплена как эталон.

## Что важно

- первая страница Home v13 оставлена как есть;
- Home не заменён новым shell;
- из v13 отдельно вынесена техническая база для следующих окон;
- дальше можно строить новые окна, не ломая фон / меню / солнце / свет / геометрию Home.

## Где лежит база из v13

- `V13_SOURCE_OF_TRUTH.md`
- `src/foundation/FOUNDATION_README.md`
- `src/foundation/v13SourceOfTruth.js`
- `src/foundation/V13ChromeShell.js`
- `assets/foundation/chrome/`
- `assets/foundation/reference/`

## Запуск

```bash
cd aurea-ui-final-accepted
npm install
npm run start
```

Быстрые команды:

```bash
npm run ios
npm run android
npm run web
```

## Что запускается сейчас

`App.js` оставляет на старте **точный Home v13**.
То есть при открытии проекта ты видишь именно эталонную главную страницу, а не её переосмысленную версию.

## Для чего добавлен foundation

Foundation нужен не для замены Home, а для следующих окон:

- берём v13 как source-of-truth;
- сохраняем тот же chrome;
- меняем только внутреннее окно следующего экрана.
