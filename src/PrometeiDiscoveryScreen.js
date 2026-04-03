import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const round = PixelRatio.roundToNearestPixel;
const px = (value) => round(value);
const sizePx = (value) => round(Math.max(0, value));
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BG = require('../assets/foundation/chrome/background-only.png');
const HERO = require('../assets/foundation/chrome/hero.png');
const NAV_HOME = require('../assets/foundation/chrome/nav-home.png');

const BG_META = Image.resolveAssetSource(BG);
const HERO_META = Image.resolveAssetSource(HERO);
const NAV_META = Image.resolveAssetSource(NAV_HOME);

const FILTERS = [
  { key: 'nearby', label: 'Рядом' },
  { key: 'cash', label: 'Наличные' },
  { key: 'sbp', label: 'СБП' },
  { key: 'alwaysOn', label: '24/7' },
];

const AGENTS = [
  {
    id: 'msk-volkov',
    name: 'Ivan Volkov',
    city: 'Москва',
    distanceKm: 0.8,
    rating: 4.9,
    reviews: 248,
    spread: '+0.7%',
    reserve: '12 400 USDT',
    methods: ['СБП', 'наличные', 'карта'],
    response: '~2 мин',
    kyc: 'KYC Pro',
    schedule: '24/7',
    online: true,
    alwaysOn: true,
    cash: true,
    sbp: true,
    tint: 'rgba(89, 225, 255, 0.98)',
    initials: 'IV',
    map: { x: 0.21, y: 0.46 },
  },
  {
    id: 'spb-petrova',
    name: 'Anna Petrova',
    city: 'Санкт-Петербург',
    distanceKm: 1.6,
    rating: 4.8,
    reviews: 173,
    spread: '+0.9%',
    reserve: '8 950 USDT',
    methods: ['СБП', 'карта'],
    response: '~5 мин',
    kyc: 'KYC Pro',
    schedule: '10:00–23:00',
    online: true,
    alwaysOn: false,
    cash: false,
    sbp: true,
    tint: 'rgba(122, 255, 210, 0.98)',
    initials: 'AP',
    map: { x: 0.42, y: 0.27 },
  },
  {
    id: 'kzn-sidorov',
    name: 'Алексей Сидоров',
    city: 'Казань',
    distanceKm: 2.3,
    rating: 4.7,
    reviews: 119,
    spread: '+0.6%',
    reserve: '15 700 USDT',
    methods: ['наличные', 'карта'],
    response: '~7 мин',
    kyc: 'KYC Base',
    schedule: '09:00–22:00',
    online: false,
    alwaysOn: false,
    cash: true,
    sbp: false,
    tint: 'rgba(255, 191, 106, 0.98)',
    initials: 'АС',
    map: { x: 0.61, y: 0.54 },
  },
  {
    id: 'dubai-smirnov',
    name: 'Николай Смирнов',
    city: 'Дубай',
    distanceKm: 0.5,
    rating: 5.0,
    reviews: 312,
    spread: '+0.8%',
    reserve: '21 300 USDT',
    methods: ['наличные', 'обмен рядом'],
    response: '~1 мин',
    kyc: 'KYC Elite',
    schedule: '24/7',
    online: true,
    alwaysOn: true,
    cash: true,
    sbp: false,
    tint: 'rgba(165, 143, 255, 0.98)',
    initials: 'НС',
    map: { x: 0.73, y: 0.24 },
  },
  {
    id: 'ekb-mikhailova',
    name: 'Алёна Михайлова',
    city: 'Екатеринбург',
    distanceKm: 1.2,
    rating: 4.9,
    reviews: 205,
    spread: '+0.5%',
    reserve: '10 150 USDT',
    methods: ['СБП', 'наличные'],
    response: '~3 мин',
    kyc: 'KYC Pro',
    schedule: '24/7',
    online: true,
    alwaysOn: true,
    cash: true,
    sbp: true,
    tint: 'rgba(255, 148, 128, 0.98)',
    initials: 'АМ',
    map: { x: 0.35, y: 0.64 },
  },
  {
    id: 'hub-almaty',
    name: 'Prometei Hub',
    city: 'Алматы',
    distanceKm: 3.8,
    rating: 4.8,
    reviews: 144,
    spread: '+0.4%',
    reserve: '34 900 USDT',
    methods: ['офис', 'карта', 'наличные'],
    response: '~4 мин',
    kyc: 'KYC Elite',
    schedule: '08:00–00:00',
    online: true,
    alwaysOn: false,
    cash: true,
    sbp: false,
    tint: 'rgba(124, 220, 255, 0.98)',
    initials: 'PH',
    map: { x: 0.86, y: 0.56 },
  },
];

