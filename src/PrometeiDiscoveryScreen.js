import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  PixelRatio,
  useWindowDimensions,
  ScrollView,
  Image,
  Alert,
  Linking,
  Platform,
} from 'react-native';

const px = PixelRatio.roundToNearestPixel;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const SEND_CHROME = require('../assets/exact/send-v13-chrome.png');
const SEND_META = Image.resolveAssetSource(SEND_CHROME);

const HOME_CHROME = require('../assets/foundation/reference/home-v13-exact-4k.png');
const HOME_META = Image.resolveAssetSource(HOME_CHROME);

const BACK_RECT = { x: 0.0382, y: 0.0732, w: 0.2484, h: 0.1025 };
const HOME_NAV_ROW = { x: 0.0576, y: 0.7407, w: 0.8848, h: 0.0812 };

const AGENTS = [
  {
    id: 'iv',
    short: 'IV',
    name: 'Ivan Volkov',
    city: 'Москва',
    rating: 4.9,
    reserve: '12 400 USDT',
    color: '#63d7ff',
    x: 0.18,
    y: 0.60,
    lat: 55.7558,
    lon: 37.6176,
    online: true,
  },
  {
    id: 'ap',
    short: 'AP',
    name: 'Anna Petrova',
    city: 'Санкт-Петербург',
    rating: 4.8,
    reserve: '8 100 USDT',
    color: '#7cffd5',
    x: 0.43,
    y: 0.42,
    lat: 59.9343,
    lon: 30.3351,
    online: true,
  },
  {
    id: 'nc',
    short: 'HC',
    name: 'Николай Смирнов',
    city: 'Дубай',
    rating: 4.7,
    reserve: '15 800 USDT',
    color: '#b58cff',
    x: 0.74,
    y: 0.34,
    lat: 25.2048,
    lon: 55.2708,
    online: true,
  },
  {
    id: 'ac',
    short: 'AC',
    name: 'Алексей Сидоров',
    city: 'Казань',
    rating: 4.6,
    reserve: '5 900 USDT',
    color: '#ffca63',
    x: 0.57,
    y: 0.67,
    lat: 55.7963,
    lon: 49.1088,
    online: false,
  },
  {
    id: 'am',
    short: 'AM',
    name: 'Алёна Михайлова',
    city: 'Екатеринбург',
    rating: 4.9,
    reserve: '9 400 USDT',
    color: '#ff9f8e',
    x: 0.31,
    y: 0.78,
    lat: 56.8389,
    lon: 60.6057,
    online: true,
  },
];

function getCoverFrame(width, height, meta) {
  const scale = Math.max(width / meta.width, height / meta.height);
  const artW = px(meta.width * scale);
  const artH = px(meta.height * scale);
  const left = px(width / 2 - artW / 2);
  const top = px(height / 2 - artH / 2);
  return { width: artW, height: artH, left, top };
}

function rectFromNorm(frame, rect) {
  return {
    left: px(frame.left + frame.width * rect.x),
    top: px(frame.top + frame.height * rect.y),
    width: px(frame.width * rect.w),
    height: px(frame.height * rect.h),
  };
}

function buildGoogleMapsUrl(agent) {
  return `https://www.google.com/maps/search/?api=1&query=${agent.lat},${agent.lon}`;
}

function buildYandexMapsUrl(agent) {
  return `https://yandex.ru/maps/?pt=${agent.lon},${agent.lat}&z=16&l=map`;
}

function buildAppleMapsUrl(agent) {
  return `http://maps.apple.com/?ll=${agent.lat},${agent.lon}&q=${encodeURIComponent(
    `${agent.name}, ${agent.city}`
  )}`;
}

async function openUrlSafe(url) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Не удалось открыть карту');
  }
}

function BackReplica({ frame, onPress }) {
  const rect = rectFromNorm(frame, BACK_RECT);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={[
        styles.backCrop,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      ]}
    >
      <Image
        source={SEND_CHROME}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          left: frame.left - rect.left,
          top: frame.top - rect.top,
          width: frame.width,
          height: frame.height,
        }}
        pointerEvents="none"
      />
    </Pressable>
  );
}

function ModeButton({ label, active, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeBtn, active && styles.modeBtnActive, style]}>
      {active ? <View style={styles.modeBtnGlow} pointerEvents="none" /> : null}
      <Text style={[styles.modeText, active && styles.modeTextActive]}>{label}</Text>
    </Pressable>
  );
}

