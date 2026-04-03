import React, { useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { V13_CHROME_ASSETS } from './v13SourceOfTruth';

const round = PixelRatio.roundToNearestPixel;
const px = (value) => round(value);

const BG_META = Image.resolveAssetSource(V13_CHROME_ASSETS.background);
const HERO_META = Image.resolveAssetSource(V13_CHROME_ASSETS.hero);
const NAV_META = {
  home: Image.resolveAssetSource(V13_CHROME_ASSETS.nav.home),
  send: Image.resolveAssetSource(V13_CHROME_ASSETS.nav.send),
  contacts: Image.resolveAssetSource(V13_CHROME_ASSETS.nav.contacts),
  history: Image.resolveAssetSource(V13_CHROME_ASSETS.nav.history),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getCoverFrame({ width, height, meta }) {
  const scale = Math.max(width / meta.width, height / meta.height);
  const frameW = px(meta.width * scale);
  const frameH = px(meta.height * scale);

  return {
    width: frameW,
    height: frameH,
    left: px((width - frameW) / 2),
    top: px((height - frameH) / 2),
  };
}

function getShellLayout({ width, height, insets, activeTab }) {
  const bg = getCoverFrame({ width, height, meta: BG_META });

  const heroW = px(clamp(width * 0.54, 250, 380));
  const heroH = px((heroW * HERO_META.height) / HERO_META.width);
  const heroLeft = px((width - heroW) / 2);
  const heroTop = px(insets.top + clamp(height * 0.035, 18, 34));

  const navW = px(clamp(width * 0.89, 300, 440));
  const navH = px((navW * NAV_META[activeTab].height) / NAV_META[activeTab].width);
  const navLeft = px((width - navW) / 2);
  const navTop = px(height - insets.bottom - clamp(height * 0.045, 28, 48) - navH);

  const contentLeft = px(width * 0.115);
  const contentTop = px(height * 0.245);
  const contentWidth = px(width * 0.77);
  const contentHeight = px(navTop - contentTop - clamp(height * 0.07, 42, 72));

  return {
    bg,
    heroW,
    heroH,
    heroLeft,
    heroTop,
    navW,
    navH,
    navLeft,
    navTop,
    contentLeft,
    contentTop,
    contentWidth,
    contentHeight,
  };
}

export default function V13ChromeShell({ activeTab = 'home', children, contentStyle }) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const layout = useMemo(() => {
    if (!width || !height) return null;
    return getShellLayout({ width, height, insets, activeTab });
  }, [activeTab, height, insets, width]);

  if (!layout) return null;

  return (
    <View style={styles.root}>
      <Image
        source={V13_CHROME_ASSETS.background}
        resizeMode="stretch"
        style={[
          styles.abs,
          {
            width: layout.bg.width,
            height: layout.bg.height,
            left: layout.bg.left,
            top: layout.bg.top,
          },
        ]}
      />

      <Image
        source={V13_CHROME_ASSETS.hero}
        resizeMode="stretch"
        style={[
          styles.abs,
          {
            width: layout.heroW,
            height: layout.heroH,
            left: layout.heroLeft,
            top: layout.heroTop,
          },
        ]}
      />

      <View
        style={[
          styles.content,
          {
            left: layout.contentLeft,
            top: layout.contentTop,
            width: layout.contentWidth,
            height: layout.contentHeight,
          },
          contentStyle,
        ]}
      >
        {typeof children === 'function'
          ? children({
              left: layout.contentLeft,
              top: layout.contentTop,
              width: layout.contentWidth,
              height: layout.contentHeight,
            })
          : children}
      </View>

      <Image
        source={V13_CHROME_ASSETS.nav[activeTab]}
        resizeMode="stretch"
        style={[
          styles.abs,
          {
            width: layout.navW,
            height: layout.navH,
            left: layout.navLeft,
            top: layout.navTop,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020814',
    overflow: 'hidden',
  },
  abs: {
    position: 'absolute',
  },
  content: {
    position: 'absolute',
  },
});
