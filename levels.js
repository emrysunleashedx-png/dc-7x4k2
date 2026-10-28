// Desire's Cascade — 150 story levels (15 chapters) + 350 bonus levels (35 chapters) = 500.
const CHAPTERS = [
  { id: 1, title: "Kiddo's Garden", emoji: "🌱" },
  { id: 2, title: "Musu's Orchard", emoji: "🍎" },
  { id: 3, title: "Ewure's Playground", emoji: "🐐" },
  { id: 4, title: "Musu's Shore", emoji: "🌊" },
  { id: 5, title: "Trenches Musu", emoji: "🛡️" },
  { id: 6, title: "Trenches Ewure", emoji: "😂" },
  { id: 7, title: "Kiddo's Caves", emoji: "🕳️" },
  { id: 8, title: "Musu's Tower", emoji: "🗼" },
  { id: 9, title: "Desire's Sky", emoji: "✨" },
  { id: 10, title: "Aanuoluwapo", emoji: "🌅" },
  { id: 11, title: "The Unsent Letters", emoji: "✉️" },
  { id: 12, title: "After the Rain", emoji: "🌧️" },
  { id: 13, title: "The Quiet Truth", emoji: "🕯️" },
  { id: 14, title: "A Thousand Tomorrows", emoji: "🌷" },
  { id: 15, title: "Always, Somehow", emoji: "💗" },
];

