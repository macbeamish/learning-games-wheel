import { useRef, useState, type CSSProperties } from "react";
import {
  Box, Button, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent,
  DialogFooter, DialogHeader, DialogPositioner, DialogRoot, DialogTitle, Flex, Heading, Text,
} from "@chakra-ui/react";
import { Copy, Download, FileUp, Plus, RotateCcw, Save, Trash } from "lucide-react";
import { downloadCsv, wheelsToCsv } from "./csv";
import { customContent } from "./storage";
import type { Game, StoredState, Wheel } from "./types";

interface NameEntriesProps {
  state: StoredState;
  wheels: Wheel[];
  activeWheelId: string;
  selectWheel: (id: string) => void;
  addWheel: (name: string) => void;
  deleteWheel: (wheelId: string) => void;
  addGame: (wheelId: string, title: string, instructions: string) => void;
  updateGame: (wheelId: string, gameId: string, title: string, instructions: string) => void;
  deleteGame: (wheelId: string, gameId: string) => void;
  restoreWheel: (wheelId: string) => void;
  importWheels: (csv: string) => number;
}

export const AI_CSV_PROMPT = `Create home-learning games for young children. Reply with CSV only, using this exact header:

wheel,title,instructions

Rules:
- Each row is one game.
- "wheel" is the subject name. Games that share a wheel name go on the same spinner.
- "title" is a short game name.
- "instructions" are 2–5 sentences a parent can follow at home with everyday materials.
- Put instructions in double quotes. If a quote is needed inside them, double it ("").
- No markdown, tables, or extra commentary. Return only the CSV.

Example:
wheel,title,instructions
Rainy-day games,Puddle Jump,"Count puddles on a walk, then jump in the biggest safe one."
Kitchen maths,Spoon Weigh,"Compare two kitchen items and say which feels heavier. Check by placing them in your hands."`;

const controlStyle = { background: "#F2EFE9", color: "#24332E", borderRadius: "8px" };
const fieldStyle: CSSProperties = {
  width: "100%",
  padding: 9,
  border: "1px solid #CCC",
  borderRadius: 8,
  fontFamily: "Arial, sans-serif",
  fontSize: 14,
};

