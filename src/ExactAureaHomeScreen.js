import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getResponsiveAureaLayout } from './layout/getResponsiveAureaLayout';

const round = PixelRatio.roundToNearestPixel;
const px = (value) => round(value);

const BG = require('../assets/bg/background-only.png');
const HOME_EXACT = require('../assets/screens/home-exact-4k.png');

const SCREEN_ARTS = {
  send: require('../assets/screens/send.png'),
  contacts: require('../assets/screens/contacts.png'),
  history: require('../assets/screens/history.png'),
};

const NAVS = {
  home: require('../assets/overlays/nav-home.png'),
  send: require('../assets/overlays/nav-send.png'),
  contacts: require('../assets/overlays/nav-contacts.png'),
  history: require('../assets/overlays/nav-history.png'),
};

const NAV_METAS = {
  home: Image.resolveAssetSource(NAVS.home),
  send: Image.resolveAssetSource(NAVS.send),
  contacts: Image.resolveAssetSource(NAVS.contacts),
  history: Image.resolveAssetSource(NAVS.history),
};

const HOME_META = Image.resolveAssetSource(HOME_EXACT);

const HOME_ACTION_RECTS = {
  projects: {
    x: 0.1387,
    y: 0.4050,
    w: 0.3232,
    h: 0.0590,
  },
  spell: {
    x: 0.5112,
    y: 0.4039,
    w: 0.3901,
    h: 0.0601,
  },
};

const HOME_NAV_ROW = {
  x: 0.0576,
  y: 0.7407,
  w: 0.8848,
  h: 0.0812,
};

function getCoverFrame({ width, height, meta, focalX = 0.5, focalY = 0.5 }) {
  const scale = Math.max(width / meta.width, height / meta.height);
  const artW = px(meta.width * scale);
  const artH = px(meta.height * scale);
  const left = px(width / 2 - artW * focalX);
  const top = px(height / 2 - artH * focalY);

  return {
    width: artW,
    height: artH,
    left,
    top,
  };
}

function getRectFromNorm(frame, rect) {
  return {
    left: px(frame.left + frame.width * rect.x),
    top: px(frame.top + frame.height * rect.y),
    width: px(frame.width * rect.w),
    height: px(frame.height * rect.h),
  };
}

function NavHitRow({ geo, onSelect }) {
  return (
    <View
      style={[
        styles.hitRow,
        {
          width: geo.navW,
          height: geo.navHitH,
          left: geo.navLeft,
          top: geo.navHitTop,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="Главная"
        hitSlop={10}
        onPress={() => onSelect('home')}
      />
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="Отправить"
        hitSlop={10}
        onPress={() => onSelect('send')}
      />
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="Контакты"
        hitSlop={10}
        onPress={() => onSelect('contacts')}
      />
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="История"
        hitSlop={10}
        onPress={() => onSelect('history')}
      />
    </View>
  );
}

function HomeNavHitRow({ frame, onSelect }) {
  const row = getRectFromNorm(frame, HOME_NAV_ROW);

  return (
    <View
      style={[
        styles.hitRow,
        {
          width: row.width,
          height: row.height,
          left: row.left,
          top: row.top,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="Главная"
        hitSlop={12}
        onPress={() => onSelect('home')}
      />
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="Отправить"
        hitSlop={12}
        onPress={() => onSelect('send')}
      />
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="Контакты"
        hitSlop={12}
        onPress={() => onSelect('contacts')}
      />
      <Pressable
        style={styles.hit}
        accessibilityRole="button"
        accessibilityLabel="История"
        hitSlop={12}
        onPress={() => onSelect('history')}
      />
    </View>
  );
}

function HomeActionHits({ frame, onAction }) {
  const projects = getRectFromNorm(frame, HOME_ACTION_RECTS.projects);
  const spell = getRectFromNorm(frame, HOME_ACTION_RECTS.spell);

  return (
    <>
      <Pressable
        style={[
          styles.homeActionHit,
          {
            left: projects.left,
            top: projects.top,
            width: projects.width,
            height: projects.height,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Найти проектов"
        hitSlop={16}
        onPress={() => onAction('projects')}
      />

      <Pressable
        style={[
          styles.homeActionHit,
          {
            left: spell.left,
            top: spell.top,
            width: spell.width,
            height: spell.height,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Экспаллизируйсь"
        hitSlop={16}
        onPress={() => onAction('spell')}
      />
    </>
  );
}

export default function ExactAureaHomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const geo = useMemo(() => {
    if (activeTab === 'home' || !width || !height) return null;

    return getResponsiveAureaLayout({
      width,
      height,
      insets,
      navMeta: NAV_METAS[activeTab],
      screenKey: activeTab,
    });
  }, [activeTab, height, insets, width]);

  const homeFrame = useMemo(() => {
    if (activeTab !== 'home' || !width || !height) return null;

    return getCoverFrame({
      width,
      height,
      meta: HOME_META,
      focalX: 0.5,
      focalY: 0.5,
    });
  }, [activeTab, height, width]);

  const handleSelect = (tab) => {
    setActiveTab(tab);
    console.log(`[AUREA] TAB -> ${tab}`);
  };

  const handleHomeAction = (action) => {
    console.log(`[AUREA] ACTION -> ${action}`);

    if (action === 'projects') {
      handleSelect('contacts');
      return;
    }

    if (action === 'spell') {
      handleSelect('send');
    }
  };

  return (
    <View style={styles.root}>
      {activeTab === 'home' && homeFrame && (
        <>
          <Image
            source={HOME_EXACT}
            resizeMode="stretch"
            style={[
              styles.abs,
              {
                width: homeFrame.width,
                height: homeFrame.height,
                left: homeFrame.left,
                top: homeFrame.top,
              },
            ]}
            pointerEvents="none"
          />

          <HomeActionHits frame={homeFrame} onAction={handleHomeAction} />
          <HomeNavHitRow frame={homeFrame} onSelect={handleSelect} />
        </>
      )}

      {activeTab !== 'home' && geo && (
        <>
          <Image
            source={BG}
            resizeMode="stretch"
            style={[
              styles.abs,
              {
                width: geo.bgW,
                height: geo.bgH,
                left: geo.bgLeft,
                top: geo.bgTop,
              },
            ]}
            pointerEvents="none"
          />

          <Image
            source={SCREEN_ARTS[activeTab]}
            resizeMode="stretch"
            style={[
              styles.abs,
              {
                width: geo.screenW,
                height: geo.screenH,
                left: geo.screenLeft,
                top: geo.screenTop,
              },
            ]}
            pointerEvents="none"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            hitSlop={12}
            style={[
              styles.backHit,
              {
                width: geo.backHitW,
                height: geo.backHitH,
                left: geo.backHitLeft,
                top: geo.backHitTop,
              },
            ]}
            onPress={() => handleSelect('home')}
          />

          <Image
            source={NAVS[activeTab]}
            resizeMode="stretch"
            style={[
              styles.abs,
              {
                width: geo.navW,
                height: geo.navImageH,
                left: geo.navLeft,
                top: geo.navImageTop,
              },
            ]}
            pointerEvents="none"
          />

          <NavHitRow geo={geo} onSelect={handleSelect} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#020814',
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
  homeActionHit: {
    position: 'absolute',
  },
  backHit: {
    position: 'absolute',
  },
});