function getMode(width, height) {
  const isLandscape = width > height;
  const shortest = Math.min(width, height);
  const isTabletLike = shortest >= 600;

  if (isLandscape && isTabletLike) return 'tabletLandscape';
  if (isLandscape) return 'phoneLandscape';
  if (isTabletLike) return 'tabletPortrait';
  return 'phonePortrait';
}

function getCoverFrame({ width, height, meta, focalX = 0.5, focalY = 0.5 }) {
  const scale = Math.max(width / meta.width, height / meta.height);
  const frameW = px(meta.width * scale);
  const frameH = px(meta.height * scale);

  return {
    width: frameW,
    height: frameH,
    left: px(width / 2 - frameW * focalX),
    top: px(height / 2 - frameH * focalY),
  };
}

function getLayout({ width, height, insets }) {
  const mode = getMode(width, height);
  const isLandscape = mode === 'phoneLandscape' || mode === 'tabletLandscape';
  const isTabletLike = mode === 'tabletPortrait' || mode === 'tabletLandscape';

  const bg = getCoverFrame({ width, height, meta: BG_META });

  const heroW = sizePx(
    isLandscape
      ? clamp(width * (isTabletLike ? 0.20 : 0.22), 150, 250)
      : clamp(width * 0.46, 220, 430),
  );
  const heroH = sizePx(heroW * (HERO_META.height / HERO_META.width));
  const heroLeft = isLandscape
    ? px(clamp(width * 0.045, 16, 48))
    : px((width - heroW) / 2);
  const heroTop = px(insets.top + clamp(height * 0.02, 18, 40));

  const navW = sizePx(
    isLandscape
      ? clamp(width * (isTabletLike ? 0.52 : 0.62), 320, 620)
      : clamp(width * (isTabletLike ? 0.74 : 0.89), 300, 540),
  );
  const navH = sizePx(navW * (NAV_META.height / NAV_META.width));
  const navLeft = px((width - navW) / 2);
  const navTop = px(height - insets.bottom - clamp(height * 0.045, 24, 52) - navH);

  const panelLeft = px((width - sizePx(clamp(width * (isLandscape ? 0.72 : 0.90), 320, 900))) / 2);
  const panelWidth = sizePx(clamp(width * (isLandscape ? 0.72 : 0.90), 320, 900));
  const panelTop = px(
    heroTop
      + heroH
      + clamp(height * 0.02, 16, 28)
      - clamp(height * 0.008, 8, 12)
  );
  const panelBottomGap = clamp(height * (isLandscape ? 0.05 : 0.045), 28, 42);
  const panelHeight = sizePx(Math.max(300, navTop - panelTop - panelBottomGap));

  const backSize = sizePx(
    isLandscape
      ? clamp(width * 0.085, 54, 74)
      : clamp(width * 0.14, 58, 76),
  );

  return {
    mode,
    isLandscape,
    bg,
    hero: {
      width: heroW,
      height: heroH,
      left: heroLeft,
      top: heroTop,
    },
    nav: {
      width: navW,
      height: navH,
      left: navLeft,
      top: navTop,
    },
    panel: {
      left: panelLeft,
      top: panelTop,
      width: panelWidth,
      height: panelHeight,
      radius: px(clamp(panelWidth * 0.055, 24, 34)),
      padding: px(clamp(panelWidth * 0.05, 16, 28)),
    },
    back: {
      width: backSize,
      height: backSize,
      left: px(clamp(width * 0.045, 14, 38)),
      top: px(heroTop + heroH * (isLandscape ? 0.10 : 0.16)),
      radius: px(backSize * 0.28),
    },
  };
}