const LEVELS = [
  { id: 1, chapter: 1, name: "Kiddo Wakes Up", goal: 30, moves: 16 },
  { id: 2, chapter: 1, name: "First Steps", goal: 31, moves: 16 },
  { id: 3, chapter: 1, name: "Little Sprout", goal: 31, moves: 16 },
  { id: 4, chapter: 1, name: "Morning Dew", goal: 32, moves: 16 },
  { id: 5, chapter: 1, name: "Soft Landing", goal: 33, moves: 16 },
  { id: 6, chapter: 1, name: "Tiny Triumphs", goal: 34, moves: 16 },
  { id: 7, chapter: 1, name: "Warm Sunlight", goal: 34, moves: 16 },
  { id: 8, chapter: 1, name: "Gentle Breeze", goal: 35, moves: 16 },
  { id: 9, chapter: 1, name: "Home Ground", goal: 36, moves: 16 },
  { id: 10, chapter: 1, name: "Kiddo's Garden", goal: 36, moves: 15 },
  { id: 11, chapter: 2, name: "Musu's Gate", goal: 37, moves: 16 },
  { id: 12, chapter: 2, name: "Apple Row", goal: 38, moves: 16 },
  { id: 13, chapter: 2, name: "Sweet Harvest", goal: 39, moves: 16 },
  { id: 14, chapter: 2, name: "First Frost", goal: 39, moves: 16 },
  { id: 15, chapter: 2, name: "Basket Full", goal: 40, moves: 16 },
  { id: 16, chapter: 2, name: "Golden Hour", goal: 41, moves: 16 },
  { id: 17, chapter: 2, name: "Orchard Path", goal: 42, moves: 16 },
  { id: 18, chapter: 2, name: "Ripe & Ready", goal: 42, moves: 16 },
  { id: 19, chapter: 2, name: "Musu's Table", goal: 43, moves: 15 },
  { id: 20, chapter: 2, name: "Orchard Heart", goal: 44, moves: 14 },
  { id: 21, chapter: 3, name: "Ewure Runs Loose", goal: 44, moves: 15 },
  { id: 22, chapter: 3, name: "Hop & Skip", goal: 45, moves: 15 },
  { id: 23, chapter: 3, name: "Mischief Managed", goal: 46, moves: 15 },
  { id: 24, chapter: 3, name: "Bounce Back", goal: 47, moves: 15 },
  { id: 25, chapter: 3, name: "Silly Steps", goal: 47, moves: 15 },
  { id: 26, chapter: 3, name: "Chaotic Fun", goal: 48, moves: 15 },
  { id: 27, chapter: 3, name: "Ewure's Jump", goal: 49, moves: 15 },
  { id: 28, chapter: 3, name: "Playground King", goal: 49, moves: 15 },
  { id: 29, chapter: 3, name: "No Rules Here", goal: 50, moves: 15 },
  { id: 30, chapter: 3, name: "Ewure's Playground", goal: 51, moves: 14 },
  { id: 31, chapter: 4, name: "Tide Comes In", goal: 52, moves: 15 },
  { id: 32, chapter: 4, name: "Shells & Stones", goal: 52, moves: 15 },
  { id: 33, chapter: 4, name: "Musu Waits", goal: 53, moves: 15 },
  { id: 34, chapter: 4, name: "Deep Water", goal: 54, moves: 15 },
  { id: 35, chapter: 4, name: "Steady Hands", goal: 54, moves: 15 },
  { id: 36, chapter: 4, name: "Lighthouse Glow", goal: 55, moves: 15 },
  { id: 37, chapter: 4, name: "Sailor's Rest", goal: 56, moves: 14 },
  { id: 38, chapter: 4, name: "By the Water", goal: 57, moves: 14 },
  { id: 39, chapter: 4, name: "Musu's Shore", goal: 57, moves: 14 },
  { id: 40, chapter: 4, name: "Safe Harbor", goal: 58, moves: 13 },
  { id: 41, chapter: 5, name: "Into the Trenches", goal: 59, moves: 14 },
  { id: 42, chapter: 5, name: "Hold the Line", goal: 60, moves: 14 },
  { id: 43, chapter: 5, name: "Mud & Grit", goal: 60, moves: 14 },
  { id: 44, chapter: 5, name: "No Way Back", goal: 61, moves: 14 },
  { id: 45, chapter: 5, name: "Musu Stands", goal: 62, moves: 14 },
  { id: 46, chapter: 5, name: "The Ewure Awakens", goal: 62, moves: 14 },
  { id: 47, chapter: 5, name: "Through the Fire", goal: 63, moves: 14 },
  { id: 48, chapter: 5, name: "Still Standing", goal: 64, moves: 14 },
  { id: 49, chapter: 5, name: "Trenches Deep", goal: 65, moves: 14 },
  { id: 50, chapter: 5, name: "Trenches Musu", goal: 65, moves: 13 },
  { id: 51, chapter: 6, name: "Ewure in the Trenches", goal: 66, moves: 14 },
  { id: 52, chapter: 6, name: "Ridiculous Run", goal: 67, moves: 14 },
  { id: 53, chapter: 6, name: "Chaos Engine", goal: 67, moves: 14 },
  { id: 54, chapter: 6, name: "Nonsense Unleashed", goal: 68, moves: 14 },
  { id: 55, chapter: 6, name: "Goat at War", goal: 69, moves: 13 },
  { id: 56, chapter: 6, name: "Laughing Through It", goal: 70, moves: 13 },
  { id: 57, chapter: 6, name: "Ewure Survives", goal: 70, moves: 13 },
  { id: 58, chapter: 6, name: "Absurd Victory", goal: 71, moves: 13 },
  { id: 59, chapter: 6, name: "Trenches Ewure", goal: 72, moves: 13 },
  { id: 60, chapter: 6, name: "Trenches Ewure Final", goal: 72, moves: 12 },
  { id: 61, chapter: 7, name: "Kiddo Descends", goal: 73, moves: 13 },
  { id: 62, chapter: 7, name: "Dark Path", goal: 74, moves: 13 },
  { id: 63, chapter: 7, name: "Whispered Walls", goal: 75, moves: 13 },
  { id: 64, chapter: 7, name: "Portal First", goal: 75, moves: 13 },
  { id: 65, chapter: 7, name: "Lost & Found", goal: 76, moves: 13 },
  { id: 66, chapter: 7, name: "Echoes", goal: 77, moves: 13 },
  { id: 67, chapter: 7, name: "Kiddo's Courage", goal: 78, moves: 13 },
  { id: 68, chapter: 7, name: "Deep Within", goal: 78, moves: 13 },
  { id: 69, chapter: 7, name: "Almost Out", goal: 79, moves: 13 },
  { id: 70, chapter: 7, name: "Kiddo Rises", goal: 80, moves: 12 },
  { id: 71, chapter: 8, name: "First Ascent", goal: 80, moves: 13 },
  { id: 72, chapter: 8, name: "Stone Steps", goal: 81, moves: 13 },
  { id: 73, chapter: 8, name: "Higher Ground", goal: 82, moves: 12 },
  { id: 74, chapter: 8, name: "Musu Climbs", goal: 83, moves: 12 },
  { id: 75, chapter: 8, name: "Wind & Walls", goal: 83, moves: 12 },
  { id: 76, chapter: 8, name: "Two Goals, One Heart", goal: 84, moves: 12 },
  { id: 77, chapter: 8, name: "Near the Top", goal: 85, moves: 12 },
  { id: 78, chapter: 8, name: "Almost There", goal: 85, moves: 12 },
  { id: 79, chapter: 8, name: "Musu's View", goal: 86, moves: 12 },
  { id: 80, chapter: 8, name: "Tower Crown", goal: 87, moves: 11 },
  { id: 81, chapter: 9, name: "Desire Rising", goal: 88, moves: 12 },
  { id: 82, chapter: 9, name: "New Light", goal: 88, moves: 12 },
  { id: 83, chapter: 9, name: "Colors Bloom", goal: 89, moves: 12 },
  { id: 84, chapter: 9, name: "Star Chorus", goal: 90, moves: 12 },
  { id: 85, chapter: 9, name: "Her Name in Stars", goal: 90, moves: 12 },
  { id: 86, chapter: 9, name: "Desire Shines", goal: 91, moves: 12 },
  { id: 87, chapter: 9, name: "Open Sky", goal: 92, moves: 12 },
  { id: 88, chapter: 9, name: "Everything at Once", goal: 93, moves: 12 },
  { id: 89, chapter: 9, name: "Desire's Sky", goal: 93, moves: 12 },
  { id: 90, chapter: 9, name: "Full Bloom", goal: 94, moves: 11 },
  { id: 91, chapter: 10, name: "Mercy Morning", goal: 95, moves: 11 },
  { id: 92, chapter: 10, name: "Grace Upon Grace", goal: 96, moves: 11 },
  { id: 93, chapter: 10, name: "The Long Road Home", goal: 96, moves: 11 },
  { id: 94, chapter: 10, name: "Aanuoluwapo Begins", goal: 97, moves: 11 },
  { id: 95, chapter: 10, name: "Held", goal: 98, moves: 11 },
  { id: 96, chapter: 10, name: "Seen", goal: 98, moves: 11 },
  { id: 97, chapter: 10, name: "Known", goal: 99, moves: 11 },
  { id: 98, chapter: 10, name: "Loved", goal: 100, moves: 11 },
  { id: 99, chapter: 10, name: "The Last Level", goal: 101, moves: 11 },
  { id: 100, chapter: 10, name: "Aanuoluwapo", goal: 101, moves: 10 },
  { id: 101, chapter: 11, name: "The Door Left Open", goal: 102, moves: 11 },
  { id: 102, chapter: 11, name: "A Familiar Song", goal: 103, moves: 11 },
  { id: 103, chapter: 11, name: "The Unsent Draft", goal: 103, moves: 11 },
  { id: 104, chapter: 11, name: "Three Little Dots", goal: 104, moves: 11 },
  { id: 105, chapter: 11, name: "The Photograph", goal: 105, moves: 11 },
  { id: 106, chapter: 11, name: "Almost Told You", goal: 106, moves: 11 },
  { id: 107, chapter: 11, name: "A Name in the Margin", goal: 106, moves: 11 },
  { id: 108, chapter: 11, name: "The Long Pause", goal: 107, moves: 11 },
  { id: 109, chapter: 11, name: "What We Never Said", goal: 108, moves: 10 },
  { id: 110, chapter: 11, name: "The First Letter", goal: 108, moves: 9 },
  { id: 111, chapter: 12, name: "Rain on the Window", goal: 109, moves: 10 },
  { id: 112, chapter: 12, name: "A Place to Breathe", goal: 110, moves: 10 },
  { id: 113, chapter: 12, name: "After the Storm", goal: 111, moves: 10 },
  { id: 114, chapter: 12, name: "Small Mercies", goal: 111, moves: 10 },
  { id: 115, chapter: 12, name: "The Morning After", goal: 112, moves: 10 },
  { id: 116, chapter: 12, name: "The Truth Between Us", goal: 113, moves: 10 },
  { id: 117, chapter: 12, name: "A Gentle Confession", goal: 114, moves: 10 },
  { id: 118, chapter: 12, name: "No Perfect Words", goal: 114, moves: 10 },
  { id: 119, chapter: 12, name: "The Part I Hid", goal: 115, moves: 10 },
  { id: 120, chapter: 12, name: "Nothing Was Random", goal: 116, moves: 9 },
  { id: 121, chapter: 13, name: "The Quiet Truth", goal: 116, moves: 10 },
  { id: 122, chapter: 13, name: "A Little Braver", goal: 117, moves: 10 },
  { id: 123, chapter: 13, name: "The Fear Beneath", goal: 118, moves: 10 },
  { id: 124, chapter: 13, name: "If You Had Asked", goal: 119, moves: 10 },
  { id: 125, chapter: 13, name: "The Honest Answer", goal: 119, moves: 10 },
  { id: 126, chapter: 13, name: "A Different Ending", goal: 120, moves: 10 },
  { id: 127, chapter: 13, name: "The Moment I Knew", goal: 121, moves: 9 },
  { id: 128, chapter: 13, name: "Not Just a Game", goal: 121, moves: 9 },
  { id: 129, chapter: 13, name: "The Page Turns", goal: 122, moves: 9 },
  { id: 130, chapter: 13, name: "Say It Plainly", goal: 123, moves: 9 },
  { id: 131, chapter: 14, name: "A Thousand Tomorrows", goal: 124, moves: 9 },
  { id: 132, chapter: 14, name: "The Ordinary Magic", goal: 124, moves: 9 },
  { id: 133, chapter: 14, name: "Your Laugh Again", goal: 125, moves: 9 },
  { id: 134, chapter: 14, name: "Room for Hope", goal: 126, moves: 9 },
  { id: 135, chapter: 14, name: "The Promise", goal: 126, moves: 9 },
  { id: 136, chapter: 14, name: "A Softer Place", goal: 127, moves: 9 },
  { id: 137, chapter: 14, name: "Even on Hard Days", goal: 128, moves: 9 },
  { id: 138, chapter: 14, name: "The Things That Stay", goal: 129, moves: 9 },
  { id: 139, chapter: 14, name: "One More Sunrise", goal: 129, moves: 9 },
  { id: 140, chapter: 14, name: "Tomorrow Is Ours", goal: 130, moves: 9 },
  { id: 141, chapter: 15, name: "Always, Somehow", goal: 131, moves: 9 },
  { id: 142, chapter: 15, name: "The Hidden Chapter", goal: 132, moves: 9 },
  { id: 143, chapter: 15, name: "The Last Secret", goal: 132, moves: 9 },
  { id: 144, chapter: 15, name: "The Real Beginning", goal: 133, moves: 9 },
  { id: 145, chapter: 15, name: "A Heart Unafraid", goal: 134, moves: 9 },
  { id: 146, chapter: 15, name: "More Than a Memory", goal: 134, moves: 9 },
  { id: 147, chapter: 15, name: "Every Small Thing", goal: 135, moves: 9 },
  { id: 148, chapter: 15, name: "Here, Still", goal: 136, moves: 9 },
  { id: 149, chapter: 15, name: "One Final Note", goal: 137, moves: 9 },
  { id: 150, chapter: 15, name: "Our Story Continues", goal: 137, moves: 9 },
];

