// ═══════════════════════════════════════════════════════════
//  crafting.js — Camp Crafting Table for D&D 5e Chronicle
//  Full crafting system: recipes, inventory integration,
//  custom recipes, potions, weapons, food & more.
// ═══════════════════════════════════════════════════════════

// ── State ──────────────────────────────────────────────────
let craftingState = {
  activeCategory: 'all',
  searchQuery: '',
  selectedRecipe: null,
  customRecipes: [],
  craftingLog: [],
  showCustomForm: false,
};

// ── Save / Load ─────────────────────────────────────────────
function saveCraftingData() {
  if (typeof data === 'undefined' || !data) return;
  data.craftingCustomRecipes = craftingState.customRecipes;
  data.craftingLog = craftingState.craftingLog;
  if (typeof autoSave === 'function') autoSave();
}

function loadCraftingData() {
  if (typeof data === 'undefined' || !data) return;
  craftingState.customRecipes = data.craftingCustomRecipes || [];
  craftingState.craftingLog   = data.craftingLog || [];
}

// ── Canonical DnD Recipes Database ─────────────────────────
const DND_RECIPES = [

  // ── FOOD & PROVISIONS ──────────────────────────────────
  {
    id: 'ration_simple', category: 'food', name: 'Trail Rations (1 day)',
    icon: '🍖', rarity: 'common', dcCheck: null,
    description: 'Basic dried food — enough sustenance for a full day of travel.',
    flavorText: '"Hardtack and jerky. Not tasty, but it keeps you alive."',
    timeHours: 1, toolRequired: 'Cook\'s Utensils',
    ingredients: [
      { name: 'Grain (flour)', qty: 2, unit: 'portions' },
      { name: 'Dried Meat',   qty: 1, unit: 'portion'  },
    ],
    produces: { name: 'Rations', qty: 1, category: 'food', weight: 2, value: 5 },
    sourceRule: 'PHB p. 153'
  },
  {
    id: 'goodberry_brew', category: 'food', name: 'Goodberry Porridge',
    icon: '🫐', rarity: 'uncommon', dcCheck: { skill: 'Survival', dc: 12 },
    description: 'A magically-infused porridge made with freshly-cast goodberries. Provides extra nourishment.',
    flavorText: '"These berries taste of morning dew and pure sunlight."',
    timeHours: 0.5, toolRequired: 'Cook\'s Utensils',
    ingredients: [
      { name: 'Goodberry',  qty: 5, unit: 'berries' },
      { name: 'Wild Grain', qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Goodberry Porridge', qty: 1, category: 'food', weight: 1, value: 10 },
    sourceRule: 'Homebrew / Xanathar\'s'
  },
  {
    id: 'heroes_feast_prep', category: 'food', name: 'Feast Preparation',
    icon: '🍗', rarity: 'rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 15 },
    description: 'Elaborate camp meal that grants +2d10 temporary HP and advantage on WIS saves for 24 hours.',
    flavorText: '"By the gods, I could fight a dragon after this meal!"',
    timeHours: 3, toolRequired: 'Cook\'s Utensils',
    ingredients: [
      { name: 'Fresh Meat',    qty: 4, unit: 'portions'   },
      { name: 'Spices',        qty: 2, unit: 'portions'   },
      { name: 'Holy Water',    qty: 1, unit: 'flask'       },
      { name: 'Exotic Herbs',  qty: 2, unit: 'bundles'    },
    ],
    produces: { name: 'Hero\'s Feast (Prep)', qty: 1, category: 'food', weight: 5, value: 100 },
    sourceRule: 'PHB — Heroes\' Feast'
  },
  {
    id: 'antitoxin_stew', category: 'food', name: 'Antitoxin Broth',
    icon: '🍵', rarity: 'uncommon', dcCheck: { skill: 'Medicine', dc: 12 },
    description: 'A bitter herbal stew. Drinking it grants advantage on CON saves vs. poison for 1 hour.',
    flavorText: '"It tastes like old boots, but it\'ll save your life."',
    timeHours: 1, toolRequired: 'Herbalism Kit',
    ingredients: [
      { name: 'Antitoxin Herb', qty: 2, unit: 'bundles' },
      { name: 'Water',          qty: 1, unit: 'gallon'  },
      { name: 'Charcoal',       qty: 1, unit: 'piece'   },
    ],
    produces: { name: 'Antitoxin Broth', qty: 2, category: 'food', weight: 0.5, value: 25 },
    sourceRule: 'Xanathar\'s Guide p. 82'
  },

  // ── POTIONS ────────────────────────────────────────────
  {
    id: 'potion_healing', category: 'potion', name: 'Potion of Healing',
    icon: '🧪', rarity: 'common', dcCheck: { skill: 'Medicine', dc: 10 },
    description: 'A standard healing potion that restores 2d4+2 hit points when consumed.',
    flavorText: '"The liquid shimmers with a faint rosy hue."',
    timeHours: 2, toolRequired: 'Herbalism Kit',
    ingredients: [
      { name: 'Healing Herbs',     qty: 2, unit: 'bundles'   },
      { name: 'Purified Water',    qty: 1, unit: 'vial'      },
      { name: 'Powdered Ruby',     qty: 1, unit: 'pinch'     },
    ],
    produces: { name: 'Potion of Healing', qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: 'PHB p. 187, XGtE p. 130'
  },
  {
    id: 'potion_greater_healing', category: 'potion', name: 'Potion of Greater Healing',
    icon: '🧪', rarity: 'uncommon', dcCheck: { skill: 'Medicine', dc: 13 },
    description: 'A more potent healing draught. Restores 4d4+4 hit points.',
    flavorText: '"This one glows brighter — almost warm to the touch."',
    timeHours: 4, toolRequired: 'Herbalism Kit',
    ingredients: [
      { name: 'Superior Healing Herbs', qty: 4, unit: 'bundles'   },
      { name: 'Purified Water',         qty: 1, unit: 'vial'      },
      { name: 'Powdered Ruby',          qty: 2, unit: 'pinches'   },
      { name: 'Pixie Dust',             qty: 1, unit: 'pinch'     },
    ],
    produces: { name: 'Potion of Greater Healing', qty: 1, category: 'potion', weight: 0.5, value: 150 },
    sourceRule: 'PHB p. 187, XGtE p. 130'
  },
  {
    id: 'potion_antitoxin', category: 'potion', name: 'Antitoxin',
    icon: '💚', rarity: 'common', dcCheck: { skill: 'Medicine', dc: 10 },
    description: 'Grants advantage on saving throws against poison for 1 hour.',
    flavorText: '"Bitter but effective — a alchemist\'s best friend."',
    timeHours: 2, toolRequired: 'Alchemist\'s Supplies',
    ingredients: [
      { name: 'Antitoxin Herb', qty: 3, unit: 'bundles' },
      { name: 'Acid',           qty: 1, unit: 'vial'    },
      { name: 'Salt',           qty: 1, unit: 'pinch'   },
    ],
    produces: { name: 'Antitoxin', qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: 'PHB p. 151'
  },
  {
    id: 'potion_resistance', category: 'potion', name: 'Potion of Resistance',
    icon: '🔵', rarity: 'uncommon', dcCheck: { skill: 'Arcana', dc: 13 },
    description: 'Grants resistance to one damage type (chosen when crafted) for 1 hour.',
    flavorText: '"The color changes depending on the element it wards against."',
    timeHours: 4, toolRequired: 'Alchemist\'s Supplies',
    ingredients: [
      { name: 'Elemental Shard',   qty: 1, unit: 'piece'  },
      { name: 'Alchemical Binder', qty: 2, unit: 'vials'  },
      { name: 'Crystal Dust',      qty: 1, unit: 'pinch'  },
    ],
    produces: { name: 'Potion of Resistance', qty: 1, category: 'potion', weight: 0.5, value: 300 },
    sourceRule: 'DMG p. 188'
  },
  {
    id: 'potion_invisibility', category: 'potion', name: 'Potion of Invisibility',
    icon: '👻', rarity: 'very rare', dcCheck: { skill: 'Arcana', dc: 17 },
    description: 'Turns the drinker invisible for up to 1 hour or until they attack/cast.',
    flavorText: '"The vial seems half-empty, even when full."',
    timeHours: 8, toolRequired: 'Alchemist\'s Supplies',
    ingredients: [
      { name: 'Phase Spider Silk', qty: 2, unit: 'strands' },
      { name: 'Ghost Mushroom',    qty: 1, unit: 'cap'     },
      { name: 'Alchemical Base',   qty: 3, unit: 'vials'   },
      { name: 'Powdered Diamond',  qty: 1, unit: 'pinch'   },
    ],
    produces: { name: 'Potion of Invisibility', qty: 1, category: 'potion', weight: 0.5, value: 1000 },
    sourceRule: 'DMG p. 188'
  },

  // ── WEAPONS & UPGRADES ──────────────────────────────────
  {
    id: 'silvered_weapon', category: 'weapon', name: 'Silver-Coat Weapon',
    icon: '⚔️', rarity: 'uncommon', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Coat a weapon in silver to bypass the resistances of lycanthropes and certain undead.',
    flavorText: '"Pure silver, carefully hammered into every edge."',
    timeHours: 4, toolRequired: 'Smith\'s Tools',
    ingredients: [
      { name: 'Silver Ingot',      qty: 2, unit: 'pieces' },
      { name: 'Flux Powder',       qty: 1, unit: 'pinch'  },
    ],
    produces: { name: 'Silvered Weapon', qty: 1, category: 'misc', weight: 0, value: 100 },
    sourceRule: 'PHB p. 148'
  },
  {
    id: 'poisoned_blade', category: 'weapon', name: 'Poisoned Blade',
    icon: '🗡️', rarity: 'common', dcCheck: { skill: 'Poisoner\'s Kit', dc: 11 },
    description: 'Apply basic poison to a weapon. On hit: DC 10 CON or take 1d4 poison damage.',
    flavorText: '"One scratch from this and they\'ll be wishing for a quick death."',
    timeHours: 1, toolRequired: 'Poisoner\'s Kit',
    ingredients: [
      { name: 'Basic Poison',   qty: 1, unit: 'vial'   },
      { name: 'Binding Resin',  qty: 1, unit: 'portion'},
    ],
    produces: { name: 'Dose of Basic Poison', qty: 1, category: 'misc', weight: 0, value: 100 },
    sourceRule: 'PHB p. 153'
  },
  {
    id: 'arrows_bundle', category: 'weapon', name: 'Fletched Arrows (20)',
    icon: '🏹', rarity: 'common', dcCheck: null,
    description: 'Craft a bundle of standard arrows from gathered materials.',
    flavorText: '"Straight shafts, tight fletchings — these will fly true."',
    timeHours: 2, toolRequired: 'Woodcarver\'s Tools',
    ingredients: [
      { name: 'Straight Wood',    qty: 4, unit: 'pieces'  },
      { name: 'Bird Feathers',    qty: 10, unit: 'feathers'},
      { name: 'Iron Scraps',      qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Arrows', qty: 20, category: 'ammo', weight: 1, value: 1 },
    sourceRule: 'PHB / Crafting Rules'
  },
  {
    id: 'fire_arrows', category: 'weapon', name: 'Fire Arrows (5)',
    icon: '🔥', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Arrows coated with alchemical fire. Deal an extra 1d4 fire damage on hit.',
    flavorText: '"Light the tip, draw, and watch the night sky turn bright."',
    timeHours: 2, toolRequired: 'Alchemist\'s Supplies',
    ingredients: [
      { name: 'Arrows',            qty: 5,  unit: 'arrows'  },
      { name: 'Alchemist\'s Fire',  qty: 1,  unit: 'flask'   },
      { name: 'Binding Resin',     qty: 1,  unit: 'portion' },
    ],
    produces: { name: 'Fire Arrow', qty: 5, category: 'ammo', weight: 0.5, value: 10 },
    sourceRule: 'Homebrew / XGtE Crafting'
  },

  // ── ARMOR & PROTECTION ──────────────────────────────────
  {
    id: 'shield_basic', category: 'armor', name: 'Wooden Shield',
    icon: '🛡️', rarity: 'common', dcCheck: null,
    description: 'A basic wooden shield. Grants +2 AC when equipped.',
    flavorText: '"Rough-hewn but solid. It\'ll stop a blade."',
    timeHours: 4, toolRequired: 'Woodcarver\'s Tools',
    ingredients: [
      { name: 'Hard Wood',     qty: 3, unit: 'planks'  },
      { name: 'Iron Banding',  qty: 2, unit: 'strips'  },
      { name: 'Leather Strap', qty: 1, unit: 'piece'   },
    ],
    produces: { name: 'Wooden Shield', qty: 1, category: 'misc', weight: 6, value: 10 },
    sourceRule: 'PHB p. 144'
  },
  {
    id: 'leather_armor', category: 'armor', name: 'Leather Armor',
    icon: '🦺', rarity: 'common', dcCheck: { skill: 'Leatherworker\'s Tools', dc: 10 },
    description: 'Basic boiled leather armor. AC 11 + DEX modifier.',
    flavorText: '"Supple and light — perfect for those who need to move quickly."',
    timeHours: 8, toolRequired: 'Leatherworker\'s Tools',
    ingredients: [
      { name: 'Leather Hide',  qty: 4, unit: 'pieces'  },
      { name: 'Sinew Thread',  qty: 2, unit: 'spools'  },
      { name: 'Iron Rivets',   qty: 1, unit: 'set'     },
    ],
    produces: { name: 'Leather Armor', qty: 1, category: 'misc', weight: 10, value: 10 },
    sourceRule: 'PHB p. 144'
  },

  // ── TOOLS & UTILITY ─────────────────────────────────────
  {
    id: 'healer_kit', category: 'tool', name: 'Healer\'s Kit (restock)',
    icon: '🩹', rarity: 'common', dcCheck: null,
    description: 'Restock a Healer\'s Kit with 10 uses using gathered herbs and bandages.',
    flavorText: '"Clean bandages, yarrow root, and a prayer to the gods of medicine."',
    timeHours: 1, toolRequired: 'Herbalism Kit',
    ingredients: [
      { name: 'Bandage Cloth',  qty: 3, unit: 'strips'  },
      { name: 'Healing Herbs',  qty: 2, unit: 'bundles' },
    ],
    produces: { name: 'Healer\'s Kit (10 uses)', qty: 1, category: 'tool', weight: 3, value: 5 },
    sourceRule: 'PHB p. 151'
  },
  {
    id: 'torch_bundle', category: 'tool', name: 'Torches (5)',
    icon: '🔦', rarity: 'common', dcCheck: null,
    description: 'Craft a bundle of simple torches from gathered materials. Each burns for 1 hour.',
    flavorText: '"Wood and cloth soaked in tallow — simple but reliable."',
    timeHours: 0.5, toolRequired: null,
    ingredients: [
      { name: 'Stick / Branch',  qty: 5, unit: 'pieces'  },
      { name: 'Cloth Scrap',     qty: 3, unit: 'pieces'  },
      { name: 'Oil / Tallow',    qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Torch', qty: 5, category: 'tool', weight: 1, value: 0.01 },
    sourceRule: 'PHB p. 153'
  },
  {
    id: 'rope_knot', category: 'tool', name: 'Hempen Rope (50 ft)',
    icon: '🪢', rarity: 'common', dcCheck: { skill: 'Athletics', dc: 8 },
    description: 'Twist and braid plant fibers into a reliable 50-foot hemp rope.',
    flavorText: '"It takes patience, but good rope has saved more lives than swords."',
    timeHours: 2, toolRequired: null,
    ingredients: [
      { name: 'Plant Fibers',  qty: 6, unit: 'bundles' },
    ],
    produces: { name: 'Hempen Rope (50 ft)', qty: 1, category: 'tool', weight: 10, value: 1 },
    sourceRule: 'PHB p. 153'
  },
  {
    id: 'caltrops', category: 'tool', name: 'Caltrops (bag of 20)',
    icon: '⚙️', rarity: 'common', dcCheck: null,
    description: 'Scatter these on the ground to slow pursuers. Creature crossing must make DC 15 DEX or stop.',
    flavorText: '"Nobody ever looks down until it\'s too late."',
    timeHours: 2, toolRequired: 'Smith\'s Tools',
    ingredients: [
      { name: 'Iron Scraps',  qty: 2, unit: 'portions' },
      { name: 'Coal',         qty: 1, unit: 'chunk'    },
    ],
    produces: { name: 'Caltrops (bag of 20)', qty: 1, category: 'tool', weight: 2, value: 1 },
    sourceRule: 'PHB p. 151'
  },

  // ── ALCHEMY ALMANAC — POTIONS & OILS ────────────────────
  {
    id: 'aa_cat_eye', category: 'alchemy', name: "Cat's Eye Potion",
    icon: '🐱', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Inky-black potion. Drinker gains darkvision to 60 ft in dim light for 8 hours.',
    flavorText: '"Your eyes shimmer like a cat stalking shadows."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial' },
      { name: 'Shadow Reagent',            qty: 1, unit: 'dose' },
    ],
    produces: { name: "Cat's Eye Potion", qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: 'Alchemy Almanac p.9'
  },
  {
    id: 'aa_liquid_courage', category: 'alchemy', name: 'Liquid Courage',
    icon: '🍺', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Drink to become immune to being frightened for 1 hour. If already frightened, the condition ends.',
    flavorText: '"Smells strongly of alcohol. Dutch courage in a bottle."',
    timeHours: 1, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial' },
      { name: 'Life Reagent',              qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Liquid Courage', qty: 1, category: 'potion', weight: 0.5, value: 25 },
    sourceRule: 'Alchemy Almanac p.10'
  },
  {
    id: 'aa_fortifying_powder', category: 'alchemy', name: 'Fortifying Powder',
    icon: '💪', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Mix into a beverage. Provides 2d4 temporary hit points. One dose per long rest.',
    flavorText: '"Chalky and bitter, but you feel it working immediately."',
    timeHours: 1, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial' },
      { name: 'Earth Reagent',             qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Fortifying Powder', qty: 3, category: 'potion', weight: 0.2, value: 20 },
    sourceRule: 'Alchemy Almanac p.11'
  },
  {
    id: 'aa_potion_springing', category: 'alchemy', name: 'Potion of Springing',
    icon: '🦘', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Jump distance tripled for 1 hour.',
    flavorText: '"The orange liquid crackles with kinetic energy."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial' },
      { name: 'Fire Reagent',              qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Potion of Springing', qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: 'Alchemy Almanac p.19'
  },
  {
    id: 'aa_oil_light', category: 'alchemy', name: 'Oil of Light',
    icon: '💡', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Coat an object up to 10 sq ft. It radiates bright light in 60 ft and dim light 60 ft beyond for 10 min.',
    flavorText: '"A glowing slick that clings to any surface."',
    timeHours: 1, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Calcium Grease)', qty: 1, unit: 'vial' },
      { name: 'Life Reagent',                     qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Oil of Light', qty: 1, category: 'potion', weight: 0.5, value: 30 },
    sourceRule: 'Alchemy Almanac p.12'
  },
  {
    id: 'aa_oil_magic_stones', category: 'alchemy', name: 'Oil of Magic Stones',
    icon: '🪨', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Coat 3 small stones. For 1 hour they deal 1d4 damage and gain +1 to attack and damage rolls. Can be slung.',
    flavorText: '"The stones hum faintly after coating."',
    timeHours: 1, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Calcium Grease)', qty: 1, unit: 'vial' },
      { name: 'Water Reagent',                    qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Oil of Magic Stones', qty: 1, category: 'potion', weight: 0.5, value: 40 },
    sourceRule: 'Alchemy Almanac p.12'
  },
  {
    id: 'aa_oil_flame', category: 'alchemy', name: 'Oil of Flame',
    icon: '🔥', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Coat a melee weapon or 5 pieces of ammo. For 1 hour, the coated weapon deals +1d6 fire damage.',
    flavorText: '"The blade blazes with a hungry orange glow."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Calcium Grease)', qty: 1, unit: 'vial' },
      { name: 'Fire Reagent',                     qty: 2, unit: 'doses' },
      { name: 'Life Reagent',                     qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Oil of Flame', qty: 1, category: 'potion', weight: 0.5, value: 200 },
    sourceRule: 'Alchemy Almanac p.12'
  },
  {
    id: 'aa_oil_shillelagh', category: 'alchemy', name: 'Oil of Shillelagh',
    icon: '🪄', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Coat one club or quarterstaff. For 1 hour, use WIS for attack/damage and the weapon deals d8.',
    flavorText: '"Ancient druidic formula etched into the bottle\'s cork."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Calcium Grease)', qty: 1, unit: 'vial' },
      { name: 'Earth Reagent',                    qty: 1, unit: 'dose'  },
      { name: 'Life Reagent',                     qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Oil of Shillelagh', qty: 1, category: 'potion', weight: 0.5, value: 150 },
    sourceRule: 'Alchemy Almanac p.12'
  },
  {
    id: 'aa_oil_darkness', category: 'alchemy', name: 'Oil of Darkness',
    icon: '🌑', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Coat an object. Magical darkness fills a 15-ft radius for 10 minutes. Blocks darkvision.',
    flavorText: '"The oil absorbs all light like a black hole in a bottle."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Calcium Grease)', qty: 1, unit: 'vial' },
      { name: 'Fire Reagent',                     qty: 1, unit: 'dose'  },
      { name: 'Shadow Reagent',                   qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Oil of Darkness', qty: 1, category: 'potion', weight: 0.5, value: 180 },
    sourceRule: 'Alchemy Almanac p.11'
  },
  {
    id: 'aa_oil_slipperiness', category: 'alchemy', name: 'Oil of Slipperiness',
    icon: '🛝', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Cover a Medium or smaller creature. Gains freedom of movement for 8 hours. Can also be poured as grease.',
    flavorText: '"Thick and black — flows like water once poured."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Calcium Grease)', qty: 1, unit: 'vial' },
      { name: 'Water Reagent',                    qty: 1, unit: 'dose'  },
      { name: 'Shadow Reagent',                   qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Oil of Slipperiness', qty: 1, category: 'potion', weight: 0.5, value: 250 },
    sourceRule: 'Alchemy Almanac p.13'
  },
  {
    id: 'aa_potion_adaptation', category: 'alchemy', name: 'Potion of Adaptation',
    icon: '🌡️', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Drinker and gear are unharmed by temperatures from −50°F to 150°F for 24 hours.',
    flavorText: '"Weather the elements in style."',
    timeHours: 3, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Water Reagent',             qty: 1, unit: 'dose'  },
      { name: 'Fire Reagent',              qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Potion of Adaptation', qty: 1, category: 'potion', weight: 0.5, value: 200 },
    sourceRule: 'Alchemy Almanac p.13'
  },
  {
    id: 'aa_potion_animal_friendship', category: 'alchemy', name: 'Potion of Animal Friendship',
    icon: '🦊', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Cast animal friendship (DC 13) at will for 1 hour.',
    flavorText: '"Smells of fish scales and hummingbird tongue."',
    timeHours: 3, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Life Reagent',              qty: 1, unit: 'dose'  },
      { name: 'Shadow Reagent',            qty: 1, unit: 'dose'  },
      { name: 'Dryad Heart',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Animal Friendship', qty: 1, category: 'potion', weight: 0.5, value: 200 },
    sourceRule: 'Alchemy Almanac p.13'
  },
  {
    id: 'aa_potion_growth', category: 'alchemy', name: 'Potion of Growth',
    icon: '📈', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Gain the "enlarge" effect of enlarge/reduce for 1d4 hours (no concentration required).',
    flavorText: '"Red liquid continuously expands inside the bottle."',
    timeHours: 3, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',              qty: 1, unit: 'dose'  },
      { name: 'Earth Reagent',             qty: 1, unit: 'dose'  },
      { name: 'Duergar Head',              qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Growth', qty: 1, category: 'potion', weight: 0.5, value: 200 },
    sourceRule: 'Alchemy Almanac p.15'
  },
  {
    id: 'aa_potion_healing_common', category: 'alchemy', name: 'Potion of Healing (Herbal)',
    icon: '🧪', rarity: 'common', dcCheck: { skill: 'Herbalism Kit', dc: 10 },
    description: 'Regain 2d4+2 hit points. Brewed via herbal alchemy — centaur hoof or unicorn horn.',
    flavorText: '"Red liquid glimmers warmly when agitated."',
    timeHours: 2, toolRequired: 'Herbalism Kit',
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'   },
      { name: 'Air Reagent',               qty: 1, unit: 'dose'   },
      { name: 'Centaur Hoof',              qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Potion of Healing', qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: 'Alchemy Almanac p.15'
  },
  {
    id: 'aa_potion_greater_healing_herbal', category: 'alchemy', name: 'Potion of Greater Healing (Herbal)',
    icon: '🧪', rarity: 'uncommon', dcCheck: { skill: 'Herbalism Kit', dc: 13 },
    description: 'Regain 4d4+4 hit points. Brewed with doubled reagents and rare horn.',
    flavorText: '"This one glows warmer — concentrated life energy."',
    timeHours: 4, toolRequired: 'Herbalism Kit',
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Air Reagent',                         qty: 2, unit: 'doses' },
      { name: 'Unicorn Horn Fragment',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Greater Healing', qty: 1, category: 'potion', weight: 0.5, value: 150 },
    sourceRule: 'Alchemy Almanac p.15'
  },
  {
    id: 'aa_potion_water_breathing', category: 'alchemy', name: 'Potion of Water Breathing',
    icon: '🌊', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Breathe underwater for 1 hour.',
    flavorText: '"Smells faintly of salt and kelp."',
    timeHours: 3, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Water Reagent',             qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Potion of Water Breathing', qty: 1, category: 'potion', weight: 0.5, value: 180 },
    sourceRule: 'Alchemy Almanac p.9'
  },
  {
    id: 'aa_potion_levitation', category: 'alchemy', name: 'Potion of Levitation',
    icon: '🎈', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain the levitate spell effect for 10 minutes (no concentration).',
    flavorText: '"The fluid is lighter than air itself."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Earth Reagent',                       qty: 1, unit: 'dose'  },
      { name: 'Air Reagent',                         qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Potion of Levitation', qty: 1, category: 'potion', weight: 0.5, value: 350 },
    sourceRule: 'Alchemy Almanac p.16'
  },
  {
    id: 'aa_potion_darkvision', category: 'alchemy', name: 'Potion of Darkvision',
    icon: '👁️', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain darkvision to 60 ft for 8 hours. If already darkvision ≥60 ft, range increases by 30 ft.',
    flavorText: '"A cloaker eye floats within the liquid."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Earth Reagent',                       qty: 1, unit: 'dose'  },
      { name: 'Shadow Reagent',                      qty: 1, unit: 'dose'  },
      { name: 'Cloaker Eye',                         qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Darkvision', qty: 1, category: 'potion', weight: 0.5, value: 300 },
    sourceRule: 'Alchemy Almanac p.14'
  },
  {
    id: 'aa_potion_barkskin', category: 'alchemy', name: 'Potion of Barkskin',
    icon: '🌳', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Your AC cannot be less than 16 for 1 hour. Skin becomes rough and bark-like.',
    flavorText: '"Smells of pine and crushed acorns."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Earth Reagent',                       qty: 1, unit: 'dose'  },
      { name: 'Air Reagent',                         qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Potion of Barkskin', qty: 1, category: 'potion', weight: 0.5, value: 300 },
    sourceRule: 'Alchemy Almanac p.14'
  },
  {
    id: 'aa_potion_displacement', category: 'alchemy', name: 'Potion of Displacement',
    icon: '🌀', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain the blur spell effect for 1 minute (no concentration).',
    flavorText: '"Multiple shifting reflections swirl inside the orange fluid."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Water Reagent',                       qty: 1, unit: 'dose'  },
      { name: 'Air Reagent',                         qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Potion of Displacement', qty: 1, category: 'potion', weight: 0.5, value: 350 },
    sourceRule: 'Alchemy Almanac p.14'
  },
  {
    id: 'aa_potion_gaseous_form', category: 'alchemy', name: 'Potion of Gaseous Form',
    icon: '💨', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain the gaseous form spell effect for 1 hour (no concentration).',
    flavorText: '"The container seems to hold fog that moves on its own."',
    timeHours: 5, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',                        qty: 1, unit: 'dose'  },
      { name: 'Air Reagent',                         qty: 3, unit: 'doses' },
    ],
    produces: { name: 'Potion of Gaseous Form', qty: 1, category: 'potion', weight: 0.5, value: 400 },
    sourceRule: 'Alchemy Almanac p.15'
  },
  {
    id: 'aa_potion_speed', category: 'alchemy', name: 'Potion of Speed',
    icon: '⚡', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 17 },
    description: 'Gain the haste spell effect for 1 minute (no concentration).',
    flavorText: '"Yellow fluid streaked with black swirling on its own."',
    timeHours: 6, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Pure Alcohol)',  qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',                    qty: 1, unit: 'dose'  },
      { name: 'Air Reagent',                     qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Potion of Speed', qty: 1, category: 'potion', weight: 0.5, value: 1000 },
    sourceRule: 'Alchemy Almanac p.19'
  },
  {
    id: 'aa_potion_invulnerability', category: 'alchemy', name: 'Potion of Invulnerability',
    icon: '🛡️', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Resistance to non-magical damage for 1 minute. The syrupy liquid looks like liquefied iron.',
    flavorText: '"Heavy as a sword, swirling like liquid metal."',
    timeHours: 5, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',                        qty: 1, unit: 'dose'  },
      { name: 'Earth Reagent',                       qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Potion of Invulnerability', qty: 1, category: 'potion', weight: 0.5, value: 700 },
    sourceRule: 'Alchemy Almanac p.16'
  },
  {
    id: 'aa_elixir_health', category: 'alchemy', name: 'Elixir of Health',
    icon: '✨', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Cures all diseases and removes blinded, deafened, paralyzed, and poisoned conditions.',
    flavorText: '"Clear red liquid with tiny bubbles of light dancing within."',
    timeHours: 5, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Earth Reagent',                       qty: 1, unit: 'dose'  },
      { name: 'Life Reagent',                        qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Elixir of Health', qty: 1, category: 'potion', weight: 0.5, value: 400 },
    sourceRule: 'Alchemy Almanac p.11'
  },
  {
    id: 'aa_oil_keen_edge', category: 'alchemy', name: 'Oil of Keen Edge',
    icon: '⚔️', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Coat a slashing or piercing weapon. For 1 hour it is magical and scores critical hits on 19–20.',
    flavorText: '"The lithium grease magnifies every fine edge to perfection."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Lithium Grease)', qty: 1, unit: 'vial'  },
      { name: 'Water Reagent',                    qty: 1, unit: 'dose'  },
      { name: 'Earth Reagent',                    qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Oil of Keen Edge', qty: 1, category: 'potion', weight: 0.5, value: 600 },
    sourceRule: 'Alchemy Almanac p.12'
  },
  {
    id: 'aa_acid_phosphoric', category: 'alchemy', name: 'Acid Vial (Phosphoric)',
    icon: '🧫', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Improvised weapon. On hit deals 2d6 acid damage. As poison, deals twice damage and DC 13 CON or poisoned.',
    flavorText: '"Handle with care. The phosphoric acid hisses faintly."',
    timeHours: 1, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Phosphorus/Sulfur/Salt)', qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',                             qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Acid Vial (Phosphoric)', qty: 1, category: 'misc', weight: 1, value: 25 },
    sourceRule: 'Alchemy Almanac p.9'
  },
  {
    id: 'aa_alchemists_fire', category: 'alchemy', name: "Alchemist's Fire",
    icon: '🔥', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Throw at a target. On hit: 1d4 fire per turn. DC 10 DEX to extinguish. Unaffected by wind/rain.',
    flavorText: '"Sticky adhesive that ignites on contact with air."',
    timeHours: 1, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial' },
      { name: 'Fire Reagent',              qty: 1, unit: 'dose' },
    ],
    produces: { name: "Alchemist's Fire", qty: 1, category: 'misc', weight: 1, value: 50 },
    sourceRule: 'Alchemy Almanac p.9'
  },
  {
    id: 'aa_pomander_warding', category: 'alchemy', name: 'Pomander of Warding',
    icon: '🕯️', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Fills 15-ft radius with strong aroma for 8 hours. Undead CR 2 or lower must save DC 15 WIS or be turned.',
    flavorText: '"Aromatic spices perfume the air — a ward against the dead."',
    timeHours: 3, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Earth Reagent',             qty: 1, unit: 'dose'  },
      { name: 'Life Reagent',              qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Pomander of Warding', qty: 1, category: 'tool', weight: 0.5, value: 150 },
    sourceRule: 'Alchemy Almanac p.13'
  },
  {
    id: 'aa_potion_heroism', category: 'alchemy', name: 'Potion of Heroism',
    icon: '🦸', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain 10 temporary HP lasting 1 hour, and be under the bless spell (no concentration).',
    flavorText: '"Blue liquid bubbles and steams as if boiling."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',                        qty: 1, unit: 'dose'  },
      { name: 'Earth Reagent',                       qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Potion of Heroism', qty: 1, category: 'potion', weight: 0.5, value: 500 },
    sourceRule: 'Alchemy Almanac p.15'
  },
  {
    id: 'aa_potion_resistance_alchemy', category: 'alchemy', name: 'Potion of Resistance (Herbal)',
    icon: '🔵', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Gain resistance to one damage type for 1 hour. Roll d10 or choose type when crafted.',
    flavorText: '"The color changes depending on the element it guards against."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Fire Reagent',              qty: 1, unit: 'dose'  },
      { name: 'Earth Reagent',             qty: 1, unit: 'dose'  },
      { name: 'Creature Organ (type)',     qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Resistance', qty: 1, category: 'potion', weight: 0.5, value: 300 },
    sourceRule: 'Alchemy Almanac p.18'
  },
  {
    id: 'aa_potion_mind_reading', category: 'alchemy', name: 'Potion of Mind Reading',
    icon: '🧠', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain the detect thoughts spell effect (save DC 13). Dense purple liquid with a pink cloud.',
    flavorText: '"Doppelganger brain floats in the bottle — don\'t stare."',
    timeHours: 5, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Alchemical Base (Distilled Alcohol)', qty: 1, unit: 'vial'  },
      { name: 'Air Reagent',                         qty: 1, unit: 'dose'  },
      { name: 'Life Reagent',                        qty: 1, unit: 'dose'  },
      { name: 'Doppelganger Brain',                  qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Mind Reading', qty: 1, category: 'potion', weight: 0.5, value: 500 },
    sourceRule: 'Alchemy Almanac p.17'
  },

  // ── MAGIC ITEMS ─────────────────────────────────────────
  {
    id: 'scroll_cure_wounds', category: 'magic', name: 'Scroll of Cure Wounds',
    icon: '📜', rarity: 'common', dcCheck: { skill: 'Arcana', dc: 10 },
    description: 'Inscribe a Cure Wounds spell onto a scroll. Usable once by any class that can cast it.',
    flavorText: '"The golden ink pulses faintly as you finish the last sigil."',
    timeHours: 2, toolRequired: 'Calligrapher\'s Supplies',
    ingredients: [
      { name: 'Blank Scroll',     qty: 1, unit: 'piece'  },
      { name: 'Magical Ink',      qty: 1, unit: 'vial'   },
    ],
    produces: { name: 'Scroll of Cure Wounds', qty: 1, category: 'misc', weight: 0, value: 25 },
    sourceRule: 'XGtE p. 133'
  },
  {
    id: 'scroll_fireball', category: 'magic', name: 'Scroll of Fireball',
    icon: '🔥', rarity: 'rare', dcCheck: { skill: 'Arcana', dc: 15 },
    description: 'A powerful Fireball scroll. Usable by Wizards and Sorcerers (3rd level).',
    flavorText: '"The parchment is warm to the touch. Handle with extreme care."',
    timeHours: 6, toolRequired: 'Calligrapher\'s Supplies',
    ingredients: [
      { name: 'Blank Scroll',       qty: 1, unit: 'piece'  },
      { name: 'Magical Ink',        qty: 3, unit: 'vials'  },
      { name: 'Fire Salamander Oil', qty: 1, unit: 'vial'  },
    ],
    produces: { name: 'Scroll of Fireball', qty: 1, category: 'misc', weight: 0, value: 300 },
    sourceRule: 'XGtE p. 133'
  },
  {
    id: 'bag_holding', category: 'magic', name: 'Bag of Holding (minor)',
    icon: '👜', rarity: 'uncommon', dcCheck: { skill: 'Arcana', dc: 15 },
    description: 'A small extradimensional pouch. Holds up to 250 lb / 30 cubic feet.',
    flavorText: '"It\'s bigger on the inside. Don\'t ask how."',
    timeHours: 12, toolRequired: 'Leatherworker\'s Tools',
    ingredients: [
      { name: 'Leather Hide',     qty: 2, unit: 'pieces' },
      { name: 'Powdered Iron',    qty: 1, unit: 'pinch'  },
      { name: 'Planar Dust',      qty: 1, unit: 'pinch'  },
      { name: 'Arcane Thread',    qty: 2, unit: 'spools' },
    ],
    produces: { name: 'Bag of Holding', qty: 1, category: 'misc', weight: 15, value: 4000 },
    sourceRule: 'DMG p. 153'
  },
  {
    id: 'dust_disappearance', category: 'magic', name: 'Dust of Disappearance',
    icon: '✨', rarity: 'uncommon', dcCheck: { skill: 'Arcana', dc: 13 },
    description: 'Sprinkle on a creature and all its gear to grant invisibility for 2d4 minutes.',
    flavorText: '"Ground from the wings of a shadow moth..."',
    timeHours: 4, toolRequired: 'Alchemist\'s Supplies',
    ingredients: [
      { name: 'Shadow Moth Wing',  qty: 2, unit: 'wings'  },
      { name: 'Powdered Diamond',  qty: 1, unit: 'pinch'  },
      { name: 'Alchemical Base',   qty: 1, unit: 'vial'   },
    ],
    produces: { name: 'Dust of Disappearance', qty: 1, category: 'misc', weight: 0, value: 500 },
    sourceRule: 'DMG p. 166'
  },

  // ══════════════════════════════════════════════════════════
  //  KIBBLES' CRAFTING GUIDE — Potions, Concoctions, Poisons,
  //  Oils, Explosives, Blacksmithing, Cooking Feasts & Snacks
  // ══════════════════════════════════════════════════════════

  // ── KIBBLES POTIONS ──────────────────────────────────────
  {
    id: 'kib_antitoxin', category: 'potion', name: 'Antitoxin (Kibbles)',
    icon: '💚', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Grants advantage on saving throws against poison for 1 hour.',
    flavorText: '"Two curative reagents, one poisonous — neutralized."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Curative Reagent', qty: 2, unit: 'doses' },
      { name: 'Common Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',              qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Antitoxin', qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_climbing', category: 'potion', name: 'Potion of Climbing (Kibbles)',
    icon: '🧗', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Gain a climbing speed equal to walking speed for 1 hour, with advantage on Athletics checks to climb.',
    flavorText: '"Layered brown, silver, and gray — shaking fails to mix them."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Common Poisonous Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Climbing', qty: 1, category: 'potion', weight: 0.5, value: 85 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_healing', category: 'potion', name: 'Healing Potion (Kibbles)',
    icon: '🧪', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Restore 2d4+2 hit points. The red liquid glimmers when agitated.',
    flavorText: '"Three common curative reagents, measured precisely."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Curative Reagent', qty: 3, unit: 'doses'  },
      { name: 'Glass Vial',              qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Healing Potion', qty: 1, category: 'potion', weight: 0.5, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_greater_healing', category: 'potion', name: 'Potion of Greater Healing (Kibbles)',
    icon: '🧪', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Restore 4d4+4 hit points.',
    flavorText: '"Common and uncommon curatives combined — glows warmer."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Curative Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Curative Reagent', qty: 2, unit: 'doses' },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Greater Healing', qty: 1, category: 'potion', weight: 0.5, value: 120 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_superior_healing', category: 'potion', name: 'Potion of Superior Healing (Kibbles)',
    icon: '🧪', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Restore 8d4+8 hit points.',
    flavorText: '"Rare and uncommon curatives — a deep crimson glow."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Curative Reagent', qty: 2, unit: 'doses' },
      { name: 'Rare Curative Reagent',     qty: 2, unit: 'doses' },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Superior Healing', qty: 1, category: 'potion', weight: 0.5, value: 525 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_potion_supreme_healing', category: 'potion', name: 'Potion of Supreme Healing (Kibbles)',
    icon: '🧪', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 18 },
    description: 'Restore 10d4+20 hit points.',
    flavorText: '"Rare and very rare curatives — requires a crystal vial."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Curative Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Rare Curative Reagent',      qty: 1, unit: 'dose'  },
      { name: 'Very Rare Curative Reagent', qty: 2, unit: 'doses' },
      { name: 'Uncommon Divine Essence',    qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Supreme Healing', qty: 1, category: 'potion', weight: 0.5, value: 5000 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_potion_animal_friendship', category: 'potion', name: 'Potion of Animal Friendship (Kibbles)',
    icon: '🦊', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Cast animal friendship (DC 13) at will for 1 hour.',
    flavorText: '"Muddy potion with animal tracks swirling inside."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',   qty: 2, unit: 'doses' },
      { name: 'Common Poisonous Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Uncommon Curative Reagent', qty: 1, unit: 'dose'  },
      { name: 'Primal Common Essence',     qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Animal Friendship', qty: 1, category: 'potion', weight: 0.5, value: 145 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_fire_breath', category: 'potion', name: 'Potion of Fire Breath (Kibbles)',
    icon: '🐉', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Bonus action: exhale fire at target within 30 ft, 4d6 fire (DC 13 DEX). Three uses or 1 hour.',
    flavorText: '"Orange liquid flickers. Smoke wafts from the cork."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Fire Breath', qty: 1, category: 'potion', weight: 0.5, value: 75 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_growth', category: 'potion', name: 'Potion of Growth (Kibbles)',
    icon: '📈', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Gain the "enlarge" effect of enlarge/reduce for 1d4 hours (no concentration).',
    flavorText: '"Red liquid expands from a tiny bead — shaking won\'t mix it."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Curative Reagent', qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Growth', qty: 1, category: 'potion', weight: 0.5, value: 115 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_poison', category: 'potion', name: 'Potion of Poison (Kibbles)',
    icon: '☠️', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Disguised as a healing potion. 3d6 poison + DC 13 CON or poisoned, taking 3d6/turn (save ends).',
    flavorText: '"Looks, smells, and tastes like a healing potion. Insidious."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Poisonous Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                 qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Poison', qty: 1, category: 'potion', weight: 0.5, value: 65 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_resistance', category: 'potion', name: 'Potion of Resistance (Kibbles)',
    icon: '🔵', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain resistance to one damage type for 1 hour. Type chosen at crafting (swap essence for necrotic/radiant/force/psychic).',
    flavorText: '"Color matches the element — swirling with its energy."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Primal Essence',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Common Curative Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Resistance', qty: 1, category: 'potion', weight: 0.5, value: 240 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_water_breathing', category: 'potion', name: 'Potion of Water Breathing (Kibbles)',
    icon: '🌊', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Breathe underwater for 1 hour. Cloudy green, smells of the sea.',
    flavorText: '"A jellyfish-like bubble floats within the cloudy green fluid."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',    qty: 1, unit: 'dose'  },
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                 qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Water Breathing', qty: 1, category: 'potion', weight: 0.5, value: 120 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_clairvoyance', category: 'potion', name: 'Potion of Clairvoyance (Kibbles)',
    icon: '🔮', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'Gain the effect of the clairvoyance spell. Yellowish liquid with a bobbing eyeball.',
    flavorText: '"The eyeball vanishes when you open the bottle."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Rare Reactive Reagent',      qty: 2, unit: 'doses' },
      { name: 'Common Arcane Essence',      qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                 qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Clairvoyance', qty: 1, category: 'potion', weight: 0.5, value: 570 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_gaseous_form', category: 'potion', name: 'Potion of Gaseous Form (Kibbles)',
    icon: '💨', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'Gain gaseous form spell effect for 1 hour (no concentration). End as bonus action.',
    flavorText: '"Container holds fog that moves and pours like water."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent', qty: 2, unit: 'doses' },
      { name: 'Rare Curative Reagent',     qty: 1, unit: 'dose'  },
      { name: 'Rare Reactive Reagent',     qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Gaseous Form', qty: 1, category: 'potion', weight: 0.5, value: 560 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_heroism', category: 'potion', name: 'Potion of Heroism (Kibbles)',
    icon: '🦸', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain 10 temp HP + bless spell (no conc) for 1 hour. Blue liquid bubbles as if boiling.',
    flavorText: '"Blessed by divine essence — steams even in cold air."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Curative Reagent', qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Rare Curative Reagent',     qty: 2, unit: 'doses' },
      { name: 'Common Divine Essence',     qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Heroism', qty: 1, category: 'potion', weight: 0.5, value: 480 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_mind_reading', category: 'potion', name: 'Potion of Mind Reading (Kibbles)',
    icon: '🧠', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'Gain detect thoughts effect (DC 13, no conc) for 1 hour. Dense purple with pink cloud.',
    flavorText: '"The ovoid pink cloud shifts as if listening."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Rare Poisonous Reagent',     qty: 1, unit: 'dose'  },
      { name: 'Rare Reactive Reagent',      qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                 qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Mind Reading', qty: 1, category: 'potion', weight: 0.5, value: 550 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_potion_flying', category: 'potion', name: 'Potion of Flying (Kibbles)',
    icon: '🕊️', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 19 },
    description: 'Flying speed equal to walking speed + hover for 1 hour. Falls if wears off mid-air.',
    flavorText: '"Clear liquid floats atop the container with cloudy white impurities."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',  qty: 2, unit: 'doses' },
      { name: 'Rare Curative Reagent',      qty: 2, unit: 'doses' },
      { name: 'Very Rare Reactive Reagent', qty: 2, unit: 'doses' },
      { name: 'Uncommon Primal Essence',    qty: 1, unit: 'dose'  },
      { name: 'Uncommon Arcane Essence',    qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Flying', qty: 1, category: 'potion', weight: 0.5, value: 5500 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_potion_invisibility', category: 'potion', name: 'Potion of Invisibility (Kibbles)',
    icon: '👻', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 19 },
    description: 'Become invisible for 1 hour. Ends early if you attack or cast a spell.',
    flavorText: '"Container looks empty but feels full. Handle with care."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',   qty: 2, unit: 'doses' },
      { name: 'Rare Curative Reagent',       qty: 2, unit: 'doses' },
      { name: 'Very Rare Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Very Rare Curative Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Invisibility', qty: 1, category: 'potion', weight: 0.5, value: 5200 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_potion_speed', category: 'potion', name: 'Potion of Speed (Kibbles)',
    icon: '⚡', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 20 },
    description: 'Gain the haste spell effect for 1 minute (no concentration).',
    flavorText: '"Yellow fluid streaked with black, swirling on its own."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',   qty: 2, unit: 'doses' },
      { name: 'Rare Reactive Reagent',       qty: 2, unit: 'doses' },
      { name: 'Very Rare Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Very Rare Curative Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Rare Arcane Essence',         qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Speed', qty: 1, category: 'potion', weight: 0.5, value: 6150 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },

  // ── KIBBLES CONCOCTIONS ───────────────────────────────────
  {
    id: 'kib_alchemical_acid', category: 'alchemy', name: 'Alchemical Acid',
    icon: '🧫', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Throw (20/60 ft). Deals 4d4 acid on hit. No modifier to damage roll.',
    flavorText: '"Hissing green viscous liquid — don\'t let it touch you."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',   qty: 2, unit: 'doses' },
      { name: 'Common Poisonous Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Glass Flask',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Alchemical Acid', qty: 1, category: 'misc', weight: 1, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_alchemical_fire', category: 'alchemy', name: 'Alchemical Fire',
    icon: '🔥', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Throw (20/60 ft). Deals 2d10 fire on hit. No modifier to damage roll.',
    flavorText: '"Volatile orange liquid. Highly flammable."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent', qty: 3, unit: 'doses' },
      { name: 'Glass Flask',             qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Alchemical Fire', qty: 1, category: 'misc', weight: 1, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_alchemical_napalm', category: 'alchemy', name: 'Alchemical Napalm',
    icon: '🔥', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Throw (20/60 ft). Deals 3d4 fire + continues burning 1d4/turn for 1 min (action to extinguish).',
    flavorText: '"Sticky flammable substance — once lit, hard to stop."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',  qty: 3, unit: 'doses' },
      { name: 'Common Curative Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Glass Flask',              qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Alchemical Napalm', qty: 1, category: 'misc', weight: 1, value: 70 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_bottled_wind', category: 'alchemy', name: 'Bottled Wind',
    icon: '💨', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Open to cast gust OR breathe from it for up to 10 min of breathable air (DC 5 Athletics per sip or all escapes).',
    flavorText: '"A sealed breath of pure air — useful in tight spaces."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent', qty: 2, unit: 'doses' },
      { name: 'Glass Flask',             qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Bottled Wind', qty: 1, category: 'misc', weight: 0.5, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_sticky_goo', category: 'alchemy', name: 'Sticky Goo',
    icon: '🕸️', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Throw at a point within 30 ft. On impact creates a web effect (as the web spell) centered there.',
    flavorText: '"Rapidly expanding web foam — throw and watch chaos unfold."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',  qty: 3, unit: 'doses' },
      { name: 'Glass Flask',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Sticky Goo Potion', qty: 1, category: 'misc', weight: 1, value: 140 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_liquid_lightning', category: 'alchemy', name: 'Liquid Lightning',
    icon: '⚡', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'For 1 min: bonus action teleport as lightning bolt 30 ft. Immune to lightning. Creatures in path: DC 15 DEX or 3d6 lightning.',
    flavorText: '"Stormy liquid arcs with tiny bolts of lightning inside."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Rare Reactive Reagent',     qty: 2, unit: 'doses' },
      { name: 'Uncommon Primal Essence',   qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Liquid Lightning', qty: 1, category: 'potion', weight: 0.5, value: 640 },
    sourceRule: "Kibbles' Crafting Guide p.27 (DS)"
  },

  // ── KIBBLES OILS ─────────────────────────────────────────
  {
    id: 'kib_burning_oil', category: 'alchemy', name: 'Burning Oil',
    icon: '🔥', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 13 },
    description: 'Coat a weapon and ignite it. For 1 min: +1d4 fire damage and 20-ft bright / 20-ft dim light.',
    flavorText: '"Orange oil that ignites on contact with air."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent', qty: 2, unit: 'doses' },
      { name: 'Glass Vial',              qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Burning Oil', qty: 1, category: 'misc', weight: 0.5, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_frost_oil', category: 'alchemy', name: 'Frost Oil',
    icon: '❄️', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Coat a weapon with icy crystals. For 1 min: +1d6 cold damage on hit.',
    flavorText: '"The weapon freezes over — icy crystals form along the blade."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Common Primal Essence',    qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Frost Oil', qty: 1, category: 'misc', weight: 0.5, value: 75 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_silver_oil', category: 'alchemy', name: 'Silver Oil',
    icon: '🪙', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Coat a weapon. For 1 hour it is considered silvered (bypasses lycanthrope/undead resistances).',
    flavorText: '"A sparkling chromatic oil — economical silvering solution."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Silver Scraps',            qty: 4, unit: 'pieces' },
      { name: 'Common Reactive Reagent',  qty: 1, unit: 'dose'   },
      { name: 'Glass Vial',               qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Silver Oil', qty: 1, category: 'misc', weight: 0.5, value: 20 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_flametongue_oil', category: 'alchemy', name: 'Flametongue Oil',
    icon: '🔥', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'Coat a weapon and ignite it. For 1 min: +2d6 fire and 20-ft bright / 20-ft dim light.',
    flavorText: '"An upgrade to burning oil — the flames roar louder."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent', qty: 2, unit: 'doses' },
      { name: 'Common Arcane Essence',     qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Flametongue Oil', qty: 1, category: 'misc', weight: 0.5, value: 170 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_oil_sharpness', category: 'alchemy', name: 'Oil of Sharpness (Kibbles)',
    icon: '⚔️', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 19 },
    description: 'Coat a slashing/piercing weapon or 5 ammo. For 1 hour: magical, +3 bonus to attack and damage rolls.',
    flavorText: '"Clear gelatinous oil sparkles with ultrathin silver shards."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Rare Poisonous Reagent',      qty: 1, unit: 'dose'  },
      { name: 'Very Rare Reactive Reagent',  qty: 2, unit: 'doses' },
      { name: 'Precious Metal Flakes',       qty: 1, unit: 'set (300 gp)' },
      { name: 'Crystal Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Oil of Sharpness', qty: 1, category: 'misc', weight: 0.5, value: 5200 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },

  // ── KIBBLES MAGICAL INKS ──────────────────────────────────
  {
    id: 'kib_ink_common', category: 'magic', name: 'Common Magical Ink',
    icon: '🖊️', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 10 },
    description: 'Used by Enchanters and Scrollscribers to create common magical scrolls.',
    flavorText: '"Rendered from alchemical ingredients — faintly luminescent."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Alchemical Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Common Magical Ink', qty: 1, category: 'misc', weight: 0.1, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_ink_uncommon', category: 'magic', name: 'Uncommon Magical Ink',
    icon: '🖊️', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Ink for scribing uncommon-level spell scrolls.',
    flavorText: '"A richer ink — uncommon reagents render into concentrated form."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Alchemical Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                  qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Uncommon Magical Ink', qty: 1, category: 'misc', weight: 0.1, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_ink_rare', category: 'magic', name: 'Rare Magical Ink',
    icon: '🖊️', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Ink for scribing rare-level spell scrolls.',
    flavorText: '"Rare reagents distilled to pure magic — glows faintly blue."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Rare Alchemical Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',              qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Rare Magical Ink', qty: 1, category: 'misc', weight: 0.1, value: 200 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },

  // ── KIBBLES EXPLOSIVES ───────────────────────────────────
  {
    id: 'kib_smoke_powder', category: 'explosive', name: 'Smoke Powder',
    icon: '💨', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Ignite to release thick black smoke filling 20-ft radius — heavily obscured for 2d4 rounds.',
    flavorText: '"Fine grey powder with the faint smell of sulfur and charcoal."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent', qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Smoke Powder (packet)', qty: 1, category: 'misc', weight: 0.5, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_blasting_powder', category: 'explosive', name: 'Blasting Powder',
    icon: '💥', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Ignite: all within 10 ft — DC 14 DEX or 1d4 fire + 1d4 thunder. Scales with multiple packets. Double damage to structures.',
    flavorText: '"Used responsibly for mining. Until adventurers get it."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Reactive Reagent', qty: 2, unit: 'doses' },
    ],
    produces: { name: 'Blasting Powder (packet)', qty: 1, category: 'misc', weight: 0.5, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_simple_explosive', category: 'explosive', name: 'Simple Explosive',
    icon: '💣', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Throw 20 ft. Ignite to detonate: all in 10-ft radius — crafter Alchemy DC DEX or 1d8 fire + 1d8 thunder.',
    flavorText: '"Bundled alchemical preparation. Can be fused for delayed detonation."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Blasting Powder Packet',  qty: 2, unit: 'packets' },
      { name: 'Common Reactive Reagent', qty: 1, unit: 'dose'    },
      { name: 'Parts',                   qty: 2, unit: 'pieces'  },
      { name: 'Fancy Parts',             qty: 1, unit: 'piece'   },
      { name: 'Glass Flask',             qty: 1, unit: 'piece'   },
    ],
    produces: { name: 'Simple Explosive', qty: 1, category: 'misc', weight: 2, value: 120 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_potent_explosive', category: 'explosive', name: 'Potent Explosive',
    icon: '💣', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 17 },
    description: 'Throw 20 ft. 15-ft radius — crafter DC DEX or 2d8 fire + 2d8 thunder. Fusable.',
    flavorText: '"Bigger payload, wider blast. Handle with caution."',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Blasting Powder Packet',    qty: 4, unit: 'packets' },
      { name: 'Common Reactive Reagent',   qty: 1, unit: 'dose'    },
      { name: 'Parts',                     qty: 3, unit: 'pieces'  },
      { name: 'Uncommon Reactive Reagent', qty: 2, unit: 'doses'   },
      { name: 'Blasting Powder Packet',    qty: 1, unit: 'packet'  },
    ],
    produces: { name: 'Potent Explosive', qty: 1, category: 'misc', weight: 3, value: 250 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_grenade_casing', category: 'explosive', name: 'Grenade Casing',
    icon: '🤜', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 17 },
    description: 'Two-chamber projectile. Add Alchemical Fire + Explosive to create a grenade. Throw 60 ft. Explosion damage + 1d4 piercing + 1d4 fire.',
    flavorText: '"Remarkably dangerous when loaded. Keep compartments separate."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Parts',       qty: 2, unit: 'pieces' },
      { name: 'Fancy Parts', qty: 1, unit: 'piece'  },
      { name: 'Glass Flask', qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Grenade Casing (empty)', qty: 1, category: 'misc', weight: 1, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_nail_bomb', category: 'explosive', name: 'Nail Bomb',
    icon: '💢', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 17 },
    description: 'Throw 20 ft. When detonated: all within 20 ft — crafter DC DEX or 8d4 piercing (half on save). Fusable.',
    flavorText: '"Metal nails flung in all directions. Devastatingly brutal."',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Blasting Powder Packet',    qty: 8, unit: 'packets' },
      { name: 'Rare Reactive Reagent',     qty: 1, unit: 'dose'    },
    ],
    produces: { name: 'Nail Bomb', qty: 1, category: 'misc', weight: 4, value: 275 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },

  // ── KIBBLES POTIONS — ADDITIONAL ────────────────────────
  {
    id: 'kib_potion_hill_giant', category: 'potion', name: 'Potion of Hill Giant Strength (Kibbles)',
    icon: '💪', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Your STR score becomes 21 for 1 hour (no effect if already 21 or higher). Orange liquid with a floating giant\'s fingernail.',
    flavorText: '\"You feel the crude strength of the hills surge through you.\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Primal Essence',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Uncommon Curative Reagent', qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Potion of Hill Giant Strength', qty: 1, category: 'potion', weight: 0.5, value: 260 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_diminution', category: 'potion', name: 'Potion of Diminution (Kibbles)',
    icon: '📉', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Gain the "reduce" effect of enlarge/reduce for 1d4 hours (no concentration). Liquid continuously contracts inside the bottle.',
    flavorText: '\"The world grows impossibly large around you.\"',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Curative Reagent', qty: 1, unit: 'dose'  },
      { name: 'Rare Curative Reagent',     qty: 1, unit: 'dose'  },
      { name: 'Rare Poisonous Reagent',    qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Diminution', qty: 1, category: 'potion', weight: 0.5, value: 480 },
    sourceRule: "Kibbles' Crafting Guide p.26"
  },
  {
    id: 'kib_potion_storm_giant', category: 'potion', name: 'Potion of Storm Giant Strength (Kibbles)',
    icon: '⚡', rarity: 'legendary', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 23 },
    description: 'Your STR score becomes 29 for 1 hour. Translucent grey-green liquid with a storm cloud swirling inside.',
    flavorText: '\"Power of the storm itself flows through your veins.\"',
    timeHours: 8, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Legendary Reactive Reagent', qty: 1, unit: 'dose'  },
      { name: 'Legendary Curative Reagent', qty: 1, unit: 'dose'  },
      { name: 'Very Rare Primal Essence',   qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potion of Storm Giant Strength', qty: 1, category: 'potion', weight: 0.5, value: 25000 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_draught_damnation', category: 'potion', name: 'Draught of Damnation',
    icon: '😈', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'Drink to become a fiend (as shapechange) for 1 hour. Type determined by level (CR equal to level, max CR 10). Sticky red liquid with living viscosity.',
    flavorText: '\"Something older and darker than you stirs behind your eyes.\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Rare Reactive Reagent',    qty: 1, unit: 'dose'  },
      { name: 'Rare Poisonous Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Uncommon Arcane Essence',  qty: 1, unit: 'dose'  },
    ],
    produces: { name: 'Draught of Damnation', qty: 1, category: 'potion', weight: 0.5, value: 680 },
    sourceRule: "Kibbles' Crafting Guide p.26 (K)"
  },
  {
    id: 'kib_panacea', category: 'potion', name: 'Panacea',
    icon: '✨', rarity: 'legendary', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 24 },
    description: 'Cures all diseases, poisons, and conditions. Grants immunity to disease and poison for 1 week. Removes all levels of exhaustion. Extremely rare.',
    flavorText: '\"A legendary brew — curing all that ails you, and more.\"',
    timeHours: 8, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Legendary Curative Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Very Rare Curative Reagent',  qty: 2, unit: 'doses' },
      { name: 'Legendary Divine Essence',    qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Panacea', qty: 1, category: 'potion', weight: 0.5, value: 54000 },
    sourceRule: "Kibbles' Crafting Guide p.27 (K)"
  },

  // ── KIBBLES CONCOCTIONS — ADDITIONAL ─────────────────────
  {
    id: 'kib_potent_alchemical_acid', category: 'alchemy', name: 'Potent Alchemical Acid',
    icon: '🧫', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Throw (20/60 ft). Deals 6d4 acid on hit. No modifier to damage roll.',
    flavorText: '\"More concentrated — the hissing is louder now.\"',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',  qty: 2, unit: 'doses' },
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Flask',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potent Alchemical Acid', qty: 1, category: 'misc', weight: 1, value: 140 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_potent_alchemical_fire', category: 'alchemy', name: 'Potent Alchemical Fire',
    icon: '🔥', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Throw (20/60 ft). Deals 3d10 fire on hit. No modifier to damage roll.',
    flavorText: '\"Richer orange — burns significantly hotter.\"',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Reactive Reagent',  qty: 2, unit: 'doses' },
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Flask',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Potent Alchemical Fire', qty: 1, category: 'misc', weight: 1, value: 140 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_powerful_alchemical_acid', category: 'alchemy', name: 'Powerful Alchemical Acid',
    icon: '🧫', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 17 },
    description: 'Throw (20/60 ft). Deals 8d4 acid on hit. No modifier to damage roll.',
    flavorText: '\"At this concentration it dissolves metal on contact.\"',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Rare Reactive Reagent',  qty: 2, unit: 'doses' },
      { name: 'Rare Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Flask',            qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Powerful Alchemical Acid', qty: 1, category: 'misc', weight: 1, value: 690 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },
  {
    id: 'kib_powerful_alchemical_fire', category: 'alchemy', name: 'Powerful Alchemical Fire',
    icon: '🔥', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 17 },
    description: 'Throw (20/60 ft). Deals 4d10 fire on hit. No modifier to damage roll.',
    flavorText: '\"At peak concentration — a small contained inferno.\"',
    timeHours: 2, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Rare Reactive Reagent',  qty: 3, unit: 'doses' },
      { name: 'Glass Flask',            qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Powerful Alchemical Fire', qty: 1, category: 'misc', weight: 1, value: 690 },
    sourceRule: "Kibbles' Crafting Guide p.27"
  },

  // ── MAGICAL DUSTS ─────────────────────────────────────────
  {
    id: 'kib_dust_disappearance', category: 'alchemy', name: 'Dust of Disappearance',
    icon: '✨', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Sprinkle on a creature and all its gear. Invisible for 2d4 minutes. Neither detection nor dispel ends this invisibility early.',
    flavorText: '\"Ground from the wings of a shadow moth...\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Handful of Sand',          qty: 1, unit: 'handful' },
      { name: 'Common Arcane Essence',    qty: 1, unit: 'dose'    },
      { name: 'Common Reactive Reagent',  qty: 2, unit: 'doses'   },
      { name: 'Common Curative Reagent',  qty: 1, unit: 'dose'    },
    ],
    produces: { name: 'Dust of Disappearance', qty: 1, category: 'misc', weight: 0, value: 100 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_dust_dryness', category: 'alchemy', name: 'Dust of Dryness',
    icon: '💧', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 14 },
    description: 'Sprinkle over water to absorb up to 15 gallons into a marble-like pellet. Smash pellet to release water.',
    flavorText: '\"The water simply... vanishes. Stored as a tiny bead.\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Handful of Sand',           qty: 1, unit: 'handful' },
      { name: 'Common Primal Essence',     qty: 1, unit: 'dose'    },
      { name: 'Common Reactive Reagent',   qty: 1, unit: 'dose'    },
      { name: 'Common Poisonous Reagent',  qty: 1, unit: 'dose'    },
    ],
    produces: { name: 'Dust of Dryness', qty: 1, category: 'misc', weight: 0, value: 95 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_dust_sneezing', category: 'alchemy', name: 'Dust of Sneezing and Choking',
    icon: '🤧', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Inhaled. Release in 30-ft radius. DC 15 CON or incapacitated for 5d4 rounds, sneezing uncontrollably.',
    flavorText: '\"Looks like harmless grey powder — until it isn\'t.\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose' },
      { name: 'Common Reactive Reagent',    qty: 1, unit: 'dose' },
      { name: 'Common Poisonous Reagent',   qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Dust of Sneezing and Choking', qty: 1, category: 'misc', weight: 0, value: 130 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },

  // ── MISCELLANEOUS ALCHEMY ────────────────────────────────
  {
    id: 'kib_restorative_ointment', category: 'alchemy', name: 'Restorative Ointment',
    icon: '💊', rarity: 'uncommon', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 15 },
    description: 'Apply to a creature. Cures any disease, neutralizes any poison, and heals 2d8+2 hit points.',
    flavorText: '\"A divine salve — one touch and wounds begin to close.\"',
    timeHours: 8, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Common Divine Essence',    qty: 1, unit: 'dose'  },
      { name: 'Uncommon Curative Reagent', qty: 2, unit: 'doses'},
      { name: 'Common Curative Reagent',  qty: 3, unit: 'doses' },
    ],
    produces: { name: 'Restorative Ointment', qty: 1, category: 'misc', weight: 0.5, value: 250 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_sovereign_glue', category: 'alchemy', name: 'Sovereign Glue',
    icon: '🔗', rarity: 'legendary', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 22 },
    description: 'An adhesive so strong any joint it makes can only be separated by Universal Solvent or oil of etherealness.',
    flavorText: '\"Bond two things and they are bonded forever. Handle with extreme care.\"',
    timeHours: 16, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Legendary Curative Reagent',  qty: 1, unit: 'dose' },
      { name: 'Legendary Reactive Reagent',  qty: 1, unit: 'dose' },
      { name: 'Very Rare Divine Essence',    qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Sovereign Glue', qty: 1, category: 'misc', weight: 0.5, value: 25000 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_universal_solvent', category: 'alchemy', name: 'Universal Solvent',
    icon: '🫧', rarity: 'legendary', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 22 },
    description: 'Dissolves any adhesive, including sovereign glue. Liquid metal appearance.',
    flavorText: '\"One drop and any bond dissolves — even things that shouldn\'t.\"',
    timeHours: 16, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Legendary Poisonous Reagent', qty: 1, unit: 'dose' },
      { name: 'Legendary Reactive Reagent',  qty: 1, unit: 'dose' },
      { name: 'Very Rare Primal Essence',    qty: 1, unit: 'dose' },
    ],
    produces: { name: 'Universal Solvent', qty: 1, category: 'misc', weight: 0.5, value: 25000 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },

  // ── MAGICAL INK — ADDITIONAL ─────────────────────────────
  {
    id: 'kib_ink_very_rare', category: 'magic', name: 'Very Rare Magical Ink',
    icon: '🖊️', rarity: 'very rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 16 },
    description: 'Ink for scribing very rare-level spell scrolls. Glows with deep violet luminescence.',
    flavorText: '\"Very rare reagents distilled — the quill itself seems to glow.\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Very Rare Alchemical Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                   qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Very Rare Magical Ink', qty: 1, category: 'misc', weight: 0.1, value: 2000 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },
  {
    id: 'kib_ink_legendary', category: 'magic', name: 'Legendary Magical Ink',
    icon: '🖊️', rarity: 'legendary', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 18 },
    description: 'Ink for scribing legendary spell scrolls. A single vial contains condensed magical power.',
    flavorText: '\"Legendary reagents — the ink practically writes itself.\"',
    timeHours: 8, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Legendary Alchemical Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                   qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Legendary Magical Ink', qty: 1, category: 'misc', weight: 0.1, value: 5000 },
    sourceRule: "Kibbles' Crafting Guide p.29"
  },

  // ── KIBBLES EXPLOSIVES — ADDITIONAL ─────────────────────
  {
    id: 'kib_dwarven_alcohol', category: 'explosive', name: 'Dwarven Alcohol',
    icon: '🍺', rarity: 'common', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 12 },
    description: 'Explosively flammable liquid in a flask. Splash on 5-ft square, ignite with fire/lightning — deals 2d4 fire to creatures in 5-ft radius.',
    flavorText: '\"Only dwarves know if the name is a joke. It smells like it could fuel a forge.\"',
    timeHours: 8, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Flask of Alcohol',        qty: 1, unit: 'flask'  },
      { name: 'Common Reactive Reagent', qty: 1, unit: 'dose'   },
      { name: 'Sturdy Metal Flask',      qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Dwarven Alcohol', qty: 1, category: 'misc', weight: 1, value: 20 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },
  {
    id: 'kib_powerful_explosive', category: 'explosive', name: 'Powerful Explosive',
    icon: '💣', rarity: 'rare', dcCheck: { skill: 'Alchemist\'s Supplies', dc: 19 },
    description: 'Throw 20 ft. 20-ft radius — crafter DC DEX or 3d8 fire + 3d8 thunder (half on save). Fusable for delayed detonation.',
    flavorText: '\"Maximum payload. Handle with extreme caution and very long fuses.\"',
    timeHours: 4, toolRequired: "Alchemist's Supplies",
    ingredients: [
      { name: 'Blasting Powder Packet',  qty: 8, unit: 'packets' },
      { name: 'Rare Reactive Reagent',   qty: 1, unit: 'dose'    },
    ],
    produces: { name: 'Powerful Explosive', qty: 1, category: 'misc', weight: 4, value: 750 },
    sourceRule: "Kibbles' Crafting Guide p.28"
  },

  // ── KIBBLES POISONS — ADDITIONAL ────────────────────────────────────────────
  // ── KIBBLES POISONS ───────────────────────────────────────
  {
    id: 'kib_poison_injury_simple', category: 'poison', name: 'Simple Injury Poison',
    icon: '☠️', rarity: 'common', dcCheck: { skill: 'Poisoner\'s Kit', dc: 14 },
    description: 'Injury poison. On hit: crafter Poison DC CON or poisoned 1 min. Potent for 1 min, up to 5 hits.',
    flavorText: '"Basic but effective. Applied before combat."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Common Poisonous Reagent', qty: 2, unit: 'doses' },
      { name: 'Glass Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Simple Injury Poison', qty: 1, category: 'misc', weight: 0.5, value: 45 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_inhaled_simple', category: 'poison', name: 'Simple Inhaled Poison',
    icon: '🌫️', rarity: 'common', dcCheck: { skill: 'Poisoner\'s Kit', dc: 14 },
    description: 'Inhaled. Release in 5-ft cube or throw 30 ft. Crafter DC CON or poisoned 1 min.',
    flavorText: '"Powder or gas — even holding breath won\'t save you."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Common Poisonous Reagent',  qty: 2, unit: 'doses' },
      { name: 'Common Reactive Reagent',   qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Simple Inhaled Poison', qty: 1, category: 'misc', weight: 0.5, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_contact_simple', category: 'poison', name: 'Simple Contact Poison',
    icon: '🖐️', rarity: 'common', dcCheck: { skill: 'Poisoner\'s Kit', dc: 14 },
    description: 'Contact. First creature to touch with exposed skin: crafter DC CON or poisoned 1 min.',
    flavorText: '"Smeared on a surface — invisible and patient."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Common Poisonous Reagent', qty: 2, unit: 'doses' },
      { name: 'Glass Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Simple Contact Poison', qty: 1, category: 'misc', weight: 0.5, value: 60 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_dizzying', category: 'poison', name: 'Dizzying Touch',
    icon: '😵', rarity: 'common', dcCheck: { skill: 'Poisoner\'s Kit', dc: 12 },
    description: 'Contact. Crafter DC CON or poisoned 1 min — while poisoned, WIS save at end of each turn or fall prone.',
    flavorText: '"They\'ll look drunk without touching a drop."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Common Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Common Arcane Essence',    qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',               qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Dizzying Touch', qty: 1, category: 'misc', weight: 0.5, value: 35 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_burning_wound', category: 'poison', name: 'Burning Wound',
    icon: '🩸', rarity: 'uncommon', dcCheck: { skill: 'Poisoner\'s Kit', dc: 16 },
    description: 'Injury. Crafter DC CON or poisoned 1 min: takes 1d6 fire/turn and healing is halved. Save ends.',
    flavorText: '"The wound smolders from within."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Uncommon Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Common Reactive Reagent',    qty: 2, unit: 'doses' },
      { name: 'Glass Vial',                 qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Burning Wound', qty: 1, category: 'misc', weight: 0.5, value: 150 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_essence_ether', category: 'poison', name: 'Essence of Ether',
    icon: '💤', rarity: 'rare', dcCheck: { skill: 'Poisoner\'s Kit', dc: 16 },
    description: 'Inhaled. 5-ft radius. Crafter DC CON or poisoned 8 hours + unconscious. Wakes on damage or shaking.',
    flavorText: '"Odorless and tasteless. The deadliest kind."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Rare Poisonous Reagent',     qty: 1, unit: 'dose'  },
      { name: 'Uncommon Reactive Reagent',  qty: 1, unit: 'dose'  },
      { name: 'Uncommon Poisonous Reagent', qty: 2, unit: 'doses' },
      { name: 'Glass Vial',                 qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Essence of Ether', qty: 1, category: 'misc', weight: 0.5, value: 250 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_knockout', category: 'poison', name: 'Knockout Poison',
    icon: '💤', rarity: 'rare', dcCheck: { skill: 'Poisoner\'s Kit', dc: 16 },
    description: 'Injury. Crafter DC CON or poisoned 1 hour + unconscious (wakes on damage or shaking). Up to 5 hits.',
    flavorText: '"A classic tool of the assassin\'s trade."',
    timeHours: 2, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Rare Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Glass Vial',             qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Knockout Poison', qty: 1, category: 'misc', weight: 0.5, value: 270 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },
  {
    id: 'kib_poison_midnight_tears', category: 'poison', name: 'Midnight Tears',
    icon: '🌙', rarity: 'very rare', dcCheck: { skill: 'Poisoner\'s Kit', dc: 16 },
    description: 'Ingested. No effect until midnight — then crafter DC CON or 9d6 poison (half on save). Can be neutralized before midnight.',
    flavorText: '"A patient poison. The victim never sees it coming."',
    timeHours: 4, toolRequired: "Poisoner's Kit",
    ingredients: [
      { name: 'Very Rare Poisonous Reagent', qty: 1, unit: 'dose'  },
      { name: 'Crystal Vial',                qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Midnight Tears', qty: 1, category: 'misc', weight: 0.5, value: 2300 },
    sourceRule: "Kibbles' Crafting Guide p.37"
  },

  // ── KIBBLES BLACKSMITHING — WEAPONS ─────────────────────
  {
    id: 'kib_forge_javelin', category: 'weapon', name: 'Forge: Javelin',
    icon: '🔱', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 9 },
    description: 'Forge a javelin. Thrown (30/120). 1d6 piercing.',
    flavorText: '\"One ingot and a short haft — light and lethal at range.\"',
    timeHours: 2, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 1, unit: 'ingot' },
      { name: 'Short Haft',  qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Javelin', qty: 1, category: 'misc', weight: 2, value: 5 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_light_hammer', category: 'weapon', name: 'Forge: Light Hammer',
    icon: '🔨', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 9 },
    description: 'Forge a light hammer. Light, thrown (20/60). 1d4 bludgeoning.',
    flavorText: '\"One ingot, one short haft — light enough to throw.\"',
    timeHours: 2, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 1, unit: 'ingot' },
      { name: 'Short Haft',  qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Light Hammer', qty: 1, category: 'misc', weight: 2, value: 2 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_sickle', category: 'weapon', name: 'Forge: Sickle',
    icon: '⚒️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 9 },
    description: 'Forge a sickle. Light. 1d4 slashing.',
    flavorText: '\"One ingot and short haft — tool and weapon combined.\"',
    timeHours: 2, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 1, unit: 'ingot' },
      { name: 'Short Haft',  qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Sickle', qty: 1, category: 'misc', weight: 2, value: 1 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_dagger', category: 'weapon', name: 'Forge: Dagger',
    icon: '🗡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a standard dagger. Finesse, light, thrown (20/60). 1d4 piercing.',
    flavorText: '"Half an ingot of steel — quick and clean."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 1, unit: 'ingot (0.5)' },
    ],
    produces: { name: 'Dagger', qty: 1, category: 'misc', weight: 1, value: 2 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_handaxe', category: 'weapon', name: 'Forge: Handaxe',
    icon: '🪓', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a handaxe. Light, thrown (20/60). 1d6 slashing.',
    flavorText: '"One ingot and a short haft — balanced for throwing."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 1, unit: 'ingot' },
      { name: 'Short Haft',  qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Handaxe', qty: 1, category: 'misc', weight: 2, value: 5 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_mace', category: 'weapon', name: 'Forge: Mace',
    icon: '🔨', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a mace. 1d6 bludgeoning.',
    flavorText: '"Two ingots and a short haft — simple and brutal."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Mace', qty: 1, category: 'misc', weight: 4, value: 5 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_spear', category: 'weapon', name: 'Forge: Spear',
    icon: '🔱', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a spear. Thrown (20/60), versatile (1d8). 1d6 piercing.',
    flavorText: '"An ingot and a long haft — reach and range."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 1, unit: 'ingot' },
      { name: 'Long Haft',   qty: 1, unit: 'piece' },
    ],
    produces: { name: 'Spear', qty: 1, category: 'misc', weight: 3, value: 1 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_longsword', category: 'weapon', name: 'Forge: Longsword',
    icon: '⚔️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a longsword. Versatile (1d10). 1d8 slashing.',
    flavorText: '"Four ingots of steel — the classic weapon of the realm."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 4, unit: 'ingots' },
    ],
    produces: { name: 'Longsword', qty: 1, category: 'misc', weight: 3, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_greatsword', category: 'weapon', name: 'Forge: Greatsword',
    icon: '⚔️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a greatsword. Heavy, two-handed. 2d6 slashing.',
    flavorText: '"Ten ingots of steel. Impressive — and heavy."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 10, unit: 'ingots' },
    ],
    produces: { name: 'Greatsword', qty: 1, category: 'misc', weight: 6, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_battleaxe', category: 'weapon', name: 'Forge: Battleaxe',
    icon: '🪓', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a battleaxe. Versatile (1d10). 1d8 slashing.',
    flavorText: '"Three ingots and a short haft — the warrior\'s axe."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 3, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Battleaxe', qty: 1, category: 'misc', weight: 4, value: 10 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_rapier', category: 'weapon', name: 'Forge: Rapier',
    icon: '🗡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a rapier. Finesse. 1d8 piercing.',
    flavorText: '"Four ingots — precise and elegant."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 4, unit: 'ingots' },
    ],
    produces: { name: 'Rapier', qty: 1, category: 'misc', weight: 2, value: 25 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_warhammer', category: 'weapon', name: 'Forge: Warhammer',
    icon: '🔨', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a warhammer. Versatile (1d10). 1d8 bludgeoning.',
    flavorText: '"A classic of dwarven craft — built to last."',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 4, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Warhammer', qty: 1, category: 'misc', weight: 2, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },

  {
    id: 'kib_forge_flail', category: 'weapon', name: 'Forge: Flail',
    icon: '⛓️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a flail. 1d8 bludgeoning.',
    flavorText: '\"Two ingots, short haft, and a short chain — a classic militia weapon.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots'     },
      { name: 'Short Haft',  qty: 1, unit: 'piece'      },
      { name: 'Short Chain', qty: 1, unit: 'piece'      },
    ],
    produces: { name: 'Flail', qty: 1, category: 'misc', weight: 2, value: 10 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_glaive', category: 'weapon', name: 'Forge: Glaive',
    icon: '🗡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge a glaive. Heavy, reach, two-handed. 1d10 slashing.',
    flavorText: '\"Four ingots on a long haft — elegant polearm reach.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 4, unit: 'ingots' },
      { name: 'Long Haft',   qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Glaive', qty: 1, category: 'misc', weight: 6, value: 20 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_greataxe', category: 'weapon', name: 'Forge: Greataxe',
    icon: '🪓', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge a greataxe. Heavy, two-handed. 1d12 slashing.',
    flavorText: '\"Eight ingots and a short haft — brutal cleaving power.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 8, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Greataxe', qty: 1, category: 'misc', weight: 7, value: 30 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_halberd', category: 'weapon', name: 'Forge: Halberd',
    icon: '⚔️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 15 },
    description: 'Forge a halberd. Heavy, reach, two-handed. 1d10 slashing.',
    flavorText: '\"Four ingots on a long haft — reach and raw cutting power.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 4, unit: 'ingots' },
      { name: 'Long Haft',   qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Halberd', qty: 1, category: 'misc', weight: 6, value: 20 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_maul', category: 'weapon', name: 'Forge: Maul',
    icon: '🔨', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a maul. Heavy, two-handed. 2d6 bludgeoning.',
    flavorText: '\"Eight ingots and a short haft — crushing power, plain and simple.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 8, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Maul', qty: 1, category: 'misc', weight: 10, value: 10 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_morningstar', category: 'weapon', name: 'Forge: Morningstar',
    icon: '⭐', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge a morningstar. 1d8 piercing.',
    flavorText: '\"Four ingots and a short haft — spikes do the talking.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 4, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Morningstar', qty: 1, category: 'misc', weight: 4, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_pike', category: 'weapon', name: 'Forge: Pike',
    icon: '🔱', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a pike. Heavy, reach, two-handed. 1d10 piercing.',
    flavorText: '\"Three ingots on a long haft — the phalanx\'s best friend.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 3, unit: 'ingots' },
      { name: 'Long Haft',   qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Pike', qty: 1, category: 'misc', weight: 18, value: 5 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_scimitar', category: 'weapon', name: 'Forge: Scimitar',
    icon: '🗡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge a scimitar. Finesse, light. 1d6 slashing.',
    flavorText: '\"Two ingots curved to a point — elegant and quick.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots' },
    ],
    produces: { name: 'Scimitar', qty: 1, category: 'misc', weight: 3, value: 25 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_shortsword', category: 'weapon', name: 'Forge: Shortsword',
    icon: '🗡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a shortsword. Finesse, light. 1d6 piercing.',
    flavorText: '\"Two ingots of steel — compact and reliable in close quarters.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots' },
    ],
    produces: { name: 'Shortsword', qty: 1, category: 'misc', weight: 2, value: 10 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },
  {
    id: 'kib_forge_war_pick', category: 'weapon', name: 'Forge: War Pick',
    icon: '⛏️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 12 },
    description: 'Forge a war pick. 1d8 piercing.',
    flavorText: '\"Two ingots and a short haft — punctures armor with precision.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots' },
      { name: 'Short Haft',  qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'War Pick', qty: 1, category: 'misc', weight: 2, value: 5 },
    sourceRule: "Kibbles' Crafting Guide p.43"
  },

  // ── KIBBLES BLACKSMITHING — ARMOR ────────────────────────
  {
    id: 'kib_forge_shield', category: 'armor', name: 'Forge: Shield',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 10 },
    description: 'Forge a standard shield. +2 AC.',
    flavorText: '"Two ingots and some labor — a life-saving investment."',
    timeHours: 6, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots' },
    ],
    produces: { name: 'Shield', qty: 1, category: 'misc', weight: 6, value: 10 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_chain_shirt', category: 'armor', name: 'Forge: Chain Shirt',
    icon: '🦺', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge chain shirt. AC 13 + DEX (max 2). 14 hours total work.',
    flavorText: '"Hundreds of interlocking rings — patience rewarded."',
    timeHours: 14, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 5, unit: 'ingots' },
    ],
    produces: { name: 'Chain Shirt', qty: 1, category: 'misc', weight: 20, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_scale_mail', category: 'armor', name: 'Forge: Scale Mail',
    icon: '🦺', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge scale mail. AC 14 + DEX (max 2). Disadvantage on Stealth.',
    flavorText: '"Eight ingots of overlapping scales — medium protection."',
    timeHours: 14, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 8, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Scale Mail', qty: 1, category: 'misc', weight: 45, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_half_plate', category: 'armor', name: 'Forge: Half Plate',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 16 },
    description: 'Forge half plate. AC 15 + DEX (max 2). Disadvantage on Stealth. 16 hours.',
    flavorText: '"Sixteen ingots — protection and some mobility."',
    timeHours: 16, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 16, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1,  unit: 'piece'  },
    ],
    produces: { name: 'Half Plate', qty: 1, category: 'misc', weight: 40, value: 400 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_plate', category: 'armor', name: 'Forge: Plate Armor',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 17 },
    description: 'Forge full plate armor. AC 18. Disadvantage on Stealth. STR 15 required. 56 hours — 28 checks.',
    flavorText: '"Thirty ingots and days of labor — the pinnacle of mundane armor."',
    timeHours: 56, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 30, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1,  unit: 'piece'  },
    ],
    produces: { name: 'Plate Armor', qty: 1, category: 'armor', weight: 65, value: 1500 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },

  {
    id: 'kib_forge_breastplate', category: 'armor', name: 'Forge: Breastplate',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 16 },
    description: 'Forge a breastplate. AC 14 + DEX (max 2). No stealth disadvantage. 16 hours.',
    flavorText: '\"Ten ingots — solid chest protection, flexible enough to move.\"',
    timeHours: 16, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 10, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1,  unit: 'piece'  },
    ],
    produces: { name: 'Breastplate', qty: 1, category: 'armor', weight: 20, value: 400 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_ring_mail', category: 'armor', name: 'Forge: Ring Mail',
    icon: '🦺', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 11 },
    description: 'Forge ring mail. AC 14. Disadvantage on Stealth. 10 hours.',
    flavorText: '\"Four ingots and padding — rings sewn over leather. Classic protection.\"',
    timeHours: 10, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 4, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Ring Mail', qty: 1, category: 'armor', weight: 40, value: 30 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_chain_mail', category: 'armor', name: 'Forge: Chain Mail',
    icon: '🦺', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge chain mail. AC 16. Disadvantage on Stealth. STR 13 required. 14 hours.',
    flavorText: '\"Nine interlocking rings — heavy but effective.\"',
    timeHours: 14, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 9, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Chain Mail', qty: 1, category: 'armor', weight: 55, value: 75 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_splint', category: 'armor', name: 'Forge: Splint Armor',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 14 },
    description: 'Forge splint armor. AC 17. Disadvantage on Stealth. STR 15 required. 28 hours.',
    flavorText: '\"Twelve ingots — strips of metal riveted to backing. Imposing.\"',
    timeHours: 28, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',   qty: 12, unit: 'ingots' },
      { name: 'Armor Padding', qty: 1,  unit: 'piece'  },
    ],
    produces: { name: 'Splint Armor', qty: 1, category: 'armor', weight: 60, value: 200 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_tower_shield', category: 'armor', name: 'Forge: Tower Shield',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge a tower shield. Reduces speed by 10 ft. Pick direction each turn: half cover from attacks in that cone. Or track one target for half cover against their attacks.',
    flavorText: '\"Eight ingots — massive and unwieldy, but an impenetrable wall.\"',
    timeHours: 10, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 8, unit: 'ingots' },
    ],
    produces: { name: 'Tower Shield', qty: 1, category: 'misc', weight: 25, value: 50 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_spiked_shield', category: 'armor', name: 'Forge: Spiked Shield',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge a spiked shield. Functions as shield (+2 AC) and martial melee weapon (1d4 piercing damage on hit).',
    flavorText: '\"Two ingots — shield and weapon in one. Efficient.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 2, unit: 'ingots' },
    ],
    produces: { name: 'Spiked Shield', qty: 1, category: 'misc', weight: 8, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },
  {
    id: 'kib_forge_bracers', category: 'armor', name: 'Forge: Bracers',
    icon: '🛡️', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 13 },
    description: 'Forge bracers. While wearing and no shield: reaction to a hit — add +2 AC against triggering attack.',
    flavorText: '\"Three ingots shaped to the arm — a duelist\'s best backup.\"',
    timeHours: 8, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot', qty: 3, unit: 'ingots' },
    ],
    produces: { name: 'Bracers', qty: 1, category: 'misc', weight: 4, value: 40 },
    sourceRule: "Kibbles' Crafting Guide p.44"
  },

  // ── FIREARMS ─────────────────────────────────────────────
  {
    id: 'kib_forge_firearm_ammo', category: 'weapon', name: 'Forge: Firearm Ammunition (20)',
    icon: '🔫', rarity: 'common', dcCheck: { skill: 'Smith\'s Tools', dc: 15 },
    description: 'Craft 20 rounds of firearm ammunition from lead ingots and blasting powder.',
    flavorText: '\"Lead and powder — simple but essential for any gun.\"',
    timeHours: 4, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Lead Ingot',                qty: 2, unit: 'ingots'  },
      { name: 'Blasting Powder Packet',    qty: 1, unit: 'packet'  },
    ],
    produces: { name: 'Firearm Ammunition', qty: 20, category: 'ammo', weight: 2, value: 4 },
    sourceRule: "Kibbles' Crafting Guide p.45"
  },
  {
    id: 'kib_forge_pistol', category: 'weapon', name: 'Forge: Pistol',
    icon: '🔫', rarity: 'uncommon', dcCheck: { skill: 'Smith\'s Tools', dc: 16 },
    description: 'Forge a pistol. Ranged weapon, ammunition (30/90), light, loading. 1d10 piercing. Loud.',
    flavorText: '\"Three ingots, four parts, two fancy — precision metal work.\"',
    timeHours: 16, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',  qty: 3, unit: 'ingots' },
      { name: 'Parts',        qty: 4, unit: 'pieces' },
      { name: 'Fancy Parts',  qty: 2, unit: 'pieces' },
    ],
    produces: { name: 'Pistol', qty: 1, category: 'misc', weight: 3, value: 250 },
    sourceRule: "Kibbles' Crafting Guide p.45"
  },
  {
    id: 'kib_forge_musket', category: 'weapon', name: 'Forge: Musket',
    icon: '🔫', rarity: 'uncommon', dcCheck: { skill: 'Smith\'s Tools', dc: 17 },
    description: 'Forge a musket. Ammunition (40/120), two-handed, loading. 1d12 piercing. Loud.',
    flavorText: '\"Six ingots, four parts, two fancy — long barrel for long range.\"',
    timeHours: 16, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',  qty: 6, unit: 'ingots' },
      { name: 'Parts',        qty: 4, unit: 'pieces' },
      { name: 'Fancy Parts',  qty: 2, unit: 'pieces' },
    ],
    produces: { name: 'Musket', qty: 1, category: 'misc', weight: 10, value: 400 },
    sourceRule: "Kibbles' Crafting Guide p.45"
  },
  {
    id: 'kib_forge_shotgun', category: 'weapon', name: 'Forge: Shotgun',
    icon: '🔫', rarity: 'uncommon', dcCheck: { skill: 'Smith\'s Tools', dc: 19 },
    description: 'Forge a shotgun. Ammunition (15/45), two-handed, loading, scatter. 2d8 piercing. Loud. Scatter: targets in 15-ft cone make DC 15 DEX or take 2d8.',
    flavorText: '\"Eight ingots and esoteric parts — brutal up close.\"',
    timeHours: 32, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',    qty: 8, unit: 'ingots' },
      { name: 'Parts',          qty: 4, unit: 'pieces' },
      { name: 'Fancy Parts',    qty: 2, unit: 'pieces' },
      { name: 'Esoteric Parts', qty: 2, unit: 'pieces' },
    ],
    produces: { name: 'Shotgun', qty: 1, category: 'misc', weight: 7, value: 2425 },
    sourceRule: "Kibbles' Crafting Guide p.45"
  },
  {
    id: 'kib_forge_thunder_cannon', category: 'weapon', name: 'Forge: Thunder Cannon',
    icon: '⚡', rarity: 'uncommon', dcCheck: { skill: 'Smith\'s Tools', dc: 17 },
    description: 'Forge a Thunder Cannon. Requires attunement. Ammunition (60/180), two-handed, loud, stormcharged. 1d12 piercing. Stormcharged: single attack per action — forego extra attacks for +3d6 lightning/thunder each.',
    flavorText: '\"Six ingots, magic essence, parts — the thundersmith\'s signature weapon.\"',
    timeHours: 8, toolRequired: "Smith's Tools",
    ingredients: [
      { name: 'Steel Ingot',               qty: 6, unit: 'ingots' },
      { name: 'Uncommon Primal Essence',   qty: 2, unit: 'doses'  },
      { name: 'Uncommon Arcane Essence',   qty: 2, unit: 'doses'  },
      { name: 'Parts',                     qty: 4, unit: 'pieces' },
      { name: 'Fancy Parts',               qty: 2, unit: 'pieces' },
      { name: 'Esoteric Part',             qty: 1, unit: 'piece'  },
    ],
    produces: { name: 'Thunder Cannon', qty: 1, category: 'misc', weight: 10, value: 1000 },
    sourceRule: "Kibbles' Crafting Guide p.45"
  },

  // ── KIBBLES COOKING ───────────────────────────────────────
  {
    id: 'kib_iron_rations', category: 'food', name: 'Iron Rations ×10',
    icon: '🍖', rarity: 'common', dcCheck: { skill: 'Cook\'s Utensils', dc: 8 },
    description: 'Prepare 10 days of Iron Rations — dense, calorie-packed provisions for long journeys.',
    flavorText: '"Hardtack, jerky, and dried fruit. Not tasty, but it keeps."',
    timeHours: 1, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Common Supplies', qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Iron Rations', qty: 10, category: 'food', weight: 10, value: 2 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },
  {
    id: 'kib_common_feast', category: 'food', name: 'Common Feast',
    icon: '🍗', rarity: 'common', dcCheck: { skill: 'Cook\'s Utensils', dc: 8 },
    description: 'Up to 5 creatures. Become satiated 24 h. Each gains +1 Hit Die on next long rest (cook\'s proficiency bonus if proficient).',
    flavorText: '"A proper meal surpassing any ration. The road is kinder after this."',
    timeHours: 1, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Fresh Ingredient', qty: 1, unit: 'portion' },
      { name: 'Uncommon Supplies',         qty: 1, unit: 'portion' },
      { name: 'Common Supplies',           qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Common Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 3 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_enhancing_feast', category: 'food', name: 'Enhancing Feast',
    icon: '🍖', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 14 },
    description: 'Feast for 5. Common feast benefits + trade Hit Dice for: temp HP (d4–d12 per die), spell slots, or Inspiration points.',
    flavorText: '"A meal that bolsters the spirit as much as the body."',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Meat',     qty: 1, unit: 'portion'  },
      { name: 'Uncommon Supplies', qty: 1, unit: 'portion'  },
      { name: 'Common Supplies',   qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Enhancing Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_meat_feast', category: 'food', name: 'Meat Feast',
    icon: '🥩', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 14 },
    description: 'Feast for 5. Common feast benefits + creature trait (Hold Breath, Keen Senses, Pounce, or Stone Camouflage) for 24 h.',
    flavorText: '"The essence of the creature flows into those who consume it."',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Creature Meat', qty: 1, unit: 'portion' },
      { name: 'Uncommon Supplies',      qty: 1, unit: 'portion' },
      { name: 'Common Supplies',        qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Meat Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 15 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_seaworthy_bouill', category: 'food', name: 'Seaworthy Bouillabaisse',
    icon: '🐟', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 12 },
    description: 'Feast for 5. Satiated 24 h. Immunity to sea sickness + advantage on DEX/CON saves vs. ship motion + half-proficiency with Water Vehicles.',
    flavorText: '"A sailor\'s blessing in a bowl."',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Aquatic Creature Meat', qty: 1, unit: 'portion'  },
      { name: 'Uncommon Supplies',              qty: 2, unit: 'portions' },
      { name: 'Common Supplies',                qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Seaworthy Bouillabaisse (serves 5)', qty: 1, category: 'food', weight: 5, value: 25 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_heroes_feast', category: 'food', name: "Heroes' Feast (Kibbles)",
    icon: '🍗', rarity: 'rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 18 },
    description: 'As the heroes\' feast spell — cures diseases/poison, grants immunity to poison/frightened, +2d10 max HP, advantage on WIS saves for 24 h.',
    flavorText: '"Real food, not conjured by magic. Somehow, more satisfying."',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Rare Curative Reagent', qty: 4, unit: 'doses'   },
      { name: 'Uncommon Divine Essence', qty: 2, unit: 'doses' },
      { name: 'Rare Supplies',         qty: 4, unit: 'portions' },
      { name: 'Common Supplies',       qty: 4, unit: 'portions' },
    ],
    produces: { name: "Heroes' Feast (serves 5)", qty: 1, category: 'food', weight: 5, value: 1500 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_elemental_feast', category: 'food', name: 'Elementally Fortifying Feast',
    icon: '🔥', rarity: 'rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 16 },
    description: 'Feast for 5. Choose element (Cold/Fire/Lightning). Advantage on saves + resistance to that damage type for 24 h.',
    flavorText: '"Cooked with elemental creature meat — the power lingers."',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Rare Creature Meat (elemental resistance)', qty: 1, unit: 'portion'  },
      { name: 'Uncommon Reactive Reagent',                 qty: 2, unit: 'doses'    },
      { name: 'Common Primal Essence',                     qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',                             qty: 2, unit: 'portions' },
      { name: 'Common Supplies',                           qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Elementally Fortifying Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 325 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_mint_chew', category: 'food', name: 'Mint Chew ×5',
    icon: '🌿', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 15 },
    description: 'Consume one as a bonus action. Gain 2d4+2 hit points (like a healing potion, as a snack).',
    flavorText: '"Tiny and green — underestimated by those who haven\'t eaten one."',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Curative Reagent', qty: 2, unit: 'doses'   },
      { name: 'Uncommon Supplies',         qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Mint Chew', qty: 5, category: 'food', weight: 0.5, value: 60 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },
  {
    id: 'kib_elvish_bread', category: 'food', name: 'Elvish Bread ×10',
    icon: '🍞', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 8 },
    description: 'Magical sustaining bread. A single piece satisfies all food/water needs for 1 day and grants advantage on exhaustion saves.',
    flavorText: '"Lembas-like waybread. Light, compact, and astonishingly filling."',
    timeHours: 6, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Curative Reagent', qty: 1, unit: 'dose'    },
      { name: 'Uncommon Supplies',         qty: 1, unit: 'portion' },
      { name: 'Common Supplies',           qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Elvish Bread', qty: 10, category: 'food', weight: 2, value: 60 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },

  // ── KIBBLES COOKING — FEASTS (ADDITIONAL) ───────────────
  {
    id: 'kib_what_kills_feast', category: 'food', name: 'What Doesn\'t Kill You Feast',
    icon: '☠️', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 16 },
    description: 'Feast for 5. Common feast benefits + immunity to the poison condition and advantage on CON saves vs. poison for 24 hours.',
    flavorText: '\"Cooked from a poison-dealing creature. What doesn\'t kill you makes you stronger.\"',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Meat (poison-dealing creature)', qty: 1, unit: 'portion'  },
      { name: 'Uncommon Poisonous Reagent',              qty: 2, unit: 'doses'    },
      { name: 'Uncommon Supplies',                       qty: 1, unit: 'portion'  },
      { name: 'Common Supplies',                         qty: 2, unit: 'portions' },
    ],
    produces: { name: "What Doesn't Kill You Feast (serves 5)", qty: 1, category: 'food', weight: 5, value: 110 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_wondrous_feast', category: 'food', name: 'Wondrous Feast',
    icon: '🍗', rarity: 'rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 16 },
    description: 'Feast for 5. Common feast benefits + one additional rare benefit from a rare fresh ingredient (e.g. truesight, blindsight, movement speed increase).',
    flavorText: '\"A rare ingredient transforms this from a meal into a legend.\"',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Rare Fresh Ingredient',  qty: 1, unit: 'portion'  },
      { name: 'Uncommon Reagent (any)', qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',          qty: 1, unit: 'portion'  },
      { name: 'Uncommon Supplies',      qty: 1, unit: 'portion'  },
      { name: 'Common Supplies',        qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Wondrous Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 150 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_hearty_meat_feast', category: 'food', name: 'Hearty Meat Feast',
    icon: '🥩', rarity: 'rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 16 },
    description: 'Feast for 5. Common feast benefits + creature trait from a rare creature (e.g. Legendary Resistance, Magic Resistance) for 24 hours.',
    flavorText: '\"The power of a truly dangerous creature flows into those who dine.\"',
    timeHours: 2, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Rare Meat',              qty: 1, unit: 'portion'  },
      { name: 'Uncommon Reagent (any)', qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',          qty: 1, unit: 'portion'  },
      { name: 'Uncommon Supplies',      qty: 1, unit: 'portion'  },
      { name: 'Common Supplies',        qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Hearty Meat Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 150 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_superb_feast', category: 'food', name: 'Superb Feast',
    icon: '🍗', rarity: 'very rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 18 },
    description: 'Feast for 5. Common feast benefits + powerful additional benefit from a very rare fresh ingredient.',
    flavorText: '\"Ingredients so rare that merely preparing them feels like magic.\"',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Very Rare Fresh Ingredient', qty: 1, unit: 'portion'  },
      { name: 'Rare Reagent (any)',         qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',              qty: 2, unit: 'portions' },
      { name: 'Uncommon Supplies',          qty: 2, unit: 'portions' },
      { name: 'Common Supplies',            qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Superb Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 300 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_superb_meat_feast', category: 'food', name: 'Superb Meat Feast',
    icon: '🥩', rarity: 'very rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 18 },
    description: 'Feast for 5. Common feast benefits + powerful creature trait from a very rare creature for 24 hours.',
    flavorText: '\"The essence of a near-mythical creature sustains and empowers.\"',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Very Rare Meat',         qty: 1, unit: 'portion'  },
      { name: 'Rare Reagent (any)',     qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',          qty: 2, unit: 'portions' },
      { name: 'Uncommon Supplies',      qty: 2, unit: 'portions' },
      { name: 'Common Supplies',        qty: 2, unit: 'portions' },
    ],
    produces: { name: 'Superb Meat Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 300 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_legendary_feast', category: 'food', name: 'Legendary Feast',
    icon: '👑', rarity: 'legendary', dcCheck: { skill: 'Cook\'s Utensils', dc: 20 },
    description: 'Feast for 5. Common feast benefits + legendary benefit from a legendary fresh ingredient. Truly transformative.',
    flavorText: '\"A meal spoken of in legend. Worth more than most kingdoms\' annual budgets.\"',
    timeHours: 6, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Legendary Fresh Ingredient', qty: 1, unit: 'portion'  },
      { name: 'Very Rare Reagent (any)',    qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',             qty: 3, unit: 'portions' },
      { name: 'Uncommon Supplies',         qty: 3, unit: 'portions' },
      { name: 'Common Supplies',           qty: 1, unit: 'portion'  },
    ],
    produces: { name: 'Legendary Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 3000 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },
  {
    id: 'kib_legendary_meat_feast', category: 'food', name: 'Legendary Meat Feast',
    icon: '👑', rarity: 'legendary', dcCheck: { skill: 'Cook\'s Utensils', dc: 20 },
    description: 'Feast for 5. Common feast benefits + legendary creature trait for 24 hours.',
    flavorText: '\"The power of a god-like creature compressed into a singular meal.\"',
    timeHours: 6, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Legendary Meat',          qty: 1, unit: 'portion'  },
      { name: 'Very Rare Reagent (any)', qty: 1, unit: 'dose'     },
      { name: 'Rare Supplies',           qty: 3, unit: 'portions' },
      { name: 'Uncommon Supplies',       qty: 3, unit: 'portions' },
      { name: 'Common Supplies',         qty: 1, unit: 'portion'  },
    ],
    produces: { name: 'Legendary Meat Feast (serves 5)', qty: 1, category: 'food', weight: 5, value: 3000 },
    sourceRule: "Kibbles' Crafting Guide p.54"
  },

  // ── KIBBLES SNACKS ───────────────────────────────────────
  {
    id: 'kib_flame_jerky', category: 'food', name: 'Flame Breathing Jerky ×5',
    icon: '🔥', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 15 },
    description: 'Bonus action: breathe fire at target within 30 ft — 4d6 fire, DC 13 DEX for half. Three uses or 1 hour. Dried from a fire-immune creature.',
    flavorText: '\"Still smolders faintly on the shelf. Handle near open flames with caution.\"',
    timeHours: 6, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Uncommon Meat (fire-immune creature)', qty: 1, unit: 'portion' },
      { name: 'Uncommon Reactive Reagent',            qty: 2, unit: 'doses'   },
      { name: 'Rare Supplies',                        qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Flame Breathing Jerky', qty: 5, category: 'food', weight: 0.5, value: 250 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },
  {
    id: 'kib_morph_cookies', category: 'food', name: 'Morph Cookies ×5',
    icon: '🍪', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 14 },
    description: 'Bonus action: transform into the shapeshifter the ingredient came from for up to 1 hour (as polymorph, no concentration).',
    flavorText: '\"The dough seems to shift shapes slightly before baking. Unsettling.\"',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Ingredient from Shapeshifter', qty: 1, unit: 'portion' },
      { name: 'Rare Supplies',                qty: 1, unit: 'portion' },
      { name: 'Uncommon Supplies',            qty: 1, unit: 'portion' },
      { name: 'Common Supplies',              qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Morph Cookie', qty: 5, category: 'food', weight: 0.5, value: 100 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },
  {
    id: 'kib_seeing_sticks', category: 'food', name: 'Seeing Sticks ×5',
    icon: '👁️', rarity: 'uncommon', dcCheck: { skill: 'Cook\'s Utensils', dc: 15 },
    description: 'Bonus action: gain blindsight or tremorsense (60 ft) for 1 hour, matching the sense of the creature the ingredient came from.',
    flavorText: '\"Dried and seasoned, they still seem to \'watch\' you from the pouch.\"',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Ingredient (blindsight/tremorsense creature)', qty: 1, unit: 'portion' },
      { name: 'Uncommon Reactive Reagent',                    qty: 1, unit: 'dose'    },
      { name: 'Rare Supplies',                                qty: 1, unit: 'portion' },
      { name: 'Common Supplies',                              qty: 1, unit: 'portion' },
    ],
    produces: { name: 'Seeing Stick', qty: 5, category: 'food', weight: 0.5, value: 125 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },
  {
    id: 'kib_quickening_candies', category: 'food', name: 'Quickening Candies ×5',
    icon: '⚡', rarity: 'rare', dcCheck: { skill: 'Cook\'s Utensils', dc: 18 },
    description: 'Bonus action: gain haste spell effect for 1 minute (no concentration).',
    flavorText: '\"They buzz on the tongue. Movement feels effortless after eating one.\"',
    timeHours: 4, toolRequired: "Cook's Utensils",
    ingredients: [
      { name: 'Rare Supplies',     qty: 1, unit: 'portion'  },
      { name: 'Uncommon Supplies', qty: 2, unit: 'portions' },
      { name: 'Common Supplies',   qty: 1, unit: 'portion'  },
    ],
    produces: { name: 'Quickening Candy', qty: 5, category: 'food', weight: 0.5, value: 150 },
    sourceRule: "Kibbles' Crafting Guide p.55"
  },

];

// ── Category Config ─────────────────────────────────────────
const CRAFT_CATEGORIES = [
  { id: 'all',       label: 'All',        icon: '⚗️'  },
  { id: 'available', label: 'Available',  icon: '✅'  },
  { id: 'food',      label: 'Food',       icon: '🍖'  },
  { id: 'potion',    label: 'Potions',    icon: '🧪'  },
  { id: 'alchemy',   label: 'Alchemy',    icon: '⚗'   },
  { id: 'poison',    label: 'Poisons',    icon: '☠️'  },
  { id: 'explosive', label: 'Explosives', icon: '💣'  },
  { id: 'weapon',    label: 'Weapons',    icon: '⚔️'  },
  { id: 'armor',     label: 'Armor',      icon: '🛡️'  },
  { id: 'tool',      label: 'Tools',      icon: '🔧'  },
  { id: 'magic',     label: 'Magic',      icon: '✨'  },
  { id: 'custom',    label: 'Custom',     icon: '📝'  },
];

const RARITY_STYLE = {
  common:     { color: '#b0b0b0', bg: 'rgba(140,140,140,0.12)', border: '#505050' },
  uncommon:   { color: '#4faa4f', bg: 'rgba(50,150,50,0.12)',   border: '#2a6a2a' },
  rare:       { color: '#4090e0', bg: 'rgba(40,100,220,0.12)',  border: '#204880' },
  'very rare':{ color: '#b070ee', bg: 'rgba(140,70,200,0.12)', border: '#6030a0' },
  legendary:  { color: '#f0a030', bg: 'rgba(210,140,20,0.12)', border: '#906020' },
};

// ── Inventory Helpers ────────────────────────────────────────
function craftGetInventory() {
  if (typeof data === 'undefined' || !data) return [];
  if (!Array.isArray(data.inventory)) data.inventory = [];
  return data.inventory;
}

function craftFindItem(name) {
  const inv = craftGetInventory();
  const needle = name.toLowerCase().trim();
  return inv.find(i => i.name && i.name.toLowerCase().trim() === needle);
}

function craftItemQty(name) {
  const item = craftFindItem(name);
  return item ? (parseInt(item.qty) || 0) : 0;
}

function craftHasIngredients(recipe) {
  return recipe.ingredients.every(ing => craftItemQty(ing.name) >= ing.qty);
}

function craftIngredientStatus(recipe) {
  return recipe.ingredients.map(ing => ({
    ...ing,
    have: craftItemQty(ing.name),
    enough: craftItemQty(ing.name) >= ing.qty,
  }));
}

function craftConsumeIngredients(recipe) {
  if (typeof data === 'undefined' || !data || !Array.isArray(data.inventory)) return;
  const inv = data.inventory;
  recipe.ingredients.forEach(ing => {
    const needle = ing.name.toLowerCase().trim();
    const item = inv.find(i => i.name && i.name.toLowerCase().trim() === needle);
    if (item) {
      item.qty = Math.max(0, (parseInt(item.qty) || 0) - ing.qty);
      if (item.qty === 0) {
        const idx = inv.indexOf(item);
        if (idx > -1) inv.splice(idx, 1);
      }
    }
  });
}

function craftAddToInventory(produced, recipe) {
  if (typeof data === 'undefined' || !data) return;
  if (!Array.isArray(data.inventory)) data.inventory = [];
  const inv = data.inventory;
  const needle = produced.name.toLowerCase().trim();
  const existing = inv.find(i => i.name && i.name.toLowerCase().trim() === needle);
  if (existing) {
    existing.qty = (parseInt(existing.qty) || 0) + produced.qty;
  } else {
    // Map crafting category → inventory _itemKind
    const kindMap = {
      weapon: 'weapon', armor: 'armor', magic: 'magic', ammo: undefined,
      potion: undefined, food: undefined, tool: undefined,
      alchemy: undefined, poison: undefined, explosive: undefined, misc: undefined,
    };
    const kind = kindMap[produced.category] ?? undefined;

    const item = {
      id: 'inv_' + Date.now(),
      name: produced.name,
      qty: produced.qty,
      weight: produced.weight ? String(produced.weight) + ' lb' : '',
      cost: produced.value ? String(produced.value) + ' GP' : '',
      notes: (recipe && recipe.description ? recipe.description : '') + (recipe ? ' [⚗ ' + recipe.name + ']' : ''),
      equipped: false,
      _itemKind: kind,
    };

    // Magic items get rarity
    if (kind === 'magic' && recipe) {
      item._rarity = recipe.rarity.charAt(0).toUpperCase() + recipe.rarity.slice(1);
    }

    inv.push(item);
  }
}

// ── Craft Action ─────────────────────────────────────────────
function craftExecute(recipe) {
  if (!craftHasIngredients(recipe)) {
    showToast('✕ Not enough ingredients!');
    return false;
  }
  craftConsumeIngredients(recipe);
  craftAddToInventory(recipe.produces, recipe);

  // Log entry
  const entry = {
    id: Date.now(),
    recipeName: recipe.name,
    produced: recipe.produces.name,
    qty: recipe.produces.qty,
    timestamp: new Date().toLocaleString(),
  };
  craftingState.craftingLog.unshift(entry);
  if (craftingState.craftingLog.length > 50) craftingState.craftingLog.pop();

  saveCraftingData();
  if (typeof _autoLog === 'function') _autoLog(`⚗ Crafted: ${recipe.produces.qty}× ${recipe.produces.name}`, 'Crafting');
  if (typeof renderInventory === 'function') renderInventory();
  if (typeof updateEncumbrance === 'function') updateEncumbrance();
  if (typeof calcEncumbrance === 'function') calcEncumbrance();
  if (typeof syncFoodFromInventory === 'function') syncFoodFromInventory();

  showToast(`✦ Crafted: ${recipe.produces.qty}× ${recipe.produces.name}`);
  renderCraftingTable();
  return true;
}

// ── Custom Recipe Management ─────────────────────────────────
function craftSaveCustomRecipe(recipe) {
  recipe.id = 'custom_' + Date.now();
  recipe.category = 'custom';
  craftingState.customRecipes.push(recipe);
  saveCraftingData();
  renderCraftingTable();
  showToast('✦ Custom recipe saved!');
}

function craftDeleteCustomRecipe(id) {
  craftingState.customRecipes = craftingState.customRecipes.filter(r => r.id !== id);
  if (craftingState.selectedRecipe && craftingState.selectedRecipe.id === id) {
    craftingState.selectedRecipe = null;
  }
  saveCraftingData();
  renderCraftingTable();
  showToast('Recipe deleted.');
}

// ── Get filtered recipe list ─────────────────────────────────
function craftGetRecipes() {
  const allRecipes = [...DND_RECIPES, ...craftingState.customRecipes];
  const cat = craftingState.activeCategory;
  const q   = craftingState.searchQuery.toLowerCase().trim();

  return allRecipes.filter(r => {
    const catMatch = cat === 'all' || cat === 'available'
      ? (cat === 'available' ? craftHasIngredients(r) : true)
      : r.category === cat;
    const qMatch   = !q || r.name.toLowerCase().includes(q) ||
                     r.description.toLowerCase().includes(q) ||
                     r.ingredients.some(i => i.name.toLowerCase().includes(q));
    return catMatch && qMatch;
  });
}

// ── Render ───────────────────────────────────────────────────
function renderCraftingTable() {
  const container = document.getElementById('tab-crafting');
  if (!container) return;
  loadCraftingData();

  const recipes = craftGetRecipes();
  const sel = craftingState.selectedRecipe;

  container.innerHTML = `
    <!-- ══════ CRAFTING TABLE HEADER ══════ -->
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div>
          <div style="font-family:'Cinzel',serif;font-size:26px;font-weight:900;color:var(--accent-gold);letter-spacing:2px;line-height:1;">
            ⚗ Crafting Table
          </div>
          <div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-muted);margin-top:2px;font-style:italic;">
            Camp Workshop — Forge, Brew & Cook
          </div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
          <button class="btn btn-primary btn-sm" onclick="craftShowCustomForm()" style="font-family:'Cinzel',serif;letter-spacing:1px;">
            + Custom Recipe
          </button>
          <button class="btn btn-silver btn-sm" onclick="craftToggleLog()" style="font-family:'Cinzel',serif;letter-spacing:1px;font-size:11px;">
            📋 Log (${craftingState.craftingLog.length})
          </button>
        </div>
      </div>
    </div>

    <!-- ══════ CRAFTING LOG (hidden by default) ══════ -->
    <div id="craftingLogPanel" style="display:none;margin-bottom:16px;">
      <div class="panel" style="background:linear-gradient(135deg,var(--bg-panel),var(--bg-deep));border-color:var(--border-gold);">
        <div style="font-family:'Cinzel',serif;font-size:13px;color:var(--accent-gold);letter-spacing:2px;margin-bottom:10px;">📋 CRAFTING LOG</div>
        ${craftingState.craftingLog.length === 0
          ? '<div style="font-family:\'Crimson Text\',serif;font-size:15px;color:var(--text-muted);font-style:italic;text-align:center;padding:10px;">No items crafted yet.</div>'
          : craftingState.craftingLog.map(e => `
            <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border-dark);font-family:'Cinzel',serif;font-size:12px;">
              <span style="color:var(--accent-gold);">✦ ${e.qty}× ${e.produced}</span>
              <span style="color:var(--text-muted);">${e.timestamp}</span>
            </div>
          `).join('')
        }
        <button class="btn btn-danger btn-sm" onclick="craftClearLog()" style="margin-top:8px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.5px;">Clear Log</button>
      </div>
    </div>

    <!-- ══════ CATEGORY TABS ══════ -->
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;">
      ${CRAFT_CATEGORIES.map(c => {
        const isActive = craftingState.activeCategory === c.id;
        const isAvail  = c.id === 'available';
        let activeStyle, inactiveStyle;
        if (isAvail) {
          activeStyle  = 'background:linear-gradient(135deg,#0a2a10,#0d3a16);border-color:#3a9a40;color:#6acc60;box-shadow:0 0 10px rgba(60,180,60,0.3);';
          inactiveStyle= 'background:var(--bg-card);border-color:#2a5a2a;color:#4a8a48;';
        } else {
          activeStyle  = 'background:linear-gradient(135deg,#2a1e08,#3a2a10);border-color:var(--accent-gold);color:var(--accent-gold);box-shadow:0 0 10px rgba(212,168,67,0.2);';
          inactiveStyle= 'background:var(--bg-card);border-color:var(--border-dark);color:var(--text-muted);';
        }
        return `
        <button
          onclick="craftSetCategory('${c.id}')"
          style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;padding:7px 14px;border-radius:4px;cursor:pointer;transition:all 0.15s;border:1px solid;
            ${isActive ? activeStyle : inactiveStyle}">
          ${c.icon} ${c.label}
        </button>`;
      }).join('')}
    </div>

    <!-- ══════ SEARCH ══════ -->
    <div style="margin-bottom:16px;">
      <input type="text" id="craftSearch" placeholder="🔍 Search recipes, ingredients…"
        value="${craftingState.searchQuery}"
        oninput="craftSetSearch(this.value)"
        style="width:100%;box-sizing:border-box;font-size:14px;padding:8px 12px;">
    </div>

    <!-- ══════ MAIN LAYOUT ══════ -->
    <div style="display:grid;grid-template-columns:1fr 1fr 280px;gap:16px;">

      <!-- LEFT: Recipe List -->
      <div>
        <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-muted);letter-spacing:2px;margin-bottom:10px;">
          ${recipes.length} RECIPES FOUND
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:70vh;overflow-y:auto;padding-right:4px;">
          ${recipes.length === 0
            ? `<div class="panel" style="text-align:center;padding:24px;">
                <div style="font-size:32px;margin-bottom:8px;">⚗</div>
                <div style="font-family:'Crimson Text',serif;font-size:16px;color:var(--text-muted);font-style:italic;">No recipes found.</div>
               </div>`
            : recipes.map(r => craftRenderRecipeCard(r, sel && sel.id === r.id)).join('')
          }
        </div>
      </div>

      <!-- MIDDLE: Detail Panel -->
      <div>
        ${sel ? craftRenderDetailPanel(sel) : craftRenderEmptyDetail()}
      </div>

      <!-- RIGHT: Inventory Ingredients -->
      <div>
        ${craftRenderInventoryPanel(sel)}
      </div>

    </div>

    <!-- ══════ CUSTOM RECIPE FORM ══════ -->
    <div id="craftCustomForm" style="${craftingState.showCustomForm ? '' : 'display:none;'}margin-top:20px;">
      ${craftRenderCustomForm()}
    </div>
  `;
}

function craftRenderRecipeCard(r, isSelected) {
  const rar = RARITY_STYLE[r.rarity] || RARITY_STYLE.common;
  const canCraft = craftHasIngredients(r);
  const status = craftIngredientStatus(r);
  const haveAll = status.every(s => s.enough);
  const haveSome = status.some(s => s.enough);

  return `
    <div onclick="craftSelectRecipe('${r.id}')"
      style="cursor:pointer;padding:12px 14px;border-radius:6px;transition:all 0.15s;
        border:1px solid ${isSelected ? 'var(--accent-gold)' : rar.border};
        background:${isSelected ? 'linear-gradient(135deg,#2a1e08,#1a1208)' : 'var(--bg-card)'};
        box-shadow:${isSelected ? '0 0 14px rgba(212,168,67,0.2)' : 'none'};
        ">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span style="font-size:20px;line-height:1;">${r.icon}</span>
        <div style="flex:1;">
          <div style="font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:${isSelected ? 'var(--accent-gold)' : 'var(--text-primary)'};">
            ${r.name}
          </div>
          <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:1px;color:${rar.color};margin-top:1px;">
            ${r.rarity.toUpperCase()}${r.toolRequired ? ' · ' + r.toolRequired : ''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
          <div style="font-size:18px;">${haveAll ? '✅' : haveSome ? '🟡' : '❌'}</div>
        </div>
      </div>
      <!-- Ingredient mini-bar -->
      <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:4px;">
        ${status.map(s => `
          <span style="font-family:'Cinzel',serif;font-size:9px;padding:2px 6px;border-radius:10px;
            background:${s.enough ? 'rgba(60,130,40,0.2)' : 'rgba(130,40,40,0.2)'};
            border:1px solid ${s.enough ? '#3a7a28' : '#7a3028'};
            color:${s.enough ? '#7acc50' : '#cc7050'};">
            ${s.have}/${s.qty} ${s.name}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

function craftRenderDetailPanel(recipe) {
  const rar  = RARITY_STYLE[recipe.rarity] || RARITY_STYLE.common;
  const status = craftIngredientStatus(recipe);
  const canCraft = status.every(s => s.enough);
  const missingCount = status.filter(s => !s.enough).length;

  // Build inventory sidebar — all ingredients relevant to this recipe from inventory
  const inv = craftGetInventory();
  const relevantInv = inv.filter(item =>
    recipe.ingredients.some(ing => ing.name.toLowerCase() === (item.name||'').toLowerCase())
  );

  return `
    <div class="panel" style="background:linear-gradient(160deg,var(--bg-panel),var(--bg-deep));border-color:${rar.border};position:sticky;top:70px;">

      <!-- Header -->
      <div style="text-align:center;padding-bottom:14px;border-bottom:1px solid var(--border-dark);margin-bottom:14px;">
        <div style="font-size:48px;filter:drop-shadow(0 0 10px ${rar.color}44);margin-bottom:6px;">${recipe.icon}</div>
        <div style="font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:var(--accent-gold);letter-spacing:1px;">${recipe.name}</div>
        <div style="display:inline-block;margin-top:6px;padding:3px 12px;border-radius:10px;background:${rar.bg};border:1px solid ${rar.border};font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:${rar.color};">
          ${recipe.rarity.toUpperCase()}
        </div>
      </div>

      <!-- Description + flavor -->
      <div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-secondary);margin-bottom:8px;line-height:1.6;">
        ${recipe.description}
      </div>
      ${recipe.flavorText ? `
        <div style="font-family:'IM Fell English',serif;font-size:14px;color:var(--text-muted);font-style:italic;padding:8px 12px;border-left:2px solid var(--border-gold);margin-bottom:14px;background:rgba(0,0,0,0.2);border-radius:0 4px 4px 0;">
          ${recipe.flavorText}
        </div>
      ` : ''}

      <!-- Stats row -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
        ${recipe.timeHours ? `
          <div style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:6px;padding:8px;text-align:center;">
            <div style="font-size:18px;">⏱</div>
            <div style="font-family:'Cinzel',serif;font-size:16px;color:var(--accent-gold);">${recipe.timeHours}h</div>
            <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:1px;">TIME</div>
          </div>
        ` : ''}
        ${recipe.toolRequired ? `
          <div style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:6px;padding:8px;text-align:center;">
            <div style="font-size:18px;">🔧</div>
            <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--accent-gold);line-height:1.2;">${recipe.toolRequired}</div>
            <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:1px;">TOOL REQ.</div>
          </div>
        ` : ''}
        ${recipe.dcCheck ? `
          <div style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:6px;padding:8px;text-align:center;">
            <div style="font-size:18px;">🎲</div>
            <div style="font-family:'Cinzel',serif;font-size:16px;color:#c07040;">DC ${recipe.dcCheck.dc}</div>
            <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:1px;">${recipe.dcCheck.skill}</div>
          </div>
        ` : ''}
        <div style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:18px;">📦</div>
          <div style="font-family:'Cinzel',serif;font-size:14px;color:var(--accent-gold);">${recipe.produces.qty}× ${recipe.produces.name}</div>
          <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:1px;">PRODUCES · ${recipe.produces.value ? recipe.produces.value + ' GP' : '—'} · ${recipe.produces.weight ? recipe.produces.weight + ' lb' : '—'}</div>
        </div>
      </div>

      <!-- Ingredients with Quick-Add -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-muted);letter-spacing:2px;">INGREDIENTS</div>
        ${missingCount > 0 ? `<div style="font-family:'Cinzel',serif;font-size:10px;color:#cc7050;">${missingCount} MISSING</div>` : `<div style="font-family:'Cinzel',serif;font-size:10px;color:#7acc50;">✓ ALL PRESENT</div>`}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
        ${status.map(s => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;
            background:${s.enough ? 'rgba(40,100,20,0.15)' : 'rgba(100,20,20,0.15)'};
            border:1px solid ${s.enough ? '#2a5a18' : '#5a1818'};">
            <div style="flex:1;min-width:0;">
              <div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${s.name}
                <span style="font-size:12px;color:var(--text-muted);"> — ${s.unit}</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-left:8px;flex-shrink:0;">
              <div style="font-family:'Cinzel',serif;font-size:13px;font-weight:700;
                color:${s.enough ? '#7acc50' : '#cc7050'};">
                ${s.have} / ${s.qty}
              </div>
              ${!s.enough ? `
                <button onclick="craftQuickAddIngredient('${s.name.replace(/'/g,"\\'")}', ${s.qty - s.have})"
                  title="Add ${s.qty - s.have}× ${s.name} to inventory"
                  style="font-family:'Cinzel',serif;font-size:9px;padding:3px 7px;border-radius:4px;cursor:pointer;letter-spacing:0.5px;
                    border:1px solid #8a4020;background:rgba(100,40,10,0.25);color:#e08040;
                    transition:all 0.15s;white-space:nowrap;"
                  onmouseover="this.style.background='rgba(160,70,20,0.4)';this.style.borderColor='#e08040';"
                  onmouseout="this.style.background='rgba(100,40,10,0.25)';this.style.borderColor='#8a4020';">
                  + Add ${s.qty - s.have}
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Source -->
      ${recipe.sourceRule ? `
        <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:1px;margin-bottom:12px;opacity:0.7;">
          📖 ${recipe.sourceRule}
        </div>
      ` : ''}

      <!-- Craft Button -->
      <button onclick="craftDo('${recipe.id}')"
        ${canCraft ? '' : 'disabled'}
        style="width:100%;padding:13px;border-radius:6px;cursor:${canCraft ? 'pointer' : 'not-allowed'};
          font-family:'Cinzel',serif;font-size:14px;font-weight:700;letter-spacing:2px;
          border:1px solid ${canCraft ? '#5a9a30' : 'var(--border-dark)'};
          background:${canCraft ? 'linear-gradient(135deg,#1a3010,#0e1e08)' : 'var(--bg-card)'};
          color:${canCraft ? '#80cc50' : 'var(--text-muted)'};
          transition:all 0.15s;
          ${canCraft ? 'box-shadow:0 0 12px rgba(80,180,40,0.2);' : ''}
          ">
        ${canCraft ? '⚗ CRAFT NOW' : '✕ MISSING INGREDIENTS'}
      </button>

      ${recipe.category === 'custom' ? `
        <button onclick="craftDeleteCustom('${recipe.id}')"
          style="width:100%;margin-top:6px;padding:8px;border-radius:6px;cursor:pointer;
            font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;
            border:1px solid var(--accent-red);background:rgba(120,30,30,0.15);color:var(--accent-red-bright);
            transition:all 0.15s;">
          🗑 Delete Custom Recipe
        </button>
      ` : ''}

    </div>
  `;
}

function craftRenderEmptyDetail() {
  return `
    <div class="panel" style="text-align:center;padding:40px 20px;background:linear-gradient(135deg,var(--bg-panel),var(--bg-deep));">
      <div style="font-size:56px;margin-bottom:16px;opacity:0.4;">⚗</div>
      <div style="font-family:'Cinzel',serif;font-size:15px;color:var(--text-muted);letter-spacing:2px;margin-bottom:8px;">SELECT A RECIPE</div>
      <div style="font-family:'Crimson Text',serif;font-size:15px;color:var(--text-muted);font-style:italic;line-height:1.7;">
        Choose a recipe from the list to see<br>ingredients and craft the item.
      </div>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;text-align:left;font-family:'Crimson Text',serif;font-size:14px;color:var(--text-muted);">
        <div>✅ <span style="color:var(--text-secondary);">Green checkmark</span> — enough materials</div>
        <div>🟡 <span style="color:var(--text-secondary);">Yellow</span> — some materials present</div>
        <div>❌ <span style="color:var(--text-secondary);">Red cross</span> — missing materials</div>
      </div>
    </div>
  `;
}

// ── Inventory Ingredients Sidebar ────────────────────────────
function craftRenderInventoryPanel(recipe) {
  const inv = craftGetInventory();

  // If a recipe is selected, show only relevant ingredients; else show all Ingredient-category items
  let items, title, subtitle;
  if (recipe) {
    const recipeNames = recipe.ingredients.map(i => i.name.toLowerCase());
    items = inv.filter(item => recipeNames.includes((item.name||'').toLowerCase()));
    title = '🎒 YOUR STOCK';
    subtitle = 'Inventory items used in this recipe';
  } else {
    items = inv.filter(item =>
      !item._itemKind || item._itemKind === undefined
    ).filter(item => {
      const name = (item.name || '').toLowerCase();
      const notes = (item.notes || '').toLowerCase();
      // Show anything that looks like a crafting ingredient
      return notes.includes('crafted') ||
             notes.includes('ingredient') ||
             !['weapon','armor','magic','quest'].includes(item._itemKind || '');
    });
    title = '🎒 CRAFTING STOCK';
    subtitle = 'Select a recipe to filter';
  }

  const ingItems = items.filter(i => (parseInt(i.qty) || 0) > 0);

  return `
    <div class="panel" style="background:linear-gradient(160deg,var(--bg-panel),var(--bg-deep));border-color:var(--border-dark);position:sticky;top:70px;max-height:80vh;overflow-y:auto;">
      <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--accent-gold);letter-spacing:2px;margin-bottom:4px;">${title}</div>
      <div style="font-family:'Crimson Text',serif;font-size:13px;color:var(--text-muted);font-style:italic;margin-bottom:12px;">${subtitle}</div>

      ${ingItems.length === 0 ? `
        <div style="text-align:center;padding:20px 0;opacity:0.5;">
          <div style="font-size:28px;margin-bottom:6px;">🎒</div>
          <div style="font-family:'Crimson Text',serif;font-size:14px;color:var(--text-muted);font-style:italic;">
            ${recipe ? 'No matching ingredients<br>in inventory.' : 'Inventory is empty.'}
          </div>
        </div>
      ` : ingItems.map(item => {
        const qty = parseInt(item.qty) || 0;
        // Check if needed by current recipe
        const needed = recipe
          ? (recipe.ingredients.find(i => i.name.toLowerCase() === (item.name||'').toLowerCase())?.qty || 0)
          : 0;
        const isEnough = !needed || qty >= needed;
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 8px;margin-bottom:5px;border-radius:5px;
            background:${recipe ? (isEnough ? 'rgba(40,100,20,0.12)' : 'rgba(100,20,20,0.12)') : 'var(--bg-card)'};
            border:1px solid ${recipe ? (isEnough ? '#2a5a18' : '#5a1818') : 'var(--border-dark)'};">
            <div style="flex:1;min-width:0;">
              <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.name||''}">
                ${item.name || '—'}
              </div>
              ${needed ? `<div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text-muted);letter-spacing:0.5px;">need ${needed}</div>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:5px;margin-left:6px;flex-shrink:0;">
              <span style="font-family:'Cinzel',serif;font-size:13px;font-weight:700;
                color:${recipe ? (isEnough ? '#7acc50' : '#cc7050') : 'var(--accent-gold)'};">
                ${qty}×
              </span>
              <button onclick="craftDecrementItem('${(item.name||'').replace(/'/g,"\\'")}', 1)"
                title="Remove 1 from inventory"
                style="font-size:12px;width:22px;height:22px;border-radius:3px;cursor:pointer;line-height:1;
                  border:1px solid var(--border-dark);background:var(--bg-deep);color:var(--text-muted);
                  transition:all 0.1s;"
                onmouseover="this.style.borderColor='#cc4040';this.style.color='#cc6060';"
                onmouseout="this.style.borderColor='var(--border-dark)';this.style.color='var(--text-muted)';">−</button>
              <button onclick="craftIncrementItem('${(item.name||'').replace(/'/g,"\\'")}', 1)"
                title="Add 1 to inventory"
                style="font-size:12px;width:22px;height:22px;border-radius:3px;cursor:pointer;line-height:1;
                  border:1px solid var(--border-dark);background:var(--bg-deep);color:var(--text-muted);
                  transition:all 0.1s;"
                onmouseover="this.style.borderColor='#5a9a30';this.style.color='#80cc50';"
                onmouseout="this.style.borderColor='var(--border-dark)';this.style.color='var(--text-muted)';">+</button>
            </div>
          </div>
        `;
      }).join('')}

      <!-- Quick add new ingredient to inventory -->
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-dark);">
        <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text-muted);letter-spacing:1px;margin-bottom:6px;">QUICK ADD TO INVENTORY</div>
        <div style="display:flex;gap:5px;">
          <input type="text" id="craftQuickIngName" placeholder="Ingredient name…"
            style="flex:1;font-size:12px;padding:5px 8px;"
            onkeydown="if(event.key==='Enter')craftQuickAddFromInput()">
          <input type="number" id="craftQuickIngQty" value="1" min="1"
            style="width:48px;font-size:12px;padding:5px 6px;"
            onkeydown="if(event.key==='Enter')craftQuickAddFromInput()">
          <button onclick="craftQuickAddFromInput()"
            style="font-family:'Cinzel',serif;font-size:11px;padding:5px 10px;border-radius:4px;cursor:pointer;
              border:1px solid var(--accent-gold);background:rgba(212,168,67,0.1);color:var(--accent-gold);
              transition:all 0.15s;"
            onmouseover="this.style.background='rgba(212,168,67,0.2)';"
            onmouseout="this.style.background='rgba(212,168,67,0.1)';">+</button>
        </div>
      </div>
    </div>
  `;
}

function craftRenderCustomForm() {
  return `
    <div class="panel" style="background:linear-gradient(135deg,var(--bg-panel),var(--bg-deep));border-color:var(--border-gold);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="font-family:'Cinzel',serif;font-size:14px;font-weight:700;color:var(--accent-gold);letter-spacing:1px;">
          📝 Create Custom Recipe
        </div>
        <button onclick="craftHideCustomForm()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer;">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="field">
          <label>Recipe Name *</label>
          <input type="text" id="crf_name" placeholder="e.g. Dragon Blood Potion">
        </div>
        <div class="field">
          <label>Icon (emoji)</label>
          <input type="text" id="crf_icon" placeholder="🧪" style="width:80px;">
        </div>
        <div class="field">
          <label>Description</label>
          <textarea id="crf_desc" rows="2" placeholder="What does this item do?"></textarea>
        </div>
        <div class="field">
          <label>Produces (item name) *</label>
          <input type="text" id="crf_produces_name" placeholder="e.g. Dragon Brew">
        </div>
        <div class="field">
          <label>Quantity produced</label>
          <input type="number" id="crf_produces_qty" value="1" min="1" style="width:80px;">
        </div>
        <div class="field">
          <label>Category</label>
          <select id="crf_cat">
            <option value="food">🍖 Food</option>
            <option value="potion">🧪 Potion</option>
            <option value="alchemy">⚗ Alchemy</option>
            <option value="poison">☠️ Poison</option>
            <option value="explosive">💣 Explosive</option>
            <option value="weapon">⚔️ Weapon</option>
            <option value="armor">🛡️ Armor</option>
            <option value="tool">🔧 Tool</option>
            <option value="magic">✨ Magic</option>
          </select>
        </div>
        <div class="field">
          <label>Tool Required (optional)</label>
          <input type="text" id="crf_tool" placeholder="e.g. Alchemist's Supplies">
        </div>
        <div class="field">
          <label>Craft Time (hours)</label>
          <input type="number" id="crf_time" value="1" min="0" style="width:80px;">
        </div>
      </div>

      <!-- Ingredients builder -->
      <div style="margin-top:14px;">
        <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-muted);letter-spacing:2px;margin-bottom:8px;">INGREDIENTS</div>
        <div id="crfIngList"></div>
        <button onclick="craftAddIngRow()" class="add-row-btn" style="margin-top:6px;">+ Add Ingredient</button>
      </div>

      <button onclick="craftSaveCustom()" class="btn btn-primary" style="margin-top:16px;width:100%;font-family:'Cinzel',serif;letter-spacing:2px;">
        ✦ Save Custom Recipe
      </button>
    </div>
  `;
}

// ── UI Actions (global functions for onclick) ────────────────
let _crfIngCount = 0;

window.craftSetCategory = function(cat) {
  craftingState.activeCategory = cat;
  craftingState.selectedRecipe = null;
  renderCraftingTable();
};

window.craftSetSearch = function(val) {
  craftingState.searchQuery = val;
  renderCraftingTable();
};

window.craftSelectRecipe = function(id) {
  const all = [...DND_RECIPES, ...craftingState.customRecipes];
  const recipe = all.find(r => r.id === id);
  craftingState.selectedRecipe = recipe || null;
  // Update only the right panel to avoid losing focus on search
  const right = document.querySelector('#tab-crafting .panel[style*="sticky"]')?.parentElement;
  renderCraftingTable();
};

window.craftDo = function(id) {
  const all = [...DND_RECIPES, ...craftingState.customRecipes];
  const recipe = all.find(r => r.id === id);
  if (!recipe) return;
  craftExecute(recipe);
};

window.craftDeleteCustom = function(id) {
  if (confirm('Delete this custom recipe?')) {
    craftDeleteCustomRecipe(id);
  }
};

window.craftToggleLog = function() {
  const el = document.getElementById('craftingLogPanel');
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.craftClearLog = function() {
  craftingState.craftingLog = [];
  saveCraftingData();
  renderCraftingTable();
  showToast('Crafting log cleared.');
};

window.craftShowCustomForm = function() {
  craftingState.showCustomForm = true;
  _crfIngCount = 0;
  renderCraftingTable();
  // Pre-add one row
  craftAddIngRow();
  document.getElementById('craftCustomForm')?.scrollIntoView({ behavior: 'smooth' });
};

window.craftHideCustomForm = function() {
  craftingState.showCustomForm = false;
  renderCraftingTable();
};

window.craftAddIngRow = function() {
  const list = document.getElementById('crfIngList');
  if (!list) return;
  const idx = _crfIngCount++;
  const row = document.createElement('div');
  row.id = `crf_ing_${idx}`;
  row.style.cssText = 'display:flex;gap:6px;margin-bottom:6px;align-items:center;';
  row.innerHTML = `
    <input type="text" id="crf_ing_name_${idx}" placeholder="Ingredient name" style="flex:2;">
    <input type="number" id="crf_ing_qty_${idx}" value="1" min="1" style="width:60px;">
    <input type="text" id="crf_ing_unit_${idx}" placeholder="unit" style="width:70px;">
    <button onclick="document.getElementById('crf_ing_${idx}').remove()"
      style="background:var(--bg-card);border:1px solid var(--accent-red);color:var(--accent-red-bright);border-radius:4px;cursor:pointer;padding:4px 8px;">✕</button>
  `;
  list.appendChild(row);
};

window.craftSaveCustom = function() {
  const name = document.getElementById('crf_name')?.value.trim();
  const icon = document.getElementById('crf_icon')?.value.trim() || '⚗';
  const desc = document.getElementById('crf_desc')?.value.trim() || '';
  const pname = document.getElementById('crf_produces_name')?.value.trim();
  const pqty  = parseInt(document.getElementById('crf_produces_qty')?.value) || 1;
  const cat   = document.getElementById('crf_cat')?.value || 'misc';
  const tool  = document.getElementById('crf_tool')?.value.trim() || null;
  const time  = parseFloat(document.getElementById('crf_time')?.value) || 1;

  if (!name || !pname) {
    showToast('✕ Name and Produces fields are required!');
    return;
  }

  // Collect ingredients
  const ingredients = [];
  for (let i = 0; i < _crfIngCount; i++) {
    const n = document.getElementById(`crf_ing_name_${i}`)?.value.trim();
    const q = parseInt(document.getElementById(`crf_ing_qty_${i}`)?.value) || 1;
    const u = document.getElementById(`crf_ing_unit_${i}`)?.value.trim() || 'piece';
    if (n) ingredients.push({ name: n, qty: q, unit: u });
  }
  if (ingredients.length === 0) {
    showToast('✕ Add at least one ingredient!');
    return;
  }

  const recipe = {
    name, icon, description: desc, rarity: 'common',
    flavorText: null, timeHours: time, toolRequired: tool,
    ingredients,
    produces: { name: pname, qty: pqty, category: cat, weight: 1, value: 0 },
    sourceRule: 'Custom Recipe',
    dcCheck: null,
  };
  craftSaveCustomRecipe(recipe);
  craftingState.showCustomForm = false;
};

// ── Hook into app init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Load persisted data after main app loads
  setTimeout(() => {
    loadCraftingData();
    // Render if tab is active
    if (document.getElementById('tab-crafting')?.classList.contains('active')) {
      renderCraftingTable();
    }
  }, 500);
});

// ── Inventory Quick Actions ───────────────────────────────────
window.craftQuickAddIngredient = function(name, qty) {
  // Called from "+ Add X" button on missing ingredient
  if (typeof data === 'undefined' || !data) { showToast('✕ Save your character first'); return; }
  if (!Array.isArray(data.inventory)) data.inventory = [];
  const inv = data.inventory;
  const needle = name.toLowerCase().trim();
  const existing = inv.find(i => i.name && i.name.toLowerCase().trim() === needle);
  if (existing) {
    existing.qty = (parseInt(existing.qty) || 0) + qty;
  } else {
    inv.push({
      id: 'inv_' + Date.now() + '_' + Math.floor(Math.random()*10000),
      name: name,
      qty: qty,
      weight: '',
      cost: '',
      notes: '⚗ Crafting Ingredient',
      equipped: false,
    });
  }
  // Save directly without collectData() to avoid overwriting inventory
  if (typeof autoSave === 'function') autoSave(); else localStorage.setItem('dnd5e_chronicle', JSON.stringify(data));
  if (typeof renderInventory === 'function') renderInventory();
  showToast('✦ Added ' + qty + '\u00d7 ' + name + ' to inventory');
  renderCraftingTable();
};

window.craftIncrementItem = function(name, qty) {
  if (typeof data === 'undefined' || !data) return;
  if (!Array.isArray(data.inventory)) data.inventory = [];
  const inv = data.inventory;
  const needle = name.toLowerCase().trim();
  const item = inv.find(i => i.name && i.name.toLowerCase().trim() === needle);
  if (item) {
    item.qty = (parseInt(item.qty) || 0) + qty;
    if (typeof autoSave === 'function') autoSave(); else localStorage.setItem('dnd5e_chronicle', JSON.stringify(data));
    if (typeof renderInventory === 'function') renderInventory();
    renderCraftingTable();
  }
};

window.craftDecrementItem = function(name, qty) {
  if (typeof data === 'undefined' || !data) return;
  if (!Array.isArray(data.inventory)) data.inventory = [];
  const inv = data.inventory;
  const needle = name.toLowerCase().trim();
  const idx = inv.findIndex(i => i.name && i.name.toLowerCase().trim() === needle);
  if (idx === -1) return;
  inv[idx].qty = Math.max(0, (parseInt(inv[idx].qty) || 0) - qty);
  if (inv[idx].qty === 0) inv.splice(idx, 1);
  if (typeof autoSave === 'function') autoSave(); else localStorage.setItem('dnd5e_chronicle', JSON.stringify(data));
  if (typeof renderInventory === 'function') renderInventory();
  renderCraftingTable();
};

window.craftQuickAddFromInput = function() {
  const nameEl = document.getElementById('craftQuickIngName');
  const qtyEl  = document.getElementById('craftQuickIngQty');
  const name = nameEl?.value?.trim();
  const qty  = parseInt(qtyEl?.value) || 1;
  if (!name) { showToast('✕ Enter an ingredient name'); return; }
  craftQuickAddIngredient(name, qty);
  if (nameEl) nameEl.value = '';
  if (qtyEl)  qtyEl.value  = '1';
};
