import { Image } from 'react-native';

const HOME_EXACT_4K = require('../../assets/foundation/reference/home-v13-exact-4k.png');
const HOME_EXACT = require('../../assets/foundation/reference/home-v13-exact.png');
const HOME_WITHOUT_NAV = require('../../assets/foundation/reference/home-v13-without-nav.png');
const BACKGROUND = require('../../assets/foundation/chrome/background-only.png');
const HERO = require('../../assets/foundation/chrome/hero.png');
const NAV_HOME = require('../../assets/foundation/chrome/nav-home.png');
const NAV_SEND = require('../../assets/foundation/chrome/nav-send.png');
const NAV_CONTACTS = require('../../assets/foundation/chrome/nav-contacts.png');
const NAV_HISTORY = require('../../assets/foundation/chrome/nav-history.png');

export const V13_HOME_META = Image.resolveAssetSource(HOME_EXACT_4K);
export const V13_HOME_EXACT = HOME_EXACT_4K;
export const V13_HOME_EXACT_COMPACT = HOME_EXACT;
export const V13_HOME_WITHOUT_NAV = HOME_WITHOUT_NAV;

export const V13_CHROME_ASSETS = {
  background: BACKGROUND,
  hero: HERO,
  nav: {
    home: NAV_HOME,
    send: NAV_SEND,
    contacts: NAV_CONTACTS,
    history: NAV_HISTORY,
  },
};

export const V13_REFERENCE = {
  artboardCompact: {
    width: 851,
    height: 1847,
  },
  artboardExact4k: {
    width: 1887,
    height: 4096,
  },
  layoutArtboard: {
    width: 1365,
    height: 2048,
  },
  homeActionRects: {
    findPrometei: {
      x: 0.1387,
      y: 0.4050,
      w: 0.3232,
      h: 0.0590,
    },
    expelliarmus: {
      x: 0.5112,
      y: 0.4039,
      w: 0.3901,
      h: 0.0601,
    },
  },
  homeNavRow: {
    x: 0.0576,
    y: 0.7407,
    w: 0.8848,
    h: 0.0812,
  },
  backButtonRect: {
    x: 0.0382,
    y: 0.0732,
    w: 0.2484,
    h: 0.1025,
  },
  recommendedContentWindow: {
    x: 0.116,
    y: 0.225,
    w: 0.768,
    h: 0.455,
  },
};

export const V13_BUILD_RULES = [
  'Home v13 is locked as the visual source of truth and must remain untouched.',
  'All next windows should reuse the same background / hero / nav family from v13.',
  'Only the central content window should change from screen to screen.',
  'Hit-zones stay above art; do not redraw extra shadows or duplicate menu layers.',
  'Keep one coordinate system and pixel-snap geometry with PixelRatio.roundToNearestPixel.',
];
