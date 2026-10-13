# Learning Games Wheel

A spinner for daily home-learning games. Pick a subject wheel, spin, then read the instructions for that game. Parents can add their own wheels and games, which stay in the current browser until the site data is cleared.

This is a customised fork of [kilee1230/wheel-of-names](https://github.com/kilee1230/wheel-of-names), used under the MIT License.

## Use it on the web

After GitHub Pages is enabled, the public site is:

https://macbeamish.github.io/learning-games-wheel/

Built-in subject wheels (number, letter, talking, geography, science, logic) are included. Anything you add is stored only in your browser, not on a server.

## Add your own games

1. Create a wheel, or stay on a built-in subject.
2. Enter a game title and instructions, then click **Add to this wheel**.
3. Click **Download my games** to save a CSV of everything you created.
4. If you change computers or clear the browser, use **Upload CSV** or paste that file back in.

A full backup of every game currently on the wheels is available as **Download all wheels**.

## CSV format

```csv
wheel,title,instructions
Number games,Number-Line Jump,"Make a number line on the floor. Jump to the answer."
Rainy-day games,Puddle Jump,"Count puddles, then jump in the biggest one."
```

The first column may also be named `category` or `subject`. The second may be named `game`, `name` or `entry`. Duplicate and empty titles are removed.

An example file is at [`examples/learning-games.csv`](examples/learning-games.csv).

## Local development

```bash
corepack enable
pnpm install
pnpm dev
```

## Run with Docker Compose

```bash
docker compose up --build -d
```

Open <http://localhost:8080>. Stop it with `docker compose down`.

## Storage

The app stores extra wheels and games in the current browser’s `localStorage`. There is no account or database. Clearing cookies or site data removes those extras, so keep the downloaded CSV as a backup.

## Licence

The original project and this derivative are licensed under the MIT License. See [`LICENSE`](LICENSE).