function NavHitRow({ nav, onSelect }) {
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.navHitRow,
        {
          left: nav.left,
          top: nav.top,
          width: nav.width,
          height: nav.height,
        },
      ]}
    >
      <Pressable style={styles.navHit} hitSlop={12} onPress={() => onSelect('home')} accessibilityRole="button" accessibilityLabel="Главная" />
      <Pressable style={styles.navHit} hitSlop={12} onPress={() => onSelect('send')} accessibilityRole="button" accessibilityLabel="Отправить" />
      <Pressable style={styles.navHit} hitSlop={12} onPress={() => onSelect('contacts')} accessibilityRole="button" accessibilityLabel="Контакты" />
      <Pressable style={styles.navHit} hitSlop={12} onPress={() => onSelect('history')} accessibilityRole="button" accessibilityLabel="История" />
    </View>
  );
}

function ToggleButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.toggleBtn, active && styles.toggleBtnActive, pressed && styles.pressed]}>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && styles.pressed]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

function StatPill({ label }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillText}>{label}</Text>
    </View>
  );
}

function CtaPill({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ctaPill, pressed && styles.pressed]}>
      <View style={styles.ctaPillSheen} pointerEvents="none" />
      <Text style={styles.ctaPillText}>{label}</Text>
    </Pressable>
  );
}

function AgentPin({ agent, mapFrame, selected, onPress }) {
  const pinSize = selected ? px(42) : px(36);
  const bubbleW = px(70);
  const bubbleH = px(22);
  const left = px(mapFrame.left + mapFrame.width * agent.map.x - pinSize / 2);
  const top = px(mapFrame.top + mapFrame.height * agent.map.y - pinSize / 2);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.pinWrap,
        {
          left,
          top,
          width: pinSize,
          height: pinSize + bubbleH + 8,
        },
      ]}
    >
      {selected && <View style={[styles.pinPulse, { borderColor: agent.tint }]} />}
      <View style={[styles.pinBody, { width: pinSize, height: pinSize, borderColor: agent.tint, shadowColor: agent.tint }, selected && styles.pinBodySelected]}>
        <View style={[styles.pinCore, { backgroundColor: agent.tint }]}>
          <Text style={styles.pinCoreText}>{agent.initials}</Text>
        </View>
      </View>
      <View style={[styles.pinBubble, { width: bubbleW, height: bubbleH, left: px((pinSize - bubbleW) / 2) }]}>
        <Text style={styles.pinBubbleText}>{agent.name}</Text>
      </View>
    </Pressable>
  );
}

function AgentListRow({ agent, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.listRow, selected && styles.listRowSelected, pressed && styles.pressed]}>
      <View style={[styles.rowAvatar, { borderColor: agent.tint, shadowColor: agent.tint }]}>
        <View style={[styles.rowAvatarCore, { backgroundColor: agent.tint }]}>
          <Text style={styles.rowAvatarText}>{agent.initials}</Text>
        </View>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text numberOfLines={1} style={styles.rowName}>{agent.name}</Text>
          <View style={[styles.statusPill, agent.online ? styles.statusOnline : styles.statusOffline]}>
            <View style={[styles.statusDot, agent.online ? styles.statusDotOnline : styles.statusDotOffline]} />
            <Text style={styles.statusPillText}>{agent.online ? 'Онлайн' : 'Оффлайн'}</Text>
          </View>
        </View>

        <Text numberOfLines={1} style={styles.rowMeta}>{agent.city} · {agent.methods.join(' · ')}</Text>

        <View style={styles.rowBottom}>
          <Text style={styles.rowRate}>Спред {agent.spread}</Text>
          <Text style={styles.rowRating}>★ {agent.rating}</Text>
          <Text style={styles.rowDistance}>{agent.distanceKm.toFixed(1)} км</Text>
        </View>
      </View>

      <Text style={styles.rowChevron}>›</Text>
    </Pressable>
  );
}