export const NameEntries = ({
  state, wheels, activeWheelId, selectWheel, addWheel,
  deleteWheel, addGame, updateGame, deleteGame, restoreWheel, importWheels,
}: NameEntriesProps) => {
  const activeWheel = wheels.find((wheel) => wheel.id === activeWheelId) || wheels[0];
  const [newWheelName, setNewWheelName] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [gameInstructions, setGameInstructions] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [message, setMessage] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [previewGame, setPreviewGame] = useState<Game | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const promptInput = useRef<HTMLTextAreaElement>(null);
  const customWheels = customContent(state);
  const hasCustomContent = customWheels.some((wheel) => wheel.games.length) || state.customWheels.length > 0;

  const resetForm = () => {
    setGameTitle("");
    setGameInstructions("");
    setEditingId(null);
  };

  const submitGame = () => {
    if (!activeWheel || !gameTitle.trim()) return;
    if (editingId) {
      updateGame(activeWheel.id, editingId, gameTitle, gameInstructions);
      setMessage("Saved your game.");
    } else {
      addGame(activeWheel.id, gameTitle, gameInstructions);
      setMessage(`Added “${gameTitle.trim()}” to ${activeWheel.name}.`);
    }
    resetForm();
  };

  const startEdit = (game: Game) => {
    if (!game.custom) return;
    setEditingId(game.id);
    setGameTitle(game.title);
    setGameInstructions(game.instructions);
  };

  const handleImport = (csv: string) => {
    const count = importWheels(csv);
    setMessage(count ? `Imported ${count} game${count === 1 ? "" : "s"}. They are saved in this browser.` : "No games were found in that CSV.");
  };

  const exportCustom = () => {
    if (!hasCustomContent) {
      setMessage("You have not added any of your own games yet.");
      return;
    }
    downloadCsv("my-learning-games.csv", wheelsToCsv(customWheels.filter((wheel) => wheel.games.length || wheel.custom)));
    setMessage("Downloaded a CSV of the wheels and games you added. Keep this file so you can import it later.");
  };

  const exportEverything = () => {
    downloadCsv("learning-games-backup.csv", wheelsToCsv(wheels));
    setMessage("Downloaded a backup of every game currently on the wheels.");
  };

  return (
    <>
    <Box width="full" borderRadius="xl" boxShadow="xl" bg="white" borderWidth="1px" borderColor="gray.200" p={{ base: 4, md: 6 }}>
      <Heading size="md" mb={3}>Choose a wheel</Heading>
      <Flex gap={2} mb={4} wrap="wrap">
        {wheels.map((wheel) => (
          <Button key={wheel.id} size="sm" onClick={() => selectWheel(wheel.id)}
            bg={wheel.id === activeWheelId ? "#2F7D6D" : "#F2EFE9"}
            color={wheel.id === activeWheelId ? "white" : "#24332E"}>
            {wheel.name} ({wheel.games.length}){wheel.custom ? " · yours" : ""}
          </Button>
        ))}
      </Flex>

      <Box mb={5} p={4} borderRadius="lg" bg="#F8F7F3" border="1px solid #E5DDCE">
        <Heading size="sm" mb={2}>Add a new wheel</Heading>
        <Text fontSize="sm" color="gray.600" mb={3}>Create a subject of your own, then add games to it. It stays in this browser.</Text>
        <Flex gap={2} wrap="wrap">
          <input aria-label="New wheel name" value={newWheelName}
            onChange={(event) => setNewWheelName(event.target.value)} placeholder="e.g. Rainy-day games"
            style={{ ...fieldStyle, flex: 1, minWidth: 180 }} />
          <Button {...controlStyle} onClick={() => { addWheel(newWheelName); setNewWheelName(""); setMessage("Created your wheel."); }} disabled={!newWheelName.trim()}>
            <Plus size={17} /> Create wheel
          </Button>
          <Button {...controlStyle} onClick={() => restoreWheel(activeWheelId)}>
            <RotateCcw size={17} /> Restore hidden games
          </Button>
          {activeWheel?.custom && (
            <Button {...controlStyle} onClick={() => {
              if (window.confirm(`Delete the “${activeWheel.name}” wheel and its games from this browser?`)) {
                deleteWheel(activeWheel.id);
                setMessage("Deleted your wheel.");
              }
            }}><Trash size={17} /> Delete this wheel</Button>
          )}
        </Flex>
      </Box>

      <Heading size="md" mb={2}>Games on this wheel</Heading>
      {activeWheel?.description && (
        <Text fontSize="sm" color="gray.700" mb={2}>{activeWheel.description}</Text>
      )}
      <Text fontSize="sm" color="gray.600" mb={3}>
        Built-in games cannot be overwritten. You can hide them after a spin, or add your own underneath.
      </Text>
      <Box mb={5}>
        {activeWheel?.games.length ? activeWheel.games.map((game) => (
          <Flex key={game.id} gap={2} py={2} borderBottom="1px solid #EEE" align="start" justify="space-between">
            <Box>
              <Text fontWeight="semibold">{game.title}</Text>
              <Text fontSize="sm" color="gray.600">
                {game.custom ? "Added by you" : "Built-in"}{game.instructions ? " · has instructions" : " · no instructions yet"}
              </Text>
            </Box>
            <Flex gap={1} wrap="wrap" justify="flex-end">
              <Button size="xs" {...controlStyle} onClick={() => setPreviewGame(game)}>Read instructions</Button>
              {game.custom && (
                <Button size="xs" {...controlStyle} onClick={() => startEdit(game)}>Edit</Button>
              )}
              <Button size="xs" {...controlStyle} onClick={() => deleteGame(activeWheel.id, game.id)}>
                {game.custom ? "Delete" : "Hide"}
              </Button>
            </Flex>
          </Flex>
        )) : <Text color="gray.500">This wheel is empty. Add a game below, or restore hidden games.</Text>}
      </Box>

      <Box mb={6} p={4} borderRadius="lg" bg="#F5F1E8" border="1px solid #E5DDCE">
        <Heading size="sm" mb={1}>{editingId ? "Edit your game" : "Add a game"}</Heading>
        <Text fontSize="sm" color="gray.600" mb={3}>
          Title and instructions are saved on this device. Download a CSV backup if you might switch browsers.
        </Text>
        <input aria-label="Game title" value={gameTitle} onChange={(event) => setGameTitle(event.target.value)}
          placeholder="Game title" style={{ ...fieldStyle, marginBottom: 8 }} />
        <textarea aria-label="Game instructions" value={gameInstructions}
          onChange={(event) => setGameInstructions(event.target.value)}
          placeholder={"What you need:\n\nHow to play:\n1. ..."}
          style={{ ...fieldStyle, minHeight: 140, resize: "vertical" }} />
        <Flex gap={2} mt={3} wrap="wrap">
          <Button bg="#2F7D6D" color="white" onClick={submitGame} disabled={!gameTitle.trim()}>
            <Save size={16} /> {editingId ? "Save game" : "Add to this wheel"}
          </Button>
          {editingId && <Button {...controlStyle} onClick={resetForm}>Cancel</Button>}
        </Flex>
      </Box>

      <Box p={4} borderRadius="lg" bg="#EEF6F3" border="1px solid #CDE3DC">
        <Heading size="sm" mb={1}>Keep a backup</Heading>
        <Text fontSize="sm" color="gray.700" mb={3}>
          Games you add live in this browser’s storage, not on a server. If you clear cookies or site data, those extras disappear.
          Download a CSV of everything you created, then use Import later to put it back.
        </Text>
        <Flex gap={2} wrap="wrap" mb={4}>
          <Button bg="#2F7D6D" color="white" onClick={exportCustom}><Download size={16} /> Download my games</Button>
          <Button {...controlStyle} onClick={exportEverything}><Download size={16} /> Download all wheels</Button>
        </Flex>
        <textarea aria-label="CSV import" value={csvText} onChange={(event) => setCsvText(event.target.value)}
          placeholder={'wheel,title,instructions\nRainy-day games,Puddle Jump,"Jump in puddles and count them."'}
          style={{ ...fieldStyle, minHeight: 110, resize: "vertical", fontFamily: "monospace", fontSize: 13, background: "white" }} />
        <input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const text = await file.text();
          setCsvText(text);
          handleImport(text);
          event.target.value = "";
        }} />
        <Flex gap={2} mt={3} wrap="wrap">
          <Button bg="#2F7D6D" color="white" onClick={() => handleImport(csvText)} disabled={!csvText.trim()}>Import pasted CSV</Button>
          <Button {...controlStyle} onClick={() => fileInput.current?.click()}><FileUp size={17} /> Upload CSV</Button>
        </Flex>
        {message && <Text mt={3} fontSize="sm" fontWeight="medium">{message}</Text>}

        <Box mt={5} p={3} borderRadius="md" bg="white" border="1px dashed #CDE3DC">
          <Text fontSize="sm" fontWeight="semibold" mb={1}>Want an AI to invent games?</Text>
          <Text fontSize="sm" color="gray.700" mb={3}>
            Copy this prompt into ChatGPT, Claude or another model. Paste the CSV it returns above, then import.
          </Text>
          <textarea
            ref={promptInput}
            aria-label="AI prompt for CSV games"
            readOnly
            value={AI_CSV_PROMPT}
            onFocus={(event) => event.currentTarget.select()}
            style={{
              ...fieldStyle, background: "#F8F7F3", minHeight: 220, whiteSpace: "pre-wrap",
              fontFamily: "monospace", fontSize: 12, marginBottom: 12,
            }}
          />
          <Button {...controlStyle} size="sm" onClick={async () => {
            const markCopied = () => {
              setCopiedPrompt(true);
              window.setTimeout(() => setCopiedPrompt(false), 2000);
            };
            try {
              await navigator.clipboard.writeText(AI_CSV_PROMPT);
              markCopied();
              return;
            } catch {
              const area = promptInput.current;
              if (!area) return;
              area.focus();
              area.select();
              const copied = document.execCommand("copy");
              if (copied) markCopied();
              else setMessage("Select the prompt text and copy it with Ctrl+C.");
            }
          }}>
            <Copy size={16} /> {copiedPrompt ? "Copied" : "Copy AI prompt"}
          </Button>
        </Box>
      </Box>
    </Box>

    <DialogRoot open={Boolean(previewGame)} onOpenChange={(details: { open: boolean }) => { if (!details.open) setPreviewGame(null); }}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader><DialogTitle>{previewGame?.title || "Instructions"}</DialogTitle></DialogHeader>
          <DialogBody whiteSpace="pre-wrap" lineHeight="1.7">
            {previewGame?.instructions?.trim()
              || "No instructions yet. Add some with the form below, then download a CSV backup so you can restore them later."}
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setPreviewGame(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
    </>
  );
};
