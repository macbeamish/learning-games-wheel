import type { Game, Wheel } from "./types";

const game = (id: string, title: string, instructions: string): Game => ({
  id,
  title,
  instructions: instructions.trim(),
  custom: false,
});

const wheel = (id: string, name: string, games: Game[]): Wheel => ({
  id,
  name,
  games,
  custom: false,
});

export const PRESET_WHEELS: Wheel[] = [
  wheel("preset-number-games", "Number games", [
    game(
      "preset-number-line-jump",
      "Number-Line Jump",
      `What you need: Masking tape or chalk, and a marker.

How to play:
1. Make a number line on the floor (0 to 10, or 0 to 20).
2. Call out a number, or a simple sum such as 3 + 2.
3. Your child jumps to the answer and says it out loud.

Make it easier: Start with 0–5 and call numbers only.
Make it harder: Use larger numbers, take-aways, or “jump 2 more than 7”.`
    ),
    game(
      "preset-beanbag-answers",
      "Beanbag Answers",
      `What you need: A beanbag or soft toy, and paper numbers spread on the floor.

How to play:
1. Spread number cards in a space where it is safe to throw.
2. Ask a maths question, such as “What is 4 + 1?”
3. Your child throws the beanbag onto the matching number and explains the answer.

Make it easier: Hold up a number of fingers to match.
Make it harder: Use two-step questions, such as “double 3, then add 1”.`
    ),
    game(
      "preset-maths-obstacle-course",
      "Maths Obstacle Course",
      `What you need: Cushions, chairs, or garden objects to crawl under, hop over, or walk around.

How to play:
1. Set up 4–6 simple obstacle stations.
2. At each station, ask a quick number challenge before they can move on (count jumps, add two numbers, find a matching numeral).
3. Cheer them through to the finish.

Make it easier: Use counting only (“do 5 hops”).
Make it harder: Give a running total they have to keep in their head.`
    ),
    game(
      "preset-addition-bowling",
      "Addition Bowling",
      `What you need: Plastic bottles or empty cartons, and a soft ball.

How to play:
1. Set up 6 or 10 “pins” and count them together.
2. Roll the ball and count how many fell and how many are still standing.
3. Say the number sentence out loud: fallen + standing = total.

Make it easier: Start with 5 pins.
Make it harder: Keep a score over three turns and add the totals.`
    ),
    game(
      "preset-skip-count-steps",
      "Skip-Count Steps",
      `What you need: Space to walk, and optional number cards.

How to play:
1. Choose a skip-count: 2s, 5s or 10s.
2. Walk around the room taking one step per count: “2, 4, 6…”
3. Clap, hop, or turn around on each number to keep it lively.

Make it easier: Count in 1s first, then try 2s.
Make it harder: Count backwards, or start from a number that is not zero.`
    ),
  ]),
  wheel("preset-letter-games", "Letter games", [
    game(
      "preset-letter-hunt",
      "Letter Hunt",
      `What you need: Paper letter cards (or fridge magnets) hidden around one room.

How to play:
1. Hide 6–10 letters while your child covers their eyes.
2. They hunt for each letter, say its sound, and think of a word that starts with it.
3. Sort found letters into a simple word when you have enough.

Make it easier: Hunt for letters from their name only.
Make it harder: Ask them to find letters in a given order to spell a word.`
    ),
    game(
      "preset-phonics-hopscotch",
      "Phonics Hopscotch",
      `What you need: Chalk or paper squares with letters or sounds.

How to play:
1. Draw hopscotch squares and write a sound in each one (s, a, t, p, i, n).
2. Your child hops on a square and says the sound.
3. Hop a short trail, then blend the sounds into a word.

Make it easier: Use only 3–4 well-known sounds.
Make it harder: Include digraphs such as sh, ch, or th.`
    ),
    game(
      "preset-word-relay",
      "Word Relay",
      `What you need: Letter cards in a pile, and a target word written on paper.

How to play:
1. Place the letter pile a few steps away.
2. Call a simple word (cat, ship, sand).
3. Your child runs to collect the letters one at a time and builds the word.

Make it easier: Use three-letter words and keep the letters already in a small choice pile.
Make it harder: Include longer words, or time how quickly they can build three words.`
    ),
    game(
      "preset-robot-blending",
      "Robot Blending",
      `What you need: Nothing, or a toy robot for fun.

How to play:
1. Speak like a robot, stretching each sound: “c-a-t”.
2. Your child blends the sounds and says the whole word.
3. Swap roles so they robot-talk a word for you.

Make it easier: Use two-sound words such as “a-t” or “u-p”.
Make it harder: Use four-sound words such as “s-t-o-p” or “c-r-a-b”.`
    ),
    game(
      "preset-syllable-steps",
      "Syllable Steps",
      `What you need: Space to take a few steps.

How to play:
1. Say a word (elephant, banana, sunshine).
2. Your child takes one step for each syllable and claps the beats: “el-e-phant”.
3. Try names of family, foods, and animals.

Make it easier: Start with one- and two-syllable words.
Make it harder: Ask them to invent a word with a given number of syllables.`
    ),
  ]),
  wheel("preset-talking-games", "Talking games", [
    game(
      "preset-act-out-a-story",
      "Act Out a Story",
      `What you need: A short picture book, or a story you both know.

How to play:
1. Read or tell the story once.
2. Choose two or three favourite scenes and act them out with voices and actions.
3. Add a new ending if they want to.

Make it easier: You play most of the parts; they join in with one character.
Make it harder: Pause and ask “What might happen next?” before you act it.`
    ),
    game(
      "preset-emotion-charades",
      "Emotion Charades",
      `What you need: Nothing, or simple feeling cards (happy, sad, cross, proud, worried).

How to play:
1. Act out a feeling with no words.
2. Your child guesses the feeling, then thinks of a time they felt that way.
3. Swap roles.

Make it easier: Start with happy, sad, and silly.
Make it harder: Add mixed feelings, such as excited-and-nervous.`
    ),
    game(
      "preset-story-stations",
      "Story Stations",
      `What you need: Four spots in the room labelled Beginning, Problem, Solution, Ending.

How to play:
1. Stand at Beginning and invent who the story is about.
2. Move to Problem and say what goes wrong.
3. Move to Solution and Ending to finish the tale.

Make it easier: Retell a known story instead of inventing one.
Make it harder: Give them a random object that must appear in the story.`
    ),
    game(
      "preset-mystery-object",
      "Mystery Object",
      `What you need: A bag and one household object inside it.

How to play:
1. One person feels the object without looking (or gives spoken clues).
2. The other asks yes/no questions: “Is it food? Is it heavy?”
3. Guess what it is, then swap.

Make it easier: Give two obvious clues first.
Make it harder: Allow only five questions before a guess.`
    ),
    game(
      "preset-puppet-interview",
      "Puppet Interview",
      `What you need: A puppet, toy, or sock with a face.

How to play:
1. The puppet is a guest (a firefighter, a dragon, a visitor from space).
2. Your child asks questions: “What do you eat? What is your job?”
3. Answer in character, then let them be the puppet.

Make it easier: You ask the questions; they answer as the puppet.
Make it harder: The puppet tells a short news report about its day.`
    ),
  ]),
  wheel("preset-geography", "Geography", [
    game(
      "preset-compass-directions",
      "Compass Directions",
      `What you need: Paper labelled North, East, South, West laid on the floor like a compass.

How to play:
1. Stand in the middle of the compass.
2. Give directions: “Take 3 steps north, then 2 steps east.”
3. Hide a small treasure and guide them to it with compass language.

Make it easier: Use only two directions, such as forward and left.
Make it harder: Let them write a short route for you to follow.`
    ),
    game(
      "preset-map-treasure-hunt",
      "Map Treasure Hunt",
      `What you need: Paper and a pencil, plus a small treat or toy to hide.

How to play:
1. Sketch a simple map of the room or garden (door, sofa, tree).
2. Hide a treasure and mark it with X.
3. Your child follows the map to find it, then draws a map for you.

Make it easier: Walk the route together while looking at the map.
Make it harder: Add landmarks and a dotted path they must follow in order.`
    ),
    game(
      "preset-continent-corners",
      "Continent Corners",
      `What you need: Four corners of a room labelled with continents (or land / sea / hot / cold).

How to play:
1. Call out an animal, food, or landmark (“penguins”, “pyramids”, “pandas”).
2. Your child runs to the matching corner.
3. Talk for a moment about why that place fits.

Make it easier: Use only two labels, such as hot places and cold places.
Make it harder: They must name the continent before they run.`
    ),
    game(
      "preset-weather-reporter",
      "Weather Reporter",
      `What you need: A window or outdoor space, and optional hat or toy microphone.

How to play:
1. Look at the sky, trees, and ground together.
2. Your child gives a weather report: cloudy, windy, rainy, hot, cold.
3. They recommend clothes and an activity that fits today’s weather.

Make it easier: Choose from two words, such as sunny or rainy.
Make it harder: Keep a simple week chart and compare today with yesterday.`
    ),
    game(
      "preset-land-or-water",
      "Land or Water",
      `What you need: A line on the floor. One side is Land, the other is Water.

How to play:
1. Call out a place, animal, or vehicle (camel, whale, canoe, mountain).
2. Your child jumps to Land or Water.
3. Pause on tricky ones (frog, aeroplane, island) and talk it through.

Make it easier: Use very obvious examples first.
Make it harder: Add a middle “both” zone for things that fit either.`
    ),
  ]),
  wheel("preset-science", "Science", [
    game(
      "preset-sink-or-float",
      "Sink or Float",
      `What you need: A bowl of water and 6–8 household objects (spoon, cork, coin, crayon, apple).

How to play:
1. Predict sink or float for each object and sort them into two piles.
2. Test one at a time.
3. Talk about which predictions were right and what you notice (heavy, hollow, metal).

Make it easier: Choose objects that are very different.
Make it harder: Try shaping the same material (foil ball vs foil boat).`
    ),
    game(
      "preset-magnet-hunt",
      "Magnet Hunt",
      `What you need: A fridge magnet or magnetic wand.

How to play:
1. Test objects around the house: keys, paper, fabric, tins, toys.
2. Make two collections: magnetic and not magnetic.
3. Guess before each test, then check.

Make it easier: You offer two objects at a time to compare.
Make it harder: Hunt for magnetic things that are not obviously metal.`
    ),
    game(
      "preset-ramp-race",
      "Ramp Race",
      `What you need: A plank, book, or cardboard ramp, and two toys that can roll or slide.

How to play:
1. Race two toys down the ramp.
2. Change one thing: steeper ramp, bumpier surface, heavier toy.
3. Talk about which change made it faster or slower.

Make it easier: Race only two times and describe what you see.
Make it harder: Measure roughly with footsteps or a count of seconds.`
    ),
    game(
      "preset-shadow-chase",
      "Shadow Chase",
      `What you need: A torch, or a sunny patch of floor, and paper if you want to draw.

How to play:
1. Make hand or toy shadows on a wall or the floor.
2. Move the light closer and further away. Notice how the shadow changes.
3. Trace a favourite shadow, then try to match it again.

Make it easier: Play “copy my shadow shape”.
Make it harder: Ask whether the shadow is longer in the morning or afternoon outdoors.`
    ),
    game(
      "preset-habitat-builder",
      "Habitat Builder",
      `What you need: Cushions, boxes, fabric, toys, and paper for a sign.

How to play:
1. Choose an animal (penguin, bee, crab, rabbit).
2. Build a mini habitat that would help it live: shelter, food, water, space to move.
3. Give a short tour: “This is the nest. This is where it finds food.”

Make it easier: Build together and you name the parts.
Make it harder: Compare two animals and explain why their homes are different.`
    ),
  ]),
  wheel("preset-logic-puzzles", "Logic and puzzles", [
    game(
      "preset-puzzle-relay",
      "Puzzle Relay",
      `What you need: A simple jigsaw or a picture cut into a few large pieces.

How to play:
1. Place the pieces a few steps from the table.
2. Your child fetches one piece at a time and fits it.
3. Work as a team until the picture is complete.

Make it easier: Use 4–6 large pieces.
Make it harder: Fetch pieces in a given colour or edge-first order.`
    ),
    game(
      "preset-human-coding",
      "Human Coding",
      `What you need: A clear floor path and a target object.

How to play:
1. One person is the robot. They only move when given an instruction.
2. Give steps such as “forward 2, turn left, forward 1”.
3. If the robot goes wrong, debug the instructions and try again.

Make it easier: Use only forward and turn.
Make it harder: Write the program on paper before the robot moves.`
    ),
    game(
      "preset-what-changed",
      "What Changed?",
      `What you need: A tray or table with 5–8 small objects.

How to play:
1. Let your child look carefully for 20 seconds.
2. They turn away while you change one thing (remove, add, or swap).
3. They look back and say what changed.

Make it easier: Use fewer objects and make a big change.
Make it harder: Change two things, or only turn one object slightly.`
    ),
    game(
      "preset-build-from-memory",
      "Build from Memory",
      `What you need: Blocks, Lego, or stacking cups.

How to play:
1. Build a small model and show it for about 20 seconds.
2. Cover it.
3. Your child rebuilds it from memory, then compare.

Make it easier: Use 3–4 pieces in a simple tower.
Make it harder: Add colour patterns or a time limit.`
    ),
    game(
      "preset-pattern-moves",
      "Pattern Moves",
      `What you need: Space to move.

How to play:
1. Make a movement pattern: clap, jump, clap, jump.
2. Your child copies it, then adds the next two moves.
3. Invent new patterns with hops, turns, and stomps.

Make it easier: Use a two-move pattern and say it while you do it.
Make it harder: Use three-move patterns, or ask them to spot the mistake in yours.`
    ),
  ]),
];

export const PRESET_WHEEL_IDS = new Set(PRESET_WHEELS.map((item) => item.id));
export const PRESET_GAME_IDS = new Set(
  PRESET_WHEELS.flatMap((item) => item.games.map((entry) => entry.id))
);