function MetaPill({ label, style }) {
  return (
    <View style={[styles.metaPill, style]}>
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

function AgentListRow({ agent, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.listRow, selected && styles.listRowActive]}>
      <View style={[styles.listAvatar, { borderColor: agent.color, shadowColor: agent.color }]}>
        <View style={[styles.listAvatarInner, { backgroundColor: agent.color }]}>
          <Text style={styles.listAvatarText}>{agent.short}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.listTopRow}>
          <Text numberOfLines={1} style={styles.listName}>
            {agent.name}
          </Text>
          <View style={[styles.statusPill, agent.online ? styles.statusOnline : styles.statusOffline]}>
            <Text style={styles.statusText}>{agent.online ? 'Онлайн' : 'Оффлайн'}</Text>
          </View>
        </View>

        <Text style={styles.listMeta}>
          {agent.city} · ★ {agent.rating} · резерв {agent.reserve}
        </Text>
      </View>
    </Pressable>
  );
}

function MapAgentChip({ agent, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.mapAgentCard,
        selected && styles.mapAgentCardActive,
        {
          left: `${agent.x * 100}%`,
          top: `${agent.y * 100}%`,
        },
      ]}
    >
      <View style={[styles.mapAgentDot, { borderColor: agent.color, shadowColor: agent.color }]}>
        <View style={[styles.mapAgentDotInner, { backgroundColor: agent.color }]}>
          <Text style={styles.mapAgentDotText}>{agent.short}</Text>
        </View>
      </View>

      <View style={styles.mapAgentInfo}>
        <Text numberOfLines={1} style={styles.mapAgentName}>
          {agent.name}
        </Text>
        <Text style={styles.mapAgentMeta}>★ {agent.rating}</Text>
      </View>
    </Pressable>
  );
}

