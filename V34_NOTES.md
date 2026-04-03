AUREA UI v34 — exact Home v13 + next windows on v13 chrome

Что сделано
- Home оставлен как exact `home-v13-exact-4k.png` без перерисовки.
- Следующие окна собраны как отдельные точные artboards на v13 chrome:
  - Send
  - Contacts
  - History
  - Receipt
- Нижнее меню теперь является частью каждого exact screen, а не отдельной дорисовкой.
- Поверх экранов оставлены только hit-zones:
  - Home -> две главные кнопки + нижняя навигация
  - Send -> back + OK + нижняя навигация
  - Contacts / History -> back + нижняя навигация
  - Receipt -> back + share + нижняя навигация

Файлы
- `src/ExactAureaV13Windows.js` — основной экранный flow
- `assets/exact/*.png` — точные следующие окна на v13 chrome
- `assets/foundation/reference/home-v13-exact-4k.png` — неизменённый Home v13

Запуск
npm install
npm run start
