import { PixelRatio } from 'react-native';

const round = PixelRatio.roundToNearestPixel;

const BG_W = 1365;
const BG_H = 2048;
const SCREEN_W = 1365;
const SCREEN_H = 2048;
const SCREEN_ASPECT = SCREEN_W / SCREEN_H;

const NAV_FRAME_ASPECT = Math.max(
  209 / 1205,
  196 / 1149,
  201 / 1159,
  183 / 1141,
);

const FOCAL_X = {
  home: {
    phonePortrait: 0.5,
    phoneLandscape: 0.5,
    tabletPortrait: 0.5,
    tabletLandscape: 0.5,
  },
  send: {
    phonePortrait: 0.4,
    phoneLandscape: 0.5,
    tabletPortrait: 0.5,
    tabletLandscape: 0.5,
  },
  contacts: {
    phonePortrait: 0.4,
    phoneLandscape: 0.5,
    tabletPortrait: 0.5,
    tabletLandscape: 0.5,
  },
  history: {
    phonePortrait: 0.4,
    phoneLandscape: 0.5,
    tabletPortrait: 0.5,
    tabletLandscape: 0.5,
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function px(value) {
  return round(value);
}

function sizePx(value) {
  return round(Math.max(0, value));
}

function getMode(width, height) {
  const isLandscape = width > height;
  const shortestSide = Math.min(width, height);
  const isTabletLike = shortestSide >= 600;

  if (isLandscape && isTabletLike) return 'tabletLandscape';
  if (isLandscape) return 'phoneLandscape';
  if (isTabletLike) return 'tabletPortrait';
  return 'phonePortrait';
}

function getScreenFocalX(screenKey, mode) {
  return FOCAL_X[screenKey]?.[mode] ?? 0.5;
}

export function getResponsiveAureaLayout({
  width,
  height,
  insets,
  navMeta,
  screenKey,
}) {
  const mode = getMode(width, height);
  const isLandscape = mode === 'phoneLandscape' || mode === 'tabletLandscape';
  const isTabletLike = mode === 'tabletPortrait' || mode === 'tabletLandscape';

  const navAspect = navMeta.height / navMeta.width;

  const bgScale = Math.max(width / BG_W, height / BG_H);
  const bgW = sizePx(BG_W * bgScale);
  const bgH = sizePx(BG_H * bgScale);
  const bgLeft = px((width - bgW) / 2);
  const bgTop = px((height - bgH) / 2);

  let navW;
  let navBottomGap;

  if (mode === 'tabletLandscape') {
    navW = clamp(width * 0.52, 400, 620);
    navBottomGap = clamp(height * 0.04, 18, 34);
  } else if (mode === 'phoneLandscape') {
    navW = clamp(width * 0.62, 320, 520);
    navBottomGap = clamp(height * 0.04, 12, 24);
  } else if (mode === 'tabletPortrait') {
    navW = clamp(width * 0.74, 360, 540);
    navBottomGap = clamp(height * 0.05, 32, 46);
  } else {
    navW = clamp(width * 0.89, 300, 440);
    navBottomGap = clamp(height * 0.055, 34, 54);
  }

  navW = sizePx(navW);
  const navFrameH = sizePx(navW * NAV_FRAME_ASPECT);
  const navImageH = sizePx(navW * navAspect);
  const navLeft = px((width - navW) / 2);
  const navTop = px(height - insets.bottom - navBottomGap - navFrameH);
  const navImageTop = px(navTop + (navFrameH - navImageH));

  const screenTopShift = px(
    isLandscape
      ? clamp(insets.top * 0.18, 4, 10)
      : clamp(insets.top * 0.35, 6, 18),
  );

  const screenH = sizePx(height);
  const screenW = sizePx(screenH * SCREEN_ASPECT);
  const screenFocalX = screenW > width ? getScreenFocalX(screenKey, mode) : 0.5;
  const screenLeft =
    screenW > width
      ? px(width / 2 - screenW * screenFocalX)
      : px((width - screenW) / 2);

  const backHitW = sizePx(clamp(width * (isLandscape ? 0.14 : 0.24), 76, 120));
  const backHitH = sizePx(clamp(height * (isLandscape ? 0.18 : 0.11), 62, 96));
  const backHitLeft = 0;
  const backHitTop = 0;

  const navHitTop = navTop;
  const navHitH = navFrameH;

  return {
    mode,
    isLandscape,
    isTabletLike,
    bgW,
    bgH,
    bgLeft,
    bgTop,
    screenW,
    screenH,
    screenLeft,
    screenTop: screenTopShift,
    navW,
    navFrameH,
    navImageH,
    navLeft,
    navTop,
    navImageTop,
    navHitTop,
    navHitH,
    backHitW,
    backHitH,
    backHitLeft,
    backHitTop,
  };
}