export default function PrometeiDiscoveryScreen({ onClose, onBack }) {
  const { width, height } = useWindowDimensions();

  const [mode, setMode] = useState('map');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('iv');

  const close = onClose || onBack || (() => {});

  const sendFrame = useMemo(() => getCoverFrame(width, height, SEND_META), [width, height]);
  const homeFrame = useMemo(() => getCoverFrame(width, height, HOME_META), [width, height]);

  const navTop = px(homeFrame.top + homeFrame.height * HOME_NAV_ROW.y);

  const panelWidth = Math.min(width - 34, 720);
  const panelLeft = px((width - panelWidth) / 2);
  const panelTop = px(Math.max(height * 0.245, 205));
  const panelBottom = px(navTop - 26);
  const panelHeight = px(clamp(panelBottom - panelTop, 380, 520));

  const stageHeight = px(clamp(panelHeight * 0.29, 180, 240));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AGENTS;
    return AGENTS.filter((a) => {
      const hay = `${a.name} ${a.city} ${a.short}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const selectedAgent = useMemo(
    () => filtered.find((a) => a.id === selectedId) || filtered[0] || AGENTS[0],
    [filtered, selectedId]
  );

  const openMapPicker = () => {
    Alert.alert(
      'Открыть карту',
      `${selectedAgent.name}, ${selectedAgent.city}`,
      [
        { text: 'Google Maps', onPress: () => openUrlSafe(buildGoogleMapsUrl(selectedAgent)) },
        { text: 'Яндекс.Карты', onPress: () => openUrlSafe(buildYandexMapsUrl(selectedAgent)) },
        ...(Platform.OS === 'ios'
          ? [{ text: 'Apple Maps', onPress: () => openUrlSafe(buildAppleMapsUrl(selectedAgent)) }]
          : []),
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const handleBecomePrometei = () => {
    Alert.alert(
      'Стать Прометеем',
      'Здесь должен открываться онбординг агента: город, резерв USDT, способы оплаты, спред, лимиты, график, KYC и публикация профиля.',
      [{ text: 'Понятно' }]
    );
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <BackReplica frame={sendFrame} onPress={close} />

      <View
        style={[
          styles.panelShadow,
          {
            left: panelLeft,
            top: panelTop,
            width: panelWidth,
            height: panelHeight,
          },
        ]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.panelOuter,
          {
            left: panelLeft,
            top: panelTop,
            width: panelWidth,
            height: panelHeight,
          },
        ]}
      >
        <View style={styles.panelTopGlow} pointerEvents="none" />
        <View style={styles.panelBottomGlow} pointerEvents="none" />

        <View style={styles.panelInner}>
          <ScrollView
            style={styles.scrollFill}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical
            bounces
          >
            <View style={styles.topCap} />

            <Text style={styles.panelTitle}>Прометеи</Text>
            <Text style={styles.panelSubtitle}>
              Карта агентов рядом, рейтинг, резерв и{'\n'}
              безопасный старт сделки
            </Text>

            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Поиск по городу, имени или способу"
                placeholderTextColor="#8093b8"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.toggleRow}>
              <ModeButton
                label="Карта"
                active={mode === 'map'}
                onPress={() => setMode('map')}
                style={styles.modeGap}
              />
              <ModeButton
                label="Список"
                active={mode === 'list'}
                onPress={() => setMode('list')}
              />
            </View>

            <View style={styles.metaRow}>
              <MetaPill label={`${filtered.length} офферов`} style={styles.metaGap} />
              <MetaPill label={`${filtered.filter((a) => a.online).length} онлайн`} />
            </View>

            <Pressable style={styles.joinBtn} onPress={handleBecomePrometei}>
              <View style={styles.joinBtnGlow} />
              <Text style={styles.joinBtnText}>Стать Прометеем</Text>
            </Pressable>

            {mode === 'map' ? (
              <View style={[styles.mapBox, { height: stageHeight }]}>
                <View style={styles.stageSheen} pointerEvents="none" />

                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={`h-${i}`} style={[styles.gridH, { top: `${(i + 1) * 14}%` }]} />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <View key={`v-${i}`} style={[styles.gridV, { left: `${(i + 1) * 18}%` }]} />
                ))}

                {filtered.map((agent) => (
                  <MapAgentChip
                    key={agent.id}
                    agent={agent}
                    selected={selectedAgent?.id === agent.id}
                    onPress={() => setSelectedId(agent.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.listBox}>
                {filtered.map((agent) => (
                  <AgentListRow
                    key={agent.id}
                    agent={agent}
                    selected={selectedAgent?.id === agent.id}
                    onPress={() => setSelectedId(agent.id)}
                  />
                ))}
              </View>
            )}

            <View style={styles.focusCard}>
              <View style={styles.focusGlow} />
              <Text style={styles.focusName}>{selectedAgent.name}</Text>
              <Text style={styles.focusMeta}>
                {selectedAgent.city} · ★ {selectedAgent.rating} · резерв {selectedAgent.reserve}
              </Text>

              <View style={styles.focusButtons}>
                <Pressable style={[styles.actionBtnPrimary, styles.actionBtnGap]}>
                  <Text style={styles.actionBtnPrimaryText}>Начать сделку</Text>
                </Pressable>

                <Pressable style={styles.actionBtnSecondary} onPress={openMapPicker}>
                  <Text style={styles.actionBtnSecondaryText}>Маршрут</Text>
                </Pressable>
              </View>

              {Platform.OS === 'ios' && (
                <Pressable
                  style={styles.appleMapBtn}
                  onPress={() => openUrlSafe(buildAppleMapsUrl(selectedAgent))}
                >
                  <Text style={styles.appleMapBtnText}>Apple Maps</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },

  backCrop: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 12,
    zIndex: 20,
  },

  panelShadow: {
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: 'rgba(2, 8, 24, 0.18)',
    shadowColor: '#59DFFF',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  panelOuter: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(96, 208, 255, 0.44)',
    backgroundColor: 'rgba(3, 9, 35, 0.16)',
    borderRadius: 30,
    padding: 12,
    overflow: 'hidden',
  },

  panelTopGlow: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: -9,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(116, 223, 255, 0.14)',
  },

  panelBottomGlow: {
    position: 'absolute',
    left: '28%',
    right: '28%',
    bottom: -8,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(116, 223, 255, 0.07)',
  },

  panelInner: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(5, 14, 48, 0.985)',
    borderWidth: 1,
    borderColor: 'rgba(128, 223, 255, 0.08)',
    overflow: 'hidden',
  },

  scrollFill: {
    flex: 1,
  },

  panelScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 56,
  },

  topCap: {
    alignSelf: 'center',
    width: '64%',
    height: 14,
    borderRadius: 9,
    backgroundColor: 'rgba(205, 239, 255, 0.12)',
    marginBottom: 14,
  },

  panelTitle: {
    color: '#F7FDFF',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  panelSubtitle: {
    color: '#C8D7EF',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },

  searchWrap: {
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(103, 211, 255, 0.28)',
    backgroundColor: 'rgba(4, 16, 52, 0.90)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  searchIcon: {
    color: 'rgba(225, 245, 255, 0.76)',
    fontSize: 22,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: '#F3FCFF',
    fontSize: 16,
    paddingVertical: 0,
  },

  toggleRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  modeBtn: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(97, 203, 255, 0.22)',
    backgroundColor: 'rgba(6, 19, 56, 0.84)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  modeGap: {
    marginRight: 12,
  },

  modeBtnActive: {
    borderColor: 'rgba(121, 232, 255, 0.68)',
    backgroundColor: 'rgba(18, 62, 118, 0.92)',
  },

  modeBtnGlow: {
    position: 'absolute',
    left: '16%',
    right: '16%',
    top: -8,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(186, 243, 255, 0.12)',
  },

  modeText: {
    color: 'rgba(192, 226, 255, 0.82)',
    fontWeight: '700',
    fontSize: 15,
  },

  modeTextActive: {
    color: '#FFFFFF',
  },

  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  metaPill: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 206, 255, 0.12)',
    backgroundColor: 'rgba(4, 14, 45, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaGap: {
    marginRight: 10,
  },

  metaText: {
    color: '#DBE9FB',
    fontSize: 13,
    fontWeight: '700',
  },

  joinBtn: {
    alignSelf: 'flex-start',
    minWidth: 220,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#7BDCFF',
    backgroundColor: 'rgba(88, 177, 255, 0.44)',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },

  joinBtnGlow: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: -8,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(198, 243, 255, 0.12)',
  },

  joinBtnText: {
    color: '#F5FBFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  mapBox: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(108, 214, 255, 0.10)',
    backgroundColor: 'rgba(4, 16, 48, 0.98)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },

  stageSheen: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: -10,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(170, 238, 255, 0.08)',
  },

  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(108, 214, 255, 0.06)',
  },

  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(108, 214, 255, 0.06)',
  },

  mapAgentCard: {
    position: 'absolute',
    minWidth: 104,
    maxWidth: 138,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(121, 232, 255, 0.18)',
    backgroundColor: 'rgba(8, 24, 62, 0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    transform: [{ translateX: -30 }, { translateY: -20 }],
  },

  mapAgentCardActive: {
    borderColor: 'rgba(121, 232, 255, 0.58)',
    backgroundColor: 'rgba(14, 52, 104, 0.92)',
  },

  mapAgentDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  mapAgentDotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapAgentDotText: {
    color: '#05111F',
    fontSize: 10,
    fontWeight: '900',
  },

  mapAgentInfo: {
    flex: 1,
  },

  mapAgentName: {
    color: '#F6FDFF',
    fontSize: 11,
    fontWeight: '800',
  },

  mapAgentMeta: {
    color: 'rgba(185, 223, 255, 0.76)',
    fontSize: 10,
    marginTop: 2,
  },

  listBox: {
    marginBottom: 16,
  },

  listRow: {
    minHeight: 84,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 209, 255, 0.10)',
    backgroundColor: 'rgba(4, 16, 50, 0.86)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  listRowActive: {
    borderColor: 'rgba(117, 232, 255, 0.44)',
    backgroundColor: 'rgba(14, 52, 104, 0.86)',
  },

  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },

  listAvatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listAvatarText: {
    color: '#05111F',
    fontSize: 12,
    fontWeight: '900',
  },

  listTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },

  listName: {
    flex: 1,
    color: '#F6FDFF',
    fontSize: 16,
    fontWeight: '800',
  },

  statusPill: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusOnline: {
    backgroundColor: 'rgba(41, 146, 94, 0.22)',
  },

  statusOffline: {
    backgroundColor: 'rgba(165, 106, 46, 0.18)',
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  listMeta: {
    color: 'rgba(185, 223, 255, 0.72)',
    fontSize: 12,
    lineHeight: 16,
  },

  focusCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(118, 230, 255, 0.12)',
    backgroundColor: 'rgba(4, 18, 56, 0.90)',
    overflow: 'hidden',
  },

  focusGlow: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(68, 159, 255, 0.05)',
  },

  focusName: {
    color: '#F7FDFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },

  focusMeta: {
    color: 'rgba(190, 226, 255, 0.72)',
    fontSize: 12,
    marginBottom: 12,
  },

  focusButtons: {
    flexDirection: 'row',
  },

  actionBtnPrimary: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(121, 232, 255, 0.70)',
    backgroundColor: 'rgba(27, 96, 174, 0.94)',
  },

  actionBtnGap: {
    marginRight: 10,
  },

  actionBtnSecondary: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(101, 208, 255, 0.12)',
    backgroundColor: 'rgba(6, 22, 61, 0.92)',
  },

  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  actionBtnSecondaryText: {
    color: '#DDF6FF',
    fontSize: 12,
    fontWeight: '800',
  },

  appleMapBtn: {
    marginTop: 10,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(101, 208, 255, 0.12)',
    backgroundColor: 'rgba(6, 22, 61, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  appleMapBtnText: {
    color: '#DDF6FF',
    fontSize: 12,
    fontWeight: '800',
  },
});