function AgentFocusCard({ agent, note, onAction }) {
  if (!agent) {
    return (
      <View style={styles.focusCard}>
        <Text style={styles.focusTitle}>Нет активных агентов</Text>
        <Text style={styles.focusMeta}>Попробуй снять фильтр или изменить запрос.</Text>
      </View>
    );
  }

  return (
    <View style={styles.focusCard}>
      <View style={styles.focusCardGlow} pointerEvents="none" />
      <View style={styles.focusCardLine} pointerEvents="none" />

      <View style={styles.focusTopRow}>
        <View>
          <Text style={styles.focusTitle}>{agent.name}</Text>
          <Text style={styles.focusMeta}>{agent.city} · {agent.distanceKm.toFixed(1)} км · {agent.response}</Text>
        </View>
        <View style={[styles.focusStatus, agent.online ? styles.statusOnline : styles.statusOffline]}>
          <Text style={styles.focusStatusText}>{agent.online ? 'Онлайн' : 'Оффлайн'}</Text>
        </View>
      </View>

      <View style={styles.focusBadgeRow}>
        <StatPill label={`★ ${agent.rating} · ${agent.reviews}`} />
        <StatPill label={agent.kyc} />
        <StatPill label={`Резерв ${agent.reserve}`} />
      </View>

      <View style={styles.focusInfoGrid}>
        <View style={styles.focusInfoCell}>
          <Text style={styles.focusInfoLabel}>Спред</Text>
          <Text style={styles.focusInfoValue}>{agent.spread}</Text>
        </View>
        <View style={styles.focusInfoCell}>
          <Text style={styles.focusInfoLabel}>График</Text>
          <Text style={styles.focusInfoValue}>{agent.schedule}</Text>
        </View>
        <View style={styles.focusInfoCell}>
          <Text style={styles.focusInfoLabel}>Методы</Text>
          <Text style={styles.focusInfoValue}>{agent.methods.join(', ')}</Text>
        </View>
        <View style={styles.focusInfoCell}>
          <Text style={styles.focusInfoLabel}>Сделка</Text>
          <Text style={styles.focusInfoValue}>Escrow AUREA · 0%</Text>
        </View>
      </View>

      <View style={styles.focusActionsRow}>
        <Pressable onPress={() => onAction('route', agent)} style={({ pressed }) => [styles.actionPrimary, pressed && styles.pressed]}>
          <Text style={styles.actionPrimaryText}>Маршрут</Text>
        </Pressable>
        <Pressable onPress={() => onAction('chat', agent)} style={({ pressed }) => [styles.actionSecondary, pressed && styles.pressed]}>
          <Text style={styles.actionSecondaryText}>Написать</Text>
        </Pressable>
      </View>

      <View style={styles.focusActionsRow}>
        <Pressable onPress={() => onAction('buy', agent)} style={({ pressed }) => [styles.actionPrimary, styles.actionBuy, pressed && styles.pressed]}>
          <Text style={styles.actionPrimaryText}>Купить USDT</Text>
        </Pressable>
        <Pressable onPress={() => onAction('sell', agent)} style={({ pressed }) => [styles.actionSecondary, styles.actionSell, pressed && styles.pressed]}>
          <Text style={styles.actionSecondaryText}>Продать</Text>
        </Pressable>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>{note}</Text>
      </View>
    </View>
  );
}

function MapStage({ agents, selectedAgent, onSelect }) {
  const mapFrame = useMemo(
    () => ({ left: 0, top: 0, width: 1, height: 1 }),
    [],
  );

  return (
    <View style={styles.mapStageWrap}>
      <View style={styles.mapSurface}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`h-${index}`} style={[styles.gridLineH, { top: `${(index + 1) * 14}%` }]} />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={`v-${index}`} style={[styles.gridLineV, { left: `${(index + 1) * 18}%` }]} />
        ))}

        <View style={styles.userMarkerWrap}>
          <View style={styles.userMarkerPulse} />
          <View style={styles.userMarker}>
            <Text style={styles.userMarkerText}>Ты</Text>
          </View>
        </View>

        {selectedAgent && (
          <View
            pointerEvents="none"
            style={[
              styles.routeLine,
              {
                width: `${Math.max(18, selectedAgent.map.x * 72)}%`,
                bottom: `${Math.max(8, (1 - selectedAgent.map.y) * 22)}%`,
              },
            ]}
          />
        )}

        <View style={StyleSheet.absoluteFill}>
          {agents.map((agent) => (
            <View
              key={agent.id}
              style={[
                styles.pinAbsolute,
                {
                  left: `${agent.map.x * 100}%`,
                  top: `${agent.map.y * 100}%`,
                },
              ]}
            >
              <AgentPin
                agent={agent}
                mapFrame={mapFrame}
                selected={selectedAgent?.id === agent.id}
                onPress={() => onSelect(agent.id)}
              />
            </View>
          ))}
        </View>

        <View style={styles.mapLegend}>
          <Text style={styles.mapLegendText}>AUREA mesh · рейтинг · резерв · escrow</Text>
        </View>
      </View>
    </View>
  );
}

