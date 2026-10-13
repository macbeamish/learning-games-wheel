import type { Game, Wheel } from "./types";

const uniqueTitles = (games: Game[]) => {
  const seen = new Set<string>();
  return games.filter((game) => {
    const key = game.title.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function escapeCsv(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function wheelsToCsv(wheels: Wheel[]) {
  const header = "wheel,title,instructions";
  const lines = wheels.flatMap((wheel) =>
    wheel.games.map((game) =>
      [wheel.name, game.title, game.instructions].map(escapeCsv).join(",")
    )
  );
  return [header, ...lines].join("\n");
}

export function parseWheelCsv(input: string): Array<{ name: string; games: Array<{ title: string; instructions: string }> }> {
  const rows = parseCsvRows(input);
  if (!rows.length) return [];
  const header = rows[0].map((cell) => cell.toLowerCase());
  const looksLikeHeader = header.some((cell) =>
    ["wheel", "category", "subject", "title", "game", "name", "entry", "instructions"].includes(cell)
  );
  const wheelColumn = header.findIndex((cell) => ["wheel", "category", "subject"].includes(cell));
  const titleColumn = header.findIndex((cell) => ["title", "game", "name", "entry"].includes(cell));
  const instructionsColumn = header.findIndex((cell) => ["instructions", "instruction", "how to play", "howto"].includes(cell));
  const dataRows = looksLikeHeader ? rows.slice(1) : rows;
  const grouped = new Map<string, Array<{ title: string; instructions: string }>>();

  const addGame = (wheelName: string, title: string, instructions: string) => {
    const cleanTitle = title.trim();
    const cleanWheel = wheelName.trim() || "Imported games";
    if (!cleanTitle) return;
    const current = grouped.get(cleanWheel) || [];
    current.push({ title: cleanTitle, instructions: instructions.trim() });
    grouped.set(cleanWheel, current);
  };

  if (wheelColumn >= 0) {
    dataRows.forEach((cells) => {
      const title = titleColumn >= 0 ? cells[titleColumn] : cells.find((cell, index) => index !== wheelColumn && index !== instructionsColumn) || "";
      const instructions = instructionsColumn >= 0 ? cells[instructionsColumn] || "" : "";
      addGame(cells[wheelColumn] || "Imported games", title, instructions);
    });
  } else {
    dataRows.forEach((cells) => {
      const title = titleColumn >= 0 ? cells[titleColumn] : cells[0];
      const instructions = instructionsColumn >= 0 ? cells[instructionsColumn] || "" : cells.slice(1).join("\n");
      addGame("Imported games", title, instructions);
    });
  }

  return [...grouped.entries()].map(([name, games]) => ({
    name,
    games: uniqueTitles(games.map((entry, index) => ({
      id: `parsed-${index}`,
      title: entry.title,
      instructions: entry.instructions,
      custom: true,
    }))).map(({ title, instructions }) => ({ title, instructions })),
  }));
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