// ---- BONUS CHAPTERS (levels 151-200) -----------------------------------
// Placeholder names - rename freely. They have no story notes unless you add
// entries to MESSAGES in messages.js (e.g. 160: "your note here").
CHAPTERS.push(
  { id: 16, title: "Sugar Rush",           emoji: "🍬", bonus: true },
  { id: 17, title: "Midnight Market",      emoji: "🏮", bonus: true },
  { id: 18, title: "Starlight Cove",       emoji: "🌙", bonus: true },
  { id: 19, title: "Blossom Run",          emoji: "🌸", bonus: true },
  { id: 20, title: "The Grand Finale",     emoji: "🎆", bonus: true }
);
(function addBonusLevels() {
  const names = [
    ["Sprinkle Start", "Candy Floss Clouds", "Gumdrop Garden", "Jellybean Jam", "Caramel Swirl", "Lollipop Lane", "Sherbet Fizz", "Cocoa Rain", "Sticky Fingers", "Sugar High"],
    ["Lantern Lit", "Spice Stall", "Silk Street", "Fortune Cookies", "Night Bazaar", "Paper Moons", "Tea for Two", "Fireflies Ahead", "Haggling Hour", "Market Closes"],
    ["Moonlit Tide", "Pearl Hunt", "Whale Song", "Lighthouse Glow", "Seashell Secrets", "Driftwood Dreams", "Constellation Cove", "Shooting Star", "Quiet Waves", "Starfall"],
    ["First Petals", "Cherry Breeze", "Pink Horizon", "Petal Storm", "Garden Gate", "Wild Meadow", "Butterfly Trail", "Sunbeam Hill", "Bloom Rush", "Full Blossom"],
    ["Confetti Cannon", "Sparkler Street", "Balloon Rise", "Fireworks Prep", "Lights Up", "Drumroll", "Golden Hour", "Standing Ovation", "The Last Dance", "Still Playing"]
  ];
  for (let c = 0; c < names.length; c++) {
    for (let i = 0; i < 10; i++) {
      LEVELS.push({ id: 151 + c * 10 + i, chapter: 16 + c, name: names[c][i], goal: 78, moves: 14 });
    }
  }
})();

