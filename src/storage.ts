import { PRESET_WHEELS } from "./presets";
import type { Game, StoredState, Wheel } from "./types";

export const STORAGE_KEY = "learning-games-wheel-v2";
const LEGACY_KEY = "learning-game-wheels-v1";
const LEGACY_ACTIVE_KEY = "learning-game-active-wheel-v1";

export const makeId = () => `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const clonePresets = (): Wheel[] =>
  PRESET_WHEELS.map((wheel) => ({
    ...wheel,
    games: wheel.games.map((game) => ({ ...game })),
  }));

export function emptyStoredState(): StoredState {
  return {
    customWheels: [],
    extraGamesByWheelId: {},
    hiddenGameIdsByWheelId: {},
    activeWheelId: PRESET_WHEELS[0].id,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asGame(value: unknown, customFallback: boolean): Game | null {
  if (!isRecord(value) || typeof value.title !== "string") return null;
  const title = value.title.trim();
  if (!title) return null;
  return {
    id: typeof value.id === "string" && value.id ? value.id : makeId(),
    title,
    instructions: typeof value.instructions === "string" ? value.instructions : "",
    custom: typeof value.custom === "boolean" ? value.custom : customFallback,
  };
}

function asWheel(value: unknown, customFallback: boolean): Wheel | null {
  if (!isRecord(value) || typeof value.name !== "string") return null;
  const name = value.name.trim();
  if (!name) return null;
  const games = Array.isArray(value.games)
    ? value.games.map((game) => asGame(game, true)).filter((game): game is Game => Boolean(game))
    : [];
  return {
    id: typeof value.id === "string" && value.id ? value.id : makeId(),
    name,
    games,
    custom: typeof value.custom === "boolean" ? value.custom : customFallback,
  };
}

function migrateLegacy(): StoredState | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const customWheels: Wheel[] = [];
    const extraGamesByWheelId: Record<string, Game[]> = {};
    parsed.forEach((item: { id?: string; name?: string; entries?: string[] }) => {
      const name = item?.name?.trim();
      const entries = Array.isArray(item?.entries) ? item.entries : [];
      if (!name) return;
      const games = entries
        .map((title) => asGame({ title, custom: true }, true))
        .filter((game): game is Game => Boolean(game));
      const matchingPreset = PRESET_WHEELS.find((wheel) => wheel.name.toLowerCase() === name.toLowerCase());
      if (matchingPreset) {
        extraGamesByWheelId[matchingPreset.id] = games.filter(
          (game) => !matchingPreset.games.some((preset) => preset.title.toLowerCase() === game.title.toLowerCase())
        );
      } else {
        customWheels.push({ id: makeId(), name, games, custom: true });
      }
    });
    return {
      customWheels,
      extraGamesByWheelId,
      hiddenGameIdsByWheelId: {},
      activeWheelId: localStorage.getItem(LEGACY_ACTIVE_KEY) || PRESET_WHEELS[0].id,
    };
  } catch {
    return null;
  }
}

export function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isRecord(parsed)) {
        const customWheels = Array.isArray(parsed.customWheels)
          ? parsed.customWheels.map((wheel) => asWheel(wheel, true)).filter((wheel): wheel is Wheel => Boolean(wheel))
          : [];
        const extraGamesByWheelId: Record<string, Game[]> = {};
        if (isRecord(parsed.extraGamesByWheelId)) {
          Object.entries(parsed.extraGamesByWheelId).forEach(([wheelId, games]) => {
            extraGamesByWheelId[wheelId] = Array.isArray(games)
              ? games.map((game) => asGame(game, true)).filter((game): game is Game => Boolean(game))
              : [];
          });
        }
        const hiddenGameIdsByWheelId: Record<string, string[]> = {};
        if (isRecord(parsed.hiddenGameIdsByWheelId)) {
          Object.entries(parsed.hiddenGameIdsByWheelId).forEach(([wheelId, ids]) => {
            hiddenGameIdsByWheelId[wheelId] = Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
          });
        }
        return {
          customWheels,
          extraGamesByWheelId,
          hiddenGameIdsByWheelId,
          activeWheelId: typeof parsed.activeWheelId === "string" ? parsed.activeWheelId : PRESET_WHEELS[0].id,
        };
      }
    }
  } catch {
    // Fall through to legacy or defaults.
  }
  return migrateLegacy() || emptyStoredState();
}

export function saveStoredState(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function visibleWheels(state: StoredState): Wheel[] {
  const presets = clonePresets().map((wheel) => {
    const hidden = new Set(state.hiddenGameIdsByWheelId[wheel.id] || []);
    const extras = (state.extraGamesByWheelId[wheel.id] || []).filter((game) => !hidden.has(game.id));
    return {
      ...wheel,
      games: [...wheel.games.filter((game) => !hidden.has(game.id)), ...extras],
    };
  });
  const custom = state.customWheels.map((wheel) => {
    const hidden = new Set(state.hiddenGameIdsByWheelId[wheel.id] || []);
    return { ...wheel, games: wheel.games.filter((game) => !hidden.has(game.id)) };
  });
  return [...presets, ...custom];
}

export function customContent(state: StoredState): Wheel[] {
  const extras = Object.entries(state.extraGamesByWheelId)
    .map(([wheelId, games]) => {
      const preset = PRESET_WHEELS.find((wheel) => wheel.id === wheelId);
      if (!preset || !games.length) return null;
      return { id: preset.id, name: preset.name, games, custom: false };
    })
    .filter((wheel): wheel is Wheel => Boolean(wheel));
  return [...extras, ...state.customWheels];
}

export function findGame(wheels: Wheel[], gameId: string) {
  for (const wheel of wheels) {
    const match = wheel.games.find((game) => game.id === gameId);
    if (match) return { wheel, game: match };
  }
  return null;
}
