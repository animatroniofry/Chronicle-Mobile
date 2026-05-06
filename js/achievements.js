// ═══════════════════════════════════════════
//  achievements.js - ACHIEVEMENTS
// ═══════════════════════════════════════════

//  ACHIEVEMENTS
// ═══════════════════════════════════════════
var ACHIEVEMENTS = [
  // ── Adventure ──
  {id:'classic_adv', cat:'Adventure', icon:'🐉', name:'Classic Adventure', desc:'With a party of a Human Fighter, Elf Wizard, Dwarf Cleric, and Halfling Rogue defeat an Ancient Red Dragon.'},
  {id:'notso_adv', cat:'Adventure', icon:'🌀', name:'Not So Classic Adventure', desc:'With a party of a Tiefling Sorcerer, Half-Orc Monk, Dragonborn Druid, and Gnome Artificer defeat an Empyrean.'},
  {id:'comedian', cat:'Adventure', icon:'🦑', name:"Everyone's A Comedian", desc:'With a party of a Goliath Rogue, Drow Barbarian, Tabaxi Paladin, and a Tortle Bard defeat a Kraken.'},
  {id:'classic_enc1', cat:'Adventure', icon:'🟩', name:'Classic Encounter I', desc:'Defeat a Gelatinous Cube.'},
  {id:'classic_enc2', cat:'Adventure', icon:'🧠', name:'Classic Encounter II', desc:'Defeat a Mind Flayer.'},
  {id:'classic_enc3', cat:'Adventure', icon:'👁', name:'Classic Encounter III', desc:'Defeat a Beholder.'},
  {id:'classic_enc4', cat:'Adventure', icon:'😈', name:'Classic Encounter IV', desc:'Defeat a Pit Fiend.'},
  {id:'notso_enc1', cat:'Adventure', icon:'💀', name:'Not So Classic Encounter I', desc:'Defeat a Deathlock Wight.'},
  {id:'notso_enc2', cat:'Adventure', icon:'🟡', name:'Not So Classic Encounter II', desc:'Defeat an Elder Oblex.'},
  {id:'notso_enc3', cat:'Adventure', icon:'🐦‍⬛', name:'Not So Classic Encounter III', desc:'Defeat an Ancient Deep Crow.'},
  {id:'notso_enc4', cat:'Adventure', icon:'🐲', name:'Not So Classic Encounter IV', desc:'Defeat an Elder Brain Dragon.'},
  {id:'quite_adv', cat:'Adventure', icon:'⭐', name:'Quite an Adventure', desc:'Take a single character from Level 1 to Level 20 with no multiclassing.'},
  {id:'was_quick', cat:'Adventure', icon:'💔', name:'That Was Quick', desc:'Experience a Level 1 character death.'},
  {id:'way_to_go', cat:'Adventure', icon:'☠️', name:'What A Way To Go…', desc:'Experience a Level 20 character death.'},
  {id:'heartbreaking', cat:'Adventure', icon:'💔', name:"It's Always Heartbreaking", desc:'Experience a Total Party Kill.'},
  {id:'mulliganed', cat:'Adventure', icon:'🔴', name:'Mulliganed', desc:'Have three or more party members die in a single round of initiative.'},
  {id:'tarrasque', cat:'Adventure', icon:'🦖', name:'That Was Easy. Next?', desc:'Defeat a Tarrasque.'},
  // ── Shopkeeping ──
  {id:'lets_deal', cat:'Shopkeeping', icon:'🗣', name:"Let's Make a Deal", desc:'Use persuasion to successfully convince a shopkeeper to sell at a lower price.'},
  {id:'on_credit', cat:'Shopkeeping', icon:'📜', name:'This Is On Credit', desc:'Use deception to convince a shopkeeper to give you an item before paying.'},
  {id:'five_knuckle', cat:'Shopkeeping', icon:'👊', name:'Five Knuckle Discount', desc:'Use intimidation to successfully convince a shopkeeper to sell at a lower price.'},
  {id:'sticky_finger', cat:'Shopkeeping', icon:'🤏', name:'Sticky Finger Discount', desc:'Use sleight of hand to successfully steal from a shopkeeper while they are open.'},
  {id:'bloody_hand', cat:'Shopkeeping', icon:'🩸', name:'Bloody Handprint Discount', desc:'Murder a shopkeeper to steal an item while they are open.'},
  // ── Exploration ──
  {id:'arrested', cat:'Exploration', icon:'⛓', name:'Stop Right There Criminal Scum!', desc:'Be arrested for a crime.'},
  {id:'bribe_out', cat:'Exploration', icon:'💰', name:'The Wheels Of Justice Are Greased with Gold', desc:'Successfully bribe your way out of an arrest.'},
  {id:'wanted_poster', cat:'Exploration', icon:'📌', name:'They Never Get My Nose Right', desc:'Find a wanted poster of your character.'},
  {id:'frame_crime', cat:'Exploration', icon:'🎭', name:'It Was The One Armed Man!', desc:'Successfully frame a crime on another humanoid.'},
  {id:'mount', cat:'Exploration', icon:'🐴', name:'Saddle Up!', desc:'Obtain a mount.'},
  {id:'party_mount', cat:'Exploration', icon:'🏇', name:'The Calvary Have Arrived', desc:'Your entire party has a mount.'},
  {id:'mount_die', cat:'Exploration', icon:'🪦', name:'Glue Factory', desc:'Have a mount die.'},
  {id:'wagon', cat:'Exploration', icon:'🛒', name:'Better Than Walking', desc:'Obtain a wagon.'},
  {id:'ship', cat:'Exploration', icon:'⛵', name:'Way Better Than Walking', desc:'Obtain a ship.'},
  {id:'skyship', cat:'Exploration', icon:'✈️', name:'What Even Is Walking?', desc:'Obtain a skyship.'},
  // ── Combat ──
  {id:'crush', cat:'Combat', icon:'💥', name:'CRUSH YOUR ENEMIES', desc:'Roll maximum damage on all damage dice on an attack.'},
  {id:'see_driven', cat:'Combat', icon:'🏃', name:'SEE THEM DRIVEN BEFORE YOU', desc:'Route an enemy from an encounter.'},
  {id:'lamentations', cat:'Combat', icon:'😭', name:'HEAR THEIR LAMENTATIONS', desc:'Cause an enemy to beg for their life.'},
  {id:'overkill', cat:'Combat', icon:'💣', name:'Overkill', desc:'Deal 50 or more damage to an enemy with 1HP.'},
  {id:'going_nuclear', cat:'Combat', icon:'☢️', name:'Going Nuclear', desc:'Deal 50 or more damage to 5 or more enemies with a single attack action.'},
  {id:'macaroni', cat:'Combat', icon:'🍝', name:'Do You Like Macaroni?', desc:'Cast Banishment on a party member.'},
  {id:'darkvision', cat:'Combat', icon:'👀', name:'Beyond Eldritch Sight', desc:'Gain darkvision to 180 feet.'},
  {id:'break_conc', cat:'Combat', icon:'🔨', name:'You Need To Focus On Your Focus', desc:"Break a creature's concentration on their spell."},
  {id:'conc_tank', cat:'Combat', icon:'🛡', name:'A Caster of Focus, Commitment, And Sheer Will', desc:'Suffer 50 or more points of damage while concentrating on a spell and succeed on maintaining concentration.'},
  {id:'unique_skill', cat:'Combat', icon:'🎯', name:'I Have A Unique Skillset', desc:'With a 5 or lower on a skill check roll, succeed on a skill check with a DC of 20 or higher.'},
  {id:'herring', cat:'Combat', icon:'🐟', name:'With A Herring!', desc:'Use an improvised weapon to defeat an enemy.'},
  {id:'floor_trap', cat:'Combat', icon:'🕳', name:'Jehovah Begins With An I', desc:'Fall through an undetected floor trap.'},
  {id:'necrotic_death', cat:'Combat', icon:'💀', name:'He Chose…Poorly', desc:'Suffer necrotic damage to instantly die from full health.'},
  {id:'hidden_chest', cat:'Combat', icon:'📦', name:'X Never, Ever Marks The Spot', desc:'Find a hidden treasure chest.'},
  {id:'parry_this', cat:'Combat', icon:'🔫', name:'Parry This…', desc:'Gain Firearms proficiency.'},
  {id:'filthy_casual', cat:'Combat', icon:'💨', name:'…You Filthy Casual', desc:"Use deflect missile to throw an enemy's bullet back at them."},
  {id:'fastball', cat:'Combat', icon:'⚾', name:'Just A Bit Outside', desc:'The party uses a fastball special in a single encounter.'},
  {id:'miss_crit', cat:'Combat', icon:'⚡', name:'Fuck You Jobu!', desc:'After missing two consecutive attacks land the last one with a critical hit.'},
  // ── Dice ──
  {id:'censored', cat:'Dice', icon:'🎲', name:'*$&%#!', desc:'With advantage roll two natural ones.'},
  {id:'holy_shit', cat:'Dice', icon:'🌟', name:'HOLY SHIT!', desc:'With disadvantage roll two natural twenties.'},
  {id:'lucky_bastard', cat:'Dice', icon:'🍀', name:'Lucky Bastard', desc:'While having advantage, roll a natural 1 and a natural 20.'},
  {id:'poor_sod', cat:'Dice', icon:'😬', name:'Poor Sod', desc:'While having disadvantage, roll a natural 20 and a natural 1.'},
  {id:'just_dirty', cat:'Dice', icon:'😏', name:"That's Just Dirty", desc:'After your d20 roll and all modifiers get a 20.'},
  // ── Economy ──
  {id:'all_glitters', cat:'Economy', icon:'✨', name:'All That Glitters…', desc:'Loot a treasure chest.'},
  {id:'mimic', cat:'Economy', icon:'👄', name:'…Is not gold', desc:"Be affected by a mimic's sticky touch."},
  {id:'run_biz', cat:'Economy', icon:'💼', name:'I Run A Business', desc:'Sell an item for 1,000GP or more.'},
  {id:'capitalists', cat:'Economy', icon:'💸', name:'Adventure Capitalists', desc:'Have 1,000,000 GP in your party.'},
  {id:'three_fiddy', cat:'Economy', icon:'🤡', name:'Best I Can Do Is Three Fiddy', desc:'Sell a magical item for 1 SP.'},
  {id:'sad_dm', cat:'Economy', icon:'😢', name:'Sad DM Noise', desc:'Kill an NPC before meeting them.'},
  {id:'happy_dm', cat:'Economy', icon:'😊', name:'Happy DM Noise', desc:'Have an NPC join your party during an encounter.'},
  // ── Healing ──
  {id:'combat_medic', cat:'Healing', icon:'⚕️', name:'Combat Medic', desc:'In the same encounter stabilize an ally and defeat an enemy.'},
  {id:'resting_eyes', cat:'Healing', icon:'😴', name:'I Was Just Resting My Eyes', desc:'A character is healed while unconscious.'},
  {id:'close_one', cat:'Healing', icon:'😰', name:'Close One!', desc:'A character becomes stabilized with two failed death saving throws.'},
  {id:'yoyo', cat:'Healing', icon:'🪀', name:'The Yo-Yo', desc:'After reviving from being unconscious, defeat an enemy in the same encounter.'},
  {id:'no_bell', cat:'Healing', icon:'🔔', name:"I Didn't Hear No Bell", desc:'Within a single encounter a single character must roll a Natural 20 on a death saving throw to return to 1 HP, twice.'},
  // ── Alignment/Campaign ──
  {id:'band_theseus', cat:'Adventure', icon:'⚰️', name:'Band of Theseus', desc:'Have every member of your group suffer a character death and roll a new character in the same campaign.'},
  {id:'change_heart', cat:'Adventure', icon:'🔄', name:'Change of Heart', desc:'Have a character change alignment from lawful to chaotic OR from good to evil or vice versa.'},
  {id:'stoic', cat:'Adventure', icon:'😐', name:'Stoic', desc:'Begin a campaign with true neutral alignment and complete the campaign without undergoing an alignment shift.'},
  // ── Race-Specific ──
  {id:'r_dragonborn_dv', cat:'Race', icon:'🐉', name:"Why Don't We Already Have This?", desc:'As a Dragonborn, gain darkvision without spells or magic items.'},
  {id:'r_dragonborn_breath', cat:'Race', icon:'🔥', name:"It's In My Blood", desc:'As a Dragonborn, defeat an enemy with your breath weapon.'},
  {id:'r_dwarf_thrown', cat:'Race', icon:'🪨', name:"Don't Tell The Elf", desc:'As a Dwarf, get thrown into a group of 4 or more enemies.'},
  {id:'r_dwarf_poison', cat:'Race', icon:'💚', name:'Iron Stomach', desc:'As a Dwarf, suffer 50 or more poison damage without falling unconscious.'},
  {id:'r_elf_charm', cat:'Race', icon:'✨', name:'Mental Fortitude', desc:'As an Elf, save against being charmed with a 20 DC saving throw.'},
  {id:'r_elf_perc', cat:'Race', icon:'👁', name:"They're Taking The Halflings to Ravenloft!", desc:'As an Elf, succeed on a 25 DC Perception Check.'},
  {id:'r_gnome_dmg', cat:'Race', icon:'🔮', name:'Small Size, Big Package', desc:'As a Gnome deal more than 100 points of damage in a single round.'},
  {id:'r_gnome_save', cat:'Race', icon:'🧪', name:'Cunning Little Guy', desc:'As a Gnome succeed on a saving throw against a spell of 7th level or higher.'},
  {id:'r_halfelf_charm', cat:'Race', icon:'🌙', name:'Only Good Thing About Being Half Blooded', desc:'As a Half-Elf, save against being charmed.'},
  {id:'r_halfelf_elf', cat:'Race', icon:'🌙', name:'We Are Better Than Them', desc:'As a Half-Elf, defeat a full blooded elf without assistance.'},
  {id:'r_halforc_end', cat:'Race', icon:'💪', name:'Restart=On-Failure', desc:'As a Half-Orc, use your relentless endurance feature after suffering 50 or more damage.'},
  {id:'r_halforc_savage', cat:'Race', icon:'🪓', name:'Extra Savage', desc:'As a Half-Orc, get maximum damage on your Savage Attack damage die.'},
  {id:'r_halfling_lucky1', cat:'Race', icon:'🍀', name:'Just That Unlucky', desc:"As a Halfling, score a Natural 1 on your Lucky feature die."},
  {id:'r_halfling_fright', cat:'Race', icon:'😱', name:'Three Monstrous Trolls!', desc:'As a Halfling, save against being frightened against a DC of 20 or higher.'},
  {id:'r_human_fighter', cat:'Race', icon:'⚔', name:"Ol' Reliable", desc:'As a Human, begin your character as a Fighter.'},
  {id:'r_human_dv', cat:'Race', icon:'🌑', name:"What's Stopping Me Now!", desc:'As a Human, gain darkvision out to 60 feet without the use of spells or magical items.'},
  {id:'r_tiefling_fire', cat:'Race', icon:'🔥', name:'That Tickles', desc:'As a Tiefling, suffer 50 or more fire damage without falling unconscious.'},
  {id:'r_tiefling_rebuke', cat:'Race', icon:'😈', name:'To Hell With You!', desc:'As a Tiefling, deal maximum damage with your hellish rebuke spell from your infernal legacy feature.'},
  // ── Class-Specific ──
  {id:'c_art_fly', cat:'Class', icon:'🦾', name:'I Am Iron Man', desc:'As an Artificer, create a device to give you flight.'},
  {id:'c_art_ac', cat:'Class', icon:'🛡', name:'Built to Last', desc:'As an Artificer, gain an Armor Class of 25 or higher.'},
  {id:'c_barb_rage', cat:'Class', icon:'😠', name:'I Would Like Too…', desc:'As a Barbarian, go into a rage and defeat an enemy in the same round.'},
  {id:'c_barb_relentless', cat:'Class', icon:'🔥', name:'Too Angry Too Die', desc:'As a Barbarian, successfully pass the Constitution save of Relentless Rage three times in a single encounter.'},
  {id:'c_bard_insp', cat:'Class', icon:'🎵', name:'The Show Must Go On!', desc:'As a Bard, grant bardic inspiration to an ally and have them succeed on a check or save.'},
  {id:'c_bard_seduce', cat:'Class', icon:'💘', name:'Make Love, Not War', desc:'As a Bard, seduce a creature that is hostile towards you.'},
  {id:'c_bh_fail', cat:'Class', icon:'🩸', name:'Witcher Way Do I Go?', desc:'As a Blood Hunter, fail on a survival or nature check.'},
  {id:'c_bh_curse', cat:'Class', icon:'💉', name:'But Mine Goes To Eleven', desc:'As a Blood Hunter, amplify your Blood Curse on a single creature twice in the same encounter.'},
  {id:'c_clr_divine', cat:'Class', icon:'🙏', name:'Speed Dial', desc:'As a Cleric, of level 19 or lower, succeed at using Divine Intervention three times in a row.'},
  {id:'c_clr_heal', cat:'Class', icon:'✚', name:"Because I'm The Cleric Right?", desc:'As a Cleric, successfully heal a creature that is 10 or more feet away.'},
  {id:'c_drd_beast', cat:'Class', icon:'🐺', name:'I Wore It Better', desc:'As a Druid, defeat a beast while wild shaped as that beast.'},
  {id:'c_drd_animal', cat:'Class', icon:'🌿', name:"It's In My Nature", desc:'As a Druid, succeed on an animal handling check against a hostile creature with a DC equal to or higher than 25.'},
  {id:'c_ftr_attacks', cat:'Class', icon:'⚔', name:"We're OP Too!", desc:'As a Fighter, make a total of 8 or more attacks in a single turn.'},
  {id:'c_ftr_surge', cat:'Class', icon:'⚡', name:'I Can Do That!?', desc:'As a Fighter, use your Action Surge to use an action other than the Attack action.'},
  {id:'c_mnk_flurry', cat:'Class', icon:'👊', name:'Is That A JoJo Reference?', desc:'As a Monk, use flurry of blows with your Extra Attack feature.'},
  {id:'c_mnk_move', cat:'Class', icon:'💨', name:'Death On The Wind', desc:'As a Monk, move at least 90 feet and defeat an enemy in the same turn.'},
  {id:'c_pal_shield', cat:'Class', icon:'🛡', name:'I Am Your Shield', desc:'As a Paladin, help a friendly creature succeed on a saving throw while within your aura of protection.'},
  {id:'c_pal_smite', cat:'Class', icon:'⚡', name:'REPENT!', desc:'As a Paladin, defeat a full-health enemy with a single Smite.'},
  {id:'c_rng_nature', cat:'Class', icon:'🌲', name:'One With The Land', desc:'As a Ranger, succeed on a nature check or survival check with a DC of 25 or higher.'},
  {id:'c_rng_enemy', cat:'Class', icon:'🎯', name:'I Made That Look Easy', desc:'As a Ranger, defeat your favored enemy that is at least 2 Challenge Ratings higher than your current level in Ranger without assistance.'},
  {id:'c_rog_key', cat:'Class', icon:'🗝', name:"It's Free Real Estate", desc:'As a Rogue, successfully use sleight of hand to pick pocket the house key of an estate.'},
  {id:'c_rog_evade', cat:'Class', icon:'💨', name:'What Damage?', desc:'As a Rogue, successfully use evade to avoid over 100 points of damage.'},
  {id:'c_sor_spell', cat:'Class', icon:'🔮', name:'Check This Out', desc:"As a Sorcerer, cast a spell that is not in the Sorcerer's spell list."},
  {id:'c_sor_meta', cat:'Class', icon:'🌀', name:'This Is So Meta', desc:'As a Sorcerer, use two or more metamagic abilities in a single turn.'},
  {id:'c_wlk_summon', cat:'Class', icon:'👿', name:'Friends in Eldritch Places', desc:'As a Warlock, complete an encounter by only dealing damage from summoned creatures.'},
  {id:'c_wlk_eldritch', cat:'Class', icon:'💜', name:'The Eldritch Railgun', desc:'As a Warlock hit a creature with Eldritch Blast from over 600ft away.'},
  {id:'c_wiz_weird', cat:'Class', icon:'🌀', name:'Dr. Strange', desc:'As a Wizard learn the Weird spell.'},
  {id:'c_wiz_missile', cat:'Class', icon:'✨', name:'Dodge This', desc:'As a Wizard, defeat an adjacent enemy with magic missile.'},
  // ── Multiclassing ──
  {id:'mc_general', cat:'Multiclass', icon:'🔀', name:'Double Major', desc:'Multiclass your character.'},
  {id:'mc_art', cat:'Multiclass', icon:'⚙️', name:'I Can Make That', desc:'Multiclass into one level of Artificer.'},
  {id:'mc_barb', cat:'Multiclass', icon:'💪', name:'I Got Muscles Now', desc:'Multiclass into one level of Barbarian.'},
  {id:'mc_bard', cat:'Multiclass', icon:'🎶', name:'I Love Band Camp!', desc:'Multiclass into one level of Bard.'},
  {id:'mc_bh', cat:'Multiclass', icon:'🩸', name:'I Love Hunting Monsters', desc:'Multiclass into one level of Blood Hunter.'},
  {id:'mc_clr', cat:'Multiclass', icon:'✝️', name:'I Found Religion', desc:'Multiclass into one level of Cleric.'},
  {id:'mc_drd', cat:'Multiclass', icon:'🌿', name:'I Am One With Nature', desc:'Multiclass into one level of Druid.'},
  {id:'mc_ftr', cat:'Multiclass', icon:'⚔', name:'I Am Reliable', desc:'Multiclass into one level of Fighter.'},
  {id:'mc_mnk', cat:'Multiclass', icon:'🥋', name:'I Know Kung Fu', desc:'Multiclass into one level of Monk.'},
  {id:'mc_pal', cat:'Multiclass', icon:'🙏', name:'I Made An Oath', desc:'Multiclass into one level of Paladin.'},
  {id:'mc_rng', cat:'Multiclass', icon:'🏹', name:'I Hate Second Breakfast', desc:'Multiclass into one level of Ranger.'},
  {id:'mc_rog', cat:'Multiclass', icon:'🗡', name:'I Love Sneaking', desc:'Multiclass into one level of Rogue.'},
  {id:'mc_sor', cat:'Multiclass', icon:'💫', name:'I Was Born This Way?', desc:'Multiclass into one level of Sorcerer.'},
  {id:'mc_wiz', cat:'Multiclass', icon:'📚', name:'I Know Things', desc:'Multiclass into one level of Wizard.'},
  {id:'mc_wlk', cat:'Multiclass', icon:'😈', name:'I Fuck The Teacher', desc:'Multiclass into one level of Warlock.'},
  // ── Loot & Items ──
  {id:'i_rare', cat:'Loot', icon:'🔵', name:'It Hums With Power', desc:'Attune to a magical item that is rare.'},
  {id:'i_very_rare', cat:'Loot', icon:'🟣', name:'With This Power I Can Defeat Anyone', desc:'Attune to a magical item that is very rare.'},
  {id:'i_legendary', cat:'Loot', icon:'🟠', name:"It's Power Is Legendary", desc:'Attune to a magical item that is legendary.'},
  {id:'i_artifact', cat:'Loot', icon:'✨', name:'Unlimited Cosmic Power!', desc:'Attune to a magical item that is an artifact.'},
  {id:'i_cursed_art', cat:'Loot', icon:'💀', name:'Itty Bitty Living Space', desc:'Attune to a magical item that is a cursed artifact.'},
  {id:'i_cursed', cat:'Loot', icon:'🔴', name:'With Power Comes A Cost', desc:'Attune to a magical item knowing it has a curse.'},
  {id:'i_ac_bonus', cat:'Loot', icon:'🛡', name:'Nobody Can Defeat Me', desc:'Attune to a magical item that grants a +2 or higher bonus to Armor Class or Saving Throws.'},
  {id:'i_atk_bonus', cat:'Loot', icon:'⚔', name:"I Weap It's All So Easy", desc:'Attune to a magical item that grants a +2 or higher bonus to attack rolls.'},
  {id:'i_penalty', cat:'Loot', icon:'😰', name:'Ooh, I Feel A Bit Queazy', desc:'Attune to a magical item that has you suffer a penalty to your Hit Point Maximum, Ability Scores, Saving Throws, or Skills.'},
  {id:'i_score20', cat:'Loot', icon:'💪', name:'I Train To Win', desc:'Have one of your ability scores be 20 or higher.'},
  {id:'i_score25', cat:'Loot', icon:'🌟', name:'Mystical Being', desc:'Have one of your ability scores be 25 or higher.'},
  {id:'i_score30', cat:'Loot', icon:'🏆', name:'Godlike', desc:'Have one of your ability scores be 30.'},
  {id:'i_first_magic', cat:'Loot', icon:'🎁', name:'The First Hit Is Free', desc:'Obtain a magical item from a loot drop.'},
  {id:'i_rage_loot', cat:'Loot', icon:'💰', name:'Rage Loot', desc:'Obtain 3 or more magical items after a single encounter.'},
  // ── Avengers ──
  {id:'av_cap', cat:'Avengers', icon:'🛡', name:'Captain America', desc:'Throw a shield at an enemy and cause 20 or more damage.'},
  {id:'av_hulk', cat:'Avengers', icon:'💚', name:'HULK SMASH!', desc:'Use an unarmed attack to deal over 20 points of damage.'},
  {id:'av_thor', cat:'Avengers', icon:'⚡', name:'Thor Odinson', desc:'Defeat 5 or more enemies in a single encounter with lightning damage.'},
  {id:'av_widow', cat:'Avengers', icon:'🕷', name:'Black Widow', desc:'Have two successful consecutive attacks while dual wielding projectile weapons.'},
  {id:'av_hawk', cat:'Avengers', icon:'🏹', name:'Hawkeye', desc:'With a bow defeat an enemy from over 600 feet away.'},
  {id:'av_stark', cat:'Avengers', icon:'💀', name:"Mr. Stark… I Don't Feel So Good", desc:'A member of your party dies from the Disintegrate spell.'},
  {id:'av_panther', cat:'Avengers', icon:'🐾', name:'Black Panther', desc:'Gain an unarmed attack that deals slashing damage.'},
  {id:'av_porn', cat:'Avengers', icon:'😳', name:'I Was Watching Porn', desc:'Fail on a deception check with a DC of 5.'},
  {id:'av_galaga', cat:'Avengers', icon:'🕹', name:'He Was Playing Galaga!', desc:'Succeed on an insight check with a DC of 25 or higher.'},
  {id:'av_noknow', cat:'Avengers', icon:'❓', name:"I Don't Know What This Does", desc:'Use a magical item that has not been identified yet.'},
  {id:'av_nowknow', cat:'Avengers', icon:'💥', name:'Now I Know What That Does', desc:'Receive a curse from an unidentified magical item.'},
  // ── Hidden ──
  {id:'h_orphan', cat:'Hidden', icon:'👁', name:'(HIDDEN) How Tragic…', desc:'Play an orphaned character.'},
  {id:'h_fast', cat:'Hidden', icon:'👁', name:'(HIDDEN) Gotta Go Fast', desc:'Use 240 feet of movement in a single round of combat.'},
  {id:'h_batman', cat:'Hidden', icon:'👁', name:'(HIDDEN) A Monster In The Knight', desc:'Successfully drop down upon an enemy and silently subdue them.'},
  {id:'h_fireball', cat:'Hidden', icon:'👁', name:'(HIDDEN) Ordinary Wizarding Level Up', desc:'Learn the Fireball spell.'},
  {id:'h_good', cat:'Hidden', icon:'👁', name:'(HIDDEN) The Paragons of Virtue', desc:'Have every party member be of a good alignment.'},
  {id:'h_neutral', cat:'Hidden', icon:'👁', name:'(HIDDEN) We\'re Cool With It', desc:'Have every party member be of a neutral alignment.'},
  {id:'h_evil', cat:'Hidden', icon:'👁', name:'(HIDDEN) Hans, Are We the Baddies?', desc:'Have every party member be of an evil alignment.'},
  {id:'h_nospoon', cat:'Hidden', icon:'👁', name:'(HIDDEN) There Is No Spoon', desc:'In one round of combat successfully attack a creature, have an enemy attack miss, and save against an effect or spell.'},
  {id:'h_groot', cat:'Hidden', icon:'👁', name:'(HIDDEN) I Am Groot', desc:'You only speak one language. It must be exotic per the Players Handbook.'},
  {id:'h_langs', cat:'Hidden', icon:'👁', name:'(HIDDEN) I Can Always Say Hello', desc:'Learn at least 7 different languages with one character.'},
  {id:'h_limb', cat:'Hidden', icon:'👁', name:'(HIDDEN) Tis But A Scratch!', desc:'Lose a limb in combat.'},
  {id:'h_revenant', cat:'Hidden', icon:'👁', name:'(HIDDEN) A Monument To All My Sins', desc:'Be confronted by a revenant born from your misdeeds.'},
  {id:'h_fireball_room', cat:'Hidden', icon:'👁', name:'(HIDDEN) I Didn\'t Ask How Big the Room is…', desc:'Cast the fireball spell in a room less than 20 x 20 feet in size.'},
  {id:'h_buffed', cat:'Hidden', icon:'👁', name:'(HIDDEN) Buffed', desc:'Have Bless, Death Ward, and Shield of Faith active on a single character at the same time.'},
  {id:'h_nerfed', cat:'Hidden', icon:'👁', name:'(HIDDEN) Nerfed', desc:'Suffer from the poisoned condition, a disease, and have a point of exhaustion on a character at the same time.'},
  {id:'h_decked', cat:'Hidden', icon:'👁', name:'(HIDDEN) Decked Out', desc:'Fill all item slots with items of Very Rare or Higher.'},
  {id:'h_scanbo', cat:'Hidden', icon:'👁', name:'(HIDDEN) Scanbo', desc:'Polymorph into a dinosaur.'},
  {id:'h_drizzt', cat:'Hidden', icon:'👁', name:"(HIDDEN) Hey Look! I'm Drizzt Do'Urden!", desc:'Attack a Dracolich without your party members in the encounter initiative.'},
  {id:'h_door', cat:'Hidden', icon:'👁', name:"(HIDDEN) Don't Worry I've Got A Key", desc:'Open a locked door by physically destroying it.'},
  {id:'h_ddb', cat:'Hidden', icon:'👁', name:'(HIDDEN) Deaf, Dumb, and Blind', desc:'Suffer the blinded and deafened effects while also under the effect of Feeblemind.'},
  {id:'h_hdywdt', cat:'Hidden', icon:'👁', name:'(HIDDEN) How Do You Want To Do This?', desc:"Defeat a creature with a hit point maximum that is greater than your party's combined hit point maximum."},
  {id:'h_all', cat:'Hidden', icon:'👁', name:'(HIDDEN) You can certainly try…', desc:'Earn every single achievement on this list. Yes, all of them.'},

  // ── Session Achievements ──
  {id:'s_criticalist',    cat:'Dice',       icon:'🎯', name:'Criticalist',                                  desc:'Roll 5 or more Critical Successes in a session.'},
  {id:'s_critfail_master',cat:'Dice',       icon:'💩', name:'Critical Fail Master',                         desc:'Roll 5 or more Critical Failures in a session.'},
  {id:'s_crit_highlander',cat:'Dice',       icon:'👑', name:'Critical Highlander',                          desc:'Be the only player to roll a Critical Success in a session.'},
  {id:'s_richy_rich',     cat:'Economy',    icon:'💎', name:'Richy Rich',                                   desc:'Complete a Treasure roll where the search roll was a natural 20.'},
  {id:'s_two_crits',      cat:'Dice',       icon:'✌️', name:'Two Crits Are Better Than One',                desc:'Roll 2 consecutive Critical Successes.'},
  {id:'s_tri_crit',       cat:'Dice',       icon:'🔱', name:'Tri-Crit',                                     desc:'Roll 3 consecutive Critical Successes.'},
  {id:'s_prepare_die',    cat:'Dice',       icon:'☠️', name:'Prepare To Die',                               desc:'Roll 2 consecutive Critical Failures.'},
  {id:'s_saving_grace',   cat:'Survival',   icon:'🙏', name:'Saving Grace',                                 desc:'Roll a successful Death Save when you would die from another failed Death Save.'},
  {id:'s_biz_booming',    cat:'Economy',    icon:'📈', name:'Business is Booming',                          desc:'Start a business, guild, or service in a city.'},
  {id:'s_knock_out',      cat:'Survival',   icon:'💫', name:'Knock Yourself Out',                           desc:'Drop to 0 Hit Points due to a Critical Fail roll.'},
  {id:'s_bodies_floor',   cat:'Survival',   icon:'🪦', name:'Let The Bodies Hit The Floor',                 desc:'Drop to 0 Hit Points 2 or more times during combat.'},
  {id:'s_guaranteed',     cat:'Dice',       icon:'🎰', name:'Guaranteed Results',                           desc:"Roll 2 natural 20's on a roll with advantage, or 2 natural 1's on a roll with disadvantage."},
  {id:'s_ninja',          cat:'Dice',       icon:'🥷', name:'Ninja-Like!',                                  desc:'Roll a Critical Success on an Acrobatics check.'},
  {id:'s_i_like_hay',     cat:'Dice',       icon:'🐴', name:'I Like Hay!',                                  desc:'Roll a Critical Success on an Animal Handling check.'},
  {id:'s_omniscience',    cat:'Dice',       icon:'🔮', name:'Omniscience',                                  desc:'Roll a Critical Success on an Arcana check.'},
  {id:'s_half_hulk',      cat:'Dice',       icon:'💪', name:'Half Hulk',                                    desc:'Roll a Critical Success on an Athletics check.'},
  {id:'s_into_shadows',   cat:'Dice',       icon:'🕶️', name:'Into the Shadows',                             desc:'Roll a Critical Success on a Deception check.'},
  {id:'s_braniac',        cat:'Dice',       icon:'🧠', name:'Braniac',                                      desc:'Roll a Critical Success on a History check.'},
  {id:'s_mystical',       cat:'Dice',       icon:'🌙', name:'I Have A Mystical Feeling...',                 desc:'Roll a Critical Success on an Insight check.'},
  {id:'s_puny_person',    cat:'Dice',       icon:'😤', name:'Puny Person',                                  desc:'Roll a Critical Success on an Intimidation check.'},
  {id:'s_sherlock',       cat:'Dice',       icon:'🔍', name:'Sherlock Holmes',                              desc:'Roll a Critical Success on an Investigation check.'},
  {id:'s_flesh_wound',    cat:'Dice',       icon:'🩹', name:"It's Just A Flesh Wound",                      desc:'Roll a Critical Success on a Medicine check.'},
  {id:'s_tree_hugger',    cat:'Dice',       icon:'🌳', name:'Tree Hugger',                                  desc:'Roll a Critical Success on a Nature check.'},
  {id:'s_eagle_eyes',     cat:'Dice',       icon:'🦅', name:'Eagle Eyes',                                   desc:'Roll a Critical Success on a Perception check.'},
  {id:'s_mine_better',    cat:'Dice',       icon:'🎤', name:'Mine Is Better Than Yours',                    desc:'Roll a Critical Success on a Performance check.'},
  {id:'s_smooth_talker',  cat:'Dice',       icon:'😎', name:'Smooth Talker',                                desc:'Roll a Critical Success on a Persuasion check.'},
  {id:'s_do_you_moment',  cat:'Dice',       icon:'⛪', name:'Do You Have A Moment To Talk About My Lord & Savior?', desc:'Roll a Critical Success on a Religion check.'},
  {id:'s_jazz_hands',     cat:'Dice',       icon:'🤌', name:'Jazz Hands',                                   desc:'Roll a Critical Success on a Sleight of Hand check.'},
  {id:'s_cloak_dagger',   cat:'Dice',       icon:'🗡️', name:'Cloak and Dagger',                             desc:'Roll a Critical Success on a Stealth check.'},
  {id:'s_wilson',         cat:'Dice',       icon:'🏐', name:'Wilson?!',                                     desc:'Roll a Critical Success on a Survival check.'},
  {id:'s_critfail_champ', cat:'Dice',       icon:'🤦', name:'Critical Fail Champion',                       desc:'Achieve the Critical Fail Champion trophy at the end of a session.'},
  {id:'s_crit_champ',     cat:'Dice',       icon:'🏅', name:'Critical Champion',                            desc:'Achieve the Crown of Critting at the end of a session.'},
  {id:'s_best_rp',        cat:'Roleplay',   icon:'🎭', name:'Best Role Player',                             desc:'Achieve the most tallies in Role Playing at the end of a session.'},
  {id:'s_efficient',      cat:'Roleplay',   icon:'⚡', name:'Most Efficient Player',                        desc:'Achieve the most tallies in Efficiency at the end of a session.'},
  {id:'s_center_attn',    cat:'Roleplay',   icon:'🌟', name:'Center of Attention',                          desc:'Be responsible for the Most Memorable Moment in a session.'},
  {id:'s_interp_conflict',cat:'Roleplay',   icon:'🔄', name:'Interpersonal Conflict',                       desc:'Perform a feat so impactful that it required you to change your alignment.'},
  {id:'s_fme',            cat:'Dice',       icon:'😩', name:'F*** Me',                                      desc:'Roll a natural 20 on any roll with disadvantage, but had to use the other result.'},
  {id:'s_et_tu_brute',    cat:'Roleplay',   icon:'🗡️', name:'Et Tu Brute?',                                 desc:'Obtain the Crown of Critting before the previous person is able to expend it.'},
  {id:'s_dead_jim',       cat:'Kills',      icon:'☠️', name:"He's Dead Jim",                                desc:'Kill a creature indirectly without being in combat.'},
  {id:'s_never_same',     cat:'Survival',   icon:'🧬', name:'Never The Same Again',                         desc:'Obtain a permanent alteration to your character.'},
  {id:'s_money_bags',     cat:'Economy',    icon:'💰', name:'Money Bags',                                   desc:'Have 100 Platinum worth of money at once.'},
  {id:'s_brutality',      cat:'Kills',      icon:'💢', name:'Brutality',                                    desc:'Kill a creature with excessive force when it has only 1 Hit Point left.'},
  {id:'s_fatality',       cat:'Kills',      icon:'🩸', name:'Fatality',                                     desc:'Kill a creature after rolling a Critical Success on the attack roll.'},
  {id:'s_innate_skill',   cat:'Class',      icon:'📚', name:'Innate Skillmanship',                          desc:'Become proficient in a skill or saving throw because of an in-game effect.'},
  {id:'s_good_average',   cat:'Dice',       icon:'😐', name:"It's Good To Be Average",                      desc:"Do not roll any natural 20's or natural 1's during a session."},
  {id:'s_dragon_slayer',  cat:'Kills',      icon:'🐉', name:'Dragon Slayer',                                desc:'Kill an adult sized dragon.'},
  {id:'s_natural_select', cat:'Class',      icon:'🧬', name:'Natural Selection',                            desc:'Have an ability score increase because of an in-game effect.'},
  {id:'s_ridership',      cat:'Adventure',  icon:'🐲', name:'Ridership',                                    desc:'Become an Elder Dragon Rider.'},
  {id:'s_is_it_dead',     cat:'Combat',     icon:'👀', name:'Is It Dead?',                                  desc:'Achieve maximum result on any damage roll containing 3 or more dice.'},

  // ── Campaign Chronicles (from the official achievement scroll) ──
  {id:'p_translator',    cat:'Roleplay', icon:'🗣️',  name:'Lost in Translation',         desc:'Act as the party translator during a session.'},
  {id:'p_gold1k',        cat:'Shenanigans', icon:'💰',  name:'Four Figures Baby',           desc:'Amass 1,000 gold pieces.'},
  {id:'p_arguerules',    cat:'Roleplay', icon:'📖',  name:'Well Actually…',              desc:'Argue with the DM over a dice roll.'},
  {id:'p_deity_favor',   cat:'Politics', icon:'🙏',  name:'Speed-Dialing the Divine',    desc:'Ask a deity for a favor.'},
  {id:'p_deaf_blind',    cat:'Survival', icon:'🙈',  name:'See No Evil, Hear No Evil',   desc:'Be deaf and blind simultaneously.'},
  {id:'p_dm_ignores',    cat:'Roleplay', icon:'📚',  name:'The Rules Lawyer Rests',      desc:'Be ignored by the DM when citing rules.'},
  {id:'p_first_game',    cat:'Roleplay', icon:'⏰',  name:'Early Bird Gets the Loot',    desc:'Be the first person to arrive at a session.'},
  {id:'p_last_game',     cat:'Roleplay', icon:'🐌',  name:'Fashionably Late… To Leave',  desc:'Be the last person to leave a session.'},
  {id:'p_only_nat20',    cat:'Roleplay', icon:'🌟',  name:'Chosen One Energy',           desc:'Be the only person to roll a natural 20 at a session.'},
  {id:'p_perf_disguise', cat:'Roleplay', icon:'🎭',  name:'Method Actor',                desc:'Beat a performance check while in disguise.'},
  {id:'p_beat_campaign', cat:'Roleplay', icon:'🏆',  name:'Roll Credits',                desc:'Beat the campaign.'},
  {id:'p_deified',       cat:'Roleplay', icon:'✨',  name:'Ascended',                    desc:'Become deified.'},
  {id:'p_betray_party',  cat:'Roleplay', icon:'🗡️',  name:'Et Tu, Brute?',               desc:'Betray the party for your own personal gain.'},
  {id:'p_break_npc_rel', cat:'Roleplay', icon:'💔',  name:'Homewrecker',                 desc:'Break up an NPC marriage or relationship.'},
  {id:'p_burst_wall',    cat:'Shenanigans', icon:'🧱',  name:'The Kool-Aid Method',         desc:'Burst through a wall.'},
  {id:'p_call_liar',     cat:'Roleplay', icon:'🤥',  name:'Pinocchio Detector',          desc:'Call out a lying NPC.'},
  {id:'p_cause_tpk',     cat:'Shenanigans', icon:'☠️',  name:'You Did This',                desc:'Cause a total party kill.'},
  {id:'p_come_back_0hp', cat:'Survival', icon:'💫',  name:'I Lived, B*tch',              desc:'Come back from 0 HP.'},
  {id:'p_genocide',      cat:'Kills', icon:'💀',  name:'Villain Arc Unlocked',        desc:'Commit genocide.'},
  {id:'p_convert_npc',   cat:'Roleplay', icon:'⛪',  name:'Door-to-Door Evangelist',     desc:"Convert an NPC's religion."},
  {id:'p_predict_death', cat:'Roleplay', icon:'🔮',  name:'I See Dead Party Members',    desc:"Correctly predict another PC's death."},
  {id:'p_overkill20',    cat:'Kills', icon:'💢',  name:'Excessive Force',             desc:'Deal 20 overkill damage to 1 enemy.'},
  {id:'p_no_dmg',        cat:'Shenanigans', icon:'🕊️',  name:'Pacifist Run',                desc:'Deal no damage in an encounter.'},
  {id:'p_decap20',       cat:'Kills', icon:'🗡️',  name:'Off With Their Heads',        desc:'Decapitate 20 enemies.'},
  {id:'p_social_kill',   cat:'Kills', icon:'💬',  name:'Death by Dialogue',           desc:'Defeat an enemy using only social skills.'},
  {id:'p_coup10',        cat:'Kills', icon:'⚰️',  name:'Mercy? Never Heard of It',    desc:'Deliver 10 coups de grace.'},
  {id:'p_destroy_quest', cat:'Politics', icon:'🔥',  name:'What Quest?',                 desc:'Destroy an item necessary for a quest.'},
  {id:'p_destroy_planet',cat:'Kills', icon:'💥',  name:'That\'s No Moon…',            desc:'Destroy the planet.'},
  {id:'p_die_first',     cat:'Survival', icon:'🪦',  name:'First to Fall',               desc:'Die for the first time.'},
  {id:'p_die_second',    cat:'Survival', icon:'🪦',  name:'Again?',                      desc:'Die for the second time.'},
  {id:'p_die_third',     cat:'Survival', icon:'🪦',  name:'It\'s a Hobby at This Point', desc:'Die for the third time.'},
  {id:'p_die_puzzle',    cat:'Survival', icon:'🧩',  name:'Killed by a Riddle',          desc:'Die from a puzzle.'},
  {id:'p_disarm_npc',    cat:'Shenanigans', icon:'🤲',  name:'Now You\'re Defenceless',     desc:'Disarm an NPC.'},
  {id:'p_find_trap',     cat:'Combat', icon:'🚨',  name:'I Have a Bad Feeling',        desc:'Discover a trap before it discovers you.'},
  {id:'p_no_dmg_taken',  cat:'Survival', icon:'🛡️',  name:'Untouchable',                 desc:"Don't take damage in an encounter."},
  {id:'p_enslave',       cat:'Politics', icon:'⛓️',  name:'Tyrant\'s Throne',            desc:'Enslave a people.'},
  {id:'p_expect_favor',  cat:'Politics', icon:'😏',  name:'Payment Due',                 desc:'Expect sexual favors for saving an NPC.'},
  {id:'p_old_enemy',     cat:'Roleplay', icon:'👊',  name:'Long Time No See',            desc:'Experience revenge from an old enemy.'},
  {id:'p_red_herring',   cat:'Roleplay', icon:'🐟',  name:'Completely Bamboozled',       desc:'Fall for a red herring.'},
  {id:'p_dungeon_done',  cat:'Exploration', icon:'🏰',  name:'Dungeoneer',                  desc:'Finish a dungeon.'},
  {id:'p_long_enc',      cat:'Combat', icon:'⏱️',  name:'Are We There Yet?',           desc:'Finish an encounter lasting 10 or more rounds.'},
  {id:'p_flank_kill',    cat:'Kills', icon:'🗡️',  name:'Backstabber (Compliment)',     desc:'Flank and kill an unsuspecting enemy.'},
  {id:'p_free20',        cat:'Politics', icon:'🕊️',  name:'Liberation Day',              desc:'Free 20 captive people.'},
  {id:'p_better_armor',  cat:'Shenanigans', icon:'🛡️',  name:'Upgrade Complete',            desc:'Get a better set of armor.'},
  {id:'p_get_map',       cat:'Shenanigans', icon:'🗺️',  name:'Finally, a Map',              desc:'Get a map.'},
  {id:'p_deformity',     cat:'Survival', icon:'🤕',  name:'Distinguished Scar',          desc:'Get a permanent deformity.'},
  {id:'p_worse_reroll',  cat:'Dice', icon:'😖',  name:'Should\'ve Left It',          desc:'Get a worse result on a reroll.'},
  {id:'p_dismember',     cat:'Survival', icon:'🦾',  name:'One Arm, No Problem',         desc:'Get dismembered.'},
  {id:'p_kicked_out',    cat:'Shenanigans', icon:'🚪',  name:'86\'d',                       desc:'Get kicked out of a public establishment.'},
  {id:'p_party_trouble', cat:'Roleplay', icon:'😬',  name:'You Had One Job',             desc:'Get your entire party dragged into trouble.'},
  {id:'p_no_rest',       cat:'Survival', icon:'😩',  name:'No Rest for the Wicked',      desc:'Go 3 days without a long rest.'},
  {id:'p_no_dice',       cat:'Roleplay', icon:'🎭',  name:'Pure Roleplay Mode',          desc:"Go a full session without touching your dice."},
  {id:'p_go_broke',      cat:'Shenanigans', icon:'🪙',  name:'Down to My Last Copper',      desc:'Go broke.'},
  {id:'p_grapple3',      cat:'Combat', icon:'🤼',  name:'Hugger of the Year',          desc:'Grapple enemies 3 times in 1 encounter.'},
  {id:'p_3_conditions',  cat:'Survival', icon:'🤒',  name:'Collecting Conditions',       desc:'Have 3 types of impairing conditions at once.'},
  {id:'p_gang_up',       cat:'Combat', icon:'🐺',  name:'Pack Tactics',                desc:'Have the party gang up on a single enemy.'},
  {id:'p_dark_hit',      cat:'Combat', icon:'🌑',  name:'Blind Luck',                  desc:'Hit an enemy in complete darkness.'},
  {id:'p_ignore_plot',   cat:'Roleplay', icon:'🚶',  name:'We Do Not Read the Sign',     desc:'Ignore a crucial plot point.'},
  {id:'p_ledge_kill',    cat:'Kills', icon:'🪨',  name:'Gravity Does the Work',       desc:'Kick someone off a ledge to their death.'},
  {id:'p_kill3_halfhp',  cat:'Kills', icon:'⚔️',  name:'Executioner\'s Patience',     desc:'Kill 3 enemies at half health in 1 encounter.'},
  {id:'p_kill_deity',    cat:'Kills', icon:'💀',  name:'Deicide',                     desc:'Kill a deity.'},
  {id:'p_kill_dragon',   cat:'Kills', icon:'🐉',  name:'Dragon Slayer',               desc:'Kill a dragon.'},
  {id:'p_kill_political',cat:'Kills', icon:'🗡️',  name:'Regime Change',               desc:'Kill a beloved political figure.'},
  {id:'p_holy_kill',     cat:'Kills', icon:'✝️',  name:'Divine Justice',              desc:'Kill a monster with a holy weapon.'},
  {id:'p_solo_enc',      cat:'Kills', icon:'🦾',  name:'One Man Army',                desc:'Kill all enemies in an encounter by yourself.'},
  {id:'p_kill_annoying', cat:'Kills', icon:'🔇',  name:'Shut Up',                     desc:'Kill an annoying NPC.'},
  {id:'p_skill_kill',    cat:'Kills', icon:'📋',  name:'Death by Bureaucracy',        desc:'Kill an enemy using only skill checks.'},
  {id:'p_animal_kill',   cat:'Kills', icon:'🐾',  name:'Send the Dog',                desc:'Kill an enemy with an animal.'},
  {id:'p_improv_kill',   cat:'Kills', icon:'🍳',  name:'MacGyver Method',             desc:'Kill an enemy with an improvised weapon.'},
  {id:'p_exact_hp',      cat:'Kills', icon:'🎯',  name:'Surgical Precision',          desc:'Kill an enemy with no overkill damage.'},
  {id:'p_assassinate',   cat:'Kills', icon:'👤',  name:'Ghost Protocol',              desc:'Kill an NPC without being seen or heard.'},
  {id:'p_undead_head',   cat:'Kills', icon:'💀',  name:'Double Tap',                  desc:'Kill an undead enemy with a head shot.'},
  {id:'p_replace_ruler', cat:'Kills', icon:'👑',  name:'Long Live the New King',      desc:'Kill and replace a sovereign leader.'},
  {id:'p_public_kill',   cat:'Kills', icon:'😮',  name:'Witnesses? What Witnesses?',  desc:'Kill someone in a public place.'},
  {id:'p_god_kill',      cat:'Kills', icon:'⛪',  name:'In His Holy Name',            desc:'Kill someone in the name of a god.'},
  {id:'p_env_kill',      cat:'Kills', icon:'🌊',  name:'Environmentalist',            desc:'Kill someone using the environment.'},
  {id:'p_trigger_trap',  cat:'Combat', icon:'💣',  name:'Bold Strategy',               desc:'Knowingly activate a trap.'},
  {id:'p_high_status',   cat:'Politics', icon:'🎖️',  name:'Legitimately Powerful',       desc:'Legitimately achieve high political status.'},
  {id:'p_let_pc_die',    cat:'Kills', icon:'😈',  name:'Calculated',                  desc:'Let a fellow PC die for your personal gain.'},
  {id:'p_flaming_proj',  cat:'Kills', icon:'🔥',  name:'Cocktail Hour',               desc:'Lob a flaming projectile at an enemy.'},
  {id:'p_lose_campaign', cat:'Roleplay', icon:'😭',  name:'Total Party Loss',            desc:'Lose the campaign.'},
  {id:'p_plus1_diff',    cat:'Shenanigans', icon:'➕',  name:'+1 to Everything',            desc:'Make a success/fail difference with a +1 buff.'},
  {id:'p_recurring_vil', cat:'Roleplay', icon:'🎭',  name:'Not You Again',               desc:'Meet with a recurring villain.'},
  {id:'p_miscount_gold', cat:'Roleplay', icon:'🧮',  name:'New Math',                    desc:'Miscount gold while splitting loot.'},
  {id:'p_mix_knowledge', cat:'Roleplay', icon:'🧠',  name:'Player Brain Activated',      desc:'Mix player and character knowledge.'},
  {id:'p_open_shop',     cat:'Politics', icon:'🏪',  name:'Local Businessman',           desc:'Open a shop in a settlement.'},
  {id:'p_overthrow_gov', cat:'Politics', icon:'🏛️',  name:'Revolutionary',               desc:'Overthrow a government.'},
  {id:'p_combo_pc',      cat:'Shenanigans', icon:'🤜',  name:'Anime Moment',                desc:'Perform a combo attack with a fellow PC.'},
  {id:'p_cannibalism',   cat:'Kills', icon:'🍽️',  name:'Waste Not Want Not',          desc:'Practice cannibalism.'},
  {id:'p_fumble_0hp',    cat:'Survival', icon:'🤦',  name:'Own Goal',                    desc:'Reach 0 HP from a fumbled attack roll.'},
  {id:'p_0hp_twice',     cat:'Survival', icon:'🪀',  name:'Learning is a Process',       desc:'Reach 0 HP twice in 1 encounter.'},
  {id:'p_divine_dir',    cat:'Politics', icon:'☁️',  name:'You\'ve Got God Mail',         desc:'Receive divine direction.'},
  {id:'p_reconcile',     cat:'Politics', icon:'🕊️',  name:'Mediator Supreme',            desc:'Reconcile differences between mortal enemies.'},
  {id:'p_prone3',        cat:'Survival', icon:'😴',  name:'Floor Gang',                  desc:'Remain prone for 3 consecutive rounds.'},
  {id:'p_religious_nv',  cat:'Politics', icon:'☮️',  name:'Holy Diplomacy',              desc:'Resolve a religious conflict nonviolently.'},
  {id:'p_retreat5',      cat:'Survival', icon:'🏃',  name:'Strategic Withdrawal × 5',    desc:'Retreat from 5 battles.'},
  {id:'p_macguffin',     cat:'Shenanigans', icon:'📦',  name:'MacGuffin Acquired',          desc:'Retrieve a MacGuffin.'},
  {id:'p_revive_kill',   cat:'Kills', icon:'😇',  name:'Second Chance Denied',        desc:'Revive an NPC just to kill them yourself.'},
  {id:'p_roleplay',      cat:'Roleplay', icon:'🎭',  name:'Born for This Role',          desc:'Roleplay your character exceptionally.'},
  {id:'p_nat1_deception',cat:'Dice', icon:'😐',  name:'Worst Liar in the Realm',     desc:'Roll 1 on a deception check.'},
  {id:'p_nat1_spell',    cat:'Dice', icon:'💥',  name:'Misfire!',                    desc:'Roll 1 on a spell cast.'},
  {id:'p_nat1_init',     cat:'Dice', icon:'🐢',  name:'Caught Napping',              desc:'Roll 1 on an initiative roll.'},
  {id:'p_nat1_int',      cat:'Dice', icon:'🧱',  name:'Big Brain Moment',            desc:'Roll 1 on an intelligence check.'},
  {id:'p_two_ones_row',  cat:'Dice', icon:'🎲',  name:'Doubly Doomed',               desc:'Roll two 1\'s in a row.'},
  {id:'p_two_ones_adv',  cat:'Dice', icon:'💀',  name:'Advantage? Irrelevant',       desc:"Roll two 1's on an advantaged roll."},
  {id:'p_two_20_row',    cat:'Dice', icon:'🌟',  name:'On a Roll',                   desc:"Roll two 20's in a row."},
  {id:'p_two_20_dis',    cat:'Dice', icon:'👑',  name:'Disadvantage? Never Heard of It', desc:"Roll two 20's on a disadvantaged roll."},
  {id:'p_nat20_persuade',cat:'Dice', icon:'😇',  name:'Silver-Tongued Devil',        desc:'Roll 20 on a persuasion check.'},
  {id:'p_nat20_acro',    cat:'Dice', icon:'🤸',  name:'Circus Act',                  desc:'Roll 20 on an acrobatics check.'},
  {id:'p_nat20_animal',  cat:'Dice', icon:'🐾',  name:'Horse Whisperer',             desc:'Roll 20 on an animal handling check.'},
  {id:'p_nat20_intim',   cat:'Dice', icon:'😤',  name:'Do You Know Who I Am?',       desc:'Roll 20 on an intimidation check.'},
  {id:'p_sacrifice',     cat:'Survival', icon:'❤️',  name:'For the Party',               desc:'Sacrifice yourself.'},
  {id:'p_save_pc',       cat:'Survival', icon:'🛡️',  name:'Guardian Angel',              desc:'Save a PC in need.'},
  {id:'p_3_melee_miss',  cat:'Combat', icon:'💨',  name:'You Can\'t Hit What You Can\'t Touch', desc:'Score 3 melee misses in 1 encounter.'},
  {id:'p_3_ranged_miss', cat:'Combat', icon:'🏹',  name:'Arrows Are Expensive Though', desc:'Score 3 ranged misses in 1 encounter.'},
  {id:'p_seduce_npc',    cat:'Shenanigans', icon:'💘',  name:'Charisma Check Passed',       desc:'Seduce an NPC.'},
  {id:'p_align_chaotic', cat:'Shenanigans', icon:'🌀',  name:'Rules Are Suggestions',       desc:'Shift your alignment to chaotic.'},
  {id:'p_align_evil',    cat:'Shenanigans', icon:'😈',  name:'Villain Arc Completed',       desc:'Shift your alignment to evil.'},
  {id:'p_walk_in',       cat:'Shenanigans', icon:'🚶',  name:'Confidence is Key',           desc:'Simply walk into a well-guarded place.'},
  {id:'p_solo_large',    cat:'Combat', icon:'🐉',  name:'Nobody Needed',               desc:'Solo a large monster.'},
  {id:'p_30min_puzzle',  cat:'Shenanigans', icon:'🧩',  name:'The Riddle of Time',          desc:'Spend more than 30 minutes on a puzzle.'},
  {id:'p_split_party',   cat:'Roleplay', icon:'💀',  name:'Bold Move Cotton',            desc:'Split the party.'},
  {id:'p_stabilize',     cat:'Survival', icon:'💊',  name:'Not Today, Death',            desc:'Stabilize a dying character.'},
  {id:'p_start_war',     cat:'Politics', icon:'⚔️',  name:'Casus Belli',                 desc:'Start a war between 2 or more countries.'},
  {id:'p_steal100g',     cat:'Shenanigans', icon:'💰',  name:'Professional Thief',          desc:'Steal more than 100 gold.'},
  {id:'p_nat20_wins',    cat:'Dice', icon:'🎲',  name:'Carried by the Dice',         desc:'Succeed only because you rolled a 20.'},
  {id:'p_protect_royal', cat:'Politics', icon:'🤴',  name:'Royal Guard',                 desc:'Successfully defend a royal life.'},
  {id:'p_interrogate',   cat:'Politics', icon:'🔦',  name:'Good Cop, No Cop',            desc:'Successfully interrogate an NPC.'},
  {id:'p_fire_dmg3',     cat:'Survival', icon:'🔥',  name:'This Is Fine',                desc:'Survive 3 rounds of ongoing fire damage.'},
  {id:'p_poison_50',     cat:'Survival', icon:'☠️',  name:'Immune to Vibes',             desc:'Survive 50 points of poison damage.'},
  {id:'p_survive_crit',  cat:'Survival', icon:'💪',  name:'That All You Got?',           desc:'Survive a crit.'},
  {id:'p_sea_monster',   cat:'Survival', icon:'🦑',  name:'Overboard and Underrated',    desc:'Survive a fight with a sea monster.'},
  {id:'p_shipwreck',     cat:'Survival', icon:'🚢',  name:'Sole Survivor',               desc:'Survive a shipwreck.'},
  {id:'p_low_hp_win',    cat:'Survival', icon:'❤️',  name:'One Foot in the Grave',       desc:'Survive an encounter with 1/4th HP remaining.'},
  {id:'p_petrified',     cat:'Survival', icon:'🪨',  name:'Rock Solid',                  desc:'Survive being petrified.'},
  {id:'p_talkative_vil', cat:'Politics', icon:'🎤',  name:'Villain Monologue Speedrun',  desc:'Take advantage of a talkative villain.'},
  {id:'p_artifact_dungeon',cat:'Shenanigans',icon:'🏺', name:'Belongs in a Museum',         desc:'Take an artifact from a dungeon.'},
  {id:'p_bribes',        cat:'Shenanigans', icon:'🤝',  name:'Grease the Wheels',           desc:'Take and/or give 10 bribes.'},
  {id:'p_drugs',         cat:'Shenanigans', icon:'💊',  name:'In-Game Pharmacist',          desc:'Take drugs in the game.'},
  {id:'p_ooc_minute',    cat:'Roleplay', icon:'🎙️',  name:'Breaking Character',          desc:'Talk out of character for a full minute.'},
  {id:'p_taunt',         cat:'Roleplay', icon:'👋',  name:'Over Here, Idiot',            desc:'Taunt an enemy to get their attention.'},
  {id:'p_npc_sidekick',  cat:'Roleplay', icon:'🤝',  name:'Unlikely Alliance',           desc:'Team up with an NPC sidekick.'},
  {id:'p_vulnerability', cat:'Combat', icon:'⚡',  name:'Targeted Strike',             desc:"Trigger an enemy's vulnerability."},
  {id:'p_poor_logic',    cat:'Shenanigans', icon:'🤷',  name:'That\'s Not How Any of This Works', desc:'Use poor logic in a persuasion check.'},
  {id:'p_verbal_abuse',  cat:'Roleplay', icon:'🗣️',  name:'With Friends Like These',     desc:'Verbally abuse a fellow PC.'},
  {id:'p_remove_limb',   cat:'Survival', icon:'✂️',  name:'Worth It Probably',           desc:'Willingly remove a limb.'},
  {id:'p_drinking',      cat:'Shenanigans', icon:'🍺',  name:'Legendary Constitution',      desc:'Win a drinking contest.'},
  {id:'p_legal_case',    cat:'Politics', icon:'⚖️',  name:'Barrister of the Realm',      desc:'Win a legal case.'},

  // ── Milestone Trackers — each milestone is a separate achievement ──
  // Enemy Slayer (7 milestones)
  {id:'tr_kills_1',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer I',   desc:'Slay 5 enemies in battle.',    tracker:{parent:'tr_kills', milestone:5,    titleReward:'Brawler',             tier:0, unit:'kills'}},
  {id:'tr_kills_2',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer II',  desc:'Slay 10 enemies in battle.',   tracker:{parent:'tr_kills', milestone:10,   titleReward:'Fighter',             tier:1, unit:'kills'}},
  {id:'tr_kills_3',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer III', desc:'Slay 25 enemies in battle.',   tracker:{parent:'tr_kills', milestone:25,   titleReward:'Warrior',             tier:2, unit:'kills'}},
  {id:'tr_kills_4',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer IV',  desc:'Slay 50 enemies in battle.',   tracker:{parent:'tr_kills', milestone:50,   titleReward:'Slayer',              tier:3, unit:'kills'}},
  {id:'tr_kills_5',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer V',   desc:'Slay 100 enemies in battle.',  tracker:{parent:'tr_kills', milestone:100,  titleReward:'Reaper',              tier:4, unit:'kills'}},
  {id:'tr_kills_6',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer VI',  desc:'Slay 500 enemies in battle.',  tracker:{parent:'tr_kills', milestone:500,  titleReward:'Warlord',             tier:5, unit:'kills'}},
  {id:'tr_kills_7',   cat:'Combat', icon:'⚔️', name:'Enemy Slayer VII', desc:'Slay 1000 enemies in battle.', tracker:{parent:'tr_kills', milestone:1000, titleReward:'Legend of Carnage',   tier:6, unit:'kills'}},
  // Natural Twenty (7)
  {id:'tr_nat20_1',   cat:'Dice', icon:'🌟', name:'Natural Twenty I',    desc:'Roll a natural 20 — 1 time.',   tracker:{parent:'tr_nat20', milestone:1,   titleReward:'Lucky',              tier:0, unit:'rolls'}},
  {id:'tr_nat20_2',   cat:'Dice', icon:'🌟', name:'Natural Twenty II',   desc:'Roll a natural 20 — 5 times.',  tracker:{parent:'tr_nat20', milestone:5,   titleReward:'Blessed',            tier:1, unit:'rolls'}},
  {id:'tr_nat20_3',   cat:'Dice', icon:'🌟', name:'Natural Twenty III',  desc:'Roll a natural 20 — 10 times.', tracker:{parent:'tr_nat20', milestone:10,  titleReward:"Fortune's Favorite", tier:2, unit:'rolls'}},
  {id:'tr_nat20_4',   cat:'Dice', icon:'🌟', name:'Natural Twenty IV',   desc:'Roll a natural 20 — 25 times.', tracker:{parent:'tr_nat20', milestone:25,  titleReward:'Touched by Fate',    tier:3, unit:'rolls'}},
  {id:'tr_nat20_5',   cat:'Dice', icon:'🌟', name:'Natural Twenty V',    desc:'Roll a natural 20 — 50 times.', tracker:{parent:'tr_nat20', milestone:50,  titleReward:'Dice Master',        tier:4, unit:'rolls'}},
  {id:'tr_nat20_6',   cat:'Dice', icon:'🌟', name:'Natural Twenty VI',   desc:'Roll a natural 20 — 100 times.',tracker:{parent:'tr_nat20', milestone:100, titleReward:'Chosen of the Die',  tier:5, unit:'rolls'}},
  {id:'tr_nat20_7',   cat:'Dice', icon:'🌟', name:'Natural Twenty VII',  desc:'Roll a natural 20 — 500 times.',tracker:{parent:'tr_nat20', milestone:500, titleReward:'Avatar of Twenty',   tier:6, unit:'rolls'}},
  // Natural One (7)
  {id:'tr_nat1_1',    cat:'Dice', icon:'💀', name:'Natural One I',    desc:'Roll a natural 1 — 1 time.',   tracker:{parent:'tr_nat1', milestone:1,   titleReward:'Fumbler',           tier:0, unit:'rolls'}},
  {id:'tr_nat1_2',    cat:'Dice', icon:'💀', name:'Natural One II',   desc:'Roll a natural 1 — 5 times.',  tracker:{parent:'tr_nat1', milestone:5,   titleReward:'The Cursed',        tier:1, unit:'rolls'}},
  {id:'tr_nat1_3',    cat:'Dice', icon:'💀', name:'Natural One III',  desc:'Roll a natural 1 — 10 times.', tracker:{parent:'tr_nat1', milestone:10,  titleReward:'Doomed',            tier:2, unit:'rolls'}},
  {id:'tr_nat1_4',    cat:'Dice', icon:'💀', name:'Natural One IV',   desc:'Roll a natural 1 — 25 times.', tracker:{parent:'tr_nat1', milestone:25,  titleReward:'Jinxed',            tier:3, unit:'rolls'}},
  {id:'tr_nat1_5',    cat:'Dice', icon:'💀', name:'Natural One V',    desc:'Roll a natural 1 — 50 times.', tracker:{parent:'tr_nat1', milestone:50,  titleReward:'Calamity',          tier:4, unit:'rolls'}},
  {id:'tr_nat1_6',    cat:'Dice', icon:'💀', name:'Natural One VI',   desc:'Roll a natural 1 — 100 times.',tracker:{parent:'tr_nat1', milestone:100, titleReward:'Harbinger of 1s',   tier:5, unit:'rolls'}},
  {id:'tr_nat1_7',    cat:'Dice', icon:'💀', name:'Natural One VII',  desc:'Roll a natural 1 — 500 times.',tracker:{parent:'tr_nat1', milestone:500, titleReward:'Living Natural 1',  tier:6, unit:'rolls'}},
  // Smooth Talker (7)
  {id:'tr_npc_1',     cat:'Roleplay', icon:'💋', name:'Smooth Talker I',    desc:'Seduce or charm 1 NPC.',    tracker:{parent:'tr_npc', milestone:1,   titleReward:'Flirt',            tier:0, unit:'NPCs'}},
  {id:'tr_npc_2',     cat:'Roleplay', icon:'💋', name:'Smooth Talker II',   desc:'Seduce or charm 3 NPCs.',   tracker:{parent:'tr_npc', milestone:3,   titleReward:'Charmer',          tier:1, unit:'NPCs'}},
  {id:'tr_npc_3',     cat:'Roleplay', icon:'💋', name:'Smooth Talker III',  desc:'Seduce or charm 5 NPCs.',   tracker:{parent:'tr_npc', milestone:5,   titleReward:'Heartbreaker',     tier:2, unit:'NPCs'}},
  {id:'tr_npc_4',     cat:'Roleplay', icon:'💋', name:'Smooth Talker IV',   desc:'Seduce or charm 10 NPCs.',  tracker:{parent:'tr_npc', milestone:10,  titleReward:'Romeo / Juliet',   tier:3, unit:'NPCs'}},
  {id:'tr_npc_5',     cat:'Roleplay', icon:'💋', name:'Smooth Talker V',    desc:'Seduce or charm 25 NPCs.',  tracker:{parent:'tr_npc', milestone:25,  titleReward:'Legendary Lover',  tier:4, unit:'NPCs'}},
  {id:'tr_npc_6',     cat:'Roleplay', icon:'💋', name:'Smooth Talker VI',   desc:'Seduce or charm 50 NPCs.',  tracker:{parent:'tr_npc', milestone:50,  titleReward:'NPC Whisperer',    tier:5, unit:'NPCs'}},
  {id:'tr_npc_7',     cat:'Roleplay', icon:'💋', name:'Smooth Talker VII',  desc:'Seduce or charm 100 NPCs.', tracker:{parent:'tr_npc', milestone:100, titleReward:'God of Charm',     tier:6, unit:'NPCs'}},
  // Gold Hoarder (7)
  {id:'tr_gold_1',    cat:'Economy', icon:'🪙', name:'Gold Hoarder I',    desc:'Accumulate 50 GP.',     tracker:{parent:'tr_gold', milestone:50,    titleReward:'Copper Pincher',  tier:0, unit:'GP'}},
  {id:'tr_gold_2',    cat:'Economy', icon:'🪙', name:'Gold Hoarder II',   desc:'Accumulate 100 GP.',    tracker:{parent:'tr_gold', milestone:100,   titleReward:'Silver Saver',    tier:1, unit:'GP'}},
  {id:'tr_gold_3',    cat:'Economy', icon:'🪙', name:'Gold Hoarder III',  desc:'Accumulate 500 GP.',    tracker:{parent:'tr_gold', milestone:500,   titleReward:'Gold Keeper',     tier:2, unit:'GP'}},
  {id:'tr_gold_4',    cat:'Economy', icon:'🪙', name:'Gold Hoarder IV',   desc:'Accumulate 1,000 GP.',  tracker:{parent:'tr_gold', milestone:1000,  titleReward:'Merchant Prince', tier:3, unit:'GP'}},
  {id:'tr_gold_5',    cat:'Economy', icon:'🪙', name:'Gold Hoarder V',    desc:'Accumulate 5,000 GP.',  tracker:{parent:'tr_gold', milestone:5000,  titleReward:"Treasury Lord",   tier:4, unit:'GP'}},
  {id:'tr_gold_6',    cat:'Economy', icon:'🪙', name:'Gold Hoarder VI',   desc:'Accumulate 10,000 GP.', tracker:{parent:'tr_gold', milestone:10000, titleReward:"Dragon's Hoard",  tier:5, unit:'GP'}},
  {id:'tr_gold_7',    cat:'Economy', icon:'🪙', name:'Gold Hoarder VII',  desc:'Accumulate 50,000 GP.', tracker:{parent:'tr_gold', milestone:50000, titleReward:'Midas Reborn',    tier:6, unit:'GP'}},
  // Giant Slayer (7)
  {id:'tr_large_1',   cat:'Combat', icon:'🐉', name:'Giant Slayer I',    desc:'Defeat 1 Large+ monster.',   tracker:{parent:'tr_large', milestone:1,   titleReward:'Brave',                 tier:0, unit:'monsters'}},
  {id:'tr_large_2',   cat:'Combat', icon:'🐉', name:'Giant Slayer II',   desc:'Defeat 5 Large+ monsters.',  tracker:{parent:'tr_large', milestone:5,   titleReward:'Monster Hunter',        tier:1, unit:'monsters'}},
  {id:'tr_large_3',   cat:'Combat', icon:'🐉', name:'Giant Slayer III',  desc:'Defeat 10 Large+ monsters.', tracker:{parent:'tr_large', milestone:10,  titleReward:'Behemoth Bane',         tier:2, unit:'monsters'}},
  {id:'tr_large_4',   cat:'Combat', icon:'🐉', name:'Giant Slayer IV',   desc:'Defeat 25 Large+ monsters.', tracker:{parent:'tr_large', milestone:25,  titleReward:'Titan Slayer',          tier:3, unit:'monsters'}},
  {id:'tr_large_5',   cat:'Combat', icon:'🐉', name:'Giant Slayer V',    desc:'Defeat 50 Large+ monsters.', tracker:{parent:'tr_large', milestone:50,  titleReward:'Dragon Slayer',         tier:4, unit:'monsters'}},
  {id:'tr_large_6',   cat:'Combat', icon:'🐉', name:'Giant Slayer VI',   desc:'Defeat 100 Large+ monsters.',tracker:{parent:'tr_large', milestone:100, titleReward:'Colossus Killer',       tier:5, unit:'monsters'}},
  {id:'tr_large_7',   cat:'Combat', icon:'🐉', name:'Giant Slayer VII',  desc:'Defeat 250 Large+ monsters.',tracker:{parent:'tr_large', milestone:250, titleReward:'Primordial Destroyer',  tier:6, unit:'monsters'}},
  // One-Turn Obliterator (7)
  {id:'tr_burst_1',   cat:'Combat', icon:'💥', name:'Obliterator I',    desc:'Deal massive damage in 1 turn — 1 time.',   tracker:{parent:'tr_burst', milestone:1,   titleReward:'Hard Hitter',          tier:0, unit:'times'}},
  {id:'tr_burst_2',   cat:'Combat', icon:'💥', name:'Obliterator II',   desc:'Deal massive damage in 1 turn — 3 times.',  tracker:{parent:'tr_burst', milestone:3,   titleReward:'Bruiser',              tier:1, unit:'times'}},
  {id:'tr_burst_3',   cat:'Combat', icon:'💥', name:'Obliterator III',  desc:'Deal massive damage in 1 turn — 5 times.',  tracker:{parent:'tr_burst', milestone:5,   titleReward:'Devastator',           tier:2, unit:'times'}},
  {id:'tr_burst_4',   cat:'Combat', icon:'💥', name:'Obliterator IV',   desc:'Deal massive damage in 1 turn — 10 times.', tracker:{parent:'tr_burst', milestone:10,  titleReward:'Force of Nature',      tier:3, unit:'times'}},
  {id:'tr_burst_5',   cat:'Combat', icon:'💥', name:'Obliterator V',    desc:'Deal massive damage in 1 turn — 25 times.', tracker:{parent:'tr_burst', milestone:25,  titleReward:'Avatar of Destruction',tier:4, unit:'times'}},
  {id:'tr_burst_6',   cat:'Combat', icon:'💥', name:'Obliterator VI',   desc:'Deal massive damage in 1 turn — 50 times.', tracker:{parent:'tr_burst', milestone:50,  titleReward:'Engine of Ruin',       tier:5, unit:'times'}},
  {id:'tr_burst_7',   cat:'Combat', icon:'💥', name:'Obliterator VII',  desc:'Deal massive damage in 1 turn — 100 times.',tracker:{parent:'tr_burst', milestone:100, titleReward:'Godslayer',            tier:6, unit:'times'}},
  // Critical Striker (7)
  {id:'tr_crit_1',    cat:'Combat', icon:'🎯', name:'Critical Striker I',    desc:'Land 1 critical hit.',   tracker:{parent:'tr_crit', milestone:1,   titleReward:'Precise',         tier:0, unit:'crits'}},
  {id:'tr_crit_2',    cat:'Combat', icon:'🎯', name:'Critical Striker II',   desc:'Land 5 critical hits.',  tracker:{parent:'tr_crit', milestone:5,   titleReward:'Sharp Eye',       tier:1, unit:'crits'}},
  {id:'tr_crit_3',    cat:'Combat', icon:'🎯', name:'Critical Striker III',  desc:'Land 10 critical hits.', tracker:{parent:'tr_crit', milestone:10,  titleReward:'Surgeon',         tier:2, unit:'crits'}},
  {id:'tr_crit_4',    cat:'Combat', icon:'🎯', name:'Critical Striker IV',   desc:'Land 25 critical hits.', tracker:{parent:'tr_crit', milestone:25,  titleReward:'Executioner',     tier:3, unit:'crits'}},
  {id:'tr_crit_5',    cat:'Combat', icon:'🎯', name:'Critical Striker V',    desc:'Land 50 critical hits.', tracker:{parent:'tr_crit', milestone:50,  titleReward:'Critical Machine',tier:4, unit:'crits'}},
  {id:'tr_crit_6',    cat:'Combat', icon:'🎯', name:'Critical Striker VI',   desc:'Land 100 critical hits.',tracker:{parent:'tr_crit', milestone:100, titleReward:'Scythe of Fate',  tier:5, unit:'crits'}},
  {id:'tr_crit_7',    cat:'Combat', icon:'🎯', name:'Critical Striker VII',  desc:'Land 500 critical hits.',tracker:{parent:'tr_crit', milestone:500, titleReward:'Death Itself',    tier:6, unit:'crits'}},
  // On the Brink (7)
  {id:'tr_1hp_1',     cat:'Survival', icon:'❤️', name:'On the Brink I',    desc:'Win an encounter at exactly 1 HP — 1 time.',   tracker:{parent:'tr_1hp', milestone:1,   titleReward:'Lucky Survivor',  tier:0, unit:'victories'}},
  {id:'tr_1hp_2',     cat:'Survival', icon:'❤️', name:'On the Brink II',   desc:'Win an encounter at exactly 1 HP — 3 times.',  tracker:{parent:'tr_1hp', milestone:3,   titleReward:'Barely Alive',    tier:1, unit:'victories'}},
  {id:'tr_1hp_3',     cat:'Survival', icon:'❤️', name:'On the Brink III',  desc:'Win an encounter at exactly 1 HP — 5 times.',  tracker:{parent:'tr_1hp', milestone:5,   titleReward:'Deathdancer',     tier:2, unit:'victories'}},
  {id:'tr_1hp_4',     cat:'Survival', icon:'❤️', name:'On the Brink IV',   desc:'Win an encounter at exactly 1 HP — 10 times.', tracker:{parent:'tr_1hp', milestone:10,  titleReward:'Immortal Spirit', tier:3, unit:'victories'}},
  {id:'tr_1hp_5',     cat:'Survival', icon:'❤️', name:'On the Brink V',    desc:'Win an encounter at exactly 1 HP — 25 times.', tracker:{parent:'tr_1hp', milestone:25,  titleReward:'Beyond Death',    tier:4, unit:'victories'}},
  {id:'tr_1hp_6',     cat:'Survival', icon:'❤️', name:'On the Brink VI',   desc:'Win an encounter at exactly 1 HP — 50 times.', tracker:{parent:'tr_1hp', milestone:50,  titleReward:'Unkillable',      tier:5, unit:'victories'}},
  {id:'tr_1hp_7',     cat:'Survival', icon:'❤️', name:'On the Brink VII',  desc:'Win an encounter at exactly 1 HP — 100 times.',tracker:{parent:'tr_1hp', milestone:100, titleReward:'The Undying',     tier:6, unit:'victories'}},
  // Big Spender (7)
  {id:'tr_spend_1',   cat:'Economy', icon:'💸', name:'Big Spender I',    desc:'Spend 50 GP.',     tracker:{parent:'tr_spend', milestone:50,    titleReward:'Shopper',          tier:0, unit:'GP'}},
  {id:'tr_spend_2',   cat:'Economy', icon:'💸', name:'Big Spender II',   desc:'Spend 100 GP.',    tracker:{parent:'tr_spend', milestone:100,   titleReward:'Patron',           tier:1, unit:'GP'}},
  {id:'tr_spend_3',   cat:'Economy', icon:'💸', name:'Big Spender III',  desc:'Spend 500 GP.',    tracker:{parent:'tr_spend', milestone:500,   titleReward:'Spendthrift',      tier:2, unit:'GP'}},
  {id:'tr_spend_4',   cat:'Economy', icon:'💸', name:'Big Spender IV',   desc:'Spend 1,000 GP.',  tracker:{parent:'tr_spend', milestone:1000,  titleReward:'High Roller',      tier:3, unit:'GP'}},
  {id:'tr_spend_5',   cat:'Economy', icon:'💸', name:'Big Spender V',    desc:'Spend 5,000 GP.',  tracker:{parent:'tr_spend', milestone:5000,  titleReward:'Merchant of Chaos',tier:4, unit:'GP'}},
  {id:'tr_spend_6',   cat:'Economy', icon:'💸', name:'Big Spender VI',   desc:'Spend 10,000 GP.', tracker:{parent:'tr_spend', milestone:10000, titleReward:'Economic Ruin',    tier:5, unit:'GP'}},
  {id:'tr_spend_7',   cat:'Economy', icon:'💸', name:'Big Spender VII',  desc:'Spend 50,000 GP.', tracker:{parent:'tr_spend', milestone:50000, titleReward:'The Void of Gold', tier:6, unit:'GP'}},
  // Well Rested (7)
  {id:'tr_rest_1',    cat:'Exploration', icon:'🛌', name:'Well Rested I',    desc:'Take 5 long rests.',   tracker:{parent:'tr_rest', milestone:5,   titleReward:'Weary Traveler',   tier:0, unit:'rests'}},
  {id:'tr_rest_2',    cat:'Exploration', icon:'🛌', name:'Well Rested II',   desc:'Take 10 long rests.',  tracker:{parent:'tr_rest', milestone:10,  titleReward:'Seasoned Sleeper', tier:1, unit:'rests'}},
  {id:'tr_rest_3',    cat:'Exploration', icon:'🛌', name:'Well Rested III',  desc:'Take 25 long rests.',  tracker:{parent:'tr_rest', milestone:25,  titleReward:'Inn Connoisseur',  tier:2, unit:'rests'}},
  {id:'tr_rest_4',    cat:'Exploration', icon:'🛌', name:'Well Rested IV',   desc:'Take 50 long rests.',  tracker:{parent:'tr_rest', milestone:50,  titleReward:'Wandering Drifter',tier:3, unit:'rests'}},
  {id:'tr_rest_5',    cat:'Exploration', icon:'🛌', name:'Well Rested V',    desc:'Take 100 long rests.', tracker:{parent:'tr_rest', milestone:100, titleReward:'Nomad',            tier:4, unit:'rests'}},
  {id:'tr_rest_6',    cat:'Exploration', icon:'🛌', name:'Well Rested VI',   desc:'Take 250 long rests.', tracker:{parent:'tr_rest', milestone:250, titleReward:'Restless Soul',    tier:5, unit:'rests'}},
  {id:'tr_rest_7',    cat:'Exploration', icon:'🛌', name:'Well Rested VII',  desc:'Take 500 long rests.', tracker:{parent:'tr_rest', milestone:500, titleReward:'Eternal Wanderer', tier:6, unit:'rests'}},
  // World Explorer (7)
  {id:'tr_loc_1',     cat:'Exploration', icon:'🗺️', name:'World Explorer I',    desc:'Visit 5 locations.',   tracker:{parent:'tr_loc', milestone:5,   titleReward:'Wanderer',       tier:0, unit:'locations'}},
  {id:'tr_loc_2',     cat:'Exploration', icon:'🗺️', name:'World Explorer II',   desc:'Visit 10 locations.',  tracker:{parent:'tr_loc', milestone:10,  titleReward:'Pathfinder',     tier:1, unit:'locations'}},
  {id:'tr_loc_3',     cat:'Exploration', icon:'🗺️', name:'World Explorer III',  desc:'Visit 25 locations.',  tracker:{parent:'tr_loc', milestone:25,  titleReward:'Explorer',       tier:2, unit:'locations'}},
  {id:'tr_loc_4',     cat:'Exploration', icon:'🗺️', name:'World Explorer IV',   desc:'Visit 50 locations.',  tracker:{parent:'tr_loc', milestone:50,  titleReward:'Cartographer',   tier:3, unit:'locations'}},
  {id:'tr_loc_5',     cat:'Exploration', icon:'🗺️', name:'World Explorer V',    desc:'Visit 100 locations.', tracker:{parent:'tr_loc', milestone:100, titleReward:'World Traveler', tier:4, unit:'locations'}},
  {id:'tr_loc_6',     cat:'Exploration', icon:'🗺️', name:'World Explorer VI',   desc:'Visit 250 locations.', tracker:{parent:'tr_loc', milestone:250, titleReward:'Realm Walker',   tier:5, unit:'locations'}},
  {id:'tr_loc_7',     cat:'Exploration', icon:'🗺️', name:'World Explorer VII',  desc:'Visit 500 locations.', tracker:{parent:'tr_loc', milestone:500, titleReward:'Planeswalker',   tier:6, unit:'locations'}},

  // ── Spell Slinger (7) — number of spells cast ──
  {id:'tr_spell_1',   cat:'Class', icon:'🪄', name:'Spell Slinger I',    desc:'Cast 15 spells.',     tracker:{parent:'tr_spell', milestone:15,   titleReward:'Apprentice',         tier:0, unit:'spells'}},
  {id:'tr_spell_2',   cat:'Class', icon:'🪄', name:'Spell Slinger II',   desc:'Cast 40 spells.',     tracker:{parent:'tr_spell', milestone:40,   titleReward:'Cantrip Cowboy',      tier:1, unit:'spells'}},
  {id:'tr_spell_3',   cat:'Class', icon:'🪄', name:'Spell Slinger III',  desc:'Cast 80 spells.',     tracker:{parent:'tr_spell', milestone:80,   titleReward:'Spellcaster',         tier:2, unit:'spells'}},
  {id:'tr_spell_4',   cat:'Class', icon:'🪄', name:'Spell Slinger IV',   desc:'Cast 150 spells.',    tracker:{parent:'tr_spell', milestone:150,  titleReward:'Arcane Adept',        tier:3, unit:'spells'}},
  {id:'tr_spell_5',   cat:'Class', icon:'🪄', name:'Spell Slinger V',    desc:'Cast 300 spells.',    tracker:{parent:'tr_spell', milestone:300,  titleReward:'Weave Bender',        tier:4, unit:'spells'}},
  {id:'tr_spell_6',   cat:'Class', icon:'🪄', name:'Spell Slinger VI',   desc:'Cast 600 spells.',    tracker:{parent:'tr_spell', milestone:600,  titleReward:'High Arcanist',       tier:5, unit:'spells'}},
  {id:'tr_spell_7',   cat:'Class', icon:'🪄', name:'Spell Slinger VII',  desc:'Cast 1,200 spells.',  tracker:{parent:'tr_spell', milestone:1200, titleReward:'Living Spellbook',    tier:6, unit:'spells'}},

  // ── Rez Master (7) — number of allies revived from 0 HP or death ──
  {id:'tr_rez_1',     cat:'Healing', icon:'✨', name:'Rez Master I',    desc:'Revive 1 fallen ally.',    tracker:{parent:'tr_rez', milestone:1,   titleReward:'First Responder',       tier:0, unit:'revives'}},
  {id:'tr_rez_2',     cat:'Healing', icon:'✨', name:'Rez Master II',   desc:'Revive 2 fallen allies.',  tracker:{parent:'tr_rez', milestone:2,   titleReward:'Field Medic',           tier:1, unit:'revives'}},
  {id:'tr_rez_3',     cat:'Healing', icon:'✨', name:'Rez Master III',  desc:'Revive 4 fallen allies.',  tracker:{parent:'tr_rez', milestone:4,   titleReward:'Life Bringer',          tier:2, unit:'revives'}},
  {id:'tr_rez_4',     cat:'Healing', icon:'✨', name:'Rez Master IV',   desc:'Revive 8 fallen allies.', tracker:{parent:'tr_rez', milestone:8,  titleReward:'Resurrectionist',       tier:3, unit:'revives'}},
  {id:'tr_rez_5',     cat:'Healing', icon:'✨', name:'Rez Master V',    desc:'Revive 15 fallen allies.', tracker:{parent:'tr_rez', milestone:15,  titleReward:'Angel of the Fallen',   tier:4, unit:'revives'}},
  {id:'tr_rez_6',     cat:'Healing', icon:'✨', name:'Rez Master VI',   desc:'Revive 25 fallen allies.', tracker:{parent:'tr_rez', milestone:25,  titleReward:'Defier of Death',       tier:5, unit:'revives'}},
  {id:'tr_rez_7',     cat:'Healing', icon:'✨', name:'Rez Master VII',  desc:'Revive 40 fallen allies.',tracker:{parent:'tr_rez', milestone:40, titleReward:'Cheater of the Grave',  tier:6, unit:'revives'}},

  // ── Lockpick Legend (7) — locks picked / traps disarmed ──
  {id:'tr_lock_1',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend I',    desc:'Pick 1 lock or disarm 1 trap.',    tracker:{parent:'tr_lock', milestone:1,   titleReward:'Amateur Picker',       tier:0, unit:'locks'}},
  {id:'tr_lock_2',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend II',   desc:'Pick 5 locks or disarm 5 traps.',  tracker:{parent:'tr_lock', milestone:5,   titleReward:'Second Story Man',     tier:1, unit:'locks'}},
  {id:'tr_lock_3',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend III',  desc:'Pick 10 locks or disarm 10 traps.',tracker:{parent:'tr_lock', milestone:10,  titleReward:'Cat Burglar',          tier:2, unit:'locks'}},
  {id:'tr_lock_4',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend IV',   desc:'Pick 20 locks or disarm 20 traps.',tracker:{parent:'tr_lock', milestone:20,  titleReward:'Master of Keys',       tier:3, unit:'locks'}},
  {id:'tr_lock_5',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend V',    desc:'Pick 40 locks or disarm 40 traps.',tracker:{parent:'tr_lock', milestone:40,  titleReward:'Shadow Hand',          tier:4, unit:'locks'}},
  {id:'tr_lock_6',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend VI',   desc:'Pick 80 locks or disarm 80 traps.',tracker:{parent:'tr_lock', milestone:80,titleReward:'Ghostwalk',            tier:5, unit:'locks'}},
  {id:'tr_lock_7',    cat:'Exploration', icon:'🔓', name:'Lockpick Legend VII',  desc:'Pick 150 locks or disarm 150 traps.',tracker:{parent:'tr_lock', milestone:150,titleReward:'The Unpickable Picker', tier:6, unit:'locks'}},

  // ── Knocked Down (7) — times dropped to 0 HP and survived ──
  {id:'tr_0hp_1',     cat:'Survival', icon:'😵', name:'Knocked Down I',    desc:'Drop to 0 HP and survive — 1 time.',   tracker:{parent:'tr_0hp', milestone:1,   titleReward:'Fallen',            tier:0, unit:'times'}},
  {id:'tr_0hp_2',     cat:'Survival', icon:'😵', name:'Knocked Down II',   desc:'Drop to 0 HP and survive — 3 times.',  tracker:{parent:'tr_0hp', milestone:3,   titleReward:'Ragdoll',           tier:1, unit:'times'}},
  {id:'tr_0hp_3',     cat:'Survival', icon:'😵', name:'Knocked Down III',  desc:'Drop to 0 HP and survive — 5 times.',  tracker:{parent:'tr_0hp', milestone:5,   titleReward:'Crash Test Dummy',  tier:2, unit:'times'}},
  {id:'tr_0hp_4',     cat:'Survival', icon:'😵', name:'Knocked Down IV',   desc:'Drop to 0 HP and survive — 10 times.', tracker:{parent:'tr_0hp', milestone:10,  titleReward:'Hard to Kill',      tier:3, unit:'times'}},
  {id:'tr_0hp_5',     cat:'Survival', icon:'😵', name:'Knocked Down V',    desc:'Drop to 0 HP and survive — 20 times.', tracker:{parent:'tr_0hp', milestone:20,  titleReward:'Nine Lives',        tier:4, unit:'times'}},
  {id:'tr_0hp_6',     cat:'Survival', icon:'😵', name:'Knocked Down VI',   desc:'Drop to 0 HP and survive — 35 times.', tracker:{parent:'tr_0hp', milestone:35,  titleReward:'Immortal Fool',     tier:5, unit:'times'}},
  {id:'tr_0hp_7',     cat:'Survival', icon:'😵', name:'Knocked Down VII',  desc:'Drop to 0 HP and survive — 60 times.',tracker:{parent:'tr_0hp', milestone:60, titleReward:'Death Proof',       tier:6, unit:'times'}},

  // ── Scroll Scribe (7) — magic items identified or scrolls used ──
  {id:'tr_scroll_1',  cat:'Loot', icon:'📜', name:'Scroll Scribe I',    desc:'Identify or use 1 magic scroll.',    tracker:{parent:'tr_scroll', milestone:1,   titleReward:'Curious Reader',   tier:0, unit:'scrolls'}},
  {id:'tr_scroll_2',  cat:'Loot', icon:'📜', name:'Scroll Scribe II',   desc:'Identify or use 4 magic scrolls.',   tracker:{parent:'tr_scroll', milestone:4,   titleReward:'Scroll Monkey',    tier:1, unit:'scrolls'}},
  {id:'tr_scroll_3',  cat:'Loot', icon:'📜', name:'Scroll Scribe III',  desc:'Identify or use 8 magic scrolls.',  tracker:{parent:'tr_scroll', milestone:8,  titleReward:'Lore Seeker',      tier:2, unit:'scrolls'}},
  {id:'tr_scroll_4',  cat:'Loot', icon:'📜', name:'Scroll Scribe IV',   desc:'Identify or use 15 magic scrolls.',  tracker:{parent:'tr_scroll', milestone:15,  titleReward:'Tome Walker',      tier:3, unit:'scrolls'}},
  {id:'tr_scroll_5',  cat:'Loot', icon:'📜', name:'Scroll Scribe V',    desc:'Identify or use 30 magic scrolls.',  tracker:{parent:'tr_scroll', milestone:30,  titleReward:'Arcane Scholar',   tier:4, unit:'scrolls'}},
  {id:'tr_scroll_6',  cat:'Loot', icon:'📜', name:'Scroll Scribe VI',   desc:'Identify or use 60 magic scrolls.', tracker:{parent:'tr_scroll', milestone:60, titleReward:'Grand Librarian',  tier:5, unit:'scrolls'}},
  {id:'tr_scroll_7',  cat:'Loot', icon:'📜', name:'Scroll Scribe VII',  desc:'Identify or use 100 magic scrolls.', tracker:{parent:'tr_scroll', milestone:100, titleReward:'The Omniscient',   tier:6, unit:'scrolls'}},

  // ── Silver Tongue (7) — successful Persuasion or Deception checks ──
  {id:'tr_persuade_1',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue I',    desc:'Succeed on 5 Persuasion or Deception checks.',    tracker:{parent:'tr_persuade', milestone:5,   titleReward:'Talker',          tier:0, unit:'checks'}},
  {id:'tr_persuade_2',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue II',   desc:'Succeed on 15 Persuasion or Deception checks.',   tracker:{parent:'tr_persuade', milestone:15,  titleReward:'Haggler',         tier:1, unit:'checks'}},
  {id:'tr_persuade_3',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue III',  desc:'Succeed on 35 Persuasion or Deception checks.',   tracker:{parent:'tr_persuade', milestone:35,  titleReward:'Wordsmith',       tier:2, unit:'checks'}},
  {id:'tr_persuade_4',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue IV',   desc:'Succeed on 75 Persuasion or Deception checks.',   tracker:{parent:'tr_persuade', milestone:75,  titleReward:'Puppetmaster',    tier:3, unit:'checks'}},
  {id:'tr_persuade_5',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue V',    desc:'Succeed on 150 Persuasion or Deception checks.',  tracker:{parent:'tr_persuade', milestone:150, titleReward:'Grand Deceiver',  tier:4, unit:'checks'}},
  {id:'tr_persuade_6',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue VI',   desc:'Succeed on 300 Persuasion or Deception checks.',  tracker:{parent:'tr_persuade', milestone:300, titleReward:'The Manipulator',tier:5, unit:'checks'}},
  {id:'tr_persuade_7',cat:'Roleplay', icon:'🗣️', name:'Silver Tongue VII',  desc:'Succeed on 600 Persuasion or Deception checks.',  tracker:{parent:'tr_persuade', milestone:600, titleReward:'The Voice',       tier:6, unit:'checks'}},

  // ── Tavern Regular (7) — taverns visited or drinks purchased ──
  {id:'tr_tavern_1',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular I',    desc:'Visit 1 tavern or purchase 1 drink.',    tracker:{parent:'tr_tavern', milestone:1,   titleReward:'Thirsty Traveler',         tier:0, unit:'visits'}},
  {id:'tr_tavern_2',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular II',   desc:'Visit 5 taverns or purchase 5 drinks.',  tracker:{parent:'tr_tavern', milestone:5,   titleReward:'Bar Fly',                  tier:1, unit:'visits'}},
  {id:'tr_tavern_3',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular III',  desc:'Visit 10 taverns or purchase 10 drinks.',tracker:{parent:'tr_tavern', milestone:10,  titleReward:'Tavern Rat',               tier:2, unit:'visits'}},
  {id:'tr_tavern_4',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular IV',   desc:'Visit 25 taverns or purchase 25 drinks.',tracker:{parent:'tr_tavern', milestone:25,  titleReward:'Connoisseur of Ales',      tier:3, unit:'visits'}},
  {id:'tr_tavern_5',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular V',    desc:'Visit 50 taverns or purchase 50 drinks.',tracker:{parent:'tr_tavern', milestone:50,  titleReward:"Barkeep's Favorite",       tier:4, unit:'visits'}},
  {id:'tr_tavern_6',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular VI',   desc:'Visit 100 taverns or purchase 100 drinks.',tracker:{parent:'tr_tavern',milestone:100, titleReward:'Living Legend of the Tap', tier:5, unit:'visits'}},
  {id:'tr_tavern_7',  cat:'Roleplay', icon:'🍺', name:'Tavern Regular VII',  desc:'Visit 250 taverns or purchase 250 drinks.',tracker:{parent:'tr_tavern',milestone:250, titleReward:'God of the Goblet',        tier:6, unit:'visits'}},

  // ── Trap Finder (7) — traps discovered before triggering ──
  {id:'tr_trap_1',    cat:'Exploration', icon:'🕳️', name:'Trap Finder I',    desc:'Detect 1 trap before triggering it.',    tracker:{parent:'tr_trap', milestone:1,   titleReward:'Wary',               tier:0, unit:'traps'}},
  {id:'tr_trap_2',    cat:'Exploration', icon:'🕳️', name:'Trap Finder II',   desc:'Detect 4 traps before triggering them.', tracker:{parent:'tr_trap', milestone:4,   titleReward:'Cautious',           tier:1, unit:'traps'}},
  {id:'tr_trap_3',    cat:'Exploration', icon:'🕳️', name:'Trap Finder III',  desc:'Detect 8 traps before triggering them.',tracker:{parent:'tr_trap', milestone:8,  titleReward:'Trap Sniffer',        tier:2, unit:'traps'}},
  {id:'tr_trap_4',    cat:'Exploration', icon:'🕳️', name:'Trap Finder IV',   desc:'Detect 15 traps before triggering them.',tracker:{parent:'tr_trap', milestone:15,  titleReward:'Dungeon Savant',      tier:3, unit:'traps'}},
  {id:'tr_trap_5',    cat:'Exploration', icon:'🕳️', name:'Trap Finder V',    desc:'Detect 30 traps before triggering them.',tracker:{parent:'tr_trap', milestone:30,  titleReward:'Paranoid Perfectionist',tier:4,unit:'traps'}},
  {id:'tr_trap_6',    cat:'Exploration', icon:'🕳️', name:'Trap Finder VI',   desc:'Detect 60 traps before triggering them.',tracker:{parent:'tr_trap',milestone:60, titleReward:'The Untriggered',    tier:5, unit:'traps'}},
  {id:'tr_trap_7',    cat:'Exploration', icon:'🕳️', name:'Trap Finder VII',  desc:'Detect 120 traps before triggering them.',tracker:{parent:'tr_trap',milestone:120, titleReward:'Ghost of the Dungeon',tier:6,unit:'traps'}},

  // ── Death Saves Survived (7) — successful death saving throws ──
  {id:'tr_deathsave_1',cat:'Dice', icon:'🎲', name:'Dice of Fate I',    desc:'Succeed on 1 death saving throw.',    tracker:{parent:'tr_deathsave', milestone:1,   titleReward:'Survivor',             tier:0, unit:'saves'}},
  {id:'tr_deathsave_2',cat:'Dice', icon:'🎲', name:'Dice of Fate II',   desc:'Succeed on 3 death saving throws.',   tracker:{parent:'tr_deathsave', milestone:3,   titleReward:'Tenacious',            tier:1, unit:'saves'}},
  {id:'tr_deathsave_3',cat:'Dice', icon:'🎲', name:'Dice of Fate III',  desc:'Succeed on 8 death saving throws.',  tracker:{parent:'tr_deathsave', milestone:8,  titleReward:'Stubbornly Alive',     tier:2, unit:'saves'}},
  {id:'tr_deathsave_4',cat:'Dice', icon:'🎲', name:'Dice of Fate IV',   desc:'Succeed on 15 death saving throws.',  tracker:{parent:'tr_deathsave', milestone:15,  titleReward:'Death Negotiator',     tier:3, unit:'saves'}},
  {id:'tr_deathsave_5',cat:'Dice', icon:'🎲', name:'Dice of Fate V',    desc:'Succeed on 30 death saving throws.',  tracker:{parent:'tr_deathsave', milestone:30,  titleReward:'Mortal Coil',          tier:4, unit:'saves'}},
  {id:'tr_deathsave_6',cat:'Dice', icon:'🎲', name:'Dice of Fate VI',   desc:'Succeed on 60 death saving throws.', tracker:{parent:'tr_deathsave', milestone:60, titleReward:'Pact with the Reaper', tier:5, unit:'saves'}},
  {id:'tr_deathsave_7',cat:'Dice', icon:'🎲', name:'Dice of Fate VII',  desc:'Succeed on 120 death saving throws.', tracker:{parent:'tr_deathsave', milestone:120, titleReward:'Immortal by Technicality',tier:6,unit:'saves'}},

  // ── Dungeon Delver (7) — dungeons / underground areas fully cleared ──
  {id:'tr_dungeon_1',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver I',    desc:'Fully clear 1 dungeon.',    tracker:{parent:'tr_dungeon', milestone:1,   titleReward:'Spelunker',           tier:0, unit:'dungeons'}},
  {id:'tr_dungeon_2',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver II',   desc:'Fully clear 3 dungeons.',   tracker:{parent:'tr_dungeon', milestone:3,   titleReward:'Dungeon Runner',       tier:1, unit:'dungeons'}},
  {id:'tr_dungeon_3',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver III',  desc:'Fully clear 6 dungeons.',   tracker:{parent:'tr_dungeon', milestone:6,   titleReward:'Tomb Raider',          tier:2, unit:'dungeons'}},
  {id:'tr_dungeon_4',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver IV',   desc:'Fully clear 12 dungeons.',  tracker:{parent:'tr_dungeon', milestone:12,  titleReward:'Crypt Keeper',         tier:3, unit:'dungeons'}},
  {id:'tr_dungeon_5',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver V',    desc:'Fully clear 25 dungeons.',  tracker:{parent:'tr_dungeon', milestone:25,  titleReward:'The Underdark Regular',tier:4, unit:'dungeons'}},
  {id:'tr_dungeon_6',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver VI',   desc:'Fully clear 50 dungeons.',  tracker:{parent:'tr_dungeon', milestone:50,  titleReward:'Dungeon Lord',         tier:5, unit:'dungeons'}},
  {id:'tr_dungeon_7',  cat:'Exploration', icon:'🏚️', name:'Dungeon Delver VII',  desc:'Fully clear 80 dungeons.', tracker:{parent:'tr_dungeon', milestone:80, titleReward:'Architect of Ruin',    tier:6, unit:'dungeons'}},

  // ── Intimidator (7) — successful Intimidation checks ──
  {id:'tr_intim_1',    cat:'Roleplay', icon:'😤', name:'Intimidator I',    desc:'Succeed on 5 Intimidation checks.',    tracker:{parent:'tr_intim', milestone:5,   titleReward:'Stern',             tier:0, unit:'checks'}},
  {id:'tr_intim_2',    cat:'Roleplay', icon:'😤', name:'Intimidator II',   desc:'Succeed on 12 Intimidation checks.',   tracker:{parent:'tr_intim', milestone:12,  titleReward:'Menacing',          tier:1, unit:'checks'}},
  {id:'tr_intim_3',    cat:'Roleplay', icon:'😤', name:'Intimidator III',  desc:'Succeed on 25 Intimidation checks.',   tracker:{parent:'tr_intim', milestone:25,  titleReward:'Fearmonger',        tier:2, unit:'checks'}},
  {id:'tr_intim_4',    cat:'Roleplay', icon:'😤', name:'Intimidator IV',   desc:'Succeed on 50 Intimidation checks.',   tracker:{parent:'tr_intim', milestone:50,  titleReward:'Terror of the Realm',tier:3,unit:'checks'}},
  {id:'tr_intim_5',    cat:'Roleplay', icon:'😤', name:'Intimidator V',    desc:'Succeed on 100 Intimidation checks.',  tracker:{parent:'tr_intim', milestone:100, titleReward:'Dread Lord',        tier:4, unit:'checks'}},
  {id:'tr_intim_6',    cat:'Roleplay', icon:'😤', name:'Intimidator VI',   desc:'Succeed on 200 Intimidation checks.',  tracker:{parent:'tr_intim', milestone:200, titleReward:'The Unkind',        tier:5, unit:'checks'}},
  {id:'tr_intim_7',    cat:'Roleplay', icon:'😤', name:'Intimidator VII',  desc:'Succeed on 400 Intimidation checks.',  tracker:{parent:'tr_intim', milestone:400, titleReward:'Living Nightmare',  tier:6, unit:'checks'}},

  // ── Shapeshifter (7) — Wild Shape or Polymorph uses ──
  {id:'tr_shift_1',    cat:'Class', icon:'🐺', name:'Shapeshifter I',    desc:'Use Wild Shape or Polymorph 5 times.',   tracker:{parent:'tr_shift', milestone:5,   titleReward:'Shifter',             tier:0, unit:'shifts'}},
  {id:'tr_shift_2',    cat:'Class', icon:'🐺', name:'Shapeshifter II',   desc:'Use Wild Shape or Polymorph 15 times.',  tracker:{parent:'tr_shift', milestone:15,  titleReward:'Skinwalker',          tier:1, unit:'shifts'}},
  {id:'tr_shift_3',    cat:'Class', icon:'🐺', name:'Shapeshifter III',  desc:'Use Wild Shape or Polymorph 30 times.',  tracker:{parent:'tr_shift', milestone:30,  titleReward:'Mimic',               tier:2, unit:'shifts'}},
  {id:'tr_shift_4',    cat:'Class', icon:'🐺', name:'Shapeshifter IV',   desc:'Use Wild Shape or Polymorph 60 times.',  tracker:{parent:'tr_shift', milestone:60,  titleReward:'Doppelganger',        tier:3, unit:'shifts'}},
  {id:'tr_shift_5',    cat:'Class', icon:'🐺', name:'Shapeshifter V',    desc:'Use Wild Shape or Polymorph 125 times.', tracker:{parent:'tr_shift', milestone:125, titleReward:'The Many-Faced',      tier:4, unit:'shifts'}},
  {id:'tr_shift_6',    cat:'Class', icon:'🐺', name:'Shapeshifter VI',   desc:'Use Wild Shape or Polymorph 250 times.', tracker:{parent:'tr_shift', milestone:250, titleReward:'Primordial Beast',    tier:5, unit:'shifts'}},
  {id:'tr_shift_7',    cat:'Class', icon:'🐺', name:'Shapeshifter VII',  desc:'Use Wild Shape or Polymorph 500 times.', tracker:{parent:'tr_shift', milestone:500, titleReward:'Nature Incarnate',    tier:6, unit:'shifts'}},

  // ── Sneak Attack (7) — number of Sneak Attacks landed ──
  {id:'tr_sneak_1',    cat:'Combat', icon:'🗡️', name:'From the Shadows I',    desc:'Land 10 Sneak Attacks.',    tracker:{parent:'tr_sneak', milestone:10,   titleReward:'Cutpurse',            tier:0, unit:'attacks'}},
  {id:'tr_sneak_2',    cat:'Combat', icon:'🗡️', name:'From the Shadows II',   desc:'Land 25 Sneak Attacks.',   tracker:{parent:'tr_sneak', milestone:25,  titleReward:'Skulker',             tier:1, unit:'attacks'}},
  {id:'tr_sneak_3',    cat:'Combat', icon:'🗡️', name:'From the Shadows III',  desc:'Land 50 Sneak Attacks.',   tracker:{parent:'tr_sneak', milestone:50,  titleReward:'Ambusher',            tier:2, unit:'attacks'}},
  {id:'tr_sneak_4',    cat:'Combat', icon:'🗡️', name:'From the Shadows IV',   desc:'Land 100 Sneak Attacks.',   tracker:{parent:'tr_sneak', milestone:100,  titleReward:'Nightblade',          tier:3, unit:'attacks'}},
  {id:'tr_sneak_5',    cat:'Combat', icon:'🗡️', name:'From the Shadows V',    desc:'Land 200 Sneak Attacks.',  tracker:{parent:'tr_sneak', milestone:200, titleReward:'Ghost Blade',         tier:4, unit:'attacks'}},
  {id:'tr_sneak_6',    cat:'Combat', icon:'🗡️', name:'From the Shadows VI',   desc:'Land 400 Sneak Attacks.',  tracker:{parent:'tr_sneak', milestone:400, titleReward:'Prince of Shadows',   tier:5, unit:'attacks'}},
  {id:'tr_sneak_7',    cat:'Combat', icon:'🗡️', name:'From the Shadows VII',  desc:'Land 750 Sneak Attacks.',  tracker:{parent:'tr_sneak', milestone:750, titleReward:'Death From Nowhere',  tier:6, unit:'attacks'}},

  // ── Concentration Master (7) — concentration spells maintained through damage ──
  {id:'tr_conc_1',     cat:'Combat', icon:'🧘', name:'Concentration Master I',    desc:'Maintain concentration through damage — 10 times.',   tracker:{parent:'tr_conc', milestone:10,   titleReward:'Focused',              tier:0, unit:'saves'}},
  {id:'tr_conc_2',     cat:'Combat', icon:'🧘', name:'Concentration Master II',   desc:'Maintain concentration through damage — 25 times.',  tracker:{parent:'tr_conc', milestone:25,  titleReward:'Unshaken',             tier:1, unit:'saves'}},
  {id:'tr_conc_3',     cat:'Combat', icon:'🧘', name:'Concentration Master III',  desc:'Maintain concentration through damage — 50 times.',  tracker:{parent:'tr_conc', milestone:50,  titleReward:'Iron Will',            tier:2, unit:'saves'}},
  {id:'tr_conc_4',     cat:'Combat', icon:'🧘', name:'Concentration Master IV',   desc:'Maintain concentration through damage — 100 times.',  tracker:{parent:'tr_conc', milestone:100,  titleReward:'Unbreakable Mind',     tier:3, unit:'saves'}},
  {id:'tr_conc_5',     cat:'Combat', icon:'🧘', name:'Concentration Master V',    desc:'Maintain concentration through damage — 200 times.', tracker:{parent:'tr_conc', milestone:200, titleReward:'The Undistracted',     tier:4, unit:'saves'}},
  {id:'tr_conc_6',     cat:'Combat', icon:'🧘', name:'Concentration Master VI',   desc:'Maintain concentration through damage — 400 times.', tracker:{parent:'tr_conc', milestone:400, titleReward:'Monolith of Focus',    tier:5, unit:'saves'}},
  {id:'tr_conc_7',     cat:'Combat', icon:'🧘', name:'Concentration Master VII',  desc:'Maintain concentration through damage — 750 times.', tracker:{parent:'tr_conc', milestone:750, titleReward:'The Immovable Caster', tier:6, unit:'saves'}},

  // ── Peacemaker (7) — encounters resolved without combat ──
  {id:'tr_peace_1',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker I',    desc:'Resolve 1 encounter without combat.',    tracker:{parent:'tr_peace', milestone:1,   titleReward:'Negotiator',           tier:0, unit:'encounters'}},
  {id:'tr_peace_2',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker II',   desc:'Resolve 3 encounters without combat.',   tracker:{parent:'tr_peace', milestone:3,   titleReward:'Diplomat',             tier:1, unit:'encounters'}},
  {id:'tr_peace_3',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker III',  desc:'Resolve 6 encounters without combat.',   tracker:{parent:'tr_peace', milestone:6,   titleReward:'Silver-tongued Saint', tier:2, unit:'encounters'}},
  {id:'tr_peace_4',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker IV',   desc:'Resolve 12 encounters without combat.',  tracker:{parent:'tr_peace', milestone:12,  titleReward:'Keeper of the Peace',  tier:3, unit:'encounters'}},
  {id:'tr_peace_5',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker V',    desc:'Resolve 25 encounters without combat.',  tracker:{parent:'tr_peace', milestone:25,  titleReward:'Ambassador',           tier:4, unit:'encounters'}},
  {id:'tr_peace_6',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker VI',   desc:'Resolve 50 encounters without combat.',  tracker:{parent:'tr_peace', milestone:50,  titleReward:'Herald of Peace',      tier:5, unit:'encounters'}},
  {id:'tr_peace_7',    cat:'Roleplay', icon:'🕊️', name:'Peacemaker VII',  desc:'Resolve 80 encounters without combat.', tracker:{parent:'tr_peace', milestone:80, titleReward:'The Bloodless',        tier:6, unit:'encounters'}},

  // ── Quest Completer (7) — quests completed ──
  {id:'tr_quest_1',    cat:'Adventure', icon:'📋', name:'Quest Completer I',    desc:'Complete 1 quest.',    tracker:{parent:'tr_quest', milestone:1,   titleReward:'Errand Boy',          tier:0, unit:'quests'}},
  {id:'tr_quest_2',    cat:'Adventure', icon:'📋', name:'Quest Completer II',   desc:'Complete 3 quests.',   tracker:{parent:'tr_quest', milestone:3,   titleReward:'Mercenary',           tier:1, unit:'quests'}},
  {id:'tr_quest_3',    cat:'Adventure', icon:'📋', name:'Quest Completer III',  desc:'Complete 7 quests.',  tracker:{parent:'tr_quest', milestone:7,  titleReward:'Adventurer',          tier:2, unit:'quests'}},
  {id:'tr_quest_4',    cat:'Adventure', icon:'📋', name:'Quest Completer IV',   desc:'Complete 15 quests.',  tracker:{parent:'tr_quest', milestone:15,  titleReward:'Champion of the People',tier:3,unit:'quests'}},
  {id:'tr_quest_5',    cat:'Adventure', icon:'📋', name:'Quest Completer V',    desc:'Complete 30 quests.',  tracker:{parent:'tr_quest', milestone:30,  titleReward:'Legendary Hero',      tier:4, unit:'quests'}},
  {id:'tr_quest_6',    cat:'Adventure', icon:'📋', name:'Quest Completer VI',   desc:'Complete 60 quests.', tracker:{parent:'tr_quest', milestone:60, titleReward:'Mythical',            tier:5, unit:'quests'}},
  {id:'tr_quest_7',    cat:'Adventure', icon:'📋', name:'Quest Completer VII',  desc:'Complete 100 quests.', tracker:{parent:'tr_quest', milestone:100, titleReward:'The Eternal',         tier:6, unit:'quests'}},

  // ── Potion Drinker (7) — potions consumed ──
  {id:'tr_potion_1',   cat:'Healing', icon:'🧪', name:'Potion Drinker I',    desc:'Drink 3 potions.',    tracker:{parent:'tr_potion', milestone:3,   titleReward:'Alchemist Apprentice',   tier:0, unit:'potions'}},
  {id:'tr_potion_2',   cat:'Healing', icon:'🧪', name:'Potion Drinker II',   desc:'Drink 8 potions.',   tracker:{parent:'tr_potion', milestone:8,  titleReward:'Flask Carrier',           tier:1, unit:'potions'}},
  {id:'tr_potion_3',   cat:'Healing', icon:'🧪', name:'Potion Drinker III',  desc:'Drink 15 potions.',   tracker:{parent:'tr_potion', milestone:15,  titleReward:'Potion Addict',           tier:2, unit:'potions'}},
  {id:'tr_potion_4',   cat:'Healing', icon:'🧪', name:'Potion Drinker IV',   desc:'Drink 30 potions.',   tracker:{parent:'tr_potion', milestone:30,  titleReward:'The Bottomless Gullet',   tier:3, unit:'potions'}},
  {id:'tr_potion_5',   cat:'Healing', icon:'🧪', name:'Potion Drinker V',    desc:'Drink 60 potions.',  tracker:{parent:'tr_potion', milestone:60, titleReward:'Human Flask',             tier:4, unit:'potions'}},
  {id:'tr_potion_6',   cat:'Healing', icon:'🧪', name:'Potion Drinker VI',   desc:'Drink 120 potions.',  tracker:{parent:'tr_potion', milestone:120, titleReward:'Walking Pharmacy',        tier:5, unit:'potions'}},
  {id:'tr_potion_7',   cat:'Healing', icon:'🧪', name:'Potion Drinker VII',  desc:'Drink 250 potions.',  tracker:{parent:'tr_potion', milestone:250, titleReward:'The Unstoppered',         tier:6, unit:'potions'}},

  // ── Bones Broken (7) — death saving throw failures survived ──
  {id:'tr_dsfail_1',   cat:'Dice', icon:'💔', name:'Close Call I',    desc:'Fail 1 death saving throw and survive.',    tracker:{parent:'tr_dsfail', milestone:1,   titleReward:'Near Miss',            tier:0, unit:'failures'}},
  {id:'tr_dsfail_2',   cat:'Dice', icon:'💔', name:'Close Call II',   desc:'Fail 3 death saving throws and survive.',   tracker:{parent:'tr_dsfail', milestone:3,   titleReward:'Living on the Edge',   tier:1, unit:'failures'}},
  {id:'tr_dsfail_3',   cat:'Dice', icon:'💔', name:'Close Call III',  desc:'Fail 6 death saving throws and survive.',  tracker:{parent:'tr_dsfail', milestone:6,  titleReward:'Barely Breathing',     tier:2, unit:'failures'}},
  {id:'tr_dsfail_4',   cat:'Dice', icon:'💔', name:'Close Call IV',   desc:'Fail 12 death saving throws and survive.',  tracker:{parent:'tr_dsfail', milestone:12,  titleReward:'Grim Statistics',      tier:3, unit:'failures'}},
  {id:'tr_dsfail_5',   cat:'Dice', icon:'💔', name:'Close Call V',    desc:'Fail 25 death saving throws and survive.',  tracker:{parent:'tr_dsfail', milestone:25,  titleReward:'Refuses to Die',       tier:4, unit:'failures'}},
  {id:'tr_dsfail_6',   cat:'Dice', icon:'💔', name:'Close Call VI',   desc:'Fail 50 death saving throws and survive.', tracker:{parent:'tr_dsfail', milestone:50, titleReward:'Spite the Reaper',     tier:5, unit:'failures'}},
  {id:'tr_dsfail_7',   cat:'Dice', icon:'💔', name:'Close Call VII',  desc:'Fail 100 death saving throws and survive.', tracker:{parent:'tr_dsfail', milestone:100, titleReward:'Absurdly Alive',       tier:6, unit:'failures'}},

  // ── NPC Killer (7) — friendly or neutral NPCs killed ──
  {id:'tr_npcfrag_1',  cat:'Kills', icon:'🪓', name:'NPC Butcher I',    desc:'Kill 1 friendly or neutral NPC.',    tracker:{parent:'tr_npcfrag', milestone:1,   titleReward:'Suspect',             tier:0, unit:'NPCs'}},
  {id:'tr_npcfrag_2',  cat:'Kills', icon:'🪓', name:'NPC Butcher II',   desc:'Kill 2 friendly or neutral NPCs.',   tracker:{parent:'tr_npcfrag', milestone:2,   titleReward:'Menace to Society',   tier:1, unit:'NPCs'}},
  {id:'tr_npcfrag_3',  cat:'Kills', icon:'🪓', name:'NPC Butcher III',  desc:'Kill 4 friendly or neutral NPCs.',   tracker:{parent:'tr_npcfrag', milestone:4,   titleReward:'Sociopath',           tier:2, unit:'NPCs'}},
  {id:'tr_npcfrag_4',  cat:'Kills', icon:'🪓', name:'NPC Butcher IV',   desc:'Kill 7 friendly or neutral NPCs.',  tracker:{parent:'tr_npcfrag', milestone:7,  titleReward:'Chaos Agent',         tier:3, unit:'NPCs'}},
  {id:'tr_npcfrag_5',  cat:'Kills', icon:'🪓', name:'NPC Butcher V',    desc:'Kill 12 friendly or neutral NPCs.',  tracker:{parent:'tr_npcfrag', milestone:12,  titleReward:'The DM Cries',        tier:4, unit:'NPCs'}},
  {id:'tr_npcfrag_6',  cat:'Kills', icon:'🪓', name:'NPC Butcher VI',   desc:'Kill 20 friendly or neutral NPCs.',  tracker:{parent:'tr_npcfrag', milestone:20,  titleReward:'Architect of Grief',  tier:5, unit:'NPCs'}},
  {id:'tr_npcfrag_7',  cat:'Kills', icon:'🪓', name:'NPC Butcher VII',  desc:'Kill 35 friendly or neutral NPCs.', tracker:{parent:'tr_npcfrag', milestone:35, titleReward:'The Party Problem',   tier:6, unit:'NPCs'}},

  // ── Inspiration Received (7) — times receiving Inspiration from DM ──
  {id:'tr_insp_1',     cat:'Roleplay', icon:'💡', name:'Inspired I',    desc:'Receive Inspiration from the DM — 1 time.',   tracker:{parent:'tr_insp', milestone:1,   titleReward:'Motivated',              tier:0, unit:'inspirations'}},
  {id:'tr_insp_2',     cat:'Roleplay', icon:'💡', name:'Inspired II',   desc:'Receive Inspiration from the DM — 3 times.',  tracker:{parent:'tr_insp', milestone:3,   titleReward:'Crowd Pleaser',           tier:1, unit:'inspirations'}},
  {id:'tr_insp_3',     cat:'Roleplay', icon:'💡', name:'Inspired III',  desc:'Receive Inspiration from the DM — 7 times.', tracker:{parent:'tr_insp', milestone:7,  titleReward:'Fan Favorite',            tier:2, unit:'inspirations'}},
  {id:'tr_insp_4',     cat:'Roleplay', icon:'💡', name:'Inspired IV',   desc:'Receive Inspiration from the DM — 15 times.', tracker:{parent:'tr_insp', milestone:15,  titleReward:'Darling of the Table',    tier:3, unit:'inspirations'}},
  {id:'tr_insp_5',     cat:'Roleplay', icon:'💡', name:'Inspired V',    desc:'Receive Inspiration from the DM — 30 times.', tracker:{parent:'tr_insp', milestone:30,  titleReward:'The DM Approves',         tier:4, unit:'inspirations'}},
  {id:'tr_insp_6',     cat:'Roleplay', icon:'💡', name:'Inspired VI',   desc:'Receive Inspiration from the DM — 60 times.',tracker:{parent:'tr_insp', milestone:60, titleReward:'Method Actor',            tier:5, unit:'inspirations'}},
  {id:'tr_insp_7',     cat:'Roleplay', icon:'💡', name:'Inspired VII',  desc:'Receive Inspiration from the DM — 100 times.',tracker:{parent:'tr_insp', milestone:100, titleReward:'The DM\'s Favorite',      tier:6, unit:'inspirations'}},

  // ── Smite Counter (7) — Divine Smites used by any Paladin ──
  {id:'tr_smite_1',    cat:'Combat', icon:'⚡', name:'Holy Avenger I',    desc:'Use Divine Smite 10 times.',    tracker:{parent:'tr_smite', milestone:10,   titleReward:'Righteous',              tier:0, unit:'smites'}},
  {id:'tr_smite_2',    cat:'Combat', icon:'⚡', name:'Holy Avenger II',   desc:'Use Divine Smite 25 times.',   tracker:{parent:'tr_smite', milestone:25,  titleReward:'Smiter',                 tier:1, unit:'smites'}},
  {id:'tr_smite_3',    cat:'Combat', icon:'⚡', name:'Holy Avenger III',  desc:'Use Divine Smite 50 times.',   tracker:{parent:'tr_smite', milestone:50,  titleReward:'Crusader',               tier:2, unit:'smites'}},
  {id:'tr_smite_4',    cat:'Combat', icon:'⚡', name:'Holy Avenger IV',   desc:'Use Divine Smite 100 times.',   tracker:{parent:'tr_smite', milestone:100,  titleReward:'Holy Warrior',           tier:3, unit:'smites'}},
  {id:'tr_smite_5',    cat:'Combat', icon:'⚡', name:'Holy Avenger V',    desc:'Use Divine Smite 200 times.',  tracker:{parent:'tr_smite', milestone:200, titleReward:'Wrath of the Divine',    tier:4, unit:'smites'}},
  {id:'tr_smite_6',    cat:'Combat', icon:'⚡', name:'Holy Avenger VI',   desc:'Use Divine Smite 400 times.',  tracker:{parent:'tr_smite', milestone:400, titleReward:'Avatar of Judgement',    tier:5, unit:'smites'}},
  {id:'tr_smite_7',    cat:'Combat', icon:'⚡', name:'Holy Avenger VII',  desc:'Use Divine Smite 750 times.',  tracker:{parent:'tr_smite', milestone:750, titleReward:'The Eternal Oath',       tier:6, unit:'smites'}},

  // ── Flanker (7) — times granting or gaining advantage through positioning ──
  {id:'tr_flank_1',    cat:'Combat', icon:'🎯', name:'Tactician I',    desc:'Gain advantage through flanking or positioning — 10 times.',   tracker:{parent:'tr_flank', milestone:10,   titleReward:'Flanker',              tier:0, unit:'times'}},
  {id:'tr_flank_2',    cat:'Combat', icon:'🎯', name:'Tactician II',   desc:'Gain advantage through flanking or positioning — 25 times.',  tracker:{parent:'tr_flank', milestone:25,  titleReward:'Tactician',            tier:1, unit:'times'}},
  {id:'tr_flank_3',    cat:'Combat', icon:'🎯', name:'Tactician III',  desc:'Gain advantage through flanking or positioning — 50 times.',  tracker:{parent:'tr_flank', milestone:50,  titleReward:'Strategist',           tier:2, unit:'times'}},
  {id:'tr_flank_4',    cat:'Combat', icon:'🎯', name:'Tactician IV',   desc:'Gain advantage through flanking or positioning — 100 times.',  tracker:{parent:'tr_flank', milestone:100,  titleReward:'Field Commander',      tier:3, unit:'times'}},
  {id:'tr_flank_5',    cat:'Combat', icon:'🎯', name:'Tactician V',    desc:'Gain advantage through flanking or positioning — 200 times.', tracker:{parent:'tr_flank', milestone:200, titleReward:'Battlefield Genius',   tier:4, unit:'times'}},
  {id:'tr_flank_6',    cat:'Combat', icon:'🎯', name:'Tactician VI',   desc:'Gain advantage through flanking or positioning — 400 times.', tracker:{parent:'tr_flank', milestone:400, titleReward:'Grand Marshal',        tier:5, unit:'times'}},
  {id:'tr_flank_7',    cat:'Combat', icon:'🎯', name:'Tactician VII',  desc:'Gain advantage through flanking or positioning — 750 times.', tracker:{parent:'tr_flank', milestone:750, titleReward:'The Unchessable',      tier:6, unit:'times'}},

  // ── Ritual Caster (7) — rituals cast ──
  {id:'tr_ritual_1',   cat:'Class', icon:'🕯️', name:'Ritual Caster I',    desc:'Cast 1 ritual spell.',    tracker:{parent:'tr_ritual', milestone:1,   titleReward:'Acolyte of the Rite',   tier:0, unit:'rituals'}},
  {id:'tr_ritual_2',   cat:'Class', icon:'🕯️', name:'Ritual Caster II',   desc:'Cast 4 ritual spells.',   tracker:{parent:'tr_ritual', milestone:4,   titleReward:'Ritualist',             tier:1, unit:'rituals'}},
  {id:'tr_ritual_3',   cat:'Class', icon:'🕯️', name:'Ritual Caster III',  desc:'Cast 8 ritual spells.',  tracker:{parent:'tr_ritual', milestone:8,  titleReward:'Ceremonialist',         tier:2, unit:'rituals'}},
  {id:'tr_ritual_4',   cat:'Class', icon:'🕯️', name:'Ritual Caster IV',   desc:'Cast 15 ritual spells.',  tracker:{parent:'tr_ritual', milestone:15,  titleReward:'Keeper of Old Words',   tier:3, unit:'rituals'}},
  {id:'tr_ritual_5',   cat:'Class', icon:'🕯️', name:'Ritual Caster V',    desc:'Cast 30 ritual spells.',  tracker:{parent:'tr_ritual', milestone:30,  titleReward:'High Priest of Form',   tier:4, unit:'rituals'}},
  {id:'tr_ritual_6',   cat:'Class', icon:'🕯️', name:'Ritual Caster VI',   desc:'Cast 60 ritual spells.', tracker:{parent:'tr_ritual', milestone:60, titleReward:'Ancient Practitioner',  tier:5, unit:'rituals'}},
  {id:'tr_ritual_7',   cat:'Class', icon:'🕯️', name:'Ritual Caster VII',  desc:'Cast 120 ritual spells.', tracker:{parent:'tr_ritual', milestone:120, titleReward:'The Rituarch',          tier:6, unit:'rituals'}},

  // ── Mount Graveyard (7) — mounts that have died under your care ──
  {id:'tr_mountdie_1', cat:'Exploration', icon:'🐴', name:'Mount Graveyard I',    desc:'Get 1 mount killed.',    tracker:{parent:'tr_mountdie', milestone:1,   titleReward:'Bad Rider',              tier:0, unit:'mounts'}},
  {id:'tr_mountdie_2', cat:'Exploration', icon:'🐴', name:'Mount Graveyard II',   desc:'Get 2 mounts killed.',   tracker:{parent:'tr_mountdie', milestone:2,   titleReward:'Horse Hazard',           tier:1, unit:'mounts'}},
  {id:'tr_mountdie_3', cat:'Exploration', icon:'🐴', name:'Mount Graveyard III',  desc:'Get 3 mounts killed.',   tracker:{parent:'tr_mountdie', milestone:3,   titleReward:'Serial Mount Killer',    tier:2, unit:'mounts'}},
  {id:'tr_mountdie_4', cat:'Exploration', icon:'🐴', name:'Mount Graveyard IV',   desc:'Get 5 mounts killed.',  tracker:{parent:'tr_mountdie', milestone:5,  titleReward:'Horse Murderer',         tier:3, unit:'mounts'}},
  {id:'tr_mountdie_5', cat:'Exploration', icon:'🐴', name:'Mount Graveyard V',    desc:'Get 8 mounts killed.',  tracker:{parent:'tr_mountdie', milestone:8,  titleReward:'The Glue Factory',       tier:4, unit:'mounts'}},
  {id:'tr_mountdie_6', cat:'Exploration', icon:'🐴', name:'Mount Graveyard VI',   desc:'Get 12 mounts killed.',  tracker:{parent:'tr_mountdie', milestone:12,  titleReward:'Equine Catastrophe',     tier:5, unit:'mounts'}},
  {id:'tr_mountdie_7', cat:'Exploration', icon:'🐴', name:'Mount Graveyard VII',  desc:'Get 20 mounts killed.', tracker:{parent:'tr_mountdie', milestone:20, titleReward:'Why Bother Walking',     tier:6, unit:'mounts'}},

  // ── Friendly Fire (7) — times hitting a party member with an attack or spell ──
  {id:'tr_ff_1',       cat:'Combat', icon:'💣', name:'Friendly Fire I',    desc:'Hit a party member with an attack or spell — 1 time.',   tracker:{parent:'tr_ff', milestone:1,   titleReward:'Clumsy',                  tier:0, unit:'incidents'}},
  {id:'tr_ff_2',       cat:'Combat', icon:'💣', name:'Friendly Fire II',   desc:'Hit a party member with an attack or spell — 2 times.',  tracker:{parent:'tr_ff', milestone:2,   titleReward:'Liability',               tier:1, unit:'incidents'}},
  {id:'tr_ff_3',       cat:'Combat', icon:'💣', name:'Friendly Fire III',  desc:'Hit a party member with an attack or spell — 4 times.',  tracker:{parent:'tr_ff', milestone:4,   titleReward:'Team Hazard',             tier:2, unit:'incidents'}},
  {id:'tr_ff_4',       cat:'Combat', icon:'💣', name:'Friendly Fire IV',   desc:'Hit a party member with an attack or spell — 7 times.', tracker:{parent:'tr_ff', milestone:7,  titleReward:"The Party's Worst Enemy", tier:3, unit:'incidents'}},
  {id:'tr_ff_5',       cat:'Combat', icon:'💣', name:'Friendly Fire V',    desc:'Hit a party member with an attack or spell — 12 times.', tracker:{parent:'tr_ff', milestone:12,  titleReward:'I Swear It Was An Accident', tier:4, unit:'incidents'}},
  {id:'tr_ff_6',       cat:'Combat', icon:'💣', name:'Friendly Fire VI',   desc:'Hit a party member with an attack or spell — 20 times.', tracker:{parent:'tr_ff', milestone:20,  titleReward:'Walking Incident Report', tier:5, unit:'incidents'}},
  {id:'tr_ff_7',       cat:'Combat', icon:'💣', name:'Friendly Fire VII',  desc:'Hit a party member with an attack or spell — 35 times.',tracker:{parent:'tr_ff', milestone:35, titleReward:'The Fireball Guy',        tier:6, unit:'incidents'}},

  // ── Short Rester (7) — short rests taken ──
  {id:'tr_srest_1',    cat:'Exploration', icon:'☕', name:'Short Rester I',    desc:'Take 5 short rests.',   tracker:{parent:'tr_srest', milestone:5,  titleReward:'Five Minute Break',      tier:0, unit:'rests'}},
  {id:'tr_srest_2',    cat:'Exploration', icon:'☕', name:'Short Rester II',   desc:'Take 15 short rests.',   tracker:{parent:'tr_srest', milestone:15,  titleReward:'Coffee Addict',          tier:1, unit:'rests'}},
  {id:'tr_srest_3',    cat:'Exploration', icon:'☕', name:'Short Rester III',  desc:'Take 30 short rests.',   tracker:{parent:'tr_srest', milestone:30,  titleReward:'Professional Napper',    tier:2, unit:'rests'}},
  {id:'tr_srest_4',    cat:'Exploration', icon:'☕', name:'Short Rester IV',   desc:'Take 60 short rests.',  tracker:{parent:'tr_srest', milestone:60, titleReward:'The Ten Minute Hero',    tier:3, unit:'rests'}},
  {id:'tr_srest_5',    cat:'Exploration', icon:'☕', name:'Short Rester V',    desc:'Take 125 short rests.',  tracker:{parent:'tr_srest', milestone:125, titleReward:'Warlord of Naps',        tier:4, unit:'rests'}},
  {id:'tr_srest_6',    cat:'Exploration', icon:'☕', name:'Short Rester VI',   desc:'Take 250 short rests.',  tracker:{parent:'tr_srest', milestone:250, titleReward:'Warlock Enjoyer',        tier:5, unit:'rests'}},
  {id:'tr_srest_7',    cat:'Exploration', icon:'☕', name:'Short Rester VII',  desc:'Take 500 short rests.',tracker:{parent:'tr_srest', milestone:500,titleReward:'What Is a Long Rest?',   tier:6, unit:'rests'}},

  // ── Ration Eater (7) — rations or meals consumed during travel ──
  {id:'tr_ration_1',   cat:'Exploration', icon:'🍖', name:'Ration Eater I',    desc:'Consume 5 rations or meals.',    tracker:{parent:'tr_ration', milestone:5,   titleReward:'Peckish',               tier:0, unit:'rations'}},
  {id:'tr_ration_2',   cat:'Exploration', icon:'🍖', name:'Ration Eater II',   desc:'Consume 15 rations or meals.',   tracker:{parent:'tr_ration', milestone:15,  titleReward:'Hungry Adventurer',     tier:1, unit:'rations'}},
  {id:'tr_ration_3',   cat:'Exploration', icon:'🍖', name:'Ration Eater III',  desc:'Consume 30 rations or meals.',   tracker:{parent:'tr_ration', milestone:30,  titleReward:'Road Food Connoisseur', tier:2, unit:'rations'}},
  {id:'tr_ration_4',   cat:'Exploration', icon:'🍖', name:'Ration Eater IV',   desc:'Consume 60 rations or meals.',   tracker:{parent:'tr_ration', milestone:60,  titleReward:'The Bottomless Pit',    tier:3, unit:'rations'}},
  {id:'tr_ration_5',   cat:'Exploration', icon:'🍖', name:'Ration Eater V',    desc:'Consume 100 rations or meals.',  tracker:{parent:'tr_ration', milestone:100, titleReward:'Eternal Hunger',        tier:4, unit:'rations'}},
  {id:'tr_ration_6',   cat:'Exploration', icon:'🍖', name:'Ration Eater VI',   desc:'Consume 200 rations or meals.',  tracker:{parent:'tr_ration', milestone:200, titleReward:'The Bottomless Stomach',tier:5, unit:'rations'}},
  {id:'tr_ration_7',   cat:'Exploration', icon:'🍖', name:'Ration Eater VII',  desc:'Consume 400 rations or meals.',  tracker:{parent:'tr_ration', milestone:400, titleReward:'Who Needs Survival?',   tier:6, unit:'rations'}},

  // ── Polyglot (7) — languages learned over a campaign ──
  {id:'tr_lang_1',     cat:'Roleplay', icon:'💬', name:'Polyglot I',    desc:'Learn 2 languages.',    tracker:{parent:'tr_lang', milestone:2,   titleReward:'Tourist',            tier:0, unit:'languages'}},
  {id:'tr_lang_2',     cat:'Roleplay', icon:'💬', name:'Polyglot II',   desc:'Learn 3 languages.',    tracker:{parent:'tr_lang', milestone:3,   titleReward:'Traveler',           tier:1, unit:'languages'}},
  {id:'tr_lang_3',     cat:'Roleplay', icon:'💬', name:'Polyglot III',  desc:'Learn 4 languages.',    tracker:{parent:'tr_lang', milestone:4,   titleReward:'Linguist',           tier:2, unit:'languages'}},
  {id:'tr_lang_4',     cat:'Roleplay', icon:'💬', name:'Polyglot IV',   desc:'Learn 6 languages.',    tracker:{parent:'tr_lang', milestone:6,   titleReward:'Interpreter',        tier:3, unit:'languages'}},
  {id:'tr_lang_5',     cat:'Roleplay', icon:'💬', name:'Polyglot V',    desc:'Learn 8 languages.',    tracker:{parent:'tr_lang', milestone:8,   titleReward:'Diplomat of Tongues',tier:4, unit:'languages'}},
  {id:'tr_lang_6',     cat:'Roleplay', icon:'💬', name:'Polyglot VI',   desc:'Learn 10 languages.',   tracker:{parent:'tr_lang', milestone:10,  titleReward:'The Rosetta Stone',  tier:5, unit:'languages'}},
  {id:'tr_lang_7',     cat:'Roleplay', icon:'💬', name:'Polyglot VII',  desc:'Learn 13 languages.',   tracker:{parent:'tr_lang', milestone:13,  titleReward:'Speaks for Everyone',tier:6, unit:'languages'}},

  // ── Disguise Artist (7) — successful disguise / impersonation checks ──
  {id:'tr_disguise_1', cat:'Roleplay', icon:'🎭', name:'Disguise Artist I',    desc:'Succeed on 1 disguise or impersonation check.',    tracker:{parent:'tr_disguise', milestone:1,   titleReward:'Costume Wearer',        tier:0, unit:'disguises'}},
  {id:'tr_disguise_2', cat:'Roleplay', icon:'🎭', name:'Disguise Artist II',   desc:'Succeed on 3 disguise or impersonation checks.',   tracker:{parent:'tr_disguise', milestone:3,   titleReward:'Understudy',            tier:1, unit:'disguises'}},
  {id:'tr_disguise_3', cat:'Roleplay', icon:'🎭', name:'Disguise Artist III',  desc:'Succeed on 6 disguise or impersonation checks.',  tracker:{parent:'tr_disguise', milestone:6,  titleReward:'Method Actor',          tier:2, unit:'disguises'}},
  {id:'tr_disguise_4', cat:'Roleplay', icon:'🎭', name:'Disguise Artist IV',   desc:'Succeed on 12 disguise or impersonation checks.',  tracker:{parent:'tr_disguise', milestone:12,  titleReward:'Master of Faces',       tier:3, unit:'disguises'}},
  {id:'tr_disguise_5', cat:'Roleplay', icon:'🎭', name:'Disguise Artist V',    desc:'Succeed on 20 disguise or impersonation checks.',  tracker:{parent:'tr_disguise', milestone:20,  titleReward:'The Faceless',          tier:4, unit:'disguises'}},
  {id:'tr_disguise_6', cat:'Roleplay', icon:'🎭', name:'Disguise Artist VI',   desc:'Succeed on 35 disguise or impersonation checks.', tracker:{parent:'tr_disguise', milestone:35, titleReward:'No One Knows My Name',  tier:5, unit:'disguises'}},
  {id:'tr_disguise_7', cat:'Roleplay', icon:'🎭', name:'Disguise Artist VII',  desc:'Succeed on 60 disguise or impersonation checks.', tracker:{parent:'tr_disguise', milestone:60, titleReward:'Who Even Am I?',        tier:6, unit:'disguises'}},

  // ── Alliance Builder (7) — factions or groups allied with ──
  {id:'tr_ally_1',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder I',    desc:'Form an alliance with 1 faction or group.',    tracker:{parent:'tr_ally', milestone:1,   titleReward:'Friend of a Friend',     tier:0, unit:'alliances'}},
  {id:'tr_ally_2',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder II',   desc:'Form alliances with 2 factions or groups.',    tracker:{parent:'tr_ally', milestone:2,   titleReward:'Networker',              tier:1, unit:'alliances'}},
  {id:'tr_ally_3',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder III',  desc:'Form alliances with 4 factions or groups.',    tracker:{parent:'tr_ally', milestone:4,   titleReward:'Schemer',                tier:2, unit:'alliances'}},
  {id:'tr_ally_4',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder IV',   desc:'Form alliances with 7 factions or groups.',   tracker:{parent:'tr_ally', milestone:7,  titleReward:'Power Broker',           tier:3, unit:'alliances'}},
  {id:'tr_ally_5',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder V',    desc:'Form alliances with 12 factions or groups.',   tracker:{parent:'tr_ally', milestone:12,  titleReward:'Master Diplomat',        tier:4, unit:'alliances'}},
  {id:'tr_ally_6',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder VI',   desc:'Form alliances with 20 factions or groups.',   tracker:{parent:'tr_ally', milestone:20,  titleReward:'The Kingmaker',          tier:5, unit:'alliances'}},
  {id:'tr_ally_7',     cat:'Roleplay', icon:'🤝', name:'Alliance Builder VII',  desc:'Form alliances with 35 factions or groups.',   tracker:{parent:'tr_ally', milestone:35,  titleReward:'Web of the World',       tier:6, unit:'alliances'}},

  // ── Rage Quitter (7) — times a Barbarian ended rage early or failed to rage ──
  {id:'tr_rage_1',     cat:'Combat', icon:'😡', name:'Rage Counter I',    desc:'Enter a Barbarian rage — 5 times.',   tracker:{parent:'tr_rage', milestone:5,   titleReward:'Irritable',              tier:0, unit:'rages'}},
  {id:'tr_rage_2',     cat:'Combat', icon:'😡', name:'Rage Counter II',   desc:'Enter a Barbarian rage — 15 times.',  tracker:{parent:'tr_rage', milestone:15,  titleReward:'Hot-Headed',             tier:1, unit:'rages'}},
  {id:'tr_rage_3',     cat:'Combat', icon:'😡', name:'Rage Counter III',  desc:'Enter a Barbarian rage — 30 times.',  tracker:{parent:'tr_rage', milestone:30,  titleReward:'Berserker',              tier:2, unit:'rages'}},
  {id:'tr_rage_4',     cat:'Combat', icon:'😡', name:'Rage Counter IV',   desc:'Enter a Barbarian rage — 60 times.',  tracker:{parent:'tr_rage', milestone:60,  titleReward:'Always Angry',           tier:3, unit:'rages'}},
  {id:'tr_rage_5',     cat:'Combat', icon:'😡', name:'Rage Counter V',    desc:'Enter a Barbarian rage — 125 times.', tracker:{parent:'tr_rage', milestone:125, titleReward:'The Eternal Tantrum',    tier:4, unit:'rages'}},
  {id:'tr_rage_6',     cat:'Combat', icon:'😡', name:'Rage Counter VI',   desc:'Enter a Barbarian rage — 250 times.', tracker:{parent:'tr_rage', milestone:250, titleReward:'Rage Is My Resting State',tier:5,unit:'rages'}},
  {id:'tr_rage_7',     cat:'Combat', icon:'😡', name:'Rage Counter VII',  desc:'Enter a Barbarian rage — 500 times.', tracker:{parent:'tr_rage', milestone:500, titleReward:'Born Furious',           tier:6, unit:'rages'}},

  // ── Rules Lawyer (7) — times citing a rule during a session ──
  {id:'tr_rules_1',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer I',    desc:'Cite a rule at the table — 3 times.',    tracker:{parent:'tr_rules', milestone:3,   titleReward:'That Guy',               tier:0, unit:'citations'}},
  {id:'tr_rules_2',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer II',   desc:'Cite a rule at the table — 10 times.',   tracker:{parent:'tr_rules', milestone:10,  titleReward:'Pedant',                 tier:1, unit:'citations'}},
  {id:'tr_rules_3',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer III',  desc:'Cite a rule at the table — 20 times.',   tracker:{parent:'tr_rules', milestone:20,  titleReward:'Book Thumper',           tier:2, unit:'citations'}},
  {id:'tr_rules_4',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer IV',   desc:'Cite a rule at the table — 40 times.',   tracker:{parent:'tr_rules', milestone:40,  titleReward:'The Rules Lawyer',       tier:3, unit:'citations'}},
  {id:'tr_rules_5',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer V',    desc:'Cite a rule at the table — 80 times.',  tracker:{parent:'tr_rules', milestone:80, titleReward:'Crawford Apologist',     tier:4, unit:'citations'}},
  {id:'tr_rules_6',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer VI',   desc:'Cite a rule at the table — 150 times.',  tracker:{parent:'tr_rules', milestone:150, titleReward:'Walking PHB',            tier:5, unit:'citations'}},
  {id:'tr_rules_7',    cat:'Roleplay', icon:'📖', name:'Rules Lawyer VII',  desc:'Cite a rule at the table — 300 times.',  tracker:{parent:'tr_rules', milestone:300, titleReward:'The DM Hates You',       tier:6, unit:'citations'}},

  // ── Pocket Sand (7) — times using the Help action to aid an ally ──
  {id:'tr_help_1',     cat:'Combat', icon:'🙌', name:'Helpful Hero I',    desc:'Use the Help action — 5 times.',   tracker:{parent:'tr_help', milestone:5,   titleReward:'Sidekick',               tier:0, unit:'assists'}},
  {id:'tr_help_2',     cat:'Combat', icon:'🙌', name:'Helpful Hero II',   desc:'Use the Help action — 15 times.',  tracker:{parent:'tr_help', milestone:15,  titleReward:'Wingman',                tier:1, unit:'assists'}},
  {id:'tr_help_3',     cat:'Combat', icon:'🙌', name:'Helpful Hero III',  desc:'Use the Help action — 30 times.',  tracker:{parent:'tr_help', milestone:30,  titleReward:'Reliable Ally',          tier:2, unit:'assists'}},
  {id:'tr_help_4',     cat:'Combat', icon:'🙌', name:'Helpful Hero IV',   desc:'Use the Help action — 60 times.',  tracker:{parent:'tr_help', milestone:60,  titleReward:'Team Player',            tier:3, unit:'assists'}},
  {id:'tr_help_5',     cat:'Combat', icon:'🙌', name:'Helpful Hero V',    desc:'Use the Help action — 125 times.', tracker:{parent:'tr_help', milestone:125, titleReward:'The Selfless',           tier:4, unit:'assists'}},
  {id:'tr_help_6',     cat:'Combat', icon:'🙌', name:'Helpful Hero VI',   desc:'Use the Help action — 250 times.', tracker:{parent:'tr_help', milestone:250, titleReward:'Guardian of the Party',  tier:5, unit:'assists'}},
  {id:'tr_help_7',     cat:'Combat', icon:'🙌', name:'Helpful Hero VII',  desc:'Use the Help action — 500 times.', tracker:{parent:'tr_help', milestone:500, titleReward:'We Could Not Have Done It Without You', tier:6, unit:'assists'}},

  // ── Counterspell King (7) — successful counterspells ──
  {id:'tr_counter_1',  cat:'Combat', icon:'🚫', name:'Counterspell King I',    desc:'Successfully counterspell 1 time.',    tracker:{parent:'tr_counter', milestone:1,   titleReward:'The Interrupter',        tier:0, unit:'counters'}},
  {id:'tr_counter_2',  cat:'Combat', icon:'🚫', name:'Counterspell King II',   desc:'Successfully counterspell 4 times.',   tracker:{parent:'tr_counter', milestone:4,   titleReward:'Spell Blocker',          tier:1, unit:'counters'}},
  {id:'tr_counter_3',  cat:'Combat', icon:'🚫', name:'Counterspell King III',  desc:'Successfully counterspell 8 times.',  tracker:{parent:'tr_counter', milestone:8,  titleReward:'Anti-Magic',             tier:2, unit:'counters'}},
  {id:'tr_counter_4',  cat:'Combat', icon:'🚫', name:'Counterspell King IV',   desc:'Successfully counterspell 18 times.',  tracker:{parent:'tr_counter', milestone:18,  titleReward:'Arcane Nullifier',       tier:3, unit:'counters'}},
  {id:'tr_counter_5',  cat:'Combat', icon:'🚫', name:'Counterspell King V',    desc:'Successfully counterspell 35 times.',  tracker:{parent:'tr_counter', milestone:35,  titleReward:'The Killjoy',            tier:4, unit:'counters'}},
  {id:'tr_counter_6',  cat:'Combat', icon:'🚫', name:'Counterspell King VI',   desc:'Successfully counterspell 70 times.', tracker:{parent:'tr_counter', milestone:70, titleReward:'Spell Reaper',           tier:5, unit:'counters'}},
  {id:'tr_counter_7',  cat:'Combat', icon:'🚫', name:'Counterspell King VII',  desc:'Successfully counterspell 150 times.', tracker:{parent:'tr_counter', milestone:150, titleReward:'No Casting In My Presence', tier:6, unit:'counters'}},

  // ── Escape Artist (7) — times escaping grapples, restraints, or magical effects ──
  {id:'tr_escape_1',   cat:'Combat', icon:'🏃', name:'Escape Artist I',    desc:'Escape a grapple, restraint, or magical effect — 3 times.',   tracker:{parent:'tr_escape', milestone:3,   titleReward:'Slippery',              tier:0, unit:'escapes'}},
  {id:'tr_escape_2',   cat:'Combat', icon:'🏃', name:'Escape Artist II',   desc:'Escape a grapple, restraint, or magical effect — 8 times.',  tracker:{parent:'tr_escape', milestone:8,  titleReward:'Greased Pig',           tier:1, unit:'escapes'}},
  {id:'tr_escape_3',   cat:'Combat', icon:'🏃', name:'Escape Artist III',  desc:'Escape a grapple, restraint, or magical effect — 15 times.',  tracker:{parent:'tr_escape', milestone:15,  titleReward:'The Houdini',           tier:2, unit:'escapes'}},
  {id:'tr_escape_4',   cat:'Combat', icon:'🏃', name:'Escape Artist IV',   desc:'Escape a grapple, restraint, or magical effect — 30 times.',  tracker:{parent:'tr_escape', milestone:30,  titleReward:'Uncatchable',           tier:3, unit:'escapes'}},
  {id:'tr_escape_5',   cat:'Combat', icon:'🏃', name:'Escape Artist V',    desc:'Escape a grapple, restraint, or magical effect — 60 times.',  tracker:{parent:'tr_escape', milestone:60,  titleReward:'The Unshackled',        tier:4, unit:'escapes'}},
  {id:'tr_escape_6',   cat:'Combat', icon:'🏃', name:'Escape Artist VI',   desc:'Escape a grapple, restraint, or magical effect — 125 times.', tracker:{parent:'tr_escape', milestone:125, titleReward:'Born Free',             tier:5, unit:'escapes'}},
  {id:'tr_escape_7',   cat:'Combat', icon:'🏃', name:'Escape Artist VII',  desc:'Escape a grapple, restraint, or magical effect — 250 times.', tracker:{parent:'tr_escape', milestone:250, titleReward:'You Cannot Hold Me',    tier:6, unit:'escapes'}},

  // ── Bonus Action Boss (7) — bonus actions used in combat ──
  {id:'tr_bonus_1',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss I',    desc:'Use a bonus action in combat — 25 times.',   tracker:{parent:'tr_bonus', milestone:25,  titleReward:'Quick Draw',             tier:0, unit:'actions'}},
  {id:'tr_bonus_2',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss II',   desc:'Use a bonus action in combat — 75 times.',   tracker:{parent:'tr_bonus', milestone:75,  titleReward:'Two Things At Once',     tier:1, unit:'actions'}},
  {id:'tr_bonus_3',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss III',  desc:'Use a bonus action in combat — 150 times.',   tracker:{parent:'tr_bonus', milestone:150,  titleReward:'Efficiency Expert',      tier:2, unit:'actions'}},
  {id:'tr_bonus_4',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss IV',   desc:'Use a bonus action in combat — 300 times.',  tracker:{parent:'tr_bonus', milestone:300, titleReward:'Action Economy Lord',    tier:3, unit:'actions'}},
  {id:'tr_bonus_5',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss V',    desc:'Use a bonus action in combat — 600 times.',  tracker:{parent:'tr_bonus', milestone:600, titleReward:'The DM Sighs',           tier:4, unit:'actions'}},
  {id:'tr_bonus_6',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss VI',   desc:'Use a bonus action in combat — 1,000 times.',  tracker:{parent:'tr_bonus', milestone:1000, titleReward:'Optimizer',              tier:5, unit:'actions'}},
  {id:'tr_bonus_7',    cat:'Combat', icon:'⚡', name:'Bonus Action Boss VII',  desc:'Use a bonus action in combat — 2,000 times.',tracker:{parent:'tr_bonus', milestone:2000,titleReward:'Understands the Rules Better Than the DM', tier:6, unit:'actions'}},
];

var achvUnlocked = {};

// ── Tracker counter storage ──────────────────────────────────────
// Stores { 'tr_kills': 47, 'tr_nat20': 3, ... }
var trackerCounts = {};

function loadTrackerCounts() {
  try {
    var raw = localStorage.getItem('dnd_tracker_counts');
    trackerCounts = raw ? JSON.parse(raw) : {};
  } catch(e) { trackerCounts = {}; }
}

function saveTrackerCounts() {
  localStorage.setItem('dnd_tracker_counts', JSON.stringify(trackerCounts));
}

// Get current count for a tracker parent id
function getTrackerCount(parentId) {
  return trackerCounts[parentId] || 0;
}

// Set counter and auto-unlock any reached milestones
function setTrackerCount(parentId, value) {
  loadTrackerCounts();
  loadAchievements();
  value = Math.max(0, parseInt(value) || 0);
  trackerCounts[parentId] = value;
  saveTrackerCounts();
  // Auto-unlock milestone achievements
  var milestoneAchievements = ACHIEVEMENTS.filter(function(a){ return a.tracker && a.tracker.parent === parentId; });
  milestoneAchievements.forEach(function(a) {
    var shouldUnlock = value >= a.tracker.milestone;
    if (shouldUnlock && !achvUnlocked[a.id]) {
      achvUnlocked[a.id] = true;
      var tier = _TRACKER_TIER_CONFIG[a.tracker.tier];
      showToast(a.icon + ' <strong>' + a.name + '</strong> unlocked! '
        + tier.label + ' milestone reached.<br>🏷️ New title: <em>"' + a.tracker.titleReward + '"</em>');
    } else if (!shouldUnlock && achvUnlocked[a.id]) {
      // If count was manually reduced below a milestone, re-lock it
      achvUnlocked[a.id] = false;
    }
  });
  // Migrate showcase: keep only the highest-reached milestone in showcase for this tracker group
  if (typeof getShowcaseAchievements === 'function' && typeof toggleShowcaseAchievement === 'function') {
    var _showcase = getShowcaseAchievements();
    var _trackerGroupIds = milestoneAchievements.map(function(a){ return a.id; });
    var _showcasedInGroup = _trackerGroupIds.filter(function(sid){ return _showcase.indexOf(sid) !== -1; });
    if (_showcasedInGroup.length > 0) {
      // Determine the correct current showcase ID (highest unlocked tier)
      var _correctId = null;
      for (var _ti = milestoneAchievements.length - 1; _ti >= 0; _ti--) {
        if (achvUnlocked[milestoneAchievements[_ti].id]) { _correctId = milestoneAchievements[_ti].id; break; }
      }
      // Remove all stale group entries; add correct one if any was showcased
      _showcasedInGroup.forEach(function(sid) {
        if (sid !== _correctId) toggleShowcaseAchievement(sid);
      });
      if (_correctId && _showcase.indexOf(_correctId) === -1) {
        toggleShowcaseAchievement(_correctId);
      }
    }
  }
  saveAchievements();
  renderAchievements();
  updatePortraitRank();
  if (typeof renderRewardsPanel === 'function') renderRewardsPanel();
  if (typeof renderTitleBadge   === 'function') renderTitleBadge();
}

function incrementTracker(parentId, delta) {
  loadTrackerCounts();
  var current = trackerCounts[parentId] || 0;
  setTrackerCount(parentId, current + (parseInt(delta) || 1));
}

// Tier visual config for tracker card borders
var _TRACKER_TIER_CONFIG = [
  { label:'Bronze',    color:'#cd7f32', glow:'rgba(205,127,50,0.6)',  shadow:'rgba(205,127,50,0.25)' },
  { label:'Silver',    color:'#c8c8c8', glow:'rgba(200,200,200,0.6)', shadow:'rgba(200,200,200,0.25)' },
  { label:'Gold',      color:'#d4af37', glow:'rgba(212,168,55,0.7)',  shadow:'rgba(212,168,55,0.3)'  },
  { label:'Emerald',   color:'#22c55e', glow:'rgba(34,197,94,0.7)',   shadow:'rgba(34,197,94,0.3)'   },
  { label:'Ruby',      color:'#e53935', glow:'rgba(229,57,53,0.7)',   shadow:'rgba(229,57,53,0.3)'   },
  { label:'Diamond',   color:'#00e5ff', glow:'rgba(0,229,255,0.75)',  shadow:'rgba(0,229,255,0.35)'  },
  { label:'Legendary', color:'#a855f7', glow:'rgba(168,85,247,0.85)', shadow:'rgba(168,85,247,0.45)' }
];

// Manual edit modal for tracker count
function openTrackerEditModal(parentId, currentCount) {
  var old = document.getElementById('tracker-edit-modal');
  if (old) old.remove();
  var label = '';
  var achv = ACHIEVEMENTS.find(function(a){ return a.tracker && a.tracker.parent === parentId; });
  if (achv) label = achv.icon + ' ' + achv.name.replace(/ (I|II|III|IV|V|VI|VII)$/, '');

  var modal = document.createElement('div');
  modal.id = 'tracker-edit-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;'
    + 'justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);';
  modal.innerHTML =
    '<div style="background:var(--bg-panel);border:1px solid var(--border-gold);border-radius:10px;'
    + 'padding:24px 28px;min-width:280px;max-width:340px;box-shadow:var(--shadow-gold);text-align:center;">'
    + '<div style="font-family:\'Cinzel\',serif;font-size:15px;font-weight:700;color:var(--accent-gold-bright);margin-bottom:4px;">' + label + '</div>'
    + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Set count manually</div>'
    + '<input id="tracker-edit-input" type="number" min="0" value="' + currentCount + '" '
      + 'style="width:100%;padding:10px 12px;border-radius:6px;border:1px solid var(--border-gold);'
      + 'background:var(--bg-card);color:var(--text-primary);font-size:20px;text-align:center;'
      + 'font-family:\'Cinzel\',serif;box-sizing:border-box;margin-bottom:16px;">'
    + '<div style="display:flex;gap:8px;">'
      + '<button onclick="document.getElementById(\'tracker-edit-modal\').remove()" '
        + 'style="flex:1;padding:9px;border-radius:6px;border:1px solid var(--border-dark);'
        + 'background:var(--bg-card);color:var(--text-muted);cursor:pointer;font-family:\'Cinzel\',serif;font-size:12px;">Cancel</button>'
      + '<button onclick="_confirmTrackerEdit(\'' + parentId + '\')" '
        + 'style="flex:1;padding:9px;border-radius:6px;border:1px solid var(--border-gold);'
        + 'background:var(--accent-gold);color:#1a1208;cursor:pointer;font-family:\'Cinzel\',serif;font-size:12px;font-weight:700;">Confirm</button>'
    + '</div>'
    + '</div>';
  document.body.appendChild(modal);
  var inp = document.getElementById('tracker-edit-input');
  if (inp) { inp.focus(); inp.select(); }
  modal.addEventListener('click', function(e){ if (e.target === modal) modal.remove(); });
  if (inp) inp.addEventListener('keydown', function(e){
    if (e.key === 'Enter')  _confirmTrackerEdit(parentId);
    if (e.key === 'Escape') modal.remove();
  });
}

function _confirmTrackerEdit(parentId) {
  var inp   = document.getElementById('tracker-edit-input');
  var modal = document.getElementById('tracker-edit-modal');
  if (modal) modal.remove();
  if (!inp) return;
  setTrackerCount(parentId, parseInt(inp.value));
}

// Init tracker counts on load
loadTrackerCounts();

function loadAchievements() {
  try {
    var raw = localStorage.getItem('dnd_achievements');
    achvUnlocked = raw ? JSON.parse(raw) : {};
  } catch(e) { achvUnlocked = {}; }
}

function saveAchievements() {
  localStorage.setItem('dnd_achievements', JSON.stringify(achvUnlocked));
}

function exportAchievements() {
  loadAchievements();
  var exportData = {
    _type: 'dnd_achievements_backup',
    _version: 1,
    _date: new Date().toISOString().slice(0,10),
    achievements: achvUnlocked,
    activeTitle: localStorage.getItem('dnd_active_title') || null,
    activeAura:  localStorage.getItem('dnd_active_aura')  || null
  };
  var blob = new Blob([JSON.stringify(exportData, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'achievements_' + exportData._date + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('🏆 Achievements exported!');
}

function importAchievements() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var parsed = JSON.parse(ev.target.result);
        var achvData = (parsed._type === 'dnd_achievements_backup') ? parsed.achievements : parsed;
        if (typeof achvData !== 'object' || Array.isArray(achvData)) throw new Error('Invalid format');
        loadAchievements();
        Object.assign(achvUnlocked, achvData);
        saveAchievements();
        if (parsed.activeTitle) localStorage.setItem('dnd_active_title', parsed.activeTitle);
        if (parsed.activeAura)  localStorage.setItem('dnd_active_aura',  parsed.activeAura);
        renderAchievements();
        if (typeof renderRewardsPanel === 'function') renderRewardsPanel();
        if (typeof renderTitleBadge   === 'function') renderTitleBadge();
        if (typeof renderPortraitAura === 'function') renderPortraitAura();
        showToast('✅ Achievements imported!');
      } catch(err) {
        showToast('❌ Import failed — invalid file');
      }
    };
    reader.readAsText(file);
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

function getPlayerRank(count) {
  // Scaled for 200 Myth max (out of 376 total)
  if (count >= 200) return { label: 'Myth',       icon: '🌌', cssClass: 'rank-myth',       badgeClass: 'rank-badge-myth',       next: null,         threshold: 200 };
  if (count >= 130) return { label: 'Legend',     icon: '👑', cssClass: 'rank-legend',     badgeClass: 'rank-badge-legend',     next: 'Myth',       threshold: 200 };
  if (count >= 80)  return { label: 'Hero',       icon: '⭐', cssClass: 'rank-hero',       badgeClass: 'rank-badge-hero',       next: 'Legend',     threshold: 130 };
  if (count >= 45)  return { label: 'Champion',   icon: '🥇', cssClass: 'rank-champion',   badgeClass: 'rank-badge-champion',   next: 'Hero',       threshold: 80  };
  if (count >= 25)  return { label: 'Veteran',    icon: '🥈', cssClass: 'rank-veteran',    badgeClass: 'rank-badge-veteran',    next: 'Champion',   threshold: 45  };
  if (count >= 12)  return { label: 'Journeyman', icon: '🌿', cssClass: 'rank-journeyman', badgeClass: 'rank-badge-journeyman', next: 'Veteran',    threshold: 25  };
  if (count >= 5)   return { label: 'Adventurer', icon: '🥉', cssClass: 'rank-adventurer', badgeClass: 'rank-badge-adventurer', next: 'Journeyman', threshold: 12  };
  if (count >= 1)   return { label: 'Squire',     icon: '🔰', cssClass: 'rank-squire',     badgeClass: 'rank-badge-squire',     next: 'Adventurer', threshold: 5   };
  return             { label: 'Commoner',   icon: '⚫', cssClass: 'rank-commoner',   badgeClass: 'rank-badge-commoner',   next: 'Squire',     threshold: 1   };
}

// ── Rank frame ornament configs ──
var RANK_FRAME_CONFIG = {
  'rank-commoner':   { corners: false, midMarks: false, topGem: false },
  'rank-squire':     { corners: 2,     midMarks: false, topGem: false },
  'rank-adventurer': { corners: 2,     midMarks: false, topGem: false },
  'rank-journeyman': { corners: 2,     midMarks: false, topGem: false },
  'rank-veteran':    { corners: 2,     midMarks: true,  topGem: false },
  'rank-champion':   { corners: 4,     midMarks: true,  topGem: false },
  'rank-hero':       { corners: 4,     midMarks: true,  topGem: true  },
  'rank-legend':     { corners: 4,     midMarks: true,  topGem: true  },
  'rank-myth':       { corners: 4,     midMarks: true,  topGem: true  },
};

var RANK_CORNER_SVGS = {
  'rank-squire':     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M2 22L2 4Q2 2 4 2L22 2' stroke='%23a8a8a8' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='3.5' cy='3.5' r='2' fill='%23a8a8a8'/%3E%3C/svg%3E",
  'rank-adventurer': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M2 26L2 4Q2 2 4 2L26 2' stroke='%23cd7f32' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='4' cy='4' r='2.5' fill='%23cd7f32'/%3E%3C/svg%3E",
  'rank-journeyman': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath d='M2 28L2 4Q2 2 4 2L28 2' stroke='%2322c55e' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='4' cy='4' r='3' fill='none' stroke='%2322c55e' stroke-width='2'/%3E%3Ccircle cx='4' cy='4' r='1.2' fill='%2322c55e'/%3E%3Cpath d='M9 2L9 7M2 9L7 9' stroke='%2322c55e' stroke-width='1.5' stroke-linecap='round' opacity='0.6'/%3E%3C/svg%3E",
  'rank-veteran':    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Cpath d='M2 32L2 4Q2 2 4 2L32 2' stroke='%23c8c8c8' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M7 32L7 9Q7 7 9 7L32 7' stroke='%23c8c8c8' stroke-width='1' fill='none' stroke-linecap='round' opacity='0.45'/%3E%3Ccircle cx='4.5' cy='4.5' r='3.5' fill='none' stroke='%23c8c8c8' stroke-width='2'/%3E%3Ccircle cx='4.5' cy='4.5' r='1.3' fill='%23c8c8c8'/%3E%3Cpath d='M11 2L11 7M2 11L7 11' stroke='%23c8c8c8' stroke-width='1.5' stroke-linecap='round' opacity='0.65'/%3E%3C/svg%3E",
  'rank-champion':   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M2 38L2 5Q2 2 5 2L38 2' stroke='%23d4af37' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Cpath d='M9 38L9 11Q9 9 11 9L38 9' stroke='%23d4af37' stroke-width='1.2' fill='none' stroke-linecap='round' opacity='0.5'/%3E%3Ccircle cx='5' cy='5' r='4' fill='none' stroke='%23d4af37' stroke-width='2.5'/%3E%3Ccircle cx='5' cy='5' r='1.8' fill='%23d4af37'/%3E%3Cpath d='M14 2L14 9M2 14L9 14' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' opacity='0.75'/%3E%3Cpath d='M5 20L5 24' stroke='%23d4af37' stroke-width='1.2' stroke-linecap='round' opacity='0.4'/%3E%3C/svg%3E",
  'rank-hero':       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 46'%3E%3Cpath d='M2 44L2 5Q2 2 5 2L44 2' stroke='%23f59e0b' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Cpath d='M10 44L10 12Q10 10 12 10L44 10' stroke='%23f59e0b' stroke-width='1.5' fill='none' stroke-linecap='round' opacity='0.5'/%3E%3Ccircle cx='5.5' cy='5.5' r='4.5' fill='none' stroke='%23f59e0b' stroke-width='2.8'/%3E%3Ccircle cx='5.5' cy='5.5' r='2' fill='%23f59e0b'/%3E%3Cpath d='M16 2L16 10M2 16L10 16' stroke='%23f59e0b' stroke-width='2.2' stroke-linecap='round' opacity='0.8'/%3E%3Cpath d='M5.5 20L5.5 26M5.5 30L5.5 35' stroke='%23f59e0b' stroke-width='1.3' stroke-linecap='round' opacity='0.5'/%3E%3Cpath d='M20 2L20 6M26 2L26 6' stroke='%23f59e0b' stroke-width='1.3' stroke-linecap='round' opacity='0.5'/%3E%3C/svg%3E",
  'rank-legend':     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M2 48L2 5Q2 2 5 2L48 2' stroke='%23a855f7' stroke-width='3.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M11 48L11 13Q11 11 13 11L48 11' stroke='%23ffd700' stroke-width='1.5' fill='none' stroke-linecap='round' opacity='0.6'/%3E%3Ccircle cx='6' cy='6' r='5' fill='none' stroke='%23a855f7' stroke-width='3'/%3E%3Ccircle cx='6' cy='6' r='2.2' fill='%23ffd700'/%3E%3Cpath d='M17 2L17 11M2 17L11 17' stroke='%23ffd700' stroke-width='2.5' stroke-linecap='round' opacity='0.85'/%3E%3Cpath d='M6 22L6 28M6 33L6 39' stroke='%23a855f7' stroke-width='1.5' stroke-linecap='round' opacity='0.6'/%3E%3Cpath d='M22 2L22 7M29 2L29 7' stroke='%23ffd700' stroke-width='1.5' stroke-linecap='round' opacity='0.6'/%3E%3Cpath d='M2 22Q5 20 8 22Q5 24 2 22Z' fill='%23ffd700' opacity='0.7'/%3E%3C/svg%3E",
  'rank-myth':       "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'%3E%3Cpath d='M2 54L2 5Q2 2 5 2L54 2' stroke='%2300e5ff' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3Cpath d='M11 54L11 13Q11 11 13 11L54 11' stroke='%23ffffff' stroke-width='2' fill='none' stroke-linecap='round' opacity='0.5'/%3E%3Cpath d='M19 54L19 19Q19 18 20 18L54 18' stroke='%2300e5ff' stroke-width='1' fill='none' stroke-linecap='round' opacity='0.25'/%3E%3Ccircle cx='6.5' cy='6.5' r='5.5' fill='none' stroke='%2300e5ff' stroke-width='3.5'/%3E%3Ccircle cx='6.5' cy='6.5' r='2.5' fill='%23ffffff'/%3E%3Cpath d='M19 2L19 11M2 19L11 19' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' opacity='0.9'/%3E%3Cpath d='M6.5 24L6.5 30M6.5 35L6.5 41M6.5 45L6.5 49' stroke='%2300e5ff' stroke-width='1.5' stroke-linecap='round' opacity='0.6'/%3E%3Cpath d='M24 2L24 7M31 2L31 7M38 2L38 7' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' opacity='0.6'/%3E%3Cpath d='M2 24Q6 21 10 24Q6 27 2 24Z' fill='%2300e5ff' opacity='0.8'/%3E%3Cpath d='M2 34Q5 32 8 34Q5 36 2 34Z' fill='%23ffffff' opacity='0.4'/%3E%3C/svg%3E",
};

var RANK_TOP_GEMS = {
  'rank-hero':    { char: '◆', color: '#f59e0b', shadow: '0 0 10px #f59e0b, 0 0 20px #ff8c00' },
  'rank-legend':  { char: '✦', color: '#ffd700', shadow: '0 0 12px #ffd700, 0 0 24px #a855f7, 0 0 36px #00bfff' },
  'rank-myth':    { char: '✸', color: '#00e5ff', shadow: '0 0 14px #00e5ff, 0 0 28px #ffffff, 0 0 48px #00e5ff' },
};

function _buildRankFrameDOM(frame, rankClass) {
  // Clear previous ornaments
  frame.innerHTML = '';
  var cfg = RANK_FRAME_CONFIG[rankClass];
  if (!cfg || !cfg.corners) return;

  var svg = RANK_CORNER_SVGS[rankClass];
  if (!svg) return;

  var positions = cfg.corners === 4
    ? ['tl','tr','bl','br']
    : ['tl','br'];

  var posStyles = {
    tl: 'top:-3px;left:-3px;transform:rotate(0deg)',
    tr: 'top:-3px;right:-3px;transform:rotate(90deg)',
    bl: 'bottom:-3px;left:-3px;transform:rotate(270deg)',
    br: 'bottom:-3px;right:-3px;transform:rotate(180deg)',
  };

  var size = rankClass === 'rank-myth' ? 56 : rankClass === 'rank-legend' ? 50 : rankClass === 'rank-hero' ? 46 : rankClass === 'rank-champion' ? 40 : rankClass === 'rank-veteran' ? 34 : rankClass === 'rank-journeyman' ? 30 : rankClass === 'rank-adventurer' ? 28 : 24;

  positions.forEach(function(pos) {
    var sp = document.createElement('span');
    sp.className = 'rf-corner rf-corner-' + pos;
    sp.style.cssText = 'position:absolute;' + posStyles[pos] + ';width:' + size + 'px;height:' + size + 'px;background-image:url("' + svg + '");background-size:contain;background-repeat:no-repeat;pointer-events:none;z-index:3;';
    frame.appendChild(sp);
  });

  // Mid marks on left and top edges for veteran+
  if (cfg.midMarks) {
    var midColor = rankClass === 'rank-myth' ? '%2300e5ff' : rankClass === 'rank-legend' ? '%23a855f7' : rankClass === 'rank-hero' ? '%23f59e0b' : rankClass === 'rank-champion' ? '%23d4af37' : '%23c8c8c8';
    var midSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3E%3Cpath d='M4 1L4 15M1 5L7 5M1 11L7 11' stroke='" + midColor + "' stroke-width='1.5' stroke-linecap='round' opacity='0.6'/%3E%3C/svg%3E";
    ['left','right','top','bottom'].forEach(function(side) {
      var mk = document.createElement('span');
      mk.className = 'rf-mid rf-mid-' + side;
      var st = 'position:absolute;pointer-events:none;z-index:3;background-image:url("' + midSvg + '");background-size:contain;background-repeat:no-repeat;';
      if (side === 'left' || side === 'right') {
        st += 'width:8px;height:16px;top:50%;transform:translateY(-50%);';
        st += side === 'left' ? 'left:-5px;' : 'right:-5px;transform:translateY(-50%) rotate(180deg);';
      } else {
        st += 'width:16px;height:8px;left:50%;transform:translateX(-50%);';
        st += side === 'top' ? 'top:-5px;' : 'bottom:-5px;transform:translateX(-50%) rotate(180deg);';
      }
      mk.style.cssText = st;
      frame.appendChild(mk);
    });
  }

  // Top gem for hero + legend
  if (cfg.topGem) {
    var gemCfg = RANK_TOP_GEMS[rankClass];
    if (gemCfg) {
      var gem = document.createElement('span');
      gem.className = 'rf-top-gem';
      gem.textContent = gemCfg.char;
      gem.style.cssText = 'position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:16px;color:' + gemCfg.color + ';text-shadow:' + gemCfg.shadow + ';pointer-events:none;z-index:4;animation:gemPulse 1.6s ease-in-out infinite alternate;';
      frame.appendChild(gem);
    }
  }
}

function updatePortraitRank() {
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  var rank = getPlayerRank(count);
  var wrapper = document.getElementById('portraitFrameWrapper');
  var badge   = document.getElementById('portraitRankBadge');
  var icon    = document.getElementById('portraitRankIcon');
  var lbl     = document.getElementById('portraitRankLabel');
  var prog    = document.getElementById('portraitRankProgress');
  if (!wrapper) return;

  // Update frame class
  wrapper.className = 'portrait-frame-wrapper ' + rank.cssClass;

  // Rebuild ornament DOM inside the rank frame div
  var frame = wrapper.querySelector('.portrait-rank-frame');
  if (frame) _buildRankFrameDOM(frame, rank.cssClass);

  // Update badge class
  badge.className = 'portrait-rank-badge ' + rank.badgeClass;

  // Update text
  icon.textContent = rank.icon;
  lbl.textContent  = rank.label;

  // Progress text
  if (rank.next) {
    prog.textContent = count + ' achievements — ' + (rank.threshold - count) + ' to ' + rank.next;
  } else {
    prog.textContent = count + ' achievements — MAX RANK 👑';
  }
}

function toggleAchievement(id) {
  achvUnlocked[id] = !achvUnlocked[id];
  saveAchievements();
  renderAchievements();
  updatePortraitRank();
  var a = ACHIEVEMENTS.find(function(x){ return x.id === id; });
  if (a) showToast(achvUnlocked[id] ? '🏆 Achievement unlocked: ' + a.name : '🔒 Achievement locked: ' + a.name);
}

function renderAchievements() {
  loadAchievements();
  loadTrackerCounts();
  var filter    = (document.getElementById('achv-filter')     || {}).value || 'all';
  var catFilter = (document.getElementById('achv-cat-filter') || {}).value || 'all';

  // Build list - for tracker achievements, deduplicate by parent (one card per tracker group)
  var seenTrackerParents = {};
  var list = ACHIEVEMENTS.filter(function(a) {
    var unlocked = !!achvUnlocked[a.id];
    if (catFilter !== 'all' && a.cat !== catFilter) return false;

    if (a.tracker) {
      var parentId = a.tracker.parent;
      if (seenTrackerParents[parentId]) return false; // already included this group

      // For filter: show the group card if any milestone matches the filter
      var group = ACHIEVEMENTS.filter(function(x){ return x.tracker && x.tracker.parent === parentId; });
      var anyUnlocked = group.some(function(x){ return !!achvUnlocked[x.id]; });
      if (filter === 'unlocked' && !anyUnlocked) return false;
      if (filter === 'locked'   && anyUnlocked)  return false;

      seenTrackerParents[parentId] = true;
      return true;
    }

    if (filter === 'unlocked' && !unlocked) return false;
    if (filter === 'locked'   && unlocked)  return false;
    return true;
  });

  var total  = ACHIEVEMENTS.length;
  var earned = ACHIEVEMENTS.filter(function(a){ return !!achvUnlocked[a.id]; }).length;
  var pct    = total ? Math.round(earned / total * 100) : 0;

  var countEl = document.getElementById('achv-count-label');
  var fillEl  = document.getElementById('achv-progress-fill');
  if (countEl) countEl.textContent = earned + ' / ' + total + ' (' + pct + '%)';
  if (fillEl)  fillEl.style.width  = pct + '%';

  var grid = document.getElementById('achv-grid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-family:\'Cinzel\',serif;letter-spacing:2px;font-size:11px;">No achievements match this filter.</div>';
    return;
  }

  grid.innerHTML = list.map(function(a) {
    // ── TRACKER CARD ─────────────────────────────────────────────
    if (a.tracker) {
      return _renderTrackerCard(a);
    }

    // ── NORMAL CARD ───────────────────────────────────────────────
    var unlocked  = !!achvUnlocked[a.id];
    var isHidden  = a.cat === 'Hidden';
    var showDesc  = unlocked || !isHidden;
    var name = a.name;
    var desc = showDesc ? a.desc : '??? — Unlock to reveal this secret achievement.';
    var icon = showDesc ? a.icon : '🔒';
    var bg   = unlocked
      ? 'background:linear-gradient(135deg,var(--bg-card),var(--bg-panel));border-color:var(--border-gold-bright);box-shadow:inset 0 0 0 1px var(--accent-gold);'
      : 'background:var(--bg-card);border-color:var(--border-dark);';
    var nameColor = unlocked ? 'color:var(--accent-gold-bright);' : 'color:var(--text-secondary);';
    var checkmark = unlocked
      ? '<div style="font-size:18px;flex-shrink:0;">✅</div>'
      : '<div style="font-size:18px;flex-shrink:0;opacity:0.3;">⬜</div>';
    var isPinned = (typeof getPinnedAchievements === 'function') && getPinnedAchievements().indexOf(a.id) !== -1;
    var pinBtn = '<button onclick="event.stopPropagation();togglePinAchievement(\'' + a.id + '\')" title="' + (isPinned ? 'Unpin from Priority HUD' : 'Pin to Priority HUD') + '" '
      + 'style="flex-shrink:0;background:none;border:none;cursor:pointer;font-size:16px;padding:2px 4px;opacity:' + (isPinned ? '1' : '0.3') + ';transition:opacity 0.2s;align-self:flex-start;" '
      + 'onmouseover="this.style.opacity=\'1\'" onmouseout="this.style.opacity=\'' + (isPinned ? '1' : '0.3') + '\'">📌</button>';
    var isShowcased = getShowcaseAchievements().indexOf(a.id) !== -1;
    var starBtn = unlocked
      ? '<button onclick="event.stopPropagation();toggleShowcaseAchievement(\'' + a.id + '\')" '
        + 'title="' + (isShowcased ? 'Remove from showcase' : 'Show on portrait (showcase)') + '" '
        + 'style="flex-shrink:0;background:none;border:none;cursor:pointer;font-size:14px;padding:2px 4px;'
        + 'opacity:' + (isShowcased ? '1' : '0.25') + ';transition:opacity 0.2s, transform 0.15s;align-self:flex-start;line-height:1;" '
        + 'onmouseover="this.style.opacity=\'1\';this.style.transform=\'scale(1.2)\'" '
        + 'onmouseout="this.style.opacity=\'' + (isShowcased ? '1' : '0.25') + '\';this.style.transform=\'scale(1)\'">⭐</button>'
      : '';
    return '<div onclick="toggleAchievement(\'' + a.id + '\')" style="' + bg + 'border:1px solid;border-radius:6px;padding:14px 16px;cursor:pointer;transition:all 0.18s;display:flex;gap:12px;align-items:flex-start;box-shadow:var(--shadow-deep);" '
      + 'onmouseover="this.style.borderColor=\'var(--border-gold)\';this.style.boxShadow=\'var(--shadow-gold)\'" '
      + 'onmouseout="this.style.borderColor=\'' + (unlocked ? 'var(--border-gold-bright)' : 'var(--border-dark)') + '\';this.style.boxShadow=\'var(--shadow-deep)\'">'
      + '<div style="font-size:26px;flex-shrink:0;line-height:1.2;' + (unlocked ? '' : 'filter:grayscale(1);opacity:0.5;') + '">' + icon + '</div>'
      + '<div style="flex:1;min-width:0;">'
      + '<div style="font-family:\'Cinzel\',serif;font-size:15px;font-weight:700;letter-spacing:0.5px;margin-bottom:6px;' + nameColor + '">' + name + '</div>'
      + '<div style="font-size:16px;color:var(--text-muted);font-style:italic;line-height:1.5;">' + desc + '</div>'
      + '<div style="margin-top:8px;font-family:\'Cinzel\',serif;font-size:10px;letter-spacing:1px;color:' + (unlocked ? 'var(--accent-gold)' : 'var(--text-muted)') + ';">' + a.cat.toUpperCase() + '</div>'
      + '</div>'
      + starBtn + pinBtn + checkmark
      + '</div>';
  }).join('');
}

function _renderTrackerCard(a) {
  // Build the full group of milestones for this tracker parent
  var parentId = a.tracker.parent;
  var group = ACHIEVEMENTS
    .filter(function(x){ return x.tracker && x.tracker.parent === parentId; })
    .sort(function(x,y){ return x.tracker.tier - y.tracker.tier; });

  var count = getTrackerCount(parentId);
  var unit  = a.tracker.unit;

  // Determine current active tier: highest milestone reached (or tier 0 pre-unlock)
  var activeTier = -1;
  group.forEach(function(x){
    if (count >= x.tracker.milestone) activeTier = x.tracker.tier;
  });

  // Next milestone to reach
  var nextMilestone = null;
  for (var g = 0; g < group.length; g++) {
    if (count < group[g].tracker.milestone) { nextMilestone = group[g]; break; }
  }

  var hasAnyUnlock = activeTier >= 0;
  var tierCfg = hasAnyUnlock ? _TRACKER_TIER_CONFIG[activeTier] : _TRACKER_TIER_CONFIG[0];
  var isMaxed = !nextMilestone;

  // Card border & background
  var borderColor = hasAnyUnlock ? tierCfg.color : 'var(--border-dark)';
  var boxShadow   = hasAnyUnlock
    ? '0 0 12px ' + tierCfg.shadow + ', inset 0 0 0 1px ' + tierCfg.color + '44'
    : 'var(--shadow-deep)';
  var bg = hasAnyUnlock
    ? 'background:linear-gradient(135deg,var(--bg-card),var(--bg-panel));'
    : 'background:var(--bg-card);';
  var nameColor = hasAnyUnlock ? 'color:' + tierCfg.color + ';' : 'color:var(--text-secondary);';

  // Base name + current active milestone roman numeral (or next if none unlocked)
  var baseName = (function() {
    var stripped = a.name.replace(/ (I|II|III|IV|V|VI|VII)$/, '');
    var displayMilestone = hasAnyUnlock ? group[activeTier] : (nextMilestone || group[0]);
    var suffix = displayMilestone ? displayMilestone.name.match(/ (I|II|III|IV|V|VI|VII)$/) : null;
    return stripped + (suffix ? suffix[0] : '');
  })();

  // Progress bar: within the current tier band (prev milestone → current next milestone)
  var prevMs = 0;
  var targetMs = nextMilestone ? nextMilestone.tracker.milestone : group[group.length-1].tracker.milestone;
  if (activeTier >= 0) {
    var curGroup = group[activeTier];
    prevMs = curGroup.tracker.milestone;
  }
  var range    = targetMs - prevMs;
  var progress = Math.max(0, Math.min(count - prevMs, range));
  var barPct   = isMaxed ? 100 : (range > 0 ? Math.round(progress / range * 100) : 0);
  var barColor = isMaxed ? tierCfg.color : (nextMilestone ? _TRACKER_TIER_CONFIG[nextMilestone.tracker.tier].color : tierCfg.color);

  // Pip dots — one per tier milestone
  var pips = group.map(function(x) {
    var reached = count >= x.tracker.milestone;
    var pc = _TRACKER_TIER_CONFIG[x.tracker.tier];
    return '<span title="' + pc.label + ': ' + x.tracker.milestone.toLocaleString() + ' ' + unit + (reached ? ' ✓' : '') + '" '
      + 'style="display:inline-block;width:9px;height:9px;border-radius:50%;cursor:default;'
      + (reached ? 'background:' + pc.color + ';box-shadow:0 0 5px ' + pc.glow + ';'
                 : 'background:var(--bg-panel);border:1px solid var(--border-dark);')
      + 'transition:all 0.3s;flex-shrink:0;"></span>';
  }).join('');

  // Title reward line: show current earned title or next title to earn
  var titleLine = '';
  if (hasAnyUnlock) {
    var earnedTitle = group[activeTier].tracker.titleReward;
    titleLine = '🏷️ <span style="color:' + tierCfg.color + ';">"' + earnedTitle + '"</span>';
    if (nextMilestone) {
      var nextTierCfg = _TRACKER_TIER_CONFIG[nextMilestone.tracker.tier];
      titleLine += '<span style="color:var(--text-muted);font-size:9px;"> → Next: "' + nextMilestone.tracker.titleReward + '"</span>';
    }
  } else {
    var firstNext = group[0];
    titleLine = '🏷️ <span style="color:var(--text-muted);">Next title: "' + firstNext.tracker.titleReward + '"</span>';
  }

  // Tier badge
  var tierLabel = isMaxed
    ? _TRACKER_TIER_CONFIG[group[group.length-1].tracker.tier].label.toUpperCase() + ' ★'
    : (hasAnyUnlock ? tierCfg.label.toUpperCase() : 'LOCKED');

  // Count label
  var countLabel = isMaxed
    ? count.toLocaleString() + ' ' + unit + ' ✓ MAX'
    : count.toLocaleString() + ' / ' + targetMs.toLocaleString() + ' ' + unit;

  return '<div style="' + bg + 'border:2px solid ' + borderColor + ';border-radius:8px;padding:12px 14px;'
    + 'transition:all 0.2s;display:flex;flex-direction:column;gap:0;box-shadow:' + boxShadow + ';" '
    + 'onmouseover="this.style.borderColor=\'' + (hasAnyUnlock ? tierCfg.color : 'var(--border-gold)') + '\'" '
    + 'onmouseout="this.style.borderColor=\'' + borderColor + '\'">'

    // Row 1: icon + base name + tier badge
    + '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:6px;">'
      + '<div style="font-size:24px;flex-shrink:0;line-height:1.2;'
        + (hasAnyUnlock ? 'filter:drop-shadow(0 0 5px ' + tierCfg.glow + ');' : 'filter:grayscale(0.7);opacity:0.55;') + '">' + a.icon + '</div>'
      + '<div style="flex:1;min-width:0;">'
        + '<div style="font-family:\'Cinzel\',serif;font-size:14px;font-weight:700;letter-spacing:0.5px;' + nameColor + '">' + baseName + '</div>'
        + '<div style="font-size:13px;color:var(--text-muted);font-style:italic;margin-top:3px;line-height:1.4;">'
          + (nextMilestone ? nextMilestone.desc : group[group.length-1].desc)
        + '</div>'
      + '</div>'
      + '<span style="font-family:\'Cinzel\',serif;font-size:9px;letter-spacing:1px;flex-shrink:0;'
        + 'color:' + (hasAnyUnlock ? tierCfg.color : 'var(--text-muted)') + ';'
        + (hasAnyUnlock ? 'text-shadow:0 0 6px ' + tierCfg.glow + ';' : '') + '">'
        + tierLabel + '</span>'
    + '</div>'

    // Row 2: title reward
    + '<div style="font-size:10px;font-family:\'Cinzel\',serif;margin-bottom:7px;letter-spacing:0.3px;">' + titleLine + '</div>'

    // Row 3: pips
    + '<div style="display:flex;gap:4px;align-items:center;margin-bottom:5px;">' + pips + '</div>'

    // Row 4: progress bar
    + '<div style="background:var(--bg-panel);border-radius:3px;height:5px;overflow:hidden;margin-bottom:5px;">'
      + '<div style="height:100%;width:' + barPct + '%;background:' + barColor + ';'
        + (hasAnyUnlock ? 'box-shadow:0 0 5px ' + tierCfg.glow + ';' : '')
        + 'border-radius:3px;transition:width 0.4s ease;"></div>'
    + '</div>'

    // Row 5: count + buttons
    + '<div style="display:flex;align-items:center;gap:6px;margin-top:2px;">'
      + '<span style="font-family:\'Cinzel\',serif;font-size:11px;color:' + (hasAnyUnlock ? tierCfg.color : 'var(--text-muted)') + ';flex:1;white-space:nowrap;">'
        + countLabel + '</span>'
      + '<button onclick="event.stopPropagation();incrementTracker(\'' + parentId + '\',-1)" '
        + 'style="width:26px;height:26px;flex-shrink:0;border-radius:4px;border:1px solid var(--border-dark);'
        + 'background:var(--bg-panel);color:var(--text-muted);cursor:pointer;font-size:14px;line-height:1;" '
        + 'title="Remove 1" '
        + 'onmouseover="this.style.borderColor=\'#e53935\';this.style.color=\'#e53935\'" '
        + 'onmouseout="this.style.borderColor=\'var(--border-dark)\';this.style.color=\'var(--text-muted)\'">−</button>'
      + '<button onclick="event.stopPropagation();incrementTracker(\'' + parentId + '\',1)" '
        + 'style="width:38px;height:26px;flex-shrink:0;border-radius:4px;'
        + 'border:1px solid ' + (hasAnyUnlock ? tierCfg.color : 'var(--border-dark)') + ';'
        + 'background:' + (hasAnyUnlock ? tierCfg.color + '22' : 'var(--bg-panel)') + ';'
        + 'color:' + (hasAnyUnlock ? tierCfg.color : 'var(--text-secondary)') + ';'
        + 'cursor:pointer;font-size:17px;font-weight:700;line-height:1;" '
        + 'title="Add 1" '
        + 'onmouseover="this.style.opacity=\'0.75\'" onmouseout="this.style.opacity=\'1\'">+</button>'
      + '<button onclick="event.stopPropagation();openTrackerEditModal(\'' + parentId + '\',' + count + ')" '
        + 'style="width:26px;height:26px;flex-shrink:0;border-radius:4px;border:1px solid var(--border-dark);'
        + 'background:var(--bg-panel);color:var(--text-muted);cursor:pointer;font-size:12px;line-height:1;" '
        + 'title="Set manually" '
        + 'onmouseover="this.style.borderColor=\'var(--accent-gold)\';this.style.color=\'var(--accent-gold)\'" '
        + 'onmouseout="this.style.borderColor=\'var(--border-dark)\';this.style.color=\'var(--text-muted)\'">✎</button>'
      + (function(){
          var trackerPinId = parentId + '_1';
          var firstMilestone = group[0];
          if (firstMilestone) trackerPinId = firstMilestone.id;
          var isPinned = (typeof getPinnedAchievements === 'function') && getPinnedAchievements().indexOf(trackerPinId) !== -1;
          var pinBtnHtml = '<button onclick="event.stopPropagation();togglePinAchievement(\'' + trackerPinId + '\')" '
            + 'title="' + (isPinned ? 'Unpin from Priority HUD' : 'Pin to Priority HUD') + '" '
            + 'style="width:26px;height:26px;flex-shrink:0;background:none;border:none;cursor:pointer;font-size:16px;padding:0;'
            + 'opacity:' + (isPinned ? '1' : '0.3') + ';transition:opacity 0.2s;" '
            + 'onmouseover="this.style.opacity=\'1\'" '
            + 'onmouseout="this.style.opacity=\'' + (isPinned ? '1' : '0.3') + '\'">📌</button>';
          var showcaseBtnHtml = '';
          if (hasAnyUnlock) {
            var showcaseId = group[activeTier] ? group[activeTier].id : trackerPinId;
            // Clean up stale showcase entries from old tiers of this tracker group
            if (typeof getShowcaseAchievements === 'function' && typeof toggleShowcaseAchievement === 'function') {
              var currentShowcase = getShowcaseAchievements();
              group.forEach(function(gItem) {
                if (gItem.id !== showcaseId && currentShowcase.indexOf(gItem.id) !== -1) {
                  toggleShowcaseAchievement(gItem.id); // remove stale old-tier entry
                }
              });
            }
            var isShowcased = (typeof getShowcaseAchievements === 'function') && getShowcaseAchievements().indexOf(showcaseId) !== -1;
            showcaseBtnHtml = '<button onclick="event.stopPropagation();toggleShowcaseAchievement(\'' + showcaseId + '\')" '
              + 'title="' + (isShowcased ? 'Remove from showcase' : 'Show on portrait (showcase)') + '" '
              + 'style="width:26px;height:26px;flex-shrink:0;background:none;border:none;cursor:pointer;font-size:14px;padding:0;'
              + 'opacity:' + (isShowcased ? '1' : '0.25') + ';transition:opacity 0.2s,transform 0.15s;line-height:1;" '
              + 'onmouseover="this.style.opacity=\'1\';this.style.transform=\'scale(1.2)\'" '
              + 'onmouseout="this.style.opacity=\'' + (isShowcased ? '1' : '0.25') + '\';this.style.transform=\'scale(1)\'">⭐</button>';
          }
          return showcaseBtnHtml + pinBtnHtml;
        })()
    + '</div>'

    // TRACKERS label at bottom
    + '<div style="margin-top:6px;font-family:\'Cinzel\',serif;font-size:10px;letter-spacing:1px;color:'
      + (hasAnyUnlock ? tierCfg.color : 'var(--text-muted)') + ';">TRACKERS</div>'
    + '</div>';
}

// Load achievements on startup
loadAchievements();
// Update portrait rank based on loaded achievements
setTimeout(updatePortraitRank, 100);

// ═══════════════════════════════════════════════
// WILD SHAPE SYSTEM
// ═══════════════════════════════════════════════

function wsSave() {
  autoSave();
}

function renderWildShape() {
  // Ensure data arrays exist (for older saves)
  if (!data.wildShapes) data.wildShapes = [];
  if (data.wildShapeActive === undefined) data.wildShapeActive = false;
  if (data.wildShapeFormIdx === undefined) data.wildShapeFormIdx = -1;
  if (data.wildShapeCurHP === undefined) data.wildShapeCurHP = 0;
  if (data.wildShapeCharges === undefined) data.wildShapeCharges = 2;
  if (data.wildShapeMaxCharges === undefined) data.wildShapeMaxCharges = 2;
  if (data.wildShapeCRLimit === undefined) data.wildShapeCRLimit = '';

  // Update charge pips
  wsRenderChargePips();

  // Update max charges label
  const maxLbl = document.getElementById('wsMaxChargesLabel');
  if (maxLbl) maxLbl.textContent = data.wildShapeMaxCharges;

  // Update CR limit
  const crEl = document.getElementById('wsCRLimit');
  if (crEl) crEl.value = data.wildShapeCRLimit || '';

  // Show/hide active state panels
  const humanState = document.getElementById('wsHumanState');
  const activeState = document.getElementById('wsActiveState');
  if (data.wildShapeActive && data.wildShapeFormIdx >= 0 && data.wildShapes[data.wildShapeFormIdx]) {
    if (humanState) humanState.style.display = 'none';
    if (activeState) activeState.style.display = 'block';
    wsShowActiveForm();
  } else {
    if (humanState) humanState.style.display = 'block';
    if (activeState) activeState.style.display = 'none';
  }

  // Render saved forms list
  wsRenderFormsList();
}

function wsRenderChargePips() {
  const pipsEl = document.getElementById('wsChargePips');
  if (!pipsEl) return;
  const max = data.wildShapeMaxCharges || 2;
  const cur = Math.min(data.wildShapeCharges || 0, max);
  let html = '';
  for (let i = 0; i < max; i++) {
    const filled = i < cur;
    html += `<div onclick="wsToggleCharge(${i})" title="${filled ? 'Click to use charge' : 'Click to restore charge'}" style="width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid var(--accent-gold);background:${filled ? 'var(--accent-gold)' : 'transparent'};transition:background 0.2s;"></div>`;
  }
  pipsEl.innerHTML = html;
}

function wsToggleCharge(idx) {
  const cur = data.wildShapeCharges || 0;
  const max = data.wildShapeMaxCharges || 2;
  if (idx < cur) {
    data.wildShapeCharges = idx; // use charges down to idx
  } else {
    data.wildShapeCharges = Math.min(idx + 1, max);
  }
  wsRenderChargePips();
  wsSave();
}

function wsChangeCharges(dir) {
  data.wildShapeCharges = Math.max(0, Math.min((data.wildShapeCharges || 0) + dir, data.wildShapeMaxCharges || 2));
  wsRenderChargePips();
  wsSave();
}

function wsChangeMaxCharges(dir) {
  data.wildShapeMaxCharges = Math.max(1, Math.min((data.wildShapeMaxCharges || 2) + dir, 8));
  data.wildShapeCharges = Math.min(data.wildShapeCharges || 0, data.wildShapeMaxCharges);
  const lbl = document.getElementById('wsMaxChargesLabel');
  if (lbl) lbl.textContent = data.wildShapeMaxCharges;
  wsRenderChargePips();
  wsSave();
}

function wsResetCharges() {
  data.wildShapeCharges = data.wildShapeMaxCharges || 2;
  wsRenderChargePips();
  wsSave();
}

function wsShowActiveForm() {
  const form = data.wildShapes[data.wildShapeFormIdx];
  if (!form) return;

  const nameEl = document.getElementById('wsActiveFormName');
  const typeEl = document.getElementById('wsActiveFormType');
  if (nameEl) nameEl.textContent = form.name || 'Unknown Form';
  if (typeEl) typeEl.textContent = (form.size ? form.size + ' Beast' : 'Beast') + (form.cr ? ' • CR ' + form.cr : '');

  // HP
  const curHPEl = document.getElementById('wsCurHP');
  const maxHPEl = document.getElementById('wsMaxHP');
  if (curHPEl) curHPEl.value = data.wildShapeCurHP;
  if (maxHPEl) maxHPEl.textContent = form.hpMax || 0;
  wsUpdateHPBar();

  // Stats row
  const acEl = document.getElementById('wsActiveAC');
  const speedEl = document.getElementById('wsActiveSpeed');
  const sizeEl = document.getElementById('wsActiveSize');
  if (acEl) acEl.textContent = form.ac || '—';
  if (speedEl) speedEl.textContent = form.speed ? form.speed + ' ft' : '—';
  if (sizeEl) sizeEl.textContent = form.size || '—';

  // Ability scores
  const stats = ['STR','DEX','CON','INT','WIS','CHA'];
  const keys  = ['str','dex','con','int','wis','cha'];
  stats.forEach((stat, i) => {
    const el = document.getElementById('wsStat' + stat);
    if (el) {
      const val = parseInt(form[keys[i]]) || 10;
      const mod = Math.floor((val - 10) / 2);
      const modStr = (mod >= 0 ? '+' : '') + mod;
      el.innerHTML = `<span class="ws-stat-label">${stat}</span><span class="ws-stat-val">${val}</span><span class="ws-stat-mod">${modStr}</span>`;
    }
  });

  // Notes
  const notesEl = document.getElementById('wsActiveNotes');
  if (notesEl) notesEl.textContent = form.notes || '';
}

function wsUpdateHP() {
  const el = document.getElementById('wsCurHP');
  if (!el) return;
  const form = data.wildShapes[data.wildShapeFormIdx];
  const max = form ? (form.hpMax || 0) : 0;
  data.wildShapeCurHP = Math.max(0, Math.min(parseInt(el.value) || 0, max));
  el.value = data.wildShapeCurHP;
  // Keep main sheet hpCurrent in sync
  data.hpCurrent = data.wildShapeCurHP;
  const hpCurEl = document.getElementById('hpCurrent');
  if (hpCurEl) hpCurEl.value = data.wildShapeCurHP;
  wsUpdateHPBar();
  wsSave();
}

function wsChangeHP(dir) {
  const form = data.wildShapes[data.wildShapeFormIdx];
  const max = form ? (form.hpMax || 0) : 0;
  data.wildShapeCurHP = Math.max(0, Math.min((data.wildShapeCurHP || 0) + dir, max));
  const el = document.getElementById('wsCurHP');
  if (el) el.value = data.wildShapeCurHP;
  // Keep main sheet hpCurrent in sync
  data.hpCurrent = data.wildShapeCurHP;
  const hpCurEl = document.getElementById('hpCurrent');
  if (hpCurEl) hpCurEl.value = data.wildShapeCurHP;
  wsUpdateHPBar();
  wsSave();
}

function wsUpdateHPBar() {
  const bar = document.getElementById('wsHPBar');
  if (!bar) return;
  const form = data.wildShapes[data.wildShapeFormIdx];
  const max = form ? (form.hpMax || 1) : 1;
  const pct = Math.max(0, Math.min(100, (data.wildShapeCurHP / max) * 100));
  bar.style.width = pct + '%';
  // Color based on HP %
  if (pct > 50) bar.style.background = 'var(--accent-red)';
  else if (pct > 25) bar.style.background = '#cc6600';
  else bar.style.background = '#8b0000';
}

function wsHealFull() {
  const form = data.wildShapes[data.wildShapeFormIdx];
  if (!form) return;
  data.wildShapeCurHP = form.hpMax || 0;
  // Sync back to main HP fields too
  data.hpCurrent = data.wildShapeCurHP;
  const hpCurEl = document.getElementById('hpCurrent');
  if (hpCurEl) hpCurEl.value = data.wildShapeCurHP;
  const el = document.getElementById('wsCurHP');
  if (el) el.value = data.wildShapeCurHP;
  wsUpdateHPBar();
  wsSave();
}

// Sync hpCurrent → wildShapeCurHP when Wild Shape is active.
// Call this after any change to data.hpCurrent so the Wild Shape tab stays in sync.
function wsSyncHpFromMain() {
  if (!data.wildShapeActive || data.wildShapeFormIdx < 0) return;
  const form = data.wildShapes[data.wildShapeFormIdx];
  if (!form) return;
  const max = form.hpMax || 0;
  data.wildShapeCurHP = Math.max(0, Math.min(parseInt(data.hpCurrent) || 0, max));
  const wsEl = document.getElementById('wsCurHP');
  if (wsEl) wsEl.value = data.wildShapeCurHP;
  wsUpdateHPBar();
  // Refresh the Wild Shape tab if it is currently visible
  const wsTab = document.getElementById('tab-wildshape');
  if (wsTab && wsTab.classList.contains('active')) renderWildShape();
}

function wsTransform(idx) {
  if (data.wildShapeCharges <= 0) {
    showToast('No Wild Shape charges remaining!');
    return;
  }
  const form = data.wildShapes[idx];
  if (!form) return;

  // Save human state before transforming (only if not already transformed)
  if (!data.wildShapeActive) {
    collectData(); // make sure data is fresh
    data.wsHumanBackup = {
      str: data.str, dex: data.dex, con: data.con,
      int: data.int, wis: data.wis, cha: data.cha,
      hpCurrent: data.hpCurrent, hpMax: data.hpMax,
      hpTemp: data.hpTemp,
      charName: data.charName,
      photo: data.photo || null
    };
  }

  data.wildShapeActive = true;
  data.wildShapeFormIdx = idx;
  data.wildShapeCurHP = form.hpMax || 0;
  data.wildShapeCharges = Math.max(0, (data.wildShapeCharges || 1) - 1);

  // Apply beast stats to main sheet fields
  const stats = ['str','dex','con','int','wis','cha'];
  stats.forEach(s => {
    const el = document.getElementById(s);
    if (el) { el.value = form[s] || 10; }
    data[s] = form[s] || 10;
  });

  // Apply beast HP to main HP fields
  const hpCurEl = document.getElementById('hpCurrent');
  const hpMaxEl = document.getElementById('hpMax');
  if (hpCurEl) hpCurEl.value = form.hpMax || 0;
  if (hpMaxEl) hpMaxEl.value = form.hpMax || 0;
  data.hpCurrent = form.hpMax || 0;
  data.hpMax = form.hpMax || 0;

  // Change character name display to beast name
  const nameEl = document.getElementById('charName');
  if (nameEl) { nameEl.value = form.name || 'Wild Shape'; }
  data.charName = form.name || 'Wild Shape';

  // Swap photo if form has one
  if (form.photo) {
    data.photo = form.photo;
    const imgEl = document.getElementById('characterPhoto');
    const placeholder = document.getElementById('photoPlaceholder');
    if (imgEl) { imgEl.src = form.photo; imgEl.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
  }

  // Refresh modifiers
  if (typeof updateMods === 'function') updateMods();

  renderWildShape();
  wsSave();
  showToast('🐺 Transformed into ' + form.name + '!');
}

function wsRevert() {
  // Restore human stats from backup
  if (data.wsHumanBackup) {
    const b = data.wsHumanBackup;
    const stats = ['str','dex','con','int','wis','cha'];
    stats.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.value = b[s] !== undefined ? b[s] : 10;
      data[s] = b[s] !== undefined ? b[s] : 10;
    });
    // Restore HP
    const hpCurEl = document.getElementById('hpCurrent');
    const hpMaxEl = document.getElementById('hpMax');
    if (hpCurEl) hpCurEl.value = b.hpCurrent || 0;
    if (hpMaxEl) hpMaxEl.value = b.hpMax || 0;
    data.hpCurrent = b.hpCurrent || 0;
    data.hpMax = b.hpMax || 0;
    // Restore name
    const nameEl = document.getElementById('charName');
    if (nameEl) nameEl.value = b.charName || '';
    data.charName = b.charName || '';
    // Restore photo
    data.photo = b.photo || null;
    const imgEl = document.getElementById('characterPhoto');
    const placeholder = document.getElementById('photoPlaceholder');
    if (b.photo) {
      if (imgEl) { imgEl.src = b.photo; imgEl.style.display = 'block'; }
      if (placeholder) placeholder.style.display = 'none';
    } else {
      if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
      if (placeholder) placeholder.style.display = 'flex';
    }
    data.wsHumanBackup = null;
    if (typeof updateMods === 'function') updateMods();
  }

  data.wildShapeActive = false;
  data.wildShapeFormIdx = -1;
  data.wildShapeCurHP = 0;
  renderWildShape();
  wsSave();
  showToast('↩ Reverted to human form');
}

function wsAddForm() {
  if (!data.wildShapes) data.wildShapes = [];
  if (data.wildShapes.length >= 12) {
    showToast('Maximum 12 beast forms saved!');
    return;
  }
  // Open edit dialog with a blank template; form is only saved if user clicks SAVE
  wsEditNewForm();
}

function wsEditNewForm() {
  const stats = ['str','dex','con','int','wis','cha'];
  const statLabels = ['STR','DEX','CON','INT','WIS','CHA'];
  // Default blank template — not pushed to data yet
  const form = { name: 'New Beast Form', cr: '', hpMax: 20, ac: 12, speed: 40, size: 'Medium', str: 14, dex: 12, con: 12, int: 3, wis: 12, cha: 6, notes: '', photo: null };

  const overlay = document.createElement('div');
  overlay.id = 'wsEditOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  overlay.innerHTML = `
    <div style="background:var(--bg-panel);border:1px solid var(--border-gold);border-radius:var(--radius-lg);padding:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-gold);">
      <div style="font-family:'Cinzel',serif;font-size:14px;color:var(--accent-gold-bright);letter-spacing:2px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border-dark);">ADD BEAST FORM</div>

      <div style="margin-bottom:12px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">FORM NAME</label>
        <input id="wsEditName" type="text" value="${form.name}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">CR</label>
          <input id="wsEditCR" type="text" value="${form.cr}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">MAX HP</label>
          <input id="wsEditHP" type="number" value="${form.hpMax}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">AC</label>
          <input id="wsEditAC" type="number" value="${form.ac}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">SPEED (ft)</label>
          <input id="wsEditSpeed" type="number" value="${form.speed}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">SIZE</label>
        <select id="wsEditSize" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;">
          ${['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s => `<option value="${s}" ${form.size===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;display:block;margin-bottom:6px;">ABILITY SCORES</label>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
          ${stats.map((s,i) => `
            <div style="text-align:center;">
              <div style="font-size:9px;color:var(--text-muted);font-family:'Cinzel',serif;">${statLabels[i]}</div>
              <input id="wsEdit_${s}" type="number" value="${form[s]}" min="1" max="30" style="width:100%;padding:4px 2px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-primary);font-size:13px;text-align:center;box-sizing:border-box;">
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">SPECIAL ABILITIES / NOTES</label>
        <textarea id="wsEditNotes" rows="3" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:13px;resize:vertical;box-sizing:border-box;">${form.notes}</textarea>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;display:block;margin-bottom:6px;">BEAST PORTRAIT (optional)</label>
        <div style="display:flex;align-items:center;gap:10px;">
          <div id="wsEditPhotoPreview" style="width:64px;height:64px;border-radius:8px;border:1px solid var(--border-mid);overflow:hidden;background:var(--bg-mid);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">🐾</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <button onclick="document.getElementById('wsEditPhotoInput').click()" style="padding:6px 12px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);font-size:12px;cursor:pointer;">📷 Upload Portrait</button>
            <button onclick="wsEditPhotoClear()" style="padding:4px 12px;background:var(--bg-card);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-muted);font-size:11px;cursor:pointer;">Remove</button>
          </div>
          <input type="file" id="wsEditPhotoInput" accept="image/*" onchange="wsEditPhotoLoad(event)" style="display:none;">
        </div>
      </div>

      <div style="display:flex;gap:10px;">
        <button onclick="wsSaveNewForm()" style="flex:1;padding:10px;background:var(--accent-gold);border:none;border-radius:var(--radius);color:#1a1408;font-family:'Cinzel',serif;font-size:12px;letter-spacing:2px;cursor:pointer;">SAVE FORM</button>
        <button onclick="document.getElementById('wsEditOverlay').remove();window._wsEditPhotoTemp=undefined;" style="padding:10px 18px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">CANCEL</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); window._wsEditPhotoTemp = undefined; } });
}

function wsSaveNewForm() {
  if (!data.wildShapes) data.wildShapes = [];
  const stats = ['str','dex','con','int','wis','cha'];
  const newForm = {
    name:   document.getElementById('wsEditName')?.value || 'New Beast Form',
    cr:     document.getElementById('wsEditCR')?.value || '',
    hpMax:  parseInt(document.getElementById('wsEditHP')?.value) || 20,
    ac:     parseInt(document.getElementById('wsEditAC')?.value) || 12,
    speed:  parseInt(document.getElementById('wsEditSpeed')?.value) || 40,
    size:   document.getElementById('wsEditSize')?.value || 'Medium',
    notes:  document.getElementById('wsEditNotes')?.value || '',
    photo:  window._wsEditPhotoTemp !== undefined ? window._wsEditPhotoTemp : null,
  };
  stats.forEach(s => {
    newForm[s] = parseInt(document.getElementById('wsEdit_' + s)?.value) || 10;
  });
  window._wsEditPhotoTemp = undefined;
  data.wildShapes.push(newForm);
  document.getElementById('wsEditOverlay')?.remove();
  renderWildShape();
  wsSave();
  showToast('Beast form saved ✦');
}

function wsDeleteForm(idx) {
  if (!confirm('Remove this beast form?')) return;
  if (data.wildShapeActive && data.wildShapeFormIdx === idx) {
    wsRevert();
  }
  data.wildShapes.splice(idx, 1);
  // Fix active index if needed
  if (data.wildShapeFormIdx >= data.wildShapes.length) data.wildShapeFormIdx = -1;
  renderWildShape();
  wsSave();
}

function wsEditForm(idx) {
  const form = data.wildShapes[idx];
  if (!form) return;

  // Build modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'wsEditOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  const stats = ['str','dex','con','int','wis','cha'];
  const statLabels = ['STR','DEX','CON','INT','WIS','CHA'];

  overlay.innerHTML = `
    <div style="background:var(--bg-panel);border:1px solid var(--accent-gold);border-radius:var(--radius-lg);padding:24px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;">
      <div style="font-family:'Cinzel',serif;font-size:16px;color:var(--accent-gold-bright);letter-spacing:2px;margin-bottom:18px;">🐾 EDIT BEAST FORM</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">FORM NAME</label>
          <input id="wsEditName" value="${form.name || ''}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">CR</label>
          <input id="wsEditCR" value="${form.cr || ''}" placeholder="e.g. 1/2" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">HP MAX</label>
          <input id="wsEditHP" type="number" value="${form.hpMax || 0}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">AC</label>
          <input id="wsEditAC" type="number" value="${form.ac || 10}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">SPEED (ft)</label>
          <input id="wsEditSpeed" type="number" value="${form.speed || 30}" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;box-sizing:border-box;">
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">SIZE</label>
        <select id="wsEditSize" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:14px;">
          ${['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s => `<option value="${s}" ${form.size===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;display:block;margin-bottom:6px;">ABILITY SCORES</label>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
          ${stats.map((s,i) => `
            <div style="text-align:center;">
              <div style="font-size:9px;color:var(--text-muted);font-family:'Cinzel',serif;">${statLabels[i]}</div>
              <input id="wsEdit_${s}" type="number" value="${form[s] || 10}" min="1" max="30" style="width:100%;padding:4px 2px;background:var(--bg-input);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-primary);font-size:13px;text-align:center;box-sizing:border-box;">
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;">SPECIAL ABILITIES / NOTES</label>
        <textarea id="wsEditNotes" rows="3" style="width:100%;padding:6px 8px;background:var(--bg-input);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-primary);font-size:13px;resize:vertical;box-sizing:border-box;">${form.notes || ''}</textarea>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:10px;color:var(--text-muted);font-family:'Cinzel',serif;letter-spacing:1px;display:block;margin-bottom:6px;">BEAST PORTRAIT (optional)</label>
        <div style="display:flex;align-items:center;gap:10px;">
          <div id="wsEditPhotoPreview" style="width:64px;height:64px;border-radius:8px;border:1px solid var(--border-mid);overflow:hidden;background:var(--bg-mid);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">
            ${form.photo ? `<img src="${form.photo}" style="width:100%;height:100%;object-fit:cover;">` : '🐾'}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <button onclick="document.getElementById('wsEditPhotoInput').click()" style="padding:6px 12px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);font-size:12px;cursor:pointer;">📷 Upload Portrait</button>
            <button onclick="wsEditPhotoClear()" style="padding:4px 12px;background:var(--bg-card);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-muted);font-size:11px;cursor:pointer;">Remove</button>
          </div>
          <input type="file" id="wsEditPhotoInput" accept="image/*" onchange="wsEditPhotoLoad(event)" style="display:none;">
        </div>
      </div>

      <div style="display:flex;gap:10px;">
        <button onclick="wsSaveFormEdit(${idx})" style="flex:1;padding:10px;background:var(--accent-gold);border:none;border-radius:var(--radius);color:#1a1408;font-family:'Cinzel',serif;font-size:12px;letter-spacing:2px;cursor:pointer;">SAVE FORM</button>
        <button onclick="document.getElementById('wsEditOverlay').remove()" style="padding:10px 18px;background:var(--bg-card);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">CANCEL</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function wsSaveFormEdit(idx) {
  if (!data.wildShapes[idx]) return;
  const stats = ['str','dex','con','int','wis','cha'];
  data.wildShapes[idx].name    = document.getElementById('wsEditName')?.value || 'Beast Form';
  data.wildShapes[idx].cr      = document.getElementById('wsEditCR')?.value || '';
  data.wildShapes[idx].hpMax   = parseInt(document.getElementById('wsEditHP')?.value) || 0;
  data.wildShapes[idx].ac      = parseInt(document.getElementById('wsEditAC')?.value) || 10;
  data.wildShapes[idx].speed   = parseInt(document.getElementById('wsEditSpeed')?.value) || 30;
  data.wildShapes[idx].size    = document.getElementById('wsEditSize')?.value || 'Medium';
  data.wildShapes[idx].notes   = document.getElementById('wsEditNotes')?.value || '';
  // Photo — keep whatever wsEditPhotoLoad set (stored in _editPhotoTemp)
  if (window._wsEditPhotoTemp !== undefined) {
    data.wildShapes[idx].photo = window._wsEditPhotoTemp;
    window._wsEditPhotoTemp = undefined;
  }
  stats.forEach(s => {
    data.wildShapes[idx][s] = parseInt(document.getElementById('wsEdit_' + s)?.value) || 10;
  });
  // If this is the currently active form, refresh HP display
  if (data.wildShapeActive && data.wildShapeFormIdx === idx) {
    wsShowActiveForm();
  }
  document.getElementById('wsEditOverlay')?.remove();
  wsRenderFormsList();
  wsSave();
  showToast('Beast form saved ✦');
}

function wsEditPhotoLoad(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    window._wsEditPhotoTemp = e.target.result;
    const preview = document.getElementById('wsEditPhotoPreview');
    if (preview) preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
  };
  reader.readAsDataURL(file);
}

function wsEditPhotoClear() {
  window._wsEditPhotoTemp = null;
  const preview = document.getElementById('wsEditPhotoPreview');
  if (preview) preview.innerHTML = '🐾';
}

function wsRenderFormsList() {
  const container = document.getElementById('wsFormsList');
  if (!container) return;
  if (!data.wildShapes || data.wildShapes.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-style:italic;font-size:17px;">No beast forms saved yet. Click "+ Add Form" to begin.</div>';
    return;
  }
  container.innerHTML = data.wildShapes.map((form, idx) => {
    const isActive = data.wildShapeActive && data.wildShapeFormIdx === idx;
    const hpPct = form.hpMax ? Math.round((isActive ? data.wildShapeCurHP : form.hpMax) / form.hpMax * 100) : 100;
    const stats = ['str','dex','con','int','wis','cha'];
    const statLabels = ['STR','DEX','CON','INT','WIS','CHA'];

    return `
      <div class="ws-form-card ${isActive ? 'active-form' : ''}">
        ${isActive ? '<div style="position:absolute;top:8px;right:8px;font-size:10px;color:var(--accent-gold);font-family:\'Cinzel\',serif;letter-spacing:1px;">ACTIVE ✦</div>' : ''}
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          ${form.photo ? `<div style="width:48px;height:48px;border-radius:6px;overflow:hidden;flex-shrink:0;border:1px solid var(--border-mid);"><img src="${form.photo}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
          <div style="font-family:\'Cinzel\',serif;font-size:15px;color:var(--accent-gold-bright);flex:1;">${form.name || 'Unknown'}</div>
          ${form.cr ? `<div style="font-size:10px;color:var(--text-muted);font-family:\'Cinzel\',serif;border:1px solid var(--border-dark);padding:2px 6px;border-radius:3px;">CR ${form.cr}</div>` : ''}
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;font-size:12px;color:var(--text-secondary);">
          <div>❤ HP: ${isActive ? data.wildShapeCurHP + '/' : ''}${form.hpMax || 0}</div>
          <div>🛡 AC: ${form.ac || '—'}</div>
          <div>💨 ${form.speed || '—'} ft</div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin-bottom:10px;">
          ${stats.map((s,i) => {
            const val = form[s] || 10;
            const mod = Math.floor((val-10)/2);
            return `<div style="background:var(--bg-mid);border-radius:3px;padding:4px 2px;text-align:center;">
              <div style="font-size:8px;color:var(--text-muted);font-family:\'Cinzel\',serif;">${statLabels[i]}</div>
              <div style="font-size:12px;color:var(--accent-gold);">${val}</div>
              <div style="font-size:10px;color:var(--text-muted);">${mod>=0?'+':''}${mod}</div>
            </div>`;
          }).join('')}
        </div>

        ${form.notes ? `<div style="font-size:16px;color:var(--text-secondary);font-style:italic;background:var(--bg-mid);padding:6px 8px;border-radius:var(--radius);margin-bottom:10px;">${form.notes}</div>` : ''}

        <div style="display:flex;gap:8px;">
          ${isActive
            ? `<button onclick="wsRevert()" style="flex:1;padding:7px;background:var(--accent-red);border:none;border-radius:var(--radius);color:#fff;font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;cursor:pointer;">⟲ REVERT</button>`
            : `<button onclick="wsTransform(${idx})" style="flex:1;padding:7px;background:#2a4a2a;border:1px solid #4a8a4a;border-radius:var(--radius);color:#8fd48f;font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:1px;cursor:pointer;">🐺 TRANSFORM</button>`
          }
          <button onclick="wsEditForm(${idx})" style="padding:7px 12px;background:var(--bg-mid);border:1px solid var(--border-mid);border-radius:var(--radius);color:var(--text-secondary);font-size:12px;cursor:pointer;">✏</button>
          <button onclick="wsDeleteForm(${idx})" style="padding:7px 12px;background:var(--bg-mid);border:1px solid var(--border-dark);border-radius:var(--radius);color:var(--text-muted);font-size:12px;cursor:pointer;">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}



// ═══════════════════════════════════════════
//  REWARD SYSTEM — Titles, Auras, Exclusive Themes
// ═══════════════════════════════════════════

// ── 1. TITLES ──
// Each title has: id, label, desc, condition (fn or achv id or count milestone)
var TITLES = [
  // ── Rank milestones ──
  { id:'t_firstblood',   label:'First Blood',        icon:'🩸', desc:'Earned your first achievement.',         cond: { type:'count', min:1   } },
  { id:'t_squire',       label:'Squire',              icon:'🔰', desc:'5 achievements earned.',                 cond: { type:'count', min:5   } },
  { id:'t_wayfarer',     label:'Wayfarer',            icon:'🌿', desc:'12 achievements earned.',                cond: { type:'count', min:12  } },
  { id:'t_seasoned',     label:'Seasoned',            icon:'🥈', desc:'25 achievements earned.',                cond: { type:'count', min:25  } },
  { id:'t_proven',       label:'The Proven',          icon:'🥇', desc:'45 achievements earned.',                cond: { type:'count', min:45  } },
  { id:'t_exalted',      label:'Exalted',             icon:'⭐', desc:'80 achievements earned.',                cond: { type:'count', min:80  } },
  { id:'t_undying',      label:'The Undying',         icon:'👑', desc:'130 achievements earned. Legendary.',    cond: { type:'count', min:130 } },
  { id:'t_centurion',    label:'Centurion',           icon:'💯', desc:'100 achievements earned.',               cond: { type:'count', min:100 } },
  { id:'t_myth',         label:'The Myth',            icon:'🌌', desc:'200 achievements earned.',               cond: { type:'count', min:200 } },
  { id:'t_chronicler',   label:'The Chronicler',      icon:'📜', desc:'175 achievements earned.',               cond: { type:'count', min:175 } },

  // ── Specific achievement unlocks ──
  { id:'t_tarrasque',    label:'Tarrasque Slayer',    icon:'🦖', desc:'Defeated the Tarrasque.',               cond: { type:'achv', id:'tarrasque'    } },
  { id:'t_dragon',       label:'Dragonslayer',        icon:'🐉', desc:'Classic adventure complete.',           cond: { type:'achv', id:'classic_adv'  } },
  { id:'t_beholder',     label:'Eye of the Beholder', icon:'👁', desc:'Defeated a Beholder.',                  cond: { type:'achv', id:'classic_enc3' } },
  { id:'t_mindflayer',   label:'Mindbreaker',         icon:'🧠', desc:'Defeated a Mind Flayer.',               cond: { type:'achv', id:'classic_enc2' } },
  { id:'t_immortal',     label:'Beyond Death',        icon:'💀', desc:'Returned from the dead.',               cond: { type:'achv', id:'h_revenant'   } },
  { id:'t_20to1',        label:'The Fallen',          icon:'☠️', desc:'A level 20 character has died.',        cond: { type:'achv', id:'way_to_go'    } },
  { id:'t_tpk',          label:'TPK Survivor',        icon:'💔', desc:'Witnessed a Total Party Kill.',         cond: { type:'achv', id:'heartbreaking'} },
  { id:'t_silvertongue', label:'Silver Tongue',       icon:'🗣', desc:'Talked your way out of anything.',      cond: { type:'achv', id:'bribe_out'    } },
  { id:'t_shadowhand',   label:'Shadow Hand',         icon:'🤏', desc:'Five Finger Discount.',                  cond: { type:'achv', id:'sticky_finger'} },
  { id:'t_crimelord',    label:'Crime Lord',          icon:'🎭', desc:'Framed a crime on another.',            cond: { type:'achv', id:'frame_crime'  } },
  { id:'t_shipmaster',   label:'Shipmaster',          icon:'⛵', desc:'Owns a ship.',                           cond: { type:'achv', id:'ship'         } },
  { id:'t_skypirate',    label:'Sky Pirate',          icon:'🚀', desc:'Owns a skyship.',                        cond: { type:'achv', id:'skyship'      } },
  { id:'t_capitalist',   label:'Merchant Prince',     icon:'💰', desc:'Built a business empire.',              cond: { type:'achv', id:'capitalists'  } },
  { id:'t_lucky',        label:'Lucky Bastard',       icon:'🍀', desc:'The dice favour you.',                  cond: { type:'achv', id:'lucky_bastard'} },
  { id:'t_nuclear',      label:'Walking Nuke',        icon:'💥', desc:'Went nuclear.',                          cond: { type:'achv', id:'going_nuclear'} },
  { id:'t_overkill',     label:'Overkill',            icon:'⚔️', desc:'Overkill achieved.',                    cond: { type:'achv', id:'overkill'     } },
  { id:'t_medic',        label:'Combat Medic',        icon:'💊', desc:'Saved a life mid-combat.',              cond: { type:'achv', id:'combat_medic' } },
  { id:'t_drizzt',       label:'Not Drizzt',          icon:'🌑', desc:'Had to clarify you are not Drizzt.',    cond: { type:'achv', id:'h_drizzt'     } },
  { id:'t_groot',        label:'I Am Groot',          icon:'🌱', desc:'I am Groot.',                            cond: { type:'achv', id:'h_groot'      } },
  { id:'t_allknowing',   label:'All-Knowing',         icon:'🔮', desc:'Unlocked every hidden achievement.',    cond: { type:'cat',  cat:'Hidden', min:22} },
  // New specific unlock titles
  { id:'t_holy_roller',  label:'Holy Roller',         icon:'🎲', desc:'Rolled two nat-20s with disadvantage.', cond: { type:'achv', id:'holy_shit'    } },
  { id:'t_cursed_one',   label:'The Cursed One',      icon:'🔴', desc:'Attuned to a cursed item knowingly.',   cond: { type:'achv', id:'i_cursed'     } },
  { id:'t_artifact_lord',label:'Artifact Lord',       icon:'✨', desc:'Attuned to an artifact.',               cond: { type:'achv', id:'i_artifact'   } },
  { id:'t_godlike',      label:'Godlike',             icon:'🏆', desc:'An ability score of 30.',               cond: { type:'achv', id:'i_score30'    } },
  { id:'t_bell_ringer',  label:'Death Defied Twice',  icon:'🔔', desc:'Two death save nat-20s in one encounter.',cond:{ type:'achv', id:'no_bell'      } },
  { id:'t_yoyo',         label:'The Yo-Yo',           icon:'🪀', desc:'Died and killed in the same encounter.', cond: { type:'achv', id:'yoyo'         } },
  { id:'t_wanted',       label:'Wanted',              icon:'📌', desc:'There\'s a poster of you out there.',    cond: { type:'achv', id:'wanted_poster'} },
  { id:'t_kraken_slayer',label:'Kraken Slayer',       icon:'🦑', desc:'Defeated a Kraken.',                    cond: { type:'achv', id:'comedian'     } },
  { id:'t_empyrean',     label:'Empyrean Foe',        icon:'🌀', desc:'Defeated an Empyrean.',                 cond: { type:'achv', id:'notso_adv'    } },
  { id:'t_deep_crow',    label:'Fear No Darkness',    icon:'🐦‍⬛', desc:'Defeated an Ancient Deep Crow.',       cond: { type:'achv', id:'notso_enc3'   } },
  { id:'t_level20',      label:'The Pure',            icon:'💯', desc:'Level 1 to 20, no multiclassing.',      cond: { type:'achv', id:'quite_adv'    } },
  { id:'t_railgun',      label:'Eldritch Railgunner', icon:'💜', desc:'Eldritch Blast from 600ft.',            cond: { type:'achv', id:'c_wlk_eldritch'} },
  { id:'t_ironman',      label:'Iron Man',            icon:'🦾', desc:'As an Artificer, achieved flight.',     cond: { type:'achv', id:'c_art_fly'    } },
  { id:'t_too_angry',    label:'Too Angry To Die',    icon:'😠', desc:'Barbarian Relentless Rage master.',     cond: { type:'achv', id:'c_barb_relentless'} },
  { id:'t_repent',       label:'REPENT!',             icon:'⚡', desc:'One-shot a full HP enemy with Smite.',  cond: { type:'achv', id:'c_pal_smite'  } },
  { id:'t_filthy_casual',label:'Filthy Casual',       icon:'💨', desc:'Threw a bullet back at someone.',       cond: { type:'achv', id:'filthy_casual'} },
  { id:'t_multimaster',  label:'Multi-Classer',       icon:'🔀', desc:'Multiclassed your character.',          cond: { type:'achv', id:'mc_general'   } },
  { id:'t_deicide',      label:'Deicide',             icon:'⛪', desc:'Killed a deity.',                       cond: { type:'achv', id:'p_kill_deity' } },
  { id:'t_cannibal',     label:'Waste Not',           icon:'🍽️', desc:'Practiced cannibalism.',               cond: { type:'achv', id:'p_cannibalism'} },
  { id:'t_pacifist',     label:'The Pacifist',        icon:'🕊️', desc:'Dealt no damage in an encounter.',      cond: { type:'achv', id:'p_no_dmg'     } },
  { id:'t_galaxy_brain', label:'Galaxy Brain',        icon:'🧠', desc:'Used poor logic to persuade someone.',  cond: { type:'achv', id:'p_poor_logic' } },

  // ── Category dominance titles ──
  { id:'t_explorer',     label:'The Explorer',        icon:'🗺', desc:'10+ Exploration achievements.',         cond: { type:'cat', cat:'Exploration', min:10 } },
  { id:'t_warrior',      label:'The Warrior',         icon:'🛡', desc:'10+ Combat achievements.',              cond: { type:'cat', cat:'Combat',      min:10 } },
  { id:'t_looter',       label:'Treasure Hunter',     icon:'💎', desc:'10+ Loot achievements.',                cond: { type:'cat', cat:'Loot',        min:10 } },
  { id:'t_classmaster',  label:'Class Master',        icon:'✨', desc:'20+ Class achievements.',               cond: { type:'cat', cat:'Class',       min:20 } },
  { id:'t_avenger',      label:'The Avenger',         icon:'🦸', desc:'All Avengers achievements.',            cond: { type:'cat', cat:'Avengers',    min:11 } },
  { id:'t_dice_god',     label:'Dice God',            icon:'🎲', desc:'30+ Dice achievements.',                cond: { type:'cat', cat:'Dice',        min:30 } },
  { id:'t_dice_cursed',  label:'Dice Cursed',         icon:'💩', desc:'10+ Critical Fail dice achievements.',  cond: { type:'cat', cat:'Dice',        min:10 } },
  { id:'t_race_pure',    label:'Pureblooded',         icon:'🧬', desc:'10+ Race-specific achievements.',       cond: { type:'cat', cat:'Race',        min:10 } },
  { id:'t_multiclasser', label:'The Dabbler',         icon:'🔀', desc:'7+ Multiclass achievements.',           cond: { type:'cat', cat:'Multiclass',  min:7  } },
  { id:'t_economy_king', label:'Economy King',        icon:'💸', desc:'All Economy achievements.',             cond: { type:'cat', cat:'Economy',     min:7  } },

  // ── New category titles ──
  { id:'t_betrayer',      label:'The Betrayer',        icon:'🗡️', desc:'Betrayed the party for personal gain.',  cond: { type:'achv', id:'p_betray_party'  } },
  { id:'t_kingslayer',    label:'Kingslayer',           icon:'👑', desc:'Killed a sovereign and took the throne.',cond: { type:'achv', id:'p_replace_ruler' } },
  { id:'t_godkiller',     label:'Godkiller',            icon:'💀', desc:'Killed a deity.',                        cond: { type:'achv', id:'p_kill_deity'    } },
  { id:'t_peacemaker',    label:'The Peacemaker',       icon:'🕊️', desc:'Resolved mortal enemies peacefully.',    cond: { type:'achv', id:'p_reconcile'     } },
  { id:'t_martyr',        label:'The Martyr',           icon:'❤️', desc:'Sacrificed yourself for the party.',     cond: { type:'achv', id:'p_sacrifice'     } },
  { id:'t_warmonger',     label:'Warmonger',            icon:'⚔️', desc:'Started a war between nations.',         cond: { type:'achv', id:'p_start_war'     } },
  { id:'t_rolled_credits',label:'Campaign Complete',    icon:'🏆', desc:'Beat the campaign.',                     cond: { type:'achv', id:'p_beat_campaign' } },
  { id:'t_executioner',   label:'The Executioner',      icon:'🩸', desc:'10+ Kills achievements.',                cond: { type:'cat', cat:'Kills',       min:10 } },
  { id:'t_mass_murder',   label:'Mass Murderer',        icon:'☠️', desc:'All Kills achievements.',                cond: { type:'cat', cat:'Kills',       min:29 } },
  { id:'t_survivor',      label:'The Survivor',         icon:'💪', desc:'10+ Survival achievements.',             cond: { type:'cat', cat:'Survival',    min:10 } },
  { id:'t_unkillable',    label:'Unkillable',           icon:'🪦', desc:'All Survival achievements.',             cond: { type:'cat', cat:'Survival',    min:26 } },
  { id:'t_politician',    label:'The Politician',       icon:'🎖️', desc:'10+ Politics achievements.',             cond: { type:'cat', cat:'Politics',    min:10 } },
  { id:'t_power_player',  label:'Power Player',         icon:'👑', desc:'All Politics achievements.',             cond: { type:'cat', cat:'Politics',    min:16 } },
  { id:'t_actor',         label:'The Method Actor',     icon:'🎭', desc:'10+ Roleplay achievements.',             cond: { type:'cat', cat:'Roleplay',    min:10 } },
  { id:'t_storyteller',   label:'The Storyteller',      icon:'📖', desc:'All Roleplay achievements.',             cond: { type:'cat', cat:'Roleplay',    min:29 } },
  { id:'t_gremlin',       label:'Gremlin',              icon:'😈', desc:'10+ Shenanigans achievements.',          cond: { type:'cat', cat:'Shenanigans', min:10 } },
  { id:'t_agent_chaos',   label:'Agent of Chaos',       icon:'🌀', desc:'All Shenanigans achievements.',          cond: { type:'cat', cat:'Shenanigans', min:23 } },

  // ── Tracker milestone titles ──
  { id:'t_tr_kills_1',  label:'Brawler',             icon:'⚔️', desc:'Slew 5 enemies.',         cond:{type:'achv',id:'tr_kills_1'}  },
  { id:'t_tr_kills_2',  label:'Fighter',             icon:'⚔️', desc:'Slew 10 enemies.',        cond:{type:'achv',id:'tr_kills_2'}  },
  { id:'t_tr_kills_3',  label:'Warrior',             icon:'⚔️', desc:'Slew 25 enemies.',        cond:{type:'achv',id:'tr_kills_3'}  },
  { id:'t_tr_kills_4',  label:'Slayer',              icon:'⚔️', desc:'Slew 50 enemies.',        cond:{type:'achv',id:'tr_kills_4'}  },
  { id:'t_tr_kills_5',  label:'Reaper',              icon:'⚔️', desc:'Slew 100 enemies.',       cond:{type:'achv',id:'tr_kills_5'}  },
  { id:'t_tr_kills_6',  label:'Warlord',             icon:'⚔️', desc:'Slew 500 enemies.',       cond:{type:'achv',id:'tr_kills_6'}  },
  { id:'t_tr_kills_7',  label:'Legend of Carnage',   icon:'⚔️', desc:'Slew 1000 enemies.',      cond:{type:'achv',id:'tr_kills_7'}  },
  { id:'t_tr_nat20_1',  label:'Lucky',               icon:'🌟', desc:'Rolled nat20 once.',      cond:{type:'achv',id:'tr_nat20_1'}  },
  { id:'t_tr_nat20_2',  label:'Blessed',             icon:'🌟', desc:'Rolled nat20 5 times.',   cond:{type:'achv',id:'tr_nat20_2'}  },
  { id:'t_tr_nat20_3',  label:"Fortune's Favorite",  icon:'🌟', desc:'Rolled nat20 10 times.',  cond:{type:'achv',id:'tr_nat20_3'}  },
  { id:'t_tr_nat20_4',  label:'Touched by Fate',     icon:'🌟', desc:'Rolled nat20 25 times.',  cond:{type:'achv',id:'tr_nat20_4'}  },
  { id:'t_tr_nat20_5',  label:'Dice Master',         icon:'🌟', desc:'Rolled nat20 50 times.',  cond:{type:'achv',id:'tr_nat20_5'}  },
  { id:'t_tr_nat20_6',  label:'Chosen of the Die',   icon:'🌟', desc:'Rolled nat20 100 times.', cond:{type:'achv',id:'tr_nat20_6'}  },
  { id:'t_tr_nat20_7',  label:'Avatar of Twenty',    icon:'🌟', desc:'Rolled nat20 500 times.', cond:{type:'achv',id:'tr_nat20_7'}  },
  { id:'t_tr_nat1_1',   label:'Fumbler',             icon:'💀', desc:'Rolled nat1 once.',       cond:{type:'achv',id:'tr_nat1_1'}   },
  { id:'t_tr_nat1_2',   label:'The Cursed',          icon:'💀', desc:'Rolled nat1 5 times.',    cond:{type:'achv',id:'tr_nat1_2'}   },
  { id:'t_tr_nat1_3',   label:'Doomed',              icon:'💀', desc:'Rolled nat1 10 times.',   cond:{type:'achv',id:'tr_nat1_3'}   },
  { id:'t_tr_nat1_4',   label:'Jinxed',              icon:'💀', desc:'Rolled nat1 25 times.',   cond:{type:'achv',id:'tr_nat1_4'}   },
  { id:'t_tr_nat1_5',   label:'Calamity',            icon:'💀', desc:'Rolled nat1 50 times.',   cond:{type:'achv',id:'tr_nat1_5'}   },
  { id:'t_tr_nat1_6',   label:'Harbinger of 1s',     icon:'💀', desc:'Rolled nat1 100 times.',  cond:{type:'achv',id:'tr_nat1_6'}   },
  { id:'t_tr_nat1_7',   label:'Living Natural 1',    icon:'💀', desc:'Rolled nat1 500 times.',  cond:{type:'achv',id:'tr_nat1_7'}   },
  { id:'t_tr_npc_1',    label:'Flirt',               icon:'💋', desc:'Charmed 1 NPC.',          cond:{type:'achv',id:'tr_npc_1'}    },
  { id:'t_tr_npc_2',    label:'Charmer',             icon:'💋', desc:'Charmed 3 NPCs.',         cond:{type:'achv',id:'tr_npc_2'}    },
  { id:'t_tr_npc_3',    label:'Heartbreaker',        icon:'💋', desc:'Charmed 5 NPCs.',         cond:{type:'achv',id:'tr_npc_3'}    },
  { id:'t_tr_npc_4',    label:'Romeo / Juliet',      icon:'💋', desc:'Charmed 10 NPCs.',        cond:{type:'achv',id:'tr_npc_4'}    },
  { id:'t_tr_npc_5',    label:'Legendary Lover',     icon:'💋', desc:'Charmed 25 NPCs.',        cond:{type:'achv',id:'tr_npc_5'}    },
  { id:'t_tr_npc_6',    label:'NPC Whisperer',       icon:'💋', desc:'Charmed 50 NPCs.',        cond:{type:'achv',id:'tr_npc_6'}    },
  { id:'t_tr_npc_7',    label:'God of Charm',        icon:'💋', desc:'Charmed 100 NPCs.',       cond:{type:'achv',id:'tr_npc_7'}    },
  { id:'t_tr_gold_1',   label:'Copper Pincher',      icon:'🪙', desc:'Accumulated 50 GP.',      cond:{type:'achv',id:'tr_gold_1'}   },
  { id:'t_tr_gold_2',   label:'Silver Saver',        icon:'🪙', desc:'Accumulated 100 GP.',     cond:{type:'achv',id:'tr_gold_2'}   },
  { id:'t_tr_gold_3',   label:'Gold Keeper',         icon:'🪙', desc:'Accumulated 500 GP.',     cond:{type:'achv',id:'tr_gold_3'}   },
  { id:'t_tr_gold_4',   label:'Merchant Prince',     icon:'🪙', desc:'Accumulated 1000 GP.',    cond:{type:'achv',id:'tr_gold_4'}   },
  { id:'t_tr_gold_5',   label:'Treasury Lord',       icon:'🪙', desc:'Accumulated 5000 GP.',    cond:{type:'achv',id:'tr_gold_5'}   },
  { id:'t_tr_gold_6',   label:"Dragon's Hoard",      icon:'🪙', desc:'Accumulated 10000 GP.',   cond:{type:'achv',id:'tr_gold_6'}   },
  { id:'t_tr_gold_7',   label:'Midas Reborn',        icon:'🪙', desc:'Accumulated 50000 GP.',   cond:{type:'achv',id:'tr_gold_7'}   },
  { id:'t_tr_large_1',  label:'Brave',               icon:'🐉', desc:'Defeated 1 Large+ monster.',   cond:{type:'achv',id:'tr_large_1'}  },
  { id:'t_tr_large_2',  label:'Monster Hunter',      icon:'🐉', desc:'Defeated 5 Large+ monsters.',  cond:{type:'achv',id:'tr_large_2'}  },
  { id:'t_tr_large_3',  label:'Behemoth Bane',       icon:'🐉', desc:'Defeated 10 Large+ monsters.', cond:{type:'achv',id:'tr_large_3'}  },
  { id:'t_tr_large_4',  label:'Titan Slayer',        icon:'🐉', desc:'Defeated 25 Large+ monsters.', cond:{type:'achv',id:'tr_large_4'}  },
  { id:'t_tr_large_5',  label:'Dragon Slayer',       icon:'🐉', desc:'Defeated 50 Large+ monsters.', cond:{type:'achv',id:'tr_large_5'}  },
  { id:'t_tr_large_6',  label:'Colossus Killer',     icon:'🐉', desc:'Defeated 100 Large+ monsters.',cond:{type:'achv',id:'tr_large_6'}  },
  { id:'t_tr_large_7',  label:'Primordial Destroyer',icon:'🐉', desc:'Defeated 250 Large+ monsters.',cond:{type:'achv',id:'tr_large_7'}  },
  { id:'t_tr_burst_1',  label:'Hard Hitter',         icon:'💥', desc:'Massive damage 1 time.',   cond:{type:'achv',id:'tr_burst_1'}  },
  { id:'t_tr_burst_2',  label:'Bruiser',             icon:'💥', desc:'Massive damage 3 times.',  cond:{type:'achv',id:'tr_burst_2'}  },
  { id:'t_tr_burst_3',  label:'Devastator',          icon:'💥', desc:'Massive damage 5 times.',  cond:{type:'achv',id:'tr_burst_3'}  },
  { id:'t_tr_burst_4',  label:'Force of Nature',     icon:'💥', desc:'Massive damage 10 times.', cond:{type:'achv',id:'tr_burst_4'}  },
  { id:'t_tr_burst_5',  label:'Avatar of Destruction',icon:'💥',desc:'Massive damage 25 times.', cond:{type:'achv',id:'tr_burst_5'}  },
  { id:'t_tr_burst_6',  label:'Engine of Ruin',      icon:'💥', desc:'Massive damage 50 times.', cond:{type:'achv',id:'tr_burst_6'}  },
  { id:'t_tr_burst_7',  label:'Godslayer',           icon:'💥', desc:'Massive damage 100 times.',cond:{type:'achv',id:'tr_burst_7'}  },
  { id:'t_tr_crit_1',   label:'Precise',             icon:'🎯', desc:'1 critical hit.',    cond:{type:'achv',id:'tr_crit_1'}   },
  { id:'t_tr_crit_2',   label:'Sharp Eye',           icon:'🎯', desc:'5 critical hits.',   cond:{type:'achv',id:'tr_crit_2'}   },
  { id:'t_tr_crit_3',   label:'Surgeon',             icon:'🎯', desc:'10 critical hits.',  cond:{type:'achv',id:'tr_crit_3'}   },
  { id:'t_tr_crit_4',   label:'Executioner',         icon:'🎯', desc:'25 critical hits.',  cond:{type:'achv',id:'tr_crit_4'}   },
  { id:'t_tr_crit_5',   label:'Critical Machine',    icon:'🎯', desc:'50 critical hits.',  cond:{type:'achv',id:'tr_crit_5'}   },
  { id:'t_tr_crit_6',   label:'Scythe of Fate',      icon:'🎯', desc:'100 critical hits.', cond:{type:'achv',id:'tr_crit_6'}   },
  { id:'t_tr_crit_7',   label:'Death Itself',        icon:'🎯', desc:'500 critical hits.', cond:{type:'achv',id:'tr_crit_7'}   },
  { id:'t_tr_1hp_1',    label:'Lucky Survivor',      icon:'❤️', desc:'Won at 1HP once.',   cond:{type:'achv',id:'tr_1hp_1'}    },
  { id:'t_tr_1hp_2',    label:'Barely Alive',        icon:'❤️', desc:'Won at 1HP 3 times.',cond:{type:'achv',id:'tr_1hp_2'}    },
  { id:'t_tr_1hp_3',    label:'Deathdancer',         icon:'❤️', desc:'Won at 1HP 5 times.',cond:{type:'achv',id:'tr_1hp_3'}    },
  { id:'t_tr_1hp_4',    label:'Immortal Spirit',     icon:'❤️', desc:'Won at 1HP 10 times.',cond:{type:'achv',id:'tr_1hp_4'}   },
  { id:'t_tr_1hp_5',    label:'Beyond Death',        icon:'❤️', desc:'Won at 1HP 25 times.',cond:{type:'achv',id:'tr_1hp_5'}   },
  { id:'t_tr_1hp_6',    label:'Unkillable',          icon:'❤️', desc:'Won at 1HP 50 times.',cond:{type:'achv',id:'tr_1hp_6'}   },
  { id:'t_tr_1hp_7',    label:'The Undying',         icon:'❤️', desc:'Won at 1HP 100 times.',cond:{type:'achv',id:'tr_1hp_7'}  },
  { id:'t_tr_spend_1',  label:'Shopper',             icon:'💸', desc:'Spent 50 GP.',        cond:{type:'achv',id:'tr_spend_1'}  },
  { id:'t_tr_spend_2',  label:'Patron',              icon:'💸', desc:'Spent 100 GP.',       cond:{type:'achv',id:'tr_spend_2'}  },
  { id:'t_tr_spend_3',  label:'Spendthrift',         icon:'💸', desc:'Spent 500 GP.',       cond:{type:'achv',id:'tr_spend_3'}  },
  { id:'t_tr_spend_4',  label:'High Roller',         icon:'💸', desc:'Spent 1000 GP.',      cond:{type:'achv',id:'tr_spend_4'}  },
  { id:'t_tr_spend_5',  label:'Merchant of Chaos',   icon:'💸', desc:'Spent 5000 GP.',      cond:{type:'achv',id:'tr_spend_5'}  },
  { id:'t_tr_spend_6',  label:'Economic Ruin',       icon:'💸', desc:'Spent 10000 GP.',     cond:{type:'achv',id:'tr_spend_6'}  },
  { id:'t_tr_spend_7',  label:'The Void of Gold',    icon:'💸', desc:'Spent 50000 GP.',     cond:{type:'achv',id:'tr_spend_7'}  },
  { id:'t_tr_rest_1',   label:'Weary Traveler',      icon:'🛌', desc:'5 long rests.',        cond:{type:'achv',id:'tr_rest_1'}   },
  { id:'t_tr_rest_2',   label:'Seasoned Sleeper',    icon:'🛌', desc:'10 long rests.',       cond:{type:'achv',id:'tr_rest_2'}   },
  { id:'t_tr_rest_3',   label:'Inn Connoisseur',     icon:'🛌', desc:'25 long rests.',       cond:{type:'achv',id:'tr_rest_3'}   },
  { id:'t_tr_rest_4',   label:'Wandering Drifter',   icon:'🛌', desc:'50 long rests.',       cond:{type:'achv',id:'tr_rest_4'}   },
  { id:'t_tr_rest_5',   label:'Nomad',               icon:'🛌', desc:'100 long rests.',      cond:{type:'achv',id:'tr_rest_5'}   },
  { id:'t_tr_rest_6',   label:'Restless Soul',       icon:'🛌', desc:'250 long rests.',      cond:{type:'achv',id:'tr_rest_6'}   },
  { id:'t_tr_rest_7',   label:'Eternal Wanderer',    icon:'🛌', desc:'500 long rests.',      cond:{type:'achv',id:'tr_rest_7'}   },
  { id:'t_tr_loc_1',    label:'Wanderer',            icon:'🗺️', desc:'Visited 5 locations.',   cond:{type:'achv',id:'tr_loc_1'}    },
  { id:'t_tr_loc_2',    label:'Pathfinder',          icon:'🗺️', desc:'Visited 10 locations.',  cond:{type:'achv',id:'tr_loc_2'}    },
  { id:'t_tr_loc_3',    label:'Explorer',            icon:'🗺️', desc:'Visited 25 locations.',  cond:{type:'achv',id:'tr_loc_3'}    },
  { id:'t_tr_loc_4',    label:'Cartographer',        icon:'🗺️', desc:'Visited 50 locations.',  cond:{type:'achv',id:'tr_loc_4'}    },
  { id:'t_tr_loc_5',    label:'World Traveler',      icon:'🗺️', desc:'Visited 100 locations.', cond:{type:'achv',id:'tr_loc_5'}    },
  { id:'t_tr_loc_6',    label:'Realm Walker',        icon:'🗺️', desc:'Visited 250 locations.', cond:{type:'achv',id:'tr_loc_6'}    },
  { id:'t_tr_loc_7',    label:'Planeswalker',        icon:'🗺️', desc:'Visited 500 locations.', cond:{type:'achv',id:'tr_loc_7'}    },
  // ── New Tracker Titles (auto-generated) ──
  { id:'t_tr_spell_1', label:'Apprentice', icon:'🪄', desc:'Cast 15 spells.', cond:{type:'achv',id:'tr_spell_1'} },
  { id:'t_tr_spell_2', label:'Cantrip Cowboy', icon:'🪄', desc:'Cast 40 spells.', cond:{type:'achv',id:'tr_spell_2'} },
  { id:'t_tr_spell_3', label:'Spellcaster', icon:'🪄', desc:'Cast 80 spells.', cond:{type:'achv',id:'tr_spell_3'} },
  { id:'t_tr_spell_4', label:'Arcane Adept', icon:'🪄', desc:'Cast 150 spells.', cond:{type:'achv',id:'tr_spell_4'} },
  { id:'t_tr_spell_5', label:'Weave Bender', icon:'🪄', desc:'Cast 300 spells.', cond:{type:'achv',id:'tr_spell_5'} },
  { id:'t_tr_spell_6', label:'High Arcanist', icon:'🪄', desc:'Cast 600 spells.', cond:{type:'achv',id:'tr_spell_6'} },
  { id:'t_tr_spell_7', label:'Living Spellbook', icon:'🪄', desc:'Cast 1,200 spells.', cond:{type:'achv',id:'tr_spell_7'} },
  { id:'t_tr_rez_1', label:'First Responder', icon:'✨', desc:'Revive 1 fallen ally.', cond:{type:'achv',id:'tr_rez_1'} },
  { id:'t_tr_rez_2', label:'Field Medic', icon:'✨', desc:'Revive 2 fallen allies.', cond:{type:'achv',id:'tr_rez_2'} },
  { id:'t_tr_rez_3', label:'Life Bringer', icon:'✨', desc:'Revive 4 fallen allies.', cond:{type:'achv',id:'tr_rez_3'} },
  { id:'t_tr_rez_4', label:'Resurrectionist', icon:'✨', desc:'Revive 8 fallen allies.', cond:{type:'achv',id:'tr_rez_4'} },
  { id:'t_tr_rez_5', label:'Angel of the Fallen', icon:'✨', desc:'Revive 15 fallen allies.', cond:{type:'achv',id:'tr_rez_5'} },
  { id:'t_tr_rez_6', label:'Defier of Death', icon:'✨', desc:'Revive 25 fallen allies.', cond:{type:'achv',id:'tr_rez_6'} },
  { id:'t_tr_rez_7', label:'Cheater of the Grave', icon:'✨', desc:'Revive 40 fallen allies.', cond:{type:'achv',id:'tr_rez_7'} },
  { id:'t_tr_lock_1', label:'Amateur Picker', icon:'🔓', desc:'Pick 1 lock or disarm 1 trap.', cond:{type:'achv',id:'tr_lock_1'} },
  { id:'t_tr_lock_2', label:'Second Story Man', icon:'🔓', desc:'Pick 5 locks or disarm 5 traps.', cond:{type:'achv',id:'tr_lock_2'} },
  { id:'t_tr_lock_3', label:'Cat Burglar', icon:'🔓', desc:'Pick 10 locks or disarm 10 traps.', cond:{type:'achv',id:'tr_lock_3'} },
  { id:'t_tr_lock_4', label:'Master of Keys', icon:'🔓', desc:'Pick 20 locks or disarm 20 traps.', cond:{type:'achv',id:'tr_lock_4'} },
  { id:'t_tr_lock_5', label:'Shadow Hand', icon:'🔓', desc:'Pick 40 locks or disarm 40 traps.', cond:{type:'achv',id:'tr_lock_5'} },
  { id:'t_tr_lock_6', label:'Ghostwalk', icon:'🔓', desc:'Pick 80 locks or disarm 80 traps.', cond:{type:'achv',id:'tr_lock_6'} },
  { id:'t_tr_lock_7', label:'The Unpickable Picker', icon:'🔓', desc:'Pick 150 locks or disarm 150 traps.', cond:{type:'achv',id:'tr_lock_7'} },
  { id:'t_tr_0hp_1', label:'Fallen', icon:'😵', desc:'Drop to 0 HP and survive — 1 time.', cond:{type:'achv',id:'tr_0hp_1'} },
  { id:'t_tr_0hp_2', label:'Ragdoll', icon:'😵', desc:'Drop to 0 HP and survive — 3 times.', cond:{type:'achv',id:'tr_0hp_2'} },
  { id:'t_tr_0hp_3', label:'Crash Test Dummy', icon:'😵', desc:'Drop to 0 HP and survive — 5 times.', cond:{type:'achv',id:'tr_0hp_3'} },
  { id:'t_tr_0hp_4', label:'Hard to Kill', icon:'😵', desc:'Drop to 0 HP and survive — 10 times.', cond:{type:'achv',id:'tr_0hp_4'} },
  { id:'t_tr_0hp_5', label:'Nine Lives', icon:'😵', desc:'Drop to 0 HP and survive — 20 times.', cond:{type:'achv',id:'tr_0hp_5'} },
  { id:'t_tr_0hp_6', label:'Immortal Fool', icon:'😵', desc:'Drop to 0 HP and survive — 35 times.', cond:{type:'achv',id:'tr_0hp_6'} },
  { id:'t_tr_0hp_7', label:'Death Proof', icon:'😵', desc:'Drop to 0 HP and survive — 60 times.', cond:{type:'achv',id:'tr_0hp_7'} },
  { id:'t_tr_scroll_1', label:'Curious Reader', icon:'📜', desc:'Identify or use 1 magic scroll.', cond:{type:'achv',id:'tr_scroll_1'} },
  { id:'t_tr_scroll_2', label:'Scroll Monkey', icon:'📜', desc:'Identify or use 4 magic scrolls.', cond:{type:'achv',id:'tr_scroll_2'} },
  { id:'t_tr_scroll_3', label:'Lore Seeker', icon:'📜', desc:'Identify or use 8 magic scrolls.', cond:{type:'achv',id:'tr_scroll_3'} },
  { id:'t_tr_scroll_4', label:'Tome Walker', icon:'📜', desc:'Identify or use 15 magic scrolls.', cond:{type:'achv',id:'tr_scroll_4'} },
  { id:'t_tr_scroll_5', label:'Arcane Scholar', icon:'📜', desc:'Identify or use 30 magic scrolls.', cond:{type:'achv',id:'tr_scroll_5'} },
  { id:'t_tr_scroll_6', label:'Grand Librarian', icon:'📜', desc:'Identify or use 60 magic scrolls.', cond:{type:'achv',id:'tr_scroll_6'} },
  { id:'t_tr_scroll_7', label:'The Omniscient', icon:'📜', desc:'Identify or use 100 magic scrolls.', cond:{type:'achv',id:'tr_scroll_7'} },
  { id:'t_tr_persuade_1', label:'Talker', icon:'🗣️', desc:'Succeed on 5 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_1'} },
  { id:'t_tr_persuade_2', label:'Haggler', icon:'🗣️', desc:'Succeed on 15 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_2'} },
  { id:'t_tr_persuade_3', label:'Wordsmith', icon:'🗣️', desc:'Succeed on 35 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_3'} },
  { id:'t_tr_persuade_4', label:'Puppetmaster', icon:'🗣️', desc:'Succeed on 75 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_4'} },
  { id:'t_tr_persuade_5', label:'Grand Deceiver', icon:'🗣️', desc:'Succeed on 150 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_5'} },
  { id:'t_tr_persuade_6', label:'The Manipulator', icon:'🗣️', desc:'Succeed on 300 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_6'} },
  { id:'t_tr_persuade_7', label:'The Voice', icon:'🗣️', desc:'Succeed on 600 Persuasion or Deception checks.', cond:{type:'achv',id:'tr_persuade_7'} },
  { id:'t_tr_tavern_1', label:'Thirsty Traveler', icon:'🍺', desc:'Visit 1 tavern or purchase 1 drink.', cond:{type:'achv',id:'tr_tavern_1'} },
  { id:'t_tr_tavern_2', label:'Bar Fly', icon:'🍺', desc:'Visit 5 taverns or purchase 5 drinks.', cond:{type:'achv',id:'tr_tavern_2'} },
  { id:'t_tr_tavern_3', label:'Tavern Rat', icon:'🍺', desc:'Visit 10 taverns or purchase 10 drinks.', cond:{type:'achv',id:'tr_tavern_3'} },
  { id:'t_tr_tavern_4', label:'Connoisseur of Ales', icon:'🍺', desc:'Visit 25 taverns or purchase 25 drinks.', cond:{type:'achv',id:'tr_tavern_4'} },
  { id:'t_tr_tavern_5', label:'Barkeep\'s Favorite', icon:'🍺', desc:'Visit 50 taverns or purchase 50 drinks.', cond:{type:'achv',id:'tr_tavern_5'} },
  { id:'t_tr_tavern_6', label:'Living Legend of the Tap', icon:'🍺', desc:'Visit 100 taverns or purchase 100 drinks.', cond:{type:'achv',id:'tr_tavern_6'} },
  { id:'t_tr_tavern_7', label:'God of the Goblet', icon:'🍺', desc:'Visit 250 taverns or purchase 250 drinks.', cond:{type:'achv',id:'tr_tavern_7'} },
  { id:'t_tr_trap_1', label:'Wary', icon:'🕳️', desc:'Detect 1 trap before triggering it.', cond:{type:'achv',id:'tr_trap_1'} },
  { id:'t_tr_trap_2', label:'Cautious', icon:'🕳️', desc:'Detect 4 traps before triggering them.', cond:{type:'achv',id:'tr_trap_2'} },
  { id:'t_tr_trap_3', label:'Trap Sniffer', icon:'🕳️', desc:'Detect 8 traps before triggering them.', cond:{type:'achv',id:'tr_trap_3'} },
  { id:'t_tr_trap_4', label:'Dungeon Savant', icon:'🕳️', desc:'Detect 15 traps before triggering them.', cond:{type:'achv',id:'tr_trap_4'} },
  { id:'t_tr_trap_5', label:'Paranoid Perfectionist', icon:'🕳️', desc:'Detect 30 traps before triggering them.', cond:{type:'achv',id:'tr_trap_5'} },
  { id:'t_tr_trap_6', label:'The Untriggered', icon:'🕳️', desc:'Detect 60 traps before triggering them.', cond:{type:'achv',id:'tr_trap_6'} },
  { id:'t_tr_trap_7', label:'Ghost of the Dungeon', icon:'🕳️', desc:'Detect 120 traps before triggering them.', cond:{type:'achv',id:'tr_trap_7'} },
  { id:'t_tr_deathsave_1', label:'Survivor', icon:'🎲', desc:'Succeed on 1 death saving throw.', cond:{type:'achv',id:'tr_deathsave_1'} },
  { id:'t_tr_deathsave_2', label:'Tenacious', icon:'🎲', desc:'Succeed on 3 death saving throws.', cond:{type:'achv',id:'tr_deathsave_2'} },
  { id:'t_tr_deathsave_3', label:'Stubbornly Alive', icon:'🎲', desc:'Succeed on 8 death saving throws.', cond:{type:'achv',id:'tr_deathsave_3'} },
  { id:'t_tr_deathsave_4', label:'Death Negotiator', icon:'🎲', desc:'Succeed on 15 death saving throws.', cond:{type:'achv',id:'tr_deathsave_4'} },
  { id:'t_tr_deathsave_5', label:'Mortal Coil', icon:'🎲', desc:'Succeed on 30 death saving throws.', cond:{type:'achv',id:'tr_deathsave_5'} },
  { id:'t_tr_deathsave_6', label:'Pact with the Reaper', icon:'🎲', desc:'Succeed on 60 death saving throws.', cond:{type:'achv',id:'tr_deathsave_6'} },
  { id:'t_tr_deathsave_7', label:'Immortal by Technicality', icon:'🎲', desc:'Succeed on 120 death saving throws.', cond:{type:'achv',id:'tr_deathsave_7'} },
  { id:'t_tr_dungeon_1', label:'Spelunker', icon:'🏚️', desc:'Fully clear 1 dungeon.', cond:{type:'achv',id:'tr_dungeon_1'} },
  { id:'t_tr_dungeon_2', label:'Dungeon Runner', icon:'🏚️', desc:'Fully clear 3 dungeons.', cond:{type:'achv',id:'tr_dungeon_2'} },
  { id:'t_tr_dungeon_3', label:'Tomb Raider', icon:'🏚️', desc:'Fully clear 6 dungeons.', cond:{type:'achv',id:'tr_dungeon_3'} },
  { id:'t_tr_dungeon_4', label:'Crypt Keeper', icon:'🏚️', desc:'Fully clear 12 dungeons.', cond:{type:'achv',id:'tr_dungeon_4'} },
  { id:'t_tr_dungeon_5', label:'The Underdark Regular', icon:'🏚️', desc:'Fully clear 25 dungeons.', cond:{type:'achv',id:'tr_dungeon_5'} },
  { id:'t_tr_dungeon_6', label:'Dungeon Lord', icon:'🏚️', desc:'Fully clear 50 dungeons.', cond:{type:'achv',id:'tr_dungeon_6'} },
  { id:'t_tr_dungeon_7', label:'Architect of Ruin', icon:'🏚️', desc:'Fully clear 80 dungeons.', cond:{type:'achv',id:'tr_dungeon_7'} },
  { id:'t_tr_intim_1', label:'Stern', icon:'😤', desc:'Succeed on 5 Intimidation checks.', cond:{type:'achv',id:'tr_intim_1'} },
  { id:'t_tr_intim_2', label:'Menacing', icon:'😤', desc:'Succeed on 12 Intimidation checks.', cond:{type:'achv',id:'tr_intim_2'} },
  { id:'t_tr_intim_3', label:'Fearmonger', icon:'😤', desc:'Succeed on 25 Intimidation checks.', cond:{type:'achv',id:'tr_intim_3'} },
  { id:'t_tr_intim_4', label:'Terror of the Realm', icon:'😤', desc:'Succeed on 50 Intimidation checks.', cond:{type:'achv',id:'tr_intim_4'} },
  { id:'t_tr_intim_5', label:'Dread Lord', icon:'😤', desc:'Succeed on 100 Intimidation checks.', cond:{type:'achv',id:'tr_intim_5'} },
  { id:'t_tr_intim_6', label:'The Unkind', icon:'😤', desc:'Succeed on 200 Intimidation checks.', cond:{type:'achv',id:'tr_intim_6'} },
  { id:'t_tr_intim_7', label:'Living Nightmare', icon:'😤', desc:'Succeed on 400 Intimidation checks.', cond:{type:'achv',id:'tr_intim_7'} },
  { id:'t_tr_shift_1', label:'Shifter', icon:'🐺', desc:'Use Wild Shape or Polymorph 5 times.', cond:{type:'achv',id:'tr_shift_1'} },
  { id:'t_tr_shift_2', label:'Skinwalker', icon:'🐺', desc:'Use Wild Shape or Polymorph 15 times.', cond:{type:'achv',id:'tr_shift_2'} },
  { id:'t_tr_shift_3', label:'Mimic', icon:'🐺', desc:'Use Wild Shape or Polymorph 30 times.', cond:{type:'achv',id:'tr_shift_3'} },
  { id:'t_tr_shift_4', label:'Doppelganger', icon:'🐺', desc:'Use Wild Shape or Polymorph 60 times.', cond:{type:'achv',id:'tr_shift_4'} },
  { id:'t_tr_shift_5', label:'The Many-Faced', icon:'🐺', desc:'Use Wild Shape or Polymorph 125 times.', cond:{type:'achv',id:'tr_shift_5'} },
  { id:'t_tr_shift_6', label:'Primordial Beast', icon:'🐺', desc:'Use Wild Shape or Polymorph 250 times.', cond:{type:'achv',id:'tr_shift_6'} },
  { id:'t_tr_shift_7', label:'Nature Incarnate', icon:'🐺', desc:'Use Wild Shape or Polymorph 500 times.', cond:{type:'achv',id:'tr_shift_7'} },
  { id:'t_tr_sneak_1', label:'Cutpurse', icon:'🗡️', desc:'Land 10 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_1'} },
  { id:'t_tr_sneak_2', label:'Skulker', icon:'🗡️', desc:'Land 25 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_2'} },
  { id:'t_tr_sneak_3', label:'Ambusher', icon:'🗡️', desc:'Land 50 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_3'} },
  { id:'t_tr_sneak_4', label:'Nightblade', icon:'🗡️', desc:'Land 100 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_4'} },
  { id:'t_tr_sneak_5', label:'Ghost Blade', icon:'🗡️', desc:'Land 200 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_5'} },
  { id:'t_tr_sneak_6', label:'Prince of Shadows', icon:'🗡️', desc:'Land 400 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_6'} },
  { id:'t_tr_sneak_7', label:'Death From Nowhere', icon:'🗡️', desc:'Land 750 Sneak Attacks.', cond:{type:'achv',id:'tr_sneak_7'} },
  { id:'t_tr_conc_1', label:'Focused', icon:'🧘', desc:'Maintain concentration through damage — 10 times.', cond:{type:'achv',id:'tr_conc_1'} },
  { id:'t_tr_conc_2', label:'Unshaken', icon:'🧘', desc:'Maintain concentration through damage — 25 times.', cond:{type:'achv',id:'tr_conc_2'} },
  { id:'t_tr_conc_3', label:'Iron Will', icon:'🧘', desc:'Maintain concentration through damage — 50 times.', cond:{type:'achv',id:'tr_conc_3'} },
  { id:'t_tr_conc_4', label:'Unbreakable Mind', icon:'🧘', desc:'Maintain concentration through damage — 100 times.', cond:{type:'achv',id:'tr_conc_4'} },
  { id:'t_tr_conc_5', label:'The Undistracted', icon:'🧘', desc:'Maintain concentration through damage — 200 times.', cond:{type:'achv',id:'tr_conc_5'} },
  { id:'t_tr_conc_6', label:'Monolith of Focus', icon:'🧘', desc:'Maintain concentration through damage — 400 times.', cond:{type:'achv',id:'tr_conc_6'} },
  { id:'t_tr_conc_7', label:'The Immovable Caster', icon:'🧘', desc:'Maintain concentration through damage — 750 times.', cond:{type:'achv',id:'tr_conc_7'} },
  { id:'t_tr_peace_1', label:'Negotiator', icon:'🕊️', desc:'Resolve 1 encounter without combat.', cond:{type:'achv',id:'tr_peace_1'} },
  { id:'t_tr_peace_2', label:'Diplomat', icon:'🕊️', desc:'Resolve 3 encounters without combat.', cond:{type:'achv',id:'tr_peace_2'} },
  { id:'t_tr_peace_3', label:'Silver-tongued Saint', icon:'🕊️', desc:'Resolve 6 encounters without combat.', cond:{type:'achv',id:'tr_peace_3'} },
  { id:'t_tr_peace_4', label:'Keeper of the Peace', icon:'🕊️', desc:'Resolve 12 encounters without combat.', cond:{type:'achv',id:'tr_peace_4'} },
  { id:'t_tr_peace_5', label:'Ambassador', icon:'🕊️', desc:'Resolve 25 encounters without combat.', cond:{type:'achv',id:'tr_peace_5'} },
  { id:'t_tr_peace_6', label:'Herald of Peace', icon:'🕊️', desc:'Resolve 50 encounters without combat.', cond:{type:'achv',id:'tr_peace_6'} },
  { id:'t_tr_peace_7', label:'The Bloodless', icon:'🕊️', desc:'Resolve 80 encounters without combat.', cond:{type:'achv',id:'tr_peace_7'} },
  { id:'t_tr_quest_1', label:'Errand Boy', icon:'📋', desc:'Complete 1 quest.', cond:{type:'achv',id:'tr_quest_1'} },
  { id:'t_tr_quest_2', label:'Mercenary', icon:'📋', desc:'Complete 3 quests.', cond:{type:'achv',id:'tr_quest_2'} },
  { id:'t_tr_quest_3', label:'Adventurer', icon:'📋', desc:'Complete 7 quests.', cond:{type:'achv',id:'tr_quest_3'} },
  { id:'t_tr_quest_4', label:'Champion of the People', icon:'📋', desc:'Complete 15 quests.', cond:{type:'achv',id:'tr_quest_4'} },
  { id:'t_tr_quest_5', label:'Legendary Hero', icon:'📋', desc:'Complete 30 quests.', cond:{type:'achv',id:'tr_quest_5'} },
  { id:'t_tr_quest_6', label:'Mythical', icon:'📋', desc:'Complete 60 quests.', cond:{type:'achv',id:'tr_quest_6'} },
  { id:'t_tr_quest_7', label:'The Eternal', icon:'📋', desc:'Complete 100 quests.', cond:{type:'achv',id:'tr_quest_7'} },
  { id:'t_tr_potion_1', label:'Alchemist Apprentice', icon:'🧪', desc:'Drink 3 potions.', cond:{type:'achv',id:'tr_potion_1'} },
  { id:'t_tr_potion_2', label:'Flask Carrier', icon:'🧪', desc:'Drink 8 potions.', cond:{type:'achv',id:'tr_potion_2'} },
  { id:'t_tr_potion_3', label:'Potion Addict', icon:'🧪', desc:'Drink 15 potions.', cond:{type:'achv',id:'tr_potion_3'} },
  { id:'t_tr_potion_4', label:'The Bottomless Gullet', icon:'🧪', desc:'Drink 30 potions.', cond:{type:'achv',id:'tr_potion_4'} },
  { id:'t_tr_potion_5', label:'Human Flask', icon:'🧪', desc:'Drink 60 potions.', cond:{type:'achv',id:'tr_potion_5'} },
  { id:'t_tr_potion_6', label:'Walking Pharmacy', icon:'🧪', desc:'Drink 120 potions.', cond:{type:'achv',id:'tr_potion_6'} },
  { id:'t_tr_potion_7', label:'The Unstoppered', icon:'🧪', desc:'Drink 250 potions.', cond:{type:'achv',id:'tr_potion_7'} },
  { id:'t_tr_dsfail_1', label:'Near Miss', icon:'💔', desc:'Fail 1 death saving throw and survive.', cond:{type:'achv',id:'tr_dsfail_1'} },
  { id:'t_tr_dsfail_2', label:'Living on the Edge', icon:'💔', desc:'Fail 3 death saving throws and survive.', cond:{type:'achv',id:'tr_dsfail_2'} },
  { id:'t_tr_dsfail_3', label:'Barely Breathing', icon:'💔', desc:'Fail 6 death saving throws and survive.', cond:{type:'achv',id:'tr_dsfail_3'} },
  { id:'t_tr_dsfail_4', label:'Grim Statistics', icon:'💔', desc:'Fail 12 death saving throws and survive.', cond:{type:'achv',id:'tr_dsfail_4'} },
  { id:'t_tr_dsfail_5', label:'Refuses to Die', icon:'💔', desc:'Fail 25 death saving throws and survive.', cond:{type:'achv',id:'tr_dsfail_5'} },
  { id:'t_tr_dsfail_6', label:'Spite the Reaper', icon:'💔', desc:'Fail 50 death saving throws and survive.', cond:{type:'achv',id:'tr_dsfail_6'} },
  { id:'t_tr_dsfail_7', label:'Absurdly Alive', icon:'💔', desc:'Fail 100 death saving throws and survive.', cond:{type:'achv',id:'tr_dsfail_7'} },
  { id:'t_tr_npcfrag_1', label:'Suspect', icon:'🪓', desc:'Kill 1 friendly or neutral NPC.', cond:{type:'achv',id:'tr_npcfrag_1'} },
  { id:'t_tr_npcfrag_2', label:'Menace to Society', icon:'🪓', desc:'Kill 2 friendly or neutral NPCs.', cond:{type:'achv',id:'tr_npcfrag_2'} },
  { id:'t_tr_npcfrag_3', label:'Sociopath', icon:'🪓', desc:'Kill 4 friendly or neutral NPCs.', cond:{type:'achv',id:'tr_npcfrag_3'} },
  { id:'t_tr_npcfrag_4', label:'Chaos Agent', icon:'🪓', desc:'Kill 7 friendly or neutral NPCs.', cond:{type:'achv',id:'tr_npcfrag_4'} },
  { id:'t_tr_npcfrag_5', label:'The DM Cries', icon:'🪓', desc:'Kill 12 friendly or neutral NPCs.', cond:{type:'achv',id:'tr_npcfrag_5'} },
  { id:'t_tr_npcfrag_6', label:'Architect of Grief', icon:'🪓', desc:'Kill 20 friendly or neutral NPCs.', cond:{type:'achv',id:'tr_npcfrag_6'} },
  { id:'t_tr_npcfrag_7', label:'The Party Problem', icon:'🪓', desc:'Kill 35 friendly or neutral NPCs.', cond:{type:'achv',id:'tr_npcfrag_7'} },
  { id:'t_tr_insp_1', label:'Motivated', icon:'💡', desc:'Receive Inspiration from the DM — 1 time.', cond:{type:'achv',id:'tr_insp_1'} },
  { id:'t_tr_insp_2', label:'Crowd Pleaser', icon:'💡', desc:'Receive Inspiration from the DM — 3 times.', cond:{type:'achv',id:'tr_insp_2'} },
  { id:'t_tr_insp_3', label:'Fan Favorite', icon:'💡', desc:'Receive Inspiration from the DM — 7 times.', cond:{type:'achv',id:'tr_insp_3'} },
  { id:'t_tr_insp_4', label:'Darling of the Table', icon:'💡', desc:'Receive Inspiration from the DM — 15 times.', cond:{type:'achv',id:'tr_insp_4'} },
  { id:'t_tr_insp_5', label:'The DM Approves', icon:'💡', desc:'Receive Inspiration from the DM — 30 times.', cond:{type:'achv',id:'tr_insp_5'} },
  { id:'t_tr_insp_6', label:'Method Actor', icon:'💡', desc:'Receive Inspiration from the DM — 60 times.', cond:{type:'achv',id:'tr_insp_6'} },
  { id:'t_tr_insp_7', label:'The DM\'s Favorite', icon:'💡', desc:'Receive Inspiration from the DM — 100 times.', cond:{type:'achv',id:'tr_insp_7'} },
  { id:'t_tr_smite_1', label:'Righteous', icon:'⚡', desc:'Use Divine Smite 10 times.', cond:{type:'achv',id:'tr_smite_1'} },
  { id:'t_tr_smite_2', label:'Smiter', icon:'⚡', desc:'Use Divine Smite 25 times.', cond:{type:'achv',id:'tr_smite_2'} },
  { id:'t_tr_smite_3', label:'Crusader', icon:'⚡', desc:'Use Divine Smite 50 times.', cond:{type:'achv',id:'tr_smite_3'} },
  { id:'t_tr_smite_4', label:'Holy Warrior', icon:'⚡', desc:'Use Divine Smite 100 times.', cond:{type:'achv',id:'tr_smite_4'} },
  { id:'t_tr_smite_5', label:'Wrath of the Divine', icon:'⚡', desc:'Use Divine Smite 200 times.', cond:{type:'achv',id:'tr_smite_5'} },
  { id:'t_tr_smite_6', label:'Avatar of Judgement', icon:'⚡', desc:'Use Divine Smite 400 times.', cond:{type:'achv',id:'tr_smite_6'} },
  { id:'t_tr_smite_7', label:'The Eternal Oath', icon:'⚡', desc:'Use Divine Smite 750 times.', cond:{type:'achv',id:'tr_smite_7'} },
  { id:'t_tr_flank_1', label:'Flanker', icon:'🎯', desc:'Gain advantage through flanking or positioning — 10 times.', cond:{type:'achv',id:'tr_flank_1'} },
  { id:'t_tr_flank_2', label:'Tactician', icon:'🎯', desc:'Gain advantage through flanking or positioning — 25 times.', cond:{type:'achv',id:'tr_flank_2'} },
  { id:'t_tr_flank_3', label:'Strategist', icon:'🎯', desc:'Gain advantage through flanking or positioning — 50 times.', cond:{type:'achv',id:'tr_flank_3'} },
  { id:'t_tr_flank_4', label:'Field Commander', icon:'🎯', desc:'Gain advantage through flanking or positioning — 100 times.', cond:{type:'achv',id:'tr_flank_4'} },
  { id:'t_tr_flank_5', label:'Battlefield Genius', icon:'🎯', desc:'Gain advantage through flanking or positioning — 200 times.', cond:{type:'achv',id:'tr_flank_5'} },
  { id:'t_tr_flank_6', label:'Grand Marshal', icon:'🎯', desc:'Gain advantage through flanking or positioning — 400 times.', cond:{type:'achv',id:'tr_flank_6'} },
  { id:'t_tr_flank_7', label:'The Unchessable', icon:'🎯', desc:'Gain advantage through flanking or positioning — 750 times.', cond:{type:'achv',id:'tr_flank_7'} },
  { id:'t_tr_ritual_1', label:'Acolyte of the Rite', icon:'🕯️', desc:'Cast 1 ritual spell.', cond:{type:'achv',id:'tr_ritual_1'} },
  { id:'t_tr_ritual_2', label:'Ritualist', icon:'🕯️', desc:'Cast 4 ritual spells.', cond:{type:'achv',id:'tr_ritual_2'} },
  { id:'t_tr_ritual_3', label:'Ceremonialist', icon:'🕯️', desc:'Cast 8 ritual spells.', cond:{type:'achv',id:'tr_ritual_3'} },
  { id:'t_tr_ritual_4', label:'Keeper of Old Words', icon:'🕯️', desc:'Cast 15 ritual spells.', cond:{type:'achv',id:'tr_ritual_4'} },
  { id:'t_tr_ritual_5', label:'High Priest of Form', icon:'🕯️', desc:'Cast 30 ritual spells.', cond:{type:'achv',id:'tr_ritual_5'} },
  { id:'t_tr_ritual_6', label:'Ancient Practitioner', icon:'🕯️', desc:'Cast 60 ritual spells.', cond:{type:'achv',id:'tr_ritual_6'} },
  { id:'t_tr_ritual_7', label:'The Rituarch', icon:'🕯️', desc:'Cast 120 ritual spells.', cond:{type:'achv',id:'tr_ritual_7'} },
  { id:'t_tr_mountdie_1', label:'Bad Rider', icon:'🐴', desc:'Get 1 mount killed.', cond:{type:'achv',id:'tr_mountdie_1'} },
  { id:'t_tr_mountdie_2', label:'Horse Hazard', icon:'🐴', desc:'Get 2 mounts killed.', cond:{type:'achv',id:'tr_mountdie_2'} },
  { id:'t_tr_mountdie_3', label:'Serial Mount Killer', icon:'🐴', desc:'Get 3 mounts killed.', cond:{type:'achv',id:'tr_mountdie_3'} },
  { id:'t_tr_mountdie_4', label:'Horse Murderer', icon:'🐴', desc:'Get 5 mounts killed.', cond:{type:'achv',id:'tr_mountdie_4'} },
  { id:'t_tr_mountdie_5', label:'The Glue Factory', icon:'🐴', desc:'Get 8 mounts killed.', cond:{type:'achv',id:'tr_mountdie_5'} },
  { id:'t_tr_mountdie_6', label:'Equine Catastrophe', icon:'🐴', desc:'Get 12 mounts killed.', cond:{type:'achv',id:'tr_mountdie_6'} },
  { id:'t_tr_mountdie_7', label:'Why Bother Walking', icon:'🐴', desc:'Get 20 mounts killed.', cond:{type:'achv',id:'tr_mountdie_7'} },
  { id:'t_tr_ff_1', label:'Clumsy', icon:'💣', desc:'Hit a party member with an attack or spell — 1 time.', cond:{type:'achv',id:'tr_ff_1'} },
  { id:'t_tr_ff_2', label:'Liability', icon:'💣', desc:'Hit a party member with an attack or spell — 2 times.', cond:{type:'achv',id:'tr_ff_2'} },
  { id:'t_tr_ff_3', label:'Team Hazard', icon:'💣', desc:'Hit a party member with an attack or spell — 4 times.', cond:{type:'achv',id:'tr_ff_3'} },
  { id:'t_tr_ff_4', label:'The Party\'s Worst Enemy', icon:'💣', desc:'Hit a party member with an attack or spell — 7 times.', cond:{type:'achv',id:'tr_ff_4'} },
  { id:'t_tr_ff_5', label:'I Swear It Was An Accident', icon:'💣', desc:'Hit a party member with an attack or spell — 12 times.', cond:{type:'achv',id:'tr_ff_5'} },
  { id:'t_tr_ff_6', label:'Walking Incident Report', icon:'💣', desc:'Hit a party member with an attack or spell — 20 times.', cond:{type:'achv',id:'tr_ff_6'} },
  { id:'t_tr_ff_7', label:'The Fireball Guy', icon:'💣', desc:'Hit a party member with an attack or spell — 35 times.', cond:{type:'achv',id:'tr_ff_7'} },
  { id:'t_tr_srest_1', label:'Five Minute Break', icon:'☕', desc:'Take 5 short rests.', cond:{type:'achv',id:'tr_srest_1'} },
  { id:'t_tr_srest_2', label:'Coffee Addict', icon:'☕', desc:'Take 15 short rests.', cond:{type:'achv',id:'tr_srest_2'} },
  { id:'t_tr_srest_3', label:'Professional Napper', icon:'☕', desc:'Take 30 short rests.', cond:{type:'achv',id:'tr_srest_3'} },
  { id:'t_tr_srest_4', label:'The Ten Minute Hero', icon:'☕', desc:'Take 60 short rests.', cond:{type:'achv',id:'tr_srest_4'} },
  { id:'t_tr_srest_5', label:'Warlord of Naps', icon:'☕', desc:'Take 125 short rests.', cond:{type:'achv',id:'tr_srest_5'} },
  { id:'t_tr_srest_6', label:'Warlock Enjoyer', icon:'☕', desc:'Take 250 short rests.', cond:{type:'achv',id:'tr_srest_6'} },
  { id:'t_tr_srest_7', label:'What Is a Long Rest?', icon:'☕', desc:'Take 500 short rests.', cond:{type:'achv',id:'tr_srest_7'} },
  { id:'t_tr_ration_1', label:'Peckish', icon:'🍖', desc:'Consume 5 rations or meals.', cond:{type:'achv',id:'tr_ration_1'} },
  { id:'t_tr_ration_2', label:'Hungry Adventurer', icon:'🍖', desc:'Consume 15 rations or meals.', cond:{type:'achv',id:'tr_ration_2'} },
  { id:'t_tr_ration_3', label:'Road Food Connoisseur', icon:'🍖', desc:'Consume 30 rations or meals.', cond:{type:'achv',id:'tr_ration_3'} },
  { id:'t_tr_ration_4', label:'The Bottomless Pit', icon:'🍖', desc:'Consume 60 rations or meals.', cond:{type:'achv',id:'tr_ration_4'} },
  { id:'t_tr_ration_5', label:'Eternal Hunger', icon:'🍖', desc:'Consume 100 rations or meals.', cond:{type:'achv',id:'tr_ration_5'} },
  { id:'t_tr_ration_6', label:'The Bottomless Stomach', icon:'🍖', desc:'Consume 200 rations or meals.', cond:{type:'achv',id:'tr_ration_6'} },
  { id:'t_tr_ration_7', label:'Who Needs Survival?', icon:'🍖', desc:'Consume 400 rations or meals.', cond:{type:'achv',id:'tr_ration_7'} },
  { id:'t_tr_lang_1', label:'Tourist', icon:'💬', desc:'Learn 2 languages.', cond:{type:'achv',id:'tr_lang_1'} },
  { id:'t_tr_lang_2', label:'Traveler', icon:'💬', desc:'Learn 3 languages.', cond:{type:'achv',id:'tr_lang_2'} },
  { id:'t_tr_lang_3', label:'Linguist', icon:'💬', desc:'Learn 4 languages.', cond:{type:'achv',id:'tr_lang_3'} },
  { id:'t_tr_lang_4', label:'Interpreter', icon:'💬', desc:'Learn 6 languages.', cond:{type:'achv',id:'tr_lang_4'} },
  { id:'t_tr_lang_5', label:'Diplomat of Tongues', icon:'💬', desc:'Learn 8 languages.', cond:{type:'achv',id:'tr_lang_5'} },
  { id:'t_tr_lang_6', label:'The Rosetta Stone', icon:'💬', desc:'Learn 10 languages.', cond:{type:'achv',id:'tr_lang_6'} },
  { id:'t_tr_lang_7', label:'Speaks for Everyone', icon:'💬', desc:'Learn 13 languages.', cond:{type:'achv',id:'tr_lang_7'} },
  { id:'t_tr_disguise_1', label:'Costume Wearer', icon:'🎭', desc:'Succeed on 1 disguise or impersonation check.', cond:{type:'achv',id:'tr_disguise_1'} },
  { id:'t_tr_disguise_2', label:'Understudy', icon:'🎭', desc:'Succeed on 3 disguise or impersonation checks.', cond:{type:'achv',id:'tr_disguise_2'} },
  { id:'t_tr_disguise_3', label:'Method Actor', icon:'🎭', desc:'Succeed on 6 disguise or impersonation checks.', cond:{type:'achv',id:'tr_disguise_3'} },
  { id:'t_tr_disguise_4', label:'Master of Faces', icon:'🎭', desc:'Succeed on 12 disguise or impersonation checks.', cond:{type:'achv',id:'tr_disguise_4'} },
  { id:'t_tr_disguise_5', label:'The Faceless', icon:'🎭', desc:'Succeed on 20 disguise or impersonation checks.', cond:{type:'achv',id:'tr_disguise_5'} },
  { id:'t_tr_disguise_6', label:'No One Knows My Name', icon:'🎭', desc:'Succeed on 35 disguise or impersonation checks.', cond:{type:'achv',id:'tr_disguise_6'} },
  { id:'t_tr_disguise_7', label:'Who Even Am I?', icon:'🎭', desc:'Succeed on 60 disguise or impersonation checks.', cond:{type:'achv',id:'tr_disguise_7'} },
  { id:'t_tr_ally_1', label:'Friend of a Friend', icon:'🤝', desc:'Form an alliance with 1 faction or group.', cond:{type:'achv',id:'tr_ally_1'} },
  { id:'t_tr_ally_2', label:'Networker', icon:'🤝', desc:'Form alliances with 2 factions or groups.', cond:{type:'achv',id:'tr_ally_2'} },
  { id:'t_tr_ally_3', label:'Schemer', icon:'🤝', desc:'Form alliances with 4 factions or groups.', cond:{type:'achv',id:'tr_ally_3'} },
  { id:'t_tr_ally_4', label:'Power Broker', icon:'🤝', desc:'Form alliances with 7 factions or groups.', cond:{type:'achv',id:'tr_ally_4'} },
  { id:'t_tr_ally_5', label:'Master Diplomat', icon:'🤝', desc:'Form alliances with 12 factions or groups.', cond:{type:'achv',id:'tr_ally_5'} },
  { id:'t_tr_ally_6', label:'The Kingmaker', icon:'🤝', desc:'Form alliances with 20 factions or groups.', cond:{type:'achv',id:'tr_ally_6'} },
  { id:'t_tr_ally_7', label:'Web of the World', icon:'🤝', desc:'Form alliances with 35 factions or groups.', cond:{type:'achv',id:'tr_ally_7'} },
  { id:'t_tr_rage_1', label:'Irritable', icon:'😡', desc:'Enter a Barbarian rage — 5 times.', cond:{type:'achv',id:'tr_rage_1'} },
  { id:'t_tr_rage_2', label:'Hot-Headed', icon:'😡', desc:'Enter a Barbarian rage — 15 times.', cond:{type:'achv',id:'tr_rage_2'} },
  { id:'t_tr_rage_3', label:'Berserker', icon:'😡', desc:'Enter a Barbarian rage — 30 times.', cond:{type:'achv',id:'tr_rage_3'} },
  { id:'t_tr_rage_4', label:'Always Angry', icon:'😡', desc:'Enter a Barbarian rage — 60 times.', cond:{type:'achv',id:'tr_rage_4'} },
  { id:'t_tr_rage_5', label:'The Eternal Tantrum', icon:'😡', desc:'Enter a Barbarian rage — 125 times.', cond:{type:'achv',id:'tr_rage_5'} },
  { id:'t_tr_rage_6', label:'Rage Is My Resting State', icon:'😡', desc:'Enter a Barbarian rage — 250 times.', cond:{type:'achv',id:'tr_rage_6'} },
  { id:'t_tr_rage_7', label:'Born Furious', icon:'😡', desc:'Enter a Barbarian rage — 500 times.', cond:{type:'achv',id:'tr_rage_7'} },
  { id:'t_tr_rules_1', label:'That Guy', icon:'📖', desc:'Cite a rule at the table — 3 times.', cond:{type:'achv',id:'tr_rules_1'} },
  { id:'t_tr_rules_2', label:'Pedant', icon:'📖', desc:'Cite a rule at the table — 10 times.', cond:{type:'achv',id:'tr_rules_2'} },
  { id:'t_tr_rules_3', label:'Book Thumper', icon:'📖', desc:'Cite a rule at the table — 20 times.', cond:{type:'achv',id:'tr_rules_3'} },
  { id:'t_tr_rules_4', label:'The Rules Lawyer', icon:'📖', desc:'Cite a rule at the table — 40 times.', cond:{type:'achv',id:'tr_rules_4'} },
  { id:'t_tr_rules_5', label:'Crawford Apologist', icon:'📖', desc:'Cite a rule at the table — 80 times.', cond:{type:'achv',id:'tr_rules_5'} },
  { id:'t_tr_rules_6', label:'Walking PHB', icon:'📖', desc:'Cite a rule at the table — 150 times.', cond:{type:'achv',id:'tr_rules_6'} },
  { id:'t_tr_rules_7', label:'The DM Hates You', icon:'📖', desc:'Cite a rule at the table — 300 times.', cond:{type:'achv',id:'tr_rules_7'} },
  { id:'t_tr_help_1', label:'Sidekick', icon:'🙌', desc:'Use the Help action — 5 times.', cond:{type:'achv',id:'tr_help_1'} },
  { id:'t_tr_help_2', label:'Wingman', icon:'🙌', desc:'Use the Help action — 15 times.', cond:{type:'achv',id:'tr_help_2'} },
  { id:'t_tr_help_3', label:'Reliable Ally', icon:'🙌', desc:'Use the Help action — 30 times.', cond:{type:'achv',id:'tr_help_3'} },
  { id:'t_tr_help_4', label:'Team Player', icon:'🙌', desc:'Use the Help action — 60 times.', cond:{type:'achv',id:'tr_help_4'} },
  { id:'t_tr_help_5', label:'The Selfless', icon:'🙌', desc:'Use the Help action — 125 times.', cond:{type:'achv',id:'tr_help_5'} },
  { id:'t_tr_help_6', label:'Guardian of the Party', icon:'🙌', desc:'Use the Help action — 250 times.', cond:{type:'achv',id:'tr_help_6'} },
  { id:'t_tr_help_7', label:'We Could Not Have Done It Without You', icon:'🙌', desc:'Use the Help action — 500 times.', cond:{type:'achv',id:'tr_help_7'} },
  { id:'t_tr_counter_1', label:'The Interrupter', icon:'🚫', desc:'Successfully counterspell 1 time.', cond:{type:'achv',id:'tr_counter_1'} },
  { id:'t_tr_counter_2', label:'Spell Blocker', icon:'🚫', desc:'Successfully counterspell 4 times.', cond:{type:'achv',id:'tr_counter_2'} },
  { id:'t_tr_counter_3', label:'Anti-Magic', icon:'🚫', desc:'Successfully counterspell 8 times.', cond:{type:'achv',id:'tr_counter_3'} },
  { id:'t_tr_counter_4', label:'Arcane Nullifier', icon:'🚫', desc:'Successfully counterspell 18 times.', cond:{type:'achv',id:'tr_counter_4'} },
  { id:'t_tr_counter_5', label:'The Killjoy', icon:'🚫', desc:'Successfully counterspell 35 times.', cond:{type:'achv',id:'tr_counter_5'} },
  { id:'t_tr_counter_6', label:'Spell Reaper', icon:'🚫', desc:'Successfully counterspell 70 times.', cond:{type:'achv',id:'tr_counter_6'} },
  { id:'t_tr_counter_7', label:'No Casting In My Presence', icon:'🚫', desc:'Successfully counterspell 150 times.', cond:{type:'achv',id:'tr_counter_7'} },
  { id:'t_tr_escape_1', label:'Slippery', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 3 times.', cond:{type:'achv',id:'tr_escape_1'} },
  { id:'t_tr_escape_2', label:'Greased Pig', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 8 times.', cond:{type:'achv',id:'tr_escape_2'} },
  { id:'t_tr_escape_3', label:'The Houdini', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 15 times.', cond:{type:'achv',id:'tr_escape_3'} },
  { id:'t_tr_escape_4', label:'Uncatchable', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 30 times.', cond:{type:'achv',id:'tr_escape_4'} },
  { id:'t_tr_escape_5', label:'The Unshackled', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 60 times.', cond:{type:'achv',id:'tr_escape_5'} },
  { id:'t_tr_escape_6', label:'Born Free', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 125 times.', cond:{type:'achv',id:'tr_escape_6'} },
  { id:'t_tr_escape_7', label:'You Cannot Hold Me', icon:'🏃', desc:'Escape a grapple, restraint, or magical effect — 250 times.', cond:{type:'achv',id:'tr_escape_7'} },
  { id:'t_tr_bonus_1', label:'Quick Draw', icon:'⚡', desc:'Use a bonus action in combat — 25 times.', cond:{type:'achv',id:'tr_bonus_1'} },
  { id:'t_tr_bonus_2', label:'Two Things At Once', icon:'⚡', desc:'Use a bonus action in combat — 75 times.', cond:{type:'achv',id:'tr_bonus_2'} },
  { id:'t_tr_bonus_3', label:'Efficiency Expert', icon:'⚡', desc:'Use a bonus action in combat — 150 times.', cond:{type:'achv',id:'tr_bonus_3'} },
  { id:'t_tr_bonus_4', label:'Action Economy Lord', icon:'⚡', desc:'Use a bonus action in combat — 300 times.', cond:{type:'achv',id:'tr_bonus_4'} },
  { id:'t_tr_bonus_5', label:'The DM Sighs', icon:'⚡', desc:'Use a bonus action in combat — 600 times.', cond:{type:'achv',id:'tr_bonus_5'} },
  { id:'t_tr_bonus_6', label:'Optimizer', icon:'⚡', desc:'Use a bonus action in combat — 1,000 times.', cond:{type:'achv',id:'tr_bonus_6'} },
  { id:'t_tr_bonus_7', label:'Understands the Rules Better Than the DM', icon:'⚡', desc:'Use a bonus action in combat — 2,000 times.', cond:{type:'achv',id:'tr_bonus_7'} },
];

function _getTitleCondMet(title, unlocked, countTotal) {
  var c = title.cond;
  if (c.type === 'count') return countTotal >= c.min;
  if (c.type === 'achv')  return !!unlocked[c.id];
  if (c.type === 'cat') {
    var n = ACHIEVEMENTS.filter(function(a){ return a.cat === c.cat && unlocked[a.id]; }).length;
    return n >= c.min;
  }
  return false;
}

function getUnlockedTitles() {
  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  return TITLES.filter(function(t){ return _getTitleCondMet(t, achvUnlocked, count); });
}

function getActiveTitle() {
  var saved = localStorage.getItem('dnd_active_title');
  return saved || null;
}

function setActiveTitle(titleId) {
  if (titleId === null) { localStorage.removeItem('dnd_active_title'); }
  else { localStorage.setItem('dnd_active_title', titleId); }
  renderTitleBadge();
  renderRewardsPanel();
}

function renderTitleBadge() {
  var el = document.getElementById('charTitleBadge');
  if (!el) return;
  var activeId = getActiveTitle();
  if (!activeId) { el.style.display = 'none'; el.textContent = ''; return; }
  var title = TITLES.find(function(t){ return t.id === activeId; });
  if (!title) { el.style.display = 'none'; return; }
  el.style.display = 'inline-flex';
  el.textContent = title.icon + ' ' + title.label;
}

// ── 2. AURAS ──
var AURA_DEFS = [
  { id:'aura_myth',       label:'Mythic Radiance',    minCount:200, color:'#00e5ff', color2:'#ffffff', type:'myth'      },
  { id:'aura_legend',     label:'Legendary Aura',     minCount:130, color:'#a855f7', color2:'#ffd700', type:'legend'    },
  { id:'aura_hero',       label:'Heroic Radiance',    minCount:80,  color:'#f59e0b', color2:'#ff8c00', type:'hero'      },
  { id:'aura_champion',   label:'Champion\'s Glow',   minCount:40,  color:'#fbbf24', color2:'#92400e', type:'champion'  },
  { id:'aura_combat',     label:'Battle-Hardened',    catReq:{cat:'Combat',     min:15}, color:'#ef4444', color2:'#7f1d1d', type:'fire'      },
  { id:'aura_explorer',   label:'Wanderer\'s Light',  catReq:{cat:'Exploration', min:8}, color:'#22c55e', color2:'#14532d', type:'nature'    },
  { id:'aura_loot',       label:'Fortune\'s Gleam',   catReq:{cat:'Loot',       min:10}, color:'#d4af37', color2:'#78350f', type:'gold'      },
  { id:'aura_class',      label:'Arcane Mastery',     catReq:{cat:'Class',      min:20}, color:'#818cf8', color2:'#1e1b4b', type:'arcane'    },
  { id:'aura_kills',      label:'Blood-Soaked',        catReq:{cat:'Kills',      min:15}, color:'#dc2626', color2:'#7f1d1d', type:'fire'      },
  { id:'aura_survival',   label:'Death-Defying',       catReq:{cat:'Survival',   min:15}, color:'#6366f1', color2:'#1e1b4b', type:'arcane'    },
  { id:'aura_politics',   label:'Regal Presence',      catReq:{cat:'Politics',   min:10}, color:'#d4af37', color2:'#78350f', type:'gold'      },
  { id:'aura_shenanigan', label:'Chaos Incarnate',     catReq:{cat:'Shenanigans',min:15}, color:'#f97316', color2:'#431407', type:'champion'  },
  { id:'aura_dice',       label:'Dice Blessed',        catReq:{cat:'Dice',       min:20}, color:'#34d399', color2:'#064e3b', type:'nature'    },
];

function getBestAura() {
  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  // Check forced active aura first
  var forced = localStorage.getItem('dnd_active_aura');
  // Find all eligible auras
  var eligible = AURA_DEFS.filter(function(a) {
    if (a.minCount && count < a.minCount) return false;
    if (a.catReq) {
      var n = ACHIEVEMENTS.filter(function(x){ return x.cat === a.catReq.cat && achvUnlocked[x.id]; }).length;
      if (n < a.catReq.min) return false;
    }
    return true;
  });
  if (!eligible.length) return null;
  if (forced === 'none') return null; // user explicitly removed aura
  if (forced) {
    var f = eligible.find(function(a){ return a.id === forced; });
    if (f) return f;
  }
  return eligible[0]; // highest priority first
}

function setActiveAura(auraId) {
  if (auraId === null) {
    // Store sentinel 'none' so getBestAura knows user explicitly disabled aura
    localStorage.setItem('dnd_active_aura', 'none');
  } else {
    localStorage.setItem('dnd_active_aura', auraId);
  }
  renderPortraitAura();
  renderRewardsPanel();
}

// ══════════════════════════════════════════════════════════
//  AURA RENDERER — portrait canvas + full-page sheet glow
// ══════════════════════════════════════════════════════════
var _auraAnimFrame = null;
var _auraCanvas    = null;
var _auraCtx       = null;
var _sheetCanvas   = null;
var _sheetCtx      = null;
var _auraTick      = 0;

function renderPortraitAura() {
  if (_auraAnimFrame) { cancelAnimationFrame(_auraAnimFrame); _auraAnimFrame = null; }
  _auraTick = 0;

  // ── 1. Portrait canvas ──
  var wrapper = document.getElementById('portraitFrameWrapper');
  var old = document.getElementById('portraitAuraCanvas');
  if (old) old.remove();

  // ── 2. Sheet border canvas ──
  var oldSheet = document.getElementById('sheetAuraCanvas');
  if (oldSheet) oldSheet.remove();
  // Also kill any leftover CSS class glow
  document.body.classList.remove('aura-active');
  document.body.removeAttribute('data-aura-type');

  var aura = getBestAura();
  if (!aura || !wrapper) return;

  // ── Portrait canvas setup ──
  var pc = document.createElement('canvas');
  pc.id = 'portraitAuraCanvas';
  pc.style.cssText = 'position:absolute;inset:-32px;width:calc(100% + 64px);height:calc(100% + 64px);pointer-events:none;z-index:0;border-radius:inherit;';
  wrapper.insertBefore(pc, wrapper.firstChild);
  _auraCanvas = pc;
  _auraCtx    = pc.getContext('2d');

  function resizePortrait() {
    pc.width  = wrapper.offsetWidth  + 64;
    pc.height = wrapper.offsetHeight + 64;
  }
  resizePortrait();

  // ── Sheet border canvas setup ──
  var sc = document.createElement('canvas');
  sc.id = 'sheetAuraCanvas';
  sc.style.cssText = [
    'position:fixed',
    'inset:0',
    'width:100vw',
    'height:100vh',
    'pointer-events:none',
    'z-index:9999',
  ].join(';');
  document.body.appendChild(sc);
  _sheetCanvas = sc;
  _sheetCtx    = sc.getContext('2d');

  // Mark body so CSS can optionally react
  document.body.setAttribute('data-aura-type', aura.type);
  document.body.classList.add('aura-active');

  function resizeSheet() {
    sc.width  = window.innerWidth;
    sc.height = window.innerHeight;
  }
  resizeSheet();
  window.addEventListener('resize', function() { resizePortrait(); resizeSheet(); });

  function loop() {
    _auraTick++;
    // Portrait
    _auraCtx.clearRect(0, 0, pc.width, pc.height);
    _drawAura(aura, pc, _auraCtx, _auraTick);
    // Sheet border
    _sheetCtx.clearRect(0, 0, sc.width, sc.height);
    _drawSheetAura(aura, sc, _sheetCtx, _auraTick);
    _auraAnimFrame = requestAnimationFrame(loop);
  }
  loop();
}

// ── Full-page border aura renderer — subtle edge glow only ──
function _drawSheetAura(aura, c, ctx, tick) {
  var W = c.width, H = c.height;
  var type = aura.type;
  var rgb  = _hexToRgbArr(aura.color);
  var r = rgb[0], g = rgb[1], b = rgb[2];

  // Very slow breath — ~8s cycle
  var breath = 0.5 + 0.5 * Math.sin(tick * 0.012);

  // Myth: intense cyan+white pulse; Legend: rainbow hue cycle
  if (type === 'myth') {
    r = Math.round(0   + 200 * Math.abs(Math.sin(tick * 0.008)));
    g = Math.round(180 + 75  * Math.sin(tick * 0.010 + 1.0));
    b = 255;
  } else if (type === 'legend') {
    r = Math.round(128 + 127 * Math.sin(tick * 0.012));
    g = Math.round(128 + 127 * Math.sin(tick * 0.012 + 2.1));
    b = Math.round(128 + 127 * Math.sin(tick * 0.012 + 4.2));
  }

  // Base alpha — keep it very subtle, just a whisper of colour
  var alpha = (type === 'myth') ? (0.08 + 0.04 * breath) : (0.05 + 0.03 * breath);
  // Edge thickness
  var thick = (type === 'myth') ? 100 : 80;

  // Top edge
  var gt = ctx.createLinearGradient(0, 0, 0, thick);
  gt.addColorStop(0,   'rgba('+r+','+g+','+b+','+alpha+')');
  gt.addColorStop(1,   'rgba('+r+','+g+','+b+',0)');
  ctx.fillStyle = gt; ctx.fillRect(0, 0, W, thick);

  // Bottom edge
  var gbm = ctx.createLinearGradient(0, H, 0, H - thick);
  gbm.addColorStop(0,  'rgba('+r+','+g+','+b+','+alpha+')');
  gbm.addColorStop(1,  'rgba('+r+','+g+','+b+',0)');
  ctx.fillStyle = gbm; ctx.fillRect(0, H - thick, W, thick);

  // Left edge
  var gl = ctx.createLinearGradient(0, 0, thick, 0);
  gl.addColorStop(0,   'rgba('+r+','+g+','+b+','+alpha+')');
  gl.addColorStop(1,   'rgba('+r+','+g+','+b+',0)');
  ctx.fillStyle = gl; ctx.fillRect(0, 0, thick, H);

  // Right edge
  var grr = ctx.createLinearGradient(W, 0, W - thick, 0);
  grr.addColorStop(0,  'rgba('+r+','+g+','+b+','+alpha+')');
  grr.addColorStop(1,  'rgba('+r+','+g+','+b+',0)');
  ctx.fillStyle = grr; ctx.fillRect(W - thick, 0, thick, H);
}

// Helper — hex string to [r,g,b] array
function _hexToRgbArr(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
  return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
}

function _drawAura(aura, c, ctx, tick) {
  var cx = c.width * 0.5;
  var cy = c.height * 0.5;
  var type = aura.type;
  var col  = aura.color;
  var col2 = aura.color2;

  // All auras share the same base approach:
  // 1. A soft radial glow behind the portrait (very low opacity, slow pulse)
  // 2. A ring of slow-moving light traces around the border
  // 3. Optionally a secondary colour shimmer

  var slowPulse  = 0.5 + 0.5 * Math.sin(tick * 0.018);   // ~6s cycle
  var midPulse   = 0.5 + 0.5 * Math.sin(tick * 0.028);   // ~3.7s cycle
  var innerR = Math.min(cx, cy) * 0.55;
  var outerR = Math.min(cx, cy) * 0.92;

  if (type === 'myth') {
    // ── MYTHIC: Cosmic void — cyan core + starfield + triple counter-rotating rings ──
    var cyanPulse  = 0.5 + 0.5 * Math.sin(tick * 0.022);
    var whitePulse = 0.5 + 0.5 * Math.sin(tick * 0.031 + 1.5);
    var starburst  = 0.5 + 0.5 * Math.sin(tick * 0.041 + 0.8);

    // 1. Deep void radial gradient — cyan core fading to white at edge
    var voidGr = ctx.createRadialGradient(cx, cy, innerR * 0.1, cx, cy, outerR * 1.15);
    voidGr.addColorStop(0,    'rgba(0,229,255,'   + (0.08 + 0.05 * cyanPulse)  + ')');
    voidGr.addColorStop(0.3,  'rgba(0,180,220,'   + (0.04 + 0.02 * midPulse)   + ')');
    voidGr.addColorStop(0.65, 'rgba(200,240,255,' + (0.02 + 0.01 * whitePulse) + ')');
    voidGr.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = voidGr;
    ctx.fillRect(0, 0, c.width, c.height);

    // 2. Three rings: outer CW (12 nodes), middle CCW (8), inner CW (5)
    _drawAuraRing(ctx, cx, cy, innerR * 1.18,  tick * 0.008,  12, 'rgba(255,255,255,',   0.22 + 0.10 * cyanPulse,  2.5);
    _drawAuraRing(ctx, cx, cy, innerR * 1.04, -tick * 0.006,   8, 'rgba(0,229,255,',     0.28 + 0.10 * whitePulse, 3.0);
    _drawAuraRing(ctx, cx, cy, innerR * 0.88,  tick * 0.011,   5, 'rgba(180,240,255,',   0.20 + 0.12 * starburst,  3.5);

    // 3. Dual shimmering edge — white outer, cyan inner
    _drawShimmerEdge(ctx, cx, cy, innerR * 1.10,  tick,         [255,255,255], 0.18 + 0.10 * cyanPulse);
    _drawShimmerEdge(ctx, cx, cy, innerR * 0.95, -tick * 0.7,   [0,229,255],  0.14 + 0.08 * starburst);

    // 4. Twinkling starfield — 12 pseudo-random dots around portrait
    var starSeeds = [0.13,0.27,0.41,0.57,0.63,0.71,0.83,0.91,0.19,0.35,0.49,0.77];
    for (var si = 0; si < starSeeds.length; si++) {
      var sa   = starSeeds[si] * Math.PI * 2;
      var sr   = innerR * (0.5 + starSeeds[(si + 3) % starSeeds.length] * 0.75);
      var sx   = cx + Math.cos(sa) * sr;
      var sy   = cy + Math.sin(sa) * sr * 0.96;
      var stw  = 0.4 + 0.6 * Math.abs(Math.sin(tick * 0.05 + si * 1.3));
      var stGr = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
      stGr.addColorStop(0,   'rgba(255,255,255,' + (0.35 * stw) + ')');
      stGr.addColorStop(0.4, 'rgba(180,240,255,' + (0.18 * stw) + ')');
      stGr.addColorStop(1,   'rgba(0,229,255,0)');
      ctx.fillStyle = stGr;
      ctx.fillRect(sx - 6, sy - 6, 12, 12);
    }

  } else if (type === 'legend') {
    // Rainbow hue-rotating glow
    var hue = (tick * 0.5) % 360;
    _drawRadialGlow(ctx, cx, cy, outerR, 'hsla('+hue+',100%,60%,'+(0.04+0.02*slowPulse)+')', 'hsla('+((hue+160)%360)+',100%,55%,'+(0.015+0.01*midPulse)+')');
    _drawAuraRing(ctx, cx, cy, innerR * 1.05, tick * 0.006, 6, 'hsla('+hue+',100%,75%,', 0.20 + 0.10*midPulse, 2.0);
    _drawAuraRing(ctx, cx, cy, innerR * 0.92, -tick * 0.004, 4, 'hsla('+((hue+120)%360)+',100%,70%,', 0.15 + 0.08*slowPulse, 1.5);

  } else if (type === 'hero') {
    _drawRadialGlow(ctx, cx, cy, outerR, 'rgba(245,158,11,'+(0.04+0.02*slowPulse)+')', 'rgba(255,120,0,'+(0.015)+')');
    _drawAuraRing(ctx, cx, cy, innerR, tick * 0.005, 5, 'rgba(245,180,40,', 0.18 + 0.10*midPulse, 2.0);
    _drawShimmerEdge(ctx, cx, cy, innerR * 1.02, tick, [245,158,11], 0.12 + 0.07*slowPulse);

  } else if (type === 'fire') {
    _drawRadialGlow(ctx, cx, cy, outerR, 'rgba(239,68,68,'+(0.04+0.02*slowPulse)+')', 'rgba(180,20,0,'+(0.01)+')');
    _drawAuraRing(ctx, cx, cy, innerR * 0.98, tick * 0.007, 5, 'rgba(239,100,40,', 0.16 + 0.10*midPulse, 1.8);
    _drawShimmerEdge(ctx, cx, cy, innerR, tick * 1.3, [239,68,68], 0.11 + 0.07*slowPulse);

  } else if (type === 'nature') {
    _drawRadialGlow(ctx, cx, cy, outerR, 'rgba(34,197,94,'+(0.04+0.02*slowPulse)+')', 'rgba(0,120,40,'+(0.01)+')');
    _drawAuraRing(ctx, cx, cy, innerR, tick * 0.004, 6, 'rgba(60,200,100,', 0.15 + 0.08*midPulse, 1.8);
    _drawShimmerEdge(ctx, cx, cy, innerR * 0.98, -tick * 0.9, [34,197,94], 0.10 + 0.06*slowPulse);

  } else if (type === 'gold') {
    _drawRadialGlow(ctx, cx, cy, outerR, 'rgba(212,175,55,'+(0.04+0.02*slowPulse)+')', 'rgba(160,120,0,'+(0.015)+')');
    _drawAuraRing(ctx, cx, cy, innerR, tick * 0.003, 7, 'rgba(212,185,80,', 0.17 + 0.10*midPulse, 2.0);
    _drawShimmerEdge(ctx, cx, cy, innerR * 1.0, tick * 0.8, [212,175,55], 0.11 + 0.07*slowPulse);

  } else if (type === 'arcane') {
    _drawRadialGlow(ctx, cx, cy, outerR, 'rgba(129,140,248,'+(0.04+0.02*slowPulse)+')', 'rgba(60,0,160,'+(0.01)+')');
    _drawAuraRing(ctx, cx, cy, innerR * 1.0, tick * 0.005, 5, 'rgba(160,160,255,', 0.16 + 0.09*midPulse, 1.8);
    _drawAuraRing(ctx, cx, cy, innerR * 0.88, -tick * 0.003, 4, 'rgba(100,80,220,', 0.12 + 0.07*slowPulse, 1.2);

  } else { // champion
    _drawRadialGlow(ctx, cx, cy, outerR, 'rgba(251,191,36,'+(0.04+0.02*slowPulse)+')', 'rgba(180,100,0,'+(0.01)+')');
    _drawAuraRing(ctx, cx, cy, innerR, tick * 0.004, 5, 'rgba(251,200,60,', 0.15 + 0.10*midPulse, 1.8);
  }
}

// ── Aura drawing primitives ──

function _drawRadialGlow(ctx, cx, cy, r, innerColor, outerColor) {
  var gr = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
  gr.addColorStop(0, innerColor);
  gr.addColorStop(0.6, outerColor);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Smooth ring of n bright nodes tracing the portrait edge
function _drawAuraRing(ctx, cx, cy, r, angleOffset, nodeCount, colorPrefix, opacity, nodeSize) {
  var aspect = ctx.canvas.height / ctx.canvas.width; // keep it elliptical
  for (var i = 0; i < nodeCount; i++) {
    var angle = angleOffset + (i / nodeCount) * Math.PI * 2;
    // Ellipse following portrait shape
    var rx = r, ry = r * 0.96;
    var nx = cx + Math.cos(angle) * rx;
    var ny = cy + Math.sin(angle) * ry;

    // Each node fades in/out based on position (creates travelling glow effect)
    var nodePulse = 0.5 + 0.5 * Math.sin(angle * 2 + angleOffset * 3);
    var finalOpacity = opacity * nodePulse;

    // Soft glow dot — no hard edges
    var grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nodeSize * 5);
    grad.addColorStop(0,   colorPrefix + finalOpacity + ')');
    grad.addColorStop(0.4, colorPrefix + (finalOpacity * 0.4) + ')');
    grad.addColorStop(1,   colorPrefix + '0)');
    ctx.fillStyle = grad;
    ctx.fillRect(nx - nodeSize*5, ny - nodeSize*5, nodeSize*10, nodeSize*10);
  }
}

// A continuous shimmering edge line — drawn as many tiny overlapping glows
function _drawShimmerEdge(ctx, cx, cy, r, tickOffset, rgb, opacity) {
  var steps = 60;
  for (var i = 0; i < steps; i++) {
    var angle = (i / steps) * Math.PI * 2;
    var shimmer = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(angle * 3 + tickOffset * 0.04), 2);
    var nx = cx + Math.cos(angle) * r;
    var ny = cy + Math.sin(angle) * r * 0.96;
    var op = opacity * shimmer;
    var grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 7);
    grad.addColorStop(0,   'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+op+')');
    grad.addColorStop(1,   'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0)');
    ctx.fillStyle = grad;
    ctx.fillRect(nx - 7, ny - 7, 14, 14);
  }
}

// ── 3. EXCLUSIVE THEMES ──
var EXCLUSIVE_THEMES = [
  { id:'sepia_codex',   label:'Sepia Codex',    icon:'🪶',  minCount:25,  desc:'25 achievements — Ancient ink and forgotten lore.' },
  { id:'neon_dungeon',  label:'Neon Dungeon',   icon:'⚡',  minCount:50,  desc:'50 achievements — The dungeon glows electric.' },
  { id:'monochrome',    label:'Monochrome',     icon:'🎭',  minCount:75,  desc:'75 achievements — All colour stripped away.' },
  { id:'infected',      label:'Infected',       icon:'🍄',  minCount:100, desc:'100 achievements — The rot spreads.' },
  { id:'frozen_tomb',   label:'Frozen Tomb',    icon:'🧊',  minCount:125, desc:'125 achievements — Entombed in eternal ice.' },
  { id:'forge_of_ages', label:'Forge of Ages',  icon:'🔨',  minCount:150, desc:'150 achievements — Forged in the fires of eternity.' },
  { id:'the_dreaming',  label:'The Dreaming',   icon:'🌙',  minCount:175, desc:'175 achievements — Where reality dissolves into dream.' },
  { id:'obsidian',      label:'Obsidian',       icon:'🖤',  minCount:200, desc:'200 achievements — Deep black obsidian.' },
  { id:'crimsonking',   label:'Crimson King',   icon:'♛',   minCount:225, desc:'225 achievements — Blood red dominion.' },
  { id:'voidwalker',    label:'Void Walker',    icon:'🌌',  minCount:250, desc:'250 achievements — Step between worlds.' },
  { id:'celestial',     label:'Celestial',      icon:'☀️',  minCount:275, desc:'275 achievements — Touched by divinity.' },
  { id:'eldritch',      label:'Eldritch',       icon:'🐙',  minCount:300, desc:'300 achievements — Beyond comprehension.' },
  { id:'ascendant',     label:'Ascendant',      icon:'✨',  minCount:325, desc:'325 achievements — Transcend mortality.' },
  { id:'primordial',    label:'Primordial',     icon:'🌋',  minCount:350, desc:'350 achievements — Born before time itself.' },
  { id:'godslayer',     label:'Godslayer',      icon:'⚔️',  minCount:375, desc:'375 achievements — You have slain the divine.' },
  { id:'absolute',      label:'The Absolute',   icon:'♾️',  minCount:400, desc:'400 achievements — You are beyond legend.' },
];

function getUnlockedExclusiveThemes() {
  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  return EXCLUSIVE_THEMES.filter(function(t){ return count >= t.minCount; });
}

// ── Render the full rewards panel ──
function renderRewardsPanel() {
  var container = document.getElementById('achvRewardsPanel');
  if (!container) return;

  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  var activeTitle = getActiveTitle();
  var activeAura  = localStorage.getItem('dnd_active_aura');
  var unlockedTitles  = getUnlockedTitles();
  var unlockedThemes  = getUnlockedExclusiveThemes();

  // ── Collapse state ──
  var _titleOpen = localStorage.getItem('rp_titles_open') !== 'false';
  var _auraOpen  = localStorage.getItem('rp_auras_open')  !== 'false';
  var _themeOpen = localStorage.getItem('rp_themes_open') !== 'false';

  // ── TITLES section ──
  // Build a category map: title id -> source category
  var _achvById = {};
  ACHIEVEMENTS.forEach(function(a){ _achvById[a.id] = a; });
  function _getTitleCat(t) {
    if (t.cond.type === 'achv') {
      var a = _achvById[t.cond.id];
      if (a) return a.cat;
    }
    if (t.cond.type === 'count') return 'Rank';
    if (t.cond.type === 'cat')   return t.cond.cat;
    return 'Other';
  }
  // Define filter groups with icons — only show groups that have ≥1 unlocked title
  var _titleFilterGroups = [
    { key:'All',         icon:'📋' },
    { key:'Rank',        icon:'👑' },
    { key:'Combat',      icon:'⚔️' },
    { key:'Dice',        icon:'🎲' },
    { key:'Roleplay',    icon:'🎭' },
    { key:'Exploration', icon:'🗺️' },
    { key:'Survival',    icon:'🛡️' },
    { key:'Healing',     icon:'⚕️' },
    { key:'Economy',     icon:'💰' },
    { key:'Class',       icon:'🪄' },
    { key:'Kills',       icon:'💀' },
    { key:'Loot',        icon:'📦' },
    { key:'Adventure',   icon:'🐉' },
    { key:'Hidden',      icon:'👁️' },
    { key:'Race',        icon:'🧬' },
    { key:'Multiclass',  icon:'🔀' },
    { key:'Shenanigans', icon:'🤡' },
    { key:'Avengers',    icon:'🦸' },
    { key:'Politics',    icon:'⚖️' },
    { key:'Shopkeeping', icon:'🛒' },
  ];
  // Get active filter from localStorage
  var _activeTitleFilter = localStorage.getItem('rp_title_filter') || 'All';
  // Count per group
  var _titleGroupCounts = { All: unlockedTitles.length };
  unlockedTitles.forEach(function(t) {
    var c = _getTitleCat(t);
    _titleGroupCounts[c] = (_titleGroupCounts[c]||0) + 1;
  });
  // Only show groups with at least 1 unlocked title
  var _visibleGroups = _titleFilterGroups.filter(function(g){
    return g.key === 'All' || (_titleGroupCounts[g.key] && _titleGroupCounts[g.key] > 0);
  });
  // Filter titles
  var _filteredTitles = _activeTitleFilter === 'All' ? unlockedTitles
    : unlockedTitles.filter(function(t){ return _getTitleCat(t) === _activeTitleFilter; });

  var titlesContent = '';
  if (unlockedTitles.length === 0) {
    titlesContent = '<div class="rewards-empty">Earn your first achievement to unlock titles.</div>';
  } else {
    // Filter bar
    titlesContent += '<div class="title-filter-bar">';
    _visibleGroups.forEach(function(g) {
      var isActive = g.key === _activeTitleFilter;
      var cnt = _titleGroupCounts[g.key] || 0;
      titlesContent += '<button class="title-filter-pill' + (isActive ? ' active' : '') + '" '
        + 'onclick="localStorage.setItem(\'rp_title_filter\',\'' + g.key + '\');renderRewardsPanel();">'
        + '<span class="title-filter-pill-icon">' + g.icon + '</span>'
        + '<span class="title-filter-pill-label">' + g.key + '</span>'
        + '<span class="title-filter-pill-count">' + cnt + '</span>'
        + '</button>';
    });
    titlesContent += '</div>';
    // Title chips
    if (_filteredTitles.length === 0) {
      titlesContent += '<div class="rewards-empty" style="font-size:11px;">No titles in this category yet.</div>';
    } else {
      titlesContent += '<div class="rewards-title-grid">';
      _filteredTitles.forEach(function(t) {
        var active = t.id === activeTitle;
        titlesContent += '<div class="rewards-title-chip' + (active?' active':'') + '" onclick="setActiveTitle(\'' + t.id + '\')" title="' + t.desc + '">'
          + '<span>' + t.icon + '</span><span>' + t.label + '</span>'
          + (active ? '<span class="rewards-active-dot">●</span>' : '')
          + '</div>';
      });
      titlesContent += '</div>';
    }
    if (activeTitle) {
      titlesContent += '<button class="rewards-clear-btn" onclick="setActiveTitle(null)">✕ Remove title</button>';
    }
  }
  var titleHTML = '<div class="rewards-section-header" onclick="toggleRewardsSection(\'titles\')" style="cursor:pointer;user-select:none;display:flex;justify-content:space-between;align-items:center;">'
    + '<span>🏷 Titles <span style="opacity:0.5;font-size:11px;">(' + unlockedTitles.length + ' unlocked)</span></span>'
    + '<span style="font-size:10px;opacity:0.6;transition:transform 0.2s;display:inline-block;transform:rotate(' + (_titleOpen?'0':'180') + 'deg);">▲</span>'
    + '</div>'
    + '<div id="rp_titles_body" style="display:' + (_titleOpen?'block':'none') + ';">' + titlesContent + '</div>';

  // ── AURAS section ──
  var eligibleAuras = AURA_DEFS.filter(function(a) {
    if (a.minCount && count < a.minCount) return false;
    if (a.catReq) {
      var n = ACHIEVEMENTS.filter(function(x){ return x.cat===a.catReq.cat && achvUnlocked[x.id]; }).length;
      if (n < a.catReq.min) return false;
    }
    return true;
  });

  var aurasContent = '';
  if (eligibleAuras.length === 0) {
    aurasContent = '<div class="rewards-empty">Earn 20+ achievements or dominate a category to unlock auras.</div>';
  } else {
    aurasContent = '<div class="rewards-title-grid">';
    eligibleAuras.forEach(function(a) {
      var active = a.id === activeAura;
      aurasContent += '<div class="rewards-title-chip' + (active?' active':'') + '" onclick="setActiveAura(\'' + a.id + '\')" title="' + a.label + '" style="border-color:' + a.color + ';' + (active?'background:rgba('+_hexToRgbStr(a.color)+',0.2);':'') + '">'
        + '<span style="width:10px;height:10px;border-radius:50%;background:' + a.color + ';display:inline-block;box-shadow:0 0 6px ' + a.color + ';"></span>'
        + '<span>' + a.label + '</span>'
        + (active ? '<span class="rewards-active-dot" style="color:' + a.color + '">●</span>' : '')
        + '</div>';
    });
    aurasContent += '</div>';
    if (activeAura && activeAura !== 'none') {
      aurasContent += '<button class="rewards-clear-btn" onclick="setActiveAura(null)">✕ Remove aura</button>';
    }
  }
  var auraHTML = '<div class="rewards-section-header" onclick="toggleRewardsSection(\'auras\')" style="margin-top:14px;cursor:pointer;user-select:none;display:flex;justify-content:space-between;align-items:center;">'
    + '<span>✨ Auras <span style="opacity:0.5;font-size:11px;">(' + eligibleAuras.length + ' unlocked)</span></span>'
    + '<span style="font-size:10px;opacity:0.6;transition:transform 0.2s;display:inline-block;transform:rotate(' + (_auraOpen?'0':'180') + 'deg);">▲</span>'
    + '</div>'
    + '<div id="rp_auras_body" style="display:' + (_auraOpen?'block':'none') + ';">' + aurasContent + '</div>';

  // ── EXCLUSIVE THEMES section ──
  var themesContent = '<div class="rewards-title-grid">';
  EXCLUSIVE_THEMES.forEach(function(t) {
    var unlocked = count >= t.minCount;
    if (unlocked) {
      var isActive = (document.body.getAttribute('data-theme') === t.id);
      themesContent += '<div class="rewards-title-chip' + (isActive?' active':'') + '" onclick="applyTheme(\'' + t.id + '\');renderRewardsPanel();" title="' + t.desc + '">'
        + '<span>' + t.icon + '</span><span>' + t.label + '</span>'
        + (isActive ? '<span class="rewards-active-dot">●</span>' : '')
        + '</div>';
    } else {
      themesContent += '<div class="rewards-title-chip locked" title="' + t.desc + '">'
        + '<span>🔒</span><span style="opacity:0.4;">' + t.label + '</span>'
        + '<span style="font-size:9px;opacity:0.4;">' + t.minCount + ' achv</span>'
        + '</div>';
    }
  });
  themesContent += '</div>';
  var themeHTML = '<div class="rewards-section-header" onclick="toggleRewardsSection(\'themes\')" style="margin-top:14px;cursor:pointer;user-select:none;display:flex;justify-content:space-between;align-items:center;">'
    + '<span>🎨 Exclusive Themes <span style="opacity:0.5;font-size:11px;">(' + unlockedThemes.length + '/' + EXCLUSIVE_THEMES.length + ')</span></span>'
    + '<span style="font-size:10px;opacity:0.6;transition:transform 0.2s;display:inline-block;transform:rotate(' + (_themeOpen?'0':'180') + 'deg);">▲</span>'
    + '</div>'
    + '<div id="rp_themes_body" style="display:' + (_themeOpen?'block':'none') + ';">' + themesContent + '</div>';

  container.innerHTML = titleHTML + auraHTML + themeHTML;
}


function toggleRewardsSection(section) {
  var keyMap  = { titles: 'rp_titles_open', auras: 'rp_auras_open', themes: 'rp_themes_open' };
  var bodyMap = { titles: 'rp_titles_body', auras: 'rp_auras_body', themes: 'rp_themes_body' };
  var key  = keyMap[section];
  var body = document.getElementById(bodyMap[section]);
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  localStorage.setItem(key, isOpen ? 'false' : 'true');
  var header = body.previousElementSibling;
  if (header) {
    var arrow = header.querySelector('span:last-child');
    if (arrow) arrow.style.transform = 'rotate(' + (isOpen ? '180' : '0') + 'deg)';
  }
}
function _hexToRgbStr(hex) {
  hex = hex.replace('#','');
  if(hex.length===3) hex=hex.split('').map(function(c){return c+c;}).join('');
  return parseInt(hex.slice(0,2),16)+','+parseInt(hex.slice(2,4),16)+','+parseInt(hex.slice(4,6),16);
}

// Hook into updatePortraitRank to also refresh rewards + aura
var _origUpdatePortraitRank = updatePortraitRank;
updatePortraitRank = function() {
  _origUpdatePortraitRank();
  renderTitleBadge();
  renderPortraitAura();
  renderRewardsPanel();
  renderFlavorText();
  renderShowcase();
  applyStatBoxColors();
};

// Init on load
setTimeout(function() {
  renderTitleBadge();
  renderPortraitAura();
  renderRewardsPanel();
  renderFlavorText();
  renderShowcase();
  applyStatBoxColors();
}, 300);


// ═══════════════════════════════════════════════════════════════
//  REWARD: 2. FLAVOR TEXT UNDER RANK BADGE
// ═══════════════════════════════════════════════════════════════
// Small italic subtitle shown below the rank badge,
// unlocked by specific achievements or milestones.
// Player can pick any unlocked flavor text.

var FLAVOR_TEXTS = [
  // ── Rank milestones ──
  { id:'ft_beginning',  text:'"Every legend has a beginning."',       cond:{ type:'count', min:1   } },
  { id:'ft_rising',     text:'"The world will know your name."',       cond:{ type:'count', min:12  } },
  { id:'ft_forged',     text:'"Forged in fire and failure."',          cond:{ type:'count', min:25  } },
  { id:'ft_feared',     text:'"Even the gods take notice."',           cond:{ type:'count', min:80  } },
  { id:'ft_undying',    text:'"Death itself grows tired of you."',     cond:{ type:'count', min:130 } },
  { id:'ft_myth_txt',   text:'"There are no more mountains to climb."',cond:{ type:'count', min:200 } },

  // ── Specific achievement unlocks ──
  { id:'ft_godslayer',  text:'"Even gods bleed."',                     cond:{ type:'achv', id:'p_kill_deity'    } },
  { id:'ft_tarrasque',  text:'"The Tarrasque remembered your name."',  cond:{ type:'achv', id:'tarrasque'       } },
  { id:'ft_tpk',        text:'"You are the sole survivor."',           cond:{ type:'achv', id:'heartbreaking'   } },
  { id:'ft_l20',        text:'"Pure. Undiluted. Unstoppable."',        cond:{ type:'achv', id:'quite_adv'       } },
  { id:'ft_smite',      text:'"REPENT!"',                              cond:{ type:'achv', id:'c_pal_smite'     } },
  { id:'ft_railgun',    text:'"600 feet is not enough distance."',     cond:{ type:'achv', id:'c_wlk_eldritch'  } },
  { id:'ft_herring',    text:'"He used a herring!"',                   cond:{ type:'achv', id:'herring'         } },
  { id:'ft_nuclear',    text:'"Collateral damage is a suggestion."',   cond:{ type:'achv', id:'going_nuclear'   } },
  { id:'ft_filthy',     text:'"...You filthy casual."',                cond:{ type:'achv', id:'filthy_casual'   } },
  { id:'ft_dragon',     text:'"The dragon fell. You did not."',        cond:{ type:'achv', id:'classic_adv'     } },
  { id:'ft_overkill',   text:'"They never stood a chance."',           cond:{ type:'achv', id:'overkill'        } },
  { id:'ft_yoyo',       text:'"Died once. Learned nothing."',          cond:{ type:'achv', id:'yoyo'            } },
  { id:'ft_sacrifice',  text:'"Some prices are worth paying."',        cond:{ type:'achv', id:'p_sacrifice'     } },
  { id:'ft_cannibal',   text:'"Waste not, want not."',                 cond:{ type:'achv', id:'p_cannibalism'   } },
  { id:'ft_holy',       text:'"HOLY SHIT!"',                           cond:{ type:'achv', id:'holy_shit'       } },
  { id:'ft_broker',     text:'"Roll for persuasion."',                 cond:{ type:'achv', id:'lets_deal'       } },
  { id:'ft_rich',       text:'"One million gold. Roughly."',           cond:{ type:'achv', id:'capitalists'     } },

  // ── Category dominance ──
  { id:'ft_warrior',    text:'"Combat is just conversation."',         cond:{ type:'cat', cat:'Combat',      min:10 } },
  { id:'ft_explorer',   text:'"There are no roads, only directions."', cond:{ type:'cat', cat:'Exploration', min:8  } },
  { id:'ft_dice',       text:'"The dice were always on my side."',     cond:{ type:'cat', cat:'Dice',        min:15 } },
  { id:'ft_chaos',      text:'"Rules were made to be broken."',        cond:{ type:'cat', cat:'Shenanigans', min:10 } },
  { id:'ft_killer',     text:'"They all had it coming."',              cond:{ type:'cat', cat:'Kills',       min:10 } },
  { id:'ft_survivor',   text:'"Harder to kill than a cockroach."',     cond:{ type:'cat', cat:'Survival',    min:10 } },
  { id:'ft_politician', text:'"Every NPC has a price."',               cond:{ type:'cat', cat:'Politics',    min:10 } },

  // ── Easter Eggs: Anime — Kategórie ──
  // Combat 5+ → začiatok cesty bojovníka
  { id:'ft_an_cat_combat5',   text:'"A sword is only as strong as the will behind it."',               cond:{ type:'cat', cat:'Combat',      min:5  } },
  // Combat 15+ → dominancia v boji
  { id:'ft_an_cat_combat15',  text:'"My battles are not fought with strength alone. They are fought with conviction."', cond:{ type:'cat', cat:'Combat', min:15 } },
  // Combat 20+ → transcendencia
  { id:'ft_an_cat_combat20',  text:'"I have surpassed my limits so many times, I forgot I had any."',  cond:{ type:'cat', cat:'Combat',      min:20 } },
  // Survival 5+ → prežívaš všetko
  { id:'ft_an_cat_surv5',     text:'"I don\'t know the word \'give up\'."',                             cond:{ type:'cat', cat:'Survival',    min:5  } },
  // Survival 15+ → neuveriteľná odolnosť
  { id:'ft_an_cat_surv15',    text:'"No matter how many times you knock me down, I will get back up."', cond:{ type:'cat', cat:'Survival',    min:15 } },
  // Survival 20+ → legendárna húževnatosť
  { id:'ft_an_cat_surv20',    text:'"Pain is just the world\'s way of acknowledging that you exist."', cond:{ type:'cat', cat:'Survival',    min:20 } },
  // Dice 5+ → začínajúci gambler
  { id:'ft_an_cat_dice5',     text:'"The outcome has already been decided. I just haven\'t seen it yet."', cond:{ type:'cat', cat:'Dice',     min:5  } },
  // Dice 10+ → stredne pokročilý
  { id:'ft_an_cat_dice10',    text:'"Luck is just skill you haven\'t explained yet."',                  cond:{ type:'cat', cat:'Dice',        min:10 } },
  // Dice 20+ → majster hodu
  { id:'ft_an_cat_dice20',    text:'"I don\'t trust luck. I manufacture it."',                          cond:{ type:'cat', cat:'Dice',        min:20 } },
  // Kills 5+ → vrah začína
  { id:'ft_an_cat_kills5',    text:'"Hesitation is the seed of defeat."',                               cond:{ type:'cat', cat:'Kills',       min:5  } },
  // Kills 15+ → efektívny zabijak
  { id:'ft_an_cat_kills15',   text:'"I don\'t enjoy killing. But I\'m exceptionally good at it."',     cond:{ type:'cat', cat:'Kills',       min:15 } },
  // Kills 20+ → nemilosrdný
  { id:'ft_an_cat_kills20',   text:'"The path behind me is marked by those who thought I could be stopped."', cond:{ type:'cat', cat:'Kills',  min:20 } },
  // Shenanigans 5+ → chaos agent
  { id:'ft_an_cat_shen5',     text:'"Rules exist so that interesting people have something to break."', cond:{ type:'cat', cat:'Shenanigans', min:5  } },
  // Shenanigans 15+ → plný chaos
  { id:'ft_an_cat_shen15',    text:'"Is this chaos? Good. I work better in chaos."',                    cond:{ type:'cat', cat:'Shenanigans', min:15 } },
  // Exploration 5+ → dobrodruh
  { id:'ft_an_cat_expl5',     text:'"The world is wide. My legs are restless."',                        cond:{ type:'cat', cat:'Exploration', min:5  } },
  // Exploration 12+ → skutočný prieskumník
  { id:'ft_an_cat_expl12',    text:'"I don\'t get lost. I discover places no map has dared to show."', cond:{ type:'cat', cat:'Exploration', min:12 } },
  // Roleplay 5+ → herec v duši
  { id:'ft_an_cat_role5',     text:'"I am whoever the moment demands me to be."',                       cond:{ type:'cat', cat:'Roleplay',    min:5  } },
  // Roleplay 10+ → majster pretvárky
  { id:'ft_an_cat_role10',    text:'"Every face I wear is real. Some just last longer than others."',   cond:{ type:'cat', cat:'Roleplay',    min:10 } },
  // Politics 5+ → diplomat
  { id:'ft_an_cat_pol5',      text:'"Words are the sharpest blades. And I never miss."',                cond:{ type:'cat', cat:'Politics',    min:5  } },
  // Politics 15+ → manipulátor
  { id:'ft_an_cat_pol15',     text:'"I don\'t make enemies. I make future tools."',                     cond:{ type:'cat', cat:'Politics',    min:15 } },
  // Healing 5+ → záchranár
  { id:'ft_an_cat_heal5',     text:'"I will not let you fall. That is my only oath."',                  cond:{ type:'cat', cat:'Healing',     min:5  } },
  // Healing 10+ → anjelský opatrovateľ
  { id:'ft_an_cat_heal10',    text:'"Life is a gift. I refuse to let it be wasted."',                   cond:{ type:'cat', cat:'Healing',     min:10 } },
  // Race achievements 5+ → hrdosť na pôvod
  { id:'ft_an_cat_race5',     text:'"My blood is my power. Do not underestimate what flows through me."', cond:{ type:'cat', cat:'Race',      min:5  } },
  // Class achievements 5+ → majster svojej triedy
  { id:'ft_an_cat_class5',    text:'"I did not choose this path. This path chose me. And I mastered it."', cond:{ type:'cat', cat:'Class',     min:5  } },
  // Class achievements 10+ → vrchol triedy
  { id:'ft_an_cat_class10',   text:'"There is no ceiling to what I am capable of."',                    cond:{ type:'cat', cat:'Class',       min:10 } },

  // ── Easter Eggs: Anime — Počty odomknutých ──
  // 3 → prvé kroky
  { id:'ft_an_cnt3',          text:'"Even a journey of a thousand miles begins with a single step."',   cond:{ type:'count', min:3   } },
  // 8 → malý míľnik
  { id:'ft_an_cnt8',          text:'"I\'m not the main character... yet."',                              cond:{ type:'count', min:8   } },
  // 20 → prechod z nováčika
  { id:'ft_an_cnt20',         text:'"I used to be a nobody. Used to."',                                  cond:{ type:'count', min:20  } },
  // 35 → rastúca sila
  { id:'ft_an_cnt35',         text:'"My power grows with every battle. Every scar. Every loss."',        cond:{ type:'count', min:35  } },
  // 60 → polovica cesty k legende
  { id:'ft_an_cnt60',         text:'"I\'ve come too far to go back. Not that I would."',                 cond:{ type:'count', min:60  } },
  // 75 → silná postava
  { id:'ft_an_cnt75',         text:'"At some point, the monsters started being afraid of me."',          cond:{ type:'count', min:75  } },
  // 90 → blízko k legende
  { id:'ft_an_cnt90',         text:'"I don\'t peak. I evolve."',                                         cond:{ type:'count', min:90  } },
  // 110 → takmer legenda
  { id:'ft_an_cnt110',        text:'"My story is not one that fits in a history book. It rewrites them."', cond:{ type:'count', min:110 } },
  // 160 → za hranicou
  { id:'ft_an_cnt160',        text:'"Beyond the heavens, beyond the gods — this is where I live now."', cond:{ type:'count', min:160 } },
  // 180 → tesne pred mýtom
  { id:'ft_an_cnt180',        text:'"There is no word for what I am becoming."',                         cond:{ type:'count', min:180 } },

  // ── Easter Eggs: Anime ──
  // Reach level 20 → go beyond your limits
  { id:'ft_ee_plusultra',    text:'"Plus Ultra!"',                                                      cond:{ type:'achv', id:'quite_adv'          } },
  // TPK → those who kill must accept the same fate
  { id:'ft_ee_tpk2',         text:'"The only ones who should kill are those prepared to be killed."',   cond:{ type:'achv', id:'heartbreaking'       } },
  // Survive a crit → unyielding will
  { id:'ft_ee_survive_crit', text:'"I have a dream. And I refuse to let it die here."',                 cond:{ type:'achv', id:'p_survive_crit'      } },
  // First achievements → ninja way / never go back
  { id:'ft_ee_believe',      text:'"I never go back on my word. That\'s my way."',                      cond:{ type:'count', min:5                   } },
  // Monk flurry of blows → stand user
  { id:'ft_ee_oraoraora',    text:'"ORA ORA ORA ORA ORA ORA!"',                                         cond:{ type:'achv', id:'c_mnk_flurry'        } },
  // Two failed death saves, still standing → soul reaper energy
  { id:'ft_ee_nodying',      text:'"I have not yet become someone who can die."',                       cond:{ type:'achv', id:'no_bell'             } },
  // Sacrifice → equivalent exchange
  { id:'ft_ee_equivalent',   text:'"In order to gain something, something of equal value must be given."', cond:{ type:'achv', id:'p_sacrifice'     } },
  // Solo encounter → lone swordsman
  { id:'ft_ee_solo',         text:'"From the moment I\'m born, I walk alone."',                         cond:{ type:'achv', id:'p_solo_enc'          } },
  // Dragon kill → I did not come this far
  { id:'ft_ee_dragon2',      text:'"I did not come this far to be stopped by a lizard."',               cond:{ type:'achv', id:'p_kill_dragon'       } },
  // Going nuclear → one punch energy
  { id:'ft_ee_onepunch',     text:'"I\'m just a hero for fun."',                                        cond:{ type:'achv', id:'going_nuclear'       } },
  // Barbarian relentless → berserker oath
  { id:'ft_ee_rage',         text:'"If you sever my limbs, I will fight with my teeth."',               cond:{ type:'achv', id:'c_barb_relentless'   } },
  // Monk speed kill → untouchable
  { id:'ft_ee_speed',        text:'"I am not fast. The world is just too slow."',                       cond:{ type:'achv', id:'c_mnk_move'          } },
  // Taunt enemy
  { id:'ft_ee_taunt',        text:'"Come on then. I haven\'t got all day."',                            cond:{ type:'achv', id:'p_taunt'             } },
  // Druid beats a beast as that beast
  { id:'ft_ee_druid',        text:'"Do not mistake my kindness for weakness. Or my claws for decoration."', cond:{ type:'achv', id:'c_drd_beast'    } },

  // ── Easter Eggs: Video Games ──
  // First death
  { id:'ft_ee_died1',        text:'"YOU DIED."',                                                        cond:{ type:'achv', id:'was_quick'           } },
  // Second death
  { id:'ft_ee_died2',        text:'"Death is not the end. It is merely a checkpoint."',                 cond:{ type:'achv', id:'p_die_second'        } },
  // Third death → Elden Ring taunts
  { id:'ft_ee_died3',        text:'"Try finger, but hole."',                                            cond:{ type:'achv', id:'p_die_third'         } },
  // Barbarian rage → battle shout
  { id:'ft_ee_shout',        text:'"FUS RO DAH!"',                                                      cond:{ type:'achv', id:'c_barb_rage'         } },
  // Blood Hunter nature fail → monster hunter philosophy
  { id:'ft_ee_evil',         text:'"Evil is evil. Lesser, greater, middling — it\'s all the same."',    cond:{ type:'achv', id:'c_bh_fail'           } },
  // Mount obtained → classic NPC gift
  { id:'ft_ee_mount',        text:'"It\'s dangerous to go alone. Take this."',                          cond:{ type:'achv', id:'mount'               } },
  // Rage looting after encounter
  { id:'ft_ee_loot',         text:'"Oh, you dropped something. Several things actually."',              cond:{ type:'achv', id:'i_rage_loot'         } },
  // Legendary attunement
  { id:'ft_ee_legendary',    text:'"That\'s not just an item. That\'s a lifestyle choice."',            cond:{ type:'achv', id:'i_legendary'         } },
  // Hidden chest → treasure hunter code
  { id:'ft_ee_chest',        text:'"A hero is simply someone who does not leave treasure behind."',     cond:{ type:'achv', id:'hidden_chest'        } },
  // Fireball in small room
  { id:'ft_ee_fireball',     text:'"You didn\'t ask how big the room was. A classic mistake."',         cond:{ type:'achv', id:'h_fireball_room'     } },
  // Fastball special → maximum effort
  { id:'ft_ee_fastball',     text:'"MAXIMUM EFFORT."',                                                  cond:{ type:'achv', id:'fastball'            } },
  // Overkill → disgustingly satisfying
  { id:'ft_ee_overkill2',    text:'"That was astronomically, disgustingly overkill. Well done."',       cond:{ type:'achv', id:'overkill'            } },
  // Puzzle death
  { id:'ft_ee_puzzle',       text:'"You died to a riddle. The dungeon offers its condolences."',        cond:{ type:'achv', id:'p_die_puzzle'        } },
  // Critical fail master
  { id:'ft_ee_critfail',     text:'"The dice have spoken. They are not impressed."',                    cond:{ type:'achv', id:'s_critfail_master'   } },
  // Two nat 20s on disadvantage → laws of probability ignored
  { id:'ft_ee_2nat20',       text:'"Laws of probability? Never heard of them."',                       cond:{ type:'achv', id:'holy_shit'           } },
  // Eldritch railgun
  { id:'ft_ee_railgun2',     text:'"I didn\'t even see where that came from."',                        cond:{ type:'achv', id:'c_wlk_eldritch'      } },
  // Polymorph into dinosaur → life finds a way
  { id:'ft_ee_dino',         text:'"Life, uh... finds a way."',                                        cond:{ type:'achv', id:'h_scanbo'            } },
  // Arrested
  { id:'ft_ee_arrested',     text:'"You were supposed to be the hero."',                               cond:{ type:'achv', id:'arrested'            } },
  // Split the party
  { id:'ft_ee_split',        text:'"They said never split the party. You looked them dead in the eye."', cond:{ type:'achv', id:'p_split_party'     } },
  // Villain alignment unlock
  { id:'ft_ee_villainarc',   text:'"Every villain is the hero of their own story."',                   cond:{ type:'achv', id:'p_align_evil'        } },
  // Cursed artifact attunement
  { id:'ft_ee_cursed',       text:'"The item came with terms and conditions."',                        cond:{ type:'achv', id:'i_cursed_art'        } },
  // Kill deity
  { id:'ft_ee_deicide',      text:'"The heavens fall silent. As they should."',                        cond:{ type:'achv', id:'p_kill_deity'        } },

  // ── Easter Eggs: Superheroes ──
  // Artificer creates flight device → part of the journey
  { id:'ft_ee_ironman',      text:'"Part of the journey is the end."',                                 cond:{ type:'achv', id:'c_art_fly'           } },
  // Paladin smite enemy to 0 HP → no negotiation
  { id:'ft_ee_repent',       text:'"There will be no negotiation. Only judgment."',                    cond:{ type:'achv', id:'c_pal_smite'         } },
  // Shield throw 20+ damage → I can do this all day
  { id:'ft_ee_shield',       text:'"I can do this all day."',                                          cond:{ type:'achv', id:'av_cap'              } },
  // Unarmed 20+ damage → always angry
  { id:'ft_ee_smash',        text:'"That\'s my secret. I\'m always angry."',                           cond:{ type:'achv', id:'av_hulk'             } },
  // 5+ enemies with lightning → still worthy
  { id:'ft_ee_thunder',      text:'"I\'m still worthy."',                                              cond:{ type:'achv', id:'av_thor'             } },
  // Darkvision 180 ft → see everything
  { id:'ft_ee_darkvision',   text:'"I see everything. Everything sees me back."',                      cond:{ type:'achv', id:'darkvision'          } },
  // Low roll, high DC success → very particular set of skills
  { id:'ft_ee_skills',       text:'"I have a very particular set of skills."',                         cond:{ type:'achv', id:'unique_skill'        } },
  // Healed while unconscious
  { id:'ft_ee_healed',       text:'"Not dead yet. Apparently."',                                       cond:{ type:'achv', id:'resting_eyes'        } },
  // Ability score 30 → truly godlike
  { id:'ft_ee_godlike',      text:'"Immovable. Immeasurable. Inevitable."',                            cond:{ type:'achv', id:'i_score30'           } },
  // Concentration tank → sheer will, goes to eleven
  { id:'ft_ee_focus',        text:'"Pain is just a number. Mine goes to eleven."',                     cond:{ type:'achv', id:'conc_tank'           } },
  // Beholder defeated
  { id:'ft_ee_beholder',     text:'"I looked it in every eye. It blinked first."',                     cond:{ type:'achv', id:'classic_enc3'        } },
  // Mind Flayer defeated
  { id:'ft_ee_mindflayer',   text:'"It tried to read my mind. Bold of it."',                           cond:{ type:'achv', id:'classic_enc2'        } },
  // Milestones with pop culture energy
  { id:'ft_ee_count50',      text:'"Fifty victories. The realm begins to whisper your name."',         cond:{ type:'count', min:50                  } },
  { id:'ft_ee_count100',     text:'"One hundred. The gods have started taking notes."',                cond:{ type:'count', min:100                 } },
  { id:'ft_ee_count150',     text:'"One hundred fifty. History cannot contain you."',                  cond:{ type:'count', min:150                 } },
];

function _getEligibleFlavorTexts() {
  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  return FLAVOR_TEXTS.filter(function(f) {
    var c = f.cond;
    if (c.type === 'count') return count >= c.min;
    if (c.type === 'achv')  return !!achvUnlocked[c.id];
    if (c.type === 'cat') {
      var n = ACHIEVEMENTS.filter(function(a){ return a.cat === c.cat && achvUnlocked[a.id]; }).length;
      return n >= c.min;
    }
    return false;
  });
}

function getActiveFlavor() {
  return localStorage.getItem('dnd_active_flavor') || null;
}

function setActiveFlavor(flavorId) {
  if (flavorId === null) { localStorage.removeItem('dnd_active_flavor'); }
  else { localStorage.setItem('dnd_active_flavor', flavorId); }
  renderFlavorText();
  renderRewardsPanel();
}

function renderFlavorText() {
  var el = document.getElementById('portraitFlavorText');
  if (!el) return;

  var activeId = getActiveFlavor();
  if (!activeId) { el.style.display = 'none'; el.textContent = ''; return; }
  var ft = FLAVOR_TEXTS.find(function(f){ return f.id === activeId; });
  if (!ft) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.textContent = ft.text;
}


// ═══════════════════════════════════════════════════════════════
//  REWARD: 3. ACHIEVEMENT SHOWCASE — 3 STARRED ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════
// Each unlocked achievement card gets a small ⭐ button.
// Up to 3 can be starred — they appear as compact icon+name badges
// below the portrait on the character sheet.

var MAX_SHOWCASE = 3;

function getShowcaseAchievements() {
  try {
    var raw = localStorage.getItem('dnd_showcase_achievements');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function saveShowcaseAchievements(arr) {
  localStorage.setItem('dnd_showcase_achievements', JSON.stringify(arr));
}

function toggleShowcaseAchievement(id) {
  loadAchievements();
  if (!achvUnlocked[id]) { showToast('🔒 Unlock this achievement first!'); return; }
  var list = getShowcaseAchievements();
  var idx = list.indexOf(id);
  if (idx !== -1) {
    list.splice(idx, 1);
    saveShowcaseAchievements(list);
    renderShowcase();
    renderAchievements(); // refresh cards to update star state
    showToast('✦ Removed from showcase.');
    return;
  }
  if (list.length >= MAX_SHOWCASE) {
    showToast('⚠️ Max ' + MAX_SHOWCASE + ' showcase slots — remove one first.');
    return;
  }
  list.push(id);
  saveShowcaseAchievements(list);
  renderShowcase();
  renderAchievements(); // refresh cards to update star state
  showToast('⭐ Added to showcase!');
}

// Renders the small badges below the portrait
function renderShowcase() {
  var el = document.getElementById('achievementShowcase');
  if (!el) return;

  var list = getShowcaseAchievements();
  if (list.length === 0) { el.innerHTML = ''; return; }

  el.innerHTML = list.map(function(id) {
    var a = ACHIEVEMENTS.find(function(x){ return x.id === id; });
    if (!a) return '';
    return '<div class="showcase-badge" '
      + 'onclick="toggleShowcaseAchievement(\'' + id + '\')" '
      + 'title="' + a.name + ' — click to remove">'
      + '<span style="font-size:14px;line-height:1;">' + a.icon + '</span>'
      + '<span style="font-size:10px;">' + a.name + '</span>'
      + '</div>';
  }).join('');
}


// ═══════════════════════════════════════════════════════════════
//  REWARD: 4. CUSTOM STAT BOX COLORS
// ═══════════════════════════════════════════════════════════════
// Unlock ability to recolor STR/DEX/CON/INT/WIS/CHA boxes.
// Each unlock tier grants a different color palette.

var STAT_COLOR_UNLOCKS = [
  {
    id:'sc_tier1',
    label:'Veteran\'s Steel',
    icon:'🥈',
    desc:'Unlock at 50 achievements — cool steel blue on all stats.',
    cond:{ type:'count', min:50 },
    colors:{ str:'#60a5fa', dex:'#22d3ee', con:'#818cf8', int:'#a78bfa', wis:'#c4b5fd', cha:'#e879f9' },
    anim:'pulse-slow',
  },
  {
    id:'sc_tier2',
    label:'Hero\'s Gold',
    icon:'🥇',
    desc:'Unlock at 100 achievements — golden warm tones.',
    cond:{ type:'count', min:100 },
    colors:{ str:'#fbbf24', dex:'#fcd34d', con:'#f59e0b', int:'#fbbf24', wis:'#fde68a', cha:'#fef08a' },
    anim:'pulse-medium',
  },
  {
    id:'sc_tier3',
    label:'Blood & Fire',
    icon:'🩸',
    desc:'Unlock 10 Combat achievements.',
    cond:{ type:'cat', cat:'Combat', min:10 },
    colors:{ str:'#f87171', dex:'#fb923c', con:'#ef4444', int:'#fca5a5', wis:'#f97316', cha:'#fcd34d' },
    anim:'pulse-flicker',
  },
  {
    id:'sc_tier4',
    label:'Nature\'s Bounty',
    icon:'🌿',
    desc:'Unlock 8 Exploration achievements.',
    cond:{ type:'cat', cat:'Exploration', min:8 },
    colors:{ str:'#4ade80', dex:'#86efac', con:'#22c55e', int:'#bbf7d0', wis:'#6ee7b7', cha:'#34d399' },
    anim:'pulse-breathe',
  },
  {
    id:'sc_tier5',
    label:'Arcane Mastery',
    icon:'🔮',
    desc:'Unlock 5 Class achievements.',
    cond:{ type:'cat', cat:'Class', min:5 },
    colors:{ str:'#c084fc', dex:'#a78bfa', con:'#7c3aed', int:'#818cf8', wis:'#e879f9', cha:'#f0abfc' },
    anim:'pulse-arcane',
  },
  {
    id:'sc_tier6',
    label:'Void Touched',
    icon:'🌌',
    desc:'Reach Myth rank (200 achievements) — cosmic cyan.',
    cond:{ type:'count', min:200 },
    colors:{ str:'#00e5ff', dex:'#67e8f9', con:'#0ea5e9', int:'#38bdf8', wis:'#7dd3fc', cha:'#bae6fd' },
    anim:'pulse-myth',
  },
  {
    id:'sc_default',
    label:'Default',
    icon:'⬜',
    desc:'Remove custom colors.',
    cond:{ type:'count', min:0 },
    colors: null,
    anim: null,
  },
];

function _getEligibleStatColors() {
  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  return STAT_COLOR_UNLOCKS.filter(function(sc) {
    var c = sc.cond;
    if (c.type === 'count') return count >= c.min;
    if (c.type === 'achv')  return !!achvUnlocked[c.id];
    if (c.type === 'cat') {
      var n = ACHIEVEMENTS.filter(function(a){ return a.cat === c.cat && achvUnlocked[a.id]; }).length;
      return n >= c.min;
    }
    return false;
  });
}

function getActiveStatColor() {
  return localStorage.getItem('dnd_active_stat_color') || null;
}

function setActiveStatColor(scId) {
  if (scId === null || scId === 'sc_default') { localStorage.removeItem('dnd_active_stat_color'); }
  else { localStorage.setItem('dnd_active_stat_color', scId); }
  applyStatBoxColors();
  renderRewardsPanel();
}

function applyStatBoxColors() {
  var activeId = getActiveStatColor();
  var tier = activeId ? STAT_COLOR_UNLOCKS.find(function(sc){ return sc.id === activeId; }) : null;
  var colors = (tier && tier.colors) ? tier.colors : null;
  var anim   = (tier && tier.anim)   ? tier.anim   : null;

  var stats = ['str','dex','con','int','wis','cha'];
  stats.forEach(function(stat) {
    var selectors = [
      '[data-stat="' + stat + '"]',
      '#stat-' + stat,
      '#statBox_' + stat,
      '.stat-box-' + stat,
      '.' + stat + '-box',
    ];
    selectors.forEach(function(sel) {
      try {
        var els = document.querySelectorAll(sel);
        els.forEach(function(el) {
          // Remove all animation classes first
          el.classList.remove('sc-pulse-slow','sc-pulse-medium','sc-pulse-flicker','sc-pulse-breathe','sc-pulse-arcane','sc-pulse-myth');
          if (colors) {
            var c = colors[stat];
            el.style.setProperty('--stat-box-color', c);
            el.style.borderColor = c;
            el.style.boxShadow = '0 0 12px ' + c + '88, 0 0 4px ' + c + '44, inset 0 0 6px ' + c + '18';
            var scoreEl = el.querySelector('.stat-score, .attr-score, [data-score]');
            if (scoreEl) scoreEl.style.color = c;
            var nameEl = el.querySelector('.stat-name');
            if (nameEl) nameEl.style.color = c;
            if (anim) el.classList.add('sc-' + anim);
          } else {
            el.style.removeProperty('--stat-box-color');
            el.style.borderColor = '';
            el.style.boxShadow   = '';
            var scoreEl = el.querySelector('.stat-score, .attr-score, [data-score]');
            if (scoreEl) scoreEl.style.color = '';
            var nameEl = el.querySelector('.stat-name');
            if (nameEl) nameEl.style.color = '';
          }
        });
      } catch(e) {}
    });
  });
}


// ═══════════════════════════════════════════════════════════════
//  REWARDS PANEL EXTENSION — add new sections to renderRewardsPanel
// ═══════════════════════════════════════════════════════════════

// Patch renderRewardsPanel to include the 4 new sections
var _origRenderRewardsPanel = renderRewardsPanel;
renderRewardsPanel = function() {
  _origRenderRewardsPanel();

  var container = document.getElementById('achvRewardsPanel');
  if (!container) return;

  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;

  var _flavorOpen    = localStorage.getItem('rp_flavor_open')    !== 'false';
  var _statcolOpen   = localStorage.getItem('rp_statcol_open')   !== 'false';

  // ── FLAVOR TEXTS ──
  var eligibleFlavors = _getEligibleFlavorTexts();
  var activeFlavorId  = getActiveFlavor();

  // Local achv lookup (needed since _achvById is scoped inside renderRewardsPanel)
  var _ftAchvById = {};
  ACHIEVEMENTS.forEach(function(a){ _ftAchvById[a.id] = a; });
  function _getFlavorCat(f) {
    if (f.cond.type === 'count') return 'Rank';
    if (f.cond.type === 'cat')   return f.cond.cat;
    if (f.cond.type === 'achv') {
      var src = _ftAchvById[f.cond.id];
      if (src) return src.cat;
    }
    return 'Other';
  }
  var _flavorFilterGroups = [
    { key:'All',         icon:'📋' },
    { key:'Rank',        icon:'👑' },
    { key:'Combat',      icon:'⚔️' },
    { key:'Dice',        icon:'🎲' },
    { key:'Roleplay',    icon:'🎭' },
    { key:'Exploration', icon:'🗺️' },
    { key:'Survival',    icon:'🛡️' },
    { key:'Healing',     icon:'⚕️' },
    { key:'Economy',     icon:'💰' },
    { key:'Class',       icon:'🪄' },
    { key:'Kills',       icon:'💀' },
    { key:'Adventure',   icon:'🐉' },
    { key:'Hidden',      icon:'👁️' },
    { key:'Race',        icon:'🧬' },
    { key:'Shenanigans', icon:'🤡' },
    { key:'Politics',    icon:'⚖️' },
    { key:'Other',       icon:'✨' },
  ];
  var _activeFlavorFilter = localStorage.getItem('rp_flavor_filter') || 'All';
  var _flavorGroupCounts  = { All: eligibleFlavors.length };
  eligibleFlavors.forEach(function(f) {
    var c = _getFlavorCat(f);
    _flavorGroupCounts[c] = (_flavorGroupCounts[c]||0) + 1;
  });
  var _visibleFlavorGroups = _flavorFilterGroups.filter(function(g){
    return g.key === 'All' || (_flavorGroupCounts[g.key] && _flavorGroupCounts[g.key] > 0);
  });
  var _filteredFlavors = _activeFlavorFilter === 'All' ? eligibleFlavors
    : eligibleFlavors.filter(function(f){ return _getFlavorCat(f) === _activeFlavorFilter; });

  var flavorContent = '';
  if (eligibleFlavors.length === 0) {
    flavorContent = '<div class="rewards-empty">Earn your first achievement to unlock flavor text.</div>';
  } else {
    // Filter bar
    flavorContent += '<div class="title-filter-bar">';
    _visibleFlavorGroups.forEach(function(g) {
      var isActive = g.key === _activeFlavorFilter;
      var cnt = _flavorGroupCounts[g.key] || 0;
      flavorContent += '<button class="title-filter-pill' + (isActive ? ' active' : '') + '" '
        + 'onclick="localStorage.setItem(\'rp_flavor_filter\',\'' + g.key + '\');renderRewardsPanel();">'
        + '<span class="title-filter-pill-icon">' + g.icon + '</span>'
        + '<span class="title-filter-pill-label">' + g.key + '</span>'
        + '<span class="title-filter-pill-count">' + cnt + '</span>'
        + '</button>';
    });
    flavorContent += '</div>';
    // Flavor chips
    if (_filteredFlavors.length === 0) {
      flavorContent += '<div class="rewards-empty" style="font-size:11px;">No flavor texts in this category yet.</div>';
    } else {
      flavorContent += '<div class="rewards-title-grid">';
      _filteredFlavors.forEach(function(f) {
        var active = f.id === activeFlavorId;
        flavorContent += '<div class="rewards-title-chip' + (active?' active':'') + '" '
          + 'onclick="setActiveFlavor(\'' + f.id + '\')" title="' + f.text + '">'
          + '<span>' + (active?'💬':'💭') + '</span>'
          + '<span style="font-style:italic;font-size:10px;">' + f.text + '</span>'
          + (active ? '<span class="rewards-active-dot">●</span>' : '')
          + '</div>';
      });
      flavorContent += '</div>';
    }
    if (activeFlavorId) {
      flavorContent += '<button class="rewards-clear-btn" onclick="setActiveFlavor(null)">✕ Remove flavor text</button>';
    }
  }
  var flavorHTML = _rpSection('flavor', '💬 Flavor Text', eligibleFlavors.length + ' unlocked', flavorContent, _flavorOpen);

  // ── STAT BOX COLORS ──
  var eligibleColors = _getEligibleStatColors();
  var activeColorId  = getActiveStatColor();
  var statcolContent = '';
  if (eligibleColors.filter(function(sc){ return sc.id !== 'sc_default'; }).length === 0) {
    statcolContent = '<div class="rewards-empty">Earn 50 achievements or master a category to unlock stat colors.</div>';
  } else {
    statcolContent = '<div class="rewards-title-grid">';
    eligibleColors.forEach(function(sc) {
      var active  = sc.id === activeColorId || (sc.id === 'sc_default' && !activeColorId);
      var preview = sc.colors
        ? 'background:linear-gradient(90deg,' + Object.values(sc.colors).join(',') + ');'
        : 'background:var(--bg-card);';
      statcolContent += '<div class="rewards-title-chip' + (active?' active':'') + '" '
        + 'onclick="setActiveStatColor(\'' + sc.id + '\')" title="' + sc.desc + '">'
        + '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;' + preview + 'flex-shrink:0;"></span>'
        + '<span>' + sc.icon + ' ' + sc.label + '</span>'
        + (active ? '<span class="rewards-active-dot">●</span>' : '')
        + '</div>';
    });
    statcolContent += '</div>';
  }
  var statcolHTML = _rpSection('statcol', '🎨 Stat Box Colors', (eligibleColors.length - 1) + ' palettes unlocked', statcolContent, _statcolOpen);

  // Append all new sections
  container.innerHTML += flavorHTML + statcolHTML;
};

// Helper: build a collapsible section identical in style to existing ones
function _rpSection(key, title, subtitle, bodyContent, isOpen) {
  return '<div class="rewards-section-header" onclick="toggleRewardsSection(\'' + key + '\')" '
    + 'style="margin-top:14px;cursor:pointer;user-select:none;display:flex;justify-content:space-between;align-items:center;">'
    + '<span>' + title + ' <span style="opacity:0.5;font-size:11px;">(' + subtitle + ')</span></span>'
    + '<span style="font-size:10px;opacity:0.6;transition:transform 0.2s;display:inline-block;transform:rotate(' + (isOpen?'0':'180') + 'deg);">▲</span>'
    + '</div>'
    + '<div id="rp_' + key + '_body" style="display:' + (isOpen?'block':'none') + ';">' + bodyContent + '</div>';
}

// Extend toggleRewardsSection to handle the new sections
var _origToggleRewardsSection = toggleRewardsSection;
toggleRewardsSection = function(section) {
  var newKeys = ['flavor','statcol'];
  if (newKeys.indexOf(section) === -1) { _origToggleRewardsSection(section); return; }
  var keyMap  = { flavor:'rp_flavor_open', statcol:'rp_statcol_open' };
  var body = document.getElementById('rp_' + section + '_body');
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  localStorage.setItem(keyMap[section], isOpen ? 'false' : 'true');
  var header = body.previousElementSibling;
  if (header) {
    var arrow = header.querySelector('span:last-child');
    if (arrow) arrow.style.transform = 'rotate(' + (isOpen ? '180' : '0') + 'deg)';
  }
};



// ═══════════════════════════════════════════════════════════════
//  REWARD: NAME STYLES
// ═══════════════════════════════════════════════════════════════

var NAME_STYLES = [
  { id:'ns_default',  label:'Default',       icon:'⬜', cssClass:'',          cond:{type:'always'} },
  { id:'ns_silver',   label:'Silver Steel',  icon:'🗡️', cssClass:'ns-silver', cond:{type:'count', min:25} },
  { id:'ns_gold',     label:'Gilded',        icon:'✨', cssClass:'ns-gold',   cond:{type:'count', min:45} },
  { id:'ns_rainbow',  label:'Prismatic',     icon:'🌈', cssClass:'ns-rainbow',cond:{type:'count', min:130} },
  { id:'ns_myth',     label:'Mythic Void',   icon:'🌌', cssClass:'ns-myth',   cond:{type:'count', min:200} },
  { id:'ns_flame',    label:'Hellfire',      icon:'🔥', cssClass:'ns-flame',  cond:{type:'achv', id:'classic_enc4'} },
  { id:'ns_blood',    label:'Bloodbound',    icon:'🩸', cssClass:'ns-blood',  cond:{type:'achv', id:'heartbreaking'} },
  { id:'ns_shadow',   label:'Shadow Script', icon:'🌑', cssClass:'ns-shadow', cond:{type:'cat', cat:'Shenanigans', min:10} },
  { id:'ns_arcane',   label:'Arcane Glow',   icon:'🔮', cssClass:'ns-arcane', cond:{type:'cat', cat:'Dice', min:15} },
  { id:'ns_nature',   label:'Living Rune',   icon:'🌿', cssClass:'ns-nature', cond:{type:'cat', cat:'Exploration', min:8} },
  { id:'ns_sepia',    label:'Ink & Quill',   icon:'🪶', cssClass:'ns-sepia',  cond:{type:'cat', cat:'Class', min:10} },
  { id:'ns_neon',     label:'Neon Shock',    icon:'⚡', cssClass:'ns-neon',   cond:{type:'cat', cat:'Combat', min:20} },
  { id:'ns_ice',      label:'Frozen Script', icon:'🧊', cssClass:'ns-ice',    cond:{type:'achvs', achvs:['classic_enc1','classic_enc2','classic_enc3','classic_enc4']} },
  { id:'ns_forge',    label:'Forge',         icon:'🔨', cssClass:'ns-forge',  cond:{type:'multicat', cats:['Race','Class'], min:20} },
  { id:'ns_dream',    label:'The Dreaming',  icon:'🌙', cssClass:'ns-dream',  cond:{type:'cat', cat:'Roleplay', min:15} },
];

function _condMet(c) {
  loadAchievements();
  var count = Object.keys(achvUnlocked).filter(function(k){ return achvUnlocked[k]; }).length;
  if (c.type==='always')   return true;
  if (c.type==='count')    return count >= c.min;
  if (c.type==='achv')     return !!achvUnlocked[c.id];
  if (c.type==='achvs')    return c.achvs.every(function(id){ return !!achvUnlocked[id]; });
  if (c.type==='cat')      { var n=ACHIEVEMENTS.filter(function(a){ return a.cat===c.cat&&achvUnlocked[a.id]; }).length; return n>=c.min; }
  if (c.type==='multicat') { var t=ACHIEVEMENTS.filter(function(a){ return c.cats.indexOf(a.cat)!==-1&&achvUnlocked[a.id]; }).length; return t>=c.min; }
  return false;
}
function _getEligibleNameStyles() { return NAME_STYLES.filter(function(s){ return _condMet(s.cond); }); }
function getActiveNameStyle() { return localStorage.getItem('dnd_name_style')||'ns_default'; }
function setActiveNameStyle(id) { localStorage.setItem('dnd_name_style',id); applyNameStyle(id); renderRewardsPanel(); }
function applyNameStyle(id) {
  var el=document.getElementById('charName'); if(!el) return;
  el.className=el.className.replace(/\bns-[\w-]+\b/g,'').trim();
  var s=NAME_STYLES.find(function(x){ return x.id===id; });
  if(s&&s.cssClass) el.classList.add(s.cssClass);
}
(function(){ setTimeout(function(){ applyNameStyle(getActiveNameStyle()); },150); })();


// ═══════════════════════════════════════════════════════════════
//  REWARD: INSPIRATION GEM STYLES
// ═══════════════════════════════════════════════════════════════

var GEM_STYLES = [
  { id:'gem_default',  label:'Default',       icon:'⭕', cssClass:'',           desc:'Standard golden orb.',                                  cond:{type:'always'} },
  { id:'gem_ruby',     label:"Dragon's Eye",  icon:'🔴', cssClass:'gem-ruby',   desc:'50 achievements — draconic crimson eye.',               cond:{type:'count', min:50} },
  { id:'gem_void',     label:'Void Orb',      icon:'🔮', cssClass:'gem-void',   desc:'75 achievements — swirling portal to nowhere.',         cond:{type:'count', min:75} },
  { id:'gem_rune',     label:'Runestone',     icon:'🪨', cssClass:'gem-rune',   desc:'All 4 Classic Encounters — ancient carved rune.',       cond:{type:'achvs', achvs:['classic_enc1','classic_enc2','classic_enc3','classic_enc4']} },
  { id:'gem_frost',    label:'Frost Crystal', icon:'❄️', cssClass:'gem-frost',  desc:'All 4 Classic Encounters — icy shard of permafrost.',   cond:{type:'achvs', achvs:['classic_enc1','classic_enc2','classic_enc3','classic_enc4']} },
  { id:'gem_eye',      label:'Eldritch Eye',  icon:'👁',  cssClass:'gem-eye',    desc:'Defeat a Tarrasque — a thing that should not be.',      cond:{type:'achv', id:'tarrasque'} },
  { id:'gem_forge',    label:'Ember Core',    icon:'🔥', cssClass:'gem-forge',  desc:'20+ Race+Class achievements — molten iron at its heart.',cond:{type:'multicat', cats:['Race','Class'], min:20} },
  { id:'gem_myth',     label:'Cosmic Shard',  icon:'🌌', cssClass:'gem-myth',   desc:'200 achievements — a fragment of the cosmos.',          cond:{type:'count', min:200} },
  { id:'gem_dream',    label:'Dreamstone',    icon:'🌙', cssClass:'gem-dream',  desc:'15+ Roleplay — iridescent shifting pearl.',             cond:{type:'cat', cat:'Roleplay', min:15} },
  { id:'gem_blood',   label:'Bloodstone',    icon:'🩸', cssClass:'gem-blood',   desc:'Total Party Kill — a gem soaked in sacrifice.',          cond:{type:'achv', id:'heartbreaking'} },
  { id:'gem_storm',   label:'Stormcore',     icon:'⚡', cssClass:'gem-storm',   desc:'20+ Combat achievements — crackling lightning inside.',  cond:{type:'cat', cat:'Combat', min:20} },
  { id:'gem_abyssal', label:'Abyssal Eye',   icon:'🌑', cssClass:'gem-abyssal', desc:'10+ Shenanigans achievements — eye of the abyss.',       cond:{type:'cat', cat:'Shenanigans', min:10} },
  { id:'gem_nature',  label:'Heartwood',     icon:'🌿', cssClass:'gem-nature',  desc:'8+ Exploration achievements — living wood pulsing.',    cond:{type:'cat', cat:'Exploration', min:8} },
];

function _getEligibleGemStyles() { return GEM_STYLES.filter(function(g){ return _condMet(g.cond); }); }
function getActiveGemStyle() { return localStorage.getItem('dnd_gem_style')||'gem_default'; }
function setActiveGemStyle(id) { localStorage.setItem('dnd_gem_style',id); applyGemStyle(id); renderRewardsPanel(); }
function applyGemStyle(id) {
  var el=document.getElementById('inspirationGem'); if(!el) return;
  el.className=el.className.replace(/\bgem-[\w-]+\b/g,'').trim();
  var s=GEM_STYLES.find(function(x){ return x.id===id; });
  if(s&&s.cssClass) el.classList.add(s.cssClass);
}
(function(){ setTimeout(function(){ applyGemStyle(getActiveGemStyle()); },160); })();


// ═══════════════════════════════════════════════════════════════
//  REWARD: DEATH SAVE DOT SKINS
// ═══════════════════════════════════════════════════════════════

var DS_SKINS = [
  { id:'ds_default', label:'Default',    icon:'⚪', cssClass:'',           desc:'Standard dots.',                                        cond:{type:'always'} },
  { id:'ds_skull',   label:'Skulls',     icon:'💀', cssClass:'ds-skull',   desc:'Total Party Kill — grinning skulls.',                   cond:{type:'achv', id:'heartbreaking'} },
  { id:'ds_flame',   label:'Flames',     icon:'🔥', cssClass:'ds-flame',   desc:'50 achievements — blazing embers.',                     cond:{type:'count', min:50} },
  { id:'ds_rune',    label:'Runes',      icon:'🔮', cssClass:'ds-rune',    desc:'15+ Dice achievements — glowing arcane runes.',         cond:{type:'cat', cat:'Dice', min:15} },
  { id:'ds_void',    label:'Void Rifts', icon:'🌀', cssClass:'ds-void',    desc:'Defeat a Tarrasque — tears in reality.',                cond:{type:'achv', id:'tarrasque'} },
  { id:'ds_heart',   label:'Hearts',     icon:'❤️', cssClass:'ds-heart',   desc:'10+ Healing achievements — beating hearts.',            cond:{type:'cat', cat:'Healing', min:10} },
  { id:'ds_star',    label:'Stars',      icon:'⭐', cssClass:'ds-star',    desc:'Hero rank (80 achievements) — blazing stars.',          cond:{type:'count', min:80} },
  { id:'ds_myth',    label:'Cosmic',     icon:'🌌', cssClass:'ds-myth',    desc:'Myth rank (200 achievements) — cosmic fragments.',      cond:{type:'count', min:200} },
  { id:'ds_bolt',    label:'Lightning',  icon:'⚡', cssClass:'ds-bolt',    desc:'20+ Combat achievements — crackling bolts.',            cond:{type:'cat', cat:'Combat', min:20} },
  { id:'ds_ice',     label:'Frost Shards',icon:'❄️',cssClass:'ds-ice',     desc:'All 4 Classic Encounters — frozen splinters.',          cond:{type:'achvs', achvs:['classic_enc1','classic_enc2','classic_enc3','classic_enc4']} },
  { id:'ds_blood',   label:'Blood Drops',icon:'🩸', cssClass:'ds-blood',   desc:'Total Party Kill + Level 20 death — crimson drops.',    cond:{type:'achvs', achvs:['heartbreaking','way_to_go']} },
  { id:'ds_eye',     label:'Eldritch Eyes',icon:'👁',cssClass:'ds-eye',    desc:'Defeat a Tarrasque + Beholder — watching eyes.',        cond:{type:'achvs', achvs:['tarrasque','classic_enc3']} },
];

function _getEligibleDsSkins() { return DS_SKINS.filter(function(s){ return _condMet(s.cond); }); }
function getActiveDsSkin() { return localStorage.getItem('dnd_ds_skin')||'ds_default'; }
function setActiveDsSkin(id) { localStorage.setItem('dnd_ds_skin',id); applyDsSkin(id); renderRewardsPanel(); }
function applyDsSkin(id) {
  var allDots = document.querySelectorAll('.ds-dot, .hud-ds-dot');
  var skinClasses = ['ds-skull','ds-flame','ds-rune','ds-void','ds-heart','ds-star','ds-myth','ds-bolt','ds-ice','ds-blood','ds-eye'];
  allDots.forEach(function(el) {
    skinClasses.forEach(function(c){ el.classList.remove(c); });
    var s = DS_SKINS.find(function(x){ return x.id===id; });
    if (s && s.cssClass) el.classList.add(s.cssClass);
  });
}
(function(){ setTimeout(function(){ applyDsSkin(getActiveDsSkin()); },170); })();

// Re-apply after toggleDeathSave re-renders dots
if (typeof toggleDeathSave === 'function') {
  var _origTDS = toggleDeathSave;
  toggleDeathSave = function() {
    _origTDS.apply(this, arguments);
    setTimeout(function(){ applyDsSkin(getActiveDsSkin()); }, 20);
  };
}


// ═══════════════════════════════════════════════════════════════
//  REWARD: SECTION HEADER ORNAMENTS
// ═══════════════════════════════════════════════════════════════

var HEADER_DECOS = [
  { id:'hd_default', label:'Default',        icon:'✦', cssClass:'',           desc:'Standard ✦ ornament.',              cond:{type:'always'} },
  { id:'hd_sword',   label:'Crossed Swords', icon:'⚔', cssClass:'hd-sword',   desc:'20+ Combat achievements.',          cond:{type:'cat', cat:'Combat', min:20} },
  { id:'hd_rune',    label:'Elder Rune',     icon:'ᚱ', cssClass:'hd-rune',    desc:'15+ Dice achievements.',            cond:{type:'cat', cat:'Dice', min:15} },
  { id:'hd_fleur',   label:'Fleur-de-lis',   icon:'⚜', cssClass:'hd-fleur',   desc:'10+ Politics achievements.',        cond:{type:'cat', cat:'Politics', min:10} },
  { id:'hd_skull',   label:'Skull',          icon:'☠', cssClass:'hd-skull',   desc:'Total Party Kill.',                 cond:{type:'achv', id:'heartbreaking'} },
  { id:'hd_flower',  label:'Lotus',          icon:'✿', cssClass:'hd-flower',  desc:'8+ Exploration achievements.',      cond:{type:'cat', cat:'Exploration', min:8} },
  { id:'hd_star',    label:'Blazing Star',   icon:'✸', cssClass:'hd-star',    desc:'Hero rank (80 achievements).',      cond:{type:'count', min:80} },
  { id:'hd_crown',   label:'Crown',          icon:'♛', cssClass:'hd-crown',   desc:'Legend rank (130 achievements).',   cond:{type:'count', min:130} },
  { id:'hd_myth',    label:'Cosmic Sigil',   icon:'⊛', cssClass:'hd-myth',    desc:'Myth rank (200 achievements).',     cond:{type:'count', min:200} },
  { id:'hd_dragon',  label:'Dragon Scale',   icon:'🐉', cssClass:'hd-dragon',  desc:'Defeat an Ancient Red Dragon in Classic Adventure.',   cond:{type:'achv', id:'classic_adv'} },
  { id:'hd_anchor',  label:'Kraken Sigil',   icon:'⚓', cssClass:'hd-anchor',  desc:'Defeat a Kraken.',                  cond:{type:'achv', id:'comedian'} },
  { id:'hd_bolt',    label:'Thunder Mark',   icon:'⚡', cssClass:'hd-bolt',    desc:'30+ Combat achievements.',          cond:{type:'cat', cat:'Combat', min:30} },
  { id:'hd_eye',     label:'Eldritch Eye',   icon:'👁', cssClass:'hd-eye',     desc:'Defeat Tarrasque + Beholder.',      cond:{type:'achvs', achvs:['tarrasque','classic_enc3']} },
];

function _getEligibleHeaderDecos() { return HEADER_DECOS.filter(function(h){ return _condMet(h.cond); }); }
function getActiveHeaderDeco() { return localStorage.getItem('dnd_header_deco')||'hd_default'; }
function setActiveHeaderDeco(id) { localStorage.setItem('dnd_header_deco',id); applyHeaderDeco(id); renderRewardsPanel(); }
function applyHeaderDeco(id) {
  var s = HEADER_DECOS.find(function(x){ return x.id===id; });
  document.body.className = document.body.className.replace(/\bhd-[\w-]+\b/g,'').trim();
  if (s&&s.cssClass) document.body.classList.add(s.cssClass);
  document.documentElement.style.setProperty('--header-deco-char', '"'+(s?s.icon:'✦')+'"');
}
(function(){ setTimeout(function(){ applyHeaderDeco(getActiveHeaderDeco()); },190); })();


// ═══════════════════════════════════════════════════════════════
//  EXTEND renderRewardsPanel
// ═══════════════════════════════════════════════════════════════

var _origRPV3 = renderRewardsPanel;
renderRewardsPanel = function() {
  _origRPV3();
  var container = document.getElementById('achvRewardsPanel');
  if (!container) return;

  function _chips(items, activeId, setFn, clearCall, defaultId, key, title, emptyMsg) {
    var open = localStorage.getItem('rp_'+key+'_open') !== 'false';
    var nonDef = items.filter(function(x){ return x.id !== defaultId; });
    var content = '';
    if (nonDef.length === 0) {
      content = '<div class="rewards-empty">'+emptyMsg+'</div>';
    } else {
      content += '<div class="rewards-title-grid">';
      items.forEach(function(s) {
        var active = s.id === activeId;
        content += '<div class="rewards-title-chip'+(active?' active':'')+'" onclick="'+setFn+'(\''+s.id+'\')" title="'+(s.desc||'')+'">'
          + '<span>'+s.icon+'</span><span>'+s.label+'</span>'
          + (active?'<span class="rewards-active-dot">●</span>':'')+'</div>';
      });
      content += '</div>';
      if (activeId && activeId !== defaultId) {
        content += '<button class="rewards-clear-btn" onclick="'+clearCall+'">✕ Remove</button>';
      }
    }
    return _rpSection(key, title, nonDef.length+' unlocked', content, open);
  }

  container.innerHTML +=
    _chips(_getEligibleNameStyles(),  getActiveNameStyle(),  'setActiveNameStyle',  'setActiveNameStyle(\'ns_default\')',  'ns_default',  'ns',  '✍ Name Styles',             'Reach Veteran rank (25 achv).') +
    _chips(_getEligibleGemStyles(),   getActiveGemStyle(),   'setActiveGemStyle',   'setActiveGemStyle(\'gem_default\')',   'gem_default', 'gem', '💎 Inspiration Gem',        'Earn 50 achievements to unlock gem styles.') +
    _chips(_getEligibleDsSkins(),     getActiveDsSkin(),     'setActiveDsSkin',     'setActiveDsSkin(\'ds_default\')',     'ds_default',  'ds',  '☠ Death Save Skins',        'Earn 50 achievements or master a category.') +
    _chips(_getEligibleHeaderDecos(), getActiveHeaderDeco(), 'setActiveHeaderDeco', 'setActiveHeaderDeco(\'hd_default\')', 'hd_default',  'hd',  '✦ Section Header Ornaments','Master a category to unlock.');
};

var _origTogV3 = toggleRewardsSection;
toggleRewardsSection = function(section) {
  var mine = ['ns','gem','ds','hd'];
  if (mine.indexOf(section) === -1) { _origTogV3(section); return; }
  var body = document.getElementById('rp_'+section+'_body');
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  localStorage.setItem('rp_'+section+'_open', isOpen ? 'false' : 'true');
  var hdr = body.previousElementSibling;
  if (hdr) { var arr=hdr.querySelector('span:last-child'); if(arr) arr.style.transform='rotate('+(isOpen?'180':'0')+'deg)'; }
};

var _origUpdV3 = updatePortraitRank;
updatePortraitRank = function() {
  _origUpdV3();
  applyNameStyle(getActiveNameStyle());
  applyGemStyle(getActiveGemStyle());
  applyDsSkin(getActiveDsSkin());
  applyHeaderDeco(getActiveHeaderDeco());
};

// ═══════════════════════════════════════════════════════════════
//  REWARD: CARD & PANEL BORDER SKINS
// ═══════════════════════════════════════════════════════════════
// Adds a glowing border / frame to all .panel elements.
// Inspired by The Absolute theme's gold border aesthetic.
// 13 skins total (1 default + 12 unlockables).

var CARD_BORDER_SKINS = [
  {
    id:  'cb_default',
    label: 'Default',
    icon: '⬜',
    cssClass: '',
    desc: 'Standard panel border.',
    cond: { type: 'always' },
  },
  {
    id:  'cb_gold',
    label: 'Gilded Halls',
    icon: '✨',
    cssClass: 'cb-gold',
    desc: 'Unlock at 25 achievements — warm golden border glow.',
    cond: { type: 'count', min: 25 },
  },
  {
    id:  'cb_silver',
    label: 'Silver Steel',
    icon: '🗡️',
    cssClass: 'cb-silver',
    desc: 'Unlock at 50 achievements — cool silver edge.',
    cond: { type: 'count', min: 50 },
  },
  {
    id:  'cb_flame',
    label: 'Hellfire Frame',
    icon: '🔥',
    cssClass: 'cb-flame',
    desc: 'Unlock 10 Combat achievements — blazing crimson border.',
    cond: { type: 'cat', cat: 'Combat', min: 10 },
  },
  {
    id:  'cb_nature',
    label: 'Living Root',
    icon: '🌿',
    cssClass: 'cb-nature',
    desc: 'Unlock 8 Exploration achievements — verdant green pulse.',
    cond: { type: 'cat', cat: 'Exploration', min: 8 },
  },
  {
    id:  'cb_arcane',
    label: 'Arcane Seal',
    icon: '🔮',
    cssClass: 'cb-arcane',
    desc: 'Unlock 15 Dice achievements — shifting violet arcane runes.',
    cond: { type: 'cat', cat: 'Dice', min: 15 },
  },
  {
    id:  'cb_blood',
    label: 'Blood Pact',
    icon: '🩸',
    cssClass: 'cb-blood',
    desc: 'Experience a Total Party Kill — dark crimson dripping edge.',
    cond: { type: 'achv', id: 'heartbreaking' },
  },
  {
    id:  'cb_ice',
    label: 'Frozen Tomb',
    icon: '❄️',
    cssClass: 'cb-ice',
    desc: 'Defeat all 4 Classic Encounters — icy frost crystal frame.',
    cond: { type: 'achvs', achvs: ['classic_enc1','classic_enc2','classic_enc3','classic_enc4'] },
  },
  {
    id:  'cb_void',
    label: 'Void Rift',
    icon: '🌀',
    cssClass: 'cb-void',
    desc: 'Defeat a Tarrasque — pulsing void tear border.',
    cond: { type: 'achv', id: 'tarrasque' },
  },
  {
    id:  'cb_storm',
    label: 'Thunder Mark',
    icon: '⚡',
    cssClass: 'cb-storm',
    desc: 'Unlock 20 Combat achievements — crackling electric border.',
    cond: { type: 'cat', cat: 'Combat', min: 20 },
  },
  {
    id:  'cb_dream',
    label: 'The Dreaming',
    icon: '🌙',
    cssClass: 'cb-dream',
    desc: 'Unlock 15 Roleplay achievements — shimmering moonlit violet.',
    cond: { type: 'cat', cat: 'Roleplay', min: 15 },
  },
  {
    id:  'cb_hero',
    label: 'Hero\'s Radiance',
    icon: '⭐',
    cssClass: 'cb-hero',
    desc: 'Reach Hero rank (80 achievements) — blazing amber radiance.',
    cond: { type: 'count', min: 80 },
  },
  {
    id:  'cb_myth',
    label: 'Cosmic Sigil',
    icon: '🌌',
    cssClass: 'cb-myth',
    desc: 'Reach Myth rank (200 achievements) — pulsing cosmic cyan void.',
    cond: { type: 'count', min: 200 },
  },
];

function _getEligibleCardBorders() {
  return CARD_BORDER_SKINS.filter(function(s) { return _condMet(s.cond); });
}

function getActiveCardBorder() {
  return localStorage.getItem('dnd_card_border') || 'cb_default';
}

function setActiveCardBorder(id) {
  if (id === null || id === 'cb_default') {
    localStorage.setItem('dnd_card_border', 'cb_default');
  } else {
    localStorage.setItem('dnd_card_border', id);
  }
  applyCardBorder(id || 'cb_default');
  renderRewardsPanel();
}

function applyCardBorder(id) {
  // Remove all cb- classes from body
  document.body.className = document.body.className
    .replace(/\bcb-[\w-]+\b/g, '').trim();
  var s = CARD_BORDER_SKINS.find(function(x) { return x.id === id; });
  if (s && s.cssClass) {
    document.body.classList.add(s.cssClass);
  }
}

// Init on load
(function() {
  setTimeout(function() {
    applyCardBorder(getActiveCardBorder());
  }, 180);
})();


// ── Extend renderRewardsPanel to include Card Border section ──
var _origRPcb = renderRewardsPanel;
renderRewardsPanel = function() {
  _origRPcb();
  var container = document.getElementById('achvRewardsPanel');
  if (!container) return;

  var eligibleBorders = _getEligibleCardBorders();
  var activeBorderId  = getActiveCardBorder();
  var _cbOpen = localStorage.getItem('rp_cb_open') !== 'false';

  var nonDef = eligibleBorders.filter(function(s) { return s.id !== 'cb_default'; });
  var cbContent = '';
  if (nonDef.length === 0) {
    cbContent = '<div class="rewards-empty">Earn 25 achievements or master a category to unlock card borders.</div>';
  } else {
    cbContent = '<div class="rewards-title-grid">';
    eligibleBorders.forEach(function(s) {
      var active = s.id === activeBorderId;
      cbContent += '<div class="rewards-title-chip' + (active ? ' active' : '') + '" '
        + 'onclick="setActiveCardBorder(\'' + s.id + '\')" title="' + s.desc + '">'
        + '<span>' + s.icon + '</span>'
        + '<span>' + s.label + '</span>'
        + (active ? '<span class="rewards-active-dot">●</span>' : '')
        + '</div>';
    });
    cbContent += '</div>';
    if (activeBorderId && activeBorderId !== 'cb_default') {
      cbContent += '<button class="rewards-clear-btn" onclick="setActiveCardBorder(\'cb_default\')">✕ Remove border</button>';
    }
  }

  container.innerHTML += _rpSection('cb', '🖼 Card & Panel Borders', nonDef.length + ' unlocked', cbContent, _cbOpen);
};

// ── Extend toggleRewardsSection ──
var _origTogcb = toggleRewardsSection;
toggleRewardsSection = function(section) {
  if (section !== 'cb') { _origTogcb(section); return; }
  var body = document.getElementById('rp_cb_body');
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  localStorage.setItem('rp_cb_open', isOpen ? 'false' : 'true');
  var hdr = body.previousElementSibling;
  if (hdr) { var arr = hdr.querySelector('span:last-child'); if (arr) arr.style.transform = 'rotate(' + (isOpen ? '180' : '0') + 'deg)'; }
};

// ── Also re-apply on updatePortraitRank ──
var _origUpdcb = updatePortraitRank;
updatePortraitRank = function() {
  _origUpdcb();
  applyCardBorder(getActiveCardBorder());
};

// ═══════════════════════════════════════════════════════════════
//  CARD BORDER: PRISMATIC skin (dúhová)
// ═══════════════════════════════════════════════════════════════
// Injected after CARD_BORDER_SKINS definition — push into array
(function() {
  var prismatic = {
    id:  'cb_prismatic',
    label: 'Prismatic',
    icon: '🌈',
    cssClass: 'cb-prismatic',
    desc: 'Reach Legend rank (130 achievements) — full rainbow prismatic border.',
    cond: { type: 'count', min: 130 },
  };
  // Insert before cb_myth (last item) so ordering stays logical
  var mythIdx = CARD_BORDER_SKINS.findIndex(function(s){ return s.id === 'cb_myth'; });
  if (mythIdx !== -1) {
    CARD_BORDER_SKINS.splice(mythIdx, 0, prismatic);
  } else {
    CARD_BORDER_SKINS.push(prismatic);
  }
})();


// Aura glow toggle je implementovaný v themes.js (_injectAuraGlowBtn, toggleAuraGlow)