export default function PrometeiDiscoveryScreen({ onBack, onSelect }) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [activeFilters, setActiveFilters] = useState(['nearby']);
  const [selectedId, setSelectedId] = useState(AGENTS[0].id);
  const [note, setNote] = useState('Выбери Прометея на карте, чтобы быстро открыть безопасную сделку, или нажми «Стать Прометеем», чтобы подать заявку в сеть AUREA.');

  const layout = useMemo(() => {
    if (!width || !height) return null;
    return getLayout({ width, height, insets });
  }, [height, insets, width]);

  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return AGENTS.filter((agent) => {
      if (activeFilters.includes('nearby') && agent.distanceKm > 2.5) return false;
      if (activeFilters.includes('cash') && !agent.cash) return false;
      if (activeFilters.includes('sbp') && !agent.sbp) return false;
      if (activeFilters.includes('alwaysOn') && !agent.alwaysOn) return false;

      if (!normalized) return true;

      const haystack = `${agent.name} ${agent.city} ${agent.methods.join(' ')} ${agent.reserve} ${agent.kyc}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [activeFilters, query]);

  const selectedAgent = useMemo(() => {
    return filteredAgents.find((agent) => agent.id === selectedId) || filteredAgents[0] || null;
  }, [filteredAgents, selectedId]);

  useEffect(() => {
    if (selectedAgent && selectedAgent.id !== selectedId) {
      setSelectedId(selectedAgent.id);
    }
  }, [selectedAgent, selectedId]);

  const stats = useMemo(() => {
    if (!filteredAgents.length) {
      return ['0 офферов', '0 онлайн'];
    }

    const onlineCount = filteredAgents.filter((agent) => agent.online).length;

    return [
      `${filteredAgents.length} офферов`,
      `${onlineCount} онлайн`,
    ];
  }, [filteredAgents]);

  const handleFilterToggle = (key) => {
    setActiveFilters((prev) => {
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }
      return [...prev, key];
    });
  };

  const handleBecomePrometei = () => {
    setNote('Открыта анкета Прометея: укажи город, способы обмена, резерв и пройди быструю проверку профиля, чтобы принимать сделки рядом.');
  };

  const handleAction = (type, agent) => {
    if (!agent) return;

    if (type === 'route') {
      setNote(`Маршрут до ${agent.name} построен. Точка обмена: ${agent.city}, ${agent.distanceKm.toFixed(1)} км.`);
      return;
    }

    if (type === 'chat') {
      setNote(`Открыт быстрый запрос агенту ${agent.name}. Следующий шаг — подтверждение способа обмена.`);
      return;
    }

    if (type === 'buy') {
      setNote(`Создан черновик сделки: купить USDT у ${agent.name}. Платформа удерживает escrow до подтверждения оплаты.`);
      return;
    }

    if (type === 'sell') {
      setNote(`Создан черновик сделки: продать USDT агенту ${agent.name}. Следующий шаг — выбрать способ получения фиата.`);
    }
  };

  if (!layout) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <Image source={BG} resizeMode="stretch" style={[styles.abs, layout.bg]} pointerEvents="none" />
      <Image source={HERO} resizeMode="contain" style={[styles.abs, layout.hero]} pointerEvents="none" />
      <Image source={NAV_HOME} resizeMode="stretch" style={[styles.abs, layout.nav]} pointerEvents="none" />
      <NavHitRow nav={layout.nav} onSelect={onSelect} />

      <Pressable
        onPress={onBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Назад"
        style={[styles.backWrap, layout.back]}
      >
        <View style={styles.backPlate} />
        <View style={styles.backTopSheen} pointerEvents="none" />
        <View style={styles.backCornerGlow} pointerEvents="none" />
        <View style={styles.backInner}>
          <Text style={styles.backArrow}>←</Text>
        </View>
      </Pressable>

      <View style={[styles.panelOuter, layout.panel]}>
        <View style={[styles.panelInner, { borderRadius: layout.panel.radius }]}>
          <View style={styles.panelRimTop} pointerEvents="none" />
          <View style={styles.panelRimBottom} pointerEvents="none" />
          <View style={styles.topGlow} pointerEvents="none" />

          <View style={[styles.panelContent, { paddingHorizontal: layout.panel.padding, paddingTop: layout.panel.padding, paddingBottom: px(20) }]}>
            <View style={styles.titleBlock}>
              <Text style={styles.panelTitle}>Прометеи</Text>
              <Text style={styles.panelSubtitle}>Карта агентов рядом, рейтинг, резерв и безопасный старт сделки</Text>
            </View>

            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Поиск по городу, имени или способу обмена"
                placeholderTextColor="rgba(190, 223, 255, 0.45)"
                selectionColor="#8BE7FF"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.toggleRow}>
              <ToggleButton label="Карта" active={viewMode === 'map'} onPress={() => setViewMode('map')} />
              <ToggleButton label="Список" active={viewMode === 'list'} onPress={() => setViewMode('list')} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
              {FILTERS.map((item) => (
                <FilterChip
                  key={item.key}
                  label={item.label}
                  active={activeFilters.includes(item.key)}
                  onPress={() => handleFilterToggle(item.key)}
                />
              ))}
            </ScrollView>

            <View style={styles.statsRow}>
              {stats.map((item) => (
                <StatPill key={item} label={item} />
              ))}
              <CtaPill label="Стать Прометеем" onPress={handleBecomePrometei} />
            </View>

            <View style={styles.bodyArea}>
              {viewMode === 'map' ? (
                <MapStage agents={filteredAgents} selectedAgent={selectedAgent} onSelect={setSelectedId} />
              ) : (
                <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                  {filteredAgents.length ? (
                    filteredAgents.map((agent) => (
                      <AgentListRow
                        key={agent.id}
                        agent={agent}
                        selected={selectedAgent?.id === agent.id}
                        onPress={() => setSelectedId(agent.id)}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyTitle}>Ничего не найдено</Text>
                      <Text style={styles.emptyBody}>Сними фильтр или попробуй другой город/способ обмена.</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>

            <AgentFocusCard agent={selectedAgent} note={note} onAction={handleAction} />
          </View>
        </View>
      </View>
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
  navHitRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  navHit: {
    flex: 1,
  },
  backWrap: {
    position: 'absolute',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlate: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 16, 52, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(109, 219, 255, 0.70)',
    shadowColor: '#43C7FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.26,
    shadowRadius: 14,
    elevation: 8,
  },
  backTopSheen: {
    position: 'absolute',
    top: 5,
    width: '42%',
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(154, 238, 255, 0.60)',
  },
  backCornerGlow: {
    position: 'absolute',
    left: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(38, 132, 255, 0.84)',
    shadowColor: '#2E88FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.42,
    shadowRadius: 10,
  },
  backInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#F3FBFF',
    fontSize: 31,
    fontWeight: '800',
    marginLeft: -2,
  },
  panelOuter: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(96, 208, 255, 0.78)',
    backgroundColor: 'rgba(3, 9, 35, 0.24)',
    shadowColor: '#59DFFF',
    shadowOpacity: 0.30,
    shadowRadius: 19,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    overflow: 'hidden',
  },
  panelInner: {
    flex: 1,
    backgroundColor: 'rgba(5, 14, 48, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(128, 223, 255, 0.16)',
    overflow: 'hidden',
  },
  panelRimTop: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: 10,
    height: 1,
    backgroundColor: 'rgba(183, 241, 255, 0.18)',
  },
  panelRimBottom: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    bottom: 10,
    height: 1,
    backgroundColor: 'rgba(95, 206, 255, 0.10)',
  },
  topGlow: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: -22,
    height: 44,
    backgroundColor: 'rgba(116, 223, 255, 0.22)',
    borderRadius: 24,
  },
  panelContent: {
    flex: 1,
  },
  titleBlock: {
    marginBottom: 14,
  },
  panelTitle: {
    color: '#F7FDFF',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 140, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  panelSubtitle: {
    marginTop: 6,
    color: 'rgba(188, 228, 255, 0.84)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  searchWrap: {
    height: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(103, 211, 255, 0.48)',
    backgroundColor: 'rgba(4, 16, 52, 0.90)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#5CD7FF',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  searchIcon: {
    color: 'rgba(225, 245, 255, 0.85)',
    fontSize: 24,
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
    marginTop: 14,
    marginBottom: 10,
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(97, 203, 255, 0.32)',
    backgroundColor: 'rgba(6, 19, 56, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    borderColor: 'rgba(121, 232, 255, 0.78)',
    backgroundColor: 'rgba(18, 62, 118, 0.92)',
    shadowColor: '#59DFFF',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  toggleText: {
    color: 'rgba(192, 226, 255, 0.8)',
    fontWeight: '700',
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  filtersRow: {
    paddingVertical: 4,
    gap: 8,
  },
  filterChip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(97, 203, 255, 0.26)',
    backgroundColor: 'rgba(5, 15, 47, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: 'rgba(20, 83, 150, 0.9)',
    borderColor: 'rgba(122, 233, 255, 0.8)',
  },
  filterText: {
    color: 'rgba(191, 226, 255, 0.82)',
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  statPill: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(102, 206, 255, 0.22)',
    backgroundColor: 'rgba(4, 14, 45, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillText: {
    color: 'rgba(196, 229, 255, 0.82)',
    fontSize: 12,
    fontWeight: '700',
  },
  ctaPill: {
    minWidth: 166,
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(123, 233, 255, 0.82)',
    backgroundColor: 'rgba(18, 76, 139, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#59DFFF',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  ctaPillSheen: {
    position: 'absolute',
    left: '16%',
    right: '16%',
    top: 0,
    height: 1,
    backgroundColor: 'rgba(186, 243, 255, 0.42)',
  },
  ctaPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  bodyArea: {
    flex: 1,
    minHeight: 180,
  },
  mapStageWrap: {
    flex: 1,
  },
  mapSurface: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(106, 212, 255, 0.26)',
    backgroundColor: 'rgba(3, 14, 45, 0.82)',
    overflow: 'hidden',
    shadowColor: '#55CFFF',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(108, 214, 255, 0.08)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(108, 214, 255, 0.08)',
  },
  userMarkerWrap: {
    position: 'absolute',
    left: '8%',
    bottom: '12%',
    alignItems: 'center',
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(94, 225, 255, 0.25)',
    transform: [{ scale: 1.3 }],
  },
  userMarker: {
    minWidth: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 110, 187, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(146, 232, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  userMarkerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  routeLine: {
    position: 'absolute',
    left: '10%',
    height: 2,
    backgroundColor: 'rgba(98, 221, 255, 0.32)',
    borderRadius: 2,
  },
  pinAbsolute: {
    position: 'absolute',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinPulse: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    opacity: 0.5,
    transform: [{ scale: 1.1 }],
  },
  pinBody: {
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(4, 18, 56, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  pinBodySelected: {
    borderWidth: 2,
  },
  pinCore: {
    width: '78%',
    height: '78%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCoreText: {
    color: '#061527',
    fontSize: 12,
    fontWeight: '900',
  },
  pinBubble: {
    position: 'absolute',
    top: 42,
    borderRadius: 11,
    backgroundColor: 'rgba(5, 18, 56, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(102, 209, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pinBubbleText: {
    color: 'rgba(228, 247, 255, 0.9)',
    fontSize: 10,
    fontWeight: '700',
  },
  mapLegend: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    alignItems: 'center',
  },
  mapLegendText: {
    color: 'rgba(194, 229, 255, 0.62)',
    fontSize: 11,
    fontWeight: '600',
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
    gap: 10,
  },
  listRow: {
    minHeight: 88,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 209, 255, 0.16)',
    backgroundColor: 'rgba(4, 16, 50, 0.86)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRowSelected: {
    borderColor: 'rgba(117, 232, 255, 0.74)',
    backgroundColor: 'rgba(14, 52, 104, 0.9)',
  },
  rowAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  rowAvatarCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: {
    color: '#05111F',
    fontSize: 12,
    fontWeight: '900',
  },
  rowBody: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 10,
  },
  rowName: {
    flex: 1,
    color: '#F6FDFF',
    fontSize: 16,
    fontWeight: '800',
  },
  statusPill: {
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusOnline: {
    backgroundColor: 'rgba(41, 146, 94, 0.22)',
  },
  statusOffline: {
    backgroundColor: 'rgba(165, 106, 46, 0.18)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotOnline: {
    backgroundColor: '#4AFF9C',
  },
  statusDotOffline: {
    backgroundColor: '#FFB868',
  },
  statusPillText: {
    color: '#EAF8FF',
    fontSize: 11,
    fontWeight: '800',
  },
  rowMeta: {
    color: 'rgba(185, 223, 255, 0.72)',
    fontSize: 12,
    lineHeight: 16,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  rowRate: {
    color: '#8BE7FF',
    fontSize: 12,
    fontWeight: '800',
  },
  rowRating: {
    color: '#FFD977',
    fontSize: 12,
    fontWeight: '800',
  },
  rowDistance: {
    color: 'rgba(207, 236, 255, 0.8)',
    fontSize: 12,
    fontWeight: '700',
  },
  rowChevron: {
    color: 'rgba(215, 241, 255, 0.76)',
    fontSize: 28,
    marginLeft: 10,
  },
  focusCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(118, 230, 255, 0.34)',
    backgroundColor: 'rgba(4, 18, 56, 0.92)',
    shadowColor: '#59DFFF',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
  },
  focusCardGlow: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(78, 182, 255, 0.08)',
  },
  focusCardLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 0,
    height: 2,
    backgroundColor: 'rgba(153, 239, 255, 0.34)',
  },
  focusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  focusTitle: {
    color: '#F7FDFF',
    fontSize: 18,
    fontWeight: '900',
  },
  focusMeta: {
    color: 'rgba(190, 226, 255, 0.74)',
    fontSize: 12,
    marginTop: 4,
  },
  focusStatus: {
    minWidth: 74,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  focusStatusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  focusBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  focusInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 10,
  },
  focusInfoCell: {
    width: '47%',
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(104, 210, 255, 0.16)',
    backgroundColor: 'rgba(7, 22, 63, 0.74)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  focusInfoLabel: {
    color: 'rgba(176, 220, 255, 0.6)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  focusInfoValue: {
    color: '#EAF9FF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 17,
  },
  focusActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(121, 232, 255, 0.78)',
    backgroundColor: 'rgba(27, 96, 174, 0.96)',
  },
  actionBuy: {
    backgroundColor: 'rgba(13, 118, 173, 0.96)',
  },
  actionSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(101, 208, 255, 0.26)',
    backgroundColor: 'rgba(6, 22, 61, 0.92)',
  },
  actionSell: {
    backgroundColor: 'rgba(8, 29, 78, 0.92)',
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  actionSecondaryText: {
    color: '#DDF6FF',
    fontSize: 13,
    fontWeight: '800',
  },
  noteBox: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(3, 13, 40, 0.80)',
    borderWidth: 1,
    borderColor: 'rgba(98, 205, 255, 0.16)',
  },
  noteText: {
    color: 'rgba(200, 232, 255, 0.84)',
    fontSize: 12,
    lineHeight: 17,
  },
  emptyState: {
    minHeight: 160,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(101, 208, 255, 0.14)',
    backgroundColor: 'rgba(6, 22, 61, 0.76)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#F7FDFF',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: 'rgba(189, 227, 255, 0.74)',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.92,
  },
});
