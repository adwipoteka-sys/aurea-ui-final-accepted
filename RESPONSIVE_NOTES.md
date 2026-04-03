# AUREA responsive notes

## Что обновлено

Теперь responsive-система применяется ко всем основным экранным состояниям AUREA:
- Home
- Send
- Contacts
- History

Вместо одиночного hero-слоя используется полноценный screen-art для каждого таба. Это даёт более точную посадку дизайна и сохраняет экранную композицию при переключении вкладок.

## Layout strategy

### 1. Full-bleed base background
`assets/bg/background-only.png` всегда заполняет весь viewport по принципу cover.

### 2. Screen art by active tab
Каждый таб получает собственный screen art:
- `assets/screens/home.png`
- `assets/screens/send.png`
- `assets/screens/contacts.png`
- `assets/screens/history.png`

Screen art масштабируется в первую очередь по высоте устройства.

### 3. Portrait focal correction
На узких portrait-экранах Send / Contacts / History слегка смещены по X через focal point.
Это сохраняет видимость верхней левой back-кнопки и не режет важные элементы слева.

### 4. Independent bottom nav
Нижняя навигация живёт отдельным слоем и не зависит от screen art.
Из-за этого nav:
- стабилен по высоте
- корректно сидит над safe area
- не прыгает между активными экранами

## Режимы

`getResponsiveAureaLayout()` различает:
- `phonePortrait`
- `phoneLandscape`
- `tabletPortrait`
- `tabletLandscape`

## Practical notes

### Старт проекта
```bash
cd aurea-ui-final-accepted
npm install
npm run start
```

### Открыть сразу платформу
```bash
npm run ios
npm run android
npm run web
```

### Что можно докрутить дальше
- выделить отдельные overlay-слои для внутренних карточек/форм
- добавить лёгкие анимации перехода между табами
- отдельно настроить tablet-landscape композицию для ещё более “премиального” центрирования