// ---- MORE BONUS CHAPTERS (levels 201-500) -------------------------------
// Chapter name + emoji + 6 themed words. Level names are generated as
// "<adjective> <word>" and every 10th level is "<chapter> Finale".
// All placeholders - edit the lists, or replace the generated names later.
const BONUS_ADJECTIVES = ["Gentle", "Golden", "Hidden", "Sparkling", "Quiet", "Dancing", "Little", "Secret", "Warm", "Bright", "Whispering", "Sleepy",
  "Merry", "Silver", "Velvet", "Lucky", "Drifting", "Glowing", "Tender", "Wandering", "Cheerful", "Moonlit", "Sunlit", "Rosy"];
const BONUS_CHAPTERS = [
  ["Rainbow Bridge", "🌈", ["Arch", "Span", "Bridge", "Colour", "Mist", "Crossing"]],
  ["Lotus Lake", "🪷", ["Lotus", "Ripple", "Reed", "Heron", "Dock", "Pond"]],
  ["Cloud Kingdom", "☁️", ["Cloud", "Tower", "Gate", "Throne", "Drift", "Breeze"]],
  ["Honey Hollow", "🍯", ["Honey", "Hive", "Comb", "Clover", "Bee", "Hollow"]],
  ["Snowglobe Village", "⛄", ["Snowflake", "Chimney", "Sleigh", "Mitten", "Snowdrift", "Candle"]],
  ["Ember Canyon", "🔥", ["Ember", "Cliff", "Spark", "Ridge", "Dust", "Flame"]],
  ["Crystal Cavern", "💎", ["Crystal", "Geode", "Echo", "Prism", "Shard", "Glimmer"]],
  ["Moonbeam Meadow", "🌾", ["Moonbeam", "Dandelion", "Haystack", "Fawn", "Willow", "Dew"]],
  ["Clockwork City", "⚙️", ["Cog", "Gear", "Spring", "Tick", "Bell", "Pendulum"]],
  ["Mermaid Lagoon", "🧜", ["Coral", "Pearl", "Tide", "Shell", "Kelp", "Wave"]],
  ["Alpine Peaks", "🏔️", ["Peak", "Summit", "Trail", "Pine", "Glacier", "Snowcap"]],
  ["Kite Festival", "🪁", ["Kite", "Ribbon", "Tail", "Gust", "Spool", "Skyline"]],
  ["Bakery Lane", "🥐", ["Croissant", "Crumb", "Oven", "Dough", "Whisk", "Glaze"]],
  ["Pirate Cove", "🏴‍☠️", ["Anchor", "Compass", "Treasure", "Plank", "Sail", "Parrot"]],
  ["Enchanted Forest", "🌲", ["Fern", "Mushroom", "Acorn", "Owl", "Moss", "Bramble"]],
  ["Desert Oasis", "🏜️", ["Dune", "Oasis", "Camel", "Mirage", "Palm", "Sunset"]],
  ["Autumn Orchard", "🍂", ["Maple", "Pumpkin", "Harvest", "Leaf", "Cider", "Scarecrow"]],
  ["Library of Stars", "📚", ["Page", "Quill", "Chapter", "Bookmark", "Inkwell", "Story"]],
  ["Carnival Night", "🎡", ["Ferris Wheel", "Ticket", "Balloon", "Popcorn", "Carousel", "Prize"]],
  ["Tea Garden", "🍵", ["Teapot", "Jasmine", "Steam", "Saucer", "Teacup", "Kettle"]],
  ["Aurora Fields", "🌌", ["Aurora", "Frost", "Glow", "Shimmer", "Twilight", "Northern Light"]],
  ["Dragon's Nest", "🐉", ["Scale", "Egg", "Wing", "Hoard", "Roar", "Cinder"]],
  ["Rooftop Garden", "🏙️", ["Rooftop", "Antenna", "Window", "Terrace", "Neon", "Balcony"]],
  ["Wildflower Road", "🌻", ["Sunflower", "Daisy", "Poppy", "Roadside", "Bluebell", "Pollen"]],
  ["Secret Greenhouse", "🪴", ["Seedling", "Vine", "Orchid", "Terrarium", "Sprout", "Trellis"]],
  ["Ice Palace", "🧊", ["Icicle", "Frostwork", "Chandelier", "Mirror", "Great Hall", "Snowdrop"]],
  ["Dreamcatcher Hills", "🪶", ["Feather", "Dream", "Lullaby", "Pillow", "Hush", "Slumber"]],
  ["Sunrise Harbour", "🚢", ["Harbour", "Buoy", "Seagull", "Fishing Net", "Mast", "Morning"]],
  ["Memory Lane", "📸", ["Photograph", "Postcard", "Souvenir", "Album", "Snapshot", "Keepsake"]],
  ["Forever and Ever", "♾️", ["Promise", "Tomorrow", "Heartbeat", "Sparkle", "Encore", "Happily"]]
];
(function addMoreBonus() {
  function rngSeeded(seed) { let s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  BONUS_CHAPTERS.forEach(function (def, ci) {
    const chapterId = 21 + ci;
    CHAPTERS.push({ id: chapterId, title: def[0], emoji: def[1], bonus: true });
    // all adjective+word pairs, shuffled with a fixed seed so names never change between runs
    const pairs = [];
    BONUS_ADJECTIVES.forEach(function (a) { def[2].forEach(function (w) { pairs.push(a + " " + w); }); });
    const r = rngSeeded(chapterId * 17);
    for (let i = pairs.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = pairs[i]; pairs[i] = pairs[j]; pairs[j] = t; }
    for (let i = 0; i < 10; i++) {
      LEVELS.push({
        id: 201 + ci * 10 + i, chapter: chapterId,
        name: i === 9 ? def[0] + " Finale" : pairs[i],
        goal: 120, moves: 14
      });
    }
  });
})();

// ---- GOAL TYPES & BALANCE ---------------------------------------------
// Levels 1-10: plain "clear gems". After that the goal type rotates:
//   collect specific gems, break ice, or both. Tweak the numbers below freely.
const GOAL_TUNING = {
  minMoves: 14,          // no level gives fewer moves than this
  gemsPerMoveStart: 3.4, // clear-goal cap (gems per move) at level 1...
  gemsPerMoveEnd: 5.6,   // ...rising to this at the last level
  collectBonusMoves: 2,
  iceBonusMoves: 4,
  collectShare: 0.3,    // share of the clear-goal needed for 1 collect gem
  collectShareTwo: 0.17, // ...for each gem when two gems are required
  bonusPerMoveStart: 5.6, // levels 201-500: clear-goal gems per move, rising by...
  bonusPerMoveRise: 0.8   // ...this much by level 500
};
(function applyGoalTypes() {
  function rng(seed) { let s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  LEVELS.forEach(function (l) {
    const id = l.id;
    l.moves = Math.max(l.moves, GOAL_TUNING.minMoves);
    const perMove = GOAL_TUNING.gemsPerMoveStart + (GOAL_TUNING.gemsPerMoveEnd - GOAL_TUNING.gemsPerMoveStart) * (Math.min(id, 150) / 150);
    l.goal = Math.min(l.goal, Math.round(l.moves * perMove));
    l.kind = "clear";
    if (id <= 10) return;
    if (id > 200) {                       // bonus chapters 21+: ten-level rotation that slowly ramps up
      const k = id % 10, t = (id - 200) / 300;
      const gA = (id * 3 + 1) % 5, gB = (gA + 2) % 5, gC = (gA + 4) % 5;
      const cells = function (count) {
        const r = rng(id), out = [];
        while (out.length < count) { const c = Math.floor(r() * 64); if (out.indexOf(c) === -1) out.push(c); }
        return out;
      };
      const iceN = Math.min(5 + Math.floor((id - 200) / 30), 12);
      l.goal = Math.round(14 * (GOAL_TUNING.bonusPerMoveStart + GOAL_TUNING.bonusPerMoveRise * t));
      const share2 = Math.max(5, Math.round(l.goal * GOAL_TUNING.collectShareTwo));
      const share3 = Math.max(4, Math.round(l.goal * 0.12));
      if (k === 3) { l.kind = "collect"; l.collect = [{ gem: gA, target: share2 }, { gem: gB, target: share2 }]; l.moves += GOAL_TUNING.collectBonusMoves; }
      else if (k === 4) { l.kind = "ice"; l.ice = cells(id > 350 ? Math.min(Math.ceil(iceN / 2), 3) : iceN); l.iceHp = id > 350 ? 2 : 1; l.moves += GOAL_TUNING.iceBonusMoves; }
      else if (k === 5) { l.kind = "mixed"; l.ice = cells(Math.max(4, iceN - 2)); l.iceHp = 1; l.collect = [{ gem: gA, target: share2 }]; l.moves += GOAL_TUNING.iceBonusMoves; }
      else if (k === 7) { l.kind = "collect"; l.collect = [{ gem: gA, target: share3 }, { gem: gB, target: share3 }, { gem: gC, target: share3 }]; l.moves += GOAL_TUNING.collectBonusMoves; }
      else if (k === 8) { l.kind = "ice"; l.ice = cells(Math.min(Math.ceil(iceN / 2) + 1, 4)); l.iceHp = 2; l.moves += GOAL_TUNING.iceBonusMoves; }
      else if (k === 9) { l.kind = "mixed"; l.ice = cells(id > 350 ? 3 : 4); l.iceHp = 2; l.collect = [{ gem: gA, target: share2 }]; l.moves += GOAL_TUNING.iceBonusMoves; }
      else if (k === 0) { l.kind = "mixed"; l.ice = cells(iceN); l.iceHp = 1; l.collect = [{ gem: gA, target: share2 }, { gem: gB, target: share2 }]; l.moves += GOAL_TUNING.iceBonusMoves + 2; }
      if (l.kind !== "clear") l.moves += 3;
      if (l.iceHp === 2) l.moves += 2;     // 2-hit ice gets extra moves

      // ---- NEW MECHANICS, introduced gradually --------------------------
      //  chains  (⛓️)  levels 251+    - tiles that can't be swapped until matched
      //  drop 🍒       levels 201+    - bring cherries to the bottom row
      //  wind    (💨)  levels 301+    - a row slides sideways after every move
      const taken = (l.ice || []).slice();
      const extraCells = function (count) {
        const r = rng(id + 777), out = [];
        while (out.length < count) { const c = Math.floor(r() * 64); if (taken.indexOf(c) === -1 && out.indexOf(c) === -1) out.push(c); }
        out.forEach(function (c) { taken.push(c); });
        return out;
      };
      const windRows = function (n) {
        const row = 2 + (id % 4), dir = (id % 2) ? 1 : -1;
        const list = [{ row: row, dir: dir }];
        if (n > 1) list.push({ row: row < 4 ? row + 3 : row - 3, dir: -dir });
        return list;
      };
      if (k === 6) {                                   // drop levels
        l.kind = "drop";
        l.items = Math.min(1 + Math.floor((id - 200) / 75), 4);
        l.moves = 22 + 4 * l.items;
        if (id > 400) { l.ice = extraCells(2); l.iceHp = 1; l.moves += 3; }
      }
      if (k === 2 && id > 250) {                       // chain levels
        l.kind = "chain";
        l.chains = extraCells(Math.min(4 + Math.floor((id - 250) / 50), 8));
        l.moves += 5;
      }
      if (k === 1 && id > 300) {                       // wind levels
        l.kind = "wind";
        l.wind = windRows(id > 450 ? 2 : 1);
        l.goal = Math.round(l.goal * 1.45);
        l.moves += 1;
      }
      if (id > 400 && (k === 3 || k === 5)) { l.chains = extraCells(3); l.moves += 3; }   // chains join collect / mixed
      if (id > 450 && (k === 7 || k === 9)) { l.wind = windRows(1); l.moves += 3; }        // wind joins collect / 2-hit ice
      return;
    }
    if (id > 150) {                       // bonus chapters 16-20: five-level rotation
      const k = (id - 150) % 5;
      const gA = (id * 3 + 1) % 5, gB = (gA + 2) % 5;
      const cells = function (count) {
        const r = rng(id), out = [];
        while (out.length < count) { const c = Math.floor(r() * 64); if (out.indexOf(c) === -1) out.push(c); }
        return out;
      };
      const two = Math.max(5, Math.round(l.goal * GOAL_TUNING.collectShareTwo));
      if (k === 3) {
        l.kind = "collect";
        l.collect = [{ gem: gA, target: two }, { gem: gB, target: two }];
        l.moves += GOAL_TUNING.collectBonusMoves;
      } else if (k === 4) {
        l.kind = "ice"; l.ice = cells(id > 170 ? 4 : 8); l.iceHp = id > 170 ? 2 : 1;
        l.moves += GOAL_TUNING.iceBonusMoves;
      } else if (k === 0) {
        l.kind = "mixed"; l.ice = cells(6); l.iceHp = 1;
        l.collect = [{ gem: gA, target: two }];
        l.moves += GOAL_TUNING.iceBonusMoves;
      }
      if (l.kind !== "clear") l.moves += 3;
      return;
    }
    const slot = id % 5;
    const gemA = (id * 3 + 1) % 5, gemB = (gemA + 2) % 5;
    const iceCells = function (count) {
      const r = rng(id), cells = [];
      while (cells.length < count) { const c = Math.floor(r() * 64); if (cells.indexOf(c) === -1) cells.push(c); }
      return cells;
    };
    if (slot === 3) {
      l.kind = "collect";
      if (id > 60) {
        const t = Math.max(5, Math.round(l.goal * GOAL_TUNING.collectShareTwo));
        l.collect = [{ gem: gemA, target: t }, { gem: gemB, target: t }];
      } else {
        l.collect = [{ gem: gemA, target: Math.max(6, Math.round(l.goal * GOAL_TUNING.collectShare)) }];
      }
      l.moves += GOAL_TUNING.collectBonusMoves;
    } else if (slot === 4) {
      l.kind = "ice";
      l.ice = iceCells(id > 110 ? 3 : Math.min(5 + Math.floor(id / 18), 10));
      l.iceHp = id > 110 ? 2 : 1;
      l.moves += GOAL_TUNING.iceBonusMoves;
    } else if (slot === 0 && id > 30) {
      l.kind = "mixed";
      l.ice = iceCells(Math.min(4 + Math.floor(id / 30), 7));
      l.iceHp = 1;
      l.collect = [{ gem: gemA, target: Math.max(5, Math.round(l.goal * GOAL_TUNING.collectShareTwo)) }];
      l.moves += GOAL_TUNING.iceBonusMoves;
    }
    if (id > 110 && l.kind !== "clear") l.moves += 3;   // late-game breathing room
  });
})();
