// ═══════════════════════════════════════════
//  data.js - DATA MODEL & STATIC DATABASES
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  DATA MODEL
// ═══════════════════════════════════════════
let data = {};
let selectedDie = 20;
let autoSaveTimer = null;
let attuneState = [false, false, false];

const CONDITIONS = ['Blinded','Charmed','Deafened','Exhaustion','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious'];
const DAMAGE_TYPES = ['Acid','Bludgeoning','Cold','Fire','Force','Lightning','Necrotic','Piercing','Poison','Psychic','Radiant','Slashing','Thunder'];

const SKILLS_DEF = [
  {name:'Acrobatics', attr:'dex'},{name:'Animal Handling', attr:'wis'},
  {name:'Arcana', attr:'int'},{name:'Athletics', attr:'str'},
  {name:'Deception', attr:'cha'},{name:'History', attr:'int'},
  {name:'Insight', attr:'wis'},{name:'Intimidation', attr:'cha'},
  {name:'Investigation', attr:'int'},{name:'Medicine', attr:'wis'},
  {name:'Nature', attr:'int'},{name:'Perception', attr:'wis'},
  {name:'Performance', attr:'cha'},{name:'Persuasion', attr:'cha'},
  {name:'Religion', attr:'int'},{name:'Sleight of Hand', attr:'dex'},
  {name:'Stealth', attr:'dex'},{name:'Survival', attr:'wis'}
];

const SAVES_DEF = [
  {name:'Strength', attr:'str'},{name:'Dexterity', attr:'dex'},
  {name:'Constitution', attr:'con'},{name:'Intelligence', attr:'int'},
  {name:'Wisdom', attr:'wis'},{name:'Charisma', attr:'cha'}
];

const SPELL_SCHOOLS = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];

// Proficiency by level
function getProfBonus(level) {
  if (level < 5) return 2;
  if (level < 9) return 3;
  if (level < 13) return 4;
  if (level < 17) return 5;
  return 6;
}

function getMod(score) {
  return Math.floor((parseInt(score) - 10) / 2);
}

function fmtMod(n) {
  return (n >= 0 ? '+' : '') + n;
}

