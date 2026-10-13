import { StrictMode, Suspense, lazy, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Box, Button, ChakraProvider, Container, DialogBackdrop, DialogBody,
  DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader,
  DialogPositioner, DialogRoot, DialogTitle, Flex, Heading, Text, defaultSystem,
} from "@chakra-ui/react";
import { parseWheelCsv } from "./csv";
import { PRESET_GAME_IDS, PRESET_WHEEL_IDS, PRESET_WHEELS } from "./presets";
import {
  findGame, loadStoredState, makeId, saveStoredState, visibleWheels,
} from "./storage";
import type { Game, StoredState } from "./types";
import "./index.css";
import "./fireworks.css";

const Wheel = lazy(() => import("./Wheel").then((module) => ({ default: module.Wheel })));
const NameEntries = lazy(() => import("./NameEntries").then((module) => ({ default: module.NameEntries })));

function App() {
  const [state, setState] = useState<StoredState>(loadStoredState);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [winnerOpen, setWinnerOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const wheels = useMemo(() => visibleWheels(state), [state]);
  const activeWheel = wheels.find((wheel) => wheel.id === state.activeWheelId) || wheels[0];
  const winner = winnerId ? findGame(wheels, winnerId)?.game || null : null;

  useEffect(() => {
    saveStoredState(state);
    if (!wheels.some((wheel) => wheel.id === state.activeWheelId) && wheels[0]) {
      setState((current) => ({ ...current, activeWheelId: wheels[0].id }));
    }
  }, [state, wheels]);

  useEffect(() => {
    document.title = activeWheel ? `${activeWheel.name} | Learning Games Wheel` : "Learning Games Wheel";
  }, [activeWheel]);

  const updateState = (updater: (current: StoredState) => StoredState) => {
    setState((current) => updater(current));
  };

  const announceWinner = (gameId: string) => {
    setWinnerId(gameId);
    setWinnerOpen(true);
    setInstructionsOpen(false);
    const fireworks = document.createElement("div");
    fireworks.className = "pyro";
    fireworks.innerHTML = '<div class="before"></div><div class="after"></div>';
    document.body.appendChild(fireworks);
    window.setTimeout(() => fireworks.remove(), 4000);
  };

  const hideGame = (wheelId: string, gameId: string) => {
    updateState((current) => ({
      ...current,
      hiddenGameIdsByWheelId: {
        ...current.hiddenGameIdsByWheelId,
        [wheelId]: [...new Set([...(current.hiddenGameIdsByWheelId[wheelId] || []), gameId])],
      },
    }));
  };

  const restoreWheel = (wheelId: string) => {
    updateState((current) => {
      const hidden = { ...current.hiddenGameIdsByWheelId };
      delete hidden[wheelId];
      return { ...current, hiddenGameIdsByWheelId: hidden };
    });
  };

  const addWheel = (name: string) => {
    const wheel = { id: makeId(), name: name.trim(), games: [] as Game[], custom: true };
    if (!wheel.name) return;
    updateState((current) => ({
      ...current,
      customWheels: [...current.customWheels, wheel],
      activeWheelId: wheel.id,
    }));
  };

  const deleteWheel = (wheelId: string) => {
    if (PRESET_WHEEL_IDS.has(wheelId)) return;
    updateState((current) => {
      const remaining = current.customWheels.filter((wheel) => wheel.id !== wheelId);
      const extraGamesByWheelId = { ...current.extraGamesByWheelId };
      const hiddenGameIdsByWheelId = { ...current.hiddenGameIdsByWheelId };
      delete extraGamesByWheelId[wheelId];
      delete hiddenGameIdsByWheelId[wheelId];
      return {
        ...current,
        customWheels: remaining,
        extraGamesByWheelId,
        hiddenGameIdsByWheelId,
        activeWheelId: current.activeWheelId === wheelId ? (remaining[0]?.id || "preset-number-games") : current.activeWheelId,
      };
    });
  };

  const addGame = (wheelId: string, title: string, instructions: string) => {
    const game: Game = { id: makeId(), title: title.trim(), instructions: instructions.trim(), custom: true };
    if (!game.title) return;
    updateState((current) => {
      if (PRESET_WHEEL_IDS.has(wheelId)) {
        return {
          ...current,
          extraGamesByWheelId: {
            ...current.extraGamesByWheelId,
            [wheelId]: [...(current.extraGamesByWheelId[wheelId] || []), game],
          },
        };
      }
      return {
        ...current,
        customWheels: current.customWheels.map((wheel) =>
          wheel.id === wheelId ? { ...wheel, games: [...wheel.games, game] } : wheel
        ),
      };
    });
  };

  const updateGame = (wheelId: string, gameId: string, title: string, instructions: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle || PRESET_GAME_IDS.has(gameId)) return;
    updateState((current) => {
      const patch = (game: Game) => game.id === gameId ? { ...game, title: cleanTitle, instructions: instructions.trim() } : game;
      if (PRESET_WHEEL_IDS.has(wheelId)) {
        return {
          ...current,
          extraGamesByWheelId: {
            ...current.extraGamesByWheelId,
            [wheelId]: (current.extraGamesByWheelId[wheelId] || []).map(patch),
          },
        };
      }
      return {
        ...current,
        customWheels: current.customWheels.map((wheel) =>
          wheel.id === wheelId ? { ...wheel, games: wheel.games.map(patch) } : wheel
        ),
      };
    });
  };

  const deleteGame = (wheelId: string, gameId: string) => {
    if (PRESET_GAME_IDS.has(gameId)) {
      hideGame(wheelId, gameId);
      return;
    }
    updateState((current) => {
      if (PRESET_WHEEL_IDS.has(wheelId)) {
        return {
          ...current,
          extraGamesByWheelId: {
            ...current.extraGamesByWheelId,
            [wheelId]: (current.extraGamesByWheelId[wheelId] || []).filter((game) => game.id !== gameId),
          },
        };
      }
      return {
        ...current,
        customWheels: current.customWheels.map((wheel) =>
          wheel.id === wheelId ? { ...wheel, games: wheel.games.filter((game) => game.id !== gameId) } : wheel
        ),
      };
    });
  };

  const importWheels = (csv: string) => {
    const imported = parseWheelCsv(csv);
    if (!imported.length) return 0;
    updateState((current) => {
      const next = { ...current, extraGamesByWheelId: { ...current.extraGamesByWheelId }, customWheels: [...current.customWheels] };
      imported.forEach((item) => {
        const matchingPreset = PRESET_WHEELS.find((wheel) => wheel.name.toLowerCase() === item.name.toLowerCase());
        const matchingCustom = next.customWheels.find((wheel) => wheel.name.toLowerCase() === item.name.toLowerCase());
        const games = item.games.map((game) => ({
          id: makeId(),
          title: game.title,
          instructions: game.instructions,
          custom: true,
        }));
        if (matchingPreset) {
          next.extraGamesByWheelId[matchingPreset.id] = [
            ...(next.extraGamesByWheelId[matchingPreset.id] || []),
            ...games,
          ];
        } else if (matchingCustom) {
          next.customWheels = next.customWheels.map((wheel) =>
            wheel.id === matchingCustom.id ? { ...wheel, games: [...wheel.games, ...games] } : wheel
          );
        } else {
          const wheel = { id: makeId(), name: item.name, games, custom: true };
          next.customWheels.push(wheel);
          next.activeWheelId = wheel.id;
        }
      });
      return next;
    });
    return imported.reduce((total, item) => total + item.games.length, 0);
  };

  return (
    <Box as="main" minH="100vh">
      <Container maxW="1500px" py={{ base: 4, md: 7 }}>
        <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl" }} color="#24463D">
          🎡 Learning Games Wheel
        </Heading>
        <Text textAlign="center" color="gray.600" mt={2} maxW="720px" mx="auto">
          Spin a subject wheel to pick a home-learning game. Built-in games stay on the wheel. Anything you add is saved in this browser until you clear the site data.
        </Text>
        <Text textAlign="center" fontWeight="semibold" color="#24463D" mt={4} mb={7}>
          {activeWheel?.name}
        </Text>
        <Flex width="full" direction={{ base: "column", lg: "row" }} gap={6} align="start">
          <Box width={{ base: "100%", lg: "55%" }} position={{ lg: "sticky" }} top={4}>
            <Suspense fallback={<Text textAlign="center">Loading the wheel…</Text>}>
              <Wheel games={activeWheel?.games || []} onSelectWinner={announceWinner} />
            </Suspense>
          </Box>
          <Box width={{ base: "100%", lg: "45%" }}>
            <Suspense fallback={<Text>Loading the game list…</Text>}>
            <NameEntries
              state={state}
              wheels={wheels}
              activeWheelId={activeWheel?.id || ""}
              selectWheel={(id) => updateState((current) => ({ ...current, activeWheelId: id }))}
              addWheel={addWheel}
              deleteWheel={deleteWheel}
              addGame={addGame}
              updateGame={updateGame}
              deleteGame={deleteGame}
              restoreWheel={restoreWheel}
              importWheels={importWheels}
            />
            </Suspense>
          </Box>
        </Flex>
      </Container>

      <DialogRoot open={winnerOpen} onOpenChange={(details: { open: boolean }) => setWinnerOpen(details.open)}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader><DialogTitle>Today’s game</DialogTitle></DialogHeader>
            <DialogBody fontSize="2xl" fontWeight="bold" textAlign="center">
              🎉 {winner?.title || "Spin again"} 🎉
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setWinnerOpen(false)}>Close</Button>
              <Button bg="#2F7D6D" color="white" onClick={() => setInstructionsOpen(true)} disabled={!winner}>
                Read instructions
              </Button>
              <Button bg="#EAEAEA" color="#333" onClick={() => {
                if (winner && activeWheel) hideGame(activeWheel.id, winner.id);
                setWinnerOpen(false);
              }}>Remove from wheel</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <DialogRoot open={instructionsOpen} onOpenChange={(details: { open: boolean }) => setInstructionsOpen(details.open)}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader><DialogTitle>{winner?.title || "Instructions"}</DialogTitle></DialogHeader>
            <DialogBody whiteSpace="pre-wrap" lineHeight="1.7">
              {winner?.instructions?.trim()
                || "No instructions yet. Add some with the form on the right, then download a CSV backup so you can restore them later."}
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setInstructionsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><ChakraProvider value={defaultSystem}><App /></ChakraProvider></StrictMode>
);
