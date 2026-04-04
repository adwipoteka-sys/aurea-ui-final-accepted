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
} from 'react-native';

const px = PixelRatio.roundToNearestPixel;

const SEND_CHROME = require('../assets/exact/send-v13-chrome.png');
const SEND_META = Image.resolveAssetSource(SEND_CHROME);

const BACK_RECT = { x: 0.0382, y: 0.0732, w: 0.2484, h: 0.1025 };

const AGENTS = [
  { id: 'iv', short: 'IV', name: 'Ivan Volkov', city: 'Москва', rating: 4.9, reserve: '12 400 USDT', color: '#63d7ff', x: 0.20, y: 0.62, online: true },
  { id: 'ap', short: 'AP', name: 'Anna Petrova', city: 'Санкт-Петербург', rating: 4.8, reserve: '8 100 USDT', color: '#7cffd5', x: 0.43, y: 0.49, online: true },
  { id: 'nc', short: 'HC', name: 'Николай Смирнов', city: 'Дубай', rating: 4.7, reserve: '15 800 USDT', color: '#b58cff', x: 0.76, y: 0.44, online: true },
  { id: 'ac', short: 'AC', name: 'Алексей Сидоров', city: 'Казань', rating: 4.6, reserve: '5 900 USDT', color: '#ffca63', x: 0.63, y: 0.66, online: false },
  { id: 'am', short: 'AM', name: 'Алёна Михайлова', city: 'Екатеринбург', rating: 4.9, reserve: '9 400 USDT', color: '#ff9f8e', x: 0.34, y: 0.74, online: true },
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
      <View style={active ? styles.modeBtnGlow : null} pointerEvents="none" />
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
          <Text numberOfLines={1} style={styles.listName}>{agent.name}</Text>
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

export default function PrometeiDiscoveryScreen({ onClose, onBack }) {
  const { width, height } = useWindowDimensions();

  const [mode, setMode] = useState('map');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('iv');

  const close = onClose || onBack || (() => {});

  const sendFrame = useMemo(() => getCoverFrame(width, height, SEND_META), [width, height]);

  const panelWidth = Math.min(width - 34, 720);
  const panelLeft = px((width - panelWidth) / 2);
  const panelTop = px(Math.max(height * 0.285, 238));
  const panelHeight = px(Math.min(Math.max(height * 0.46, 470), 620));
  const stageHeight = px(Math.min(Math.max(panelHeight * 0.26, 180), 230));

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
            showsVerticalScrollIndicator={false}
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

            <Pressable style={styles.joinBtn}>
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
                  <Pressable
                    key={agent.id}
                    style={[
                      styles.agentPinWrap,
                      {
                        left: `${agent.x * 100}%`,
                        top: `${agent.y * 100}%`,
                      },
                    ]}
                    onPress={() => setSelectedId(agent.id)}
                  >
                    {selectedAgent.id === agent.id && (
                      <View style={[styles.agentPulse, { borderColor: agent.color }]} />
                    )}

                    <View
                      style={[
                        styles.agentPin,
                        {
                          borderColor: agent.color,
                          shadowColor: agent.color,
                        },
                        selectedAgent.id === agent.id && styles.agentPinActive,
                      ]}
                    >
                      <View style={[styles.agentPinCore, { backgroundColor: agent.color }]}>
                        <Text style={styles.agentPinCoreText}>{agent.short}</Text>
                      </View>
                    </View>

                    <View style={styles.agentLabel}>
                      <Text style={styles.agentLabelText} numberOfLines={1}>
                        {agent.name}
                      </Text>
                    </View>
                  </Pressable>
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
                <Pressable style={styles.actionBtnSecondary}>
                  <Text style={styles.actionBtnSecondaryText}>Маршрут</Text>
                </Pressable>
              </View>
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
    paddingBottom: 28,
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
    height: 200,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(108, 214, 255, 0.08)',
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

  agentPinWrap: {
    position: 'absolute',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    alignItems: 'center',
  },

  agentPulse: {
    position: 'absolute',
    top: -4,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    opacity: 0.30,
    transform: [{ scale: 1.08 }],
  },

  agentPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: '#0B1A44',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  agentPinActive: {
    transform: [{ scale: 1.05 }],
  },

  agentPinCore: {
    width: '76%',
    height: '76%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  agentPinCoreText: {
    color: '#071420',
    fontSize: 13,
    fontWeight: '900',
  },

  agentLabel: {
    marginTop: 6,
    minWidth: 92,
    maxWidth: 116,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 28, 74, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(126, 208, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  agentLabelText: {
    color: '#DCE9FB',
    fontSize: 11,
    fontWeight: '700',
  },

  listBox: {
    marginBottom: 16,
    gap: 10,
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
});