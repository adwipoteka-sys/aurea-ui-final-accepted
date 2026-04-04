import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  PixelRatio,
  Share,
} from 'react-native';

import PrometeiDiscoveryScreen from './PrometeiDiscoveryScreen';

const round = PixelRatio.roundToNearestPixel;
const px = (value) => round(value);

const STATIC_SCREENS = {
  home: require('../assets/foundation/reference/home-v13-exact-4k.png'),
  send: require('../assets/exact/send-v13-chrome.png'),
  contacts: require('../assets/exact/contacts-v13-chrome.png'),
  history: require('../assets/exact/history-v13-chrome.png'),
  receipt: require('../assets/exact/receipt-v13-chrome.png'),
};

const SCREEN_META = Object.fromEntries(
  Object.entries(STATIC_SCREENS).map(([key, source]) => [key, Image.resolveAssetSource(source)]),
);

const HOME_ACTION_RECTS = {
  projects: { x: 0.1387, y: 0.4050, w: 0.3232, h: 0.0590 },
  spell: { x: 0.5112, y: 0.4039, w: 0.3901, h: 0.0601 },
};

const NAV_ROW = { x: 0.0576, y: 0.7407, w: 0.8848, h: 0.0812 };
const BACK_RECT = { x: 0.0382, y: 0.0732, w: 0.2484, h: 0.1025 };
const SEND_OK_RECT = { x: 0.2548, y: 0.5898, w: 0.4076, h: 0.0762 };
const RECEIPT_SHARE_RECT = { x: 0.1189, y: 0.5659, w: 0.6688, h: 0.0830 };

function getCoverFrame({ width, height, meta, focalX = 0.5, focalY = 0.5 }) {
  const scale = Math.max(width / meta.width, height / meta.height);
  const artW = px(meta.width * scale);
  const artH = px(meta.height * scale);
  const left = px(width / 2 - artW * focalX);
  const top = px(height / 2 - artH * focalY);

  return { width: artW, height: artH, left, top };
}

function getRectFromNorm(frame, rect) {
  return {
    left: px(frame.left + frame.width * rect.x),
    top: px(frame.top + frame.height * rect.y),
    width: px(frame.width * rect.w),
    height: px(frame.height * rect.h),
  };
}

function NavHitRow({ frame, onSelect }) {
  const row = getRectFromNorm(frame, NAV_ROW);

  return (
    <View
      style={[
        styles.hitRow,
        {
          left: row.left,
          top: row.top,
          width: row.width,
          height: row.height,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable style={styles.hit} hitSlop={12} onPress={() => onSelect('home')} accessibilityRole="button" accessibilityLabel="Главная" />
      <Pressable style={styles.hit} hitSlop={12} onPress={() => onSelect('send')} accessibilityRole="button" accessibilityLabel="Отправить" />
      <Pressable style={styles.hit} hitSlop={12} onPress={() => onSelect('contacts')} accessibilityRole="button" accessibilityLabel="Контакты" />
      <Pressable style={styles.hit} hitSlop={12} onPress={() => onSelect('history')} accessibilityRole="button" accessibilityLabel="История" />
    </View>
  );
}

function BackHit({ frame, onPress }) {
  const rect = getRectFromNorm(frame, BACK_RECT);

  return (
    <Pressable
      style={[
        styles.abs,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      ]}
      hitSlop={12}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Назад"
    />
  );
}

function HomeActionHits({ frame, onAction }) {
  const projects = getRectFromNorm(frame, HOME_ACTION_RECTS.projects);
  const spell = getRectFromNorm(frame, HOME_ACTION_RECTS.spell);

  return (
    <>
      <Pressable
        style={[
          styles.abs,
          {
            left: projects.left,
            top: projects.top,
            width: projects.width,
            height: projects.height,
          },
        ]}
        hitSlop={16}
        onPress={() => onAction('projects')}
        accessibilityRole="button"
        accessibilityLabel="Найти Прометеев"
      />

      <Pressable
        style={[
          styles.abs,
          {
            left: spell.left,
            top: spell.top,
            width: spell.width,
            height: spell.height,
          },
        ]}
        hitSlop={16}
        onPress={() => onAction('spell')}
        accessibilityRole="button"
        accessibilityLabel="Экспеллиармус"
      />
    </>
  );
}

function SendOkHit({ frame, onPress }) {
  const rect = getRectFromNorm(frame, SEND_OK_RECT);

  return (
    <Pressable
      style={[
        styles.abs,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      ]}
      hitSlop={12}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="OK"
    />
  );
}

function ReceiptShareHit({ frame, onPress }) {
  const rect = getRectFromNorm(frame, RECEIPT_SHARE_RECT);

  return (
    <Pressable
      style={[
        styles.abs,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      ]}
      hitSlop={12}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Отправить чек"
    />
  );
}

export default function ExactAureaV13Windows() {
  const [screen, setScreen] = useState('home');
  const [overlay, setOverlay] = useState(null);

  const frame = useMemo(() => {
  if (!width || !height) return null;

  return getCoverFrame({
    width,
    height,
    meta: SCREEN_META[screen],
    focalX: 0.5,
    focalY: 0.5,
  });
}, [height, screen, width]);

  const openReceiptShare = async () => {
    try {
      await Share.share({
        message: 'AUREA — чек об успешной оплате https://aurea.ru/4x8Nz9',
      });
    } catch (error) {
      console.log('[AUREA] SHARE_ERROR', error?.message || error);
    }
  };

  const handleBack = () => {
    if (screen === 'receipt') {
      setScreen('send');
      return;
    }

    setScreen('home');
  };

  const handleHomeAction = (action) => {
  if (action === 'projects') {
    setOverlay('prometei');
    return;
  }

  setOverlay(null);
  setScreen('send');
};

  const handleSelectScreen = (nextScreen) => {
    setOverlay(null);
    setScreen(nextScreen);
  };

  return (
    <View style={styles.root}>
      {frame && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Image
            source={STATIC_SCREENS[screen]}
            resizeMode="stretch"
            style={[
              styles.abs,
              {
                width: frame.width,
                height: frame.height,
                left: frame.left,
                top: frame.top,
              },
            ]}
            pointerEvents="none"
          />

          <NavHitRow frame={frame} onSelect={handleSelectScreen} />

          {screen === 'home' && <HomeActionHits frame={frame} onAction={handleHomeAction} />}

          {screen !== 'home' && overlay !== 'prometei' && (
            <BackHit frame={frame} onPress={handleBack} />
          )}

          {screen === 'send' && (
            <SendOkHit frame={frame} onPress={() => setScreen('receipt')} />
          )}

          {screen === 'receipt' && (
            <ReceiptShareHit frame={frame} onPress={openReceiptShare} />
          )}

          {overlay === 'prometei' && (
            <PrometeiDiscoveryScreen
              onClose={() => setOverlay(null)}
              onBack={() => setOverlay(null)}
              onSelect={handleSelectScreen}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#030816',
    overflow: 'hidden',
  },
  abs: {
    position: 'absolute',
  },
  hitRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  hit: {
    flex: 1,
  },
});